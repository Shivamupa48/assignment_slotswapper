import api from '../utils/api';

export interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  title: string;
  startTime: string;
  endTime: string;
  status?: 'BUSY' | 'SWAPPABLE';
}

export const eventService = {
  getEvents: async (): Promise<{ events: Event[] }> => {
    const response = await api.get('/events');
    return response.data;
  },

  createEvent: async (data: CreateEventData): Promise<{ event: Event; message: string }> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<CreateEventData>): Promise<{ event: Event; message: string }> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  updateEventStatus: async (id: string, status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING'): Promise<{ event: Event; message: string }> => {
    const response = await api.put(`/events/${id}/status`, { status });
    return response.data;
  },
};

