import axios from 'axios';
import {
  Incident,
  PageResponse,
  CreateIncidentPayload,
  UpdateIncidentPayload,
  IncidentFilters,
} from '../types/incident';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchIncidents = async (
  filters: IncidentFilters
): Promise<PageResponse<Incident>> => {
  const params: Record<string, string | number> = {
    page: filters.page,
    size: filters.size,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  };
  if (filters.search) params.search = filters.search;
  if (filters.service) params.service = filters.service;
  if (filters.severity) params.severity = filters.severity;
  if (filters.status) params.status = filters.status;

  const response = await api.get<PageResponse<Incident>>('/incidents', { params });
  return response.data;
};

export const fetchIncidentById = async (id: string): Promise<Incident> => {
  const response = await api.get<Incident>(`/incidents/${id}`);
  return response.data;
};

export const createIncident = async (
  payload: CreateIncidentPayload
): Promise<Incident> => {
  const response = await api.post<Incident>('/incidents', payload);
  return response.data;
};

export const updateIncident = async (
  id: string,
  payload: UpdateIncidentPayload
): Promise<Incident> => {
  const response = await api.patch<Incident>(`/incidents/${id}`, payload);
  return response.data;
};
