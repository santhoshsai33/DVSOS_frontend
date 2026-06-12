import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export const getJobCardsApi = (params) => axiosInstance.get(ENDPOINTS.JOB_CARDS.LIST, { params });
export const getJobCardApi = (id) => axiosInstance.get(ENDPOINTS.JOB_CARDS.DETAIL(id));
export const createJobCardApi = (data) => axiosInstance.post(ENDPOINTS.JOB_CARDS.CREATE, data);
export const updateJobCardApi = (id, data) => axiosInstance.put(ENDPOINTS.JOB_CARDS.UPDATE(id), data);
export const deleteJobCardApi = (id) => axiosInstance.delete(ENDPOINTS.JOB_CARDS.DELETE(id));
