const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Create reservation
const createReservation = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.body;

    const tables = await Table.find({ capacity:guests  }); 

    if (tables.length === 0) {
      return res.status(400).json({ message: 'No table available for this guest count' });
    }

    let availableTable = null;

    for (let table of tables) {
      const existingReservation = await Reservation.findOne({
        table: table._id,
        date,
        timeSlot,
        status: 'active'
      });

      if (!existingReservation) {
        availableTable = table;
        break;
      }
    }

    if (!availableTable) {
      return res.status(400).json({ message: 'No available table for selected date and time' });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table: availableTable._id,
      date,
      timeSlot,
      guests
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's reservations
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User cancel reservation
const cancelMyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin get reservations by date
const getReservationsByDate = async (req, res) => {
  try {
    const reservations = await Reservation.find({ date: req.params.date })
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
       .sort({ createdAt: -1 }); 
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin cancel reservation
const adminCancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Availability by date
const getAvailabilityByDate = async (req, res) => {
  const { date, guests } = req.query;

  if (!date || !guests) {
    return res.status(400).json({ message: 'Date and guests are required' });
  }

  const TIME_SLOTS = [
    '12:00-14:00',
    '14:00-16:00',
    '18:00-20:00',
    '20:00-22:00',
  ];

  const availability = {};

  for (const slot of TIME_SLOTS) {
    // Tables already booked for this slot
    const bookedReservations = await Reservation.find({
      date,
      timeSlot: slot,
      status: 'active',
    }).select('table');

    const bookedTableIds = bookedReservations.map(r => r.table);

    // STRICT: only tables with exact capacity
    const freeTables = await Table.find({
      capacity: Number(guests),
      _id: { $nin: bookedTableIds },
    });

    availability[slot] = {
      totalAvailable: freeTables.length,
      fullyBooked: freeTables.length === 0,
      breakdown: {
        [guests]: freeTables.length
      }
    };
  }

  res.json(availability);
};

const getAvailableTables = async (req, res) => {
  const { date, timeSlot } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: 'Date and timeSlot required' });
  }

  // Tables already booked
  const bookedReservations = await Reservation.find({
    date,
    timeSlot,
    status: 'active',
  }).select('table');

  const bookedTableIds = bookedReservations.map(r => r.table);

  // Available tables
  const availableTables = await Table.find({
    _id: { $nin: bookedTableIds }
  }).sort({ capacity: 1 });

  res.json(availableTables);
};

// @desc   Admin - update any reservation
// @route  PUT /api/reservations/:id/admin-update
// @access Admin
const adminUpdateReservation = async (req, res) => {
  const { date, timeSlot, tableId } = req.body;

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  // Check if table is already booked for that slot
  const conflict = await Reservation.findOne({
    _id: { $ne: reservation._id },
    table: tableId,
    date,
    timeSlot,
    status: "active",
  });

  if (conflict) {
    return res.status(400).json({
      message: "Selected table is already booked for this slot",
    });
  }

  reservation.date = date;
  reservation.timeSlot = timeSlot;
  reservation.table = tableId;

  await reservation.save();

  res.json({ message: "Reservation updated successfully" });
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  getReservationsByDate,
  adminCancelReservation,
  getAvailabilityByDate,
  getAvailableTables,
    adminUpdateReservation
};
