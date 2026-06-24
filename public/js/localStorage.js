// LocalStorage & Express API Sync Module

const STORAGE_KEY = 'iea_reservations';

// 1. Get all bookings from localStorage
function getReservations() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 2. Sync client bookings list to Express server
async function syncToServer() {
  const list = getReservations();
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    });
    const result = await response.json();
    console.log('Server Sync Response:', result);
    return result.success;
  } catch (error) {
    console.error('Failed to sync data to server:', error);
    return false;
  }
}

// 3. Load bookings from Server to LocalStorage (e.g. initial load if local is empty)
async function loadFromServer() {
  try {
    const response = await fetch('/api/reservations');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Successfully restored bookings from Express server.');
      return data;
    }
  } catch (error) {
    console.error('Failed to load data from server:', error);
  }
  return getReservations();
}

// 4. Create new reservation booking
async function createReservation(booking) {
  const list = getReservations();
  
  const newBooking = {
    id: `booking_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...booking
  };
  
  list.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  
  // Asynchronously sync to Express server file database
  await syncToServer();
  
  return newBooking;
}

// 5. Update booking status
async function updateReservationStatus(id, newStatus) {
  const list = getReservations();
  const targetIndex = list.findIndex(item => item.id === id);
  if (targetIndex !== -1) {
    list[targetIndex].status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    await syncToServer();
    return true;
  }
  return false;
}

// Export modules to window object for global client access
window.IEA_Storage = {
  getReservations,
  createReservation,
  updateReservationStatus,
  syncToServer,
  loadFromServer
};

// Initialize server restore on load
document.addEventListener('DOMContentLoaded', () => {
  // If localstorage is empty, try fetching from server backup file
  if (getReservations().length === 0) {
    window.IEA_Storage.loadFromServer();
  }
});
