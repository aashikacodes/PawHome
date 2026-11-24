// Shelter dashboard: manage pets (add, edit, delete) and review adoption requests
import { useState, useEffect } from "react";
import api, { getError } from "../api";
import PetForm from "../components/PetForm";
import PetImage from "../components/PetImage";

function ShelterDashboard() {
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null); // the pet being edited (null = adding new)
  const [error, setError] = useState("");

  // Loads both lists from the backend
  const loadData = async () => {
    try {
      const [petRes, requestRes] = await Promise.all([
        api.get("/pets/mine"),
        api.get("/requests/shelter"),
      ]);
      setPets(petRes.data);
      setRequests(requestRes.data);
    } catch (err) {
      setError(getError(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Runs when the form is saved: PUT if editing, POST if adding
  const savePet = async (petData) => {
    try {
      if (editingPet) {
        await api.put(`/pets/${editingPet._id}`, petData);
      } else {
        await api.post("/pets", petData);
      }
      setShowForm(false);
      setEditingPet(null);
      setError("");
      loadData();
    } catch (err) {
      setError(getError(err));
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm("Delete this pet and all its requests?")) return;
    try {
      await api.delete(`/pets/${id}`);
      loadData();
    } catch (err) {
      setError(getError(err));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}/status`, { status });
      loadData();
    } catch (err) {
      setError(getError(err));
    }
  };

  const openAddForm = () => {
    setEditingPet(null);
    setShowForm(true);
  };

  const openEditForm = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {/* ---------- Pet list ---------- */}
      <div className="section-head">
        <h2>My pets</h2>
        {!showForm && <button className="btn" onClick={openAddForm}>Add a pet</button>}
      </div>

      {showForm && (
        // "key" makes React create a fresh form when we switch between add and edit
        <PetForm
          key={editingPet ? editingPet._id : "new"}
          initialData={editingPet}
          onSave={savePet}
          onCancel={() => setShowForm(false)}
        />
      )}

      {pets.length === 0 && !showForm && <p className="muted">You have not added any pets yet.</p>}

      {pets.map((pet) => (
        <div key={pet._id} className="card request-row">
          <PetImage image={pet.image} species={pet.species} name={pet.name} className="thumb" />
          <div className="grow">
            <h3>{pet.name}</h3>
            <p className="muted">{pet.breed} - {pet.age} yrs - {pet.location}</p>
          </div>
          <span className={`badge ${pet.status === "Available" ? "badge-green" : "badge-grey"}`}>{pet.status}</span>
          <button className="btn btn-small btn-outline" onClick={() => openEditForm(pet)}>Edit</button>
          <button className="btn btn-small btn-danger" onClick={() => deletePet(pet._id)}>Delete</button>
        </div>
      ))}

      {/* ---------- Adoption requests ---------- */}
      <div className="section-head">
        <h2>Adoption requests</h2>
      </div>

      {requests.length === 0 && <p className="muted">No requests received yet.</p>}

      {requests.map((req) => (
        <div key={req._id} className="card">
          <div className="request-row">
            <div className="grow">
              <h3>{req.adopter?.name} wants to adopt {req.pet?.name}</h3>
              <p className="muted">{req.adopter?.email} - Phone: {req.phone}</p>
            </div>
            <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
          </div>
          <p><strong>Address:</strong> {req.address}</p>
          {req.message && <p><strong>Message:</strong> {req.message}</p>}

          {req.status === "Pending" && (
            <div className="row">
              <button className="btn btn-small" onClick={() => updateStatus(req._id, "Approved")}>Approve</button>
              <button className="btn btn-small btn-danger" onClick={() => updateStatus(req._id, "Rejected")}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ShelterDashboard;
