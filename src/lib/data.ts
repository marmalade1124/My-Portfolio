export interface Project {
  id: string;
  num: string;
  title: string;
  category: string;
  tag: 'software' | 'hardware' | 'devtools' | 'cad' | 'media';
  year: string;
  description: string;
  role: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  liveLabel?: string;
  videoUrl?: string;
  coverImage?: string;
  images?: string[];
  imageCaptions?: string[];
  caseStudy?: {
    status: string;
    problem: string;
    decision: string;
    result: string;
    limitations: string;
    evidence: { image: string; caption: string }[];
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  details?: string;
}

export interface Leadership {
  id: string;
  role: string;
  org: string;
  period: string;
  details?: string;
}

export interface SkillCategory {
  label: string;
  items: string[];
}

export const PERSONAL = {
  name: 'Raziel Renz C. Salamat',
  firstName: 'Raziel',
  lastName: 'Salamat',
  title: 'Computer Engineering Student & Developer',
  disciplines: 'Hardware Systems · 3D CAD Design · Full-Stack Software',
  tagline: 'concept to creation',
  status: 'Available for Full-Time / Contracts',
  location: 'Tagum City / Davao del Norte',
  timezone: 'GMT+8',
  email: 'razielrenz@gmail.com',
  socials: {
    github: 'https://github.com/marmalade1124',
    linkedin: 'https://www.linkedin.com/in/razielrenz',
  },
} as const;

export const PROJECTS: Project[] = [
  {
    id: 'twentyfour',
    caseStudy: {
      status: 'Deployed web app · Public demo',
      problem: 'Event photos are scattered across guests’ phones. TwentyFour gives hosts one invitation and guests a shared, limited-roll camera experience without creating an account.',
      decision: 'I chose a browser-based guest flow to remove an installation step. An IndexedDB capture queue supports interrupted connections, while a scheduled reveal keeps the shared album hidden during the event.',
      result: 'The delivered app includes QR joining, guest capture, a reveal countdown, and host album controls. The public demo lets visitors explore the guest flow using a sample photograph.',
      limitations: 'The demo uses sample imagery rather than the device camera. These screenshots demonstrate the interface; they do not establish real-event usage or upload reliability on every phone.',
      evidence: [
        { image: '/projects/twentyfour-camera.png', caption: 'Capture: the guest enters a limited-roll camera without an account. Actual demo screen; the photograph is a sample.' },
        { image: '/projects/twentyfour-roll.png', caption: 'Anticipation: the countdown explains when the shared album will become available. Actual demo screen.' },
      ],
    },
    num: '29',
    title: 'TwentyFour',
    category: 'Mobile Web / Event Photography',
    tag: 'software',
    year: '2026',
    description: 'A disposable-camera experience for events: hosts share a QR invitation, guests capture a limited roll without an account, and photos collect in a shared album revealed after the event. I built the mobile web experience and Node.js backend, including an offline capture queue, host album controls, and private photo storage. The public demo uses a sample photograph; real events use the browser camera.',
    role: 'Creator & Full-Stack Developer',
    techStack: ['JavaScript', 'Node.js', 'Supabase', 'IndexedDB', 'PWA'],
    liveUrl: 'https://twentyfour-ixyq.onrender.com/',
    coverImage: '/projects/twentyfour-home.png',
    images: ['/projects/twentyfour-home.png', '/projects/twentyfour-camera.png', '/projects/twentyfour-roll.png'],
    imageCaptions: [
      'TwentyFour — live web app landing page',
      'Mobile camera interface — public demo with a sample scene',
      'Camera roll and reveal countdown — public demo, no photos uploaded',
    ],
  },

  {
    id: 'picolor',
    caseStudy: {
      status: 'Windows desktop app · Download available',
      problem: 'Sampling a color is only the beginning of designing an interface. I wanted a local tool that turns that color into named UI roles, previews, and usable exports.',
      decision: 'I built a native C#/WPF app with Win32 screen sampling, then organized palettes around semantic roles rather than an unstructured swatch list. Light/dark previews and pair-specific contrast checks give each change context.',
      result: 'The app provides screen sampling, editable palettes, interface previews, CSS/JSON export, and a local library with favorites and backups. The linked website introduces the Windows download; the repository exposes the implementation.',
      limitations: 'The gallery contains native app renders, separately labeled from the website screenshot. Windows hardware and display configurations require their own testing; these renders are not a compatibility benchmark.',
      evidence: [
        { image: '/projects/picolor-editor.png', caption: 'Edit: adjust the selected color role with the HSV editor. Native app render.' },
        { image: '/projects/picolor-preview.png', caption: 'Evaluate: inspect UI context and contrast for a selected color pair before export. Native app render.' },
      ],
    },
    num: '27',
    title: 'PiColor 3.14',
    category: 'Windows App / Color Picker & Palette Studio',
    tag: 'devtools',
    year: '2026',
    description: 'A native Windows color picker and palette studio that turns a sampled screen color into a website palette. I built the desktop sampling workflow, semantic light and dark palettes, editable color roles, interface previews, pair-specific contrast checks, and CSS/JSON export. Named palettes, favorites, and backups stay on the device. The gallery shows renders from the native app; the linked website introduces the Windows download.',
    role: 'Creator & Desktop Application Developer',
    techStack: ['C#', 'WPF', '.NET Framework 4.8', 'Win32', 'OKLCH'],
    githubUrl: 'https://github.com/marmalade1124/3.14',
    liveUrl: 'https://pi-color-studio.vercel.app/',
    liveLabel: 'Website',
    coverImage: '/projects/picolor-studio.png',
    images: [
      '/projects/picolor-studio.png',
      '/projects/picolor-editor.png',
      '/projects/picolor-preview.png',
      '/projects/picolor-settings.png',
      '/projects/picolor-website.png',
    ],
    imageCaptions: [
      'Native app render — palette studio, semantic color roles, and CSS/JSON output',
      'Native app render — HSV color wheel, brightness, and selected-role editing',
      'Native app render — interface preview and pair-specific contrast checks',
      'Native app render — local library settings, backup, and recovery tools',
      '3.14 public website — Windows app introduction and download',
    ],
  },

  // === TOP FLAGSHIP WORKS (SHOWCASED IN INITIAL 6 CARDS) ===
  {
    id: 'the-collegium',
    num: '01',
    title: 'The Collegium',
    category: 'Digital Newsroom / Web App',
    tag: 'software',
    year: '2026',
    description: 'A digital home for collegiate journalism, bringing articles, announcements, publications, and a searchable archive into one place. As lead full-stack developer, I built the newsroom interface and publishing experience, drawing on my work as a student video journalist.',
    role: 'Lead Full-Stack Developer & Senior Video Journalist',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Digital Publishing'],
    liveUrl: 'https://thecollegium.vercel.app/',
    coverImage: '/projects/collegium-hero.png',
    images: [
      '/projects/collegium-hero.png',
      '/projects/collegium-article.png',
      '/projects/collegium-archive.png',
    ],
    imageCaptions: [
      'Digital Newsroom Homepage & Live Announcement Ticker',
      'Investigative Article Reader Layout & Photojournalism',
      'The Archive — Searchable Database with Academic & Category Filters',
    ],
  },
  {
    id: 'cad-enclosure',
    caseStudy: {
      status: 'CAD concept · Unvalidated physical design',
      problem: 'A custom electronics assembly needs a housing that makes space for components, connectors, and assembly access. This study explores that arrangement before fabrication.',
      decision: 'I modeled the housing, ventilation fins, and connector openings in Fusion 360 to make component placement and the exterior form visible in one concept.',
      result: 'The deliverable is an enclosure model and presentation render. The image communicates the proposed housing and opening layout for review and further iteration.',
      limitations: 'This is a design study. Ingress protection, thermal performance, fit, tolerances, and manufacturing readiness have not been validated by the render.',
      evidence: [
        { image: '/images/cad/enclosure.png', caption: 'Design intent: the render shows the housing form, fins, and connector openings. It is not evidence of a tested physical enclosure.' },
      ],
    },
    num: '02',
    title: 'Industrial Logic Controller Enclosure',
    category: '3D CAD / Rugged Electronics',
    tag: 'cad',
    year: '2024',
    description: 'A CAD enclosure concept for organizing a custom electronics assembly. I modeled the housing, ventilation fins, and connector openings to explore component placement and assembly. The render shows design intent; ingress protection, thermal performance, and manufacturing readiness have not been validated.',
    role: '3D CAD Designer',
    techStack: ['Fusion 360', 'CAD Modeling', 'Assembly Design'],
    coverImage: '/images/cad/enclosure.png',
    images: ['/images/cad/enclosure.png'],
    imageCaptions: ['Electronics Enclosure CAD Concept'],
  },
  {
    id: 'media-mutya-bts',
    num: '03',
    title: 'Mutya ng UMTC 2024: BTS',
    category: 'Videography / Behind The Scenes',
    tag: 'media',
    year: '2024',
    description: 'A behind-the-scenes film documenting the preparation and people behind Mutya ng UMTC 2024. As lead videographer and editor, I captured backstage moments and shaped them into a documentary-style edit. The linked video presents the finished work.',
    role: 'Lead Videographer & Editor',
    techStack: ['Videography', 'Premiere Pro', 'Event Production', 'Adobe CC', '24 FPS'],
    videoUrl: 'https://www.facebook.com/watch/?v=523154220511260',
    coverImage: '/images/video-8.png',
    images: ['/images/video-8.png'],
    imageCaptions: ['Mutya ng UMTC 2024: Behind-The-Scenes Production Stream'],
  },
  {
    id: 'ccprint',
    num: '04',
    title: 'CCPrint',
    category: '3D Printing Fleet / IoT',
    tag: 'hardware',
    year: '2025',
    description: 'A 3D printing workflow project for organizing print jobs and estimating fabrication costs. I worked across the software and hardware workflow, with the portfolio preview showing the quoting interface. The linked repository provides the implementation for review.',
    role: 'Lead Engineer — Full-Stack & Hardware',
    techStack: ['TypeScript', 'React', 'Node.js', 'Hardware Telemetry', 'REST API'],
    githubUrl: 'https://github.com/marmalade1124/CCPrint',
    coverImage: '/projects/ccprint-quote.png',
    images: ['/projects/ccprint-quote.png'],
    imageCaptions: ['Automated 3D Print Job Quoting & Telemetry Cost Estimator'],
  },
  {
    id: 'codecraft-management',
    num: '05',
    title: 'CodeCraft Management',
    category: 'Full-Stack / Project Ops Dashboard',
    tag: 'software',
    year: '2023',
    description: 'A project operations dashboard for organizing software team work. As lead full-stack developer, I built an interface around tasks, milestones, and project information to make ongoing work easier to review. The linked demo shows the application experience.',
    role: 'Lead Full-Stack Developer',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Supabase'],
    liveUrl: 'https://codecraftmanagement.vercel.app/',
    coverImage: '/images/codecraft-mgmt.png',
    images: ['/images/codecraft-mgmt.png'],
    imageCaptions: ['CodeCraft Project Management & Engineering Analytics Dashboard'],
  },
  {
    id: 'cpu-scheduler',
    num: '06',
    title: 'CPU Scheduler Visualizer',
    category: 'Systems / OS Algorithm Simulator',
    tag: 'devtools',
    year: '2024',
    description: 'An interactive learning tool for exploring how CPU scheduling algorithms handle queued processes. I built the simulation interface and Gantt chart views so users can compare FCFS, SJF, Priority, and Round Robin scheduling. The live demo and source make the implementation available to inspect.',
    role: 'Systems Developer',
    techStack: ['TypeScript', 'Operating Systems', 'Algorithm Simulation', 'React'],
    githubUrl: 'https://github.com/marmalade1124/CPUScheduler',
    liveUrl: 'https://cpu-scheduler-beta-five.vercel.app',
    coverImage: '/projects/cpu-scheduler.png',
    images: ['/projects/cpu-scheduler.png'],
    imageCaptions: ['Interactive CPU Simulation Workbench & Process Control Queue'],
  },

  // === SOFTWARE & WEB APPLICATIONS ===
  {
    id: 'codecraft-web',
    num: '07',
    title: 'CodeCraft Official Agency Portal',
    category: 'Web Design / High-Performance Landing',
    tag: 'software',
    year: '2023',
    description: 'The official landing portal for CodeCraft showcasing digital fabrication services, mechanical engineering portfolio, and agency capabilities with high-performance animations.',
    role: 'Frontend Developer & UI Designer',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://codecraftcc.netlify.app/',
    coverImage: '/images/codecraft-web.png',
    images: ['/images/codecraft-web.png'],
    imageCaptions: ['CodeCraft Official Agency Portal & Services Exhibition'],
  },
  {
    id: 'ccnote',
    num: '08',
    title: 'CCNote',
    category: 'Full-Stack / Spatial Knowledge Canvas',
    tag: 'software',
    year: '2024',
    description: 'Collaborative note-taking application and infinite spatial canvas built for engineering teams to structure thoughts, architecture diagrams, and markdown documentation.',
    role: 'Full-Stack Developer',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Shadcn UI'],
    githubUrl: 'https://github.com/marmalade1124/CCNote',
    liveUrl: 'https://cc-note.vercel.app',
    coverImage: '/images/ccnote-v3.png',
    images: ['/images/ccnote-v3.png', '/projects/ccnote.png'],
    imageCaptions: [
      'CCNote Infinite Spatial Note-Taking & Architecture Canvas',
      'CCNote Cyber Terminal Authentication UI',
    ],
  },
  {
    id: 'sindi',
    num: '09',
    title: 'Sindí',
    category: 'AI / Community Outage Monitor',
    tag: 'software',
    year: '2024',
    description: 'AI-powered community power outage monitoring system that scrapes official utility announcements, extracts blackout schedules and affected grids using OCR + NLP, and broadcasts real-time alerts.',
    role: 'Creator & Full-Stack Developer',
    techStack: ['TypeScript', 'Python', 'OCR', 'NLP', 'Next.js', 'Tailwind CSS'],
    githubUrl: 'https://github.com/marmalade1124/Sindi',
  },
  {
    id: 'lockr',
    num: '10',
    title: 'Lockr',
    category: 'Security / Biometric Vault',
    tag: 'software',
    year: '2024',
    description: 'Offline-first biometric password manager app featuring local cryptographic vault storage, hardware-backed authentication, and computer vision hand gesture recognition.',
    role: 'Security & App Developer',
    techStack: ['TypeScript', 'Cryptography', 'Biometrics', 'Computer Vision', 'React'],
    githubUrl: 'https://github.com/marmalade1124/Lockr',
  },
  {
    id: 'audio-watermarking',
    num: '11',
    title: 'MATLAB Audio Watermarking',
    category: 'DSP / Signal Processing',
    tag: 'software',
    year: '2024',
    description: 'Digital audio watermarking system using spread-spectrum techniques and discrete wavelet transform (DWT) for robust copyright protection and signal authentication.',
    role: 'DSP Researcher & Developer',
    techStack: ['MATLAB', 'DSP', 'Discrete Wavelet Transform', 'Signal Processing'],
  },

  // === 3D CAD & HARDWARE BLUEPRINTS ===
  {
    id: 'cad-rack-pinion',
    num: '12',
    title: 'Linear Rack Actuator Mechanism',
    category: '3D CAD / Robotics Motion Control',
    tag: 'cad',
    year: '2024',
    description: 'A CAD study of a rack-and-pinion actuator for translating rotation into linear motion. I modeled the mechanism to explore component arrangement and mechanical movement; torque, backlash, and physical performance have not been validated.',
    role: 'Mechanical CAD Designer',
    techStack: ['SolidWorks', 'Motion Study', 'Gear Design', 'Robotics'],
    coverImage: '/images/cad/rack_pinion.png',
    images: ['/images/cad/rack_pinion.png'],
    imageCaptions: ['Helical Rack & Pinion Precision Actuator Mechanism Blueprint'],
  },
  {
    id: 'cad-dual-axis',
    num: '13',
    title: 'Dual-Axis Gantry System',
    category: '3D CAD / Automated Mechatronics',
    tag: 'cad',
    year: '2024',
    description: 'A CAD concept for an XY gantry using an extrusion frame, belt-driven carriage, and stepper motors. I modeled the assembly to explore how the parts fit together for a pick-and-place application; physical accuracy and load capacity have not been validated.',
    role: 'Mechatronics CAD Designer',
    techStack: ['AutoCAD', 'Mechatronics', 'DFM', 'Stepper Motion'],
    coverImage: '/images/cad/dual_axis.png',
    images: ['/images/cad/dual_axis.png'],
    imageCaptions: ['Automated Dual-Axis XY Pick-and-Place Gantry Module Blueprint'],
  },
  {
    id: 'cad-hopper',
    num: '14',
    title: 'Automated Hopper Feeder',
    category: '3D CAD / Bulk Material Handling',
    tag: 'cad',
    year: '2024',
    description: 'A CAD concept for a gravity-fed material hopper. I modeled the container and supporting mechanism to explore material flow and assembly; food-contact suitability, sanitation, and feed performance have not been validated.',
    role: 'Industrial Design CAD Engineer',
    techStack: ['Fusion 360', 'Sheet Metal', 'Industrial Design', 'Sanitary DFM'],
    coverImage: '/images/cad/hopper.png',
    images: ['/images/cad/hopper.png'],
    imageCaptions: ['Industrial Bulk Hopper Feeder & Agitation Mechanism Blueprint'],
  },
  {
    id: 'cad-hydraulic',
    num: '15',
    title: 'Hydraulic Cylinder Assembly',
    category: '3D CAD / Mechanical Systems',
    tag: 'cad',
    year: '2024',
    description: 'An exploded CAD assembly study of a hydraulic cylinder, showing the relationship between the housing, piston, rod, and end components. I used the breakdown to communicate assembly structure; pressure ratings and physical performance have not been validated.',
    role: 'Technical CAD Illustrator',
    techStack: ['SolidWorks', 'Technical Illustration', 'Assembly Kinematics'],
    coverImage: '/images/cad/motor_assembly.png',
    images: ['/images/cad/motor_assembly.png'],
    imageCaptions: ['Hydraulic Cylinder Exploded CAD Study'],
  },
  {
    id: 'coinnect',
    num: '16',
    title: 'Coinnect Smart Kiosk',
    category: 'IoT / Smart Hardware',
    tag: 'hardware',
    year: '2025',
    description: 'Smart self-service coin-operated kiosk system integrating hardware coin validation, automated dispensing mechanisms, real-time inventory telemetry, and web dashboard.',
    role: 'Lead Engineer — Hardware & Software',
    techStack: ['Arduino', 'Raspberry Pi', 'Python', 'React', 'Node.js', 'Fusion 360'],
  },

  // === VIDEOGRAPHY & MEDIA ARCHIVE ===
  {
    id: 'media-vote-counts',
    num: '17',
    title: 'Your Vote Counts Today',
    category: 'Motion Design / Civic Awareness',
    tag: 'media',
    year: '2023',
    description: 'Motion graphics campaign engineered for student voter engagement and civic awareness, combining kinetic typography and institutional broadcast pacing.',
    role: 'Motion Graphics Designer',
    techStack: ['After Effects', 'Motion Graphics', 'Kinetic Typography', 'Civic Media'],
    videoUrl: 'https://www.facebook.com/watch/?v=9892966404072510',
    coverImage: '/images/video-6.png',
    images: ['/images/video-6.png'],
    imageCaptions: ['Your Vote Counts Today — Motion Graphics & Civic Campaign'],
  },
  {
    id: 'media-collegium-stories',
    num: '18',
    title: 'Collegium: Authentic Stories',
    category: 'Broadcast Journalism / Student Voices',
    tag: 'media',
    year: '2023',
    description: 'Interview and broadcast journalism series spotlighting heartfelt student achievements, collegiate leadership, and community impact.',
    role: 'Host & Video Journalist',
    techStack: ['Broadcast Production', 'Field Audio', 'Interviewing', 'Storytelling'],
    videoUrl: 'https://www.facebook.com/watch/?v=242255092282624',
    coverImage: '/images/video-7.png',
    images: ['/images/video-7.png'],
    imageCaptions: ['Collegium Authentic Stories — Broadcast Video Interview Segment'],
  },
  {
    id: 'media-habang-buhay',
    num: '19',
    title: 'Habang Buhay (Music Video Cover)',
    category: 'Cinematography / Music Video',
    tag: 'media',
    year: '2023',
    description: 'Music video production featuring cinematic composition, mood lighting design, dramatic camera blocking, and tailored tone curve color grading.',
    role: 'Cinematographer & Colorist',
    techStack: ['Cinematography', 'DaVinci Resolve', 'Color Grading', 'Premiere Pro'],
    videoUrl: 'https://www.facebook.com/watch/?v=1198472491202868',
    coverImage: '/images/habang-buhay-v3.png',
    images: ['/images/habang-buhay-v3.png'],
    imageCaptions: ['Habang Buhay Music Video Production & Cinematic Color Grade'],
  },
  {
    id: 'media-short-film',
    num: '20',
    title: 'Wa Gyuy Nagdahom',
    category: 'Cinematic / Short Film',
    tag: 'media',
    year: '2023',
    description: 'Original narrative short film exploring themes of unexpected collegiate encounters, emotional timing, and character destiny.',
    role: 'Director & Lead Editor',
    techStack: ['Directing', 'Editing', 'Sound Design', 'Narrative Cinema'],
    videoUrl: 'https://www.facebook.com/watch/?v=706011470997270',
    coverImage: '/images/video-2.png',
    images: ['/images/video-2.png'],
    imageCaptions: ['Wa Gyuy Nagdahom Short Film Cinematic Still & Stream'],
  },
  {
    id: 'media-mutya-2024',
    num: '21',
    title: 'Mutya ng UMTC 2024',
    category: 'Event Production / Pageant Broadcast',
    tag: 'media',
    year: '2024',
    description: 'Comprehensive multi-camera videography and high-energy highlight montage capturing the coronation, runway talent, and academic excellence of Mutya ng UMTC 2024.',
    role: 'Lead Videographer',
    techStack: ['Multi-Cam Videography', 'After Effects', 'Live Audio', 'Montage Editing'],
    videoUrl: 'https://www.facebook.com/watch/?v=509803185375337',
    coverImage: '/images/video-3.png',
    images: ['/images/video-3.png'],
    imageCaptions: ['Mutya ng UMTC 2024 Live Event Coverage & Highlight Reel'],
  },
  {
    id: 'media-queen-journey',
    num: '22',
    title: 'Journey of the Reigning Queen',
    category: 'Documentary / Character Feature',
    tag: 'media',
    year: '2023',
    description: 'Documentary feature tracking the reign, community service, and personal reflections of the titleholder throughout her collegiate term.',
    role: 'Documentary Cinematographer',
    techStack: ['Documentary Cinematography', 'Story Arc', 'Final Cut Pro', 'Grading'],
    videoUrl: 'https://www.facebook.com/watch/?v=3552733055043603',
    coverImage: '/images/video-9.png',
    images: ['/images/video-9.png'],
    imageCaptions: ['Journey of the Reigning Queen Documentary Video Stream'],
  },
  {
    id: 'media-graduation',
    num: '23',
    title: 'Graduation Highlights',
    category: 'Commencement / Institutional Media',
    tag: 'media',
    year: '2023',
    description: 'Institutional commencement video capturing the ceremonial procession, stage honors, and celebratory celebrations of graduating cohorts.',
    role: 'Event Videographer',
    techStack: ['Event Coverage', 'Telephoto Videography', 'Pacing & Montage'],
    videoUrl: 'https://www.facebook.com/watch/?v=1354518851878369',
    coverImage: '/images/video-10.png',
    images: ['/images/video-10.png'],
    imageCaptions: ['UMTC Graduation Ceremony & Commencement Highlights'],
  },
  {
    id: 'media-mutya-2023',
    num: '24',
    title: 'Mutya ng UMTC 2023 (Live Coverage & Teaser)',
    category: 'Broadcast / Event Production',
    tag: 'media',
    year: '2023',
    description: 'Event videography, live broadcasting coordination, and theatrical teaser trailer production for the 2023 university pageant edition.',
    role: 'Event Production & Teaser Editor',
    techStack: ['Live Streaming', 'Teaser VFX', 'Stage Audio', 'Broadcast Packaging'],
    videoUrl: 'https://www.facebook.com/watch/?v=3735324380124946',
    coverImage: '/images/video-11.png',
    images: ['/images/video-11.png', '/images/video-12.png'],
    imageCaptions: [
      'Mutya ng UMTC 2023 Main Coronation Live Coverage',
      'Mutya ng UMTC 2023 Theatrical Cinematic Teaser Trailer',
    ],
  },

  // === DEVELOPER TOOLS ===
  {
    id: 'mdx-readme',
    num: '25',
    title: 'MDX Readme Studio',
    category: 'Web App / Documentation Tool',
    tag: 'devtools',
    year: '2024',
    description: 'Open-source documentation and README generator featuring real-time live previews, curated modular developer templates, and instant Markdown export.',
    role: 'Full-Stack Developer',
    techStack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Markdown AST'],
    githubUrl: 'https://github.com/marmalade1124/MDX',
    liveUrl: 'https://read-me-dusky.vercel.app',
    coverImage: '/projects/mdx-readme.png',
    images: ['/projects/mdx-readme.png'],
    imageCaptions: ['MDX Readme Studio AI Generator Hub & GitHub Connector'],
  },
  {
    id: 'arduino-visualizer',
    num: '26',
    title: 'Arduino Visualizer',
    category: 'Developer Tools / VS Code Extension',
    tag: 'devtools',
    year: '2024',
    description: 'VS Code developer extension that statically parses Arduino C++ source code and renders live visual breadboard diagrams, pinout schematics, and component wiring in real time.',
    role: 'Extension Author',
    techStack: ['TypeScript', 'VS Code API', 'AST Parsing', 'SVG Canvas', 'Arduino C++'],
    githubUrl: 'https://github.com/marmalade1124/Arduino-Visualizer',
  },
  {
    id: 'viewportlab',
    num: '28',
    title: 'ViewportLab',
    category: 'Developer Tools / Responsive Testing',
    tag: 'devtools',
    year: '2024',
    description: 'Synchronized multi-viewport web responsiveness simulator enabling developers to test and interact with web layouts across 3 synchronized device viewports concurrently.',
    role: 'Creator',
    techStack: ['TypeScript', 'React', 'Responsive Design', 'Web APIs'],
    githubUrl: 'https://github.com/marmalade1124/ViewportLab',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 'exp-cad',
    role: '3D CAD Designer',
    company: 'CODE&CRAFT',
    period: '2024 — Present',
    bullets: [
      'Designed and developed custom 3D models, enclosures, and mechanical components for engineering and student thesis projects.',
      'Created precise CAD drawings and 3D models to support prototyping, assembly, and presentation requirements.',
      'Revised enclosure and mechanical models from client requirements, measurements, and project feedback.',
    ],
  },
  {
    id: 'exp-graphics',
    role: 'Graphic Designer',
    company: 'CODE&CRAFT',
    period: '2011 — Present',
    bullets: [
      'Created event materials, brand graphics, and school publication layouts for print and digital use.',
      'Collaborated with clients to transform concepts into polished graphics for print, marketing, and digital platforms.',
      'Prepared revised layouts and final artwork to match client briefs and publication styles.',
    ],
  },
  {
    id: 'exp-student',
    role: 'Computer Engineering Practice',
    company: 'UM Tagum College',
    period: '2020 — Present',
    bullets: [
      'Engineered embedded systems, IoT hardware prototypes, and full-stack software applications across multidisciplinary academic coursework.',
      'Worked on capstone hardware-software integration and technical documentation.',
      'Collaborated with engineering student teams on robotics, digital signal processing, and game design architectures.',
    ],
  },
];

export const LEADERSHIP: Leadership[] = [
  {
    id: 'lead-collegium',
    role: 'Senior Video Journalist',
    org: 'The Collegium',
    period: '2023 — 2025',
    details: 'Led investigative videography, documentary storytelling, and campus media productions.',
  },
  {
    id: 'lead-sg',
    role: 'Head Technical / Junior Technical',
    org: 'Department of Student Government — Engineering',
    period: '2023 — 2025',
    details: 'Head Technical (2024–2025) · Junior Technical (2023–2024) — directed technical operations, live streaming, and stage electronics.',
  },
];

export const EDUCATION: Education[] = [
  {
    id: 'edu-bscpe',
    degree: 'Bachelor of Science in Computer Engineering',
    school: 'UM Tagum College',
    period: '2020 — Present · Expected 2027',
    details: 'Currently pursuing the degree, with project work in embedded systems, CAD, and software development.',
  },
  {
    id: 'edu-shs',
    degree: 'Senior High School (STEM)',
    school: 'UM Tagum College',
    period: '2019 — 2020',
    details: 'Science, Technology, Engineering and Mathematics Strand.',
  },
];

export const SKILLS: SkillCategory[] = [
  {
    label: 'Languages',
    items: ['C / C++', 'Python', 'TypeScript', 'JavaScript', 'MATLAB', 'SQL', 'HTML / CSS'],
  },
  {
    label: 'Frameworks & Web',
    items: ['React 19', 'Next.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Prisma', 'React Native'],
  },
  {
    label: 'Hardware / CAD',
    items: ['Fusion 360', 'SolidWorks', 'Arduino', 'Raspberry Pi', '3D Printing (FDM)', 'DFM Prototyping', 'IoT Sensors'],
  },
  {
    label: 'Tools & Media',
    items: ['Git / GitHub', 'Figma', 'DaVinci Resolve', 'Adobe Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator'],
  },
];

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
] as const;
