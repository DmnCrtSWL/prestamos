<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-4">Debug Environment</h1>
    <div class="bg-gray-100 p-4 rounded text-sm font-mono">
      <p><strong>VITE_API_URL:</strong> {{ apiUrl }}</p>
      <p><strong>Mode:</strong> {{ mode }}</p>
    </div>
    <div class="mt-4">
        <button @click="testFetch" class="bg-blue-500 text-white px-4 py-2 rounded">Test Fetch Users</button>
        <div v-if="fetchResult" class="mt-4 p-4 border rounded bg-gray-50">
            <pre>{{ fetchResult }}</pre>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE
const fetchResult = ref(null)

const testFetch = async () => {
    try {
        const res = await fetch(`${apiUrl}/users`)
        const text = await res.text()
        try {
            fetchResult.value = JSON.parse(text)
        } catch (e) {
            fetchResult.value = `Error parsing JSON: ${text.substring(0, 100)}...`
        }
    } catch (e) {
        fetchResult.value = `Network Error: ${e.message}`
    }
}
</script>
