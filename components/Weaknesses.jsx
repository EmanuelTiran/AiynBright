import React from 'react';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Weaknesses({ type, weaknesses, email, deleteWeakness, expanded, onChange }) {
    const isPresent = () => weaknesses && weaknesses.length > 0;

    const handleAccordionChange = (event, isExpanded) => {
        onChange && onChange(isExpanded);
    };

    return (
        <Accordion
            className="shadow-md rounded-lg w-full"
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
            expanded={expanded}
            onChange={handleAccordionChange}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="bg-gray-100"
            >
                <Button
                    variant="contained"
                    style={{
                        backgroundColor: '#1F2937',
                        color: isPresent() ? '#fed7aa' : 'red',
                        marginBottom: '0.5rem',
                        padding: '0.5rem 1rem',
                        textTransform: 'none',
                    }}
                    disabled={!isPresent()}
                >
                    {isPresent()
                        ? `${type.charAt(0).toUpperCase() + type.slice(1)} Weaknesses`
                        : `No ${type} Weaknesses`}
                </Button>
            </AccordionSummary>
            <AccordionDetails>
                {isPresent() && (
                    <div
                        className="overflow-x-auto overflow-y-auto max-h-64 
                        [&::-webkit-scrollbar]:w-2 
                        [&::-webkit-scrollbar]:h-2
                        [&::-webkit-scrollbar-thumb]:bg-orange-400 
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100"
                    >
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Weakness
                                    </th>
                                    {type === 'color' && (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Background
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Font
                                            </th>
                                        </>
                                    )}
                                    {type === 'size' && (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Font Size
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Eye
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Distance
                                            </th>
                                        </>
                                    )}
                                    {type === 'field' && (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Side
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Distance
                                            </th>
                                        </>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {weaknesses.map((weakness, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {type.charAt(0).toUpperCase() + type.slice(1)} Weakness {idx + 1}
                                        </td>
                                        {type === 'color' && (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.background_color}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.font_color}</td>
                                            </>
                                        )}
                                        {type === 'size' && (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.fontSize}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.eye}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.distance}</td>
                                            </>
                                        )}
                                        {type === 'field' && (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.side}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{weakness.distance}</td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(weakness.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => deleteWeakness(email, type, idx)}
                                                size="small"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AccordionDetails>
        </Accordion>
    );
}

export default Weaknesses;