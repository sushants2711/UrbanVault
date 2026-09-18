import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
});

export const getTickets = (params) => api.get('tickets/', { params });
export const getTicket = (id) => api.get(`tickets/${id}/`);
export const createTicket = (data) => api.post('tickets/', data);
export const performTicketAction = (id, data) => api.post(`tickets/${id}/perform_action/`, data);
export const getIssues = () => api.get('issues/');
export const getFloors = () => api.get('floors/');
export const getUsers = () => api.get('users/');

export default api;
