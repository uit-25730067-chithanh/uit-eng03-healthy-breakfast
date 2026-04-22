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
  Zap,
  Scale,
  Apple,
  Activity,
  Heart,
  Cpu,
  AlertTriangle,
  Trophy,
  ListChecks,
  Rocket,
  Users,
  Brain,
  Battery,
  Timer,
  Clock,
  ZapOff,
  Utensils,
  List,
  Check,
} from "lucide-vue-next";

const IconMap: Record<string, any> = {
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
  Zap,
  Scale,
  Apple,
  Activity,
  Heart,
  Cpu,
  AlertTriangle,
  Trophy,
  ListChecks,
  Rocket,
  Users,
  Brain,
  Battery,
  Timer,
  Clock,
  ZapOff,
  Utensils,
  List,
  Check,
};
import PremiumImage from "./components/common/PremiumImage.vue";
import { rawSlides } from "./data/slides";
import { slideScripts } from "./data/scripts";
import Confetti from "./components/effects/Confetti.vue";

// --- IMAGE MAPPER ---
const currentSlideIdx = ref(0);
const currentStep = ref(0);
const activeMemberIdx = ref<number | null>(null);

watch(currentStep, (newStep) => {
  activeMemberIdx.value = newStep - 1;
});

const isFullscreenMode = ref(false);
const baseUrl = import.meta.env.BASE_URL;
const IMAGE_BASE_URL = baseUrl;

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
  const base = IMAGE_BASE_URL;
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

const getSlideTotalSteps = (slide: any) => {
  const script = slideScripts[slide.id] || slide.script || "";
  const matches = script.match(/\[CLICK\]/gi);
  return matches ? Math.max(0, matches.length - 1) : 0;
};

const totalSteps = computed(() => getSlideTotalSteps(currentSlide.value));

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
    currentStep.value = getSlideTotalSteps(rawSlides[currentSlideIdx.value]);
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
const tpOpacity = ref(0.5); // Default very faint
const tpFontSize = ref(32); // Default readable for speaker
const SETTINGS_KEY = "uit-breakfast-tp-settings";

const confettiRef = ref<InstanceType<typeof Confetti> | null>(null);

// Trigger confetti on closing slide
watch(currentSlideIdx, (newIdx) => {
  if (rawSlides[newIdx]?.id === "closing") {
    setTimeout(() => {
      confettiRef.value?.start();
    }, 500); // Small delay for entrance animation
  } else {
    confettiRef.value?.stop();
  }
});
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
      '<span class="text-orange-500 font-black">[CLICK]</span>',
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
      tpOpacity.value = data.opacity || 0.5;
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
                    class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2)_0%,transparent_70%)]"
                  ></div>

                  <!-- Grainy Overlay -->
                  <div
                    class="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
                    style="
                      background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E&quot;);
                    "
                  ></div>

                  <!-- Floating Icons for Title -->
                  <div
                    class="absolute top-[10%] right-[10%] opacity-[0.1] rotate-12 scale-150 animate-bounce duration-[30s]"
                  >
                    <component
                      :is="IconMap['Leaf']"
                      class="w-32 h-32 text-white"
                    />
                  </div>
                  <div
                    class="absolute bottom-[20%] left-[5%] opacity-[0.1] -rotate-12 scale-125 animate-pulse duration-[25s]"
                  >
                    <component
                      :is="IconMap['Coffee']"
                      class="w-40 h-40 text-white"
                    />
                  </div>
                </div>
                <div class="z-10 w-full max-w-6xl">
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-emerald-50 font-bold tracking-widest uppercase shadow-sm"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <h1
                    class="text-6xl lg:text-8xl font-black mb-10 tracking-tight text-white leading-tight drop-shadow-2xl transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive ||
                      currentStep >=
                        (totalSteps > 0 &&
                        (!currentSlide.content ||
                          currentSlide.content.length === 0)
                          ? 1
                          : 0)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    "
                    v-html="currentSlide.title"
                  ></h1>

                  <!-- Icon Support for Title Layout -->
                  <div
                    v-if="currentSlide.icon"
                    class="flex justify-center mb-10 transition-all duration-1000 delay-300"
                    :class="
                      !currentSlide.layout.progressive ||
                      currentStep >=
                        (totalSteps > 0 &&
                        (!currentSlide.content ||
                          currentSlide.content.length === 0)
                          ? 1
                          : 0)
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-50'
                    "
                  >
                    <div
                      class="p-8 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl"
                    >
                      <component
                        :is="IconMap[currentSlide.icon]"
                        class="w-24 h-24 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                      />
                    </div>
                  </div>

                  <!-- Title Content Items (New) -->
                  <div
                    v-if="
                      currentSlide.content && currentSlide.content.length > 0
                    "
                    class="flex flex-col items-center space-y-4 pt-8"
                  >
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="text-3xl lg:text-4xl text-white font-semibold drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] transition-all duration-700"
                      :class="
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                      "
                      v-html="item"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- BULLETS LAYOUT -->
              <div
                v-else-if="currentSlide.layout.type === 'bullets'"
                class="flex flex-col lg:flex-row h-full w-full transition-colors duration-1000 relative overflow-hidden"
              >
                <!-- Premium Background Decoration -->
                <div
                  class="absolute inset-0 pointer-events-none overflow-hidden bg-[#fafaf9] z-0"
                >
                  <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ecfdf5_0%,transparent_50%)]"
                  ></div>
                  <div
                    class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/30 rounded-full blur-[100px] animate-pulse duration-[10s]"
                  ></div>
                  <div
                    class="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-orange-50/40 rounded-full blur-[120px] animate-pulse duration-[12s] [animation-delay:2s]"
                  ></div>

                  <!-- Floating Icons (Subtle) -->
                  <div
                    class="absolute top-[15%] right-[15%] opacity-[0.02] rotate-12 animate-bounce duration-[25s]"
                  >
                    <component
                      :is="IconMap['Leaf']"
                      class="w-32 h-32 text-emerald-900"
                    />
                  </div>
                  <div
                    class="absolute bottom-[20%] left-[5%] opacity-[0.02] -rotate-12 animate-pulse duration-[18s]"
                  >
                    <component
                      :is="IconMap['Heart']"
                      class="w-24 h-24 text-emerald-900"
                    />
                  </div>

                  <!-- Grainy Overlay -->
                  <div
                    class="absolute inset-0 opacity-[0.3] mix-blend-overlay"
                    style="
                      background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E&quot;);
                    "
                  ></div>
                </div>
                <div
                  class="w-full lg:w-[55%] p-12 lg:p-20 flex flex-col justify-center relative z-10"
                >
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-200/50 shadow-sm transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-emerald-800 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <h2
                    class="text-5xl lg:text-6xl font-black mb-12 border-l-8 pl-6 leading-tight drop-shadow-sm transition-all duration-700 flex items-center gap-6"
                    :class="[
                      currentSlide.id === 'consequences-4'
                        ? 'text-red-900 border-red-600'
                        : 'text-emerald-800 border-orange-500',
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5',
                    ]"
                  >
                    <component
                      v-if="currentSlide.icon"
                      :is="IconMap[currentSlide.icon]"
                      class="w-16 h-16 text-orange-500 flex-shrink-0"
                    />
                    <span v-html="currentSlide.title"></span>
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
                        class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-200 shadow-inner"
                      >
                        <component
                          :is="
                            currentSlide.itemIcons &&
                            currentSlide.itemIcons[idx]
                              ? IconMap[currentSlide.itemIcons[idx]]
                              : currentSlide.icon
                                ? IconMap[currentSlide.icon]
                                : CheckCircle2
                          "
                          class="w-8 h-8 text-emerald-600"
                        />
                      </div>
                      <span class="leading-snug flex-1" v-html="item"></span>
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

              <!-- CONSEQUENCES BULLETS LAYOUT (Dark Theme) -->
              <div
                v-else-if="currentSlide.layout.type === 'consequences-bullets'"
                class="flex flex-col lg:flex-row h-full w-full transition-colors duration-1000 relative overflow-hidden"
              >
                <!-- Dark Background Decoration -->
                <div
                  class="absolute inset-0 pointer-events-none overflow-hidden bg-zinc-900 z-0"
                >
                  <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(153,27,27,0.15)_0%,transparent_50%)]"
                  ></div>
                  <div
                    class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[100px] animate-pulse duration-[10s]"
                  ></div>
                  <div
                    class="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-zinc-900/50 rounded-full blur-[120px] animate-pulse duration-[12s] [animation-delay:2s]"
                  ></div>

                  <!-- Scanline effect for more "serious" feel -->
                  <div
                    class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-1 bg-[length:100%_2px,3px_100%]"
                  ></div>

                  <!-- Grainy Overlay -->
                  <div
                    class="absolute inset-0 opacity-[0.2] mix-blend-overlay"
                    style="
                      background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E&quot;);
                    "
                  ></div>
                </div>

                <div
                  class="w-full lg:w-[55%] p-12 lg:p-20 flex flex-col justify-center relative z-10"
                >
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-red-950/40 backdrop-blur-xl rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-red-400 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <h2
                    class="text-5xl lg:text-6xl font-black mb-12 border-l-8 pl-6 leading-tight transition-all duration-700 flex items-center gap-6 text-white border-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5'
                    "
                  >
                    <component
                      v-if="currentSlide.icon"
                      :is="IconMap[currentSlide.icon]"
                      class="w-16 h-16 text-red-500 flex-shrink-0"
                    />
                    <span v-html="currentSlide.title"></span>
                  </h2>
                  <div class="flex flex-col space-y-5 max-w-4xl relative">
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="flex items-center space-x-6 bg-zinc-900/50 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-white/5 p-5 rounded-3xl text-2xl lg:text-3xl text-zinc-300 font-semibold transition-all duration-500"
                      :class="
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-x-0 border-red-500/20'
                          : 'opacity-0 -translate-x-10'
                      "
                    >
                      <div
                        class="w-14 h-14 bg-red-950/50 rounded-full flex items-center justify-center shrink-0 border border-red-500/30 shadow-[inset_0_0_10px_rgba(220,38,38,0.2)]"
                      >
                        <component
                          :is="
                            currentSlide.itemIcons &&
                            currentSlide.itemIcons[idx]
                              ? IconMap[currentSlide.itemIcons[idx]]
                              : currentSlide.icon
                                ? IconMap[currentSlide.icon]
                                : AlertTriangle
                          "
                          class="w-8 h-8 text-red-500"
                        />
                      </div>
                      <span class="leading-snug flex-1" v-html="item"></span>
                    </div>
                  </div>
                </div>
                <div class="w-[45%] relative hidden lg:block p-10">
                  <div
                    class="absolute inset-0 bg-red-600/5 blur-[100px] z-0"
                  ></div>
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Consequence"
                    class-name="w-full h-full object-cover object-center rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 brightness-90 contrast-110"
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
                  <!-- Overlay to improve text readability on bright images -->
                  <div
                    v-if="
                      ['intro-4', 'performance-6', 'consequences-5'].includes(
                        currentSlide.id,
                      )
                    "
                    class="absolute inset-8 rounded-[4rem] bg-black/40 backdrop-blur-[2px]"
                  ></div>
                </div>

                <div class="relative z-10 w-full max-w-5xl">
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-200/50 shadow-sm transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-emerald-800 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <component
                    :is="currentSlide.icon ? IconMap[currentSlide.icon] : Quote"
                    class="w-20 h-20 text-orange-400 mx-auto mb-8 opacity-60"
                  />
                  <h2
                    class="font-bold italic transition-all duration-700"
                    :class="[
                      ['intro-4', 'performance-6', 'consequences-5'].includes(
                        currentSlide.id,
                      )
                        ? 'text-white text-6xl md:text-7xl lg:text-8xl leading-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]'
                        : 'text-emerald-900 text-5xl md:text-6xl leading-snug drop-shadow-sm',
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5',
                    ]"
                  >
                    &ldquo;<span v-html="currentSlide.title"></span>&rdquo;
                  </h2>
                  <div
                    v-if="currentSlide.content.length > 0"
                    class="mt-8 space-y-6"
                  >
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="text-2xl md:text-3xl font-medium transition-all duration-700"
                      :class="[
                        ['intro-4', 'performance-6', 'consequences-5'].includes(
                          currentSlide.id,
                        )
                          ? 'text-white'
                          : 'text-emerald-800/80',
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-5',
                      ]"
                      v-html="item"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- CONSEQUENCES QUOTE LAYOUT (Dark Theme) -->
              <div
                v-else-if="currentSlide.layout.type === 'consequences-quote'"
                class="flex items-center justify-center p-16 h-full bg-zinc-900 text-center relative overflow-hidden w-full"
              >
                <!-- Background Decoration -->
                <div class="absolute inset-0 z-0">
                  <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(153,27,27,0.1)_0%,transparent_70%)]"
                  ></div>
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Background"
                    class-name="w-full h-full object-cover rounded-[4rem] shadow-2xl opacity-60 contrast-110"
                  />
                  <!-- Dark Red Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/30 to-zinc-900/80 backdrop-blur-[1px]"
                  ></div>
                </div>

                <div class="relative z-10 w-full max-w-5xl">
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-red-950/40 backdrop-blur-xl rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-red-400 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <component
                    :is="
                      currentSlide.icon
                        ? IconMap[currentSlide.icon]
                        : AlertCircle
                    "
                    class="w-20 h-20 text-red-500 mx-auto mb-8 opacity-80 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  />
                  <h2
                    class="font-bold italic transition-all duration-700 text-white text-6xl md:text-7xl lg:text-8xl leading-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    :class="[
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5',
                    ]"
                  >
                    &ldquo;<span v-html="currentSlide.title"></span>&rdquo;
                  </h2>
                  <div
                    v-if="currentSlide.content.length > 0"
                    class="mt-12 space-y-8"
                  >
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="text-2xl md:text-3xl font-medium transition-all duration-700 text-zinc-300 drop-shadow-md"
                      :class="[
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-5',
                      ]"
                      v-html="item"
                    ></div>
                  </div>
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
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-200/50 shadow-sm transition-all duration-700"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-emerald-800 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <h2
                    class="text-5xl lg:text-6xl font-black text-emerald-800 mb-12 leading-tight pr-8 drop-shadow-sm transition-all duration-700 flex items-center gap-6"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5'
                    "
                  >
                    <component
                      v-if="currentSlide.icon"
                      :is="IconMap[currentSlide.icon]"
                      class="w-16 h-16 text-orange-500 flex-shrink-0"
                    />
                    <span v-html="currentSlide.title"></span>
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
                      <div class="flex items-center gap-6">
                        <div
                          v-if="
                            (currentSlide.itemIcons &&
                              currentSlide.itemIcons[idx]) ||
                            currentSlide.icon
                          "
                          class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        >
                          <component
                            :is="
                              IconMap[
                                currentSlide.itemIcons &&
                                currentSlide.itemIcons[idx]
                                  ? currentSlide.itemIcons[idx]
                                  : currentSlide.icon
                              ]
                            "
                            class="w-10 h-10 text-orange-600"
                          />
                        </div>
                        <span v-html="item"></span>
                      </div>
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

              <!-- CONSEQUENCES SPLIT LAYOUT (Dark Theme) -->
              <div
                v-else-if="currentSlide.layout.type === 'consequences-split'"
                class="flex flex-col lg:flex-row h-full w-full bg-zinc-900"
              >
                <div
                  class="w-full lg:w-1/2 p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden"
                >
                  <!-- Background Pattern -->
                  <div
                    class="absolute inset-0 opacity-[0.05] pointer-events-none"
                  >
                    <div
                      class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#ef4444_0%,transparent_50%)]"
                    ></div>
                  </div>

                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-red-950/40 backdrop-blur-xl rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-700 relative z-10"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-red-400 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <h2
                    class="text-5xl lg:text-6xl font-black text-white mb-12 leading-tight pr-8 transition-all duration-700 flex items-center gap-6 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5'
                    "
                  >
                    <component
                      v-if="currentSlide.icon"
                      :is="IconMap[currentSlide.icon]"
                      class="w-16 h-16 text-red-500 flex-shrink-0"
                    />
                    <span v-html="currentSlide.title"></span>
                  </h2>
                  <div class="space-y-6 relative z-10">
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="p-8 bg-zinc-900/80 backdrop-blur-md rounded-[2rem] text-3xl lg:text-4xl text-zinc-300 font-bold border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500"
                      :class="
                        !currentSlide.layout.progressive || currentStep > idx
                          ? 'opacity-100 translate-y-0 border-red-500/10'
                          : 'opacity-0 translate-y-10'
                      "
                    >
                      <div class="flex items-center gap-6">
                        <div
                          v-if="
                            (currentSlide.itemIcons &&
                              currentSlide.itemIcons[idx]) ||
                            currentSlide.icon
                          "
                          class="w-16 h-16 bg-red-950/50 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/20"
                        >
                          <component
                            :is="
                              IconMap[
                                currentSlide.itemIcons &&
                                currentSlide.itemIcons[idx]
                                  ? currentSlide.itemIcons[idx]
                                  : currentSlide.icon
                              ]
                            "
                            class="w-10 h-10 text-red-500"
                          />
                        </div>
                        <span v-html="item"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 flex-1 p-8 relative">
                  <div
                    class="absolute inset-0 bg-red-600/5 blur-[80px] z-0"
                  ></div>
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt="Consequence Visual"
                    img-class-name="object-right"
                    class-name="w-full h-full object-cover object-center rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 brightness-90 contrast-110"
                  />
                </div>
              </div>

              <!-- IMAGE GRID LAYOUT -->
              <div
                v-else-if="currentSlide.layout.type === 'image-grid'"
                class="flex flex-col p-12 lg:p-16 h-full bg-emerald-50 justify-center w-full relative"
              >
                <div
                  v-if="currentSlide.subtitle"
                  class="inline-block mb-6 px-8 py-3 bg-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-200/50 shadow-sm transition-all duration-700 mx-auto"
                  :class="
                    !currentSlide.layout.progressive || currentStep >= 0
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-5'
                  "
                >
                  <span
                    class="text-xl lg:text-2xl text-emerald-800 font-bold tracking-widest uppercase"
                    v-html="currentSlide.subtitle"
                  ></span>
                </div>
                <h2
                  class="text-5xl lg:text-6xl font-black text-emerald-800 mb-12 text-center z-10 tracking-tight drop-shadow-sm transition-all duration-700 flex items-center justify-center gap-6"
                  :class="
                    !currentSlide.layout.progressive || currentStep >= 0
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-5'
                  "
                >
                  <component
                    v-if="currentSlide.icon"
                    :is="IconMap[currentSlide.icon]"
                    class="w-16 h-16 text-orange-500 flex-shrink-0"
                  />
                  <span v-html="currentSlide.title"></span>
                </h2>
                <div
                  class="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full z-10"
                >
                  <div
                    v-for="(item, idx) in currentSlide.content"
                    :key="idx"
                    class="relative bg-white rounded-[2.5rem] flex flex-col items-center justify-center p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 group overflow-hidden transition-all duration-500"
                    :class="[
                      !currentSlide.layout.progressive || currentStep > idx
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10',
                      currentSlide.layout.progressive && currentStep === idx + 1
                        ? 'is-active-step'
                        : '',
                    ]"
                  >
                    <div
                      class="w-full aspect-square rounded-[2rem] overflow-hidden mb-6 relative"
                    >
                      <PremiumImage
                        :src="getSlideImage('tips-4-grid', idx)"
                        class-name="absolute inset-0 w-full h-full object-cover group-[.is-active-step]:scale-110 transition-transform duration-700"
                        :lazy="true"
                      />
                      <div
                        v-if="
                          currentSlide.meta?.labels &&
                          currentSlide.meta.labels[idx]
                        "
                        class="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 z-20"
                      >
                        {{ currentSlide.meta.labels[idx] }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 mb-4">
                      <Leaf class="w-6 h-6 text-orange-500" />
                      <h3
                        class="text-2xl font-bold text-slate-800 text-center"
                        v-html="item"
                      ></h3>
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
                  <div class="absolute inset-0 opacity-30 pointer-events-none">
                    <PremiumImage
                      :src="getSlideImage(currentSlide.id)"
                      alt=""
                      class-name="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    class="w-full lg:w-1/2 p-8 text-center lg:text-left z-10"
                  >
                    <div
                      v-if="currentSlide.subtitle"
                      class="inline-block mb-6 px-8 py-3 bg-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-200/50 shadow-sm transition-all duration-700"
                      :class="
                        !currentSlide.layout.progressive || currentStep >= 0
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 -translate-y-5'
                      "
                    >
                      <span
                        class="text-xl lg:text-2xl text-emerald-800 font-bold tracking-widest uppercase"
                        v-html="currentSlide.subtitle"
                      ></span>
                    </div>
                    <h2
                      class="text-6xl lg:text-7xl font-black mb-8 text-emerald-800 leading-tight border-l-8 border-orange-500 pl-6 flex items-center gap-6"
                    >
                      <component
                        v-if="currentSlide.icon"
                        :is="IconMap[currentSlide.icon]"
                        class="w-16 h-16 text-orange-500 flex-shrink-0"
                      />
                      {{ currentSlide.title }}
                    </h2>
                    <p
                      class="text-3xl lg:text-4xl text-slate-700 font-medium leading-relaxed transition-all duration-700"
                      :class="
                        currentStep > 0
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-10'
                      "
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
                    class="w-full lg:w-1/2 h-[500px] relative mt-12 lg:mt-0 flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 p-10 transition-all duration-1000"
                    :class="
                      currentStep > 1
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90'
                    "
                  >
                    <!-- Decorative Background Glow -->
                    <div
                      class="absolute w-64 h-64 bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none"
                    ></div>
                    <div
                      class="absolute w-48 h-48 bg-orange-400/20 blur-[80px] rounded-full translate-x-20 -translate-y-10 pointer-events-none"
                    ></div>

                    <svg
                      viewBox="0 0 400 400"
                      class="w-[85%] h-[85%] -rotate-90 drop-shadow-xl"
                    >
                      <defs>
                        <filter
                          id="glow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feComposite
                            in="SourceGraphic"
                            in2="blur"
                            operator="over"
                          />
                        </filter>
                        <linearGradient
                          id="orangeGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            style="stop-color: #fb923c; stop-opacity: 1"
                          />
                          <stop
                            offset="100%"
                            style="stop-color: #f97316; stop-opacity: 1"
                          />
                        </linearGradient>
                      </defs>
                      <!-- Base Circle (Green - 80%) -->
                      <circle
                        cx="200"
                        cy="200"
                        r="160"
                        fill="none"
                        stroke="#34d399"
                        stroke-width="48"
                        stroke-linecap="round"
                        stroke-dasharray="1005.3"
                        :stroke-dashoffset="currentStep > 1 ? 0 : 1005.3"
                        class="transition-all duration-[1.5s] ease-in-out opacity-10"
                      />
                      <circle
                        cx="200"
                        cy="200"
                        r="160"
                        fill="none"
                        stroke="#34d399"
                        stroke-width="48"
                        stroke-linecap="round"
                        stroke-dasharray="804.24 1005.3"
                        :stroke-dashoffset="currentStep > 1 ? -201.06 : 804.24"
                        class="transition-all duration-[1.5s] ease-in-out delay-300"
                      />
                      <!-- Highlight Segment (Orange - 20%) -->
                      <circle
                        cx="200"
                        cy="200"
                        r="160"
                        fill="none"
                        stroke="url(#orangeGradient)"
                        stroke-width="52"
                        stroke-linecap="round"
                        stroke-dasharray="201.06 1005.3"
                        :stroke-dashoffset="currentStep > 1 ? 0 : 201.06"
                        class="transition-all duration-[1.2s] ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-150"
                        filter="url(#glow)"
                      />
                    </svg>
                    <div
                      class="absolute flex flex-col items-center justify-center inset-0 pointer-events-none transition-all duration-1000"
                      :class="
                        currentStep > 1
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-50 translate-y-8'
                      "
                    >
                      <div
                        class="bg-emerald-50 p-6 rounded-full shadow-lg border border-emerald-100 mb-4 animate-bounce-subtle"
                      >
                        <component
                          :is="
                            currentSlide.icon
                              ? IconMap[currentSlide.icon]
                              : BrainCircuit
                          "
                          class="w-16 h-16 text-emerald-600"
                        />
                      </div>
                      <div class="flex flex-col items-center">
                        <span
                          class="text-7xl font-black text-slate-800 tracking-tighter drop-shadow-md"
                        >
                          20<span class="text-orange-500 font-extrabold"
                            >%</span
                          >
                        </span>
                        <span
                          class="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mt-1"
                          >Energy usage</span
                        >
                      </div>
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
                  <div
                    v-if="currentSlide.subtitle"
                    class="inline-block mb-6 px-8 py-3 bg-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-200/50 shadow-sm transition-all duration-700 z-10"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-5'
                    "
                  >
                    <span
                      class="text-xl lg:text-2xl text-emerald-800 font-bold tracking-widest uppercase"
                      v-html="currentSlide.subtitle"
                    ></span>
                  </div>
                  <h2
                    class="text-6xl md:text-7xl font-black mb-24 tracking-tight text-emerald-900 text-center drop-shadow-sm z-10 flex items-center gap-6"
                  >
                    <component
                      v-if="currentSlide.icon"
                      :is="IconMap[currentSlide.icon]"
                      class="w-16 h-16 text-orange-500"
                    />
                    {{ currentSlide.title }}
                  </h2>
                  <div
                    class="w-full max-w-5xl relative h-48 bg-white rounded-[4rem] shadow-inner border border-slate-200 flex items-center p-4"
                  >
                    <div
                      class="h-full rounded-[3rem] transition-all duration-[1.5s] ease-in-out"
                      :class="
                        currentStep > 0
                          ? 'bg-red-400 w-[15%] shadow-[0_0_40px_rgba(239,68,68,0.6)]'
                          : 'bg-emerald-400 w-[100%] shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                      "
                    ></div>
                    <div
                      class="absolute right-[-40px] top-1/2 -translate-y-1/2 w-10 h-24 bg-slate-300 rounded-r-3xl shadow-sm"
                    />
                    <div
                      class="absolute inset-0 flex items-center justify-center text-4xl font-black tracking-widest text-slate-800 pointer-events-none drop-shadow-md uppercase"
                    >
                      <transition name="fade" mode="out-in">
                        <span :key="currentStep">
                          {{
                            currentStep === 0
                              ? "ENERGY: 100%"
                              : currentStep === 1
                                ? "WARNING: CRITICAL"
                                : "SYSTEM FAILURE"
                          }}
                        </span>
                      </transition>
                    </div>
                  </div>
                  <div
                    class="mt-16 text-3xl font-bold text-red-600 bg-red-50 px-10 py-5 rounded-3xl shadow-lg flex items-center gap-4 border border-red-200 transition-all duration-500"
                    :class="
                      currentStep === 1
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-5'
                    "
                  >
                    <AlertCircle class="w-10 h-10" />
                    <span>CORTISOL LEVELS RISING...</span>
                  </div>
                  <div
                    class="mt-6 text-3xl font-bold text-red-700 bg-red-100 px-10 py-5 rounded-3xl shadow-xl flex items-center gap-4 border border-red-300 transition-all duration-500 animate-pulse"
                    :class="
                      currentStep > 1
                        ? 'opacity-100 translate-y-0 scale-110'
                        : 'opacity-0 translate-y-5'
                    "
                  >
                    <AlertCircle class="w-10 h-10" />
                    <span>BRAIN CAPACITY: 20%</span>
                  </div>
                </div>
              </div>

              <!-- InsightCanvas (Integrated Recap Dashboard) -->
              <!-- InsightCanvas (Big Picture Mind Map) -->
              <div
                v-else-if="currentSlide.layout.type === 'InsightCanvas'"
                class="relative h-full w-full bg-slate-50 overflow-hidden flex flex-col items-center justify-center p-12"
              >
                <!-- Background Image generated for Recap -->
                <div
                  class="absolute inset-0 z-0 opacity-80 pointer-events-none"
                >
                  <PremiumImage
                    :src="getSlideImage('recap')"
                    class-name="w-full h-full object-cover"
                  />
                </div>

                <!-- Neural Network Background Elements -->
                <div class="absolute inset-0 z-0">
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/20 rounded-full animate-[ping_10s_linear_infinite]"
                  ></div>
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/20 rounded-full animate-[ping_7s_linear_infinite]"
                  ></div>
                </div>

                <div
                  class="relative z-10 w-full max-w-7xl flex flex-col items-center"
                >
                  <!-- Header Area -->
                  <div class="text-center mb-16 space-y-4 relative z-20">
                    <div
                      class="inline-block px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse"
                    >
                      [ Brain State Awareness ]
                    </div>
                    <h2
                      class="text-6xl lg:text-7xl font-black text-emerald-950 tracking-tighter flex items-center justify-center gap-6"
                    >
                      <div
                        class="p-4 bg-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-float"
                      >
                        <component
                          :is="IconMap[currentSlide.icon] || BrainCircuit"
                          class="w-12 h-12 text-white"
                        />
                      </div>
                      {{ currentSlide.title }}
                    </h2>
                  </div>

                  <!-- Mind Map Container -->
                  <div
                    class="relative w-full h-[600px] flex items-center justify-center"
                  >
                    <!-- Global Visual Connections -->
                    <svg
                      class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                    >
                      <line
                        v-for="(pos, idx) in [
                          { x: '-380px', y: '-180px', hex: '#10b981' },
                          { x: '380px', y: '-180px', hex: '#3b82f6' },
                          { x: '-380px', y: '180px', hex: '#f59e0b' },
                          { x: '380px', y: '180px', hex: '#ef4444' },
                        ]"
                        :key="`line-${idx}`"
                        x1="50%"
                        y1="50%"
                        :x2="`calc(50% + ${pos.x})`"
                        :y2="`calc(50% + ${pos.y})`"
                        :stroke="pos.hex"
                        stroke-width="2"
                        stroke-dasharray="8 8"
                        class="transition-opacity duration-1000 animate-dash"
                        :class="currentStep > idx ? 'opacity-40' : 'opacity-0'"
                      />
                    </svg>

                    <!-- Central Core -->
                    <div
                      class="relative z-20 group"
                      :class="currentStep === 0 ? 'is-active-step' : ''"
                    >
                      <div
                        class="absolute inset-0 bg-emerald-500 rounded-full blur-[100px] opacity-30 group-[.is-active-step]:opacity-50 transition-opacity"
                      ></div>
                      <div
                        class="relative w-56 h-56 bg-white rounded-[3rem] border-2 border-emerald-200 shadow-2xl flex flex-col items-center justify-center overflow-hidden animate-float"
                      >
                        <div class="absolute inset-0 opacity-40">
                          <PremiumImage
                            :src="getSlideImage(currentSlide.id)"
                            class-name="w-full h-full object-cover grayscale scale-110 group-[.is-active-step]:scale-125 transition-transform duration-[10s]"
                          />
                        </div>
                        <div
                          class="relative z-10 text-center p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white mx-4 shadow-sm"
                        >
                          <span
                            class="text-emerald-700 font-mono text-[9px] block mb-1 uppercase tracking-widest"
                            >Core Insight</span
                          >
                          <span
                            class="text-slate-900 font-black text-xl tracking-tight leading-none uppercase"
                            >Full Recap</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Knowledge Nodes -->
                    <div
                      v-for="(pos, idx) in [
                        {
                          x: '-380px',
                          y: '-180px',
                          color: 'emerald',
                          hex: '#10b981',
                        },
                        {
                          x: '380px',
                          y: '-180px',
                          color: 'blue',
                          hex: '#3b82f6',
                        },
                        {
                          x: '-380px',
                          y: '180px',
                          color: 'orange',
                          hex: '#f59e0b',
                        },
                        {
                          x: '380px',
                          y: '180px',
                          color: 'red',
                          hex: '#ef4444',
                        },
                      ]"
                      :key="idx"
                      class="absolute transition-all duration-1000"
                      :style="{
                        transform: `translate(${pos.x}, ${pos.y})`,
                        opacity: currentStep > idx ? 1 : 0,
                        transitionDelay: `${idx * 150}ms`,
                      }"
                    >
                      <!-- Node Card -->
                      <div
                        class="relative w-[340px] bg-white/90 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white shadow-xl group transition-all duration-500 z-10 animate-float"
                        :class="
                          currentStep === idx + 1
                            ? 'is-active-step -translate-y-2'
                            : ''
                        "
                        :style="{ animationDelay: `${idx * 0.5}s` }"
                      >
                        <div
                          class="absolute top-6 right-8 w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm"
                          :style="{
                            backgroundColor: pos.hex + '1a',
                            color: pos.hex,
                          }"
                        >
                          <component
                            :is="
                              IconMap[currentSlide.itemIcons[idx]] ||
                              CheckCircle2
                            "
                            class="w-8 h-8"
                          />
                        </div>
                        <div class="space-y-4 pr-16">
                          <div class="flex items-center gap-3">
                            <div
                              class="w-2.5 h-2.5 rounded-full"
                              :style="{
                                backgroundColor: pos.hex,
                                boxShadow: `0 0 10px ${pos.hex}`,
                              }"
                            ></div>
                            <span
                              class="font-mono text-[10px] uppercase tracking-[0.3em] font-bold"
                              :style="{ color: pos.hex }"
                              >{{
                                idx < 2 ? "Logic Node" : "Physical Node"
                              }}</span
                            >
                          </div>
                          <p
                            class="text-2xl font-bold text-slate-800 leading-tight"
                            v-html="currentSlide.content[idx]"
                          ></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- GlitchEffect (Cyberpunk Style Error) -->
              <div
                v-else-if="currentSlide.layout.type === 'GlitchEffect'"
                class="flex flex-col items-center justify-center h-full bg-black w-full p-20 relative overflow-hidden"
              >
                <!-- Background Image with Matrix-like Treatment -->
                <div
                  class="absolute inset-0 opacity-15 pointer-events-none grayscale contrast-150 scale-110 blur-[2px]"
                >
                  <PremiumImage
                    :src="getSlideImage(currentSlide.id)"
                    alt=""
                    class-name="w-full h-full object-cover"
                  />
                </div>

                <!-- Overlays -->
                <div class="scanline-overlay"></div>
                <div class="vignette"></div>

                <!-- Alert Content -->
                <div class="relative z-30 flex flex-col items-center">
                  <!-- Subtitle/Category -->
                  <div
                    v-if="currentSlide.subtitle"
                    class="mb-8 px-6 py-2 bg-red-600/20 text-red-500 font-mono text-sm tracking-[0.5em] border border-red-500/30 animate-pulse uppercase"
                    :class="
                      !currentSlide.layout.progressive || currentStep >= 0
                        ? 'opacity-100'
                        : 'opacity-0'
                    "
                  >
                    [ {{ currentSlide.subtitle }} ]
                  </div>

                  <!-- Main Glitch Title -->
                  <div class="relative mb-12 flex flex-col items-center">
                    <h2
                      class="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase glitch-text flex flex-col md:flex-row items-center gap-6 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      :data-text="currentSlide.title"
                    >
                      <component
                        v-if="currentSlide.icon"
                        :is="IconMap[currentSlide.icon]"
                        class="w-12 h-12 text-red-500 mb-4 md:mb-0"
                      />
                      {{ currentSlide.title }}
                    </h2>
                  </div>

                  <!-- Terminal Style Content Blocks -->
                  <div class="flex flex-col space-y-4 w-full max-w-4xl">
                    <div
                      v-for="(item, idx) in currentSlide.content"
                      :key="idx"
                      class="group relative overflow-hidden transition-all duration-300"
                      :class="[
                        currentStep > idx
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-10',
                        currentStep === idx + 1 ? 'is-active-step' : '',
                      ]"
                    >
                      <div
                        class="absolute inset-0 bg-red-600/5 group-[.is-active-step]:bg-red-600/10 transition-colors"
                      ></div>
                      <div
                        class="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                      ></div>

                      <div
                        class="relative px-8 py-6 border border-white/5 backdrop-blur-sm"
                      >
                        <div class="flex items-start gap-4">
                          <span
                            class="text-red-500 font-mono text-lg opacity-80 mt-1"
                            >>></span
                          >
                          <div class="flex flex-col">
                            <span
                              class="text-red-500/60 font-mono text-xs uppercase tracking-widest mb-1"
                            >
                              [{{
                                idx === 2
                                  ? "CORE_ADVICE"
                                  : "CRITICAL_ERR_0" + (idx + 1)
                              }}]
                            </span>
                            <span
                              class="text-white font-mono text-xl lg:text-3xl font-medium leading-tight"
                              :class="idx === 2 ? 'text-orange-400' : ''"
                              v-html="item"
                            ></span>
                          </div>
                        </div>
                      </div>

                      <!-- Glitch line decoration -->
                      <div
                        v-if="currentStep > idx"
                        class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-[.is-active-step]:opacity-100 transition-opacity"
                      >
                        <div
                          class="h-[1px] w-12 bg-red-500 animate-pulse"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer System Log (Extra detail) -->
                  <div
                    class="mt-12 font-mono text-[10px] text-white/30 tracking-widest uppercase flex gap-8"
                  >
                    <span>CPU_LOAD: CRITICAL</span>
                    <span>//</span>
                    <span>MEM_STATE: OVERFLOW</span>
                    <span>//</span>
                    <span>REF: CHITHANH_ENG03</span>
                  </div>
                </div>
              </div>

              <!-- Slide Layout: Team (Our Group) -->
              <div
                v-else-if="currentSlide.layout.type === 'team'"
                class="flex flex-col h-full w-full p-12 md:p-20 relative overflow-hidden bg-slate-50 items-center justify-center"
              >
                <!-- Premium Background Decoration -->
                <div
                  class="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  <!-- Background Image (Increased Opacity & Better Coverage) -->
                  <img
                    :src="
                      IMAGE_BASE_URL +
                      'assets/images/backgrounds/healthy_breakfast_bg.png'
                    "
                    class="absolute inset-0 w-full h-full object-none opacity-80 scale-100"
                  />

                  <!-- Soft Spotlight & Gradient Overlays (Rebalanced for full-bleed feel) -->
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70"
                  ></div>
                  <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,rgba(250,250,249,0.4)_100%)]"
                  ></div>

                  <!-- Advanced Mesh Gradients (Softened) -->
                  <div
                    class="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-200/15 rounded-full blur-[120px] animate-pulse duration-[12s]"
                  ></div>
                  <div
                    class="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-orange-100/20 rounded-full blur-[150px] animate-pulse duration-[15s] [animation-delay:3s]"
                  ></div>
                  <div
                    class="absolute top-[30%] right-[-15%] w-[40%] h-[40%] bg-yellow-50/25 rounded-full blur-[100px] animate-pulse duration-[10s] [animation-delay:5s]"
                  ></div>

                  <!-- Floating Thematic Elements (Subtle decorations) -->
                  <div
                    class="absolute top-[10%] left-[5%] opacity-[0.02] rotate-12 scale-150 animate-bounce duration-[20s]"
                  >
                    <component
                      :is="IconMap['Coffee']"
                      class="w-32 h-32 text-emerald-900"
                    />
                  </div>
                  <div
                    class="absolute bottom-[15%] right-[5%] opacity-[0.02] -rotate-12 scale-125 animate-bounce duration-[25s] [animation-delay:2s]"
                  >
                    <component
                      :is="IconMap['Leaf']"
                      class="w-40 h-40 text-emerald-900"
                    />
                  </div>
                  <div
                    class="absolute top-[40%] right-[10%] opacity-[0.01] rotate-45 scale-110 animate-pulse duration-[15s]"
                  >
                    <component
                      :is="IconMap['Apple']"
                      class="w-24 h-24 text-orange-900"
                    />
                  </div>
                  <div
                    class="absolute bottom-[20%] left-[10%] opacity-[0.01] -rotate-12 scale-150 animate-pulse duration-[18s] [animation-delay:4s]"
                  >
                    <component
                      :is="IconMap['Heart']"
                      class="w-28 h-28 text-orange-900"
                    />
                  </div>

                  <!-- Grainy Overlay for Premium Texture (Reduced) -->
                  <div
                    class="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                    style="
                      background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E&quot;);
                    "
                  ></div>

                  <!-- Subtle Geometric Grid -->
                  <div
                    class="absolute inset-0 opacity-[0.02]"
                    style="
                      background-image:
                        linear-gradient(#10b981 1px, transparent 1px),
                        linear-gradient(90deg, #10b981 1px, transparent 1px);
                      background-size: 80px 80px;
                    "
                  ></div>
                </div>

                <div
                  class="relative z-10 w-full max-w-7xl flex flex-col items-center"
                >
                  <!-- Section Title -->
                  <div class="mb-16 text-center">
                    <h2
                      class="text-4xl md:text-6xl font-black text-emerald-950 mb-4 tracking-tight flex items-center justify-center gap-4"
                    >
                      <component
                        v-if="currentSlide.icon"
                        :is="IconMap[currentSlide.icon]"
                        class="w-10 h-10 text-emerald-600"
                      />
                      {{ currentSlide.title }}
                    </h2>
                    <div
                      class="h-1.5 w-32 bg-gradient-to-r from-emerald-500 to-orange-500 mx-auto rounded-full shadow-[0_4px_10px_rgba(16,185,129,0.2)]"
                    ></div>
                  </div>

                  <!-- Team Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-8 w-full">
                    <div
                      v-for="(member, idx) in currentSlide.meta.members"
                      :key="idx"
                      class="group flex flex-col items-center transition-all duration-1000 transform cursor-pointer"
                      @click="activeMemberIdx = idx"
                      :class="[
                        currentStep > idx
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-20',
                        currentStep === idx + 1 ? 'is-active-step' : '',
                      ]"
                    >
                      <!-- Avatar Section -->
                      <div class="relative mb-8">
                        <!-- Outer Shadow/Glow -->
                        <div
                          class="absolute -inset-2 bg-gradient-to-tr from-emerald-100 to-orange-100 rounded-full transition duration-700 blur-lg opacity-0 group-[.is-active-step]:opacity-100"
                        ></div>

                        <!-- Image Container -->
                        <div
                          class="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/40 backdrop-blur-md transition-all duration-500 border-white/80 group-[.is-active-step]:border-emerald-500 group-[.is-active-step]:scale-105"
                        >
                          <img
                            :src="
                              IMAGE_BASE_URL +
                              'assets/images/avatars/' +
                              member.avatar
                            "
                            :alt="member.name"
                            class="w-full h-full object-cover transition-all duration-700"
                          />
                        </div>

                        <!-- Leader Badge -->
                        <div
                          v-if="member.role === 'Leader'"
                          class="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/40 uppercase tracking-widest z-20"
                        >
                          Leader
                        </div>
                      </div>

                      <!-- Text Info -->
                      <div class="text-center">
                        <h3
                          class="text-xl md:text-2xl font-bold mb-1 transition-colors duration-300 text-emerald-950 group-[.is-active-step]:text-emerald-600"
                        >
                          {{ member.name }}
                        </h3>
                        <p
                          class="font-mono text-xs md:text-sm text-emerald-800/50 font-bold tracking-widest"
                        >
                          MSSV: {{ member.id }}
                        </p>
                      </div>
                    </div>
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
      <Confetti ref="confettiRef" />
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

.grammar-focus {
  color: #f97316 !important;
  font-weight: 800 !important;
  text-decoration: underline !important;
  text-decoration-color: rgba(253, 186, 116, 0.5) !important;
  text-underline-offset: 4px !important;
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

/* HIGH-END GLITCH EFFECTS */
@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  20% {
    transform: skew(3deg);
  }
  24% {
    transform: skew(-3deg);
  }
  28% {
    transform: skew(0deg);
  }
  70% {
    transform: skew(0deg);
  }
  71% {
    transform: skew(-10deg);
  }
  72% {
    transform: skew(10deg);
  }
  73% {
    transform: skew(0deg);
  }
  100% {
    transform: skew(0deg);
  }
}

@keyframes glitch-anim {
  0% {
    clip: rect(20px, 9999px, 21px, 0);
    transform: translateX(0);
  }
  2% {
    clip: rect(80px, 9999px, 85px, 0);
    transform: translateX(-5px);
  }
  4% {
    clip: rect(10px, 9999px, 15px, 0);
    transform: translateX(5px);
  }
  6% {
    clip: rect(20px, 9999px, 21px, 0);
    transform: translateX(0);
  }
  100% {
    clip: rect(20px, 9999px, 21px, 0);
    transform: translateX(0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip: rect(50px, 9999px, 52px, 0);
    transform: translateX(0);
  }
  3% {
    clip: rect(10px, 9999px, 12px, 0);
    transform: translateX(5px);
  }
  6% {
    clip: rect(90px, 9999px, 95px, 0);
    transform: translateX(-5px);
  }
  9% {
    clip: rect(50px, 9999px, 52px, 0);
    transform: translateX(0);
  }
  100% {
    clip: rect(50px, 9999px, 52px, 0);
    transform: translateX(0);
  }
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  left: 3px;
  text-shadow: -2px 0 #ff00c1;
  animation: glitch-anim 4s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -3px;
  text-shadow: 2px 0 #00fff9;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

.scanline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.06),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.06)
    );
  background-size:
    100% 4px,
    3px 100%;
  pointer-events: none;
  z-index: 20;
}

.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 21;
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  52% {
    opacity: 1;
  }
  54% {
    opacity: 0.7;
  }
  56% {
    opacity: 1;
  }
}

.animate-flash-fast {
  animation: flash 0.2s steps(2) infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
