import React from "react";
import Weaknesses from "./Weaknesses";

const CATEGORIES = [
  {
    type: "size",
    label: "טשטוש",
    dataKey: "sizeWeaknesses",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    type: "color",
    label: "ראיית צבע",
    dataKey: "colorWeaknesses",
    badge: "border-orange-200 bg-orange-50 text-orange-800",
  },
  {
    type: "field",
    label: "שדה ראייה",
    dataKey: "fieldWeaknesses",
    badge: "border-sky-200 bg-sky-50 text-sky-800",
  },
];

function getCount(user, dataKey) {
  return Array.isArray(user?.[dataKey]) ? user[dataKey].length : 0;
}

function CountBadge({ count, className }) {
  return (
    <span
      className={`inline-flex min-w-[5.5rem] justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {count === 0 ? "ללא תוצאות" : `${count} תוצאות`}
    </span>
  );
}

function SortLabel({ label, field, sortConfig, requestSort }) {
  const isActive = sortConfig.key === field;
  const directionLabel =
    isActive && sortConfig.direction === "ascending"
      ? "ממוין בסדר עולה"
      : isActive
        ? "ממוין בסדר יורד"
        : "לא ממוין";

  return (
    <button
      type="button"
      onClick={() => requestSort(field)}
      className="inline-flex items-center gap-1 rounded px-1 py-1 font-semibold outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-amber-500"
      aria-label={`${label}, ${directionLabel}`}
    >
      {label}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={`h-3.5 w-3.5 transition motion-reduce:transition-none ${
          isActive && sortConfig.direction === "descending" ? "rotate-180" : ""
        } ${isActive ? "text-amber-600" : "text-slate-400"}`}
      >
        <path d="m8 4 4 5H4l4-5Z" />
      </svg>
    </button>
  );
}

function DetailsButton({ expanded, onClick, controlsId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controlsId}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-amber-400 hover:text-amber-800 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      {expanded ? "סגירה" : "פרטים"}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
          expanded ? "rotate-180" : ""
        }`}
      >
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </button>
  );
}

function UserDetails({
  user,
  activeTab,
  setActiveTab,
  requestDelete,
  expanded,
  surface,
}) {
  const panelId = `user-details-${surface}-${user.id ?? encodeURIComponent(user.email)}`;
  const activeCategory =
    CATEGORIES.find((category) => category.type === activeTab) ?? CATEGORIES[0];
  const weaknesses = user[activeCategory.dataKey] ?? [];

  return (
    <div
      id={panelId}
      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
        expanded
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-5 sm:px-6">
          <div
            className="mb-5 flex gap-2 overflow-x-auto"
            role="tablist"
            aria-label={`תוצאות עבור ${user.username || user.email}`}
          >
            {CATEGORIES.map((category) => {
              const count = getCount(user, category.dataKey);
              const selected = activeTab === category.type;
              const tabId = `${panelId}-${category.type}-tab`;
              const tabPanelId = `${panelId}-${category.type}-panel`;

              return (
                <button
                  key={category.type}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={tabPanelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(category.type)}
                  className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                    selected
                      ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {category.label} ({count})
                </button>
              );
            })}
          </div>

          {expanded && (
            <Weaknesses
              id={`${panelId}-${activeCategory.type}-panel`}
              labelledBy={`${panelId}-${activeCategory.type}-tab`}
              type={activeCategory.type}
              typeLabel={activeCategory.label}
              weaknesses={weaknesses}
              email={user.email}
              username={user.username}
              requestDelete={requestDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersTable({
  usersToDisplay,
  requestSort,
  sortConfig,
  expandedUserId,
  activeTab,
  handleExpand,
  setActiveTab,
  requestDelete,
}) {
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full table-fixed bg-white text-right">
          <thead className="border-b border-slate-200 bg-slate-100 text-sm text-slate-600">
            <tr>
              <th className="w-[24%] px-5 py-3">
                <SortLabel
                  label="משתמש"
                  field="username"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                />
              </th>
              <th className="w-[25%] px-5 py-3">
                <SortLabel
                  label="אימייל"
                  field="email"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                />
              </th>
              {CATEGORIES.map((category) => (
                <th
                  key={category.type}
                  className="w-[13%] px-3 py-3 font-semibold"
                >
                  {category.label}
                </th>
              ))}
              <th className="w-[12%] px-5 py-3 font-semibold">פרטים</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {usersToDisplay.map((user) => {
              const userId = user.id ?? user.email;
              const expanded = expandedUserId === userId;
              const panelId = `user-details-desktop-${user.id ?? encodeURIComponent(user.email)}`;

              return (
                <React.Fragment key={userId}>
                  <tr
                    className={`transition-colors motion-reduce:transition-none ${
                      expanded
                        ? "bg-amber-50/60"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="truncate font-semibold text-slate-900">
                        {user.username || "ללא שם"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm text-slate-500 outline-none hover:text-sky-700 hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        {user.email}
                      </a>
                    </td>
                    {CATEGORIES.map((category) => (
                      <td key={category.type} className="px-3 py-3.5">
                        <CountBadge
                          count={getCount(user, category.dataKey)}
                          className={category.badge}
                        />
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <DetailsButton
                        expanded={expanded}
                        onClick={() => handleExpand(userId)}
                        controlsId={panelId}
                      />
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td colSpan={6} className="p-0">
                      <UserDetails
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        requestDelete={requestDelete}
                        expanded={expanded}
                        surface="desktop"
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-200 bg-white md:hidden">
        {usersToDisplay.map((user) => {
          const userId = user.id ?? user.email;
          const expanded = expandedUserId === userId;
          const panelId = `user-details-mobile-${user.id ?? encodeURIComponent(user.email)}`;

          return (
            <article
              key={userId}
              className={expanded ? "bg-amber-50/40" : "bg-white"}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-slate-900">
                      {user.username || "ללא שם"}
                    </h2>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block truncate text-sm text-slate-500 hover:text-sky-700 hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>
                  <DetailsButton
                    expanded={expanded}
                    onClick={() => handleExpand(userId)}
                    controlsId={panelId}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.type} className="min-w-0">
                      <p className="mb-1 text-xs font-medium text-slate-500">
                        {category.label}
                      </p>
                      <CountBadge
                        count={getCount(user, category.dataKey)}
                        className={`${category.badge} w-full min-w-0`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <UserDetails
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                requestDelete={requestDelete}
                expanded={expanded}
                surface="mobile"
              />
            </article>
          );
        })}
      </div>
    </>
  );
}
