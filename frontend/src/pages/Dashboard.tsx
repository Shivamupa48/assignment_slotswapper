import React, { useState, useEffect } from 'react';
import { Event, eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { events } = await eventService.getEvents();
      setEvents(events);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventService.createEvent({
        ...formData,
        status: 'BUSY',
      });
      setFormData({ title: '', startTime: '', endTime: '' });
      setShowCreateForm(false);
      loadEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(id);
      loadEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleToggleStatus = async (event: Event) => {
    try {
      const newStatus = event.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
      await eventService.updateEventStatus(event._id, newStatus);
      loadEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'SWAPPABLE':
        return 'status-swappable';
      case 'SWAP_PENDING':
        return 'status-pending';
      default:
        return 'status-busy';
    }
  };

  if (loading) {
    return <div className="container"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome, {user?.name}! 👋
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your calendar events and swap time slots with others
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>📅 My Events</h3>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {showCreateForm ? '❌ Cancel' : '➕ Create Event'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateEvent} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            <div className="form-group">
              <label>Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Team Meeting"
              />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Event</button>
          </form>
        )}

        {events.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No events yet. Create your first event!
          </p>
        ) : (
          <div>
            {events.map((event) => (
              <div key={event._id} className={`event-card ${event.status.toLowerCase()}`}>
                <div className="event-header">
                  <div>
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">
                      {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
                    </div>
                  </div>
                  <span className={`event-status ${getStatusClass(event.status)}`}>
                    {event.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  {event.status !== 'SWAP_PENDING' && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleToggleStatus(event)}
                      style={{ fontSize: '14px', padding: '5px 15px' }}
                    >
                      {event.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}
                    </button>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteEvent(event._id)}
                    style={{ fontSize: '14px', padding: '5px 15px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

