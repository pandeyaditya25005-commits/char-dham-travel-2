import api from './api';

export const getAllHotels = async (params = {}) => {
  const { data } = await api.get('/hotels', { params });
  return data;
};

export const getHotelById = async (id) => {
  const { data } = await api.get(`/hotels/${id}`);
  return data;
};

export const getHotelRooms = async (hotelId) => {
  const { data } = await api.get(`/hotels/${hotelId}/rooms`);
  return data;
};
