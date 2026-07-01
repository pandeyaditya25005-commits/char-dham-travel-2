export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const BOOKING_TYPES = {
  PACKAGE: 'package',
  HOTEL: 'hotel',
};

export const PACKAGE_DIFFICULTY = {
  EASY: 'easy',
  MODERATE: 'moderate',
  CHALLENGING: 'challenging',
};

export const ROOM_TYPES = ['single', 'double', 'deluxe', 'suite'];

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/packages', label: 'Tour Packages' },
  { path: '/hotels', label: 'Hotels' },
  { path: '/char-dham', label: 'Char Dham' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
];

export const DESTINATIONS = [
  { name: 'Yamunotri', description: 'Westernmost Dham, source of Yamuna River' },
  { name: 'Gangotri', description: 'Origin of the holy River Ganga' },
  { name: 'Kedarnath', description: 'Northernmost Dham, Lord Shiva temple' },
  { name: 'Badrinath', description: 'Easternmost Dham, Lord Vishnu temple' },
];
