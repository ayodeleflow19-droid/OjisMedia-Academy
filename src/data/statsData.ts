import { Instructor, FaqItem, StatItem } from '../types';

export const STATS_DATA: StatItem[] = [
  {
    value: '500+',
    numericValue: 500,
    suffix: '+',
    label: 'Students Trained',
    description: 'Empowered creatives now working across top agencies, studios & freelancing.'
  },
  {
    value: '10+',
    numericValue: 10,
    suffix: '+',
    label: 'Professional Courses',
    description: 'Structured, industry-aligned curricula designed for modern digital media.'
  },
  {
    value: '95%',
    numericValue: 95,
    suffix: '%',
    label: 'Student Satisfaction',
    description: 'Consistently rated 5 stars for practical clarity and instructor mentorship.'
  },
  {
    value: '5+',
    numericValue: 5,
    suffix: '+',
    label: 'Years of Experience',
    description: 'Dedicated to cultivating top-tier media talent across Nigeria & beyond.'
  }
];

export const INSTRUCTORS_DATA: Instructor[] = [
  {
    id: 'tunde-adebayo',
    name: 'Tunde Adebayo',
    role: 'Lead Cinematographer & Director',
    specialty: 'Cinema Optics, Lighting & Commercial Direction',
    bio: 'Award-winning cinematographer with over a decade of directing commercials, documentaries, and narrative films for broadcast and streaming platforms.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    coursesTaught: ['Video Production & Cinematography', 'Drone Cinematography'],
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
    specialty: 'Studio Lighting, Portraiture & Retouching',
    bio: 'Lead fashion photographer whose editorial work has been featured in top lifestyle publications, brand lookbooks, and gallery exhibitions across Africa.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    coursesTaught: ['Professional Photography & Studio Lighting'],
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'emeka-nwosu',
    name: 'Emeka Nwosu',
    role: 'Senior Post-Production Supervisor',
    specialty: 'Narrative Editing, Color Grading & Sound Design',
    bio: 'Veteran editor with 8+ years cutting high-stakes music videos, commercial ads, and feature films in DaVinci Resolve and Adobe Premiere Pro.',
    image: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=600&q=80',
    coursesTaught: ['Professional Video Editing & Post-Production'],
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'fatima-bello',
    name: 'Fatima Bello',
    role: 'Brand Designer & Creative Director',
    specialty: 'Brand Identity Systems, Typography & Print Design',
    bio: 'Former agency design lead who has crafted brand visual systems for over 40 tech startups, FMCG brands, and cultural institutions.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    coursesTaught: ['Graphic Design & Brand Identity Systems'],
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'kelechi-davies',
    name: 'Kelechi Davies',
    role: 'Digital Creator & Growth Strategist',
    specialty: 'Viral Short-Form Scripting, Mobile Media & Monetization',
    bio: 'Prolific digital storyteller with a combined online audience of 500,000+ creators, helping brands and individuals turn mobile videos into sustainable income.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=600&q=80',
    coursesTaught: ['Social Media Content Creation & Digital Growth'],
    socialLinks: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'david-oladipo',
    name: 'David Oladipo',
    role: 'Motion Designer & VFX Artist',
    specialty: 'After Effects, Kinetic Type & 2.5D Animation',
    bio: 'Specialist motion designer animating broadcast identities, fintech product demos, and music video visual effects across international agencies.',
    image: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=600&q=80',
    coursesTaught: ['Motion Graphics & Visual Effects'],
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  }
];

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Admissions',
    question: 'Who can enroll in OJISMediaAcademy?',
    answer: 'Anyone interested in developing practical media and creative skills! Our programs welcome absolute beginners, secondary school graduates, university students, working professionals seeking a career transition, entrepreneurs, content creators, and freelancers looking to upgrade their skills.'
  },
  {
    id: 'faq-2',
    category: 'Admissions',
    question: 'Do I need previous experience before registering?',
    answer: 'No prior experience is necessary for our beginner-to-intermediate courses. We start from the core fundamentals and progressively guide you through advanced, hands-on production techniques with dedicated instructor mentorship.'
  },
  {
    id: 'faq-3',
    category: 'Courses & Gear',
    question: 'Are the courses online or physical?',
    answer: 'We offer Physical, Hybrid, and Online learning modes depending on the course. Practical-intensive programs like Video Production and Studio Photography are held in our physical studios with live gear. Courses like Graphic Design, Video Editing, and Content Creation offer flexible Hybrid and Online cohorts.'
  },
  {
    id: 'faq-4',
    category: 'Courses & Gear',
    question: 'What equipment do I need to bring?',
    answer: 'For physical courses, you have full access to the Academy’s cameras, cinema rigs, studio lighting, audio kits, and studio workstations during class practicals. For editing and design courses, having a personal laptop is recommended for home practice, though academy lab editing suites are available during study hours.'
  },
  {
    id: 'faq-5',
    category: 'Admissions',
    question: 'How long are the courses?',
    answer: 'Our intensive programs range from 3 weeks (specialized masterclasses like Drone Cinematography) to 4-8 weeks for comprehensive diploma certifications (Video Production, Motion Graphics, Editing, and Graphic Design).'
  },
  {
    id: 'faq-6',
    category: 'Payment & Schedules',
    question: 'Are installment payment plans available?',
    answer: 'Yes! We support flexible 2-part installment payment options for our 6-week and 8-week programs to make enrollment seamless and accessible for passionate students.'
  },
  {
    id: 'faq-7',
    category: 'Careers & Certificate',
    question: 'What happens after I complete my registration form?',
    answer: 'Once you submit your enrollment form on this platform, you will receive an instant Enrollment Reference Code. Our admissions team will review your application and contact you within 24 hours via WhatsApp and email with your confirmation package, schedule details, and studio orientation guide.'
  },
  {
    id: 'faq-8',
    category: 'Careers & Certificate',
    question: 'Do I receive a certificate and portfolio support?',
    answer: 'Yes. All graduating students who complete their required course projects receive an official OJISMediaAcademy Certificate of Completion, a polished graduation showreel/portfolio piece, and access to our alumni creative community and job board.'
  },
  {
    id: 'faq-9',
    category: 'Admissions',
    question: 'Can I visit the studio or contact an advisor before enrolling?',
    answer: 'Absolutely! You are welcome to visit our studio during working hours (Monday to Saturday, 9:00 AM - 5:00 PM) to inspect our gear and meet instructors, or chat instantly with our Admissions Officer via WhatsApp at +234 812 345 6789.'
  }
];
