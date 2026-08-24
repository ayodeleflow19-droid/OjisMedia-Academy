import { Course, Instructor, UserAccount } from '../types';
import { INSTRUCTORS_DATA } from './statsData';
import { getRegisteredUsers } from './authDemoData';

export interface InstructorFullProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  specialty: string;
  bio: string;
  detailedBio?: string;
  image: string;
  yearsOfExperience: number | string;
  rating?: number;
  credentials: string[];
  pastClients?: string[];
  coursesTaught: string[];
  officeHours?: string;
  portfolioUrl?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}

export const DETAILED_INSTRUCTORS_CATALOG: InstructorFullProfile[] = [
  {
    id: 'tunde-adebayo',
    name: 'Tunde Adebayo',
    role: 'Lead Cinematographer & Director',
    department: 'Filmmaking & Cinematography',
    specialty: 'Cinema Optics, Lighting & Commercial Direction',
    bio: 'Award-winning cinematographer with over a decade of directing commercials, documentaries, and narrative films for broadcast and streaming platforms.',
    detailedBio: 'Tunde has helmed over 60 commercial campaigns and narrative projects across West Africa and Europe. A veteran practitioner of large-format cinema camera systems (ARRI Alexa, Sony FX series, RED V-Raptor), he specializes in high-contrast cinematic lighting and visual tone-setting for high-stakes productions.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 11,
    rating: 4.95,
    credentials: [
      'B.A. Film & Media Production',
      'ARRI Certified Camera Systems Specialist',
      'Sony CineAlta Masterclass Fellow',
      'Nigeria Guild of Cinematographers (NGC)'
    ],
    pastClients: ['Netflix Africa', 'Showmax', 'Multichoice', 'Coca-Cola West Africa'],
    coursesTaught: ['Video Production & Cinematography', 'Drone Cinematography', 'Professional Filmmaking & Cinematography'],
    officeHours: 'Tuesdays & Thursdays, 10:00 AM - 1:00 PM',
    portfolioUrl: 'https://vimeo.com',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'zainab-okonjo',
    name: 'Zainab Okonjo',
    role: 'Editorial & Fashion Photographer',
    department: 'Commercial Photography',
    specialty: 'Studio Lighting, Portraiture & High-End Retouching',
    bio: 'Lead fashion photographer whose editorial work has been featured in top lifestyle publications, brand lookbooks, and gallery exhibitions across Africa.',
    detailedBio: 'Zainab is an internationally recognized editorial and portrait photographer with an eye for dramatic light sculpting. Over her 8-year career, she has curated cover stories for major lifestyle magazines and mentored over 250 emerging photographers in studio lighting physics and Photoshop frequency separation.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 8,
    rating: 4.92,
    credentials: [
      'Profoto Certified Studio Lighting Trainer',
      'Adobe Certified Professional (Lightroom & Photoshop)',
      'Member, International Association of Editorial Photographers',
      'Lagos Photo Festival Emerging Talent Awardee'
    ],
    pastClients: ['Vogue Africa Features', 'BellaNaija Style', 'Guaranty Trust Media', 'Standard Bank'],
    coursesTaught: ['Professional Photography & Studio Lighting', 'Documentary, Event & Street Photography'],
    officeHours: 'Wednesdays & Fridays, 1:00 PM - 4:00 PM',
    portfolioUrl: 'https://behance.net',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'emeka-nwosu',
    name: 'Emeka Nwosu',
    role: 'Senior Post-Production Supervisor & Colorist',
    department: 'Post-Production & Editorial',
    specialty: 'Narrative Editing, Color Grading & Sound Design',
    bio: 'Veteran editor with 8+ years cutting high-stakes music videos, commercial ads, and feature films in DaVinci Resolve and Adobe Premiere Pro.',
    detailedBio: 'Emeka is a Blackmagic Design Certified Colorist and offline/online editor who has finalized over 140 commercial music videos, documentary features, and episodic series. He brings deep technical mastery of ACES workflows, color gamut management, and high-retention pacing.',
    image: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 9,
    rating: 4.96,
    credentials: [
      'Blackmagic Design Certified DaVinci Resolve Instructor',
      'Adobe Certified Expert: Premiere Pro Master',
      'Avid Certified Media Composer Professional',
      'Post-Production Guild of West Africa'
    ],
    pastClients: ['Universal Music Nigeria', 'Mavin Records', 'Amazon Prime Video EMEA', 'Heineken'],
    coursesTaught: ['Professional Video Editing & Post-Production', 'DaVinci Resolve Color Grading & Finishing'],
    officeHours: 'Mondays & Wednesdays, 3:00 PM - 6:00 PM',
    portfolioUrl: 'https://frame.io',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'fatima-bello',
    name: 'Fatima Bello',
    role: 'Creative Director & Visual Storyteller',
    department: 'Digital Media & Strategy',
    specialty: 'Visual Storytelling, Color Harmony & Art Direction',
    bio: 'Former agency creative lead who has directed brand visual campaigns for over 40 top media productions, startups, and cultural institutions.',
    detailedBio: 'Fatima combines visual design principles with brand psychology. She has led visual identities for fast-scaling tech companies and media studios, helping students translate abstract client briefs into stunning multi-platform creative campaigns.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 7,
    rating: 4.89,
    credentials: [
      'M.Sc. Visual Communications & Brand Design',
      'Former Creative Lead, Ogilvy & Dentsu Affiliates',
      'Cannes Lions Young Creatives Mentor'
    ],
    pastClients: ['Flutterwave', 'Paystack', 'Sterling One Foundation', 'Afrinolly'],
    coursesTaught: ['Social Media Content Creation & Digital Growth'],
    officeHours: 'Tuesdays, 2:00 PM - 5:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'kelechi-davies',
    name: 'Kelechi Davies',
    role: 'Digital Creator & Growth Strategist',
    department: 'Creator Economy & Mobile Media',
    specialty: 'Viral Short-Form Scripting, Mobile Media & Monetization',
    bio: 'Prolific digital storyteller with a combined online audience of 500,000+ creators, helping brands and individuals turn mobile videos into sustainable income.',
    detailedBio: 'Kelechi is a pioneer in creator monetization and algorithm psychology. With over 75 million cumulative video views across TikTok, YouTube, and Instagram, his curriculum breaks down the mathematical and storytelling formulas behind repeatable viral attention.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 6,
    rating: 4.93,
    credentials: [
      'Meta Certified Community & Digital Creator Mentor',
      'YouTube Creator Academy Gold Graduate',
      'Advisor to 50+ Top Tier Creator Brands'
    ],
    pastClients: ['Red Bull Nigeria', 'Spotify Africa', 'Bolt', 'Chipper Cash'],
    coursesTaught: ['Social Media Content Creation & Digital Growth'],
    officeHours: 'Thursdays & Saturdays, 4:00 PM - 7:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'david-oladipo',
    name: 'David Oladipo',
    role: 'Lead Motion Designer & VFX Artist',
    department: 'Motion Design & Visual Effects',
    specialty: 'After Effects, Kinetic Type, 3D Tracking & Compositing',
    bio: 'Specialist motion designer animating broadcast identities, fintech product demos, and music video visual effects across international agencies.',
    detailedBio: 'David specializes in procedural motion design, kinetic type design, and 3D camera compositing. He has animated on-air broadcast packages for television networks and high-fidelity 3D UI explainers for global SaaS brands.',
    image: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 8,
    rating: 4.94,
    credentials: [
      'Maxon Certified Cinema 4D Associate',
      'Adobe Certified After Effects Master Instructor',
      'PromaxBDA Broadcast Design Award Nominee'
    ],
    pastClients: ['Arise News TV', 'OPay', 'Kuda Bank', 'Trace Urban'],
    coursesTaught: ['Motion Graphics & Visual Effects (After Effects)', 'Motion Graphics & 3D Animation'],
    officeHours: 'Wednesdays & Fridays, 2:00 PM - 5:00 PM',
    portfolioUrl: 'https://artstation.com',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'victor-adeleke',
    name: 'Victor Adeleke',
    role: 'Lead Audio Engineer & Podcast Producer',
    department: 'Audio Engineering & Broadcasting',
    specialty: 'Acoustic Calibration, Voice Mixing & Studio Broadcasting',
    bio: 'Veteran sound designer and broadcast engineer with over 10 years of experience producing chart-topping podcasts and cinema soundtracks.',
    detailedBio: 'Victor has engineered live broadcasts and audio mastering for over 30 leading African podcasts, television commercials, and studio albums. An expert in iZotope RX restoration and multi-host studio recording rigs, he trains students on how to achieve broadcast-grade clarity.',
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 10,
    rating: 4.91,
    credentials: [
      'Audio Engineering Society (AES) Full Member',
      'Pro Tools Certified Operator',
      'iZotope RX Spectral Audio Master',
      'Rode Broadcast Specialist'
    ],
    pastClients: ['BBC Africa Radio', 'Beat FM', 'Cool FM', 'The Native Podcast'],
    coursesTaught: ['Sound Design & Podcast Audio Production', 'Podcast Studio Setup & Live Broadcasting'],
    officeHours: 'Mondays & Thursdays, 1:00 PM - 4:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'adekunle-alabi',
    name: 'Adekunle Alabi',
    role: 'Principal Cinematography Instructor',
    department: 'Filmmaking & Cinematography',
    specialty: 'Sony Cinema Line, ARRI Alexa & Gaffer Operations',
    bio: 'Director of Photography and Cinematography Master. Specialist in anamorphic lenses and dramatic low-key lighting setups.',
    detailedBio: 'Adekunle has served as lead cinematographer on 12 feature films and numerous television commercials across Africa. His hands-on teaching style emphasizes physical camera movement and lighting ratio precision.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 9,
    rating: 4.9,
    credentials: [
      'Master of Fine Arts (MFA) in Cinematography',
      'ARRI Academy Lighting Certified',
      'Steadicam & Gimbal Operator Guild Member'
    ],
    pastClients: ['FilmOne Entertainment', 'EbonyLife Media', 'DSTV Africa Magic'],
    coursesTaught: ['Professional Filmmaking & Cinematography', 'Video Production & Cinematography'],
    officeHours: 'Mon & Wed, 10:00 AM - 1:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'folake-davies',
    name: 'Folake Davies',
    role: 'Lead Commercial Photography Mentor',
    department: 'Commercial Photography',
    specialty: 'High-End Retouching, Strobe Lighting & Studio Directing',
    bio: 'Commercial Portrait & Editorial Fashion Photographer. Profoto lighting ambassador with global brand campaigns.',
    detailedBio: 'Folake brings 8 years of international studio photography and beauty advertising experience. She focuses on precision light shaping, tethered studio workflows, and editorial composition.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 8,
    rating: 4.88,
    credentials: [
      'Profoto Certified Lighting Master',
      'Capture One Certified Professional',
      'Lagos Fashion Week Official Photographer'
    ],
    pastClients: ['Orange Culture', 'Mac Cosmetics Africa', 'Zenith Bank'],
    coursesTaught: ['Commercial & Studio Photography', 'Professional Photography & Studio Lighting'],
    officeHours: 'Fridays, 1:00 PM - 4:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'segun-oladipo',
    name: 'Segun Oladipo',
    role: 'Senior Motion Design Specialist',
    department: 'Motion Graphics & 3D VFX',
    specialty: 'Blender 3D, After Effects & Virtual Production',
    bio: '3D VFX & Motion Graphics Director. After Effects, Blender & Unreal Engine virtual production artist.',
    detailedBio: 'Segun leads virtual set design and motion graphics for international agencies and broadcast television. He teaches students how to combine 3D hard-surface modeling with real-time rendering in Blender and Unreal Engine.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    yearsOfExperience: 7,
    rating: 4.92,
    credentials: [
      'Blender Foundation Certified Educator',
      'Unreal Engine Virtual Production Fellow',
      'Adobe After Effects Certified Professional'
    ],
    pastClients: ['Stanbic IBTC', 'Interswitch', 'SuperSport Africa'],
    coursesTaught: ['Motion Graphics & 3D Animation', 'Motion Graphics & Visual Effects (After Effects)'],
    officeHours: 'Wed & Fri, 3:00 PM - 6:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  }
];

/**
 * Normalizes text for matching
 */
function normalize(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Fetches the lead instructor profile for a specific course.
 * Inspects course instructor name, course category/slug, registered faculty accounts, and detailed catalog.
 */
export async function fetchCourseInstructor(course: Course): Promise<InstructorFullProfile> {
  // Simulate rapid non-blocking async fetch for clean data hydration
  return new Promise((resolve) => {
    // 1. Direct name match in detailed catalog
    if (course.instructorName) {
      const matchByName = DETAILED_INSTRUCTORS_CATALOG.find(inst => 
        normalize(inst.name) === normalize(course.instructorName) ||
        normalize(inst.name).includes(normalize(course.instructorName)) ||
        normalize(course.instructorName).includes(normalize(inst.name))
      );
      if (matchByName) {
        return resolve({
          ...matchByName,
          role: course.instructorRole || matchByName.role,
          image: course.instructorAvatar || matchByName.image
        });
      }
    }

    // 2. Check stored system users (Faculty/Instructors)
    try {
      const storedUsers = getRegisteredUsers();
      const matchedUser = storedUsers.find(u => 
        u.role === 'instructor' && (
          (course.instructorName && normalize(u.name) === normalize(course.instructorName)) ||
          (u.instructorDetails?.department && normalize(u.instructorDetails.department).includes(normalize(course.category)))
        )
      );

      if (matchedUser) {
        const profile: InstructorFullProfile = {
          id: matchedUser.id,
          name: matchedUser.name,
          role: matchedUser.instructorDetails?.title || course.instructorRole || 'Lead Course Instructor',
          department: matchedUser.instructorDetails?.department || `${course.category.toUpperCase()} Department`,
          specialty: matchedUser.instructorDetails?.specialization || 'Professional Media Production',
          bio: matchedUser.bio || `${matchedUser.name} is a senior faculty instructor at OJISMediaAcademy.`,
          detailedBio: matchedUser.bio,
          image: matchedUser.avatar || course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          yearsOfExperience: matchedUser.instructorDetails?.yearsOfExperience || 7,
          rating: matchedUser.instructorDetails?.rating || 4.9,
          credentials: [
            'OJIS Media Academy Certified Master Faculty',
            'Senior Industry Practitioner',
            `${matchedUser.instructorDetails?.yearsOfExperience || 7}+ Years Professional Production Experience`
          ],
          coursesTaught: [course.title],
          officeHours: matchedUser.instructorDetails?.officeHours || 'By appointment',
          portfolioUrl: matchedUser.instructorDetails?.portfolioUrl
        };
        return resolve(profile);
      }
    } catch (e) {
      // Continue to fallback
    }

    // 3. Match by Course Title / Category in detailed catalog
    const matchByCourse = DETAILED_INSTRUCTORS_CATALOG.find(inst => 
      inst.coursesTaught.some(c => 
        normalize(c) === normalize(course.title) || 
        normalize(course.title).includes(normalize(c)) ||
        normalize(c).includes(normalize(course.id))
      )
    );
    if (matchByCourse) {
      return resolve(matchByCourse);
    }

    // 4. Match by Category keywords
    const categoryMatch = DETAILED_INSTRUCTORS_CATALOG.find(inst => {
      const cat = normalize(course.category);
      if (cat.includes('film') || cat.includes('video')) return normalize(inst.department).includes('film');
      if (cat.includes('photo')) return normalize(inst.department).includes('photo');
      if (cat.includes('edit')) return normalize(inst.department).includes('post') || normalize(inst.department).includes('edit');
      if (cat.includes('motion')) return normalize(inst.department).includes('motion');
      if (cat.includes('audio') || cat.includes('sound')) return normalize(inst.department).includes('audio');
      if (cat.includes('content')) return normalize(inst.department).includes('creator') || normalize(inst.department).includes('digital');
      return false;
    });

    if (categoryMatch) {
      return resolve({
        ...categoryMatch,
        name: course.instructorName || categoryMatch.name,
        role: course.instructorRole || categoryMatch.role,
        image: course.instructorAvatar || categoryMatch.image
      });
    }

    // 5. Fallback profile generated from course attributes
    const fallbackProfile: InstructorFullProfile = {
      id: `inst-${course.id}`,
      name: course.instructorName || 'Lead Academy Faculty Member',
      role: course.instructorRole || 'Senior Industry Practitioner & Mentor',
      department: `${course.category.charAt(0).toUpperCase() + course.category.slice(1)} Department`,
      specialty: `Specialist in ${course.title} & Studio Mentorship`,
      bio: `Experienced media director and senior educator guiding practical hands-on studio sessions in ${course.title}.`,
      detailedBio: `Active industry practitioner with verified commercial experience leading student cohorts through real-world studio projects and portfolio creation.`,
      image: course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      yearsOfExperience: '7+',
      rating: 4.9,
      credentials: [
        'OJIS Media Academy Certified Faculty',
        'Industry Studio Director & Practitioner',
        'Direct Student Mentorship & Critique Lead'
      ],
      pastClients: ['Top Broadcast & Digital Agencies'],
      coursesTaught: [course.title],
      officeHours: 'Available during scheduled studio lab hours'
    };

    resolve(fallbackProfile);
  });
}
