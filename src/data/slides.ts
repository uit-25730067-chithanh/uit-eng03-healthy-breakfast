export interface SlideLayout {
  type: 'title' | 'bullets' | 'quote' | 'split' | 'image-grid' | 'component';
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
  // SECTION 1: INTRODUCTION
  {
    id: "intro-1",
    title: "THE HEALTH IMPACTS OF SKIPPING BREAKFAST",
    subtitle: "Group 4 - Class: [Mã lớp]",
    speaker: "Thanh Hải",
    content: [],
    script: "Good evening, Ms. Tien and everyone! It is now about 8:00 PM, and I hope you still have enough energy to join us for a very interesting topic.",
    layout: { type: 'title', progressive: true }
  },
  {
    id: "intro-2",
    title: "Our Team",
    speaker: "Thanh Hải",
    content: ["Thanh Hải (Leader)", "Chí Thanh", "Đức Ý", "Phước Thịnh", "Hoàng Sơn"],
    script: "Today, our team includes 5 members: Chí Thanh, Đức Ý, Phước Thịnh, Hoàng Sơn, and myself. We are very excited to share with you our presentation on Topic 4: 'The Power of Breakfast: Why Students Should Never Skip It.'",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "intro-3",
    title: "Agenda",
    speaker: "Thanh Hải",
    content: [
      "Scientific Health Benefits",
      "Mental and Physical Performance",
      "Consequences of Skipping",
      "Practical Prep Tips"
    ],
    script: "To show you why this meal is a game-changer, our presentation is divided into four main parts...",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "intro-4",
    title: "Is skipping breakfast just a time-saver or a hidden health-killer?",
    speaker: "Thanh Hải",
    content: [],
    script: "But before we dive into the details, I have a question for all of you...",
    layout: { type: 'quote' }
  },

  // SECTION 2: HEALTH BENEFITS
  {
    id: "benefits-1",
    title: "Health Benefits of a Healthy Breakfast",
    subtitle: "How many of you had breakfast today?",
    speaker: "Phước Thịnh",
    content: [],
    script: "Good evening everyone, and thank you, Hai, for your clear introduction... Well, today I’m going to talk about the health benefits of having a healthy breakfast.",
    layout: { type: 'title' }
  },
  {
    id: "benefits-2",
    title: "🔋 More Energy",
    speaker: "Phước Thịnh",
    content: ["Feel awake", "Ready for the day"],
    script: "As you know, after a long night of sleep, our body feels tired and needs energy. A healthy breakfast helps us feel more awake...",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "benefits-3",
    title: "⚖️ Better Weight Control",
    speaker: "Phước Thịnh",
    content: ["Less overeating", "Feel full longer"],
    script: "Another important point is about weight control. Believe it or not, people who eat breakfast regularly are less likely to eat too much later in the day.",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "benefits-4",
    title: "🥗 Important Nutrients",
    speaker: "Phước Thịnh",
    content: ["Vitamins", "Minerals", "Fiber", "Strong immune system"],
    script: "Breakfast is also a great chance to give our body important nutrients...",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "benefits-5",
    title: "❤️ Long-term Health",
    speaker: "Phước Thịnh",
    content: ["Faster metabolism", "Lower risk of heart disease"],
    script: "Another amazing thing is that breakfast supports our digestion and in fact, some studies show it lowers the risk of heart disease...",
    layout: { type: 'bullets', progressive: true }
  },

  // SECTION 3: MENTAL AND PHYSICAL PERFORMANCE
  {
    id: "performance-1",
    title: "System Status: [WAITING FOR POWER]",
    speaker: "Chí Thanh",
    content: ["GlitchEffect"], 
    script: "Thank you, Thịnh. You know, as a Developer, I often see our body as the hardware and our brain as the Operating System...",
    layout: { type: 'component', component: 'GlitchEffect', progressive: false },
    meta: { extraData: { text: "Brain.exe has stopped working" } }
  },
  {
    id: "performance-2",
    title: "Did you skip breakfast?",
    speaker: "Chí Thanh",
    content: [],
    script: "Quick question for everyone: Raise your hand if you skipped breakfast this morning?",
    layout: { type: 'title' }
  },
  {
    id: "performance-3",
    title: "The 20% Energy Rule",
    speaker: "Chí Thanh",
    content: ["20% Brain Consumption", "Mental work is a high-energy task."],
    script: "Research shows that the brain consumes 20% of your total energy. Mental work is a high-energy task for your system.",
    layout: { type: 'component', component: 'SimpleCharts', progressive: true },
    meta: { extraData: { chartType: 'pie' } }
  },
  {
    id: "performance-4",
    title: "Overclocking vs. Energy Crash",
    speaker: "Chí Thanh",
    content: ["LOW BATTERY: SKIP BREAKFAST", "The 10 AM Crash"],
    script: "If you skip breakfast, you might try to 'overclock' your body with coffee at 8 AM. But by 10 AM, you will face an 'Energy Crash.'",
    layout: { type: 'component', component: 'BatteryProgress', progressive: true },
  },
  {
    id: "performance-5",
    title: "Your code is only as good as your breakfast.",
    speaker: "Chí Thanh",
    content: [],
    script: "To wrap up: Breakfast is the fuel that boots up your system...",
    layout: { type: 'quote' }
  },

  // SECTION 4: CONSEQUENCES
  {
    id: "consequences-1",
    title: "NO FUEL → LOW PERFORMANCE",
    speaker: "Hoàng Sơn",
    content: ["7 AM class", "Coffee only ☕"],
    script: "Thank you, Thanh. Let me share a quick situation. One day, I had an early class at 7 AM. I was too lazy to eat, so I just grabbed a cup of coffee...",
    layout: { type: 'split', progressive: true }
  },
  {
    id: "consequences-2",
    title: "ENERGY CRASH ⚡",
    speaker: "Hoàng Sơn",
    content: ["Brain.exe not responding 💻", "Low glucose → Low focus"],
    script: "At first, everything felt normal. But after about one or two hours, my blood sugar dropped...",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "consequences-3",
    title: "Mood & Long-term Impacts",
    speaker: "Hoàng Sơn",
    content: ["MOOD SWINGS 😤", "LONG-TERM RISKS ⚠️", "Weight gain", "Heart disease"],
    script: "And it doesn’t stop there. When I skip breakfast, I experience mood swings. In the long term, it can lead to serious problems...",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "consequences-4",
    title: "Skipping breakfast costs your performance. How can we fix this?",
    speaker: "Hoàng Sơn",
    content: [],
    script: "Skipping breakfast may seem small, but the consequences are real. How can we build a better breakfast habit? Let's welcome Ý.",
    layout: { type: 'quote' }
  },

  // SECTION 5: TIPS
  {
    id: "tips-1",
    title: "UPGRADE YOUR START",
    subtitle: "From Quick Bite to Brain Fuel",
    speaker: "Đức Ý",
    content: [],
    script: "First off, a huge thank you to Mr. Son... I will now dive into some practical ways we can 'upgrade' our most important meal of the day: Breakfast.",
    layout: { type: 'title' }
  },
  {
    id: "tips-2",
    title: "1. BALANCE YOUR MACROS",
    speaker: "Đức Ý",
    content: ["Carbs, Protein & Fiber", "Solution: Bánh mì + Extra Egg & Cucumber!"],
    script: "First, Balance Your Macronutrients. Most student breakfasts are too high in carbs. Ask for extra cucumber and an additional egg to stay sharp until lunch!",
    layout: { type: 'split', progressive: true }
  },
  {
    id: "tips-3",
    title: "2. RETHINK YOUR DRINK",
    speaker: "Đức Ý",
    content: ["The 'Sugar Crash' Trap", "Swap Cà phê sữa for Unsweetened Soy Milk", "Your skin & heart will thank you"],
    script: "Second, Rethink Your Drinks. The condensed milk in Cà phê sữa leads to a 'sugar crash'. Try fresh, unsweetened soy milk instead.",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "tips-4",
    title: "3. EMBRACE LOCAL PRODUCE",
    speaker: "Đức Ý",
    content: ["Natural Multivitamins", "Cheap", "Fast", "Healthy"],
    script: "Third, Embrace Local Produce. Grab a banana or a slice of papaya, which are the best natural multivitamin you can find.",
    layout: { type: 'image-grid', progressive: true }
  },
  {
    id: "tips-5",
    title: "3 STEPS TO WIN THE MORNING",
    speaker: "Đức Ý",
    content: ["Add Greens & Protein", "Cut Sugar", "Stay Fresh"],
    script: "That summarizes my three tips for a better breakfast. To provide you with a clear action plan, let’s welcome Thanh Hai...",
    layout: { type: 'bullets', progressive: true }
  },

  // SECTION 6: CONCLUSION
  {
    id: "outro-1",
    title: "The Big Picture",
    speaker: "Thanh Hải",
    content: [
      "Scientific Health Benefits ✔",
      "Mental Performance ✔",
      "Long-term Risks ✔",
      "Practical Prep Tips ✔"
    ],
    script: "Thank you, Đức Ý! To wrap up our online presentation tonight, let’s look back at the big picture...",
    layout: { type: 'bullets', progressive: true }
  },
  {
    id: "outro-2",
    title: "Health is the foundation of your success.",
    subtitle: "It is essential that you prioritize your breakfast.",
    speaker: "Thanh Hải",
    content: [],
    script: "As we have discussed, it is essential that every student in our class prioritize their breakfast... Don't let running your brain on low battery stop you.",
    layout: { type: 'title' }
  },
  {
    id: "outro-3",
    title: "THANK YOU FOR LISTENING!",
    subtitle: "Special thanks to Ms. Tien & Group 4 classmates.",
    speaker: "Thanh Hải",
    content: [],
    script: "On behalf of Group 4, I want to say a big thank you to Ms. Tien for your time and to all my classmates for staying with us until this hour.",
    layout: { type: 'title' }
  }
];
