import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';
import './Dashboard.css';  // Ensure the CSS file is correctly imported

const OrganizationDashboard = () => {
  // Example data for organization's events and analytics
  //get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const organizationName = user.username;
  const organizerID = user.id;

  const [counts, setCounts] = useState([]);
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);
  const totalEvents = 3;
  const totalAttendees = 120;
  // const events = [
  //   { id: 1, name: 'Interview Prep', attendees: 40 },
  //   { id: 2, name: 'Hackathon', attendees: 60 },
  //   { id: 3, name: 'Resume Review', attendees: 20 }
  // ];

  // Data for the attendance chart
  const chartData = {
    labels: data.map(d => d.EventName),
    datasets: [
      {
        label: 'Attendance',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: data.map(d => d.count)
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


  useEffect(() => {
    fetch(`http://localhost:5001/api/events//getEventAndAttendeeCount/${organizerID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },  
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCounts(data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });


    fetch(`http://localhost:5001/api/events/getThreeEvents/${organizerID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },  
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvents(data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });

      fetch(`http://localhost:5001/api/bookings//getThreeEventsBookings/${organizerID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
          },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
        });


      
  }, [])

  return (
    <div className="container mt-4">
      <h1>{organizationName} Dashboard</h1>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Total Events: {counts.eventCount}</h5>
          <p className="card-text">Total Attendees: {counts.attendeeCount}</p>
          <Link to="/organization/analytics" className="btn btn-primary">
            View Total Event Analytics
          </Link>
        </div>
      </div>
      <h2 className="mt-4">Individual Event Analytics</h2>
      <div className="row mt-4">
        {events.map((event, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{event.EventName}</h5>
                <p className="card-text">Attendees: {event.attendees}</p>
                <Link to={`/organization/analytics/${event.id}`} className="btn btn-primary">
                  View Event Analytics
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-4">Attendance Chart</h2>
      <div className="chart-container mt-4">
        <Bar
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default OrganizationDashboard;
