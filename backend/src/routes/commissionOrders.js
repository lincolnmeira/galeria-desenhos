const express = require("express");
const prisma = require("../prismaClient");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// GET /commission-orders - lista a fila, ordenada por prioridade
router.get("/", verifyToken,  async (req, res) => {
  try {
    const orders = await prisma.commissionOrder.findMany({
      orderBy: { priority: "asc" },
      include: { commissionType: true },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar encomendas" });
  }
});

// GET /commission-orders/:id
router.get("/:id",verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.commissionOrder.findUnique({
      where: { id },
      include: { commissionType: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Encomenda não encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar encomenda" });
  }
});

// POST /commission-orders - cria uma nova encomenda (entra no fim da fila)
router.post("/", async (req, res) => {
  try {
    const { commissionTypeId, buyerName, buyerContact } = req.body;

    if (
      typeof commissionTypeId !== "string" ||
      typeof buyerName !== "string" || !buyerName.trim() || buyerName.length > 120 ||
      typeof buyerContact !== "string" || !buyerContact.trim() || buyerContact.length > 120
    ) {
      return res
        .status(400)
        .json({ error: "Commission type, name and Discord username are required" });
    }

    const commissionType = await prisma.commissionType.findFirst({
      where: { id: commissionTypeId, active: true },
      select: { id: true },
    });
    if (!commissionType) {
      return res.status(409).json({ error: "This commission option is no longer accepting requests" });
    }

    const totalOrders = await prisma.commissionOrder.count();

    const order = await prisma.commissionOrder.create({
      data: {
        commissionTypeId,
        buyerName: buyerName.trim(),
        buyerContact: buyerContact.trim(),
        contactPlatform: "discord",
        priority: totalOrders + 1,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid commission type" });
    }
    console.error(error);
    res.status(500).json({ error: "Unable to submit commission request" });
  }
});

// PUT /commission-orders/:id - edita status ou prioridade
router.put("/:id",verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const order = await prisma.commissionOrder.update({
      where: { id },
      data: { status, priority },
      include: {commissionType: true},
    });

    res.json(order);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Encomenda não encontrada" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao editar encomenda" });
  }
});

// DELETE /commission-orders/:id
router.delete("/:id",verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.commissionOrder.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Encomenda não encontrada" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao remover encomenda" });
  }
});

module.exports = router;
