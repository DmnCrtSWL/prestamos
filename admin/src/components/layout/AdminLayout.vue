<template>
  <div class="h-screen overflow-hidden xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      ref="contentEl"
      class="flex-1 min-w-0 w-full h-screen overflow-y-auto transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'

const { isExpanded, isHovered } = useSidebar()
const route = useRoute()
const contentEl = ref(null)

watch(() => route.path, () => {
  if (contentEl.value) contentEl.value.scrollTop = 0
})
</script>
