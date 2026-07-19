"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Popup from "../Popup";

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
  "X",
  "V",
  "G",
  "I",
  "M",
  "N",
  "B",
  "Z",
  "W",
];

const DISTANCES = Array.from(
  { length: 25 },
  (_, index) => -24 + index * 2,
);

function getInitialDistanceIndex(distance) {
  const numericDistance = Number(distance);

  if (!Number.isFinite(numericDistance)) {
    return Math.floor(DISTANCES.length / 2);
  }

  return DISTANCES.reduce(
    (
      closestIndex,
      currentDistance,
      index,
    ) => {
      const closestDifference = Math.abs(
        DISTANCES[closestIndex] -
          numericDistance,
      );

      const currentDifference = Math.abs(
        currentDistance - numericDistance,
      );

      return currentDifference <
        closestDifference
        ? index
        : closestIndex;
    },
    0,
  );
}

export default function Field({
  user,
  distanceUser,
}) {
  const [open, setOpen] = useState(false);

  const [isLeft, setIsLeft] = useState(
    distanceUser?.side === "left",
  );

  const [
    currentDistanceIndex,
    setCurrentDistanceIndex,
  ] = useState(() =>
    getInitialDistanceIndex(
      distanceUser?.distance,
    ),
  );

  const [
    currentCharacterIndex,
    setCurrentCharacterIndex,
  ] = useState(0);

  const [
    fieldWeaknesses,
    setFieldWeaknesses,
  ] = useState(() =>
    Array.isArray(user?.fieldWeaknesses)
      ? user.fieldWeaknesses
      : [],
  );

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const distance =
    DISTANCES[currentDistanceIndex];

  useEffect(() => {
    const side = isLeft ? "left" : "right";
    const nextPathname =
      `/field/${side}_${distance}`;

    if (
      window.location.pathname !== nextPathname
    ) {
      window.history.replaceState(
        {},
        "",
        nextPathname,
      );
    }
  }, [distance, isLeft]);

  const changeCharacter = () => {
    setCurrentCharacterIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        CHARACTERS.length,
    );
  };

  const handleMistake = async () => {
    const result = {
      side: isLeft ? "left" : "right",
      distance,
    };

    const updatedWeaknesses = [
      ...fieldWeaknesses,
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
              fieldWeaknesses:
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

      setFieldWeaknesses(
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

  return (
    <section
      className="mx-auto flex h-[84vh] w-full flex-col items-center justify-center border-2 border-b border-purple-400 border-[#bfdbfe] bg-[aliceblue] p-4"
      style={{
        borderLeft: isLeft
          ? "32px solid #bfdbfe"
          : "none",
        borderRight: !isLeft
          ? "32px solid #bfdbfe"
          : "none",
        transition: "border 0.3s ease",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#bfdbfe",
          color: "#1f2937",
          fontWeight: "bold",
          padding: "8px 16px",
          borderRadius: "0.375rem",
          "&:hover": {
            backgroundColor: "#93c5fd",
          },
        }}
        onClick={() =>
          setOpen((current) => !current)
        }
      >
        Please read the details before use
      </Button>

      <div
        className="w-full"
        style={{
          transform:
            `translateX(${distance}cm)`,
          transition:
            "transform 0.3s ease-in-out",
        }}
      >
        <p className="flex h-[42vh] w-[96vw] flex-row items-center justify-center text-7xl">
          {
            CHARACTERS[
              currentCharacterIndex
            ]
          }
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1e293b",
            "&:hover": {
              backgroundColor: "#334155",
            },
            color: "#bfdbfe",
            fontWeight: "bold",
            py: 1,
            px: 2,
            clipPath:
              "polygon(20% 0, 100% 0, 80% 50%, 100% 100%, 20% 100%, 0 50%)",
            borderRadius: 0,
            flex: 1,
          }}
          onClick={() =>
            setCurrentDistanceIndex(
              (index) =>
                Math.max(0, index - 1),
            )
          }
        >
          Left
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1e293b",
            "&:hover": {
              backgroundColor: "#334155",
            },
            color: "#bfdbfe",
            fontWeight: "bold",
            py: 1,
            px: 2,
            flex: 1,
            borderRadius: 0,
            borderLeft: isLeft
              ? "8px solid #bfdbfe"
              : "none",
            borderRight: !isLeft
              ? "8px solid #bfdbfe"
              : "none",
          }}
          onClick={() =>
            setIsLeft(
              (current) => !current,
            )
          }
        >
          Choose a Side
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1e293b",
            "&:hover": {
              backgroundColor: "#334155",
            },
            color: "#bfdbfe",
            fontWeight: "bold",
            py: 1,
            px: 2,
            clipPath:
              "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%, 20% 50%)",
            borderRadius: 0,
            flex: 1,
          }}
          onClick={() =>
            setCurrentDistanceIndex(
              (index) =>
                Math.min(
                  DISTANCES.length - 1,
                  index + 1,
                ),
            )
          }
        >
          Right
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#48bb78",
            "&:hover": {
              backgroundColor: "#2f855a",
            },
            color: "white",
            fontWeight: "bold",
            py: 1,
            px: 2,
            borderRadius: "8px",
            flex: 1,
          }}
          onClick={changeCharacter}
        >
          Change Character
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f56565",
            "&:hover": {
              backgroundColor: "#c53030",
            },
            color: "white",
            fontWeight: "bold",
            py: 1,
            px: 2,
            borderRadius: "8px",
            flex: 1,
          }}
          onClick={handleMistake}
          disabled={isSaving}
        >
          {isSaving
            ? "Saving…"
            : "Mistake"}
        </Button>
      </div>

      {saveError && (
        <p
          role="alert"
          className="text-red-700"
        >
          {saveError}
        </p>
      )}

      <Popup
        open={open}
        setOpen={setOpen}
        type="field"
      />
    </section>
  );
}