import axios, { AxiosInstance } from 'axios';
import { 
  StarWarsPlanetResponse, 
  StarWarsPeopleResponse, 
  PokemonResponse 
} from '../types';

const BASE_URL = '/api';
const SWAPI_URL = 'https://swapi.tech/api';
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});

export const getChallenge = async () => {
  const response = await api.get('/challenge/test');
  console.log('🔥 Challenge:', response.data);
  return response.data;
};

export const getStarWarsDataPlanets = async (): Promise<StarWarsPlanetResponse> => {
  const response = await axios.get(`${SWAPI_URL}/planets`);
  const planets = await Promise.all(
    response.data.results.map(async (planet: { url: string }) => {
      const planetDetails = await axios.get(planet.url);
      return planetDetails.data.result.properties;
    })
  );
  return { results: planets };
};

export const getStarWarsDataPeople = async (): Promise<StarWarsPeopleResponse> => {
  const response = await axios.get(`${SWAPI_URL}/people`);
  const people = await Promise.all(
    response.data.results.map(async (person: { url: string }) => {
      const personDetails = await axios.get(person.url);
      return personDetails.data.result.properties;
    })
  );
  return { results: people };
};

export const getPokemonData = async (): Promise<PokemonResponse> => {
  const response = await axios.get(`${POKEMON_URL}`);
  console.log('🔥 Pokemon Data:', response.data);
  return response.data;
};