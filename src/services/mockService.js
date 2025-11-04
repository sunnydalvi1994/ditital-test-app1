// services/mockservice.js
import api from './api';

const normalizeArray = (payload) => {
  // payload may be an array, or an object like { loans: [...] } or { data: [...] }
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (Array.isArray(payload.loans)) return payload.loans;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  // fallback: try to find first array property
  const firstArray = Object.values(payload).find((v) => Array.isArray(v));
  return firstArray || [];
};

export const getLoans = async () => {
  const res = await api.get('/loans');
  return normalizeArray(res.data);
};

export const getLoanSubtypes = async () => {
  const res = await api.get('/loanSubtypes');
  return normalizeArray(res.data);
};

export const getConsumerCategories = async () => {
  const res = await api.get('/consumerCategories');
  return normalizeArray(res.data);
};

export const getEmploymentTypes = async () => {
  const res = await api.get('/employmentTypes');
  return normalizeArray(res.data);
};
