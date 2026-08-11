<script setup>
import { onMounted, ref } from "vue";
import { getEvents } from "../api/eventApi";

const events = ref([]);
const city = ref("");
const category = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const error = ref(null);

const categories = [
  "sports",
  "education",
  "music",
  "charity",
  "food",
  "fashion",
  "health",
  "networking",
  "literature",
  "art",
  "comedy",
  "science",
  "business",
  "film",
  "gaming",
];

const fetchEvents = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;

    const data = await getEvents(page, 10, city.value, category.value);

    events.value = data.data.events;
    currentPage.value = data.page;
    totalPages.value = data.totalPages;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const searchEvents = () => {
  fetchEvents(1);
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

    <div class="event-search">
      <div class="search-field">
        <label for="city">City</label>

        <input
          id="city"
          v-model="city"
          type="text"
          placeholder="Search by city..."
        />
      </div>

      <div class="search-field">
        <label for="category">Category</label>

        <select id="category" v-model="category">
          <option value="">All categories</option>

          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <button @click="searchEvents">Search</button>
    </div>

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
