import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export const getJobCardChatApi = (jobCardId) => axiosInstance.get(ENDPOINTS.CHAT.GET(jobCardId));

export const sendJobCardChatMessageApi = (jobCardId, data) => axiosInstance.post(ENDPOINTS.CHAT.SEND(jobCardId), data);

export const markJobCardChatReadApi = (jobCardId) => axiosInstance.post(ENDPOINTS.CHAT.MARK_READ(jobCardId));

export const getRecentChatsApi = (params) => axiosInstance.get(ENDPOINTS.CHAT.RECENT_CHATS, { params });
