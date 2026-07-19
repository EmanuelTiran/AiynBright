"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";

const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "lightblue",
];

const CHARACTERS = [
  "9",
  "5",
  "7",
  "1",
  "8",
  "2",
  "4",
  "6",
  "0",
  "A",
  "S",
  "D",
  "F",
  "E",
  "V",
  "G",
  "I",
  "M",
  "N",
  "B",
  "Z",
  "W",
];

function getNextColor(
  currentColor,
  excludedColor,
) {
  const currentIndex =
    COLORS.indexOf(currentColor);

  for (
    let offset = 1;
    offset <= COLORS.length;
    offset += 1
  ) {
    const nextColor =
      COLORS[
        (currentIndex +
          offset +
          COLORS.length) %
          COLORS.length
      ];

    if (nextColor !== excludedColor) {
      return nextColor;
    }
  }

  return currentColor;
}

export default function ColorChanger({
  user,
  colorsUser,
}) {
  const [fontColor, setFontColor] = useState(
    colorsUser?.font_color ?? "orange",
  );

  const [
    backgroundColor,
    setBackgroundColor,
  ] = useState(
    colorsUser?.background_color ?? "darkblue",
  );

  const [
    currentCharacterIndex,
    setCurrentCharacterIndex,
  ] = useState(0);

  const [
    colorWeaknesses,
    setColorWeaknesses,
  ] = useState(() =>
    Array.isArray(user?.colorWeaknesses)
      ? user.colorWeaknesses
      : [],
  );

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  useEffect(() => {
    const nextPathname =
      `/color/${backgroundColor}_${fontColor}`;

    if (
      window.location.pathname !== nextPathname
    ) {
      window.history.replaceState(
        {},
        "",
        nextPathname,
      );
    }
  }, [backgroundColor, fontColor]);

  const changeCharacter = () => {
    setCurrentCharacterIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        CHARACTERS.length,
    );
  };

  const handleMistake = async () => {
    const result = {
      background_color: backgroundColor,
      font_color: fontColor,
    };

    const updatedWeaknesses = [
      ...colorWeaknesses,
      result,
    ];

    setIsSaving(true);
    setSaveError("");

    try {
      const response = await fetch(
        "/api/updateUser",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            updateData: {
              colorWeaknesses:
                updatedWeaknesses,
            },
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Failed to save the result.",
        );
      }

      setColorWeaknesses(
        updatedWeaknesses,
      );

      changeCharacter();
    } catch (error) {
      setSaveError(
        error.message ||
          "Failed to save the result.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fontTileStyle = {
    backgroundImage:
      `linear-gradient(45deg, ${fontColor} 25%, transparent 25%, transparent 75%, ${fontColor} 75%, ${fontColor}), ` +
      `linear-gradient(45deg, ${fontColor} 25%, transparent 25%, transparent 75%, ${fontColor} 75%, ${fontColor})`,
  };

  const backgroundTileStyle = {
    backgroundImage:
      `linear-gradient(45deg, ${backgroundColor} 25%, transparent 25%, transparent 75%, ${backgroundColor} 75%, ${backgroundColor}), ` +
      `linear-gradient(45deg, ${backgroundColor} 25%, transparent 25%, transparent 75%, ${backgroundColor} 75%, ${backgroundColor})`,
  };

  return (
    <section
      className={`w-2/3 p-4 ${styles.contain}`}
    >
      <div className={styles.inContain}>
        <div
          className={styles.rekaBackground}
          style={backgroundTileStyle}
        >
          <div
            className={styles.font}
            style={fontTileStyle}
          >
            {
              CHARACTERS[
                currentCharacterIndex
              ]
            }
          </div>
        </div>

        <div className="mb-4 mt-4 flex flex-wrap gap-4">
          <button
            type="button"
            className="flex-1 rounded bg-slate-800 px-4 py-2 font-bold text-orange-400 hover:bg-slate-700"
            onClick={() =>
              setBackgroundColor(
                (current) =>
                  getNextColor(
                    current,
                    fontColor,
                  ),
              )
            }
          >
            Change Background Color
          </button>

          <button
            type="button"
            className="flex-1 rounded bg-slate-800 px-4 py-2 font-bold text-orange-400 hover:bg-slate-700"
            onClick={() =>
              setFontColor((current) =>
                getNextColor(
                  current,
                  backgroundColor,
                ),
              )
            }
          >
            Change Font Color
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-4">
          <button
            type="button"
            className="flex-1 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            onClick={changeCharacter}
          >
            Change Character
          </button>

          <button
            type="button"
            className="flex-1 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleMistake}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving…"
              : "Mistake"}
          </button>
        </div>

        {saveError && (
          <p
            role="alert"
            className="text-red-700"
          >
            {saveError}
          </p>
        )}
      </div>
    </section>
  );
}