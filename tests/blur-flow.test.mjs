import assert from "node:assert/strict";
import { test } from "node:test";
import { answerTrial, CHARACTERS, createRound, createTrial, freshFlow, restoreFlow, sameResult } from "../lib/blur-flow.mjs";

test("rounds contain four distinct supported answers including the stimulus", () => {
  for (let index = 0; index < 100; index += 1) {
    const round = createRound();
    assert.equal(new Set(round.buttons).size, 4);
    assert.ok(round.buttons.includes(round.character));
    assert.ok(round.buttons.every((answer) => CHARACTERS.includes(answer)));
  }
});

test("two consecutive matches reduce size by 1.5 mm and a miss resets the streak", () => {
  let { trial, finished } = answerTrial(createTrial(), null);
  assert.equal(trial.size, 14.6);
  assert.equal(finished, false);
  trial = answerTrial(trial, trial.character).trial;
  assert.equal(trial.consecutiveMistakes, 0);
  assert.equal(trial.size, 14.6);
  trial = answerTrial(trial, trial.character).trial;
  assert.equal(trial.size, 13.1);
  assert.equal(trial.consecutiveCorrect, 0);
  trial = answerTrial(trial, trial.character).trial;
  trial = answerTrial(trial, null).trial;
  assert.equal(trial.consecutiveCorrect, 0);
  trial = answerTrial(trial, trial.character).trial;
  assert.equal(trial.size, 13.1);
});

test("three consecutive misses, including Not sure, finish at the current size", () => {
  let trial = createTrial();
  for (let index = 0; index < 3; index += 1) {
    const next = answerTrial(trial, null);
    assert.equal(next.finished, index === 2);
    trial = next.trial;
  }
  assert.equal(trial.size, 14.6);
});

test("the minimum-size completion path produces the same finish signal as misses", () => {
  let trial = createTrial();
  let count = 0;
  let finished = false;
  while (!finished && count < 30) {
    ({ trial, finished } = answerTrial(trial, trial.character));
    count += 1;
  }
  assert.equal(finished, true);
  assert.equal(trial.size, 2);
  assert.equal(count, 18);
});

test("refresh retains the exact eye, stimulus, adaptive counts and first-eye result", () => {
  const flow = freshFlow();
  flow.eye = "left";
  flow.step = "test";
  flow.trial = answerTrial(createTrial(), null).trial;
  flow.results.right = { eye: "right", fontSize: 10.1, distance: 1, date: "2026-09-15T10:00:00.000Z" };
  flow.saved.right = true;
  assert.deepEqual(restoreFlow(JSON.stringify(flow)), flow);
});

test("invalid or stale draft shapes safely return to preparation", () => {
  for (const raw of [null, "oops", "null", "[]", '{}', JSON.stringify({ ...freshFlow(), version: 2 }),
    JSON.stringify({ ...freshFlow(), step: "test", trial: createTrial(), eye: "both" }),
    JSON.stringify({ ...freshFlow(), step: "result" }),
    JSON.stringify({ ...freshFlow(), step: "test", trial: { ...createTrial(), buttons: ["1", "1", "1", "1"] } })]) {
    assert.deepEqual(restoreFlow(raw), freshFlow());
  }
});

test("save reconciliation distinguishes historical repeats from the same pending result", () => {
  const result = { eye: "left", fontSize: 2, distance: 1, date: "2026-09-15T10:00:00.000Z" };
  assert.equal(sameResult(result, { ...result, _id: "saved-id" }), true);
  assert.equal(sameResult(result, { ...result, eye: "right" }), false);
  assert.equal(sameResult(result, { ...result, date: "2026-09-14T10:00:00.000Z" }), false);
  const flow = { ...freshFlow(), step: "result", eye: "left", results: { left: result }, saved: { left: false } };
  assert.deepEqual(restoreFlow(JSON.stringify(flow)), flow);
});
