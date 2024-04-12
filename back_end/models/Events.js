const dbConnection = require('../config/dbConnection');


class Events {
    static async getAllEvents() {
        const query = `
          SELECT
            e.EventID,
            e.EventName,
            e.EventDescription,
            e.EventDate,
            e.StartTime,
            e.EndTime,
            u.Username AS Organizer,
            v.VenueName,
            v.Location,
            v.Capacity
          FROM
            Events e
          JOIN
            Users u ON e.OrganizerID = u.UserID
          JOIN
            Venues v ON e.VenueID = v.VenueID
        `;

        try {
            const rows = await dbConnection.query(query);
            console.log(rows);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAvailableEvents(userID) {
        // similar to the above function, but only returns events that have not yet occurred i.e does not pass the current date and time
        console.log("User ID is", userID)
        const query = `
          SELECT
          e.EventID,
          e.EventName,
          e.EventDescription,
          e.EventDate,
          e.StartTime,
          e.EndTime,
          u.Username AS Organizer,
          v.VenueName,
          v.Location,
          v.Capacity
      FROM
          Events e
          JOIN Users u ON e.OrganizerID = u.UserID
          JOIN Venues v ON e.VenueID = v.VenueID
          LEFT JOIN Bookings b ON e.EventID = b.EventID AND b.AttendeeID = ${userID}
        WHERE
          e.EventDate >= CURDATE()
          AND b.BookingID IS NULL
        `;

        try {
            const rows = await dbConnection.query(query);
            console.log(rows);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // get all registered events
    static async getAllRegisteredEvents(UserID) {
        const query = `
        SELECT 
    e.EventName,
    e.EventDescription,
    e.EventDate,
    e.StartTime,
    e.EndTime,
    b.BookingID,
    v.VenueName,
    v.Location,
    v.Capacity
FROM
    Events e
    JOIN Venues v ON e.VenueID = v.VenueID
    JOIN Bookings b ON e.EventID = b.EventID
    JOIN Users u ON b.AttendeeID = u.UserID
WHERE
    u.UserID = 3;
        `
        try {
            const rows = await dbConnection.query(query);
            return rows[0];
        }
        catch (error) {
            throw error;
        }
    }

    // get all events and checking if the user, creating a  new value is registered 

    static async getEventsAndCheckIfRegistered(UserID) {
        console.log("User ID is", UserID) 
        const query = `
        SELECT
    e.EventID,
    e.EventName,
    e.EventDescription,
    e.EventDate,
    e.StartTime,
    e.EndTime,
    e.VenueID,
    v.Location,
    e.OrganizerID,
    CASE
        WHEN b.BookingID IS NOT NULL THEN 1
        ELSE 0
    END AS isRegistered
FROM
    Events e
    LEFT JOIN Bookings b ON e.EventID = b.EventID AND b.AttendeeID = ${UserID}
    LEFT JOIN Venues v ON e.VenueID = v.VenueID
        `
        try {
            const rows = await dbConnection.query(query);
            console.log(rows);
            return rows[0];
        }
        catch (error) {
            console.log(error)
            throw error;
        }
    }

    // get events by organizer
    static async getEventsByOrganizer(OrganizerID) {
        console.log("Organizer ID is, UNO")
        const query = `
          SELECT
            e.EventID,
            e.EventName,
            e.EventDescription,
            e.EventDate,
            e.StartTime,
            e.EndTime,
            v.VenueName,
            v.Location,
            v.Capacity
          FROM
            Events e
          JOIN
            Venues v ON e.VenueID = v.VenueID
          WHERE
            e.OrganizerID = ${OrganizerID}
        `;
        try {
            const rows = await dbConnection.query(query);
            console.log(rows);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // get event like name
    static async getEventsByName(EventName) {
        const query = `SELECT * FROM events WHERE eventname LIKE $1`;
        try {
            const rows = await dbConnection.query(query, ['%' + EventName + '%']);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // get events by date
    static async getEventsByDate(EventDate) {
        const query = `SELECT * FROM events WHERE eventdate = $1`;
        try {
            const rows = await dbConnection.query(query, [EventDate]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }


    // create an event
    static async createEvent(EventName, EventDescription, EventDate, StartTime, EndTime, VenueID, OrganizerID) {
        console.log("Event details is", EventName, EventDescription, EventDate, StartTime, EndTime, VenueID, OrganizerID);
        const query = `INSERT INTO events (eventname, eventdescription, eventdate, starttime, endtime, venueid, organizerid) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        try {
            const result = await dbConnection.query(query, [EventName, EventDescription, EventDate, StartTime, EndTime, VenueID, OrganizerID]);
            const eventId = await result[0].insertId;
            console.log(eventId, "eventid")
            return eventId;
        } catch (error) {
            console.log(error, "shit failed")
            throw error;
        }
    }

}

module.exports = Events;