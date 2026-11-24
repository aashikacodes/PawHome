// Adopter dashboard: shows all applications and their status
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { getError } from "../api";
import PetImage from "../components/PetImage";

function MyApplications() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      const res = await api.get("/requests/mine");
      setRequests(res.data);
    } catch (err) {
      setError(getError(err));
    }
  };

  useEffect(() => {
    loadRequests();
  }, []); // empty list = run only once when the page opens

  // DELETE request: cancel a pending application
  const cancelRequest = async (id) => {
    if (!window.confirm("Cancel this application?")) return;
    try {
      await api.delete(`/requests/${id}`);
      loadRequests(); // reload the list
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <div>
      <h2>My applications</h2>
      {error && <p className="error">{error}</p>}
      {requests.length === 0 && (
        <p className="muted">You have not applied for any pet yet. <Link to="/">Find a pet</Link></p>
      )}

      {requests.map((req) => (
        <div key={req._id} className="card request-row">
          <PetImage image={req.pet?.image} species={req.pet?.species} name={req.pet?.name} className="thumb" />
          <div className="grow">
            <h3>{req.pet ? <Link to={`/pets/${req.pet._id}`}>{req.pet.name}</Link> : "Pet removed"}</h3>
            <p className="muted">{req.pet?.breed} - applied on {new Date(req.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
          {req.status === "Pending" && (
            <button className="btn btn-small btn-outline" onClick={() => cancelRequest(req._id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  );
}
  
export default MyApplications;
