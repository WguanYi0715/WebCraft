import type { PlaygroundSource } from "../types";

export const defaultPlaygroundExample = {
  html: `<main class="example-card">
  <p class="example-card__eyebrow">Playground example</p>
  <h1>Small experiments, clear feedback.</h1>
  <p id="example-message">Press the button to update this message.</p>
  <button id="example-button" type="button">Update message</button>
</main>`,
  css: `:root {
  color: #172033;
  font-family: system-ui, sans-serif;
}

body {
  align-items: center;
  background: #f5f7fb;
  display: grid;
  margin: 0;
  min-height: 100vh;
  padding: 1.5rem;
}

.example-card {
  background: #ffffff;
  border: 1px solid #d7deeb;
  border-radius: 1rem;
  box-shadow: 0 10px 26px rgb(31 47 78 / 10%);
  max-width: 32rem;
  padding: 1.5rem;
}

.example-card__eyebrow {
  color: #3f63b5;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

button {
  background: #3f63b5;
  border: 1px solid #3f63b5;
  border-radius: 0.625rem;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 0.75rem 1rem;
}

button:focus-visible {
  outline: 3px solid #a9c2f4;
  outline-offset: 3px;
}`,
  javascript: `const button = document.querySelector("#example-button");
const message = document.querySelector("#example-message");

button?.addEventListener("click", () => {
  if (message) {
    message.textContent = "Preview updated by the isolated example.";
  }
});`,
} as const satisfies PlaygroundSource;
