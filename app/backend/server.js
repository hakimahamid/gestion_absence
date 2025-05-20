const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRouter = require('./routes/authRoutes');
const { authenticateJWT } = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRouter);

// Exemple de route protégée pour les admins
app.get('/api/admin/dashboard', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  res.json({ message: `Bienvenue Admin ${req.user.username}` });
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
