// One pet card. The pet data comes from the parent through "props".
import { Link } from "react-router-dom";
import PetImage from "./PetImage";

function PetCard({ pet }) {
  return (
    <Link to={`/pets/${pet._id}`} className="pet-card">
      <PetImage image={pet.image} species={pet.species} name={pet.name} className="pet-card-img" />

      <div className="pet-card-body">
        <div className="pet-card-top">
          <h3>{pet.name}</h3>
          <span className={`badge ${pet.status === "Available" ? "badge-green" : "badge-grey"}`}>
            {pet.status}
          </span>
        </div>
        <p className="muted">{pet.breed} - {pet.age} {pet.age === 1 ? "year" : "years"} - {pet.gender}</p>
        <p className="muted">{pet.location}</p>
      </div>
    </Link>
  );
}

export default PetCard;
