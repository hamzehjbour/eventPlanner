<script setup></script>

<template>
  <nav>
    <RouterLink to="/events">Events &rarr;</RouterLink>
    <RouterLink to="/events/create">Create Event &rarr;</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>
