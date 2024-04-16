import React from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';
import './Dashboard.css';  // Ensure the CSS file is correctly imported

const OrganizationDashboard = () => {
  // Example data for organization's events and analytics
  const organizationName = 'Computer Science Club';
  const totalEvents = 3;
  const totalAttendees = 120;
  const events = [
    { id: 1, name: 'Interview Prep', attendees: 40 },
    { id: 2, name: 'Hackathon', attendees: 60 },
    { id: 3, name: 'Resume Review', attendees: 20 }
  ];

  // Data for the attendance chart
  const chartData = {
    labels: events.map(event => event.name),
    datasets: [
      {
        label: 'Attendance',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: events.map(event => event.attendees)
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

  return (
    <div className="container mt-4">
      <h1>{organizationName} Dashboard</h1>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Total Events: {totalEvents}</h5>
          <p className="card-text">Total Attendees: {totalAttendees}</p>
          <Link to="/organization/analytics" className="btn btn-primary">
            View Total Event Analytics
          </Link>
        </div>
      </div>
      <h2 className="mt-4">Individual Event Analytics</h2>
      <div className="row mt-4">
        {events.map(event => (
          <div key={event.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
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
