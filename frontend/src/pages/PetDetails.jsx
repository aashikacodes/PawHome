// Page that shows full details of one pet
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";
import PetImage from "../components/PetImage";
import AdoptionForm from "../components/AdoptionForm";

function PetDetails() {
  const { id } = useParams(); // reads the pet id from the URL
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const loadPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`);
        setPet(res.data);
      } catch (err) {
        setError(getError(err));
      }
    };
    loadPet();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!pet) return <p className="muted">Loading...</p>;

  // Decide what to show in the "apply" area
  const renderApplyArea = () => {
    if (pet.status === "Adopted") return <p className="notice">This pet has already found a home.</p>;
    if (!user) return <p className="notice"><Link to="/login">Login</Link> as an adopter to apply for {pet.name}.</p>;
    if (user.role === "shelter") return <p className="notice">Shelter accounts cannot adopt pets.</p>;
    if (applied) {
      return (
        <p className="notice success">
          Request sent. Track it in <Link to="/my-applications">My applications</Link>.
        </p>
      );
    }
    return <AdoptionForm petId={pet._id} onSuccess={() => setApplied(true)} />;
  };

  return (
    <div>
      <Link to="/" className="muted">Back to all pets</Link>

      <div className="details">
        <PetImage image={pet.image} species={pet.species} name={pet.name} className="details-img" />

        <div>
          <div className="pet-card-top">
            <h1>{pet.name}</h1>
            <span className={`badge ${pet.status === "Available" ? "badge-green" : "badge-grey"}`}>{pet.status}</span>
          </div>

          <table className="info-table">
            <tbody>
              <tr><td>Type</td><td>{pet.species}</td></tr>
              <tr><td>Breed</td><td>{pet.breed}</td></tr>
              <tr><td>Age</td><td>{pet.age} {pet.age === 1 ? "year" : "years"}</td></tr>
              <tr><td>Gender</td><td>{pet.gender}</td></tr>
              <tr><td>Location</td><td>{pet.location}</td></tr>
              <tr><td>Health</td><td>{pet.healthInfo || "Not provided"}</td></tr>
              <tr><td>Shelter</td><td>{pet.owner?.name}</td></tr>
            </tbody>
          </table>

          <p>{pet.description}</p>
        </div>
      </div>

      <div className="card">{renderApplyArea()}</div>
    </div>
  );
}

export default PetDetails;
