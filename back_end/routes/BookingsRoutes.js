const router = require('express').Router();
const auth = require('../middleware/UserAuth');
const Booking = require('../models/Bookings');


router.post('/createBooking', auth, async (req, res) => {
    const { EventID, AttendeeID, TicketID, BookingDateTime, PaymentStatus } = req.body; 
    try {
        const booking = await Booking.createBooking(EventID, AttendeeID, TicketID, BookingDateTime, PaymentStatus);
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error }); 
    }
})

router.delete('/deleteBooking/:BookingID', auth, async (req, res) => {
    const BookingID = req.params.BookingID;
    console.log("Booking ID is", BookingID);
    try {
        const booking = await Booking.deleteBooking(BookingID);
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.get('/getAttendees/:EventID', auth, async (req, res) => {
    const EventID = req.params.EventID;
    try {
        const attendees = await Booking.getAttendees(EventID);
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ error });
    }
})


router.get('/getAttendeesCount/:EventID', auth, async (req, res) => {
    const EventID = req.params.EventID;
    try {
        console.log("Event ID is, Helloo: ", EventID);
        const attendeesCount = await Booking.getAttendeesCount(EventID);
        res.json(attendeesCount);
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.get('/getBookingsCount/:EventID', auth, async (req, res) => {
    const EventID = req.params.EventID;
    try {
        const bookings = await Booking.getBookingCount(EventID);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error });
    }
})

module.exports = router;