import { practice, transfer, checkPractice, checkTransfer } from './tutor.mjs';

const element = (id) => document.getElementById(id);
const title = element('activity-title');
const activityDetail = element('activity-detail');
const stepTitle = element('step-title');
const stepTag = element('step-tag');
const equation = element('equation');
const instruction = element('instruction');
const form = element('answer-form');
const answer = element('answer');
const answerLabel = element('answer-label');
const checkButton = element('check-button');
const formatNote = element('format-note');
const feedback = element('feedback');
const nextButton = element('next-button');
const hintButton = element('hint-button');
const hints = element('hints');
const support = document.querySelector('.support');
const supportDescription = element('support-description');

let step = 0;
let activity = 'practice';
let practiceComplete = false;
let hintsShown = 0;
let transferAttempts = 0;

const feedbackMessages = {
  format: 'Enter a simplified equation with one x term and one number, such as 2x = 8.',
  'later-step': 'That is the final solution. For this step, keep the x term and isolate it first.',
  balance: 'Check that you used the same operation on both sides of the equation.',
  division: 'Check the division on the right-hand side.',
  retry: 'Check the requested step and try again.',
};

function showFeedback(message, status) {
  feedback.dataset.status = status;
  feedback.textContent = message;
}

function resetHints() {
  hintsShown = 0;
  hints.replaceChildren();
  hintButton.disabled = false;
  hintButton.textContent = 'Show a hint';
}

hintButton.addEventListener('click', () => {
  const message = practice.hints[step][hintsShown];
  if (!message || practiceComplete || activity !== 'practice') return;
  const hint = document.createElement('p');
  const label = document.createElement('strong');
  label.textContent = hintsShown === 0 ? 'Think about the operation' : 'Set up the step';
  hint.append(label, document.createTextNode(message));
  hints.append(hint);
  hintsShown += 1;
  const canShowMore = hintsShown < practice.hints[step].length;
  hintButton.textContent = canShowMore ? 'Show a more specific hint' : 'Both hints shown';
  hintButton.disabled = !canShowMore;
  if (!canShowMore) answer.focus();
});

function checkPracticeStep() {
  const result = checkPractice(answer.value, step);
  if (result !== 'correct') {
    showFeedback(feedbackMessages[result], 'retry');
    answer.focus();
    return;
  }

  if (step === 0) {
    step = 1;
    equation.textContent = '3x = 15';
    stepTitle.textContent = 'Step 2 of 2';
    instruction.textContent = 'Find the value of x.';
    answerLabel.textContent = 'Your next equation';
    answer.value = '';
    resetHints();
    showFeedback('Step 1 correct. Now isolate x.', 'success');
    answer.focus();
    return;
  }

  practiceComplete = true;
  equation.textContent = 'x = 5';
  stepTitle.textContent = 'Practice complete';
  instruction.textContent = 'Check: 3 × 5 + 5 = 20.';
  form.hidden = true;
  hintButton.hidden = true;
  supportDescription.textContent = 'The equation is balanced.';
  showFeedback('Correct. You solved the practice equation.', 'success');
  nextButton.hidden = false;
  nextButton.focus();
}

function startTransfer() {
  activity = 'transfer';
  title.textContent = 'Try a new equation';
  activityDetail.textContent = 'Solve the whole equation on your own and enter the value of x.';
  element('practice-tab').removeAttribute('aria-current');
  element('transfer-tab').setAttribute('aria-current', 'step');
  stepTitle.textContent = 'Independent check';
  stepTag.textContent = 'New equation';
  equation.textContent = transfer.equation;
  instruction.textContent = 'Find the value of x.';
  answerLabel.textContent = 'Your value for x';
  answer.placeholder = 'Enter a value for x';
  formatNote.textContent = 'Enter a number or an equation in the form x = …';
  checkButton.textContent = 'Check answer';
  answer.value = '';
  form.hidden = false;
  support.hidden = true;
  nextButton.hidden = true;
  feedback.textContent = '';
  title.focus();
}

function checkIndependentAnswer() {
  const result = checkTransfer(answer.value);
  if (result === 'format') {
    showFeedback('Enter a number or a simplified equation in the form x = …', 'retry');
    answer.focus();
    return;
  }

  transferAttempts += 1;
  if (result !== 'correct') {
    showFeedback('That value does not make the equation true. Try another value.', 'retry');
    answer.focus();
    return;
  }

  title.textContent = 'Independent check complete';
  activityDetail.textContent = 'You solved a new equation without hints.';
  stepTitle.textContent = 'Independent check';
  instruction.textContent = 'Check: 4 × 4 + 3 = 19.';
  form.hidden = true;
  const resultMessage = transferAttempts === 1 ? 'Correct on your first attempt.' : 'Correct after retrying.';
  showFeedback(resultMessage, 'success');
  nextButton.textContent = 'Start again';
  nextButton.hidden = false;
  nextButton.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (activity === 'practice') checkPracticeStep();
  else checkIndependentAnswer();
});
nextButton.addEventListener('click', () => {
  if (activity === 'practice') startTransfer();
  else window.location.reload();
});
