// Form used by shelters to add a new pet or edit an old one
import { useState } from "react";

const emptyPet = {
  name: "", species: "Dog", breed: "", age: "", gender: "Male",
  location: "", description: "", healthInfo: "", image: "",
};

// "initialData" is given when we are editing, "onSave" and "onCancel" are functions from the parent
function PetForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || emptyPet);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.breed.trim()) newErrors.breed = "Breed is required";
    if (form.age === "" || Number(form.age) < 0 || Number(form.age) > 30) newErrors.age = "Enter age between 0 and 30";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (form.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({ ...form, age: Number(form.age) });
  };

  return (
    <form onSubmit={handleSubmit} className="form card">
      <h3>{initialData ? "Edit pet" : "Add a new pet"}</h3>

      <div className="grid-2">
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>Type</label>
          <select name="species" value={form.species} onChange={handleChange}>
            <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
          </select>
        </div>
        <div>
          <label>Breed</label>
          <input name="breed" value={form.breed} onChange={handleChange} />
          {errors.breed && <p className="error">{errors.breed}</p>}
        </div>
        <div>
          <label>Age (years)</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} />
          {errors.age && <p className="error">{errors.age}</p>}
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option>Male</option><option>Female</option>
          </select>
        </div>
        <div>
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>
      </div>

      <label>Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
      {errors.description && <p className="error">{errors.description}</p>}

      <label>Health information</label>
      <input name="healthInfo" value={form.healthInfo} onChange={handleChange} placeholder="Example: Vaccinated" />

      <label>Photo link (optional)</label>
      <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />

      <div className="row">
        <button className="btn">{initialData ? "Save changes" : "Add pet"}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default PetForm;
