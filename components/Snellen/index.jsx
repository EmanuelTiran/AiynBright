import React from 'react';
import './SnellenChart.css';

const SnellenChart = () => {
    const chartData = [
        { line: "E", size: 16.67 }, // 200 / 12
        { line: "F P", size: 12.5 }, // 150 / 12
        { line: "T O Z", size: 10 }, // 120 / 12
        { line: "L P E D", size: 8.33 }, // 100 / 12
        { line: "P E C F D", size: 7.08 }, // 85 / 12
        { line: "E D F C Z P", size: 5.83 }, // 70 / 12
        { line: "F E L O P Z D", size: 5 }, // 60 / 12
        { line: "D E F P O T E C", size: 4.17 }, // 50 / 12
        { line: "L E F O D P C T", size: 3.33 }, // 40 / 12
        { line: "F D P L T C E O", size: 2.5 } // 30 / 12
    ];

    return (
        <div className="snellen-chart">
            <h1>לוח סנלן</h1>
            {chartData.map((data, index) => (
                <div key={index} className="chart-line" style={{ fontSize: `${data.size}px` }}>
                    {data.line}
                </div>
            ))}
        </div>
    );
};

export default SnellenChart;