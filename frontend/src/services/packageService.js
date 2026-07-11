import api from './api';

export const getAllPackages = async (params = {}) => {
  const { data } = await api.get('/packages', { params });
  return data;
};

export const getPackageBySlug = async (slug) => {
  const { data } = await api.get(`/packages/${slug}`);
  return data;
};