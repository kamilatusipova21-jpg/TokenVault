// pages/index.js
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import idl from '../idl.json';

// !!! ВСТАВЬТЕ СЮДА ВАШ PROGRAM ID !!!
const programID = new web3.PublicKey("ALuf64RcUJFPdsXdxi2p4rYoQBe13UX9RW27sfDWnDaa");

export default function Home() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [provider, setProvider] = useState();
    const [vaultPda, setVaultPda] = useState();
    const [vaultData, setVaultData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (wallet.publicKey && connection && wallet.signTransaction) {
            const provider = new AnchorProvider(
                connection, 
                wallet, 
                { 
                    preflightCommitment: "processed",
                    commitment: "processed"
                }
            );
            setProvider(provider);
        }
    }, [wallet.publicKey, connection, wallet.signTransaction]);

    const findVault = async () => {
         if (!wallet.publicKey) return;
         const [pda, bump] = web3.PublicKey.findProgramAddressSync(
            [wallet.publicKey.toBuffer()],
            programID
         );
         setVaultPda(pda);
    }

    useEffect(() => {
        findVault();
    }, [wallet.publicKey]);


    const createVault = async () => {
        if (!provider) {
            setError("Подключите кошелек");
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const program = new Program(idl, programID, provider);
            const fractionMint = web3.Keypair.generate();
            
            // Используем SPL Token для получения associated token account
            const { getAssociatedTokenAddress } = await import('@solana/spl-token');
            
            const fractionTreasury = await getAssociatedTokenAddress(
                fractionMint.publicKey,
                vaultPda,
                true // allowOwnerOffCurve
            );
            
            console.log("Creating vault with:", {
                vault: vaultPda.toString(),
                fractionMint: fractionMint.publicKey.toString(),
                fractionTreasury: fractionTreasury.toString(),
                authority: wallet.publicKey.toString(),
                programID: programID.toString()
            });
            
            const tx = await program.methods
                .createVault(new BN(100)) // Создаем 100 фракций для экономии газа
                .accounts({
                    vault: vaultPda,
                    fractionMint: fractionMint.publicKey,
                    fractionTreasury: fractionTreasury,
                    authority: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                    associatedTokenProgram: new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
                })
                .signers([fractionMint])
                .rpc();
                
            console.log("Transaction signature:", tx);
            setError("Хранилище успешно создано!");
            await fetchVaultData();
        } catch(e) { 
            console.error("Create vault error:", e);
            setError(`Ошибка создания хранилища: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    const buyFractions = async () => {
        if (!provider || !vaultPda || !vaultData) {
            setError("Сначала создайте или найдите хранилище");
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const program = new Program(idl, programID, provider);
            
            // Используем Anchor utils для получения associated token accounts
            const { getAssociatedTokenAddress } = await import('@solana/spl-token');
            
            const fractionTreasury = await getAssociatedTokenAddress(
                vaultData.fractionMint,
                vaultPda,
                true // allowOwnerOffCurve
            );
            
            const buyerFractionAccount = await getAssociatedTokenAddress(
                vaultData.fractionMint,
                wallet.publicKey
            );
            
            console.log("Buying fractions with accounts:", {
                vault: vaultPda.toString(),
                fractionTreasury: fractionTreasury.toString(),
                authority: vaultData.authority.toString(),
                buyer: wallet.publicKey.toString(),
                buyerFractionAccount: buyerFractionAccount.toString(),
                fractionMint: vaultData.fractionMint.toString()
            });
            
            const tx = await program.methods
                .buyFractions(new BN(1)) // Покупаем 1 фракцию для теста
                .accounts({
                    vault: vaultPda,
                    fractionTreasury: fractionTreasury,
                    authority: vaultData.authority,
                    buyer: wallet.publicKey,
                    buyerFractionAccount: buyerFractionAccount,
                    fractionMint: vaultData.fractionMint,
                    systemProgram: web3.SystemProgram.programId,
                    tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                    associatedTokenProgram: new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
                })
                .rpc();
                
            console.log("Buy fractions transaction:", tx);
            setError("Фракции успешно куплены! Проверьте кошелек.");
        } catch(e) { 
            console.error("Buy fractions error:", e);
            setError(`Ошибка покупки фракций: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    const fetchVaultData = async () => {
        if (!provider || !vaultPda) return;
        const program = new Program(idl, programID, provider);
        try {
            const data = await program.account.vault.fetch(vaultPda);
            setVaultData(data);
        } catch (e) { console.log("Хранилище еще не создано"); setVaultData(null); }
    }



    useEffect(() => {
        fetchVaultData();
    }, [vaultPda, provider]);


    return (
        <main className="bg-slate-900 min-h-screen text-white flex flex-col items-center p-10">
            <div className="absolute top-5 right-5">
                <WalletMultiButton />
            </div>
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Sol-Canvas</h1>
                <p className="text-xl text-gray-400">Токенизация искусства на Solana</p>
                {wallet.publicKey && (
                    <p className="text-sm text-green-400 mt-2">
                        Кошелек: {wallet.publicKey.toString().slice(0, 8)}...
                    </p>
                )}
            </div>

            <div className="mt-12 p-8 bg-white/10 rounded-xl border border-white/20 max-w-lg w-full">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" alt="Starry Night" className="rounded-lg mb-6 w-full"/>
                <h2 className="text-2xl font-bold">Звездная ночь, Ван Гог</h2>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                        <p className="text-red-200 text-sm">{error}</p>
                    </div>
                )}
                
                {!wallet.publicKey ? (
                    <div className="text-center mt-6">
                        <p className="mb-4">Подключите кошелек, чтобы начать</p>
                        <p className="text-sm text-gray-400">
                            Убедитесь, что ваш кошелек настроен на Devnet
                        </p>
                    </div>
                ) : wallet.connecting ? (
                    <p className="text-center mt-6">Подключение кошелька...</p>
                ) : vaultData ? (
                    <div className="mt-6">
                        <p className="text-green-400">Хранилище создано!</p>
                        <p className="text-sm text-gray-400">Mint фракций: {vaultData.fractionMint.toString()}</p>
                        <p className="text-sm text-gray-400">Всего фракций: {vaultData.totalFractions.toString()}</p>
                        <button 
                            onClick={buyFractions} 
                            disabled={loading}
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
                        >
                            {loading ? "Покупка..." : "🎨 Купить 1 фракцию (за 0.00001 SOL)"}
                        </button>
                        
                        <div className="mt-4 text-center">
                            <a 
                                href="/simple" 
                                className="text-blue-400 hover:text-blue-300 text-sm underline"
                            >
                                Перейти к демо-версии →
                            </a>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={createVault} 
                        disabled={loading}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
                    >
                        {loading ? "Создание..." : "Шаг 1: Создать Хранилище для Картины"}
                    </button>
                )}
            </div>
        </main>
    );
}