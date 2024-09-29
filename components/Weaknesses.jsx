import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Weaknesses({ type, weaknesses, email, deleteWeakness }) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const isPresent = () => weaknesses && weaknesses.length > 0;

    return (
        <div>
            <Button
                variant="contained"
                onClick={toggleVisibility}
                style={{
                    backgroundColor: '#1F2937',
                    color: isPresent() ? '#fed7aa' : 'red',
                    marginBottom: '0.5rem',
                    padding: '0.5rem 1rem',
                }}
            >
                {isPresent() ? (isVisible ? `Hide ${type} Weaknesses` : `Show ${type} Weaknesses`) : `No ${type} Weaknesses`}
            </Button>

            {isVisible && isPresent() && (
                <div>
                    {weaknesses.map((weakness, idx) => (
                        <Accordion key={idx}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${idx}-content`}
                                id={`panel${idx}-header`}
                            >
                                <div>{type.charAt(0).toUpperCase() + type.slice(1)} Weakness {idx + 1}</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                {type === 'color' && (
                                    <>
                                        <div><span className="font-semibold">Background:</span> {weakness.background_color}</div>
                                        <div><span className="font-semibold">Font:</span> {weakness.font_color}</div>
                                    </>
                                )}
                                {type === 'size' && (
                                    <>
                                        <div><span className="font-semibold">Font Size:</span> {weakness.fontSize}</div>
                                        <div><span className="font-semibold">Eye:</span> {weakness.eye}</div>
                                        <div><span className="font-semibold">Distance:</span> {weakness.distance}</div>
                                    </>
                                )}
                                {type === 'field' && (
                                    <>
                                        <div><span className="font-semibold">Side:</span> {weakness.side}</div>
                                        <div><span className="font-semibold">Distance:</span> {weakness.distance}</div>
                                    </>
                                )}
                                <div><span className="font-semibold">Date:</span> {new Date(weakness.date).toLocaleDateString()}</div>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteWeakness(email, type, idx)}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    Delete
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Weaknesses;
