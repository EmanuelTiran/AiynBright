"use client";

import { useMemo, useState } from "react";
import UsersTable from "./UsersTable";

const PAGE_SIZE = 5;

function compareUsers(firstUser, secondUser, key, direction) {
  const firstValue = String(firstUser?.[key] ?? "");
  const secondValue = String(secondUser?.[key] ?? "");

  const comparison = firstValue.localeCompare(secondValue, undefined, {
    sensitivity: "base",
  });

  return direction === "ascending" ? comparison : -comparison;
}

export default function ArrUsers({ users = [] }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleUsersCount, setVisibleUsersCount] = useState(PAGE_SIZE);

  const [expandedSection, setExpandedSection] = useState({
    userId: null,
    type: null,
  });

  const [updatedUsers, setUpdatedUsers] = useState({});
  const [requestError, setRequestError] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    const currentUsers = users
      .filter(Boolean)
      .map((user) => updatedUsers[user.email] ?? user);

    if (sortConfig.key) {
      currentUsers.sort((firstUser, secondUser) =>
        compareUsers(
          firstUser,
          secondUser,
          sortConfig.key,
          sortConfig.direction,
        ),
      );
    }

    if (!normalizedQuery) {
      return currentUsers;
    }

    return currentUsers.filter((user) => {
      const username = String(
        user.username ?? "",
      ).toLocaleLowerCase();

      const email = String(
        user.email ?? "",
      ).toLocaleLowerCase();

      return (
        username.includes(normalizedQuery) ||
        email.includes(normalizedQuery)
      );
    });
  }, [searchQuery, sortConfig, updatedUsers, users]);

  const usersToDisplay = filteredUsers.slice(
    0,
    visibleUsersCount,
  );

  const requestSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key &&
        current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setVisibleUsersCount(PAGE_SIZE);
  };

  const deleteWeakness = async (email, type, index) => {
    setRequestError("");

    try {
      const response = await fetch("/api/deleteWeakness", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          field: type,
          index,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message || "Failed to delete the result.",
        );
      }

      if (payload.user) {
        setUpdatedUsers((current) => ({
          ...current,
          [email]: payload.user,
        }));
      }
    } catch (error) {
      setRequestError(
        error.message || "Failed to delete the result.",
      );
    }
  };

  const handleExpand = (userId, type, isExpanded) => {
    setExpandedSection(
      isExpanded
        ? { userId, type }
        : { userId: null, type: null },
    );
  };

  return (
    <section className="container mx-auto w-auto border-2 border-orange-200 p-4">
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>

      <input
        id="user-search"
        type="search"
        placeholder="Search by username or email"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 w-full rounded border border-gray-300 p-2"
      />

      {requestError && (
        <p
          role="alert"
          className="mb-4 rounded bg-red-50 p-3 text-red-700"
        >
          {requestError}
        </p>
      )}

      <UsersTable
        usersToDisplay={usersToDisplay}
        requestSort={requestSort}
        expandedSection={expandedSection}
        handleExpand={handleExpand}
        deleteWeakness={deleteWeakness}
      />

      {visibleUsersCount < filteredUsers.length && (
        <button
          type="button"
          onClick={() =>
            setVisibleUsersCount(
              (count) => count + PAGE_SIZE,
            )
          }
          className="mt-4 rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Show More
        </button>
      )}
    </section>
  );
}