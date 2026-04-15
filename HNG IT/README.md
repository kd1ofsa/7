# Todo Task Card

A responsive, accessible todo/task card implemented with HTML, CSS, and JavaScript.

## Stage 1 Upgrades

This version extends the initial Stage 0 card into a more interactive, stateful component.

### What changed from Stage 0

- Added an in-place edit mode with form controls for title, description, priority, and due date.
- Added a status control with selectable options: `Pending`, `In Progress`, and `Done`.
- Added a priority indicator dot and left-border accent that updates for `Low`, `Medium`, and `High` priority.
- Added an expandable/collapsible description section for long text.
- Added overdue handling and granular time labels like `Due in 2 days`, `Due in 3 hours`, `Due in 45 minutes`, and `Overdue by 1 hour`.
- Added synchronization between checkbox, status badge, and status dropdown.
- Added done-state visuals and stopped time updates when a task is completed.

### New design decisions

- Keep the component as a single card rather than a full app, preserving the Stage 0 scope.
- Use data attributes for all testable UI points, including edit form fields and interaction controls.
- Display the completed state with muted styling and strike-through text for readability.
- Use a lightweight edit form layout that stacks neatly on mobile and aligns horizontally on wider screens.
- Show an explicit overdue badge and red accent when the task is past due.

### Known limitations

- The delete action currently uses a placeholder `alert` and does not remove the card from the page.
- No persistent storage is implemented, so changes are reset on page reload.
- Edit mode focus trapping is included in JS but does not use a dedicated modal pattern.
- The card is still single-item focused and does not include list management or multiple tasks.

### Accessibility notes

- Form fields use explicit `<label for="...">` associations.
- Status control includes an accessible name and keyboard interaction.
- Expand/collapse toggle uses `aria-expanded` and `aria-controls` with a matching collapsible section id.
- Time updates use `aria-live="polite"` for screen reader announcements.
- The card and controls are keyboard accessible, including the edit form.

## Run

Open `chukwuebukaokpala0.vercel.app` in a browser.
