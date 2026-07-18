import { defaultPlaygroundExample } from "../data/default-example";
import type { PlaygroundTemplate } from "./playground-template";

export const playgroundTemplates = [
  {
    id: "starter",
    name: "Starter",
    description: "A small button interaction for a clear first experiment.",
    ...defaultPlaygroundExample,
  },
  {
    id: "interactive-card",
    name: "Interactive Card",
    description: "A semantic card with hover, focus, and a compact status change.",
    html: `<main class="card-shell">
  <article class="status-card" aria-labelledby="card-title">
    <p class="status-card__eyebrow">Experiment</p>
    <h1 id="card-title">A focused interaction</h1>
    <p id="card-status">Ready when you are.</p>
    <button id="card-button" type="button">Change status</button>
  </article>
</main>`,
    css: `:root { color: #172033; font-family: system-ui, sans-serif; }
body { align-items: center; background: #f5f7fb; display: grid; margin: 0; min-height: 100vh; padding: 1.5rem; }
.card-shell { inline-size: min(100%, 34rem); }
.status-card { background: #fff; border: 1px solid #d7deeb; border-radius: 1rem; box-shadow: 0 10px 26px rgb(31 47 78 / 10%); padding: 1.5rem; transition: border-color 160ms ease, transform 160ms ease; }
.status-card:hover { border-color: #8ca8e8; transform: translateY(-2px); }
.status-card:focus-within { outline: 3px solid #a9c2f4; outline-offset: 4px; }
.status-card__eyebrow { color: #3f63b5; font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
button { background: #3f63b5; border: 1px solid #3f63b5; border-radius: .625rem; color: #fff; cursor: pointer; font: inherit; font-weight: 700; padding: .75rem 1rem; }
button:focus-visible { outline: 3px solid #a9c2f4; outline-offset: 3px; }`,
    javascript: `const button = document.querySelector("#card-button");
const status = document.querySelector("#card-status");

button?.addEventListener("click", () => {
  if (status) status.textContent = "Status updated with a small, local interaction.";
});`,
  },
  {
    id: "form-feedback",
    name: "Form Feedback",
    description: "A local form response with no network request or sensitive data collection.",
    html: `<main class="form-shell">
  <form class="feedback-form">
    <p class="feedback-form__eyebrow">Local example</p>
    <h1>Form feedback</h1>
    <label for="feedback-topic">Topic</label>
    <input id="feedback-topic" name="topic" required type="text" value="A small experiment">
    <button id="feedback-button" type="button">Show feedback</button>
    <p aria-live="polite" id="feedback-message"></p>
  </form>
</main>`,
    css: `:root { color: #172033; font-family: system-ui, sans-serif; }
body { align-items: center; background: #f5f7fb; display: grid; margin: 0; min-height: 100vh; padding: 1.5rem; }
.form-shell { inline-size: min(100%, 34rem); }
.feedback-form { background: #fff; border: 1px solid #d7deeb; border-radius: 1rem; box-shadow: 0 10px 26px rgb(31 47 78 / 10%); display: grid; gap: 1rem; padding: 1.5rem; }
.feedback-form__eyebrow { color: #3f63b5; font-size: .75rem; font-weight: 700; letter-spacing: .08em; margin: 0; text-transform: uppercase; }
input, button { border-radius: .625rem; font: inherit; padding: .75rem; }
input { border: 1px solid #a9b7d1; }
input:focus-visible, button:focus-visible { outline: 3px solid #a9c2f4; outline-offset: 3px; }
button { background: #3f63b5; border: 1px solid #3f63b5; color: #fff; cursor: pointer; font-weight: 700; }
#feedback-message { color: #1f6b4f; font-weight: 600; margin: 0; }`,
    javascript: `const button = document.querySelector("#feedback-button");
const topic = document.querySelector("#feedback-topic");
const message = document.querySelector("#feedback-message");

button?.addEventListener("click", () => {
  const value = typeof topic?.value === "string" ? topic.value.trim() : "";
  if (message) {
    message.textContent = value === ""
      ? "Thanks — this feedback stays inside the preview."
      : \`Thanks — “\${value}” stays inside the preview.\`;
  }
});`,
  },
] as const satisfies readonly PlaygroundTemplate[];
