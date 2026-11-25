# Equation Tutor

README prose word count: 463

## Project status

This browser prototype gives secondary school learners one guided linear equation and one independent check. It checks typed steps, offers two hints per practice step, provides correction feedback and distinguishes first scored success from success after a retry. Prepared hint text simulates the tutoring response. The app has no live model, general algebra parser, learner profile or persistent storage. All inputs stay in the browser session.

## Run locally

Python 3 and a modern browser are enough. From the repository root, run the command below, then open [the local app](http://localhost:8000). No package installation or API key is needed.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

This is a static project. HTML and CSS define the interface. The JavaScript module `app.mjs` handles interaction and session state. The module `tutor.mjs` holds the two prepared equations, hint text and answer checks.

## Replay the examples

1. Enter `3x = 15`, then `x = 5` without opening hints. The exercise advances after each accepted step.
2. On a fresh run, enter `3x = 20`. Read the feedback, reveal each hint in turn, then correct the entry to `3x = 15` and finish with `x = 5`.
3. After practice, choose **Try the independent check** and enter `4`. On another run, enter `5` before correcting it to `4` to inspect the retry feedback.

## Development record

- The A1 literature review compared direct answers, fixed hints and assistance responsive to learner understanding. This prototype focuses on learner requested escalation and a separate unaided item. The underlying learning question is reserved for evaluation.
- The guided interaction uses a conceptual question followed by an unsimplified worked operation. Browser checks replayed both a direct success and a wrong answer followed by hints and correction. Hints clear when a new step begins.
- Input normalisation originally stripped all spaces. That could interpret split digits as a valid number. The revised checker accepts spacing around operators without joining digits. Unit and browser checks cover this case, reversed sides and final answers entered too early.
- The independent screen hides the hint controls and distinguishes first scored attempts from numerical retries. A format error prompts correction without counting as a scored attempt. Browser checks also covered restart and layout at a narrow viewport width.

## Checks and files

Run the four checker tests with Node.js 20 or newer.

```sh
node --test tutor.test.mjs
```

The [browser verification record](browser-checks.txt) lists the automated scenarios. The screenshots numbered 01–06 show example inputs. The [architecture diagram](system-architecture.png) describes the interaction loop. No participants were recruited. No accompanying ZIP is needed when the repository is available.

## AI assistance

OpenAI Codex helped structure the prototype, draft and revise code, prepare the architecture and report, and run the checks. Its first input checker joined spaced digits. The revised checker was tested with both valid notation and the malformed example. The browser walkthrough checked that both hints were revealed only on request, that the practice step stayed unchanged after an error, and that the independent item exposed no hint control. The math in the example equations and the displayed substitutions was checked directly.
