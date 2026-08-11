import { createRouter, createWebHistory } from "vue-router";

import EventsView from "../views/EventsView.vue";
import EventDetailsView from "../views/EventDetailsView.vue";
import CreateEventView from "../views/CreateEventView.vue";

const routes = [
  {
    path: "/",
    redirect: "/events",
  },
  {
    path: "/events",
    name: "events",
    component: EventsView,
  },
  {
    path: "/events/create",
    name: "create-event",
    component: CreateEventView,
  },
  {
    path: "/events/:id",
    name: "event-details",
    component: EventDetailsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
