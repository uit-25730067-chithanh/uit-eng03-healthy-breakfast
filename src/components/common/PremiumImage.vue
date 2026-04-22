<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps<{
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  lazy?: boolean;
}>();

const isLoaded = ref(false);
const hasError = ref(false);

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  hasError.value = true;
};

onMounted(() => {
  // Reset states if src changes
  watch(
    () => props.src,
    () => {
      isLoaded.value = false;
      hasError.value = false;
    },
  );
});
</script>

<template>
  <div class="relative overflow-hidden w-full h-full" :class="className">
    <!-- Shimmer Loader -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center"
    >
      <div
        class="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-if="hasError"
      class="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-4 text-center"
    >
      <div class="text-slate-400 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12 h-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-slate-500">Image failed to load</p>
    </div>

    <!-- Actual Image -->
    <img
      :src="src"
      :alt="alt || 'Slide image'"
      class="w-full h-full object-cover transition-all duration-700 ease-in-out"
      :class="[
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
        hasError ? 'hidden' : 'block',
        imgClassName,
      ]"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
