const userTimeElement = document.querySelector('[data-testid="test-user-time"]');

function updateCurrentTime() {
  const now = Date.now();
  userTimeElement.textContent = now;
  userTimeElement.setAttribute('datetime', new Date(now).toISOString());
}

updateCurrentTime();
setInterval(updateCurrentTime, 500);
