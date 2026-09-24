import crypto from 'crypto';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc    Register for an event with comprehensive attendee info
// @route   POST /api/registrations/:eventId
// @access  Private
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const {
      attendeeName,
      attendeeEmail,
      phone,
      organization,
      designation,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!attendeeName || !attendeeEmail || !phone || !organization) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields: Name, Email, Phone Number, and College/Company.',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This event has been cancelled.' });
    }

    // Check if event is full
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is fully booked! No tickets remaining.' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'confirmed') {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event! View your pass in the Dashboard.',
        });
      } else {
        // Reactivate registration with updated info
        existingRegistration.status = 'confirmed';
        existingRegistration.attendeeName = attendeeName;
        existingRegistration.attendeeEmail = attendeeEmail;
        existingRegistration.phone = phone;
        existingRegistration.organization = organization;
        existingRegistration.designation = designation || 'Attendee';
        existingRegistration.specialRequests = specialRequests || 'None';
        await existingRegistration.save();

        event.registeredCount += 1;
        await event.save();

        return res.status(200).json({
          success: true,
          message: 'Registration reactivated successfully!',
          data: existingRegistration,
        });
      }
    }

    // Generate unique Ticket ID
    const ticketCode = `EVT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const registration = await Registration.create({
      user: userId,
      event: eventId,
      ticketCode,
      attendeeName,
      attendeeEmail,
      phone,
      organization,
      designation: designation || 'Student / Professional',
      specialRequests: specialRequests || 'None',
      status: 'confirmed',
    });

    // Increment event registeredCount
    event.registeredCount += 1;
    await event.save();

    const populatedReg = await Registration.findById(registration._id).populate('event');

    res.status(201).json({
      success: true,
      message: 'Registration confirmed! Your official event pass has been issued.',
      data: populatedReg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registered events
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
      status: 'confirmed',
    })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' },
      })
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this registration' });
    }

    if (registration.status === 'confirmed') {
      registration.status = 'cancelled';
      await registration.save();

      // Decrement event registered count
      await Event.findByIdAndUpdate(registration.event, {
        $inc: { registeredCount: -1 },
      });
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendees for an event with comprehensive attendee details
// @route   GET /api/registrations/event/:eventId/attendees
// @access  Private (Organizer)
export const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view attendee list' });
    }

    const attendees = await Registration.find({
      event: req.params.eventId,
      status: 'confirmed',
    })
      .populate('user', 'name email avatar')
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      count: attendees.length,
      data: attendees,
    });
  } catch (error) {
    next(error);
  }
};
