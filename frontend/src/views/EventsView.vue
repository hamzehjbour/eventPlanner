<script setup>
import { onMounted, ref } from "vue";
import { getEvents } from "../api/eventApi";

const events = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const error = ref(null);

const fetchEvents = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;

    const data = await getEvents(page);

    events.value = data.data.events;
    currentPage.value = data.page;
    totalPages.value = data.totalPages;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchEvents(Number(currentPage.value) + 1);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchEvents(Number(currentPage.value) - 1);
  }
};

onMounted(() => fetchEvents());
</script>

<template>
  <div class="events-page">
    <h1>Events</h1>

    <p v-if="loading">Loading...</p>

    <p v-else-if="error">{{ error }}</p>

    <div v-else class="events-list">
      <RouterLink
        v-for="event in events"
        :key="event._id"
        :to="`/events/${event._id}`"
        class="event"
      >
        <h2>{{ event.title }}</h2>
        <p>{{ event.description }}</p>
        <p>{{ event.startsAt }}</p>
      </RouterLink>
    </div>

    <div v-if="!loading && !error" class="pagination">
      <div v-if="currentPage > 1">
        <button @click="previousPage" :disabled="currentPage === 1">
          Previous
        </button>
      </div>

      <span> Page {{ currentPage }} of {{ totalPages }} </span>

      <div v-if="currentPage < totalPages">
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>
  </div>
</template>
