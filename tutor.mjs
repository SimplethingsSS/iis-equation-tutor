export const practice = {
  equation: '3x + 5 = 20',
  coefficient: 3,
  isolated: 15,
  solution: 5,
  hints: [
    ['Do the same thing to both sides. What operation undoes adding 5?',
      'Subtract 5 from both sides: 3x + 5 − 5 = 20 − 5. Simplify both sides.'],
    ['What operation undoes multiplying x by 3?',
      'Divide both sides by 3: 3x ÷ 3 = 15 ÷ 3. Simplify both sides.'],
  ],
};

export const transfer = { equation: '4x + 3 = 19', solution: 4 };

function normalise(input) {
  return input.trim().toLowerCase().replaceAll('−', '-').replaceAll('×', '*')
    .replaceAll(/\s*([=*])\s*/g, '$1')
    .replaceAll(/(?<=\d)\s+(?=x)/g, '');
}

function readNumber(input) {
  if (/^[+-]?\d+(?:\.\d+)?$/.test(input)) return Number(input);
  return null;
}

function readXTerm(input) {
  const match = /^([+-]?)(\d*(?:\.\d+)?)\*?x$/.exec(input);
  if (!match || input.includes('*') && !match[2]) return null;
  return (match[1] === '-' ? -1 : 1) * (match[2] ? Number(match[2]) : 1);
}

function readEquation(input) {
  const parts = normalise(input).split('=');
  if (parts.length !== 2) return null;
  const [left, right] = parts;
  const leftTerm = readXTerm(left);
  const rightTerm = readXTerm(right);
  const leftNumber = readNumber(left);
  const rightNumber = readNumber(right);
  if (leftTerm !== null && rightNumber !== null) return [leftTerm, rightNumber];
  if (rightTerm !== null && leftNumber !== null) return [rightTerm, leftNumber];
  return null;
}

export function checkPractice(input, step) {
  const result = readEquation(input);
  const { coefficient } = practice;
  const [expectedCoefficient, expectedValue] = step === 0 ? [coefficient, practice.isolated] : [1, practice.solution];
  if (result?.[0] === expectedCoefficient && result[1] === expectedValue) return 'correct';
  if (step === 0 && result?.[0] === 1 && result[1] === practice.solution) return 'later-step';
  if (step === 0 && result?.[0] === coefficient) return 'balance';
  if (step === 1 && result?.[0] === 1) return 'division';
  if (!result) return 'format';
  return 'retry';
}

export function checkTransfer(input) {
  const compact = normalise(input);
  const value = readNumber(compact);
  const equation = readEquation(compact);
  if (value !== null) return value === transfer.solution ? 'correct' : 'retry';
  if (equation?.[0] === 1) return equation[1] === transfer.solution ? 'correct' : 'retry';
  return 'format';
}
