import axios, { AxiosInstance } from 'axios';
import { 
  StarWarsPlanetResponse, 
  StarWarsPeopleResponse, 
  PokemonResponse,
  People,
  Planet
} from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  let allPlanets: Planet[] = [];
  let nextUrl = `${SWAPI_URL}/planets`;
  
  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const planets = await Promise.all(
      response.data.results.map(async (planet: { url: string }) => {
        const planetDetails = await axios.get(planet.url);
        return planetDetails.data.result.properties;
      })
    );
    allPlanets = [...allPlanets, ...planets];
    nextUrl = response.data.next;
    if (nextUrl) {
      await delay(500);
    }
  }

  console.log('🔥 Planets Data:', allPlanets);
  return { results: allPlanets };
};

export const getStarWarsDataPeople = async (): Promise<StarWarsPeopleResponse> => {
  let allPeople: People[] = [];
  let nextUrl = `${SWAPI_URL}/people?limit=38`; // Máximo permitido por la API
  
  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const people = await Promise.all(
      response.data.results.map(async (person: { url: string }) => {
        const personDetails = await axios.get(person.url);
        return personDetails.data.result.properties;
      })
    );
    allPeople = [...allPeople, ...people];
    nextUrl = response.data.next;
    if (nextUrl) {
      await delay(500); // Reducimos el delay a 500ms
    }
  }

  console.log('🔥 People Data:', allPeople);
  return { results: allPeople };
};

export const getPokemonData = async (): Promise<PokemonResponse> => {
  const response = await axios.get(`${POKEMON_URL}?limit=1302`);
  const pokemon = await Promise.all(
    response.data.results.map(async (pokemon: { url: string }) => {
      await delay(1000); // 1 segundo entre peticiones
      const pokemonDetails = await axios.get(pokemon.url);
      return pokemonDetails.data;
    })
  );

  console.log('🔥 Pokemon Data:', pokemon);
  return {
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
    results: pokemon
  };
};