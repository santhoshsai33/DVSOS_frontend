import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export const getMechanicalQueueApi = (params) => axiosInstance.get(ENDPOINTS.QUEUES.MECHANICAL, { params });
export const getBodyShopQueueApi = (params) => axiosInstance.get(ENDPOINTS.QUEUES.BODY_SHOP, { params });
export const getWaterWashQueueApi = (params) => axiosInstance.get(ENDPOINTS.QUEUES.WATER_WASH, { params });
