import api from '../utils/api';

export interface SwappableSlot {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface SwapRequest {
  _id: string;
  requesterSlotId: {
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
  };
  targetSlotId: {
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
  };
  requesterUserId: {
    _id: string;
    name: string;
    email: string;
  };
  targetUserId: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export const swapService = {
  getSwappableSlots: async (): Promise<{ slots: SwappableSlot[] }> => {
    const response = await api.get('/swap/swappable-slots');
    return response.data;
  },

  createSwapRequest: async (mySlotId: string, theirSlotId: string): Promise<{ swapRequest: SwapRequest; message: string }> => {
    const response = await api.post('/swap/swap-request', { mySlotId, theirSlotId });
    return response.data;
  },

  getSwapRequests: async (): Promise<{ incoming: SwapRequest[]; outgoing: SwapRequest[] }> => {
    const response = await api.get('/swap/swap-requests');
    return response.data;
  },

  respondToSwapRequest: async (requestId: string, accepted: boolean): Promise<{ swapRequest: SwapRequest; message: string }> => {
    const response = await api.post(`/swap/swap-response/${requestId}`, { accepted });
    return response.data;
  },
};

