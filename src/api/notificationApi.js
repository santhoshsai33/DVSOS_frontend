import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export const getNotificationsApi = (params) => axiosInstance.get(ENDPOINTS.NOTIFICATIONS.LIST, { params });
export const markNotificationReadApi = (id) => axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
export const markAllNotificationsReadApi = () => axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
export const registerDeviceTokenApi = (token) => axiosInstance.post(ENDPOINTS.DEVICE_TOKEN.REGISTER, { token });
