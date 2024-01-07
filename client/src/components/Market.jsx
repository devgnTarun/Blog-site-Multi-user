import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockSlider = () => {
    const [stockData, setStockData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiKey = 'cmd5tvhr01qjutgt3v2gcmd5tvhr01qjutgt3v30';
        const symbols = [
            'AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA',
            'BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD', 'ADA/USD',
            'EUR/USD', 'GBP/USD', 'JPY/USD', 'AUD/USD', 'CAD/USD',
        ];

        const fetchData = async () => {
            try {
                const promises = symbols.map(async (symbol) => {
                    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                    console.log(response)
                    return response.data;
                });

                const stockDataList = await Promise.all(promises);
                setStockData(stockDataList);
            } catch (error) {
                setError('Error fetching stock data');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex space-x-4 overflow-x-scroll">
                {stockData.map((stock, index) => (
                    <div key={index} className="flex flex-col items-center">

                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockSlider;
