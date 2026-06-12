import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

// Services
export const getServicesApi = () => axiosInstance.get(ENDPOINTS.MASTERS.SERVICES);
export const createServiceApi = (data) => axiosInstance.post(ENDPOINTS.MASTERS.SERVICES, data);
export const updateServiceApi = (id, data) => axiosInstance.put(ENDPOINTS.MASTERS.SERVICE_DETAIL(id), data);
export const deleteServiceApi = (id) => axiosInstance.delete(ENDPOINTS.MASTERS.SERVICE_DETAIL(id));

// Brands
export const getBrandsApi = () => axiosInstance.get(ENDPOINTS.MASTERS.BRANDS);
export const createBrandApi = (data) => axiosInstance.post(ENDPOINTS.MASTERS.BRANDS, data);
export const updateBrandApi = (id, data) => axiosInstance.put(ENDPOINTS.MASTERS.BRAND_DETAIL(id), data);
export const deleteBrandApi = (id) => axiosInstance.delete(ENDPOINTS.MASTERS.BRAND_DETAIL(id));

// Models
export const getModelsApi = (brandId) => axiosInstance.get(ENDPOINTS.MASTERS.MODELS, { params: { brandId } });
export const createModelApi = (data) => axiosInstance.post(ENDPOINTS.MASTERS.MODELS, data);
export const updateModelApi = (id, data) => axiosInstance.put(ENDPOINTS.MASTERS.MODEL_DETAIL(id), data);
export const deleteModelApi = (id) => axiosInstance.delete(ENDPOINTS.MASTERS.MODEL_DETAIL(id));

// Pricing
export const getPricingApi = () => axiosInstance.get(ENDPOINTS.MASTERS.PRICING);
export const createPricingApi = (data) => axiosInstance.post(ENDPOINTS.MASTERS.PRICING, data);
export const updatePricingApi = (id, data) => axiosInstance.put(ENDPOINTS.MASTERS.PRICING_DETAIL(id), data);
export const deletePricingApi = (id) => axiosInstance.delete(ENDPOINTS.MASTERS.PRICING_DETAIL(id));
