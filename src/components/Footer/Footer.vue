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
  background: linear-gradient(135deg, var(--euro-pink) 0%, rgb(200, 0, 105) 100%);
  justify-content: center;
  align-items: center;
  position: sticky;
  bottom: 0;
  border-top: 2px solid var(--euro-gold);
}

.footer p {
  color: whitesmoke;
  font-size: .75rem;
}
</style>