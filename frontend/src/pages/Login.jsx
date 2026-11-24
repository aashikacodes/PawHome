// Login page
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token); // save the user in context
      navigate(res.data.user.role === "shelter" ? "/dashboard" : "/");
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form card narrow">
      <h2>Login</h2>

      <label>Email</label>
      <input type="email" name="email" value={form.email} onChange={handleChange} />

      <label>Password</label>
      <input type="password" name="password" value={form.password} onChange={handleChange} />

      {error && <p className="error">{error}</p>}

      <button className="btn">Login</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}

export default Login;
