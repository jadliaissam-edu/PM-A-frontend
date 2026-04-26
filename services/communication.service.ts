import { api } from "../lib/api";

export interface ChatChannel {
  id: string;
  organization: string;
  name: string;
  description: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  channel?: string;
  sender: string;
  sender_username: string;
  receiver?: string;
  receiver_username?: string;
  content: string;
  is_direct: boolean;
  created_at: string;
}

export const communicationService = {
  getChannels: async (organizationId: string): Promise<ChatChannel[]> => {
    const response = await api.get(`/collaboration/channels/?organization_id=${organizationId}`);
    return response.data;
  },

  createChannel: async (data: Partial<ChatChannel>): Promise<ChatChannel> => {
    const response = await api.post("/collaboration/channels/", data);
    return response.data;
  },

  getMessages: async (params: { channelId?: string; receiverId?: string }): Promise<ChatMessage[]> => {
    const { channelId, receiverId } = params;
    let url = "/collaboration/messages/";
    if (channelId) url += `?channel_id=${channelId}`;
    else if (receiverId) url += `?receiver_id=${receiverId}`;
    
    const response = await api.get(url);
    return response.data;
  },

  sendMessage: async (data: { channel?: string; receiver?: string; content: string; is_direct: boolean }): Promise<ChatMessage> => {
    const response = await api.post("/collaboration/messages/", data);
    return response.data;
  },
};
