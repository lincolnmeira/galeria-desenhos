const express = require("express");
const cors = require("cors");
require("dotenv").config();

const drawingsRoutes = require("./routes/drawings");
const commissionTypesRoutes = require("./routes/commissionTypes");
const commissionOrdersRoutes = require("./routes/commissionOrders");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API da galeria de desenhos está no ar 🎨");
});

app.use("/drawings", drawingsRoutes);
app.use("/commission-types", commissionTypesRoutes);
app.use("/commission-orders", commissionOrdersRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});