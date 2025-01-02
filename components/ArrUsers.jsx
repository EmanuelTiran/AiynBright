"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Weaknesses from './Weaknesses';

function ArrUsers({ users }) {
    const [sortedUsers, setSortedUsers] = useState(users);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleUsersCount, setVisibleUsersCount] = useState(5);
    const [expandedSection, setExpandedSection] = useState({ userId: null, type: null });

    useEffect(() => {
        let sortedArray = [...users];
        if (sortConfig.key !== null) {
            sortedArray.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        setSortedUsers(sortedArray);
    }, [users, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleShowMore = () => {
        setVisibleUsersCount(prevCount => prevCount + 5);
    };

    const filteredUsers = sortedUsers.filter(user =>
        user &&
        ((user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const usersToDisplay = filteredUsers.slice(0, visibleUsersCount);

    const deleteWeakness = async (email, type, index) => {
        try {
            const response = await fetch('/api/deleteWeakness', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, field: type, index })
            });

            if (response.ok) {
                const data = await response.json();
                const updatedUser = data.user;
                if (updatedUser) {
                    setSortedUsers(prevUsers =>
                        prevUsers.map(u => (u.email === email ? updatedUser : u))
                    );
                }
                alert('Weakness deleted and updated');
            } else {
                const errorData = await response.json();
                console.error('Failed to delete weakness:', errorData.error);
            }
        } catch (error) {
            console.error('Failed to delete weakness:', error);
        }
    };

    const handleExpand = (userId, type, isExpanded) => {
        setExpandedSection(isExpanded ? { userId, type } : { userId: null, type: null });
    };

    return (
        <div className="container mx-auto p-4 w-auto border-2 border-orange-200">
            <input
                type="text"
                placeholder="Search by username or email"
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th onClick={() => requestSort('username')} className="cursor-pointer p-4 text-left text-center">Username</th>
                        <th onClick={() => requestSort('email')} className="cursor-pointer p-4 text-left text-center">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {usersToDisplay.map((user, index) => (
                        <React.Fragment key={index}>
                            <tr className="border-t even:bg-gray-50 hover:bg-gray-100 text-center">
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">
                                    <Link href={`mailto:${user.email}`}>{user.email}</Link>
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
            {visibleUsersCount < filteredUsers.length && (
                <button
                    onClick={handleShowMore}
                    className="mt-4 px-4 py-2 bg-orange-200 text-white rounded"
                >
                    Show More
                </button>
            )}
        </div>
    );
}

export default ArrUsers;