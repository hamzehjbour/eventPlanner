const API_URL = import.meta.env.VITE_API_URL;

export async function getEvents(page = 1, limit = 10) {
  const response = await fetch(`${API_URL}/events?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("failed to fetch events");
  }

  const data = await response.json();

  return data;
}

export async function getEvent(id) {
  const response = await fetch(`${API_URL}/events/${id}`);

  if (!response.ok) {
    throw new Error("failed to fetch event details");
  }

  const data = await response.json();

  return data;
}

export async function getEventAttendees(eventId) {
  const response = await fetch(`${API_URL}/events/${eventId}/attendees`);

  if (!response.ok) {
    throw new Error("failed to fetch event details");
  }

  const data = await response.json();

  return data;
}
