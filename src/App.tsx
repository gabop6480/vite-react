import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPokemones = async () => {
      try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const datos = await respuesta.json();

        // Obtenemos el detalle de cada Pokémon para extraer su imagen y tipos
        const detalles = await Promise.all(
          datos.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemones(detalles);
      } catch (error) {
        console.error('Error al cargar la PokéAPI:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPokemones();
  }, []);

  if (cargando) return <h2>Cargando Pokédex...</h2>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Pokédex con Vite + React</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {pokemones.map((poke) => (
          <div
            key={poke.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              color: '#333',
            }}
          >
            <img
              src={poke.sprites.other['official-artwork'].front_default}
              alt={poke.name}
              style={{ width: '120px', height: '120px' }}
            />
            <h3 style={{ textTransform: 'capitalize', margin: '0.5rem 0' }}>
              #{poke.id} {poke.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Tipo: {poke.types.map((t) => t.type.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
