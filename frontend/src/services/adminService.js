import api from './api';

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard/stats');
  return data;
};

export const getUsers = async (params = {}) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/admin/users/${id}`);
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const createPackage = async (payload) => {
  const { data } = await api.post('/admin/packages', payload);
  return data;
};

export const updatePackage = async (id, payload) => {
  const { data } = await api.put(`/admin/packages/${id}`, payload);
  return data;
};

export const deletePackage = async (id) => {
  const { data } = await api.delete(`/admin/packages/${id}`);
  return data;
};

export const createHotel = async (payload) => {
  const { data } = await api.post('/admin/hotels', payload);
  return data;
};

export const updateHotel = async (id, payload) => {
  const { data } = await api.put(`/admin/hotels/${id}`, payload);
  return data;
};

export const deleteHotel = async (id) => {
  const { data } = await api.delete(`/admin/hotels/${id}`);
  return data;
};

export const getHotelRoomsAdmin = async (hotelId) => {
  const { data } = await api.get(`/admin/hotels/${hotelId}/rooms`);
  return data;
};

export const createRoom = async (hotelId, payload) => {
  const { data } = await api.post(`/admin/hotels/${hotelId}/rooms`, payload);
  return data;
};

export const deleteRoom = async (id) => {
  const { data } = await api.delete(`/admin/rooms/${id}`);
  return data;
};

export const getAdminBookings = async (params = {}) => {
  const { data } = await api.get('/admin/bookings', { params });
  return data;
};

export const getAdminBookingById = async (id) => {
  const { data } = await api.get(`/admin/bookings/${id}`);
  return data;
};

export const approveBooking = async (id) => {
  const { data } = await api.put(`/admin/bookings/${id}/approve`);
  return data;
};

export const rejectBooking = async (id) => {
  const { data } = await api.put(`/admin/bookings/${id}/reject`);
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await api.put(`/admin/bookings/${id}/status`, { status });
  return data;
};

export const cancelBookingAdmin = async (id) => {
  const { data } = await api.put(`/admin/bookings/${id}/cancel`);
  return data;
};

export const getContacts = async (params = {}) => {
  const { data } = await api.get('/admin/contacts', { params });
  return data;
};

export const markContactRead = async (id) => {
  const { data } = await api.put(`/admin/contacts/${id}/read`);
  return data;
};

export const getRevenueAnalytics = async () => {
  const { data } = await api.get('/admin/analytics/revenue');
  return data;
};

export const getReportTrends = async () => {
  const { data } = await api.get('/admin/reports/trends');
  return data;
};

export const getReportSummary = async () => {
  const { data } = await api.get('/admin/reports/summary');
  return data;
};
