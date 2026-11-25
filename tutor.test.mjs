import assert from 'node:assert/strict';
import test from 'node:test';
import { checkPractice, checkTransfer } from './tutor.mjs';

test('accepts common spellings and either side of a valid isolation step', () => {
  for (const input of ['3x = 15', ' 3 X = 15.0 ', '15 = 3 × x']) {
    assert.equal(checkPractice(input, 0), 'correct', input);
  }
});

test('preserves the requested step and identifies common errors', () => {
  assert.equal(checkPractice('x = 5', 0), 'later-step');
  assert.equal(checkPractice('3x = 20', 0), 'balance');
  assert.equal(checkPractice('x = 15', 1), 'division');
  assert.equal(checkPractice('5 = x', 1), 'correct');
});

test('rejects malformed notation and keeps the displayed step unchanged', () => {
  for (const input of ['3x = 1 5', '3x = 15 = 2', '3x+5=20', '2+3', '']) {
    assert.equal(checkPractice(input, 0), 'format', input);
  }
});

test('checks the unassisted item separately', () => {
  assert.equal(checkTransfer('4'), 'correct');
  assert.equal(checkTransfer('4 = x'), 'correct');
  assert.equal(checkTransfer('x = 5'), 'retry');
  assert.equal(checkTransfer('4x = 16'), 'format');
});
