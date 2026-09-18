import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
});

export const getTickets = (params) => api.get('tickets/', { params });
export const getTicket = (id) => api.get(`tickets/${id}/`);
export const createTicket = (data) => api.post('tickets/', data);
export const updateTicket = (id, data) => api.patch(`tickets/${id}/`, data);
export const deleteTicket = (id) => api.delete(`tickets/${id}/`);
export const performTicketAction = (id, data) => api.post(`tickets/${id}/perform_action/`, data);
export const getIssues = () => api.get('issues/');
export const createIssue = (data) => api.post('issues/', data);
export const updateIssue = (id, data) => api.patch(`issues/${id}/`, data);
export const deleteIssue = (id) => api.delete(`issues/${id}/`);

export const getFloors = () => api.get('floors/');
export const createFloor = (data) => api.post('floors/', data);
export const updateFloor = (id, data) => api.patch(`floors/${id}/`, data);
export const deleteFloor = (id) => api.delete(`floors/${id}/`);

export const getUsers = () => api.get('users/');
export const createUser = (data) => api.post('users/', data);
export const updateUser = (id, data) => api.patch(`users/${id}/`, data);
export const deleteUser = (id) => api.delete(`users/${id}/`);

export default api;
