<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Presentation,
  Leaf,
  CheckCircle2,
  AlertCircle,
  Quote,
  BrainCircuit,
  Coffee,
} from "lucide-vue-next";
import PremiumImage from "./components/common/PremiumImage.vue";
import { rawSlides } from "./data/slides";
import { slideScripts } from "./data/scripts";

// --- IMAGE MAPPER ---
const currentSlideIdx = ref(0);
const currentStep = ref(0);
const isFullscreenMode = ref(false);

// --- PRELOADING MECHANISM ---
const preloadedImages = new Set<string>();

const preloadImage = (url: string) => {
  if (preloadedImages.has(url)) return;
  const img = new Image();
  img.src = url;
  preloadedImages.add(url);
};

// --- IMAGE MAPPER ---
const getSlideImage = (id: string, idx?: number) => {
  const base = import.meta.env.BASE_URL;
  if (id === "tips-4-grid") {
    return `${base}assets/images/slides/tips-4-${idx}.jpg`;
  }
  return `${base}assets/images/slides/${id}.jpg`;
};

// Watch for slide changes to preload next
watch(
  currentSlideIdx,
  (newIdx) => {
    const nextIdx = newIdx + 1;
    if (nextIdx < rawSlides.length) {
      const nextSlide = rawSlides[nextIdx];
      if (nextSlide.layout.type === "image-grid") {
        for (let i = 0; i < 4; i++)
          preloadImage(getSlideImage("tips-4-grid", i));
      } else {
        preloadImage(getSlideImage(nextSlide.id));
      }
    }
  },
  { immediate: true },
);

const currentSlide = computed(() => rawSlides[currentSlideIdx.value]);

const totalSteps = computed(() => {
  const slide = currentSlide.value;
  if (!slide.layout.progressive) return 0;
  if (
    slide.layout.type === "bullets" ||
    slide.layout.type === "split" ||
    slide.layout.type === "image-grid"
  ) {
    return slide.content.length;
  } else if (slide.layout.type === "title") {
    return slide.subtitle ? 1 : 0;
  } else if (slide.layout.type === "component") {
    return 1; // All functional components have at least 1 progressive step
  }
  return 0;
});

const handleNext = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  } else if (currentSlideIdx.value < rawSlides.length - 1) {
    currentSlideIdx.value++;
    currentStep.value = 0;
  }
};

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  } else if (currentSlideIdx.value > 0) {
    currentSlideIdx.value--;
    const prevSlide = rawSlides[currentSlideIdx.value];
    let prevSlideSteps = 0;
    if (prevSlide.layout.progressive) {
      if (
        prevSlide.layout.type === "bullets" ||
        prevSlide.layout.type === "split" ||
        prevSlide.layout.type === "image-grid"
      ) {
        prevSlideSteps = prevSlide.content.length;
      } else if (prevSlide.layout.type === "title") {
        prevSlideSteps = prevSlide.subtitle ? 1 : 0;
      } else if (
        prevSlide.layout.type === "component" &&
        prevSlide.layout.component === "BatteryProgress"
      ) {
        prevSlideSteps = 1;
      }
    }
    currentStep.value = prevSlideSteps;
  }
};

// --- SYNC MECHANISM ---
const SYNC_KEY = "uit-healthy-breakfast-sync";

// Watch for internal changes to sync to other tabs and URL
watch([currentSlideIdx, currentStep], ([newIdx, newStep]) => {
  // Sync to localStorage for secondary screens
  localStorage.setItem(
    SYNC_KEY,
    JSON.stringify({
      idx: newIdx,
      step: newStep,
      ts: Date.now(),
    }),
  );

  // Sync to URL params without reloading
  const url = new URL(window.location.href);
  url.searchParams.set("slide", (newIdx + 1).toString());
  if (newStep > 0) {
    url.searchParams.set("step", newStep.toString());
  } else {
    url.searchParams.delete("step");
  }
  window.history.replaceState({}, "", url.toString());
});

// Listen for changes from other tabs
const handleStorageSync = (e: StorageEvent) => {
  if (e.key === SYNC_KEY && e.newValue) {
    try {
      const data = JSON.parse(e.newValue);
      // Only sync if the timestamp is newer to avoid loops or old data
      if (currentSlideIdx.value !== data.idx) currentSlideIdx.value = data.idx;
      if (currentStep.value !== data.step) currentStep.value = data.step;
    } catch (err) {
      console.error("Sync error:", err);
    }
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  // Navigation
  if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
    e.preventDefault();
    handleNext();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    handlePrev();
  }

  // Fullscreen toggle
  if (e.key === "Escape" && isFullscreenMode.value) {
    isFullscreenMode.value = false;
  }

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
    e.preventDefault(); // Prevent browser print dialog
    isFullscreenMode.value = !isFullscreenMode.value;
  }

  // --- TELEPROMPTER SHORTCUTS ---
  // Toggle Teleprompter: Cmd+O (Mac) or Ctrl+O (Win)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "o") {
    e.preventDefault();
    tpVisible.value = !tpVisible.value;
  }

  if (e.ctrlKey && e.shiftKey) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      tpOpacity.value = Math.min(0.9, tpOpacity.value + 0.05);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      tpOpacity.value = Math.max(0.05, tpOpacity.value - 0.05);
    } else if (e.key === "=" || e.key === "+") {
      e.preventDefault();
      tpFontSize.value = Math.min(60, tpFontSize.value + 2);
    } else if (e.key === "-") {
      e.preventDefault();
      tpFontSize.value = Math.max(12, tpFontSize.value - 2);
    }
  }
};

// --- TELEPROMPTER STATE ---
const tpVisible = ref(false); // Local only, not synced
const tpOpacity = ref(0.15); // Default very faint
const tpFontSize = ref(24); // Default readable for speaker
const SETTINGS_KEY = "uit-breakfast-tp-settings";

// Persistence for settings (but NOT visibility)
watch([tpOpacity, tpFontSize], ([newOp, newSize]) => {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ opacity: newOp, fontSize: newSize }),
  );
});

// Helper to highlight [click] in script
const formattedScript = computed(() => {
  const currentId = currentSlide.value.id;
  let script = slideScripts[currentId] || currentSlide.value.script || "";

  // Auto-append [NEXT SLIDE] if not last slide
  const isLastSlide = currentSlideIdx.value === rawSlides.length - 1;
  if (!isLastSlide && !script.includes("[next slide]")) {
    script += ' <span class="next-slide-marker">[NEXT SLIDE]</span>';
  }

  // Use a simple replacement to highlight [click] actions
  return script
    .replace(
      /\[click\]/gi,
      '<span class="text-orange-500 font-black animate-pulse">[CLICK]</span>',
    )
    .replace(
      /\[next slide\]/gi,
      '<span class="text-emerald-500 font-black animate-bounce uppercase">[NEXT SLIDE]</span>',
    );
});

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("storage", handleStorageSync);

  // Initial sync on load - Priority: URL > localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const slideParam = urlParams.get("slide");
  const stepParam = urlParams.get("step");

  if (slideParam) {
    const sIdx = parseInt(slideParam) - 1;
    if (!isNaN(sIdx) && sIdx >= 0 && sIdx < rawSlides.length) {
      currentSlideIdx.value = sIdx;
      if (stepParam) {
        const sStep = parseInt(stepParam);
        if (!isNaN(sStep)) currentStep.value = sStep;
      }
    }
  } else {
    // Fallback to localStorage if no URL params
    const savedSync = localStorage.getItem(SYNC_KEY);
    if (savedSync) {
      try {
        const data = JSON.parse(savedSync);
        currentSlideIdx.value = data.idx;
        currentStep.value = data.step;
      } catch (e) {}
    }
  }

  // Load TP settings
  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (savedSettings) {
    try {
      const data = JSON.parse(savedSettings);
      tpOpacity.value = data.opacity || 0.6;
      tpFontSize.value = data.fontSize || 32;
    } catch (e) {}
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("storage", handleStorageSync);
});

const handleContentClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest("button")) return;
  handleNext();
};
</script>

<template>
  <div
    class="flex bg-slate-100 h-screen w-screen overflow-hidden font-sans text-slate-800 select-none"
  >
    <!-- Sidebar - Canva Style (100% faithful to sample) -->
    <aside
      v-if="!isFullscreenMode"
      class="w-80 bg-white border-r border-slate-200 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.03)] z-40"
    >
      <div class="p-6 border-b border-slate-100 bg-white text-center">
        <h1
          class="font-black text-2xl tracking-tighter text-emerald-800 flex items-center justify-center gap-3"
        >
          <Leaf class="w-8 h-8 text-orange-500" />
          HEALTHY SLIDES
        </h1>
      </div>

      <div
        class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-slate-50"
      >
        <button
          v-for="(s, idx) in rawSlides"
          :key="s.id"
          @click="
            currentSlideIdx = idx;
            currentStep = 0;
          "
          class="w-full text-left p-3 rounded-2xl transition-all duration-300 border flex gap-4"
          :class="
            idx === currentSlideIdx
              ? 'bg-emerald-50 border-emerald-300 shadow-md ring-1 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm'
          "
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-sm transition-colors"
            :class="
              idx === currentSlideIdx
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-500'
            "
          >
            {{ idx + 1 }}
          </div>
          <div class="overflow-hidden flex-1 py-0.5">
            <div
              class="font-bold text-sm truncate"
              :class="
                idx === currentSlideIdx ? 'text-emerald-900' : 'text-slate-700'
              "
            >
              {{ s.title }}
            </div>
            <div class="text-xs text-orange-600 font-medium truncate mt-1">
              {{ s.speaker }}
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col bg-slate-100 relative transition-all duration-500"
      :class="{ 'fixed inset-0 z-50': isFullscreenMode }"
    >
      <!-- Top Toolbar -->
      <header
        v-if="!isFullscreenMode"
        class="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shadow-sm shrink-0 z-10"
      >
        <div
          class="flex items-center space-x-3 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 shadow-sm"
        >
          <Coffee class="w-5 h-5 text-orange-500" />
          <span class="font-bold text-emerald-900">{{
            currentSlide.speaker
          }}</span>
          <span
            class="text-emerald-600 font-semibold px-2 block border-l border-emerald-200 ml-2"
            >Speaking</span
          >
        </div>

        <div class="flex space-x-4">
          <button
            @click="isFullscreenMode = true"
            class="flex items-center space-x-2 px-8 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Presentation class="w-5 h-5" />
            <span>Present</span>
          </button>
        </div>
      </header>

      <!-- Presentation Canvas -->
      <div
        class="flex-1 overflow-hidden relative cursor-pointer"
        :class="!isFullscreenMode ? 'p-8' : ''"
        @click="handleContentClick"
      >
        <div
          class="w-full h-full bg-white overflow-hidden relative shadow-2xl transition-all duration-300"
          :class="
            !isFullscreenMode
              ? 'rounded-[2rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
              : ''
          "
        >
          <transition name="fade-scale" mode="out-in">
            <div :key="currentSlideIdx" class="w-full h-full absolute inset-0">
              <!-- TITLE LAYOUT -->
              <div
                v-if="currentSlide.layout.type === 'title'"
                class="flex flex-col items-center justify-center p-12 h-full text-center relative w-full overflow-hidden bg-white"
              >
                <div class="absolute inset-0 z-0">
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Background"
                    class-name="w-full h-full object-cover"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-800/40 to-black/20"
                  ></div>
                </div>
                <div class="z-10 w-full max-w-6xl">
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 1
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-emerald-50 font-bold tracking-widest uppercase shadow-sm"
                    >
                      {{ currentSlide.subtitle }}
                    </span>
                  </div>
                  <h1
                    class="text-6xl lg:text-8xl font-black mb-8 tracking-tight text-white leading-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700"
                  >
                    {{ currentSlide.title }}
                  </h1>
                </div>
              </div>

              <!-- BULLETS LAYOUT -->
              <div
                v-else-if="currentSlide.layout.type === 'bullets'"
                class="flex flex-col lg:flex-row h-full w-full bg-slate-50"
              >
                <div
                  class="w-full lg:w-[55%] p-12 lg:p-20 flex flex-col justify-center relative z-10"
                >
                  <h2
                    class="text-5xl lg:text-6xl font-black text-emerald-800 mb-12 border-l-8 border-orange-500 pl-6 leading-tight drop-shadow-sm"
                  >
                    {{ currentSlide.title }}
                  </h2>
                  <div class="flex flex-col space-y-5 max-w-4xl relative">
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="flex items-center space-x-6 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-emerald-50 p-5 rounded-3xl text-2xl lg:text-3xl text-slate-700 font-semibold transition-all duration-500"
                      :class="
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-10'
                      "
                    >
                      <div
                        class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-200"
                      >
                        <CheckCircle2 class="w-8 h-8 text-emerald-600" />
                      </div>
                      <span class="leading-snug flex-1">{{ item }}</span>
                    </div>
                  </div>
                </div>
                <div class="w-[45%] relative hidden lg:block p-10">
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Illustration"
                    class-name="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                  />
                </div>
              </div>

              <!-- QUOTE LAYOUT -->
              <div
                v-else-if="currentSlide.layout.type === 'quote'"
                class="flex items-center justify-center p-16 h-full bg-emerald-50 text-center relative overflow-hidden w-full"
              >
                <div class="absolute inset-0 z-0 p-8">
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Background"
                    class-name="w-full h-full object-cover rounded-[4rem] shadow-2xl"
                  />
                </div>
                <div
                  class="absolute inset-0 bg-emerald-900/30 backdrop-blur-md z-0 rounded-[4rem] m-8"
                ></div>
                <div
                  class="relative z-10 bg-white/90 backdrop-blur-xl p-16 rounded-[3rem] max-w-5xl shadow-2xl border border-white/50 animate-in zoom-in-95 duration-1000"
                >
                  <Quote
                    class="w-20 h-20 text-orange-400 mx-auto mb-8 opacity-60"
                  />
                  <h2
                    class="text-5xl md:text-6xl font-bold italic leading-snug text-emerald-900 drop-shadow-sm"
                  >
                    "{{ currentSlide.title }}"
                  </h2>
                </div>
              </div>

              <!-- SPLIT LAYOUT -->
              <div
                v-else-if="currentSlide.layout.type === 'split'"
                class="flex flex-col lg:flex-row h-full w-full bg-white"
              >
                <div
                  class="w-full lg:w-1/2 p-16 lg:p-24 flex flex-col justify-center"
                >
                  <h2
                    class="text-5xl lg:text-6xl font-black text-emerald-800 mb-12 leading-tight pr-8 drop-shadow-sm"
                  >
                    {{ currentSlide.title }}
                  </h2>
                  <div class="space-y-6">
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="p-8 bg-amber-50/80 rounded-[2rem] text-3xl lg:text-4xl text-slate-800 font-bold border border-amber-200/50 shadow-sm transition-all duration-500"
                      :class="
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-10'
                      "
                    >
                      {{ item }}
                    </div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 flex-1 p-8 relative">
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Context"
                    class-name="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                  />
                </div>
              </div>

              <!-- IMAGE GRID LAYOUT -->
              <div
                v-else-if="currentSlide.layout.type === 'image-grid'"
                class="flex flex-col p-12 lg:p-16 h-full bg-emerald-50 justify-center w-full relative"
              >
                <h2
                  class="text-5xl lg:text-6xl font-black text-emerald-800 mb-12 text-center z-10 tracking-tight drop-shadow-sm"
                >
                  {{ currentSlide.title }}
                </h2>
                <div
                  class="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full z-10"
                >
                  <div
                    v-for="(item, idx) in currentSlide.content"
                    :key="idx"
                    class="relative bg-white rounded-[2.5rem] flex flex-col items-center justify-center p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 group overflow-hidden transition-all duration-500"
                    :class="
                      !currentSlide.layout.progressive || currentStep > idx
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-10 translate-y-10'
                    "
                  >
                    <div
                      class="w-full aspect-square rounded-[2rem] overflow-hidden mb-6 relative"
                    >
                      <PremiumImage
                        :src="getSlideImage('tips-4-grid', idx)"
                        class-name="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        :lazy="true"
                      />
                    </div>
                    <div class="flex items-center space-x-2 mb-4">
                      <Leaf class="w-6 h-6 text-orange-500" />
                      <h3 class="text-2xl font-bold text-slate-800 text-center">
                        {{ item }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- COMPONENT LAYOUTS -->
              <div
                v-else-if="currentSlide.layout.type === 'component'"
                class="h-full w-full"
              >
                <!-- SimpleCharts (Pie Chart with SVG) -->
                <div
                  v-if="currentSlide.layout.component === 'SimpleCharts'"
                  class="flex flex-col lg:flex-row items-center justify-center h-full bg-slate-50 w-full p-16 relative"
                >
                  <div class="absolute inset-0 opacity-10 pointer-events-none">
                    <PremiumImage
                      :src="getSlideImage(currentSlide.id)"
                      alt=""
                      class-name="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    class="w-full lg:w-1/2 p-8 text-center lg:text-left z-10"
                  >
                    <h2
                      class="text-6xl lg:text-7xl font-black mb-8 text-emerald-800 leading-tight border-l-8 border-orange-500 pl-6"
                    >
                      {{ currentSlide.title }}
                    </h2>
                    <p
                      class="text-3xl lg:text-4xl text-slate-700 font-medium leading-relaxed"
                    >
                      The brain is only 2% of body weight but consumes
                      <span
                        class="text-orange-600 font-black border-b-4 border-orange-500"
                        >20%</span
                      >
                      of daily energy.
                    </p>
                  </div>
                  <div
                    class="w-full lg:w-1/2 h-[500px] relative mt-12 lg:mt-0 flex items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 animate-in zoom-in-90 duration-1000"
                  >
                    <svg
                      viewBox="0 0 400 400"
                      class="w-[80%] h-[80%] -rotate-90"
                    >
                      <circle
                        cx="200"
                        cy="200"
                        r="160"
                        fill="none"
                        stroke="#34d399"
                        stroke-width="50"
                        stroke-dasharray="1005 1005"
                      />
                      <circle
                        cx="200"
                        cy="200"
                        r="160"
                        fill="none"
                        stroke="#fb923c"
                        stroke-width="50"
                        stroke-dasharray="201 1005"
                      />
                    </svg>
                    <div
                      class="absolute flex flex-col items-center justify-center inset-0 pointer-events-none"
                    >
                      <BrainCircuit class="w-20 h-20 text-emerald-600 mb-2" />
                      <span
                        class="text-6xl font-black text-slate-800 drop-shadow-md"
                        >20%</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Battery Progress -->
                <div
                  v-if="currentSlide.layout.component === 'BatteryProgress'"
                  class="flex flex-col items-center justify-center h-full bg-emerald-50 w-full p-16 relative"
                >
                  <div class="absolute inset-0 opacity-10 pointer-events-none">
                    <PremiumImage
                      :src="getSlideImage(currentSlide.id)"
                      alt=""
                      class-name="w-full h-full object-cover"
                    />
                  </div>
                  <h2
                    class="text-6xl md:text-7xl font-black mb-24 tracking-tight text-emerald-900 text-center drop-shadow-sm z-10"
                  >
                    {{ currentSlide.title }}
                  </h2>
                  <div
                    class="w-full max-w-5xl relative h-48 bg-white rounded-[4rem] shadow-inner border border-slate-200 flex items-center p-4"
                  >
                    <div
                      class="h-full rounded-[3rem] transition-all duration-[1.5s] ease-in-out"
                      :class="
                        currentStep > 0
                          ? 'bg-red-400 w-[15%] shadow-[0_0_20px_rgba(248,113,113,0.5)]'
                          : 'bg-emerald-400 w-[100%] shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                      "
                    ></div>
                    <div
                      class="absolute right-[-40px] top-1/2 -translate-y-1/2 w-10 h-24 bg-slate-300 rounded-r-3xl shadow-sm"
                    />
                    <div
                      class="absolute inset-0 flex items-center justify-center text-4xl font-black tracking-widest text-slate-800 pointer-events-none drop-shadow-md uppercase"
                    >
                      {{
                        currentStep === 0 ? "ENERGY: 100%" : "WARNING: CRITICAL"
                      }}
                    </div>
                  </div>
                  <div
                    class="mt-16 text-3xl font-bold text-red-600 bg-red-50 px-10 py-5 rounded-3xl shadow-lg flex items-center gap-4 border border-red-200 transition-all duration-500"
                    :class="
                      currentStep > 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5'
                    "
                  >
                    <AlertCircle class="w-10 h-10" />
                    <span>CORTISOL LEVELS RISING...</span>
                  </div>
                </div>

                <!-- GlitchEffect (Cyberpunk Style Error) -->
                <div
                  v-if="currentSlide.layout.component === 'GlitchEffect'"
                  class="flex flex-col items-center justify-center h-full bg-slate-900 w-full p-20 relative"
                >
                  <div
                    class="absolute inset-0 opacity-20 pointer-events-none grayscale contrast-125"
                  >
                    <PremiumImage
                      :src="getSlideImage(currentSlide.id)"
                      alt=""
                      class-name="w-full h-full object-cover"
                    />
                  </div>
                  <div class="relative group">
                    <h2
                      class="text-7xl md:text-9xl font-black text-white relative z-10 animate-pulse tracking-tighter"
                    >
                      {{ currentSlide.title }}
                    </h2>
                    <div
                      class="absolute inset-0 text-orange-500 blur-sm opacity-50 translate-x-1 translate-y-1 animate-pulse select-none"
                    >
                      {{ currentSlide.title }}
                    </div>
                    <div
                      class="absolute inset-0 text-red-500 blur-md opacity-30 -translate-x-1 -translate-y-1 animate-pulse select-none"
                    >
                      {{ currentSlide.title }}
                    </div>
                  </div>
                  <div
                    class="mt-16 bg-red-600/20 px-12 py-6 rounded-2xl border border-red-500/50 backdrop-blur-md"
                  >
                    <span
                      class="text-red-500 font-mono text-3xl font-bold animate-pulse uppercase tracking-widest"
                    >
                      {{
                        currentSlide.meta?.extraData?.text ||
                        "SYSTEM CRITICAL ERROR"
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Progress Bar bottom -->
          <div class="absolute bottom-0 left-0 h-2 bg-slate-100 w-full z-50">
            <div
              class="h-full bg-orange-400 rounded-r-full shadow-sm transition-all duration-500"
              :style="{
                width: `${((currentSlideIdx + 1) / rawSlides.length) * 100}%`,
              }"
            ></div>
          </div>

          <!-- Step indicators (faithfully matching sample) -->
          <div
            v-if="totalSteps > 0"
            class="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-50 bg-white/90 backdrop-blur shadow-lg px-6 py-3 rounded-full border border-slate-200"
          >
            <div
              v-for="(_, idx) in totalSteps + 1"
              :key="idx"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="
                idx <= currentStep
                  ? 'bg-orange-500 scale-125 shadow-md'
                  : 'bg-slate-200'
              "
            ></div>
          </div>
        </div>

        <!-- GHOST TELEPROMPTER OVERLAY -->
        <transition name="fade">
          <div
            v-if="tpVisible"
            class="absolute inset-0 z-[100] flex items-center justify-center p-12 pointer-events-none bg-black/10 backdrop-blur-[1px]"
          >
            <div
              class="w-full max-w-[90%] p-16 rounded-[4rem] backdrop-blur-3xl border border-white/20 shadow-[0_48px_96px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-y-auto max-h-[85vh] custom-scrollbar pointer-events-auto relative group/tp"
              :style="{
                backgroundColor: `rgba(0, 0, 0, ${tpOpacity})`,
                color: `rgba(255, 255, 255, ${Math.min(1, tpOpacity + 0.65)})`,
              }"
            >
              <!-- INTEGRATED SETTINGS (Top Right of Overlay) -->
              <div
                class="absolute top-8 right-12 flex space-x-8 opacity-20 group-hover/tp:opacity-100 transition-opacity duration-300"
              >
                <div class="flex flex-col space-y-1 w-32">
                  <div
                    class="flex justify-between text-[10px] font-black uppercase tracking-tighter opacity-70"
                  >
                    <span>Opacity</span>
                    <span>{{ Math.round(tpOpacity * 100) }}%</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="tpOpacity"
                    min="0.05"
                    max="0.9"
                    step="0.05"
                    class="w-full h-1 accent-orange-500 bg-white/20 rounded-full appearance-none outline-none"
                  />
                </div>
                <div class="flex flex-col space-y-1 w-32">
                  <div
                    class="flex justify-between text-[10px] font-black uppercase tracking-tighter opacity-70"
                  >
                    <span>Size</span>
                    <span>{{ tpFontSize }}px</span>
                  </div>
                  <input
                    type="range"
                    v-model.number="tpFontSize"
                    min="12"
                    max="60"
                    step="2"
                    class="w-full h-1 accent-emerald-500 bg-white/20 rounded-full appearance-none outline-none"
                  />
                </div>
              </div>

              <div
                class="font-black leading-relaxed text-center drop-shadow-2xl select-text pt-8"
                :style="{ fontSize: `${tpFontSize}px` }"
                v-html="formattedScript"
              ></div>
            </div>
          </div>
        </transition>

        <!-- HUD REMOVED: Integration into Overlay above -->

        <!-- Floating Controls (Fullscreen) -->
        <div
          v-if="isFullscreenMode"
          class="absolute bottom-8 right-8 z-50 flex space-x-4"
          @click.stop
        >
          <div
            class="bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-2xl p-1.5 flex items-center space-x-2 border border-slate-200"
          >
            <button
              @click="handlePrev"
              class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-emerald-600"
            >
              <ChevronLeft class="w-6 h-6" />
            </button>
            <div class="px-3 font-mono font-bold text-xl text-slate-700">
              <span class="text-emerald-600">{{ currentSlideIdx + 1 }}</span> /
              {{ rawSlides.length }}
            </div>
            <button
              @click="handleNext"
              class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-emerald-600"
            >
              <ChevronRight class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease-in-out;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* Tailwind-like animations for Vue */
.animate-in {
  animation-duration: 0.7s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-in {
  animation-name: fadeIn;
}

@keyframes slideInFromBottom {
  from {
    transform: translateY(2.5rem);
  }
  to {
    transform: translateY(0);
  }
}
.slide-in-from-bottom-10 {
  animation-name: slideInFromBottom;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.zoom-in-95 {
  animation-name: zoomIn;
  animation-duration: 1s;
}

@keyframes zoomIn90 {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.zoom-in-90 {
  animation-name: zoomIn90;
  animation-duration: 1s;
}
</style>
