// All site content. Everything on the pages is rendered from the objects below.

/* -- Who you are ----------------------------------------------------------- */
const SITE = {
  name:        "Bryan Maillet",
  initials:    "BM",                              // 2 letters for the logo square
  role:        "Unreal Engine Developer",
  headline:    "I build gameplay systems for <em>Unreal Engine</em> games, then make them run fast.",
  lede:        "In Unreal Engine since 2018. Five studios and three Steam releases, in Unreal Engine 4 and 5. " +
               "I build gameplay systems in Blueprint and C++: combat, movement, interaction, " +
               "multiplayer. Then I profile them and make them run.",
  location:    "Orihuela, Spain",                 // city or country, leave "" to hide it
  email:       "contact@bryanmaillet.com",
  status:      "Open to contract work and studio roles",
  statusLive:  true,                              // shows the pulsing dot

  // empty = CV buttons hidden
  cv:          "assets/cv/cv.pdf",

  // canonical base, no trailing slash
  url:         "https://bryanmaillet.com",

  // empty = form falls back to mailto
  formEndpoint: "https://formspree.io/f/mzezplye",

  footerBlurb: "Unreal Engine developer working on gameplay systems, multiplayer and " +
               "performance across PC and VR titles.",

  // icons: github, linkedin, upwork, gamepad, play
  social: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/bryanmaillet/", icon: "linkedin" },
    { label: "Upwork",   url: "https://www.upwork.com/freelancers/~01b90dd8047cd8198e", icon: "upwork" },
    { label: "GitHub",   url: "https://github.com/agentfufu", icon: "github" }
  ],

  stats: [
    { value: "3",       label: "Titles shipped on Steam" },
    { value: "2018",    label: "Working in Unreal since" },
    { value: "UE4 & 5", label: "Engine versions" },
    { value: "PC / VR", label: "Platforms shipped on" }
  ],

  marquee: ["Unreal Engine 5", "Unreal Engine 4", "Blueprint", "C++", "Gameplay Systems",
            "Multiplayer", "UMG", "Prototyping", "VR / Oculus", "Rendering & Optimisation",
            "Profiling", "Niagara VFX"]
};

/* -- About page ------------------------------------------------------------ */
const ABOUT = {
  portrait: "assets/img/portrait.svg",
  paragraphs: [
    "I'm an Unreal Engine developer. Since 2018 I've worked at five studios on PC, VR and " +
    "multiplayer projects. Three of them shipped on Steam. The rest were prototypes.",

    "My work sits between design and the engine. I build gameplay systems in Blueprint and " +
    "C++: combat, movement, interaction, inventory, save and progression, and the multiplayer " +
    "layer on top. Then I do the other half of the job, which is profiling, draw calls and the " +
    "passes that get a build back to its target frame rate. On VR you can't skip that part.",

    "I started in level design and lighting, which is what most of the credits below are, and " +
    "moved toward systems as the projects got bigger. I'm open to contract work or a studio " +
    "role where I can own a system properly. I also work outside the engine when a project " +
    "needs it: web, tooling, scripting."
  ],
  funFacts: [
    "Mentored by the developer behind VR Exodus.",
    "I'll spend a whole day on optimisation nobody is going to notice.",
    "I don't like Blueprint spaghetti. I still write it sometimes."
  ]
};

/* -- Skills (About page) --------------------------------------------------- */
const SKILLS = [
  { group: "Engine",       items: ["Unreal Engine 5", "Unreal Engine 4", "Blueprint", "C++", "UMG", "Niagara"] },
  { group: "Gameplay",     items: ["Core gameplay systems", "Combat & movement", "Interaction systems", "Inventory & quest logic", "Save & progression", "Multiplayer co-op / PvP"] },
  { group: "Performance",  items: ["Rendering optimisation", "LOD / HLOD setup", "Profiling & debugging", "Draw call reduction", "Frame-rate budgeting"] },
  { group: "XR",           items: ["Oculus / Meta Quest", "VR interaction", "VR comfort & immersion", "VR rendering performance"] },
  { group: "Levels & art", items: ["Level design", "Environment layout", "3D modelling", "Lighting & shadow", "Sound & VFX implementation"] },
  { group: "Also",         items: ["Game design & feature planning", "Prototyping", "Web (HTML/CSS/JS)", "Testing & iteration"] }
];

/* -- Experience timeline (About + Resume) ---------------------------------- */
const TIMELINE = [                                 // newest first
  {
    period: "Dec 2023 - Dec 2024",
    role:   "Unreal Engine 5 Developer",
    org:    "Jerome Interactive",
    blurb:  "Playable prototypes across PC, VR and multiplayer. Complete gameplay systems: " +
            "combat, movement and interaction, plus co-op and PvP, UI (HUD, menus, settings), " +
            "save and progression, and game-ready C++ frameworks built from design documents.",
    tags:   ["UE5", "C++", "Multiplayer"]
  },
  {
    period: "Jan 2023 - Nov 2023",
    role:   "Unreal Engine 5 Developer",
    org:    "Skylight Forge Entertainment",
    blurb:  "Gameplay systems including UI integration, inventory and quest logic. Built " +
            "Blueprint frameworks for fast iteration, implemented save/load and progression, " +
            "and supported small teams with the technical side of design features.",
    tags:   ["UE5", "Blueprint", "UI"]
  },
  {
    period: "Jul 2022 - Dec 2022",
    role:   "Unreal Engine 5 Gameplay Developer",
    org:    "NovaForge Interactive",
    blurb:  "Modular gameplay systems in Blueprint: player movement, interaction and combat " +
            "prototypes, with reusable architecture shared across several internal projects, " +
            "and optimisation passes on complex Blueprint logic.",
    tags:   ["UE5", "Blueprint", "Systems"]
  },
  {
    period: "Oct 2021 - Jul 2022",
    role:   "Game Designer",
    org:    "Luthor Dynamic Studio",
    blurb:  "Worked on the VR title Fates Call, focused on level design and player experience: " +
            "VR level layout, gameplay flow, progression and interaction design, and iteration " +
            "for comfort and immersion.",
    tags:   ["VR", "Level Design", "Game Design"]
  },
  {
    period: "Mar 2018 - Sep 2023",
    role:   "Unreal Engine Developer",
    org:    "VR-EXODUS",
    blurb:  "Designed and developed game projects from concept to implementation in Unreal " +
            "Engine 4 and 5: gameplay programming in Blueprint, core systems, UI and player " +
            "experience, multiplayer mechanics, prototyping, and performance work.",
    tags:   ["UE4 / UE5", "Blueprint", "Gameplay"]
  }
];

/* -- Education / training (Resume page) ------------------------------------ */
const EDUCATION = [
  {
    period: "2018 - ongoing",
    title:  "Self-taught, on shipped projects",
    org:    "Unreal Engine 4 & 5",
    blurb:  "No formal games programme. I learned Unreal by building in it, prototypes first, " +
            "then three titles that went out on Steam. I filled the gaps from the documentation, " +
            "the engine source, profiling sessions and the people I worked with. " +
            "Mentored by the developer behind VR Exodus."
  }
];

/* -- Projects -------------------------------------------------------------- */
// slug -> project.html?p=slug. featured = shown on the home page. facts = the 'At a glance' table.
const PROJECTS = [
  {
    slug: "wildlife-warfare",
    title: "Wildlife Warfare",
    year: "2024",
    role: "Level design \u00b7 VFX \u00b7 Optimisation",
    summary: "Asymmetric multiplayer PvP where you pick a side: ten wild animals with their own " +
             "abilities, or human hunters with weapons. Online or against bots. In Early Access on Steam.",
    cover: "assets/img/projects/wildlife-warfare.jpg", coverW: 800, coverH: 450,
    tags: ["Unreal Engine 5", "Multiplayer", "Level Design", "Optimisation"],
    stack: ["Unreal Engine 5", "Blueprint", "Multiplayer / PvP", "Niagara", "Level Design"],
    facts: [
      { label: "Released", value: "11 December 2024, Early Access" },
      { label: "Studio",   value: "Jerome Interactive" },
      { label: "Engine",   value: "Unreal Engine 5" },
      { label: "Platform", value: "PC (Windows)" },
      { label: "Modes",    value: "Online PvP, bot matches, Remote Play Together" },
      { label: "My part",  value: "Level design, sound & VFX, rendering and optimisation" }
    ],
    featured: true,
    links: [
      { label: "View on Steam", url: "https://store.steampowered.com/app/3130720/Wildlife_Warfare/" }
    ],
    highlights: [
      "Level design across the multiplayer maps: layout, routing and sightlines for animal-versus-hunter combat.",
      "Sound and VFX implementation.",
      "Rendering and optimisation passes to hold frame rate with a full lobby.",
      "Game design input and test passes through Early Access."
    ],
    body: `
      <h3>The game</h3>
      <p>Wildlife Warfare is an asymmetric multiplayer shooter: one team plays as wild animals
      (wolves, tigers, bears, foxes, snakes, elephants, each with their own abilities), the other
      as human hunters with conventional weapons. It went into Early Access on Steam on 11 December
      2024, and plays online against other people or offline against bots.</p>
      <h3>What I worked on</h3>
      <p>My work was mostly level design and the presentation and performance layers around it.
      Animal-versus-hunter fights pull map design in two directions at once. The animals want
      cover and close routes, the hunters want lines of sight. The layouts went through a lot of
      test passes to keep both sides playable in the same space.</p>
      <p>The maps run from open red-rock canyon to pine woodland and dense wetland forest, and each
      one needs its own answer to the same question: where can an animal close the distance, and
      where does a hunter get to see it coming.</p>
      <p>Alongside that I implemented sound and VFX, and ran the rendering and optimisation
      passes. Multiplayer is where performance problems get expensive: everything that is fine in
      an empty level has to still be fine with a full lobby of players, effects and animals on
      screen at once.</p>`
  },
  {
    slug: "aturd-abuser-escape",
    title: "ATurd - Abuser Escape",
    year: "2022",
    role: "Level design \u00b7 3D \u00b7 Lighting",
    summary: "A third-person search-and-escape game built at VR-EXODUS. You hunt through a " +
             "house for evidence while avoiding the person who lives there.",
    cover: "assets/img/projects/aturd-abuser-escape.jpg", coverW: 1280, coverH: 720,
    tags: ["Unreal Engine", "Level Design", "Lighting", "Optimisation"],
    stack: ["Unreal Engine", "Level Design", "3D Modelling", "Lighting", "LOD / HLOD"],
    facts: [
      { label: "Released", value: "8 July 2022" },
      { label: "Studio",   value: "VR-EXODUS" },
      { label: "Engine",   value: "Unreal Engine" },
      { label: "Platform", value: "PC (Windows)" },
      { label: "Modes",    value: "Single-player. Evidence and Cleaning modes, Steam Achievements" },
      { label: "My part",  value: "Level design, 3D modelling, lighting, LOD / HLOD" }
    ],
    featured: true,
    links: [
      { label: "View on Steam", url: "https://store.steampowered.com/app/2023680/ATurd__Abuser_Escape/" }
    ],
    highlights: [
      "Level design and environment layout across both game modes.",
      "3D modelling for props and set dressing.",
      "Lighting and shadow setup through the house interiors.",
      "LOD and HLOD configuration to keep the scene affordable to render."
    ],
    body: `
      <h3>The game</h3>
      <p>Released on Steam on 8 July 2022 by VR-EXODUS. You play Jojo, searching a house for
      evidence by breaking open the furniture, while avoiding someone who very much does not want
      you to find it. A second mode swaps the tension for janitorial cleaning work.</p>
      <h3>What I worked on</h3>
      <p>Level design and environment layout for both modes, plus the 3D modelling for props and
      set dressing. A house is a deceptively hard space to build: it has to read as somewhere
      people actually live while still guiding the player toward the things worth hitting.</p>
      <p>That guidance is partly an art problem. Only some of the furniture can be broken open, so
      the set dressing has to make the difference legible at a glance, without putting a marker on
      every drawer.</p>
      <p>I also handled lighting and shadow throughout the interiors, and set up LODs and HLODs.
      Interiors full of individually placed props generate draw calls quickly, and the HLOD pass
      is what kept the cost in budget without thinning out the set dressing.</p>`
  },
  {
    slug: "fates-call",
    title: "Fates Call: A New Beginning",
    year: "2021 - 2022",
    role: "VR level design \u00b7 Rendering",
    summary: "A VR-only action RPG with sword, bow and magic. I joined at Luthor Dynamic Studio for " +
             "level design, and for rendering and optimisation on Oculus hardware.",
    cover: "assets/img/projects/fates-call.jpg", coverW: 1600, coverH: 766,
    tags: ["VR", "Unreal Engine", "Level Design", "Optimisation"],
    stack: ["Unreal Engine", "VR / Oculus", "Level Design", "Rendering", "Performance"],
    facts: [
      { label: "Released", value: "30 November 2020. I joined after release" },
      { label: "Studio",   value: "Luthor Dynamic Studio" },
      { label: "Engine",   value: "Unreal Engine" },
      { label: "Platform", value: "PC VR: SteamVR (Vive, Index, Oculus, Windows MR)" },
      { label: "Modes",    value: "Single-player, VR only, fully voiced" },
      { label: "My part",  value: "VR level design, progression and interaction, rendering and optimisation" }
    ],
    featured: true,
    links: [
      { label: "View on Steam", url: "https://store.steampowered.com/app/691090/Fates_Call_A_New_Beginning/" }
    ],
    highlights: [
      "VR level design and environment layout.",
      "Rendering and optimisation work targeting Oculus hardware.",
      "Player progression and interaction design.",
      "Testing and iteration for VR comfort and immersion."
    ],
    body: `
      <h3>The game</h3>
      <p>Fates Call: A New Beginning is a VR-only action RPG from Luthor Dynamic Studio, released on Steam
      on 30 November 2020. You play Talos, summoned by ancient spirits, fighting through a fully
      voiced story with sword, bow and magic. It supports Vive, Index, Oculus and Windows Mixed
      Reality.</p>
      <h3>What I worked on</h3>
      <p>I joined the project after its release, working on level design and player experience:
      environment layout, gameplay flow, progression and interaction design. The world runs from an
      open coastal fortress and a village on the plain down through caves, a volcano and the
      interiors between them. It's a stylised, hand-lit look that leans on light sources rather
      than texture detail to give a space its character.</p>
      <h3>The VR performance problem</h3>
      <p>The rest of my time went to rendering and optimisation for Oculus. VR is unforgiving in a
      way flat games aren't. You're rendering twice, at a high refresh rate, and when you miss
      frame budget people feel ill. That constraint drives everything: what the level can contain,
      how it's lit, and how much is visible at once. The stylised look was a performance decision
      as much as an art one.</p>
      <p>Comfort is the other part, and you only find those problems by testing. Layouts
      that read fine on a monitor turn out to be uncomfortable in a headset, and the only way to
      know is to put it on and walk through it again.</p>`
  }
];

/* -- Devlog ---------------------------------------------------------------- */
// date: YYYY-MM-DD, newest first. body is HTML. post.html?id=slug
const POSTS = [];

/* -- Services -------------------------------------------------------------- */
const SERVICES = [
  {
    icon: "code",
    title: "Gameplay systems",
    blurb: "Core systems built in Blueprint and C++, structured so designers can tune them.",
    bullets: ["Combat, movement and interaction", "Inventory, quest and progression logic", "Save/load systems", "UI: HUD, menus, settings"]
  },
  {
    icon: "gamepad",
    title: "Prototype to playable",
    blurb: "A design document turned into something you can open and play, while changing your mind is still cheap.",
    bullets: ["Playable prototypes from a spec", "Reusable Blueprint and C++ frameworks", "Multiplayer and co-op prototypes", "Feature planning and iteration"]
  },
  {
    icon: "headset",
    title: "VR development",
    blurb: "Headset-first work. On VR, comfort problems and frame rate problems are usually the same problem.",
    bullets: ["Oculus / Meta Quest and PC VR", "VR level design and interaction", "Comfort and immersion testing", "Rendering for a VR frame budget"]
  },
  {
    icon: "gauge",
    title: "Rendering & optimisation",
    blurb: "The work that happens once the game is fun but still runs badly.",
    bullets: ["Profiling and debugging", "LOD and HLOD setup", "Draw call and material cost reduction", "Frame-rate budgeting for VR and multiplayer"]
  }
];

const PROCESS = [
  { step: "01", title: "Scope call",   text: "A short call to work out what you actually need, and whether I'm the right person for it. Free, no pitch deck." },
  { step: "02", title: "Written plan", text: "You get the approach, the milestones and the numbers in writing before anything starts." },
  { step: "03", title: "Build",        text: "Work in visible increments, with something you can open and play at the end of each one." },
  { step: "04", title: "Hand-off",     text: "Commented, documented work and a walkthrough, so your team owns it after me." }
];

const FAQ = [
  { q: "Do you work with existing codebases?",
    a: "Yes. Most of my work has been joining projects already in motion, including one after it had shipped. I'll spend the first day reading before I change anything." },
  { q: "Blueprint or C++?",
    a: "Both, and the choice is usually about who has to maintain it. Blueprint where designers need to iterate, C++ where it needs to be fast or reusable across projects." },
  { q: "Remote or on-site?",
    a: "Remote by default, with overlapping hours with your team. On-site for a kick-off is possible." },
  { q: "How do you charge?",
    a: "Fixed price for well-defined work, day rate for open-ended work. Either way you know the number before we start." },
  { q: "Can you take something from zero?",
    a: "Yes. Prototype to playable is the part I enjoy most." },
  { q: "What about NDAs?",
    a: "Standard, and I'm happy to sign yours. Nothing goes in the portfolio without your written OK." }
];

/* -- Testimonials ---------------------------------------------------------- */
// quote/author/role/source. Empty list hides the section.
const TESTIMONIALS = [
  { quote:  "I have hired Bryan multiple times over the years to assist with various " +
            "Unreal Engine projects, and he has consistently exceeded expectations. He is " +
            "a dedicated, hard worker who always delivers high-quality results on time. " +
            "What sets Bryan apart is his impressive versatility—he is highly skilled " +
            "across multiple disciplines, from programming and technical tasks to 3D " +
            "modeling and animation. I highly recommend him for any development team.",
    author: "Julien M.",
    role:   "Repeat client, Unreal Engine projects",
    source: "Upwork" },

  { quote:  "Efficient and amazing. Focused and straightforward. Gets the jobs down " +
            "with full effort and quality. Highly recommend",
    author: "Openlane Studios",
    role:   "Client",
    source: "Upwork" }
];

// stats strip above the reviews; url = verify link
const UPWORK = {
  url:   "https://www.upwork.com/freelancers/~01b90dd8047cd8198e",
  stats: [
    { value: "100%",          label: "Job Success Score" },
    { value: "536",           label: "Hours worked" },
    { value: "€10,000+", label: "Earned on Upwork" }
  ]
};

/* -- Gallery --------------------------------------------------------------- */
// tags become the filter chips; a tag equal to a project title puts the shot on that project page.
// w/h come from tools/stamp-dims.py
const GALLERY = [
  { src: "assets/img/gallery/01-fates-call-02.jpg", w: 1600, h: 766,
    alt: "Coastal fortress and harbour under a bright sky in Fates Call",
    caption: "Fates Call: the coastal fortress, seen from the water",
    tags: ["Fates Call: A New Beginning", "Level Design", "VR"] },

  { src: "assets/img/gallery/02-wildlife-warfare-14.jpg", w: 1600, h: 900,
    alt: "Misty wetland forest with standing water and dense trees",
    caption: "Wildlife Warfare: wetland forest, where the sightlines close right down",
    tags: ["Wildlife Warfare", "Level Design"] },

  { src: "assets/img/gallery/03-aturd-abuser-escape-04.jpg", w: 1280, h: 720,
    alt: "Dark hallway with light spilling from a doorway and a wall lamp",
    caption: "ATurd: hallway, lit by what's behind the door",
    tags: ["ATurd - Abuser Escape", "Lighting"] },

  { src: "assets/img/gallery/04-fates-call-04.jpg", w: 1600, h: 766,
    alt: "Erupting volcano lighting the sky above a camp at night",
    caption: "Fates Call: the volcano as the scene's only real light source",
    tags: ["Fates Call: A New Beginning", "Lighting", "VR"] },

  { src: "assets/img/gallery/05-wildlife-warfare-03.jpg", w: 1600, h: 891,
    alt: "Hunter camp with tents and crates among pine trees",
    caption: "Wildlife Warfare: hunter camp, a fixed point the map routes around",
    tags: ["Wildlife Warfare", "Level Design"] },

  { src: "assets/img/gallery/06-fates-call-01.jpg", w: 1600, h: 768,
    alt: "Stone interior with a shaft of light falling through a high opening",
    caption: "Fates Call: interior, lit almost entirely by one opening",
    tags: ["Fates Call: A New Beginning", "Lighting", "VR"] },

  { src: "assets/img/gallery/07-aturd-abuser-escape-01.jpg", w: 1280, h: 720,
    alt: "Desaturated apartment interior with furniture and a piano",
    caption: "ATurd: the desaturated pass that shows what can be broken open",
    tags: ["ATurd - Abuser Escape", "Level Design"] },

  { src: "assets/img/gallery/08-fates-call-06.jpg", w: 1600, h: 766,
    alt: "Village at night lit by lanterns and small fires",
    caption: "Fates Call: the village at night, on lanterns and firelight",
    tags: ["Fates Call: A New Beginning", "Lighting", "VR"] },

  { src: "assets/img/gallery/09-wildlife-warfare-12.jpg", w: 1600, h: 900,
    alt: "Red rock canyon with a route running between the walls",
    caption: "Wildlife Warfare: canyon route, cover for the animals and a corridor for the hunters",
    tags: ["Wildlife Warfare", "Level Design"] },

  { src: "assets/img/gallery/10-fates-call-07.jpg", w: 1600, h: 766,
    alt: "Dark cavern with a glowing pink tree and turquoise water",
    caption: "Fates Call: cavern, with the only colour coming from the light",
    tags: ["Fates Call: A New Beginning", "Lighting", "VR"] },

  { src: "assets/img/gallery/11-aturd-abuser-escape-03.jpg", w: 1280, h: 720,
    alt: "Room interior with a record player and bright ceiling lights",
    caption: "ATurd: set dressing and prop work through the house",
    tags: ["ATurd - Abuser Escape", "Level Design"] },

  { src: "assets/img/gallery/12-fates-call-05.jpg", w: 1600, h: 766,
    alt: "Wide daylight view over a village, plains and distant fortress walls",
    caption: "Fates Call: wide shot, everything the frame budget has to hold at once",
    tags: ["Fates Call: A New Beginning", "Level Design", "VR"] },

  { src: "assets/img/gallery/13-wildlife-warfare-02.jpg", w: 800, h: 450,
    alt: "Crocodile moving through open red desert scrub",
    caption: "Wildlife Warfare: open ground, where the hunters have the advantage",
    tags: ["Wildlife Warfare", "Level Design"] },

  { src: "assets/img/gallery/14-fates-call-10.jpg", w: 1600, h: 766,
    alt: "Forge interior glowing orange beside an open landscape",
    caption: "Fates Call: the forge, warm interior against cold exterior",
    tags: ["Fates Call: A New Beginning", "Lighting", "VR"] },

  { src: "assets/img/gallery/15-wildlife-warfare-15.jpg", w: 1600, h: 900,
    alt: "Pine forest seen down the sights of a rifle",
    caption: "Wildlife Warfare: pine forest, built to break up long sightlines",
    tags: ["Wildlife Warfare", "Level Design"] },

  { src: "assets/img/gallery/16-fates-call-00.jpg", w: 1600, h: 766,
    alt: "Fortress and harbour at night under heavy cloud, lit by braziers",
    caption: "Fates Call: the same fortress after dark",
    tags: ["Fates Call: A New Beginning", "Lighting", "VR"] }
];
