import axios from 'axios';
import queryString from 'query-string';
import { CoachPlayerInterface, CoachPlayerGetQueryInterface } from 'interfaces/coach-player';
import { GetQueryInterface } from '../../interfaces';

export const getCoachPlayers = async (query?: CoachPlayerGetQueryInterface) => {
  const response = await axios.get(`/api/coach-players${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCoachPlayer = async (coachPlayer: CoachPlayerInterface) => {
  const response = await axios.post('/api/coach-players', coachPlayer);
  return response.data;
};

export const updateCoachPlayerById = async (id: string, coachPlayer: CoachPlayerInterface) => {
  const response = await axios.put(`/api/coach-players/${id}`, coachPlayer);
  return response.data;
};

export const getCoachPlayerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/coach-players/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCoachPlayerById = async (id: string) => {
  const response = await axios.delete(`/api/coach-players/${id}`);
  return response.data;
};
