export interface SeedCategory {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  icon: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface SeedCourse {
  id: string;
  slug: string;
  title: string;
  category: string;
  popular: boolean;
  featured: boolean;
  shortDescription: string;
  fullDescription: string;
  image: string;
  duration: string;
  level: string;
  mode: 'Physical' | 'Hybrid' | 'Online';
  price: number;
  formattedPrice: string;
  upcomingCohort: string;
  schedule: string;
  tools: string[];
  prerequisites: string;
  outcomes: string[];
  curriculum: Array<{
    week: number;
    title: string;
    topics: string[];
  }>;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  status: 'active' | 'suspended';
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: 'filmmaking',
    name: 'Video Production & Cinematography',
    shortLabel: 'Video & Film',
    description: 'Master camera rigs, cinematic 3-point lighting, narrative directing & real-world set execution.',
    icon: 'Film',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'photography',
    name: 'Professional Photography & Studio Lighting',
    shortLabel: 'Photography',
    description: 'Studio strobe lighting, editorial portraiture, fashion shoots, documentary & Adobe Lightroom retouching.',
    icon: 'Camera',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'editing',
    name: 'Video Editing & Color Grading Mastery',
    shortLabel: 'Video Editing',
    description: 'Premiere Pro & DaVinci Resolve workflows, pacing, multi-cam assembly, audio sweetening & cinematic color science.',
    icon: 'Scissors',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'content',
    name: 'Content Creation & Digital Media Strategy',
    shortLabel: 'Content Creation',
    description: 'Short-form viral content (Reels/TikTok/Shorts), storytelling, YouTube channel growth & personal branding.',
    icon: 'Smartphone',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'motion',
    name: 'Motion Graphics & Visual Effects (VFX)',
    shortLabel: 'Motion Graphics',
    description: 'Adobe After Effects motion design, title animations, 3D elements, logo stings, and broadcast packaging.',
    icon: 'Sparkles',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'audio',
    name: 'Audio Engineering & Podcast Production',
    shortLabel: 'Audio & Podcast',
    description: 'Studio microphone techniques, live broadcast switching, Rodecaster console engineering & podcast syndication.',
    icon: 'Mic',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
];

export const SEED_COURSES: SeedCourse[] = [
  {
    id: 'video-production',
    slug: 'video-production',
    title: 'Video Production & Cinematography',
    category: 'filmmaking',
    popular: true,
    featured: true,
    shortDescription: 'Master camera operation, cinematic lighting, visual storytelling, directing, and real-world film shoot execution.',
    fullDescription: 'Our flagship hands-on program gives you the exact skills used by Nollywood and international commercial filmmakers. You will handle professional cinema rigs, configure multi-point studio lighting, direct talent, and execute complete production shoots from script to wrap.',
    image: 'https://images.unsplash.com/photo-1579632652988-6f9bf3777c5f?auto=format&fit=crop&w=1000&q=80',
    duration: '8 Weeks',
    level: 'Beginner → Intermediate',
    mode: 'Physical',
    price: 135000,
    formattedPrice: '₦135,000',
    upcomingCohort: 'April 6, 2026',
    schedule: 'Mondays & Wednesdays (10:00 AM - 2:00 PM) or Weekend Cohort (Saturdays 9:00 AM - 4:00 PM)',
    tools: ['Sony FX3 / FX6 Cinema Rigs', 'Aputure & Godox Studio Lighting', 'Wireless Rode / Sennheiser Audio', 'Gimbals & Fluid Heads', 'Directing Call Sheets'],
    prerequisites: 'No prior camera experience required. Passion for visual storytelling and enthusiasm to work in physical production crews.',
    status: 'active',
    outcomes: [
      'Operate professional mirrorless and cinema camera systems with manual exposure control',
      'Design cinematic 3-point and creative colored lighting setups for interviews, music videos, and narrative scenes',
      'Record crystal-clear multi-channel wireless audio in noisy or studio environments',
      'Direct crew members, block actors, and manage shot lists under realistic production deadlines',
      'Graduate with a complete directorial showreel project to showcase to clients and agencies'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Camera Anatomy & Cinematic Optics',
        topics: ['Sensor sizes, focal lengths, aperture, shutter angle, and ISO dynamics', 'Depth of field and lens selection for emotional impact', 'Practical rig assembly & balancing']
      },
      {
        week: 2,
        title: 'Cinematography & Visual Framing',
        topics: ['Rule of thirds, lead room, head room, golden ratio & breaking rules intentionally', 'Camera movement: handheld, gimbal work, slider, dolly and motivated pans', 'Composition exercises']
      },
      {
        week: 3,
        title: 'Lighting Fundamentals & Studio Setups',
        topics: ['Hard vs. soft light, color temperature (Kelvin), diffusion and bounce', '3-point studio lighting setup: Key, Fill, Rim/Hair light', 'Practical lighting for commercial interviews']
      },
      {
        week: 4,
        title: 'Audio Capture & Sound Staging',
        topics: ['Boom mics, shotgun polar patterns, and lavalier placement', 'Managing gain staging, latency, and eliminating background hum', 'Dual-system sound synchronization']
      },
      {
        week: 5,
        title: 'Pre-Production & Directing',
        topics: ['Script breakdown, moodboarding, and storyboard visualization', 'Creating call sheets, location scouting, and talent coordination', 'Directing actors and non-actors for natural delivery']
      },
      {
        week: 6,
        title: 'Production Shoots (Live Sets)',
        topics: ['Multi-camera commercial studio shoot', 'Narrative short scene under controlled set conditions', 'Music video aesthetic shoot']
      },
      {
        week: 7,
        title: 'Post-Production Sync & Rough Cuts',
        topics: ['Ingesting footage, organizing proxy workflows, and audio syncing', 'Editorial pacing, match cuts, and L/J-cuts for story momentum']
      },
      {
        week: 8,
        title: 'Graduation Showcase & Portfolio Delivery',
        topics: ['Fine cut polishing and client delivery formats', 'Color profile fundamentals (S-Log/C-Log basics)', 'Industry pitch review & certification ceremony']
      }
    ],
    instructorName: 'Tunde Adebayo',
    instructorRole: 'Lead Cinematographer & Commercial Director',
    instructorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'photography',
    slug: 'photography',
    title: 'Professional Photography & Studio Lighting',
    category: 'photography',
    popular: false,
    featured: true,
    shortDescription: 'Master manual exposure, studio strobe lighting, portraiture, fashion, documentary, and Adobe Lightroom retouching.',
    fullDescription: 'Transform from capturing casual snaps to creating magazine-worthy editorial portraits, commercial product shots, and striking events photography. You will gain mastery over studio strobes, speedlights, light modifiers, and client curation workflows.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    duration: '6 Weeks',
    level: 'Beginner → Intermediate',
    mode: 'Hybrid',
    price: 105000,
    formattedPrice: '₦105,000',
    upcomingCohort: 'April 13, 2026',
    schedule: 'Tuesdays & Thursdays (11:00 AM - 2:00 PM) + Saturday Studio Practicals',
    tools: ['DSLR & Mirrorless Cameras', 'Godox Studio Strobes & Softboxes', 'Beauty Dishes & C-Stands', 'Adobe Lightroom Classic', 'Adobe Photoshop'],
    prerequisites: 'Open to beginners. You can use academy studio cameras during practicals; having your own camera is a plus but not mandatory.',
    status: 'active',
    outcomes: [
      'Shoot in full Manual (M) mode with absolute confidence in any lighting situation',
      'Sculpt light using softboxes, umbrellas, grids, and reflectors for dramatic portraiture',
      'Conduct professional client portrait and fashion studio sessions',
      'Batch edit, color grade, and retouch skin naturally in Lightroom and Photoshop',
      'Build a commercial photography portfolio ready for bookings'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Camera Mastery & The Exposure Triangle',
        topics: ['Aperture, shutter speed, ISO balance and focal metering', 'RAW vs. JPEG, histogram evaluation, and focus modes']
      },
      {
        week: 2,
        title: 'Natural Light & Environmental Composition',
        topics: ['Golden hour vs. midday harsh light management', 'Reflectors, diffusers, and framing the human subject naturally']
      },
      {
        week: 3,
        title: 'Studio Lighting & Strobe Physics',
        topics: ['Flash sync speed, guide numbers, high-speed sync (HSS)', 'Key light ratios, rim lighting, and backdrop illumination']
      },
      {
        week: 4,
        title: 'Studio Portrait & Fashion Practicals',
        topics: ['Posing models and directing non-professional clients', 'Beauty lighting (Clamshell, Rembrandt, Butterfly setups)']
      },
      {
        week: 5,
        title: 'Digital Post-Processing & Retouching',
        topics: ['Adobe Lightroom curation, color grading, curves and masking', 'Photoshop frequency separation and skin tone enhancement']
      },
      {
        week: 6,
        title: 'Commercial Product & Portfolio Exhibition',
        topics: ['Product table-top photography and reflective surface lighting', 'Curating a 10-piece signature portfolio for client acquisition']
      }
    ],
    instructorName: 'Zainab Okonjo',
    instructorRole: 'Editorial & Fashion Photographer',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'video-editing',
    slug: 'video-editing',
    title: 'Professional Video Editing & Post-Production',
    category: 'editing',
    popular: true,
    featured: true,
    shortDescription: 'Master Premiere Pro & DaVinci Resolve: rhythm, storytelling, sound design, color grading, and dynamic reels editing.',
    fullDescription: 'Video editors are among the most sought-after creators worldwide. This intensive course teaches you how to turn raw clips into compelling commercial videos, viral TikTok/Reels, documentaries, and YouTube content with seamless pacing and pro-level audio.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
    duration: '6 Weeks',
    level: 'Beginner → Intermediate',
    mode: 'Hybrid',
    price: 95000,
    formattedPrice: '₦95,000',
    upcomingCohort: 'April 6, 2026',
    schedule: 'Mondays & Wednesdays (4:00 PM - 7:00 PM) or Weekend Cohort',
    tools: ['Adobe Premiere Pro', 'DaVinci Resolve Studio', 'Frame.io', 'CapCut Pro Desktop', 'Audition / Fairlight'],
    prerequisites: 'Basic computer literacy. Laptop capable of running video editing software (or access to Academy PC editing suites).',
    status: 'active',
    outcomes: [
      'Master professional non-linear timeline editing shortcuts and rapid assembly workflows',
      'Cut for emotion, tempo, pacing, and retention across social, commercial, and narrative edits',
      'Build rich atmospheric soundscapes with Foley, sound effects, and volume ducking',
      'Color correct and apply cinematic LUTs in DaVinci Resolve and Lumetri Color',
      'Export high-fidelity video optimized for Instagram, YouTube, TikTok, and broadcast TV'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Editorial Foundations & Workflow Optimization',
        topics: ['Folder structuring, proxy creation, project bins, and timeline shortcuts', 'Three-point editing, J-cuts, L-cuts, and match cuts']
      },
      {
        week: 2,
        title: 'The Art of Narrative Pacing & Montage',
        topics: ['Building narrative tension, comedic timing, and documentary pacing', 'Speed ramping, time remapping, and optical flow transitions']
      },
      {
        week: 3,
        title: 'High-Retention Short-Form Editing (Reels/TikTok/Shorts)',
        topics: ['Dynamic caption animations, visual hooks in the first 3 seconds', 'Sound pop effects, overlay graphics, and engaging b-roll layering']
      },
      {
        week: 4,
        title: 'Sound Design & Audio Mastering',
        topics: ['Voice isolation, EQing dialogue, noise reduction, and compressor usage', 'Strategic sound effects (whooshes, risers, hits) and musical beat syncing']
      },
      {
        week: 5,
        title: 'Color Correction & Cinematic Grading',
        topics: ['Reading waveforms, scopes, vectorscopes, and correcting white balance', 'Primary & secondary color wheels, skin tone isolation, and LUT application']
      },
      {
        week: 6,
        title: 'Client Revisions, Packaging & Showreel',
        topics: ['Export codecs (H.264, ProRes), bitrates, mastering loudness standards (-14 LUFS)', 'Creating a high-converting editor showreel to land international gigs']
      }
    ],
    instructorName: 'Emeka Nwosu',
    instructorRole: 'Senior Post-Production Supervisor',
    instructorAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'content-creation',
    slug: 'content-creation',
    title: 'Social Media Content Creation & Digital Growth',
    category: 'content',
    popular: true,
    featured: true,
    shortDescription: 'Learn how to ideate, script, shoot with your smartphone, edit viral hooks, and monetize on Instagram, TikTok & YouTube.',
    fullDescription: 'Stop guessing what makes algorithms tick. This practical accelerator teaches content creators, business owners, and digital influencers how to consistently produce captivating short-form videos, podcasts, and digital campaigns that attract thousands of engaged followers and paying customers.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80',
    duration: '4 Weeks',
    level: 'All Levels',
    mode: 'Online',
    price: 75000,
    formattedPrice: '₦75,000',
    upcomingCohort: 'April 6, 2026',
    schedule: 'Mondays & Thursdays (6:30 PM - 8:30 PM) + Live Weekend Q&As',
    tools: ['Smartphone Filmmaking Rig', 'CapCut & Premiere Rush', 'Canva Pro & Notion', 'Wireless Smartphone Mics', 'Meta Business Suite & TikTok Creator Studio'],
    prerequisites: 'A smartphone (iOS or Android) and enthusiasm to create on-camera or faceless content.',
    status: 'active',
    outcomes: [
      'Develop an endless content ideation engine tailored to your niche',
      'Shoot studio-quality video with just your smartphone and affordable accessories',
      'Script irresistible hooks that boost average watch time and engagement',
      'Batch-produce a month of high-quality content in a single weekend',
      'Monetize through brand partnerships, digital products, and client retainer deals'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Niche Positioning, Audience Psychology & Ideation',
        topics: ['Defining your creator archetype and unfair advantage', 'Audience pain points, trend spotting, and Notion content bank system']
      },
      {
        week: 2,
        title: 'Smartphone Cinematography & Studio Setup on a Budget',
        topics: ['Natural window lighting vs. cheap ring lights/LED wands', 'Audio hacks: lavalier placement and background noise suppression', 'Framing and teleprompter apps']
      },
      {
        week: 3,
        title: 'High-Retention Scripting & Mobile Editing',
        topics: ['The 3-second hook formula, storytelling middle, and punchy CTA', 'CapCut transitions, auto-captions, sound effects, and thumbnail design']
      },
      {
        week: 4,
        title: 'Algorithm Distribution, Analytics & Monetization',
        topics: ['Posting schedules, hashtag strategy, community engagement rituals', 'Negotiating brand sponsorship rates, media kits, and affiliate launches']
      }
    ],
    instructorName: 'Kelechi Davies',
    instructorRole: 'Digital Creator (500k+ Audience) & Growth Strategist',
    instructorAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'motion-graphics',
    slug: 'motion-graphics',
    title: 'Motion Graphics & Visual Effects (After Effects)',
    category: 'motion',
    popular: false,
    featured: true,
    shortDescription: 'Master Adobe After Effects: 2D animation, kinetic typography, logo reveals, UI animation, and visual effects compositing.',
    fullDescription: 'Bring still graphics to life with fluid motion design. Learn the principles of animation, easing curves, title sequencing, lower thirds, 3D camera tracking, and VFX compositing used in broadcast television, commercial advertising, and SaaS product launches.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    duration: '8 Weeks',
    level: 'Intermediate',
    mode: 'Hybrid',
    price: 120000,
    formattedPrice: '₦120,000',
    upcomingCohort: 'April 13, 2026',
    schedule: 'Wednesdays & Fridays (4:00 PM - 7:00 PM) + Studio lab',
    tools: ['Adobe After Effects', 'Adobe Illustrator', 'Maxon Cinema 4D Lite', 'Overlord & EaseCopy Plugins'],
    prerequisites: 'Basic familiarity with graphic design or video editing concepts.',
    status: 'active',
    outcomes: [
      'Master keyframing, velocity curves, and graph editor for organic physics-based animation',
      'Create energetic kinetic typography and broadcast lower thirds',
      'Animate complex logo reveals and brand intro bumpers',
      'Track 3D camera scenes and composite graphics seamlessly into live-action footage',
      'Produce commercial motion design explainers and dynamic social ads'
    ],
    curriculum: [
      {
        week: 1,
        title: 'After Effects Interface & Animation Principles',
        topics: ['Transform properties, anchor point logic, timing and spacing', 'The 12 principles of animation applied to digital motion']
      },
      {
        week: 2,
        title: 'The Graph Editor & Organic Motion Curves',
        topics: ['Speed vs. Value graphs, easing in and out for snappy modern animation', 'Parenting, null objects, and pre-comp architecture']
      },
      {
        week: 3,
        title: 'Kinetic Typography & Text Animators',
        topics: ['Text range selectors, tracking, wiggle animators, and expressive title sequences', 'Syncing text reveals with voiceovers and beat drops']
      },
      {
        week: 4,
        title: 'Shape Layer Animations & Morphing',
        topics: ['Trim paths, repeaters, wiggle paths, and geometric transitions', 'Vector import workflow from Illustrator to After Effects']
      },
      {
        week: 5,
        title: 'Logo Reveals & 3D Layer Spaces',
        topics: ['3D switches, cameras, point lights, and depth of field in AE', 'Crafting dynamic 5-second brand stingers']
      },
      {
        week: 6,
        title: 'VFX Compositing & Screen Replacement',
        topics: ['Mocha planar tracking, green screen keying with Keylight, and rotoscoping', 'Screen replacement on smartphones and laptop displays']
      },
      {
        week: 7,
        title: 'Commercial Explainer Project',
        topics: ['Building a full 30-second commercial motion design advert', 'Sound design for motion graphics (Foley and musical hit points)']
      },
      {
        week: 8,
        title: 'Render Optimization & Motion Reel Showcase',
        topics: ['Lottie / JSON web animations vs. MP4/ProRes rendering', 'Assembling a competitive motion design showreel']
      }
    ],
    instructorName: 'David Oladipo',
    instructorRole: 'Lead Motion Designer & VFX Artist',
    instructorAvatar: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sound-design',
    slug: 'sound-design',
    title: 'Sound Design & Podcast Audio Production',
    category: 'audio',
    popular: false,
    featured: false,
    shortDescription: 'Master audio recording, acoustic treatment, voice mixing, sound effects design, and podcast broadcasting.',
    fullDescription: 'Good video is nothing without great sound. Learn professional recording techniques, dialogue cleanup, sound design Foley, mixing, and how to set up and engineer broadcast-ready podcasts.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
    duration: '4 Weeks',
    level: 'Beginner → Intermediate',
    mode: 'Physical',
    price: 80000,
    formattedPrice: '₦80,000',
    upcomingCohort: 'April 20, 2026',
    schedule: 'Mondays & Wednesdays (2:00 PM - 5:00 PM)',
    tools: ['Shure SM7B & Rode PodMic', 'Focusrite Scarlett & Rodecaster Pro', 'Adobe Audition / Pro Tools', 'iZotope RX Audio Repair'],
    prerequisites: 'No prior sound engineering experience needed.',
    status: 'active',
    outcomes: [
      'Set up and operate multi-host podcast recording studios with zero feedback or noise',
      'Clean muddy, noisy, or echoey voice tracks using industry spectral repair tools',
      'Mix and master dialogue to broadcast loudness standards (-16 LUFS podcast standard)',
      'Design immersive sound effects and cinematic ambiance for films and ads'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Acoustics & Microphone Technologies',
        topics: ['Dynamic vs. Condenser mics, polar patterns, proximity effect, room treatment']
      },
      {
        week: 2,
        title: 'Studio Recording & Multi-track Capture',
        topics: ['Gain staging, audio interfaces, Rodecaster Pro configuration, live podcast engineering']
      },
      {
        week: 3,
        title: 'Voice Mixing, EQ, Compression & Noise Reduction',
        topics: ['De-essing, parametric EQ, multiband compression, iZotope RX noise removal']
      },
      {
        week: 4,
        title: 'Soundscapes & Podcast Distribution',
        topics: ['Layering ambient sound effects, music beds, RSS feed syndication to Spotify & Apple']
      }
    ],
    instructorName: 'Victor Adeleke',
    instructorRole: 'Audio Engineer & Podcast Producer',
    instructorAvatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'drone-cinematography',
    slug: 'drone-cinematography',
    title: 'Drone Cinematography & Aerial Media',
    category: 'filmmaking',
    popular: false,
    featured: false,
    shortDescription: 'Learn drone flight safety, aerial camera movements, landscape composition, and commercial inspection/filming.',
    fullDescription: 'Add breathtaking aerial angles to your productions. Learn flight physics, weather assessment, legal safety guidelines, ND filter selection, and cinematic flight patterns like the reveal, orbiting, and top-down birds-eye sweep.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
    duration: '3 Weeks',
    level: 'All Levels',
    mode: 'Physical',
    price: 90000,
    formattedPrice: '₦90,000',
    upcomingCohort: 'April 27, 2026',
    schedule: 'Fridays & Saturdays (Outdoor flight practicals)',
    tools: ['DJI Air 3 & Mavic 3 Pro Drones', 'DJI RC 2 Controllers', 'Freewell ND/PL Filters', 'Drone Flight Safety Checklists'],
    prerequisites: 'Open to all students. Academy provides training drones during outdoor sessions.',
    status: 'active',
    outcomes: [
      'Fly drones with steady, cinematic manual control in varied weather conditions',
      'Execute signature Hollywood aerial maneuvers (dronie, pedestal reveal, orbit)',
      'Manage exposure using ND filters to maintain standard shutter angles in bright daylight',
      'Shoot and stitch high-resolution aerial panoramas and hyperlapses'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Flight Mechanics, Safety & Pre-Flight Checks',
        topics: ['GPS calibration, battery management, airspace regulations, obstacle avoidance']
      },
      {
        week: 2,
        title: 'Cinematic Flight Moves & Framing',
        topics: ['Dual stick coordination, parallax effects, framing moving subjects smoothly']
      },
      {
        week: 3,
        title: 'Commercial Aerial Workflow & Showcase',
        topics: ['Real estate sweeps, event coverage, D-Log color grading in post']
      }
    ],
    instructorName: 'Tunde Adebayo',
    instructorRole: 'Lead Cinematographer & Certified Drone Pilot',
    instructorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'color-grading',
    slug: 'color-grading',
    title: 'DaVinci Resolve Color Grading & Finishing',
    category: 'editing',
    popular: false,
    featured: true,
    shortDescription: 'Master color science, node-based workflows, LUT creation, skin tone isolation, and cinema finishing.',
    fullDescription: 'Become a certified colorist. Learn how to transform flat log footage (S-Log3, C-Log, B-Raw) into rich cinematic pictures using DaVinci Resolve Studio color wheels, power grades, HDR palettes, and custom LUT calibration.',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1000&q=80',
    duration: '5 Weeks',
    level: 'Intermediate → Advanced',
    mode: 'Hybrid',
    price: 110000,
    formattedPrice: '₦110,000',
    upcomingCohort: 'April 13, 2026',
    schedule: 'Tuesdays & Thursdays (5:00 PM - 8:00 PM) + Studio lab',
    tools: ['DaVinci Resolve Studio 19', 'DaVinci Micro Panel', 'Calibrated OLED Reference Monitors', 'X-Rite Color Checkers'],
    prerequisites: 'Basic knowledge of video editing. Understanding of video formats and timeline basics.',
    status: 'active',
    outcomes: [
      'Master DaVinci Resolve node tree architecture (serial, parallel, layer, and compound nodes)',
      'Balance shots effortlessly across different camera brands and mixed lighting setups',
      'Isolate and beautify skin tones with precision qualifiers and 3D tracker masks',
      'Create signature film look PowerGrades (Kodak 2383, teal & orange, vintage film emulation)',
      'Export broadcast-ready masters complying with Netflix & YouTube color standards'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Color Science & Primary Color Correction',
        topics: ['Color spaces (Rec.709, ACES, DaVinci Wide Gamut), reading waveforms & vectorscopes', 'Primary wheels, log wheels, lift/gamma/gain tonal balancing']
      },
      {
        week: 2,
        title: 'Secondary Corrections & Isolation Qualifiers',
        topics: ['HSL curves, 3D qualifier, power windows, and cloud tracker tracking', 'Isolating skin tones and matching multi-camera interviews']
      },
      {
        week: 3,
        title: 'Film Emulation & Look Development',
        topics: ['Building custom 3D LUTs, halation, film grain, and Kodak print film emulation', 'Split toning and contrast curve manipulation']
      },
      {
        week: 4,
        title: 'Commercial, Music Video & Narrative Grading',
        topics: ['High-contrast luxury look grading, music video neon styles, and moody drama palettes', 'Noise reduction, face refinement, and beauty retouching']
      },
      {
        week: 5,
        title: 'Delivery, QC & Client Revisions',
        topics: ['Exporting DCPs for cinema projection, ProRes 4444 masters, and web deliverables', 'Colorist reel packaging and client review workflow with Frame.io']
      }
    ],
    instructorName: 'Emeka Nwosu',
    instructorRole: 'Senior Post-Production Supervisor & Colorist',
    instructorAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'documentary-photography',
    slug: 'documentary-photography',
    title: 'Documentary, Event & Street Photography',
    category: 'photography',
    popular: false,
    featured: false,
    shortDescription: 'Master visual journalism, cultural storytelling, fast-paced event coverage, and photojournalistic editing.',
    fullDescription: 'Learn to capture unfiltered human emotion, dynamic cultural festivals, weddings, concerts, and social narratives. You will master fast lens handling, candid portraiture, low-light event photography, and publication-ready photo essays.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1000&q=80',
    duration: '4 Weeks',
    level: 'Beginner → Intermediate',
    mode: 'Physical',
    price: 90000,
    formattedPrice: '₦90,000',
    upcomingCohort: 'April 20, 2026',
    schedule: 'Fridays & Saturdays (Live street photowalks & events)',
    tools: ['Mirrorless / DSLR 35mm & 50mm Prime Lenses', 'On-Camera Speedlights', 'Lightroom Mobile & Desktop', 'Photo Essay Curation Sheets'],
    prerequisites: 'Basic understanding of camera shutter, aperture, and ISO.',
    status: 'active',
    outcomes: [
      'Anticipate candid moments and capture fast-moving subjects with tack-sharp focus',
      'Master bounced and direct flash for high-energy concert and wedding environments',
      'Curate cohesive 12-image visual photo essays with emotional narrative arc',
      'Pitch stories to editorial magazines, news agencies, and NGOs'
    ],
    curriculum: [
      {
        week: 1,
        title: 'The Art of the Candid & Street Ethics',
        topics: ['Approaching subjects, ethical considerations, spatial awareness, and decisive moment timing']
      },
      {
        week: 2,
        title: 'Low-Light & Event Atmosphere Capture',
        topics: ['High ISO noise management, dragging the shutter, on-camera bounce flash techniques']
      },
      {
        week: 3,
        title: 'Cultural Festivals & Wedding Coverage',
        topics: ['Documenting traditions, color dynamics, fast lens switching, and storytelling angles']
      },
      {
        week: 4,
        title: 'Photo Essay Curation & Editorial Pitching',
        topics: ['Sequencing narrative series, writing caption copy, building an editorial portfolio']
      }
    ],
    instructorName: 'Zainab Okonjo',
    instructorRole: 'Editorial & Documentary Photographer',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'podcast-production',
    slug: 'podcast-production',
    title: 'Podcast Studio Setup & Live Broadcasting',
    category: 'audio',
    popular: false,
    featured: false,
    shortDescription: 'Master multi-cam podcast filming, live switching, Rodecaster audio, YouTube video podcasting, and distribution.',
    fullDescription: 'Video podcasting is one of the fastest growing media formats. Learn how to design an attractive podcast studio set, operate multi-camera switchers (ATEM Mini), record broadcast-grade dialogue, and distribute audio-video episodes across YouTube, Spotify, and Apple Podcasts.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
    duration: '4 Weeks',
    level: 'Beginner → Intermediate',
    mode: 'Hybrid',
    price: 85000,
    formattedPrice: '₦85,000',
    upcomingCohort: 'April 20, 2026',
    schedule: 'Tuesdays & Thursdays (3:00 PM - 6:00 PM) + Studio recording session',
    tools: ['Blackmagic ATEM Mini Pro', 'Sony FX3 Multi-Cam Setup', 'Rodecaster Pro II Audio Console', 'OBS Studio / vMix', 'Riverside.fm / Descript'],
    prerequisites: 'No previous broadcasting experience required.',
    status: 'active',
    outcomes: [
      'Design and light a multi-host podcast studio with ambient RGB and warm key lighting',
      'Operate multi-camera video switchers for live cutting and instant recording',
      'Eliminate echo and balance voice levels across multiple guest microphones',
      'Cut viral short clips with dynamic subtitles from full podcast recordings'
    ],
    curriculum: [
      {
        week: 1,
        title: 'Studio Lighting & Set Design for Video Podcasts',
        topics: ['Background neon accents, key/fill balance for 2-3 hosts, set decor styling']
      },
      {
        week: 2,
        title: 'Multi-Camera Switching & ATEM Setup',
        topics: ['Connecting HDMI camera feeds, live switching logic, recording ISO tracks']
      },
      {
        week: 3,
        title: 'Multi-Host Microphone Engineering',
        topics: ['Managing microphone bleed, gating, compression, and live sound monitoring']
      },
      {
        week: 4,
        title: 'Repurposing, Viral Clip Cutting & Distribution',
        topics: ['Descript transcript editing, vertical clip cutting for TikTok/Reels, RSS feed syndication']
      }
    ],
    instructorName: 'Victor Adeleke',
    instructorRole: 'Podcast Producer & Broadcast Engineer',
    instructorAvatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80'
  }
];
