# PowerApps PCF Code Editor

A modern, drop-in code editor for **Power Apps & Dynamics 365 model-driven apps**, built to replace plain text areas with a proper developer-grade editing experience.

---

## Why this exists

Power Apps and Dynamics 365 are increasingly used to store and manage **structured logic and configuration**, such as:

* JSON configuration blobs
* JavaScript snippets
* Rules, mappings, and templates stored as text

However, the default text area control offers **no validation, no structure, and no feedback**, making it easy to introduce errors and hard to maintain quality at scale.

This project exists to solve that gap.

**PowerApps PCF Code Editor** brings a familiar, VS Code-like editing experience directly into model-driven forms — without changing how data is stored or managed in Dataverse.

---

## What it provides

This PCF control replaces a standard text field with a full-featured code editor that:

* Displays and edits **JSON and JavaScript**
* Provides **live syntax validation**
* Highlights errors visually while typing
* Preserves the standard **Save / Save & Close** experience
* Works as a **drop-in control** on model-driven forms

It is designed to feel native to Power Apps while significantly improving usability for both makers and developers.

---

## How it’s intended to be used

The control is meant to be applied to **existing text fields** that already store code or configuration.

Typical scenarios include:

* Editing JSON configuration for apps, rules, or integrations
* Maintaining JavaScript logic stored in Dataverse
* Improving reliability and readability of technical fields without custom pages

The editor operates entirely **within the form**, meaning:

* No changes to data models are required
* No external services are involved
* The field continues to behave like a normal Dataverse column

From a user’s perspective, the only difference is that the text field is now **safer, clearer, and easier to work with**.

---

## Design principles

This project follows a few simple principles:

* **Drop-in & portable**
  Works across Power Apps environments without special setup.

* **Free & open**
  No licensing, no paywalls, no telemetry.

* **Respect the platform**
  Uses standard Dataverse save behavior and form lifecycle.

* **Focused scope**
  Solves one problem well: editing code stored as text.

---

## Who this is for

* Power Apps makers working with JSON or scripts
* Dynamics 365 customizers and solution architects
* Teams managing configuration-driven systems in Dataverse
* Anyone tired of editing code inside a plain text box

---

## Project status

This is an **open, community-driven project** intended for general use.
Contributions, feedback, and suggestions are welcome.

---

## License

This project is licensed under the MIT License.


Just tell me.
