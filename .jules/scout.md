## 2026-06-04 - Assistant Message Copy to Clipboard
**Feature:** Added a "Copy" button to Assistant messages in the Chat interface to easily extract generated responses.
**Learning:** Found a gap where users couldn't easily retrieve the LLM outputs. I added a self-contained component using `navigator.clipboard` directly in `ChatView.tsx`, hooking it to the `streaming` state to only appear on completed messages.
**Pattern:** For minor UX conveniences, encapsulate the state (like the 'Copied!' temporary checkmark) within a small component (`CopyButton`) right alongside where it's used, avoiding polluting the global or parent state.
