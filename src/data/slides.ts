import { slideScripts } from "./scripts";

export interface SlideLayout {
  type: "title" | "bullets" | "quote" | "split" | "image-grid" | "component";
  component?: string;
  progressive?: boolean;
}

export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  speaker: string;
  content: string[];
  script: string;
  layout: SlideLayout;
  meta?: any;
}

export const rawSlides: SlideData[] = [
  // SECTION 1: INTRODUCTION (Thanh Hải)
  {
    id: "intro-1",
    title: "THE HEALTH IMPACTS OF SKIPPING BREAKFAST",
    subtitle: "Group 4 - Class: ENG03.F22.CN1.TTNT",
    speaker: "Thanh Hải",
    content: [],
    script: slideScripts["intro-1"],
    layout: { type: "title", progressive: true },
  },
  {
    id: "intro-2",
    title: "Our Team",
    speaker: "Thanh Hải",
    content: [
      "Thanh Hải (Leader)",
      "Chí Thanh",
      "Đức Ý",
      "Phước Thịnh",
      "Hoàng Sơn",
    ],
    script: slideScripts["intro-2"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "intro-3",
    title: "Agenda",
    speaker: "Thanh Hải",
    content: [
      "Scientific Health Benefits",
      "Mental and Physical Performance",
      "Consequences of Skipping",
      "Practical Prep Tips",
    ],
    script: slideScripts["intro-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "intro-4",
    title: "Is skipping breakfast just a time-saver or a hidden health-killer?",
    speaker: "Thanh Hải",
    content: [],
    script: slideScripts["intro-4"],
    layout: { type: "quote" },
  },

  // SECTION 2: HEALTH BENEFITS (Phước Thịnh)
  {
    id: "benefits-1",
    title: "Health Benefits of a Healthy Breakfast",
    subtitle: "How many of you had breakfast today?",
    speaker: "Phước Thịnh",
    content: [],
    script: slideScripts["benefits-1"],
    layout: { type: "title" },
  },
  {
    id: "benefits-2",
    title: "🔋 More Energy",
    speaker: "Phước Thịnh",
    content: ["Feel awake", "Ready for the day"],
    script: slideScripts["benefits-2"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-3",
    title: "⚖️ Better Weight Control",
    speaker: "Phước Thịnh",
    content: ["Less overeating", "Feel full longer"],
    script: slideScripts["benefits-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-4",
    title: "🥗 Important Nutrients",
    speaker: "Phước Thịnh",
    content: ["Vitamins", "Minerals", "Fiber", "Strong immune system"],
    script: slideScripts["benefits-4"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-5",
    title: "🔄 Better Digestion",
    speaker: "Phước Thịnh",
    content: ["Faster metabolism", "Use energy better"],
    script: slideScripts["benefits-5"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-6",
    title: "❤️ Heart Health",
    speaker: "Phước Thịnh",
    content: ["Lower risk of disease", "Long-term benefits"],
    script: slideScripts["benefits-6"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-7",
    title: "Summary",
    speaker: "Phước Thịnh",
    content: ["✔ More energy", "✔ Better weight", "✔ Better health"],
    script: slideScripts["benefits-7"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-8",
    title: "Impact on Mental and Physical Performance",
    subtitle: "Why does breakfast affect your performance?",
    speaker: "Phước Thịnh",
    content: [],
    script: slideScripts["benefits-8"],
    layout: { type: "title" },
  },

  // SECTION 3: MENTAL & PHYSICAL PERFORMANCE (Chí Thanh)
  {
    id: "performance-1",
    title: "System Status: [WAITING FOR POWER]",
    speaker: "Chí Thanh",
    content: [],
    script: slideScripts["performance-1"],
    layout: { type: "component", component: "GlitchEffect" },
    meta: { extraData: { text: "System Status: [WAITING FOR POWER]" } },
  },
  {
    id: "performance-2",
    title: "Did you skip breakfast?",
    speaker: "Chí Thanh",
    content: ["Morning Fuel Level"],
    script: slideScripts["performance-2"],
    layout: {
      type: "component",
      component: "BatteryProgress",
      progressive: true,
    },
  },
  {
    id: "performance-3",
    title: "The 2GB RAM Disaster",
    speaker: "Chí Thanh",
    content: ["Error: Memory Overflow", "Brain.exe has stopped working"],
    script: slideScripts["performance-3"],
    layout: { type: "component", component: "GlitchEffect", progressive: true },
    meta: { extraData: { text: "Error: Memory Overflow" } },
  },
  {
    id: "performance-4",
    title: "The 20% Energy Rule",
    speaker: "Chí Thanh",
    content: ["20% Brain Consumption", "High-Energy Task: Coding"],
    script: slideScripts["performance-4"],
    layout: { type: "component", component: "SimpleCharts", progressive: true },
    meta: { extraData: { chartType: "pie" } },
  },
  {
    id: "performance-5",
    title: "Overclocking vs. Energy Crash",
    speaker: "Chí Thanh",
    content: ["8 AM: Overclocking with Caffeine", "10 AM: System Crash"],
    script: slideScripts["performance-5"],
    layout: { type: "split", progressive: true },
  },
  {
    id: "performance-6",
    title: "Your code is only as good as your breakfast.",
    speaker: "Chí Thanh",
    content: [],
    script: slideScripts["performance-6"],
    layout: { type: "quote" },
  },

  // SECTION 4: CONSEQUENCES (Hoàng Sơn)
  {
    id: "consequences-1",
    title: "NO FUEL → LOW PERFORMANCE",
    speaker: "Hoàng Sơn",
    content: ["7 AM class – Coffee only ☕"],
    script: slideScripts["consequences-1"],
    layout: { type: "split", progressive: true },
  },
  {
    id: "consequences-2",
    title: "ENERGY CRASH + BRAIN FAILURE",
    speaker: "Hoàng Sơn",
    content: ["Brain.exe not responding 💻", "Low glucose → Low focus"],
    script: slideScripts["consequences-2"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "consequences-3",
    title: "OVEREATING EFFECT",
    speaker: "Hoàng Sơn",
    content: ["Skip → Starving → Overeating", "Junk food cycle"],
    script: slideScripts["consequences-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "consequences-4",
    title: "MOOD + LONG-TERM IMPACT",
    speaker: "Hoàng Sơn",
    content: ["Mood swings & Irritation", "Technical Debt for Health"],
    script: slideScripts["consequences-4"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "consequences-5",
    title: "Skipping breakfast costs your performance. How can we fix this?",
    speaker: "Hoàng Sơn",
    content: [],
    script: slideScripts["consequences-5"],
    layout: { type: "quote" },
  },

  // SECTION 5: TIPS (Đức Ý)
  {
    id: "tips-1",
    title: "UPGRADE YOUR START",
    subtitle: "From 'Quick Bite' to 'Brain Fuel'",
    speaker: "Đức Ý",
    content: [],
    script: slideScripts["tips-1"],
    layout: { type: "title" },
  },
  {
    id: "tips-2",
    title: "1. BALANCE YOUR MACROS",
    speaker: "Đức Ý",
    content: ["Carbs, Protein & Fiber", "Upgrade: Extra Egg + Cucumber"],
    script: slideScripts["tips-2"],
    layout: { type: "split", progressive: true },
  },
  {
    id: "tips-3",
    title: "2. RETHINK YOUR DRINK",
    speaker: "Đức Ý",
    content: ["The 'Sugar Crash' Trap", "Swap Cafe Sữa for Soy Milk"],
    script: slideScripts["tips-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "tips-4",
    title: "3. EMBRACE LOCAL PRODUCE",
    speaker: "Đức Ý",
    content: [
      "Fresh Banana",
      "Sweet Papaya",
      "Juicy Mango",
      "Local Dragonfruit",
    ],
    script: slideScripts["tips-4"],
    layout: { type: "image-grid", progressive: true },
  },
  {
    id: "tips-5",
    title: "3 STEPS TO WIN THE MORNING",
    speaker: "Đức Ý",
    content: ["Add Greens & Protein", "Cut Sugar", "Stay Fresh"],
    script: slideScripts["tips-5"],
    layout: { type: "bullets", progressive: true },
  },

  // SECTION 6: CONCLUSION (Thanh Hải)
  {
    id: "outro-1",
    title: "The Big Picture",
    speaker: "Thanh Hải",
    content: [
      "Thinh: Scientific Health Benefits ✔",
      "Thanh: Mental Performance ✔",
      "Son: Long-term Risks ✔",
      "Y: Practical Prep Tips ✔",
    ],
    script: slideScripts["outro-1"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "outro-2",
    title: "Health is the foundation of your success.",
    subtitle: "It is essential that you prioritize your breakfast.",
    speaker: "Thanh Hải",
    content: [],
    script: slideScripts["outro-2"],
    layout: { type: "title" },
  },
  {
    id: "outro-3",
    title: "THANK YOU FOR LISTENING!",
    subtitle: "Special thanks to Ms. Tien & Group 4 classmates.",
    speaker: "Thanh Hải",
    content: [],
    script: slideScripts["outro-3"],
    layout: { type: "title" },
  },
];
