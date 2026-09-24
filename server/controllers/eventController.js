import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get all events with search, category filtering & sort
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { keyword, category, status } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email avatar')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email avatar bio'
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      isOnline,
      bannerUrl,
      capacity,
      price,
      tags,
    } = req.body;

    if (!title || !description || !date || !time || !location || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, date, time, location, capacity',
      });
    }

    const event = await Event.create({
      title,
      description,
      category: category || 'Tech & AI',
      date,
      time,
      location,
      isOnline: Boolean(isOnline),
      bannerUrl: bannerUrl || undefined,
      capacity: Number(capacity),
      price: Number(price) || 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      organizer: req.user._id,
    });

    const populatedEvent = await Event.findById(event._id).populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin owner)
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check ownership
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email');

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin owner)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check ownership
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Delete registrations associated with this event
    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and related registrations removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer's created events
// @route   GET /api/events/my/created
// @access  Private (Organizer)
export const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
