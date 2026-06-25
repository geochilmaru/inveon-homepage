// Premium Academy Interactive Calendar Logic
document.addEventListener('DOMContentLoaded', () => {
  const calendarGrid = document.getElementById('calendar-grid');
  const monthYearLabel = document.getElementById('calendar-month-year');
  const slotsContainer = document.getElementById('slots-grid');
  const selectedDateInput = document.getElementById('selected-date');
  const selectedTimeInput = document.getElementById('selected-time');

  if (!calendarGrid) return;

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  const timeSlotsData = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  function renderCalendar(month, year) {
    calendarGrid.innerHTML = '';
    
    // Day labels
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    days.forEach(day => {
      const dayLabel = document.createElement('div');
      dayLabel.className = 'calendar-day-label';
      dayLabel.innerText = day;
      calendarGrid.appendChild(dayLabel);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty spaces before first day of month
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDiv);
    }

    // Days numbers
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearLabel.innerText = `${monthNames[month]} ${year}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayButton = document.createElement('button');
      dayButton.className = 'calendar-day';
      dayButton.innerText = day;
      
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const cellDate = new Date(year, month, day);

      // Disable past dates
      if (cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        dayButton.className = 'calendar-day disabled';
        dayButton.disabled = true;
      } else {
        dayButton.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.calendar-day.active').forEach(activeDay => {
            activeDay.classList.remove('active');
          });
          dayButton.classList.add('active');
          selectedDateInput.value = dateString;
          renderTimeSlots(dateString);
        });
      }
      calendarGrid.appendChild(dayButton);
    }
  }

  function renderTimeSlots(date) {
    slotsContainer.innerHTML = '';
    timeSlotsData.forEach(time => {
      const slotBtn = document.createElement('button');
      slotBtn.className = 'slot-btn';
      slotBtn.type = 'button';
      slotBtn.innerText = time;

      // Mock random availability
      const isAvailable = Math.random() > 0.3;
      if (!isAvailable) {
        slotBtn.classList.add('disabled');
        slotBtn.disabled = true;
      } else {
        slotBtn.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.slot-btn.active').forEach(activeSlot => {
            activeSlot.classList.remove('active');
          });
          slotBtn.classList.add('active');
          selectedTimeInput.value = time;
        });
      }
      slotsContainer.appendChild(slotBtn);
    });
  }

  renderCalendar(currentMonth, currentYear);
});
