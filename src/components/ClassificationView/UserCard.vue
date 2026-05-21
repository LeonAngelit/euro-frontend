<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'
import config from '../../config/config'

interface UserCardProps {
  user: any
  index: number | string
  animActive: boolean
}

const props = defineProps<UserCardProps>()
const store = useAppStore()

const getCountryCode = (country: any) => {
  if (!country) return ''
  if (typeof country === 'object' && country.code) return country.code.toLowerCase()
  const id = typeof country === 'object' ? country.id : country
  const song = store.songs?.find((s: any) => s.id == id)
  return song?.code?.toLowerCase() || ''
}
</script>

<template>
  <div :class="['user-card-wrapper', animActive ? 'animate' : '']" :style="{
    animationDelay: `${Number(index) * 120}ms`,
  }">
    <!-- Dynamic ambient backing glow based on user custom color -->
    <div class="user-card-glow" :style="{ backgroundColor: user.color || 'var(--euro-pink)' }"></div>

    <article class="user-card">
      <!-- Translucent colored backdrop layer based on user color preference -->
      <div class="user-card-color-overlay" :style="{ backgroundColor: user.color, opacity: user.color ? 0.12 : 0 }">
      </div>

      <!-- Header Row: Rank, Profile Avatar, Username, and Score Badge -->
      <div class="user-card-header">
        <div class="header-left">
          <!-- Rank Badge -->
          <div :class="[
            'position-badge',
            Number(index) === 0 ? 'pos-1' : Number(index) === 1 ? 'pos-2' : Number(index) === 2 ? 'pos-3' : ''
          ]">
            {{ Number(index) + 1 }}
          </div>

          <!-- Avatar Frame -->
          <div class="avatar-container">
            <img :src="user.image ? user.image : `${config.defProfilePicUrl}${user.username}`" alt="avatar" />
          </div>

          <!-- Username and crown for leader -->
          <div class="username-container">
            <p :class="{ 'user-winner': Number(index) === 0 }">
              {{ user.username }}
            </p>
          </div>
        </div>
      </div>

      <!-- Subtle translucent separator line -->
      <div class="user-card-divider"></div>
      <div style="display: flex; justify-content: space-around;">
        <div class="user-card-countries">
          <div v-for="(country, cIndex) in user.countries" :key="cIndex" :class="[
            'country-chip',
            (user.winnerOption?.[0]?.countryId === true || user.winnerOption?.[0]?.countryId === country.id) ? 'winner-pick' : '',
            (user.tailOption?.[0]?.countryId === country.id) ? 'tail-pick' : ''
          ]">
            <span :class="[
              'fi',
              'fis',
              'country-flag',
              getCountryCode(country) ? `fi-${getCountryCode(country)}` : '',
            ]" :style="{
              outline:
                country.position === 1
                  ? '2px solid var(--euro-gold)'
                  : country.position === store.songs?.length
                    ? '2px solid #4dabff'
                    : '',
            }"></span>
            <span class="country-points">
              {{
                country.position === 1 && user.winnerOption?.[0]?.countryId === country.id
                  ? Math.floor(country.points + country.points * 0.1)
                  : country.points
              }}
            </span>
          </div>
        </div>
        <div class="user-card-total">
          <p class="pts-value">{{ user.points }}</p>
        </div>
      </div>
      <!-- Country Selection Chips -->

    </article>
  </div>
</template>

<style scoped>
/* Container Wrapper for card and backing glow */
.user-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0.8rem;
  width: 100%;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

/* Glassmorphism body of the card */
.user-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 15px;
  background: rgba(18, 14, 40, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  padding: 0.75rem;
  transition: all 0.3s ease;
  z-index: 2;
}

/* Dynamic backdrop color layer */
.user-card-color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  border-radius: 15px;
  transition: opacity 0.3s ease;
}

/* Ambient glow */
.user-card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
  filter: blur(60px);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: -1;
}

/* Hover effects */
.user-card-wrapper:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 0, 135, 0.2);
}

.user-card-wrapper:hover .user-card-glow {
  opacity: 0.2;
}

.user-card-wrapper:hover .user-card {
  background: rgba(24, 18, 52, 0.85);
}

/* Top 3 Special borders and shadows */
.user-card-wrapper:has(.pos-1) {
  background: linear-gradient(135deg, var(--euro-gold) 0%, rgba(218, 183, 29, 0.15) 100%);
  box-shadow: 0 6px 20px rgba(218, 183, 29, 0.15);
}

.user-card-wrapper:has(.pos-1):hover {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45), 0 0 25px rgba(218, 183, 29, 0.35);
}

.user-card-wrapper:has(.pos-2) {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.6) 0%, rgba(192, 192, 192, 0.1) 100%);
}

.user-card-wrapper:has(.pos-3) {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.5) 0%, rgba(205, 127, 50, 0.1) 100%);
}

/* Animations */
.animate {
  animation: slide-in-left 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
}

@keyframes slide-in-left {
  0% {
    transform: translateX(-30px);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Header row layout */
.user-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

/* Circular rank badge */
.position-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.pos-1 {
  background: linear-gradient(135deg, #ffe066 0%, #d4af37 100%);
  color: #120e28;
  border: 1px solid #fff2a3;
  box-shadow: 0 0 10px rgba(218, 183, 29, 0.6);
  text-shadow: none;
}

.pos-2 {
  background: linear-gradient(135deg, #f1f3f5 0%, #adb5bd 100%);
  color: #120e28;
  border: 1px solid #f8f9fa;
  box-shadow: 0 0 8px rgba(192, 192, 192, 0.4);
  text-shadow: none;
}

.pos-3 {
  background: linear-gradient(135deg, #ffd8a8 0%, #ca8a04 100%);
  color: #120e28;
  border: 1px solid #ffe8cc;
  box-shadow: 0 0 8px rgba(205, 127, 50, 0.4);
  text-shadow: none;
}

/* Avatar Frame */
.avatar-container {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid white;
  outline: 1.5px solid var(--euro-gold);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.avatar-container img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.avatar-container:hover {
  box-shadow: 0 0 10px var(--euro-gold);
  transform: scale(1.08);
}

/* Username section */
.username-container {
  min-width: 0;
}

.username-container p {
  color: white;
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.user-winner {
  color: var(--euro-gold);
  text-shadow: 0 0 8px rgba(218, 183, 29, 0.4);
}

.user-winner::after {
  content: " 👑";
  font-size: 0.9rem;
}

/* Points label on the right */
.header-right {
  flex-shrink: 0;
}

.user-card-total {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 135, 0.15);
  border: 1px solid rgba(255, 0, 135, 0.25);
  border-radius: 10px;
  align-self: center;
  padding: 0.2rem 0.6rem;
  box-shadow: 0 0 10px rgba(255, 0, 135, 0.15);
  transition: all 0.3s ease;
  height: 30px;
}

.pts-value {
  margin: 0;
  font-weight: 800;
  color: var(--euro-pink);
  font-size: 1rem;
  text-shadow: 0 0 6px rgba(255, 0, 135, 0.3);
}

.pts-value::after {
  content: " PTS";
  font-size: 0.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  margin-left: 0.15rem;
}

/* Fine glowing divider */
.user-card-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.1) 80%, rgba(255, 255, 255, 0) 100%);
  margin: 0.5rem 0;
  position: relative;
  z-index: 1;
}

/* Country flag glass chips layout */
.user-card-countries {
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  position: relative;
  z-index: 1;
}

.country-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.3rem;
  min-width: 58px;
  font-size: 0.8rem;
  color: white;
  transition: all 0.25s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.country-chip:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.country-flag {
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  display: inline-block;
  vertical-align: middle;
}

.country-points {
  font-weight: 500;
}

/* Winner picked country custom highlights */
.winner-pick {
  background: rgba(218, 183, 29, 0.12);
  border: 1px solid rgba(218, 183, 29, 0.35);
  box-shadow: 0 0 6px rgba(218, 183, 29, 0.1);
}

.winner-pick .country-points {
  font-weight: 700;
  color: var(--euro-gold);
}

/* Tail picked country custom highlights */
.tail-pick {
  background: rgba(77, 171, 255, 0.12);
  border: 1px solid rgba(77, 171, 255, 0.35);
  box-shadow: 0 0 6px rgba(77, 171, 255, 0.1);
}

.tail-pick .country-points {
  font-weight: 700;
  color: #4dabff;
}

/* Desktop sizing optimizations */
@media (min-width: 768px) {
  .user-card {
    padding: 0.6rem 0.9rem;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .user-card-header {
    width: auto;
    flex: 1;
    justify-content: flex-start;
    gap: 1rem;
  }

  .header-left {
    gap: 0.8rem;
  }

  .avatar-container {
    width: 42px;
    height: 42px;
  }

  .username-container p {
    font-size: 1rem;
  }

  .user-card-divider {
    display: none;
    /* No divider line on desktop side-by-side */
  }

  .user-card-countries {

    flex: 2;
    justify-content: flex-start;
  }

  .header-right {
    order: 3;
    /* Move total score to the far right on desktop */
  }
}
</style>
