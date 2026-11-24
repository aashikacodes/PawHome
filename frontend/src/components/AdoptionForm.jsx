// Form that an adopter fills to apply for a pet
import { useState } from "react";
import api, { getError } from "../api";

function AdoptionForm({ petId, onSuccess }) {
  // State: all form values are stored here
  const [form, setForm] = useState({ phone: "", address: "", message: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Runs on every key press and updates the matching field
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Basic validation. Returns an object with error messages.
  const validate = () => {
    const newErrors = {};
    if (!/^[0-9]{10}$/.test(form.phone)) newErrors.phone = "Enter a valid 10 digit phone number";
    if (form.address.trim().length < 10) newErrors.address = "Please enter your full address (at least 10 characters)";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setServerError("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if there are errors

    try {
      setLoading(true);
      await api.post("/requests", { petId, ...form }); // POST request to the backend
      onSuccess(); // tell the parent page that the request was sent
    } catch (error) {
      setServerError(getError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Apply to adopt</h3>

      <label>Phone number</label>
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="10 digit number" />
      {errors.phone && <p className="error">{errors.phone}</p>}

      <label>Your address</label>
      <textarea name="address" value={form.address} onChange={handleChange} rows="2" />
      {errors.address && <p className="error">{errors.address}</p>}

      <label>Why do you want to adopt? (optional)</label>
      <textarea name="message" value={form.message} onChange={handleChange} rows="3" />

      {serverError && <p className="error">{serverError}</p>}

      <button className="btn" disabled={loading}>{loading ? "Sending..." : "Send request"}</button>
    </form>
  );
}

export default AdoptionForm;
