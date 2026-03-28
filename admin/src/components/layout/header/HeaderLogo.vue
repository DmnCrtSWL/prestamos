<template>
  <router-link to="/" class="lg:hidden">
    <img src="/images/logo/logo.svg" alt="Logo" class="dark:hidden" />
    <img src="/images/logo/logo-dark.svg" alt="Logo" class="hidden dark:block" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
