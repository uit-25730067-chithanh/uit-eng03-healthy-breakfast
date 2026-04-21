import { slideScripts } from "./scripts";

export interface SlideLayout {
  type: "title" | "bullets" | "quote" | "split" | "image-grid" | "component" | "InsightCanvas" | "GlitchEffect";
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
  icon?: string;
  itemIcons?: string[];
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
    icon: "Users",
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
    icon: "ListChecks",
    content: [
      "Scientific Health Benefits",
      "Mental and Physical Performance",
      "Consequences of Skipping",
      "Practical Prep Tips",
    ],
    itemIcons: ["Heart", "BrainCircuit", "AlertTriangle", "Rocket"],
    script: slideScripts["intro-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "intro-4",
    title: "Is skipping breakfast just a time-saver or a hidden health-killer?",
    speaker: "Thanh Hải",
    content: ["Scientific curiosity", "New perspective on routine"],
    script: slideScripts["intro-4"],
    layout: { type: "quote", progressive: true },
    icon: "AlertCircle",
  },

  // SECTION 2: HEALTH BENEFITS (Phước Thịnh)
  {
    id: "benefits-1",
    title: "Health Benefits of a Healthy Breakfast",
    subtitle: "How many of you had breakfast today?",
    speaker: "Phước Thịnh",
    content: [],
    script: slideScripts["benefits-1"],
    layout: { type: "title", progressive: true },
  },
  {
    id: "benefits-2",
    title: "More Energy",
    speaker: "Phước Thịnh",
    icon: "Zap",
    content: ["Feel awake", "Ready for the day"],
    script: slideScripts["benefits-2"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-3",
    title: "Better Weight Control",
    speaker: "Phước Thịnh",
    icon: "Scale",
    content: ["Less overeating", "Feel full longer"],
    script: slideScripts["benefits-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-4",
    title: "Important Nutrients",
    speaker: "Phước Thịnh",
    icon: "Apple",
    content: ["Vitamins", "Minerals", "Fiber", "Strong immune system"],
    itemIcons: ["Apple", "Activity", "Leaf", "Heart"],
    script: slideScripts["benefits-4"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-5",
    title: "Better Digestion",
    speaker: "Phước Thịnh",
    icon: "Activity",
    content: ["Faster metabolism", "Use energy better"],
    script: slideScripts["benefits-5"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-6",
    title: "Heart Health",
    speaker: "Phước Thịnh",
    icon: "Heart",
    content: ["Lower risk of disease", "Long-term benefits"],
    script: slideScripts["benefits-6"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "benefits-7",
    title: "Summary",
    speaker: "Phước Thịnh",
    icon: "CheckCircle2",
    content: [
      "More energy",
      "Better weight",
      "Better health",
      "Make breakfast a daily habit",
    ],
    itemIcons: ["Zap", "Scale", "Activity", "Trophy"],
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
    layout: { type: "title", progressive: true },
  },

  // SECTION 3: MENTAL & PHYSICAL PERFORMANCE (Chí Thanh)
  {
    id: "performance-1",
    title: "System Status: [WAITING FOR POWER]",
    speaker: "Chí Thanh",
    icon: "Brain",
    content: ["Hardware (Body) vs. OS (Brain)"],
    script: slideScripts["performance-1"],
    layout: { type: "GlitchEffect", progressive: true },
    meta: { extraData: { text: "System Status: [WAITING FOR POWER]" } },
  },
  {
    id: "performance-2",
    title: "Did you skip breakfast?",
    speaker: "Chí Thanh",
    icon: "Battery",
    content: ["Morning Fuel Level", "The 'Unpowered' Reality"],
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
    icon: "Cpu",
    content: [
      "Error: Memory Overflow",
      "Brain.exe has stopped working",
      "It is <span class='grammar-focus'>essential that</span> a developer <span class='grammar-focus'>eat</span> breakfast.",
    ],
    script: slideScripts["performance-3"],
    layout: { type: "GlitchEffect", progressive: true },
    meta: { extraData: { text: "Error: Memory Overflow" } },
  },
  {
    id: "performance-4",
    title: "The 20% Energy Rule",
    speaker: "Chí Thanh",
    icon: "BrainCircuit",
    content: ["20% Brain Consumption", "High-Energy Task: Coding"],
    script: slideScripts["performance-4"],
    layout: { type: "component", component: "SimpleCharts", progressive: true },
    meta: { extraData: { chartType: "pie" } },
  },
  {
    id: "performance-5",
    title: "Overclocking vs. Energy Crash",
    speaker: "Chí Thanh",
    icon: "Timer",
    content: ["8 AM: Overclocking with Caffeine", "10 AM: System Crash"],
    itemIcons: ["Zap", "ZapOff"],
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
    icon: "Coffee",
  },

  // SECTION 4: CONSEQUENCES (Hoàng Sơn)
  {
    id: "consequences-1",
    title: "NO FUEL → LOW PERFORMANCE",
    speaker: "Hoàng Sơn",
    icon: "Coffee",
    content: ["7 AM class – Coffee only"],
    itemIcons: ["Coffee"],
    script: slideScripts["consequences-1"],
    layout: { type: "split", progressive: true },
  },
  {
    id: "consequences-2",
    title: "ENERGY CRASH + BRAIN FAILURE",
    speaker: "Hoàng Sơn",
    icon: "Cpu",
    content: [
      "Brain.exe not responding",
      "Low glucose → Low focus",
      "The brain is an organ <span class='grammar-focus'>which</span> needs a constant supply of glucose.",
    ],
    script: slideScripts["consequences-2"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "consequences-3",
    title: "OVEREATING EFFECT",
    speaker: "Hoàng Sơn",
    icon: "AlertCircle",
    content: ["Skip → Starving → Overeating", "Junk food cycle"],
    itemIcons: ["ZapOff", "Utensils"],
    script: slideScripts["consequences-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "consequences-4",
    title: "MOOD SWINGS & LONG-TERM RISKS",
    speaker: "Hoàng Sơn",
    icon: "AlertTriangle",
    content: [
      "Mood swings & Irritation",
      "Technical Debt for Health (Heart, Weight)",
      "Essential for long-term health",
    ],
    itemIcons: ["Activity", "Heart", "CheckCircle2"],
    script: slideScripts["consequences-4"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "consequences-5",
    title: "Skipping breakfast costs your performance. How can we fix this?",
    speaker: "Hoàng Sơn",
    content: ["Energy loss", "Focus, mood, and productivity loss"],
    script: slideScripts["consequences-5"],
    layout: { type: "quote", progressive: true },
  },

  // SECTION 5: TIPS (Đức Ý)
  {
    id: "tips-1",
    title: "UPGRADE YOUR START",
    subtitle: "From 'Quick Bite' to 'Brain Fuel'",
    speaker: "Đức Ý",
    icon: "Rocket",
    content: [],
    script: slideScripts["tips-1"],
    layout: { type: "title", progressive: true },
  },
  {
    id: "tips-2",
    title: "1. BALANCE YOUR MACROS",
    speaker: "Đức Ý",
    icon: "Scale",
    content: [
      "Carbs, Protein & Fiber",
      "Avoid 10 AM exhaustion",
      "Upgrade: Extra Egg + Cucumber",
    ],
    itemIcons: ["Scale", "Clock", "Utensils"],
    script: slideScripts["tips-2"],
    layout: { type: "split", progressive: true },
  },
  {
    id: "tips-3",
    title: "2. RETHINK YOUR DRINK",
    speaker: "Đức Ý",
    icon: "Coffee",
    content: ["The 'Sugar Crash' Trap", "Swap Cafe Sữa for Soy Milk"],
    itemIcons: ["ZapOff", "Leaf"],
    script: slideScripts["tips-3"],
    layout: { type: "bullets", progressive: true },
  },
  {
    id: "tips-4",
    title: "3. EMBRACE LOCAL PRODUCE",
    subtitle: "Natural Multivitamins • Cheap – Fast – Healthy",
    speaker: "Đức Ý",
    icon: "Apple",
    content: [
      "Fresh Banana",
      "Sweet Papaya",
      "Juicy Mango",
      "Local Dragonfruit",
    ],
    script: slideScripts["tips-4"],
    layout: { type: "image-grid", progressive: true },
    meta: {
      labels: [
        "HEALTHY UPGRADE",
        "HEALTHY UPGRADE",
        "HEALTHY UPGRADE",
        "HEALTHY UPGRADE",
      ],
    },
  },
  {
    id: "tips-5",
    title: "3 STEPS TO WIN THE MORNING",
    speaker: "Đức Ý",
    icon: "ListChecks",
    content: ["Add Greens & Protein", "Cut Sugar", "Stay Fresh"],
    itemIcons: ["Utensils", "ZapOff", "Leaf"],
    script: slideScripts["tips-5"],
    layout: { type: "bullets", progressive: true },
  },

  // SECTION 6: CONCLUSION (Thanh Hải)
  {
    id: "recap",
    title: "THE BIG PICTURE",
    speaker: "Thanh Hải",
    icon: "Trophy",
    content: [
      "Thinh: Scientific Health Benefits",
      "Thanh: Mental & Physical Performance",
      "Son: Severe Long-term Risks",
      "Y: Practical Tips & 'Upgrades'",
    ],
    itemIcons: ["Heart", "BrainCircuit", "AlertTriangle", "Rocket"],
    script: slideScripts["outro-1"],
    layout: { type: "InsightCanvas", progressive: true },
  },
  {
    id: "q-and-a",
    title: "QUESTIONS & ANSWERS",
    subtitle: "We'd love to hear your thoughts!",
    speaker: "Thanh Hải",
    content: ["Feel free to ask any questions or share your morning routine."],
    script: slideScripts["q-and-a"],
    layout: { type: "title", progressive: true },
  },
  {
    id: "foundation",
    title: "THE FOUNDATION OF SUCCESS",
    speaker: "Thanh Hải",
    content: [
      "Health is the foundation of your success.",
      "It is essential that <span class='grammar-focus text-inherit'>you prioritize your breakfast</span>.",
    ],
    script: slideScripts["outro-2"],
    layout: { type: "title", progressive: true },
  },
  {
    id: "closing",
    title: "THANK YOU FOR LISTENING!",
    subtitle: "Group 4 - ENG03.F22.CN1.TTNT",
    speaker: "Thanh Hải",
    icon: "Trophy",
    content: [
      "Special thanks to Mrs. Tien.",
      "And all classmates for your time and energy!",
    ],
    script: slideScripts["closing"],
    layout: { type: "title", progressive: true },
  },
  {
    id: "references",
    title: "REFERENCES & SOURCES",
    speaker: "Thanh Hải",
    content: [
      "Harvard Health: The importance of eating breakfast.",
      "WebMD: Benefits of eating breakfast.",
      "Mayo Clinic: Healthy breakfast: Quick, flexible options.",
      "And our specialized course materials.",
    ],
    script: slideScripts["references"],
    layout: { type: "bullets", progressive: true },
  },
];
