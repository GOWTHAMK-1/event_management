import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
} from '../controllers/eventController.js';
import { protect, isOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, isOrganizer, createEvent);

router.get('/my/created', protect, isOrganizer, getOrganizerEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, isOrganizer, updateEvent)
  .delete(protect, isOrganizer, deleteEvent);

export default router;
