"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Popup from "../Popup";
import style from "./style.module.css";
import ScreenCalibration, { useCalibration } from "../ScreenCalibration";
import { mmToPx } from "@/lib/calibration.mjs";

const WORDS = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
  "kiwi",
  "lemon",
  "mango",
  "nectarine",
  "orange",
  "papaya",
  "quince",
  "raspberry",
  "strawberry",
  "tangerine",
  "ugli fruit",
  "vanilla",
  "watermelon",
];

const FONT_SIZES = [
  14.6,
  11,
  8.8,
  7.3,
  5.8,
  4.4,
  3.66,
  2.9,
  2.2,
  1.46,
];

function findInitialSizeIndex(fontSize) {
  const numericSize = Number(fontSize);
  const exactIndex = FONT_SIZES.indexOf(numericSize);

  return exactIndex >= 0 ? exactIndex : 0;
}

export default function Blur(props) {
  return <ScreenCalibration><CalibratedBlur {...props} /></ScreenCalibration>;
}

function CalibratedBlur({ user, sizeUser }) {
  const calibration = useCalibration();
  const [currentWordIndex, setCurrentWordIndex] =
    useState(0);

  const [currentSizeIndex, setCurrentSizeIndex] =
    useState(() =>
      findInitialSizeIndex(sizeUser?.fontSize),
    );

  const [fontSize, setFontSize] = useState(() => {
    const initialSize = Number(sizeUser?.fontSize);

    return Number.isFinite(initialSize)
      ? initialSize
      : FONT_SIZES[0];
  });

  const [isLeftEye, setIsLeftEye] = useState(
    sizeUser?.eye === "left",
  );

  const [sizeWeaknesses, setSizeWeaknesses] =
    useState(() =>
      Array.isArray(user?.sizeWeaknesses)
        ? user.sizeWeaknesses
        : [],
    );

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const eye = isLeftEye ? "left" : "right";
    const nextPathname =
      `/blur/improve/${fontSize}_1_${eye}`;

    if (window.location.pathname !== nextPathname) {
      window.history.replaceState(
        {},
        "",
        nextPathname,
      );
    }
  }, [fontSize, isLeftEye]);

  const increaseFontSize = () => {
    const nextIndex = Math.max(
      0,
      currentSizeIndex - 1,
    );

    setCurrentSizeIndex(nextIndex);
    setFontSize(FONT_SIZES[nextIndex]);
  };

  const decreaseFontSize = () => {
    const nextIndex = Math.min(
      FONT_SIZES.length - 1,
      currentSizeIndex + 1,
    );

    setCurrentSizeIndex(nextIndex);
    setFontSize(FONT_SIZES[nextIndex]);
  };

  const changeFontSize = (event) => {
    const nextSize = Number(event.target.value);

    if (!Number.isFinite(nextSize)) {
      return;
    }

    setFontSize(nextSize);

    const exactIndex = FONT_SIZES.indexOf(nextSize);

    if (exactIndex >= 0) {
      setCurrentSizeIndex(exactIndex);
    }
  };

  const changeWord = () => {
    setCurrentWordIndex(
      (currentIndex) =>
        (currentIndex + 1) % WORDS.length,
    );
  };

  const handleMistake = async () => {
    const result = {
      fontSize,
      distance: 1,
      eye: isLeftEye ? "left" : "right",
    };

    const updatedWeaknesses = [
      ...sizeWeaknesses,
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updateData: {
              sizeWeaknesses: updatedWeaknesses,
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

      setSizeWeaknesses(updatedWeaknesses);
      changeWord();
    } catch (error) {
      setSaveError(
        error.message ||
          "Failed to save the result.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      className={`${style.contain} border-b border-green-400 p-4`}
    >
      <Popup type="blur" training />

      <p className={style.inContain}>
        Font size: {fontSize}mm
      </p>

      <p
        style={{ fontSize: mmToPx(fontSize, calibration) }}
        className={`${style.inContain} transition-all duration-300 ease-in-out`}
      >
        {WORDS[currentWordIndex]}
      </p>

      <label
        htmlFor="font-size"
        className="sr-only"
      >
        Font size in millimeters
      </label>

      <input
        id="font-size"
        type="number"
        value={fontSize}
        onChange={changeFontSize}
        className="mb-4 w-44 rounded border border-gray-300 p-1 px-2 text-center"
        min="1"
        max="25"
        step="0.1"
      />

      <div className="mb-4 flex flex-wrap gap-4">
        <button
          type="button"
          className="flex-1 rounded bg-slate-800 px-4 py-2 font-bold text-yellow-400 hover:bg-slate-700"
          onClick={increaseFontSize}
        >
          Increase Font Size
        </button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1e293b",
            "&:hover": {
              backgroundColor: "#334155",
            },
            color: "#facc15",
            fontWeight: "bold",
            py: 1,
            px: 2,
            flex: 1,
            borderRadius: 0,
            borderLeft: isLeftEye
              ? "8px solid #facc15"
              : "none",
            borderRight: !isLeftEye
              ? "8px solid #facc15"
              : "none",
          }}
          onClick={() =>
            setIsLeftEye((current) => !current)
          }
        >
          Choose an Eye
        </Button>

        <button
          type="button"
          className="flex-1 rounded bg-slate-800 px-4 py-2 font-bold text-yellow-400 hover:bg-slate-700"
          onClick={decreaseFontSize}
        >
          Decrease Font Size
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <button
          type="button"
          className="flex-1 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={changeWord}
        >
          Change Word
        </button>

        <button
          type="button"
          className="flex-1 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleMistake}
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : "Mistake"}
        </button>
      </div>

      {saveError && (
        <p role="alert" className="text-red-700">
          {saveError}
        </p>
      )}
    </section>
  );
}
