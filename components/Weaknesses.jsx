import React, { useState } from 'react';

function Weaknesses({ type, weaknesses, email, deleteWeakness }) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <button
                onClick={toggleVisibility}
                className="mb-2 px-4 py-2 bg-gray-800 text-orange-200 rounded"
            >
                {isVisible ? `Hide ${type} Weaknesses` : `Show ${type} Weaknesses`}
            </button>

            {isVisible && (
                <div>
                    {weaknesses.map((weakness, idx) => (
                        <div key={idx} className="mb-2 text-sm text-gray-700">
                            {type === 'color' && (
                                <>
                                    <div><span className="font-semibold">Background:</span> {weakness.background_color}</div>
                                    <div><span className="font-semibold">Font:</span> {weakness.font_color}</div>
                                </>
                            ) }
                            {type === 'size' && (
                                <>
                                    <div><span className="font-semibold">Font Size:</span> {weakness.fontSize}</div>
                                    <div><span className="font-semibold">Distance:</span> {weakness.distance}</div>
                                </>
                            )}
                            {type === 'field' && (
                                <>
                                    <div><span className="font-semibold">side:</span> {weakness.side}</div>
                                    <div><span className="font-semibold">Distance:</span> {weakness.distance}</div>
                                </>
                            )}
                            <div><span className="font-semibold">Date:</span> {new Date(weakness.date).toLocaleDateString()}</div>
                            <button
                                type="button"
                                onClick={() => deleteWeakness(email, type, idx)}
                                className="text-red-600"
                            >
                                delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Weaknesses;
