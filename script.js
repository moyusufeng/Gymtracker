const today = new Date();
let selectedDate = null;
let workouts = JSON.parse(localStorage.getItem('workouts')) || {};

// Update workouts and calendar when changing the date
const workoutForm = document.getElementById('workout-form');
const workoutList = document.getElementById('workout-list');
const selectedDateElement = document.getElementById('selected-date');
const calendarContainer = document.getElementById('calendar');

function renderCalendar() {
  const currentMonth = today.getMonth(); // Current month (0 - 11)
  const currentYear = today.getFullYear();

  // Get the first day of the month and the number of days in the month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const numDays = lastDay.getDate();
  const firstDayIndex = firstDay.getDay(); // 0 is Sunday, 1 is Monday, ...

  // Clear the calendar
  calendarContainer.innerHTML = '';

  // Fill in empty spaces for the first row
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('calendar-day');
    calendarContainer.appendChild(emptyCell);
  }

  // Add days of the current month
  for (let day = 1; day <= numDays; day++) {
    const dayButton = document.createElement('div');
    dayButton.textContent = day;
    dayButton.classList.add('calendar-day');
    
    // Mark the current day
    if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      dayButton.classList.add('today');
    }
    
    // Add click event to select the day
    dayButton.addEventListener('click', () => handleDayClick(day));

    calendarContainer.appendChild(dayButton);
  }
}

function handleDayClick(day) {
  selectedDate = new Date(today.getFullYear(), today.getMonth(), day);
  selectedDateElement.textContent = selectedDate.toDateString();
  renderWorkoutsForSelectedDate();
}

function renderWorkoutsForSelectedDate() {
  if (!selectedDate) return;

  const dateKey = selectedDate.toDateString();
  const dateWorkouts = workouts[dateKey] || [];

  workoutList.innerHTML = '';
  dateWorkouts.forEach((workout, index) => {
    const li = document.createElement('li');
    li.textContent = `${workout.exercise} - ${workout.sets} sets of ${workout.reps} reps @ ${workout.weight} kg`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      workouts[dateKey].splice(index, 1);
      saveWorkouts();
      renderWorkoutsForSelectedDate();
    });
    li.appendChild(deleteBtn);
    workoutList.appendChild(li);
  });
}

function saveWorkouts() {
  localStorage.setItem('workouts', JSON.stringify(workouts));
}

// Handle form submission
workoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!selectedDate) {
    alert('Please select a date first!');
    return;
  }

  const exercise = document.getElementById('exercise').value;
  const sets = document.getElementById('sets').value;
  const reps = document.getElementById('reps').value;
  const weight = document.getElementById('weight').value;

  const dateKey = selectedDate.toDateString();
  if (!workouts[dateKey]) {
    workouts[dateKey] = [];
  }

  workouts[dateKey].push({ exercise, sets, reps, weight });
  saveWorkouts();
  renderWorkoutsForSelectedDate();
  workoutForm.reset();
});

// Initial render
renderCalendar();
