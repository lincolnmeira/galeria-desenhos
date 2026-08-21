const express = require("express");
const prisma = require("../prismaClient");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// GET /drawings - lista todos os desenhos
router.get("/", async (req, res) => {
  try {
    const drawings = await prisma.drawing.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(drawings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar desenhos" });
  }
});

// GET /drawings/:id - busca um desenho específico
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const drawing = await prisma.drawing.findUnique({ where: { id } });

    if (!drawing) {
      return res.status(404).json({ error: "Desenho não encontrado" });
    }

    res.json(drawing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar desenho" });
  }
});

// POST /drawings - cria um novo desenho
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.body;

    if (!title || !price || !imageUrl) {
      return res.status(400).json({ error: "title, price e imageUrl são obrigatórios" });
    }

    const drawing = await prisma.drawing.create({
      data: { title, description, price, imageUrl },
    });

    res.status(201).json(drawing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar desenho" });
  }
});

// PUT /drawings/:id - edita um desenho existente
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, status } = req.body;

    const drawing = await prisma.drawing.update({
      where: { id },
      data: { title, description, price, imageUrl, status },
    });

    res.json(drawing);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Desenho não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao editar desenho" });
  }
});

// DELETE /drawings/:id - remove um desenho
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.drawing.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Desenho não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao remover desenho" });
  }
});

module.exports = router;