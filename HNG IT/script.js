const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');
const statusElement = document.querySelector('[data-testid="test-todo-status"]');
const todoCard = document.querySelector('[data-testid="test-todo-card"]');
const completeToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');

function formatDueDate(date) {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDueDateTime(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getCountdownText(date) {
  const now = new Date();
  const diffMs = date - now;

  if (diffMs <= 0) {
    return 'Due now!';
  }

  const absDiff = diffMs;
  const totalHours = Math.floor(absDiff / 3600000);
  const minutes = Math.floor((absDiff % 3600000) / 60000);
  const seconds = Math.floor((absDiff % 60000) / 1000);

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `⏳ Due in ${totalHours}:${paddedMinutes}:${paddedSeconds}`;
}

function updateDueInfo() {
  dueDateElement.textContent = formatDueDate(dueDate);
  dueDateElement.setAttribute('datetime', dueDate.toISOString());
  timeRemainingElement.textContent = getCountdownText(dueDate);
}

function setCompletionState(isComplete) {
  if (isComplete) {
    todoCard.classList.add('todo-card--done');
    statusElement.textContent = 'Done';
    statusElement.setAttribute('aria-label', 'Status: Done');
  } else {
    todoCard.classList.remove('todo-card--done');
    statusElement.textContent = 'In Progress';
    statusElement.setAttribute('aria-label', 'Status: In Progress');
  }
}

completeToggle.addEventListener('change', () => {
  setCompletionState(completeToggle.checked);
});

editButton.addEventListener('click', () => {
  console.log('edit clicked');
});

deleteButton.addEventListener('click', () => {
  alert('Delete clicked');
});

updateDueInfo();
setInterval(updateDueInfo, 1000);
