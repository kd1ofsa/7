const todoCard = document.querySelector('[data-testid="test-todo-card"]');
const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');
const statusElement = document.querySelector('[data-testid="test-todo-status"]');
const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const completeToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
const saveButton = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelButton = document.querySelector('[data-testid="test-todo-cancel-button"]');
const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
const descriptionElement = document.querySelector('[data-testid="test-todo-description"]');

const descriptionThreshold = 120;
let editSnapshot = null;

const state = {
  title: 'Design homepage hero section',
  description: 'Create an engaging hero section with a strong call to action, animated product highlights, and a concise feature summary that guides new visitors through the company’s main services and values. The content should be easy to scan, visually balanced, and optimized for conversion on mobile and desktop.',
  priority: 'Medium',
  status: 'In Progress',
  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  expanded: false,
  editing: false
};

function formatDueDateTime(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function createDurationText(diffMs) {
  const totalMinutes = Math.abs(Math.round(diffMs / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }

  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

function getTimeLabel() {
  const now = new Date();
  const diffMs = state.dueDate - now;

  if (state.status === 'Done') {
    return 'Completed';
  }

  if (diffMs <= 0) {
    return `Overdue by ${createDurationText(diffMs)}`;
  }

  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 60) {
    return `Due in ${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  if (totalHours < 24) {
    return `Due in ${totalHours} hour${totalHours === 1 ? '' : 's'}`;
  }

  const totalDays = Math.floor(totalHours / 24);
  return `Due in ${totalDays} day${totalDays === 1 ? '' : 's'}`;
}

function updateTimeInfo() {
  const now = new Date();
  const diffMs = state.dueDate - now;
  const isOverdue = diffMs <= 0 && state.status !== 'Done';

  if (state.status === 'Done') {
    timeRemainingElement.textContent = 'Completed';
    overdueIndicator.hidden = true;
    timeRemainingElement.classList.remove('todo-card__time-remaining--overdue');
    return;
  }

  timeRemainingElement.textContent = getTimeLabel();
  overdueIndicator.hidden = !isOverdue;
  timeRemainingElement.classList.toggle('todo-card__time-remaining--overdue', isOverdue);
}

function updateStatus(newStatus, triggeredByCheckbox = false) {
  if (!['Pending', 'In Progress', 'Done'].includes(newStatus)) {
    newStatus = 'Pending';
  }

  if (triggeredByCheckbox) {
    newStatus = completeToggle.checked ? 'Done' : 'Pending';
  }

  if (newStatus === 'Done') {
    state.status = 'Done';
  } else if (state.status === 'Done' && !completeToggle.checked) {
    state.status = 'Pending';
  } else {
    state.status = newStatus;
  }

  renderState();
}

function updatePriority(priority) {
  if (!['Low', 'Medium', 'High'].includes(priority)) {
    priority = 'Medium';
  }

  state.priority = priority;
  renderState();
}

function toggleDescription() {
  state.expanded = !state.expanded;
  renderDescription();
}

function renderDescription() {
  const isLong = state.description.length > descriptionThreshold;
  collapsibleSection.classList.toggle('collapsed', isLong && !state.expanded);
  expandToggle.hidden = !isLong;
  expandToggle.setAttribute('aria-expanded', String(state.expanded));
  expandToggle.textContent = state.expanded ? 'Show less' : 'Show more';
}

function applyCardClasses() {
  todoCard.classList.toggle('todo-card--done', state.status === 'Done');
  todoCard.classList.toggle('todo-card--in-progress', state.status === 'In Progress');
  todoCard.classList.toggle('todo-card--overdue', state.status !== 'Done' && state.dueDate < new Date());
  todoCard.classList.toggle('todo-card--high', state.priority === 'High');
  todoCard.classList.toggle('todo-card--medium', state.priority === 'Medium');
  todoCard.classList.toggle('todo-card--low', state.priority === 'Low');
}

function renderState() {
  todoCard.classList.toggle('todo-card--editing', state.editing);
  document.querySelector('.todo-card__view').hidden = state.editing;
  editForm.hidden = !state.editing;

  if (!state.editing) {
    document.querySelector('[data-testid="test-todo-title"]').textContent = state.title;
    descriptionElement.textContent = state.description;
    dueDateElement.textContent = formatDueDateTime(state.dueDate);
    dueDateElement.setAttribute('datetime', state.dueDate.toISOString());
    statusElement.textContent = state.status;
    statusElement.setAttribute('aria-label', `Status: ${state.status}`);
    statusControl.value = state.status;
    priorityBadge.textContent = state.priority;
    priorityBadge.setAttribute('aria-label', `Priority: ${state.priority}`);
    priorityIndicator.className = `priority-indicator priority-indicator--${state.priority.toLowerCase()}`;
    completeToggle.checked = state.status === 'Done';
    renderDescription();
    updateTimeInfo();
  }

  applyCardClasses();
}

function openEditMode() {
  editSnapshot = {
    ...state,
    dueDate: new Date(state.dueDate)
  };
  state.editing = true;
  state.expanded = true;
  renderState();
  editTitleInput.value = state.title;
  editDescriptionInput.value = state.description;
  editPrioritySelect.value = state.priority;
  editDueDateInput.value = formatLocalDateTime(state.dueDate);
  setTimeout(() => editTitleInput.focus(), 0);
}

function closeEditMode() {
  state.editing = false;
  renderState();
  editButton.focus();
}

function cancelEdit() {
  if (editSnapshot) {
    Object.assign(state, editSnapshot);
    editSnapshot = null;
  }
  closeEditMode();
}

function saveEdit(event) {
  if (event) {
    event.preventDefault();
  }

  state.title = editTitleInput.value.trim() || state.title;
  state.description = editDescriptionInput.value.trim() || state.description;
  state.priority = editPrioritySelect.value;

  const parsedDueDate = new Date(editDueDateInput.value);
  if (!Number.isNaN(parsedDueDate)) {
    state.dueDate = parsedDueDate;
  }

  state.expanded = state.description.length <= descriptionThreshold;
  editSnapshot = null;
  closeEditMode();
}

function trapFocus(event) {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(editForm.querySelectorAll(focusableSelectors)).filter(
    (el) => !el.disabled && el.offsetParent !== null
  );

  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

completeToggle.addEventListener('change', () => {
  updateStatus(completeToggle.checked ? 'Done' : 'Pending', true);
});

statusControl.addEventListener('change', (event) => {
  updateStatus(event.target.value);
});

expandToggle.addEventListener('click', toggleDescription);
editButton.addEventListener('click', openEditMode);
deleteButton.addEventListener('click', () => {
  alert('Delete clicked');
});

editForm.addEventListener('submit', saveEdit);
cancelButton.addEventListener('click', cancelEdit);
editForm.addEventListener('keydown', trapFocus);

renderState();
updateTimeInfo();
setInterval(updateTimeInfo, 30000);
