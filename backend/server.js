
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// GET - Récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM users ORDER BY id"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST - Créer un utilisateur
app.post("/users", async (req, res) => {
    try {
        const { nom, prenom, email } = req.body;

        if (!nom || !prenom || !email) {
            return res.status(400).json({
                error: "Nom, prénom et email obligatoires"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO users (nom, prenom, email)
             VALUES (?, ?, ?)`,
            [nom, prenom, email]
        );

        res.status(201).json({
            message: "Utilisateur créé",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "Cet email existe déjà"
            });
        }

        res.status(500).json({ error: "Erreur serveur" });
    }
});

// PUT - Modifier un utilisateur
app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email } = req.body;

        if (!nom || !prenom || !email) {
            return res.status(400).json({
                error: "Nom, prénom et email obligatoires"
            });
        }

        const [result] = await pool.query(
            `UPDATE users
             SET nom = ?, prenom = ?, email = ?
             WHERE id = ?`,
            [nom, prenom, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }

        res.json({
            message: "Utilisateur modifié"
        });

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "Cet email existe déjà"
            });
        }

        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DELETE - Supprimer un utilisateur
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }

        res.json({
            message: "Utilisateur supprimé"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API démarrée sur le port ${PORT}`);
});
