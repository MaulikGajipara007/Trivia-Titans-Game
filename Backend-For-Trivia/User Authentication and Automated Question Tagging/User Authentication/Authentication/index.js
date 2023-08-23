
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);

exports.app = onRequest(app);
