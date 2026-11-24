// Main file of the backend. Run it with: npm run dev
require("dotenv").config(); // loads values from the .env file
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors()); // allows the React app (different port) to call this server
app.use(express.json()); // lets us read JSON data sent by the frontend

connectDB();

// Connect each route file to a URL
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/pets", require("./routes/petRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));

app.get("/", (req, res) => res.send("Pet Adoption API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
