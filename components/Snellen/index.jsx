import React from 'react';
import './SnellenChart.css';

const SnellenChart = () => {
    const chartData = [
        { line: "E", size: 14.6 }, // 200 / 12
        { line: "F P", size: 11 }, // 150 / 12
        { line: "T O Z", size: 8.8 }, // 120 / 12
        { line: "L P E D", size: 7.3 }, // 100 / 12
        { line: "P E C F D", size: 5.8 }, // 85 / 12
        { line: "E D F C Z P", size: 4.4 }, // 70 / 12
        { line: "F E L O P Z D", size: 3.66 }, // 60 / 12
        { line: "D E F P O T E C", size: 2.9 }, // 50 / 12
        { line: "L E F O D P C T", size: 2.2 }, // 40 / 12
        { line: "F D P L T C E O", size: 1.46 } // 30 / 12
    ];

    return (
        <div className="snellen-chart">
            <h1>לוח סנלן</h1>
            <div className="gg"></div>
            {chartData.map((data, index) => (
                <div key={index} className="chart-line" style={{ fontSize: `${data.size}mm` }}>
                    {data.line}
                </div>
            ))}
        </div>
    );
};

export default SnellenChart;