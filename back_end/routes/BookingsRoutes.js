const router = require('express').Router();
const auth = require('../middleware/UserAuth');
const Booking = require('../models/Bookings');
const Ticket = require('../models/Ticket');


router.post('/createBooking', auth, async (req, res) => {
    const { EventID, AttendeeID, TicketID, BookingDateTime, PaymentStatus } = req.body; 
    try {
        // check if the ticket is available
        const isTicketAvailable = await Ticket.isTicketAvailable(TicketID);
        if (!isTicketAvailable) {
            return res.status(400).json({ message: 'Ticket is not available' });
        }
        const booking = await Booking.createBooking(EventID, AttendeeID, TicketID, BookingDateTime, PaymentStatus);
        // update ticket quantity
        const ticket = await Ticket.reduceAvailableQuantity(TicketID);
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

 // get date and  count of attendees for an event
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

 // get the count of bookings for at most three events for an organizer, should return the event name and the count of bookings
 router.get('/getThreeEventsBookings/:organizerID', auth, async (req, res) => {
    const OrganizerID = req.params.organizerID;
    try {
        const bookings = await Booking.getThreeEventsBookings(OrganizerID);
        console.log("Bookings are", bookings);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error });
    }
}
)

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