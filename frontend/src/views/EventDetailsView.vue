<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  getEvent,
  getEventAttendees,
  getUsers,
  registerUser,
} from "../api/eventApi";

const route = useRoute();

const event = ref(null);
const attendees = ref(null);
const loading = ref(true);
const error = ref(null);

const users = ref([]);
const selectedUser = ref("");
const ticketCount = ref(1);

const registering = ref(false);
const registrationError = ref(null);
const registrationSuccess = ref(false);

const fetchEvent = async () => {
  try {
    const data = await getEvent(route.params.id);
    const eventAttendees = await getEventAttendees(route.params.id);

    event.value = data.data.event;
    attendees.value = eventAttendees.data.registrations;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const data = await getUsers();

    // console.log(data.data.users);
    users.value = data.data.users;
  } catch (err) {
    registrationError.value = err.message;
  }
};

const handleRegistration = async () => {
  if (!selectedUser.value || ticketCount.value < 1) {
    return;
  }

  try {
    registering.value = true;
    registrationError.value = null;
    registrationSuccess.value = false;

    await registerUser(route.params.id, selectedUser.value, ticketCount.value);

    registrationSuccess.value = true;

    selectedUser.value = "";
    ticketCount.value = 1;

    await fetchEvent();
  } catch (err) {
    registrationError.value = err.message;
  } finally {
    registering.value = false;
  }
};

onMounted(() => {
  fetchEvent();
  fetchUsers();
});
</script>

<template>
  <div class="event-details-page">
    <RouterLink to="/events" class="back-link"> ← Back to events </RouterLink>

    <p v-if="loading" class="status">Loading event...</p>

    <p v-else-if="error" class="status error">{{ error }}</p>

    <article v-else-if="event" class="event-card">
      <header class="event-header">
        <span class="event-label">EVENT</span>
        <h1>{{ event.title }}</h1>
        <p class="event-description">{{ event.description }}</p>
      </header>

      <div class="event-info">
        <div class="info-item">
          <span class="info-label">DATE</span> <span>{{ event.startsAt }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">ORGANIZER</span>
          <span>{{ event.organizer.name }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">VENUE</span>
          <span>{{ event.venue.name }} / {{ event.venue.address }}</span>
        </div>
      </div>

      <div class="attendees-header">
        <h2>Attendees</h2>

        <div>
          <p>No attendees for this event yet</p>
        </div>
      </div>

      <div v-if="attendees && attendees.length > 0">
        <div v-for="attendee in attendees">
          <div class="attendees-info">
            <div class="info-item">
              <span class="info-label">Name</span>
              <span>{{ attendee.user.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span>{{ attendee.user.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tickets</span>
              <span>{{ attendee.ticketCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Booked At</span>
              <span>{{ attendee.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </article>

    <div class="registration-section">
      <h2>Register Attendee</h2>

      <form @submit.prevent="handleRegistration">
        <div class="form-group">
          <label for="user">User</label>

          <select id="user" v-model="selectedUser" required>
            <option value="" disabled>Select a user</option>

            <option v-for="user in users" :key="user._id" :value="user.name">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="tickets">Number of tickets</label>

          <input
            id="tickets"
            v-model.number="ticketCount"
            type="number"
            min="1"
            required
          />
        </div>

        <button type="submit" :disabled="registering || !selectedUser">
          {{ registering ? "Registering..." : "Register User" }}
        </button>
      </form>

      <p v-if="registrationSuccess" class="success">
        User registered successfully!
      </p>

      <p v-if="registrationError" class="error">
        {{ registrationError }}
      </p>
    </div>
  </div>
</template>
