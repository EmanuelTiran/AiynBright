"use client";

import {
  useEffect,
  useState,
} from "react";

import { Button } from "@mui/material";
import EyeExaminationPrompt from "./EyeExaminationPrompt";
import ProgressBar from "./ProgressBar";
import ResultTestBlur from "./ResultTestBlur";
import ScreenCalibration, { useCalibration } from "./ScreenCalibration";
import { mmToPx } from "@/lib/calibration.mjs";

const CHARACTERS = Array.from(
  "1234567890אבגדהוזחטיכלמנסעפצקרשת",
);

const INITIAL_SIZE = 14.6;
const MINIMUM_SIZE = 2;
const INITIAL_CHARACTER = CHARACTERS[0];
const INITIAL_BUTTONS =
  CHARACTERS.slice(0, 4);

function getRandomCharacter() {
  return CHARACTERS[
    Math.floor(
      Math.random() * CHARACTERS.length,
    )
  ];
}

function shuffle(values) {
  const shuffledValues = [...values];

  for (
    let index =
      shuffledValues.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    );

    [
      shuffledValues[index],
      shuffledValues[randomIndex],
    ] = [
      shuffledValues[randomIndex],
      shuffledValues[index],
    ];
  }

  return shuffledValues;
}

function createRound() {
  const character =
    getRandomCharacter();

  const alternatives =
    CHARACTERS.filter(
      (value) => value !== character,
    );

  const selectedAlternatives = [];

  while (
    selectedAlternatives.length < 3
  ) {
    const randomIndex = Math.floor(
      Math.random() *
        alternatives.length,
    );

    selectedAlternatives.push(
      alternatives.splice(
        randomIndex,
        1,
      )[0],
    );
  }

  return {
    character,
    buttons: shuffle([
      character,
      ...selectedAlternatives,
    ]),
  };
}

export default function RandomCharacterGame(props) {
  return <ScreenCalibration><CalibratedCharacterGame {...props} /></ScreenCalibration>;
}

function CalibratedCharacterGame({
  user,
}) {
  const calibration = useCalibration();
  const [round, setRound] = useState({
    character: INITIAL_CHARACTER,
    buttons: INITIAL_BUTTONS,
  });

  const [size, setSize] =
    useState(INITIAL_SIZE);

  const [
    clickedIndex,
    setClickedIndex,
  ] = useState(null);

  const [isCorrect, setIsCorrect] =
    useState(null);

  const [
    consecutiveCorrect,
    setConsecutiveCorrect,
  ] = useState(0);

  const [
    consecutiveMistakes,
    setConsecutiveMistakes,
  ] = useState(0);

  const [isLeftEye, setIsLeftEye] =
    useState(false);

  const [
    sizeWeaknesses,
    setSizeWeaknesses,
  ] = useState(() =>
    Array.isArray(user?.sizeWeaknesses)
      ? user.sizeWeaknesses
      : [],
  );

  const [
    pendingResult,
    setPendingResult,
  ] = useState(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const testFinished = consecutiveMistakes >= 3 || size <= MINIMUM_SIZE;

  useEffect(() => {
    if (clickedIndex === null || testFinished) return;
    const timer = window.setTimeout(() => {
      setRound(createRound());
      setClickedIndex(null);
      setIsCorrect(null);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [clickedIndex, testFinished]);

  const beginNextRound = () => {
    setRound(createRound());
    setClickedIndex(null);
    setIsCorrect(null);
  };

  const saveResult = async (result) => {
    const updatedWeaknesses = [
      ...sizeWeaknesses,
      result,
    ];

    setPendingResult(result);
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
              sizeWeaknesses:
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

      setSizeWeaknesses(
        updatedWeaknesses,
      );

      setPendingResult(null);
    } catch (error) {
      setSaveError(
        error.message ||
          "Failed to save the result.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleButtonClick = (
    clickedCharacter,
    index,
  ) => {
    if (clickedIndex !== null) {
      return;
    }

    const correct =
      clickedCharacter === round.character;

    setIsCorrect(correct);
    setClickedIndex(index);

    if (correct) {
      const nextCorrectCount =
        consecutiveCorrect + 1;

      setConsecutiveMistakes(0);

      if (nextCorrectCount >= 2) {
        const nextSize = Math.max(
          Number(
            (size - 1.5).toFixed(1),
          ),
          MINIMUM_SIZE,
        );

        setConsecutiveCorrect(0);
        setSize(nextSize);

        if (
          nextSize <= MINIMUM_SIZE
        ) {
          return;
        }
      } else {
        setConsecutiveCorrect(
          nextCorrectCount,
        );
      }
    } else {
      const nextMistakeCount =
        consecutiveMistakes + 1;

      setConsecutiveCorrect(0);
      setConsecutiveMistakes(
        nextMistakeCount,
      );

      if (nextMistakeCount >= 3) {
        void saveResult({
          fontSize: size,
          distance: 1,
          eye: isLeftEye
            ? "left"
            : "right",
        });

        return;
      }
    }

  };

  const continueAfterResult = () => {
    if (!isLeftEye) {
      setIsLeftEye(true);
      setSize(INITIAL_SIZE);
      setConsecutiveCorrect(0);
      setConsecutiveMistakes(0);
      setSaveError("");
      setPendingResult(null);
      beginNextRound();
      return;
    }

    window.location.assign(
      `/blur/improve/${size}_1_right`,
    );
  };

  return (
    <section className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-100 p-4">
      <EyeExaminationPrompt
        isLeftEye={isLeftEye}
      />

      <ProgressBar size={size} />

      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md"
        style={{
          fontSize: mmToPx(size, calibration),
        }}
        aria-live="polite"
      >
        {round.character}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {!testFinished ? (
          round.buttons.map(
            (character, index) => (
              <Button
                key={character}
                onClick={() =>
                  handleButtonClick(
                    character,
                    index,
                  )
                }
                variant="outlined"
                sx={{
                  border:
                    "2px solid #facc15",
                  color: "black",
                  fontSize: mmToPx(INITIAL_SIZE, calibration),
                  padding: "10px 20px",
                  width: "100px",
                  height: "100px",
                }}
                disabled={
                  clickedIndex !== null
                }
                className={
                  clickedIndex === index
                    ? isCorrect
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                    : "bg-white hover:bg-gray-200"
                }
              >
                {character}
              </Button>
            ),
          )
        ) : (
          <ResultTestBlur
            size={size}
            isLeftEye={isLeftEye}
            isSaving={isSaving}
            saveError={saveError}
            canRetry={Boolean(
              pendingResult,
            )}
            onRetry={() =>
              pendingResult &&
              void saveResult(
                pendingResult,
              )
            }
            onContinue={
              continueAfterResult
            }
          />
        )}
      </div>
    </section>
  );
}
