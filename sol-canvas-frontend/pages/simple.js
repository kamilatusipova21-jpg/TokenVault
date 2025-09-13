// pages/simple.js - Упрощенная версия для демо
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Simple() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (wallet.publicKey && connection) {
            connection.getBalance(wallet.publicKey).then(balance => {
                setBalance(balance / LAMPORTS_PER_SOL);
            });
        }
    }, [wallet.publicKey, connection]);

    const simulatePurchase = async () => {
        if (!wallet.publicKey) {
            setMessage("Подключите кошелек");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Реальная транзакция - отправляем минимальную сумму самому себе
            const transaction = new (await import('@solana/web3.js')).Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: wallet.publicKey,
                    lamports: 1, // 1 lamport = минимальная сумма
                })
            );

            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            
            setMessage(`✅ Фракция NFT успешно куплена! 
                       Транзакция: ${signature.slice(0, 8)}...
                       Вы теперь владеете 0.1% произведения искусства!`);
            
            // Обновляем баланс
            const newBalance = await connection.getBalance(wallet.publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
            
        } catch (error) {
            console.error('Transaction error:', error);
            setMessage(`❌ Ошибка транзакции: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white flex flex-col items-center p-10">
            <div className="absolute top-5 right-5">
                <WalletMultiButton />
            </div>
            
            <div className="text-center mb-12">
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Sol-Canvas
                </h1>
                <p className="text-2xl text-gray-300">Токенизация искусства на Solana</p>
                {wallet.publicKey && (
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                        <p className="text-sm text-green-400">
                            Кошелек: {wallet.publicKey.toString().slice(0, 8)}...
                        </p>
                        <p className="text-sm text-blue-400">
                            Баланс: {balance.toFixed(4)} SOL
                        </p>
                    </div>
                )}
            </div>

            <div className="max-w-2xl w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <div className="relative overflow-hidden rounded-xl mb-6">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" 
                            alt="Starry Night" 
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                            <h2 className="text-3xl font-bold">Звездная ночь</h2>
                            <p className="text-lg text-gray-300">Винсент ван Гог, 1889</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">$84M</div>
                            <div className="text-sm text-gray-400">Оценочная стоимость</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">1,000</div>
                            <div className="text-sm text-gray-400">Всего фракций</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">$84K</div>
                            <div className="text-sm text-gray-400">Цена за фракцию</div>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            message.includes('✅') 
                                ? 'bg-green-500/20 border border-green-500 text-green-200' 
                                : 'bg-red-500/20 border border-red-500 text-red-200'
                        }`}>
                            <p>{message}</p>
                        </div>
                    )}

                    {!wallet.publicKey ? (
                        <div className="text-center">
                            <p className="mb-4 text-lg">Подключите кошелек для покупки фракций</p>
                            <p className="text-sm text-gray-400">
                                Убедитесь, что ваш кошелек настроен на Devnet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <div className="font-semibold">Покупка 1 фракции</div>
                                    <div className="text-sm text-gray-400">0.00001 SOL (~$0.002)</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold">1/1000</div>
                                    <div className="text-sm text-gray-400">доля владения</div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={simulatePurchase}
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Покупка фракции...
                                    </div>
                                ) : (
                                    "🎨 Купить фракцию NFT"
                                )}
                            </button>

                            <div className="text-center text-sm text-gray-400">
                                <p>После покупки вы станете совладельцем произведения искусства</p>
                                <p>Фракции можно продавать и обменивать на маркетплейсе</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white/5 rounded-xl">
                        <div className="text-3xl mb-2">🔒</div>
                        <h3 className="font-semibold mb-2">Безопасность</h3>
                        <p className="text-sm text-gray-400">Смарт-контракты на Solana обеспечивают прозрачность и безопасность</p>
                    </div>
                    <div className="text-center p-6 bg-white/5 rounded-xl">
                        <div className="text-3xl mb-2">⚡</div>
                        <h3 className="font-semibold mb-2">Быстрые транзакции</h3>
                        <p className="text-sm text-gray-400">Мгновенные переводы с минимальными комиссиями</p>
                    </div>
                    <div className="text-center p-6 bg-white/5 rounded-xl">
                        <div className="text-3xl mb-2">🌍</div>
                        <h3 className="font-semibold mb-2">Глобальный доступ</h3>
                        <p className="text-sm text-gray-400">Инвестируйте в искусство из любой точки мира</p>
                    </div>
                </div>
            </div>
        </main>
    );
}