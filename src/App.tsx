import { useEffect, useState } from 'react';
import { getChallenge, getStarWarsDataPlanets, getStarWarsDataPeople, getPokemonData } from './services/api';
import { 
  StarWarsPlanetResponse, 
  StarWarsPeopleResponse, 
  PokemonResponse, 
  People, 
  Planet, 
  Pokemon 
} from './types';
import './App.css';

interface Challenge {
  problem: string;
  solution: number;
  id: string;
}

function App() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [starWarsDataPlanets, setStarWarsDataPlanets] = useState<StarWarsPlanetResponse | null>(null);
  const [starWarsDataPeople, setStarWarsDataPeople] = useState<StarWarsPeopleResponse | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [challengeData, planetsData, peopleData, pokemonData] = await Promise.all([
        getChallenge(),
        getStarWarsDataPlanets(),
        getStarWarsDataPeople(),
        getPokemonData()
      ]);
      
      setChallenge(challengeData);
      setStarWarsDataPlanets(planetsData);
      setStarWarsDataPeople(peopleData);
      setPokemonData(pokemonData);
    } catch (error) {
      setError('Error al obtener los datos');
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="container">
      <h1>🔥 Desafío Adereso</h1>
      
      <button 
        onClick={fetchAllData} 
        disabled={loading}
        className="challenge-button"
      >
        {loading ? 'Cargando...' : 'Obtener Todos los Datos'}
      </button>

      {error && <p className="error">{error}</p>}

      {challenge && (
        <div className="challenge-container">
          <h2>Id:</h2>
          <p className="problem">{challenge.id}</p>
          <hr />
          <h2>Problema:</h2>
          <p className="problem">{challenge.problem}</p>
          <h2>Solución:</h2>
          <p className="solution">{challenge.solution}</p>
        </div>
      )}

      <div className="data-grid-container">
        {starWarsDataPeople && (
          <div className="data-section">
            <h2>Personajes de Star Wars</h2>
            <div className="data-grid">
              {starWarsDataPeople.results.map((person: People) => (
                <div key={person.uid} className="data-card">
                  <h3>{person.name}</h3>
                  <p>Altura: {person.height} cm</p>
                  <p>Peso: {person.mass} kg</p>
                  <p>Planeta Natal: {person.homeworld}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {starWarsDataPlanets && (
          <div className="data-section">
            <h2>Planetas de Star Wars</h2>
            <div className="data-grid">
              {starWarsDataPlanets.results.map((planet: Planet) => (
                <div key={planet.uid} className="data-card">
                  <h3>{planet.name}</h3>
                  <p>Período de Rotación: {planet.rotation_period} horas</p>
                  <p>Período Orbital: {planet.orbital_period} días</p>
                  <p>Diámetro: {planet.diameter} km</p>
                  <p>Agua Superficial: {planet.surface_water}%</p>
                  <p>Población: {planet.population}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {pokemonData && (
          <div className="data-section">
            <h2>Pokémon</h2>
            <div className="data-grid">
              {pokemonData.results.map((pokemon: Pokemon) => (
                <div key={pokemon.name} className="data-card">
                  <h3>{pokemon.name}</h3>
                  <p>Experiencia Base: {pokemon.base_experience}</p>
                  <p>Altura: {pokemon.height} dm</p>
                  <p>Peso: {pokemon.weight} hg</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
