export const CHARACTERS = Array.from("1234567890אבגדהוזחטיכלמנסעפצקרשת");
export const INITIAL_SIZE = 14.6;
export const MINIMUM_SIZE = 2;

export function createRound() {
  const pool = [...CHARACTERS];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  const buttons = pool.slice(0, 4);
  return { character: buttons[Math.floor(Math.random() * 4)], buttons };
}

export function createTrial() {
  return { ...createRound(), size: INITIAL_SIZE, consecutiveCorrect: 0, consecutiveMistakes: 0, number: 1 };
}

// Preserve the existing adaptive rule: two matches reduce size by 1.5 mm;
// three consecutive misses or reaching 2 mm ends the test.
export function answerTrial(trial, answer) {
  const correct = answer === trial.character;
  const consecutiveCorrect = correct ? trial.consecutiveCorrect + 1 : 0;
  const consecutiveMistakes = correct ? 0 : trial.consecutiveMistakes + 1;
  const size = consecutiveCorrect >= 2
    ? Math.max(Number((trial.size - 1.5).toFixed(1)), MINIMUM_SIZE)
    : trial.size;
  return {
    trial: { ...trial, size, consecutiveCorrect: consecutiveCorrect >= 2 ? 0 : consecutiveCorrect, consecutiveMistakes, number: trial.number + 1 },
    finished: consecutiveMistakes >= 3 || size <= MINIMUM_SIZE,
  };
}

export function freshFlow() {
  return { version: 1, step: "instructions", eye: "right", trial: null, results: {}, saved: {} };
}

export function sameResult(a, b) {
  return a.eye === b.eye && Number(a.fontSize) === Number(b.fontSize) &&
    Number(a.distance) === Number(b.distance) && a.date === b.date;
}

export function restoreFlow(raw) {
  try {
    const flow = JSON.parse(raw);
    if (flow?.version !== 1 || !["instructions", "choose", "test", "result", "summary"].includes(flow.step) ||
      !["right", "left"].includes(flow.eye) || !flow.results || !flow.saved) return freshFlow();
    for (const [eye, result] of Object.entries(flow.results)) {
      if (!["right", "left"].includes(eye) || result.eye !== eye || !Number.isFinite(result.fontSize) ||
        result.fontSize < MINIMUM_SIZE || result.fontSize > INITIAL_SIZE || result.distance !== 1 ||
        typeof result.date !== "string" || !Number.isFinite(Date.parse(result.date))) return freshFlow();
    }
    if (flow.step === "test") {
      const trial = flow.trial;
      if (!trial || !CHARACTERS.includes(trial.character) || !Array.isArray(trial.buttons) ||
        trial.buttons.length !== 4 || new Set(trial.buttons).size !== 4 || !trial.buttons.includes(trial.character) ||
        trial.buttons.some((char) => !CHARACTERS.includes(char)) || !Number.isFinite(trial.size) ||
        trial.size <= MINIMUM_SIZE || trial.size > INITIAL_SIZE ||
        !Number.isInteger(trial.number) || trial.number < 1 ||
        ![0, 1].includes(trial.consecutiveCorrect) || ![0, 1, 2].includes(trial.consecutiveMistakes) ||
        flow.results[flow.eye]) return freshFlow();
    }
    if (flow.step === "result" && !flow.results[flow.eye]) return freshFlow();
    if (flow.step === "summary" && !Object.keys(flow.results).length) return freshFlow();
    return flow;
  } catch { return freshFlow(); }
}
