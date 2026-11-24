// App decides which page to show for each URL
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PetDetails from "./pages/PetDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import ShelterDashboard from "./pages/ShelterDashboard";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* These pages need login and the correct role */}
          <Route
            path="/my-applications"
            element={<ProtectedRoute role="adopter"><MyApplications /></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute role="shelter"><ShelterDashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
