import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import loaders from "sooky/loaders/index.js";
import Logger from "sooky/loaders/logger.js";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const PORT = process.env.PORT || 9000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("MongoDB URI is not defined in sooky-starter-default .env");
}

const startServer = async () => {
  const app = express();

  // Middlewares de sécurité
  app.use(helmet());  // Protection des en-têtes HTTP
  app.use(cors());    // Activer CORS pour les appels API

  // Middleware pour parser le JSON
  app.use(express.json());

  // Charger les autres modules via loaders et passer l'URI MongoDB
  await loaders({ expressApp: app, databaseUri: DATABASE_URL });

  // Middleware global pour gérer les erreurs
  app.use((err, req, res, next) => {
    Logger.error(err.stack);  // Log de l'erreur avec stack
    res.status(500).json({ message: "Erreur interne du serveur" });
  });

  // Démarrage du serveur
  app.listen(PORT, (err) => {
    if (err) {
      Logger.error("Erreur lors du démarrage du serveur:", err);
      return;
    }
    Logger.info(`Le serveur est prêt sur le port : ${PORT}!`);
  });
};

startServer();
