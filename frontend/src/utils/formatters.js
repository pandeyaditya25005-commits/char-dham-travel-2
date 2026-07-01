export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    cancelled: '#ef4444',
    completed: '#3b82f6',
  };
  return colors[status] || '#6b7280';
};

export const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#10b981',
    moderate: '#f59e0b',
    challenging: '#ef4444',
  };
  return colors[difficulty] || '#6b7280';
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
