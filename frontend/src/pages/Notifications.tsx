import React, { useState, useEffect } from 'react';
import { SwapRequest, swapService } from '../services/swapService';
import { eventService } from '../services/eventService';

const Notifications: React.FC = () => {
  const [incoming, setIncoming] = useState<SwapRequest[]>([]);
  const [outgoing, setOutgoing] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    try {
      setLoading(true);
      const { incoming, outgoing } = await swapService.getSwapRequests();
      setIncoming(incoming);
      setOutgoing(outgoing);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapResponse = async (requestId: string, accepted: boolean) => {
    try {
      await swapService.respondToSwapRequest(requestId, accepted);
      setSuccess(
        accepted
          ? 'Swap accepted! The slots have been exchanged.'
          : 'Swap rejected. The slots are available again.'
      );
      // Refresh both swap requests and events
      await Promise.all([loadSwapRequests(), eventService.getEvents()]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process swap response');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return '#28a745';
      case 'REJECTED':
        return '#dc3545';
      default:
        return '#ffc107';
    }
  };

  if (loading) {
    return <div className="container"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🔔 Swap Requests
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your incoming and outgoing swap requests
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Incoming Requests */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Incoming Requests</h3>
        {incoming.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No incoming swap requests.
          </p>
        ) : (
          <div>
            {incoming.map((request) => (
              <div key={request._id} className="event-card" style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>{request.requesterUserId.name}</strong> wants to swap:
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                  <div><strong>Their slot:</strong> {request.requesterSlotId.title}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDateTime(request.requesterSlotId.startTime)} - {formatDateTime(request.requesterSlotId.endTime)}
                  </div>
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '15px' }}>
                  <div><strong>Your slot:</strong> {request.targetSlotId.title}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDateTime(request.targetSlotId.startTime)} - {formatDateTime(request.targetSlotId.endTime)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSwapResponse(request._id, true)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleSwapResponse(request._id, false)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Outgoing Requests</h3>
        {outgoing.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No outgoing swap requests.
          </p>
        ) : (
          <div>
            {outgoing.map((request) => (
              <div key={request._id} className="event-card" style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                  Swap request to <strong>{request.targetUserId.name}</strong>
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                  <div><strong>Your slot:</strong> {request.requesterSlotId.title}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDateTime(request.requesterSlotId.startTime)} - {formatDateTime(request.requesterSlotId.endTime)}
                  </div>
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '15px' }}>
                  <div><strong>Their slot:</strong> {request.targetSlotId.title}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDateTime(request.targetSlotId.startTime)} - {formatDateTime(request.targetSlotId.endTime)}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      padding: '5px 15px',
                      borderRadius: '3px',
                      backgroundColor: getStatusColor(request.status),
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {request.status === 'PENDING' && '⏳ Pending...'}
                    {request.status === 'ACCEPTED' && '✅ Accepted'}
                    {request.status === 'REJECTED' && '❌ Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

