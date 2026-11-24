// Register page (adopters and shelters)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "adopter" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "shelter" ? "/dashboard" : "/");
    } catch (err) {
      setServerError(getError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form card narrow">
      <h2>Create account</h2>

      <label>Full name</label>
      <input name="name" value={form.name} onChange={handleChange} />
      {errors.name && <p className="error">{errors.name}</p>}

      <label>Email</label>
      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <p className="error">{errors.email}</p>}

      <label>Password</label>
      <input type="password" name="password" value={form.password} onChange={handleChange} />
      {errors.password && <p className="error">{errors.password}</p>}

      <label>I want to</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="adopter">Adopt a pet</option>
        <option value="shelter">List pets (shelter / owner)</option>
      </select>

      {serverError && <p className="error">{serverError}</p>}

      <button className="btn">Register</button>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}

export default Register;
