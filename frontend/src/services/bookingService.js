import api from './api';

export const getMyBookings = async (params = {}) => {
  const { data } = await api.get('/bookings/my-bookings', { params });
  return data;
};

export const getBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await api.put(`/bookings/${id}/cancel`);
  return data;
};

export const downloadInvoice = async (id) => {
  const { data } = await api.get(`/bookings/${id}/invoice`, { responseType: 'text' });
  return data;
};
