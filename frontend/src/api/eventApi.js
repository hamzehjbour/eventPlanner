const API_URL = import.meta.env.VITE_API_URL;

export async function getEvents(
  page = 1,
  limit = 10,
  city = "",
  category = "",
) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  if (city) {
    params.append("city", city);
  }

  if (category) {
    params.append("category", category);
  }

  const response = await fetch(`${API_URL}/events?${params.toString()}`);

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}

export async function getEvent(id) {
  const response = await fetch(`${API_URL}/events/${id}`);

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}

export async function getEventAttendees(eventId) {
  const response = await fetch(`${API_URL}/events/${eventId}/attendees`);

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}

export async function registerUser(eventId, user, ticketCount) {
  const response = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
      ticketCount,
    }),
  });

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}

export async function getVenues() {
  const response = await fetch(`${API_URL}/venues`);

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}

export async function getOrganizers() {
  const data = await getUsers();

  return data;
}

export async function createEvent(eventData) {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(data.message);
  }

  return data;
}
