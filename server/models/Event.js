import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Tech & AI', 'Workshops', 'Music & Festivals', 'Business & Networking', 'Design & Art', 'Sports & Fitness', 'Other'],
      default: 'Tech & AI',
    },
    date: {
      type: Date,
      required: [true, 'Please specify the event date'],
    },
    time: {
      type: String,
      required: [true, 'Please specify the event time (e.g. 10:00 AM - 4:00 PM)'],
    },
    location: {
      type: String,
      required: [true, 'Please specify a venue / location or Online link'],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify maximum capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    price: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    tags: [String],
    registeredCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for remaining seats
eventSchema.virtual('remainingSeats').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
