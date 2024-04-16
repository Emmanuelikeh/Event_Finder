const dbConnection = require('../config/dbConnection');
class Bookings {
    static async createBooking(EventID, AttendeeID, TicketID, BookingDateTime, PaymentStatus) {
        const query = `INSERT INTO bookings (eventid, attendeeid, ticketid, bookingdatetime, paymentstatus) VALUES (?, ?, ?, ?, ?)`;
        try {
            await dbConnection.query(query, [EventID, AttendeeID, TicketID, BookingDateTime, PaymentStatus]);
            return "Booking created successfully";
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    // delete booking
    static async deleteBooking(BookingID) {
        console.log("Deleting booking")
        const query = `DELETE FROM bookings WHERE bookingid = ${BookingID}`;
        try {
            const response = await dbConnection.query(query);
            return response;

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    // get all attendees for an event 
    static async getAttendees(EventID) {
        console.log("Getting attendees")
        const query = `
        SELECT b.BookingID, b.AttendeeID, b.TicketID, u.Username, u.Email, t.TicketType
        FROM Bookings b
        JOIN Users u ON b.AttendeeID = u.UserID
        JOIN Tickets t ON b.TicketID = t.TicketID
        WHERE b.EventID = ${EventID}
      `;
        try {
            const response = await dbConnection.query(query);
            console.log("Attendees are", response[0]);
            return response[0];
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    // get date and  count of attendees for an event
    static async getAttendeesCount(EventID) {
        console.log("Getting attendees count")
        const query = `SELECT DATE(b.BookingDateTime) AS date, COUNT(*) AS count
        FROM Bookings b
        WHERE b.EventID = ${EventID}
        GROUP BY DATE(b.BookingDateTime)
        ORDER BY date`
        try {
            const response = await dbConnection.query(query);
            console.log(response[0]);
            return response[0];
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

      // get the count of bookings for at most three events for an organizer, should return the event name and the count of bookings
        static async getBookingCountForOrganizer(UserID) {
            console.log("Getting booking count for organizer")
            const query = `SELECT e.EventName, COUNT(*) AS count
            FROM Bookings b
            JOIN Events e ON b.EventID = e.EventID
            WHERE e.OrganizerID = ${UserID}
            GROUP BY e.EventName
            ORDER BY count DESC
            LIMIT 3`
            try {
                const response = await dbConnection.query(query);
                console.log(response[0]);
                return response[0];
            } catch (error) {
                console.log(error)
                throw error;
            }
        }

    // get total number of booking for an event 
    static async getBookingCount(EventID) {
        console.log("Getting booking count")
        const query = `SELECT COUNT(*) AS count FROM Bookings WHERE EventID = ${EventID}`;
        try {
            const response = await dbConnection.query(query);
            console.log(response[0]);
            return response[0];
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    // get the count of bookings for at most three events for an organizer, should return the event name and the count of bookings
    static async getThreeEventsBookings(OrganizerID) {
        console.log("Getting booking count for organizer")
        const query = `SELECT e.EventName, COUNT(*) AS count
        FROM Bookings b
        JOIN Events e ON b.EventID = e.EventID
        WHERE e.OrganizerID = ${OrganizerID}
        GROUP BY e.EventName
        ORDER BY count DESC
        LIMIT 3`
        try {
            const response = await dbConnection.query(query);
            console.log(response[0]);
            return response[0];
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

}

module.exports = Bookings;