import React, { useState, useEffect } from 'react';
import { SwappableSlot, swapService } from '../services/swapService';
import { Event, eventService } from '../services/eventService';

const Marketplace: React.FC = () => {
  const [slots, setSlots] = useState<SwappableSlot[]>([]);
  const [mySwappableSlots, setMySwappableSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<SwappableSlot | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [slotsData, eventsData] = await Promise.all([
        swapService.getSwappableSlots(),
        eventService.getEvents(),
      ]);
      setSlots(slotsData.slots);
      // Filter only user's swappable slots
      setMySwappableSlots(eventsData.events.filter(e => e.status === 'SWAPPABLE'));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot: SwappableSlot) => {
    if (mySwappableSlots.length === 0) {
      setError('You need at least one swappable slot to request a swap. Go to Dashboard and mark a slot as swappable.');
      return;
    }
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleSubmitSwap = async (mySlotId: string) => {
    if (!selectedSlot) return;

    try {
      await swapService.createSwapRequest(mySlotId, selectedSlot._id);
      setSuccess('Swap request created successfully!');
      setShowModal(false);
      setSelectedSlot(null);
      loadData(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create swap request');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="container"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🛒 Marketplace
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Browse available time slots from other users and request swaps
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {slots.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No swappable slots available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid">
          {slots.map((slot) => (
            <div key={slot._id} className="card event-card swappable">
              <div className="event-header">
                <div>
                  <div className="event-title">{slot.title}</div>
                  <div className="event-time">
                    {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    👤 Offered by: {slot.userId.name}
                  </div>
                </div>
                <span className="event-status status-swappable">Swappable</span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleRequestSwap(slot)}
                style={{ marginTop: '15px', width: '100%' }}
              >
                Request Swap
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Swap Request Modal */}
      {showModal && selectedSlot && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Your Slot to Offer</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3>They are offering:</h3>
              <p><strong>{selectedSlot.title}</strong></p>
              <p>{formatDateTime(selectedSlot.startTime)} - {formatDateTime(selectedSlot.endTime)}</p>
            </div>
            <h3 style={{ marginBottom: '15px' }}>Select one of your swappable slots:</h3>
            {mySwappableSlots.length === 0 ? (
              <p style={{ color: '#dc3545' }}>
                You don't have any swappable slots. Go to Dashboard and mark a slot as swappable first.
              </p>
            ) : (
              <div>
                {mySwappableSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="event-card"
                    style={{ marginBottom: '10px', cursor: 'pointer', border: '2px solid #007bff' }}
                    onClick={() => handleSubmitSwap(slot._id)}
                  >
                    <div className="event-title">{slot.title}</div>
                    <div className="event-time">
                      {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

