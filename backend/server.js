
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// GET - Récupérer toutes les personnes
app.get("/personnes", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM personnes ORDER BY id"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST - Créer une personne
app.post("/personnes", async (req, res) => {
    try {
        const { nom, prenom, age, email, ville } = req.body;

        if (!nom || !prenom) {
            return res.status(400).json({
                error: "Nom et prénom obligatoires"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO personnes
             (nom, prenom, age, email, ville)
             VALUES (?, ?, ?, ?, ?)`,
            [
                nom,
                prenom,
                age ?? null,
                email ?? null,
                ville ?? null
            ]
        );

        res.status(201).json({
            message: "Personne créée",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// PUT - Modifier une personne
app.put("/personnes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, age, email, ville } = req.body;

        if (!nom || !prenom) {
            return res.status(400).json({
                error: "Nom et prénom obligatoires"
            });
        }

        const [result] = await pool.query(
            `UPDATE personnes
             SET nom = ?, prenom = ?, age = ?,
                 email = ?, ville = ?
             WHERE id = ?`,
            [
                nom,
                prenom,
                age ?? null,
                email ?? null,
                ville ?? null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Personne introuvable"
            });
        }

        res.json({ message: "Personne modifiée" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DELETE - Supprimer une personne
app.delete("/personnes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM personnes WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Personne introuvable"
            });
        }

        res.json({ message: "Personne supprimée" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API démarrée sur le port ${PORT}`);
});
