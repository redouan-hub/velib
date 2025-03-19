import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const VelibApp: React.FC = () => {
  const [stations, setStations] = useState<VelibStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      axios.get(API_URL)
          .then((response) => {
              const records = response.data.records.map((record: any) => ({
                  name: record.fields.name,
                  numbikesavailable: record.fields.numbikesavailable,
                  numdocksavailable: record.fields.numdocksavailable
              }));
              setStations(records);
              setLoading(false);
          })
          .catch((err) => {
              setError("Erreur lors de la récupération des données.");
              setLoading(false);
          });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div>
          <h1>Disponibilité Vélib</h1>
          <ul>
              {stations.map((station, index) => (
                  <li key={index}>
                      <strong>{station.name}</strong> - Vélibs disponibles : {station.numbikesavailable} - Emplacements libres : {station.numdocksavailable}
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default App
