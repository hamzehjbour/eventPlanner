<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getEvent, getEventAttendees } from "../api/eventApi";

const route = useRoute();

const event = ref(null);
const attendees = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchEvent = async () => {
  try {
    const data = await getEvent(route.params.id);
    const eventAttendees = await getEventAttendees(route.params.id);

    console.log(eventAttendees.data.registrations);
    event.value = data.data.event;
    attendees.value = eventAttendees.data.registrations;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchEvent());
</script>

<template>
  <div class="event-details-page">
    <RouterLink to="/events" class="back-link"> ← Back to events </RouterLink>

    <button class="btn-register">Register user</button>

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
  </div>
</template>
