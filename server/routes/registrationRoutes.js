import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventAttendees,
} from '../controllers/registrationController.js';
import { protect, isOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:eventId', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.delete('/:id', protect, cancelRegistration);
router.get('/event/:eventId/attendees', protect, isOrganizer, getEventAttendees);

export default router;
