const express = require("express");
const prisma = require("../prismaClient");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// GET /commission-types - lista todos os tipos
router.get("/", async (req, res) => {
  try {
    const types = await prisma.commissionType.findMany({
      orderBy: { name: "asc" },
    });
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar tipos de encomenda" });
  }
});

// GET /commission-types/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const type = await prisma.commissionType.findUnique({ where: { id } });

    if (!type) {
      return res.status(404).json({ error: "Tipo de encomenda não encontrado" });
    }

    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar tipo de encomenda" });
  }
});

// POST /commission-types - cria um novo tipo
router.post("/", async (req, res) => {
  try {
    const { name, priceMin, priceMax, rules } = req.body;

    if (!name || !priceMin || !priceMax) {
      return res.status(400).json({ error: "name, priceMin e priceMax são obrigatórios" });
    }

    const type = await prisma.commissionType.create({
      data: { name, priceMin, priceMax, rules },
    });

    res.status(201).json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar tipo de encomenda" });
  }
});

// PUT /commission-types/:id - edita um tipo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, priceMin, priceMax, rules, active } = req.body;

    const type = await prisma.commissionType.update({
      where: { id },
      data: { name, priceMin, priceMax, rules, active },
    });

    res.json(type);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Tipo de encomenda não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao editar tipo de encomenda" });
  }
});

// DELETE /commission-types/:id - remove um tipo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.commissionType.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Tipo de encomenda não encontrado" });
    }
    if (error.code === "P2003") {
      return res.status(409).json({
        error: "Não é possível remover: existem encomendas vinculadas a este tipo",
      });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao remover tipo de encomenda" });
  }
});

module.exports = router;