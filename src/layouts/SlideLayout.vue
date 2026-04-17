<script setup lang="ts">
defineProps<{
  speaker?: string;
  id?: string;
  section?: string;
  hideFrame?: boolean; // New flag to hide header/footer for specific slides
}>();
</script>

<template>
  <div class="w-full h-full flex flex-col p-24 lg:p-32 relative overflow-hidden group/layout bg-white select-none">
    <!-- Subtle Frame Accents -->
    <div v-if="!hideFrame" class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-brand-primary/20 via-brand-accent/40 to-brand-primary/20"></div>
    
    <!-- Header -->
    <header v-if="!hideFrame" class="flex justify-between items-start z-10 shrink-0 mb-12">
      <div class="flex items-center gap-8">
        <div class="w-20 h-20 bg-brand-primary/5 rounded-[2rem] flex items-center justify-center text-brand-primary border border-brand-primary/10 transition-transform group-hover/layout:scale-105 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
        </div>
        <div>
          <h1 class="text-4xl font-black tracking-tight text-brand-header leading-none flex items-center gap-4">
            {{ section || 'Module Insight' }}
            <span class="text-brand-accent/40 block h-8 w-[3px] bg-current rounded-full"></span>
          </h1>
          <div class="flex items-center gap-4 mt-4">
            <span class="text-[12px] uppercase tracking-[0.5em] font-black text-brand-accent">UIT HEALTH ENGINE</span>
            <div class="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
            <span class="text-[12px] uppercase tracking-[0.3em] font-bold text-slate-400">SESSION ENG-03</span>
          </div>
        </div>
      </div>
      
      <div v-if="speaker" class="flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
        <div class="flex flex-col items-end">
           <span class="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Speaker</span>
           <span class="text-sm font-black uppercase tracking-widest text-slate-600">{{ speaker }}</span>
        </div>
        <div class="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
             <circle cx="12" cy="7" r="4" />
           </svg>
        </div>
      </div>
    </header>

    <!-- Content Stage -->
    <main class="flex-1 w-full min-h-0 flex flex-col relative z-10" :class="{ 'p-0': hideFrame }">
      <slot />
    </main>

    <!-- Footer Decorative -->
    <footer v-if="!hideFrame" class="flex justify-between items-center z-10 shrink-0 mt-8">
      <div class="flex items-center gap-10">
        <span class="text-[12px] uppercase tracking-[0.6em] font-black text-slate-300">VIVID BRAKFAST EMERALD • 2026</span>
      </div>
      
      <div class="flex items-center gap-8">
        <span v-if="id" class="text-[15px] font-mono font-black text-brand-accent/40 tracking-[0.4em]">{{ id }}</span>
        <div class="flex gap-2">
          <div v-for="i in 3" :key="i" class="w-2.5 h-2.5 rounded-full" :class="i === 1 ? 'bg-brand-primary' : 'bg-slate-100'"></div>
        </div>
      </div>
    </footer>

    <!-- Artistic Backdrops -->
    <div class="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-primary/5 blur-[160px] rounded-full pointer-events-none opacity-50"></div>
    <div class="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-brand-accent/5 blur-[160px] rounded-full pointer-events-none opacity-50"></div>
  </div>
</template>
