const express = require("express");
const prisma = require("../prismaClient");
const verifyToken = require("../middleware/auth");
const router = express.Router();

function validateCommissionType(input, partial = false) {
  const data = {};

  if (!partial || input.name !== undefined) {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name || name.length > 80) return { error: "Name must contain 1–80 characters" };
    data.name = name;
  }

  for (const field of ["priceMin", "priceMax"]) {
    if (!partial || input[field] !== undefined) {
      const value = Number(input[field]);
      if (!Number.isFinite(value) || value < 0 || value > 1000000) {
        return { error: `${field} must be a valid positive price` };
      }
      data[field] = value.toFixed(2);
    }
  }

  if (data.priceMin !== undefined && data.priceMax !== undefined && Number(data.priceMin) > Number(data.priceMax)) {
    return { error: "Minimum price cannot be greater than maximum price" };
  }

  if (!partial || input.rules !== undefined) {
    if (typeof input.rules !== "string" || input.rules.trim().length > 2000) {
      return { error: "Description must be a string of at most 2,000 characters" };
    }
    data.rules = input.rules.trim();
  }

  if (input.sampleImageUrl !== undefined) {
    if (input.sampleImageUrl !== null && (typeof input.sampleImageUrl !== "string" || input.sampleImageUrl.length > 2048)) {
      return { error: "Sample image URL is invalid" };
    }
    data.sampleImageUrl = input.sampleImageUrl;
  }

  if (input.active !== undefined) {
    if (typeof input.active !== "boolean") return { error: "Active must be a boolean" };
    data.active = input.active;
  }

  return { data };
}

// Public list includes only types currently accepting requests.
router.get("/", async (req, res) => {
  try {
    const types = await prisma.commissionType.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar tipos de encomenda" });
  }
});

// Admin list includes paused types so they can be reactivated.
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const types = await prisma.commissionType.findMany({ orderBy: { name: "asc" } });
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load commission types" });
  }
});

// GET /commission-types/:id (public only while the type is active)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const type = await prisma.commissionType.findFirst({ where: { id, active: true } });

    if (!type) {
      return res.status(404).json({ error: "Commission option not found" });
    }

    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load commission option" });
  }
});

// POST /commission-types - creates a type (admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { data, error } = validateCommissionType(req.body);
    if (error) return res.status(400).json({ error });

    const type = await prisma.commissionType.create({
      data,
    });

    res.status(201).json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create commission option" });
  }
});

// PUT /commission-types/:id - updates a type (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = validateCommissionType(req.body, true);
    if (error) return res.status(400).json({ error });

    const current = await prisma.commissionType.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: "Commission option not found" });
    const nextMin = Number(data.priceMin ?? current.priceMin);
    const nextMax = Number(data.priceMax ?? current.priceMax);
    if (nextMin > nextMax) {
      return res.status(400).json({ error: "Minimum price cannot be greater than maximum price" });
    }

    const type = await prisma.commissionType.update({
      where: { id },
      data,
    });

    res.json(type);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Commission option not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Unable to update commission option" });
  }
});

// DELETE /commission-types/:id - removes an unused type (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.commissionType.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Commission option not found" });
    }
    if (error.code === "P2003") {
      return res.status(409).json({
        error: "This option has requests linked to it. Pause it instead to preserve order history.",
      });
    }
    console.error(error);
    res.status(500).json({ error: "Unable to delete commission option" });
  }
});

module.exports = router;
