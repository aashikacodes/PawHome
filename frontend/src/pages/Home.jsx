// Home page: shows all pets with search and filters
import { useState, useEffect } from "react";
import api, { getError } from "../api";
import PetCard from "../components/PetCard";

function Home() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ search: "", species: "", gender: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect runs the code inside it whenever "filters" changes
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        const res = await api.get("/pets", { params: filters }); // GET request with filters
        setPets(res.data);
        setError("");
      } catch (err) {
        setError(getError(err));
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => setFilters({ search: "", species: "", gender: "", location: "" });

  return (
    <div>
      <section className="hero">
        <h1>Someone is waiting for you to come home.</h1>
        <p>Browse pets from local shelters, apply online and track your application.</p>
      </section>

      <div className="filters card">
        <input name="search" value={filters.search} onChange={handleChange} placeholder="Search by name or breed" />
        <select name="species" value={filters.species} onChange={handleChange}>
          <option value="">All types</option>
          <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
        </select>
        <select name="gender" value={filters.gender} onChange={handleChange}>
          <option value="">Any gender</option>
          <option>Male</option><option>Female</option>
        </select>
        <input name="location" value={filters.location} onChange={handleChange} placeholder="City" />
        <button className="btn btn-outline" onClick={clearFilters}>Clear</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading pets...</p>}
      {!loading && !error && pets.length === 0 && (
        <p className="muted">No pets match your search. Try removing a filter.</p>
      )}

      <div className="pet-grid">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

export default Home;
