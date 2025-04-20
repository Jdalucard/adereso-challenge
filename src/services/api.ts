import axios, { AxiosInstance } from "axios";
import {
  StarWarsPlanetResponse,
  StarWarsPeopleResponse,
  PokemonResponse,
  People,
  Planet,
} from "../types";

interface SWAPIPlanet {
  url: string;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  surface_water: string;
  population: string;
}

interface SWAPIPerson {
  url: string;
  name: string;
  height: string;
  mass: string;
  homeworld: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BASE_URL = '/api';
const SWAPI_URL_PLANETS = 'https://swapi.py4e.com/api/';
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
});

export const getStarWarsDataPlanets =
  async (): Promise<StarWarsPlanetResponse> => {
    let allPlanets: Planet[] = [];
    let nextUrl = `${SWAPI_URL_PLANETS}/planets`;

    while (nextUrl) {
      const response = await axios.get(nextUrl);
      const planets = response.data.results.map((planet: SWAPIPlanet) => ({
        uid: planet.url.split('/').slice(-2, -1)[0],
        name: planet.name,
        rotation_period: parseInt(planet.rotation_period) || 0,
        orbital_period: parseInt(planet.orbital_period) || 0,
        diameter: parseInt(planet.diameter) || 0,
        surface_water: parseInt(planet.surface_water) || 0,
        population: parseInt(planet.population) || 0,
        url: planet.url
      }));
      
      allPlanets = [...allPlanets, ...planets];
      nextUrl = response.data.next;
      if (nextUrl) {
        await delay(500);
      }
    }

    console.log("🔥 Planets Data:", allPlanets);
    return { results: allPlanets };
  };

export const getStarWarsDataPeople = async (): Promise<StarWarsPeopleResponse> => {
  let allPeople: People[] = [];
  let nextUrl = `${SWAPI_URL_PLANETS}/people`;
  
  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const people = response.data.results.map((person: SWAPIPerson) => ({
      uid: person.url.split('/').slice(-2, -1)[0],
      name: person.name,
      height: parseInt(person.height) || 0,
      mass: parseInt(person.mass) || 0,
      homeworld: person.homeworld
    }));
    
    allPeople = [...allPeople, ...people];
    nextUrl = response.data.next;
    if (nextUrl) {
      await delay(500);
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

  console.log("🔥 Pokemon Data:", pokemon);
  return {
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
    results: pokemon,
  };
};
export const getChallenge = async () => {
  const response = await api.get("/challenge/test");
  console.log("🔥 Challenge:", response.data);
  return response.data;
};
