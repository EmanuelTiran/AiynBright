const TABLE_CONFIG = {
  color: [
    { key: "background_color", label: "צבע רקע" },
    { key: "font_color", label: "צבע גופן" },
  ],
  size: [
    { key: "fontSize", label: "גודל גופן" },
    { key: "eye", label: "עין" },
    { key: "distance", label: "מרחק" },
  ],
  field: [
    { key: "side", label: "צד" },
    { key: "distance", label: "מרחק" },
  ],
};

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function Weaknesses({
  id,
  labelledBy,
  type,
  typeLabel,
  weaknesses = [],
  email,
  username,
  requestDelete,
}) {
  const fields = TABLE_CONFIG[type] ?? [];

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy}>
      {weaknesses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M4 12h16M12 4v16" />
            </svg>
          </div>
          <p className="font-semibold text-slate-700">
            עדיין לא בוצעה בדיקה בתחום הזה
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-600">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  תוצאה
                </th>
                {fields.map((field) => (
                  <th
                    key={field.key}
                    className="whitespace-nowrap px-4 py-3 font-semibold"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  תאריך
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {weaknesses.map((weakness, index) => (
                <tr
                  key={weakness._id ?? index}
                  className="hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                    {typeLabel} {index + 1}
                  </td>
                  {fields.map((field) => (
                    <td
                      key={field.key}
                      className="whitespace-nowrap px-4 py-3 text-slate-600"
                    >
                      {weakness[field.key] ?? "—"}
                    </td>
                  ))}
                  <td
                    className="whitespace-nowrap px-4 py-3 text-slate-600"
                    dir="ltr"
                  >
                    {formatDate(weakness.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        requestDelete({
                          email,
                          username,
                          type,
                          typeLabel,
                          index,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
                      aria-label={`מחיקת תוצאת ${typeLabel} מספר ${index + 1}`}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                      >
                        <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
                      </svg>
                      מחיקה
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
