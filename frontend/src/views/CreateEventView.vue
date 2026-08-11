<script setup>
import { onMounted, ref } from "vue";
import { createEvent, getOrganizers, getVenues } from "../api/eventApi";

const venues = ref([]);
const organizers = ref([]);

const form = ref({
  title: "",
  description: "",
  startsAt: "",
  price: 0,
  venue: "",
  organizer: "",
  category: [],
});

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

const loading = ref(false);
const loadingData = ref(true);
const error = ref(null);
const success = ref(false);

const fetchFormData = async () => {
  try {
    loadingData.value = true;

    const [venuesData, organizersData] = await Promise.all([
      getVenues(),
      getOrganizers(),
    ]);

    venues.value = venuesData.data.venues ?? venuesData;
    organizers.value = organizersData.data.users ?? organizersData;
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingData.value = false;
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;
    success.value = false;

    const eventData = {
      title: form.value.title,
      description: form.value.description,

      startsAt: new Date(form.value.startsAt).toISOString(),

      price: Number(form.value.price),
      venue: form.value.venue,
      organizer: form.value.organizer,
      category: form.value.category,
    };

    await createEvent(eventData);

    success.value = true;

    // Reset form
    form.value = {
      title: "",
      description: "",
      startsAt: "",
      price: 0,
      venue: "",
      organizer: "",
      category: [],
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFormData);
</script>

<template>
  <div class="create-event-page">
    <h1>Create Event</h1>
    <p class="page-description">
      Create a new event and provide all the necessary details.
    </p>

    <p v-if="loadingData">Loading form data...</p>

    <form v-else @submit.prevent="handleSubmit" class="event-form">
      <div class="form-group">
        <label for="title">Title</label>

        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter event title"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>

        <textarea
          id="description"
          v-model="form.description"
          placeholder="Describe the event"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="startsAt">Starts At</label>

        <input
          id="startsAt"
          v-model="form.startsAt"
          type="datetime-local"
          required
        />
      </div>

      <div class="form-group">
        <label for="price">Price</label>

        <input
          id="price"
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>

      <!-- Venue -->
      <div class="form-group">
        <label for="venue">Venue</label>

        <select id="venue" v-model="form.venue" required>
          <option value="" disabled>Select a venue</option>

          <option v-for="venue in venues" :key="venue._id" :value="venue.name">
            {{ venue.name }}
          </option>
        </select>
      </div>

      <!-- Organizer -->
      <div class="form-group">
        <label for="organizer">Organizer</label>

        <select id="organizer" v-model="form.organizer" required>
          <option value="" disabled>Select an organizer</option>

          <option
            v-for="organizer in organizers"
            :key="organizer._id"
            :value="organizer.name"
          >
            {{ organizer.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Categories</label>

        <div class="categories">
          <label
            v-for="category in categories"
            :key="category"
            class="category-option"
          >
            <input v-model="form.category" type="checkbox" :value="category" />

            <span>{{ category }}</span>
          </label>
        </div>
      </div>

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <p v-if="success" class="success">Event created successfully!</p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Creating..." : "Create Event" }}
      </button>
    </form>
  </div>
</template>
