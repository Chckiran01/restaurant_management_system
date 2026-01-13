const express = require('express');
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  getReservationsByDate,
  adminCancelReservation,
  getAvailabilityByDate,
  getAvailableTables,
    adminUpdateReservation
} = require('../controllers/reservationController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

/*
 USER ROUTES
*/

// Create reservation
router.post('/', protect, createReservation);

// Get logged-in user's reservations
router.get('/my', protect, getMyReservations);

// Cancel logged-in user's reservation
router.put('/:id/cancel', protect, cancelMyReservation);

/*
 ADMIN ROUTES
*/

// Get all reservations
router.get('/', protect, adminOnly, getAllReservations);

// Get reservations by date
router.get('/date/:date', protect, adminOnly, getReservationsByDate);

// Admin cancel any reservation
router.put('/:id/admin-cancel', protect, adminOnly, adminCancelReservation);

router.get('/availability', protect, getAvailabilityByDate);

router.get('/available-tables', protect, getAvailableTables);

router.put("/:id/admin-update", protect, adminOnly, adminUpdateReservation);

module.exports = router;
