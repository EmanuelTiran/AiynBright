import React from 'react';
import Link from 'next/link';
import Weaknesses from './Weaknesses';

const UsersTable = ({
    usersToDisplay,
    requestSort,
    expandedSection,
    handleExpand,
    deleteWeakness
}) => {
    return (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
                <tr>
                    <th
                        onClick={() => requestSort('username')}
                        className="cursor-pointer p-4 text-left text-center"
                    >
                        Username
                    </th>
                    <th
                        onClick={() => requestSort('email')}
                        className="cursor-pointer p-4 text-left text-center"
                    >
                        Email
                    </th>
                </tr>
            </thead>
            <tbody>
                {usersToDisplay.map((user, index) => (
                    <React.Fragment key={index}>
                        <tr className="border-t even:bg-gray-50 hover:bg-gray-100 text-center">
                            <td className="p-4">{user.username}</td>
                            <td className="p-4">
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {user.email}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="p-4">
                                <div className="flex gap-4 justify-center">
                                    <Weaknesses
                                        type="color"
                                        weaknesses={user.colorWeaknesses}
                                        email={user.email}
                                        deleteWeakness={deleteWeakness}
                                        expanded={expandedSection.userId === user.email && expandedSection.type === 'color'}
                                        onChange={(isExpanded) => handleExpand(user.email, 'color', isExpanded)}
                                    />
                                    <Weaknesses
                                        type="size"
                                        weaknesses={user.sizeWeaknesses}
                                        email={user.email}
                                        deleteWeakness={deleteWeakness}
                                        expanded={expandedSection.userId === user.email && expandedSection.type === 'size'}
                                        onChange={(isExpanded) => handleExpand(user.email, 'size', isExpanded)}
                                    />
                                    <Weaknesses
                                        type="field"
                                        weaknesses={user.fieldWeaknesses}
                                        email={user.email}
                                        deleteWeakness={deleteWeakness}
                                        expanded={expandedSection.userId === user.email && expandedSection.type === 'field'}
                                        onChange={(isExpanded) => handleExpand(user.email, 'field', isExpanded)}
                                    />
                                </div>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;