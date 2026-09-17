"use client";

import { useEffect, useMemo, useState } from "react";
import UsersTable from "./UsersTable";

const PAGE_SIZE = 5;

const FILTERS = [
  { value: "all", label: "הכול" },
  { value: "size", label: "טשטוש" },
  { value: "color", label: "ראיית צבע" },
  { value: "field", label: "שדה ראייה" },
  { value: "with-results", label: "יש תוצאות" },
  { value: "without-results", label: "ללא תוצאות" },
];

const resultCount = (user, key) =>
  Array.isArray(user?.[key]) ? user[key].length : 0;

function matchesFilter(user, filter) {
  const counts = {
    size: resultCount(user, "sizeWeaknesses"),
    color: resultCount(user, "colorWeaknesses"),
    field: resultCount(user, "fieldWeaknesses"),
  };

  if (filter === "with-results") {
    return Object.values(counts).some(Boolean);
  }

  if (filter === "without-results") {
    return Object.values(counts).every((count) => count === 0);
  }

  return filter === "all" || counts[filter] > 0;
}

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleUsersCount, setVisibleUsersCount] = useState(PAGE_SIZE);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("size");
  const [updatedUsers, setUpdatedUsers] = useState({});
  const [requestError, setRequestError] = useState("");
  const [pendingDeletion, setPendingDeletion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUsers = useMemo(
    () =>
      users
        .filter(Boolean)
        .map((user) => updatedUsers[user.email] ?? user),
    [updatedUsers, users],
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const matchingUsers = currentUsers.filter((user) => {
      if (!matchesFilter(user, activeFilter)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const username = String(user.username ?? "").toLocaleLowerCase();
      const email = String(user.email ?? "").toLocaleLowerCase();

      return (
        username.includes(normalizedQuery) ||
        email.includes(normalizedQuery)
      );
    });

    if (sortConfig.key) {
      matchingUsers.sort((firstUser, secondUser) =>
        compareUsers(
          firstUser,
          secondUser,
          sortConfig.key,
          sortConfig.direction,
        ),
      );
    }

    return matchingUsers;
  }, [activeFilter, currentUsers, searchQuery, sortConfig]);

  const summary = useMemo(
    () => [
      {
        label: "סה״כ משתמשים",
        value: currentUsers.length,
        accent: "border-amber-400",
      },
      {
        label: "עם תוצאות טשטוש",
        value: currentUsers.filter(
          (user) => resultCount(user, "sizeWeaknesses") > 0,
        ).length,
        accent: "border-amber-300",
      },
      {
        label: "עם תוצאות צבע",
        value: currentUsers.filter(
          (user) => resultCount(user, "colorWeaknesses") > 0,
        ).length,
        accent: "border-orange-400",
      },
      {
        label: "עם תוצאות שדה ראייה",
        value: currentUsers.filter(
          (user) => resultCount(user, "fieldWeaknesses") > 0,
        ).length,
        accent: "border-sky-500",
      },
    ],
    [currentUsers],
  );

  const usersToDisplay = filteredUsers.slice(0, visibleUsersCount);

  const requestSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setVisibleUsersCount(PAGE_SIZE);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setVisibleUsersCount(PAGE_SIZE);
    setExpandedUserId(null);
  };

  const deleteWeakness = async () => {
    if (!pendingDeletion) {
      return;
    }

    const { email, type, index } = pendingDeletion;
    setRequestError("");
    setIsDeleting(true);

    try {
      const response = await fetch("/api/deleteWeakness", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, field: type, index }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message);
      }

      if (payload.user) {
        setUpdatedUsers((current) => ({
          ...current,
          [email]: {
            ...(current[email] ??
              users.find((user) => user.email === email)),
            ...payload.user,
          },
        }));
      }

      setPendingDeletion(null);
    } catch {
      setRequestError("לא ניתן למחוק את התוצאה. נסו שוב.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExpand = (userId) => {
    setExpandedUserId((current) => {
      const nextUserId = current === userId ? null : userId;

      if (nextUserId) {
        setActiveTab("size");
      }

      return nextUserId;
    });
  };

  useEffect(() => {
    if (!pendingDeletion) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        setPendingDeletion(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDeleting, pendingDeletion]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-2 border-r-4 border-amber-400 pr-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-amber-400">
              ממשק ניהול
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ניהול משתמשים
            </h1>
          </div>
          <p className="text-sm text-slate-300">
            {currentUsers.length} משתמשים רשומים
          </p>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summary.map((item) => (
            <article
              key={item.label}
              className={`rounded-xl border border-slate-200 border-t-4 ${item.accent} bg-white p-4 shadow-sm`}
            >
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {item.label}
              </p>
            </article>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl shadow-black/10">
          <div className="border-b border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <label htmlFor="user-search" className="sr-only">
                  חיפוש לפי שם או אימייל
                </label>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  id="user-search"
                  type="search"
                  placeholder="חיפוש לפי שם או אימייל"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 motion-reduce:transition-none"
                />
              </div>

              <div
                className="flex gap-2 overflow-x-auto pb-1"
                aria-label="סינון משתמשים"
              >
                {FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => handleFilter(filter.value)}
                    aria-pressed={activeFilter === filter.value}
                    className={`shrink-0 rounded-full border px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                      activeFilter === filter.value
                        ? "border-amber-500 bg-amber-50 text-amber-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500" aria-live="polite">
              נמצאו {filteredUsers.length} משתמשים
            </p>
          </div>

          {requestError && (
            <p
              role="alert"
              className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-5"
            >
              {requestError}
            </p>
          )}

          <UsersTable
            usersToDisplay={usersToDisplay}
            requestSort={requestSort}
            sortConfig={sortConfig}
            expandedUserId={expandedUserId}
            activeTab={activeTab}
            handleExpand={handleExpand}
            setActiveTab={setActiveTab}
            requestDelete={setPendingDeletion}
          />

          {usersToDisplay.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="text-lg font-semibold text-slate-700">
                לא נמצאו משתמשים
              </p>
              <p className="mt-1 text-sm text-slate-500">
                אפשר לשנות את החיפוש או את הסינון.
              </p>
            </div>
          )}

          {visibleUsersCount < filteredUsers.length && (
            <div className="border-t border-slate-200 bg-white p-4 text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleUsersCount((count) => count + PAGE_SIZE)
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-amber-400 hover:text-amber-800 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                הצג עוד
              </button>
            </div>
          )}
        </div>
      </section>

      {pendingDeletion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setPendingDeletion(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
              </svg>
            </div>
            <h2
              id="delete-dialog-title"
              className="text-xl font-bold text-slate-900"
            >
              מחיקת תוצאה
            </h2>
            <p
              id="delete-dialog-description"
              className="mt-2 leading-7 text-slate-600"
            >
              למחוק את תוצאת {pendingDeletion.typeLabel} מספר{" "}
              {pendingDeletion.index + 1} של{" "}
              {pendingDeletion.username || pendingDeletion.email}? הפעולה אינה
              ניתנת לביטול.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeletion(null)}
                disabled={isDeleting}
                autoFocus
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={deleteWeakness}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
              >
                {isDeleting ? "מוחק..." : "מחיקת התוצאה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
