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
  videoUrl?: string;
  coverImage?: string;
  images?: string[];
  imageCaptions?: string[];
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
  title: 'Computer Engineer',
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
  // === TOP FLAGSHIP WORKS (SHOWCASED IN INITIAL 6 CARDS) ===
  {
    id: 'the-collegium',
    num: '01',
    title: 'The Collegium',
    category: 'Digital Newsroom / Web App',
    tag: 'software',
    year: '2026',
    description: 'Flagship digital newsroom platform for collegiate journalism featuring live announcement tickers, investigative article readers, multimedia flipbook publications, and a searchable news archive.',
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
    num: '02',
    title: 'Industrial Logic Controller Enclosure',
    category: '3D CAD / Rugged Electronics',
    tag: 'cad',
    year: '2024',
    description: 'Ruggedized electronics enclosure designed for extreme industrial environments and custom PCB assemblies. Engineered with IP67 sealing, integrated thermal dissipation fins, and modular I/O ports.',
    role: '3D CAD Designer & DFM Prototyper',
    techStack: ['Fusion 360', 'Injection Molding', 'Thermal Analysis', 'DFM Prototyping'],
    coverImage: '/images/cad/enclosure.png',
    images: ['/images/cad/enclosure.png'],
    imageCaptions: ['IP67 Ruggedized Industrial Electronics Enclosure Blueprint'],
  },
  {
    id: 'media-mutya-bts',
    num: '03',
    title: 'Mutya ng UMTC 2024: BTS',
    category: 'Videography / Behind The Scenes',
    tag: 'media',
    year: '2024',
    description: 'Behind-the-scenes documentary cinematography capturing the intensive stage preparation, technical choreography, and creative direction of the annual university pageant.',
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
    description: 'All-in-one 3D printer fleet management and automated print job dispatch system engineered for fabrication businesses, print farms, and rapid prototyping workflows.',
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
    description: 'Comprehensive project management dashboard designed for software engineering teams, featuring task boards, milestone tracking, team analytics, and resource allocation.',
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
    description: 'Interactive operating systems visual simulator for CPU scheduling algorithms (FCFS, SJF, Priority, Round Robin) with real-time Gantt chart generation and latency benchmarking.',
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
    description: 'Precision motion control mechanism utilizing a helical rack and pinion system. Designed for high-torque robotic arm applications with backlash compensation capabilities.',
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
    description: 'Scalable XY gantry module for automated pick-and-place systems. Lightweight aluminium extrusion frame with belt-driven carriage and NEMA 17 stepper motor integration.',
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
    description: 'Gravity-fed bulk material handling system with vibrational agitation flow control. Designed for food-grade processing lines with quick-release mechanisms for sanitation.',
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
    description: 'Exploded view engineering analysis of a high-pressure hydraulic cylinder. Detailed component breakdown including piston seals, rod guides, and end cap retention systems.',
    role: 'Technical CAD Illustrator',
    techStack: ['SolidWorks', 'Technical Illustration', 'Assembly Kinematics'],
    coverImage: '/images/cad/motor_assembly.png',
    images: ['/images/cad/motor_assembly.png'],
    imageCaptions: ['High-Pressure Hydraulic Cylinder Exploded Assembly Diagram'],
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
    id: 'picolor',
    num: '27',
    title: 'PiColor',
    category: 'Design Tools / Math Algorithms',
    tag: 'devtools',
    year: '2024',
    description: 'Algorithmic color palette generator for UI/UX designers utilizing the Golden Ratio (phi) formula and mathematical harmonic color space distribution.',
    role: 'Creator & Algorithm Designer',
    techStack: ['TypeScript', 'Color Science', 'Golden Ratio Math', 'React'],
    githubUrl: 'https://github.com/marmalade1124/PiColor',
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
      'Collaborated with clients and engineering teams to translate project concepts into workable mechanical designs, improving efficiency and innovation.',
    ],
  },
  {
    id: 'exp-graphics',
    role: 'Graphic Designer',
    company: 'CODE&CRAFT',
    period: '2011 — Present',
    bullets: [
      'Created layouts for event materials, branding identity, and school publication content (pubmats) with visually striking designs.',
      'Collaborated with clients to transform concepts into polished graphics for print, marketing, and digital platforms.',
      'Delivered high-quality, brand-consistent designs while meeting tight deadlines and strict production style requirements.',
    ],
  },
  {
    id: 'exp-student',
    role: 'Computer Engineering Practice',
    company: 'UM Tagum College',
    period: '2020 — 2025',
    bullets: [
      'Engineered embedded systems, IoT hardware prototypes, and full-stack software applications across multidisciplinary academic coursework.',
      'Spearheaded capstone hardware-software integration projects and technical documentation.',
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
    period: '2020 — 2025',
    details: 'Major in Embedded Systems & Game Design. Comprehensive user experience & hardware-software engineering practice.',
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
