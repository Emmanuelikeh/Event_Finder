import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        EventID: '',
        EventName: '',
        EventDescription: '',
        EventDate: '',
        StartTime: '',
        EndTime: '',
    });
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/events/getEvent/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setFormData({
                    EventID: data.EventID,
                    EventName: data.EventName,
                    EventDescription: data.EventDescription,
                    EventDate: new Date(data.EventDate).toISOString().slice(0, 10),
                    StartTime: data.StartTime,
                    EndTime: data.EndTime,
                });
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEvent();
    }, [eventId, token]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(eventId, formData)
        try {
             fetch(`http://localhost:5001/api/events/updateEvents`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  return response.json().then(data => {
                    alert(data.message);
                  });
                }
              })
              .then(data => {
                alert(data.message);
                // Redirect the user to the dashboard
                window.location.href = '/organization-dashboard';
              })
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    return (
        <div className="container my-5">
            <h1>Edit Event</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="eventName">Event Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="eventName"
                        name="EventName"
                        value={formData.EventName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventDescription">Event Description</label>
                    <textarea
                        className="form-control"
                        id="eventDescription"
                        name="EventDescription"
                        rows="3"
                        value={formData.EventDescription}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="eventDate">Event Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="eventDate"
                        name="EventDate"
                        value={formData.EventDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventStartTime">Start Time</label>
                    <input
                        type="time"
                        className="form-control"
                        id="eventStartTime"
                        name="StartTime"
                        value={formData.StartTime}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventEndTime">End Time</label>
                    <input
                        type="time"
                        className="form-control"
                        id="eventEndTime"
                        name="EndTime"
                        value={formData.EndTime}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default EditEvent;