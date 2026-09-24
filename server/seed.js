import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already seeded
    }

    console.log('[Seed] Populating initial sample data for Event Management Platform...');

    // 1. Create Users
    const organizer = await User.create({
      name: 'Gowtham K (Organizer)',
      email: 'organizer@eventify.com',
      password: 'password123',
      role: 'organizer',
      bio: 'Lead Event Manager at KGiSL Skillrty & Tech Curator.',
    });

    const attendee = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'attendee',
      bio: 'Full stack developer & tech enthusiast.',
    });

    const attendee2 = await User.create({
      name: 'Sophia Patel',
      email: 'sophia@example.com',
      password: 'password123',
      role: 'attendee',
      bio: 'UI/UX Designer and AI researcher.',
    });

    // 2. Create Events
    const eventsData = [
      {
        title: 'Global AI & Next-Gen Full Stack Summit 2026',
        description: 'Explore the future of agentic AI, full-stack web architectures, MERN modernization, and scalable cloud deployments with industry leaders.',
        category: 'Tech & AI',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In 7 days
        time: '09:30 AM - 05:00 PM',
        location: 'Grand Convention Center, Hall A (Coimbatore & Live Stream)',
        isOnline: false,
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        capacity: 250,
        price: 0,
        organizer: organizer._id,
        registeredCount: 0,
        tags: ['AI', 'MERN', 'WebDev', 'React'],
      },
      {
        title: 'Hands-On React 19 & Next.js Masterclass Workshop',
        description: 'Deep dive into React Server Components, Suspense, state management patterns, Vite toolchains, and real-time backend integration.',
        category: 'Workshops',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: '02:00 PM - 06:00 PM',
        location: 'KGiSL Tech Campus, Lab 3',
        isOnline: false,
        bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
        capacity: 60,
        price: 49,
        organizer: organizer._id,
        registeredCount: 0,
        tags: ['Workshop', 'React', 'Frontend'],
      },
      {
        title: 'Cyberpunk Electro Music & Visual Arts Festival',
        description: 'An immersive night of synthwave, electronic beats, interactive laser installations, and live visuals by top digital artists.',
        category: 'Music & Festivals',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        time: '06:00 PM - 11:30 PM',
        location: 'Skyline Open Air Arena, Bay Road',
        isOnline: false,
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        capacity: 500,
        price: 25,
        organizer: organizer._id,
        registeredCount: 0,
        tags: ['Music', 'Festival', 'Art'],
      },
      {
        title: 'Tech Founders & Startup Pitch Showcase',
        description: 'Connect with top angel investors, VCs, and early-stage startup innovators pitching disruptive B2B SaaS and AI products.',
        category: 'Business & Networking',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 02:00 PM',
        location: 'Virtual Zoom Metaverse Hub',
        isOnline: true,
        bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
        capacity: 150,
        price: 0,
        organizer: organizer._id,
        registeredCount: 0,
        tags: ['Startup', 'Investors', 'Networking'],
      },
      {
        title: 'Creative UI/UX Design Sprint: Figma to Production',
        description: 'Learn modern design systems, micro-interactions, responsive accessibility, and how to bridge design with React code effortlessly.',
        category: 'Design & Art',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        time: '11:00 AM - 03:00 PM',
        location: 'Design Studio 4, Innovation Park',
        isOnline: false,
        bannerUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
        capacity: 80,
        price: 15,
        organizer: organizer._id,
        registeredCount: 0,
        tags: ['Figma', 'UIUX', 'Design'],
      }
    ];

    const createdEvents = await Event.insertMany(eventsData);

    // 3. Create Sample Registrations with required attendee fields
    await Registration.create({
      user: attendee._id,
      event: createdEvents[0]._id,
      ticketCode: 'EVT-SUMMIT-2026-X9A',
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      phone: '+91 98765 43210',
      organization: 'Coimbatore Institute of Technology',
      designation: 'Software Engineer',
      specialRequests: 'None',
      status: 'confirmed',
    });
    createdEvents[0].registeredCount = 1;
    await createdEvents[0].save();

    await Registration.create({
      user: attendee2._id,
      event: createdEvents[0]._id,
      ticketCode: 'EVT-SUMMIT-2026-K4B',
      attendeeName: attendee2.name,
      attendeeEmail: attendee2.email,
      phone: '+91 91234 56789',
      organization: 'KGiSL Skillrty',
      designation: 'UI/UX Designer',
      specialRequests: 'Vegetarian',
      status: 'confirmed',
    });
    createdEvents[0].registeredCount = 2;
    await createdEvents[0].save();

    await Registration.create({
      user: attendee._id,
      event: createdEvents[1]._id,
      ticketCode: 'EVT-REACT-2026-P2Z',
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      phone: '+91 98765 43210',
      organization: 'Coimbatore Institute of Technology',
      designation: 'Software Engineer',
      specialRequests: 'None',
      status: 'confirmed',
    });
    createdEvents[1].registeredCount = 1;
    await createdEvents[1].save();

    console.log('[Seed] Database successfully seeded with demo users, events and registrations!');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};
