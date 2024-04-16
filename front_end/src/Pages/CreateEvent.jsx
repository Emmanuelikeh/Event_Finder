import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateEvent.css';
const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventStartTime: '',
    eventEndTime: '',
    venueId: '',
    ticketOptions: [{ id: 'free', name: 'Free', description: 'Free Ticket', price: 0, quantity: 0, error: false }],
  });

  const [venues, setVenues] = useState([]);
  const [venueCapacity, setVenueCapacity] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    // Fetch venues data from the API
    fetch('http://localhost:5001/api/venues')
      .then(response => response.json())
      .then(data => setVenues(data))
      .catch(error => console.error('Error fetching venues:', error));
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      setVenueCapacity(selectedVenue.Capacity);
      updateFreeTicketQuantity(selectedVenue.Capacity);
    }
  }, [selectedVenue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleTicketOptionChange = (id, field, value) => {
    setFormData(prevData => {
      const updatedTicketOptions = prevData.ticketOptions.map(option => {
        if (option.id === id) {
          const updatedOption = { ...option, [field]: value };
          if (field === 'quantity') {
            updateFreeTicketQuantity(venueCapacity);
          }
          return updatedOption;
        }
        return option;
      });
      return {
        ...prevData,
        ticketOptions: updatedTicketOptions,
      };
    });
  };

  const addTicketOption = () => {
    const newTicketId = `ticket-${Date.now()}`;
    setFormData(prevData => ({
      ...prevData,
      ticketOptions: [
        ...prevData.ticketOptions,
        { id: newTicketId, name: '', description: '', price: 0, quantity: 0, error: false },
      ],
    }));
  };

  const removeTicketOption = (id) => {
    setFormData(prevData => {
      const removedOption = prevData.ticketOptions.find(option => option.id === id);
      const updatedTicketOptions = prevData.ticketOptions.filter(option => option.id !== id);
      const updatedFreeTicketOption = {
        ...prevData.ticketOptions.find(option => option.id === 'free'),
        quantity: parseInt(prevData.ticketOptions.find(option => option.id === 'free').quantity) + parseInt(removedOption.quantity),
      };
      return {
        ...prevData,
        ticketOptions: updatedTicketOptions.map(option =>
          option.id === 'free' ? updatedFreeTicketOption : option
        ),
      };
    });
  };

  const updateFreeTicketQuantity = (capacity) => {
    setFormData(prevData => {
      const totalPaidTickets = prevData.ticketOptions
        .filter(option => option.id !== 'free')
        .reduce((sum, option) => sum + parseInt(option.quantity || 0), 0);
      const freeTicketQuantity = Math.max(capacity - totalPaidTickets, 0);
      const updatedFreeTicketOption = {
        ...prevData.ticketOptions.find(option => option.id === 'free'),
        quantity: freeTicketQuantity,
        error: freeTicketQuantity < 0,
      };
      return {
        ...prevData,
        ticketOptions: prevData.ticketOptions.map(option =>
          option.id === 'free' ? updatedFreeTicketOption : option
        ),
      };
    });
  };

  const handleVenueChange = (e) => {
    const selectedVenueId = e.target.value;
    const selectedVenue = venues.find(venue => venue.VenueID === parseInt(selectedVenueId));
    setFormData(prevData => ({ ...prevData, venueId: selectedVenueId }));
    setSelectedVenue(selectedVenue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const freeTicketOption = formData.ticketOptions.find(option => option.id === 'free');
    if (freeTicketOption.error) {
      alert('Free ticket quantity cannot be negative. Please adjust the paid ticket quantities.');
      return;
    }
    // ensure the form entries are not null 
    if (formData.eventName === '' || formData.eventDescription === '' || formData.eventDate === '' || formData.eventStartTime === '' || formData.eventEndTime === '' || formData.venueId === '') {
      alert('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');
    // get the user from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    // get the user id
    const organizerID = user.id;


    // Create a new event
    fetch('http://localhost:5001/api/events/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        eventDate: formData.eventDate,
        eventStartTime: formData.eventStartTime,
        eventEndTime: formData.eventEndTime,
        venueId: formData.venueId,
        organizerID: organizerID,
        ticketOptions: formData.ticketOptions,
      }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        // Redirect the user to the dashboard
        window.location.href = '/organization-dashboard';
      })
      .catch(error => {
        console.error('Error creating event:', error);
        alert('An error occurred. Please try again.');
      });

      // Clear the form
      setFormData({
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventStartTime: '',
        eventEndTime: '',
        venueId: '',
        ticketOptions: [{ id: 'free', name: 'Free', description: 'Free Ticket', price: 0, quantity: 0, error: false }],
      });
  };

  return (
    <div className="container mt-4">
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            className="form-control"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Description</label>
          <textarea
            className="form-control"
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            className="form-control"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            className="form-control"
            name="eventStartTime"
            value={formData.eventStartTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            className="form-control"
            name="eventEndTime"
            value={formData.eventEndTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Venue</label>
          <select
            className="form-control"
            name="venueId"
            value={formData.venueId}
            onChange={handleVenueChange}
            required
          >
            <option value="">Select a venue</option>
            {venues.map((venue) => (
              <option key={venue.VenueID} value={venue.VenueID}>
                {venue.VenueName}
              </option>
            ))}
          </select>
          {selectedVenue && (
            <div className="mt-2">
              <p>Selected Venue: {selectedVenue.VenueName}</p>
              <p>Capacity: {selectedVenue.Capacity}</p>
            </div>
          )}
        </div>
        {selectedVenue && (
          <div className="form-group">
            <label>Ticket Options</label>
            <p>Venue Capacity: {venueCapacity}</p>
            {formData.ticketOptions.map((option) => (
              <div key={option.id} className={`ticket-option ${option.error ? 'error' : ''}`}>
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={option.name}
                    onChange={(e) => handleTicketOptionChange(option.id, 'name', e.target.value)}
                    placeholder="Ticket Name"
                    required
                    disabled={option.id === 'free'}
                  />
                  {option.id !== 'free' && (
                    <button type="button" className="btn btn-danger ml-2" onClick={() => removeTicketOption(option.id)}>
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  className="form-control"
                  name="description"
                  value={option.description}
                  onChange={(e) => handleTicketOptionChange(option.id, 'description', e.target.value)}
                  placeholder="Ticket Description"
                  required
                  disabled={option.id === 'free'}
                />
                <div className="d-flex">
                  <input
                    type="number"
                    className="form-control mr-2"
                    name="price"
                    value={option.price}
                    onChange={(e) => handleTicketOptionChange(option.id, 'price', e.target.value)}
                    placeholder="Ticket Price"
                    required
                    disabled={option.id === 'free'}
                  />
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={option.quantity}
                    onChange={(e) => handleTicketOptionChange(option.id, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    required
                    disabled={option.id === 'free'}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addTicketOption}>
              Add Ticket Option
            </button>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;