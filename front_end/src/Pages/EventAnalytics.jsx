import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLocation } from 'react-router-dom';

const EventAnalytics = () => {

  const location = useLocation();
  const { EventID, EventName, EventDescription, EventDate, StartTime, EndTime, VenueName, Location, Capacity } = location.state;
  const [attendee, setAttendee] = useState([]);
  const [signupData, setSignupData] = useState([]);
  const [attendeeData, setAttendeeData] = useState([]);
  const [totalAttendees, setTotalAttendees] = useState(0);


  useEffect(() => {
    fetch(`http://localhost:5001/api/bookings/getAttendeesCount/${EventID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSignupData(data);
      })
      .catch((error) => {
        console.error('Error fetching signup data:', error);
      });

    fetch(`http://localhost:5001/api/tickets//getTicketCount/${EventID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAttendeeData(data);
      })
      .catch((error) => {
        console.error('Error fetching signup data:', error);
      });

    fetch(`http://localhost:5001/api/bookings/getAttendees/${EventID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAttendee(data);
      })
      .catch((error) => {
        console.error('Error fetching attendees:', error);
      });


    fetch(`http://localhost:5001/api/bookings/getBookingsCount/${EventID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTotalAttendees(data[0].count);
      })
      .catch((error) => {
        console.error('Error fetching attendees:', error);
      });


  }, [EventID]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Event Analytics</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Event: {EventName}</h5>
              <p className="card-text">Date: {EventDate}</p>
              <p className="card-text">Location: {Location}</p>
              <p className="card-text">Capacity: {Capacity}</p>
              <p className="card-text">Total Attendees: {totalAttendees}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Attendee Breakdown</h5>
              <BarChart width={500} height={300} data={attendeeData}>
                <XAxis dataKey="TicketType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="TicketCount" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sign-up Progress</h5>
              <BarChart width={500} height={300} data={signupData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Attendee List</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Ticket Type</th>
                  </tr>
                </thead>
                <tbody>
                  {attendee.map((data) => (
                    <tr key={data.BookingID}>
                      <td>{data.Username}</td>
                      <td>{data.Email}</td>
                      <td>{data.TicketType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;