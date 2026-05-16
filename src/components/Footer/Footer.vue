<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="info-container">
      <p>Leonardo Angelit - {{ new Date().getFullYear() }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  max-width: 100vw;
  height: 2.5vh;
  background-color: var(--primary-color);
  justify-content: center;
  align-items: center;
  position: sticky;
  bottom: 0;
}

.footer p {
  color: whitesmoke;
  font-size: .75rem;
}
</style>