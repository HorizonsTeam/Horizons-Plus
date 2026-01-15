// import express from "express";
// import { generateTicketPDF } from "../services/ticketService.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // Récupérer toutes les réservations de l'utilisateur connecté
// router.get("/reservations", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ error: "Non authentifié" });
//     }

//     // ✅ Import dynamique DANS la fonction
//     const { PrismaClient } = await import("@prisma/client");
//     const prisma = new PrismaClient();

//     const reservations = await prisma.reservation.findMany({
//       where: { user_id: userId },
//       orderBy: { date: "desc" },
//     });

//     await prisma.$disconnect();
//     res.json({ reservations });
//   } catch (error) {
//     console.error("Erreur récupération réservations:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Télécharger un billet PDF
// router.get("/ticket/download/:ticketId", authMiddleware, async (req, res) => {
//   try {
//     const { ticketId } = req.params;
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ error: "Non authentifié" });
//     }

//     // ✅ Import dynamique DANS la fonction
//     const { PrismaClient } = await import("@prisma/client");
//     const prisma = new PrismaClient();

//     const reservation = await prisma.reservation.findFirst({
//       where: {
//         ticket_id: ticketId,
//         user_id: userId,
//       },
//     });

//     if (!reservation) {
//       await prisma.$disconnect();
//       return res.status(404).json({ error: "Réservation non trouvée" });
//     }

//     const ticketInfo = {
//       ticketId: reservation.ticket_id,
//       customerName: reservation.customer_name,
//       journey: reservation.journey,
//       date: reservation.date,
//       time: reservation.time,
//       passengers: reservation.passengers,
//       price: reservation.price,
//     };

//     const pdfBytes = await generateTicketPDF(ticketInfo);

//     await prisma.$disconnect();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="billet_${ticketId}.pdf"`
//     );
//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error("Erreur téléchargement billet:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from "express";
import pg from "pg";
import { generateTicketPDF } from "../services/ticketService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Connexion PostgreSQL directe
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect().catch(err => console.error("Erreur connexion DB:", err));

// Récupérer toutes les réservations de l'utilisateur connecté
router.get("/reservations", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const query = `
      SELECT * FROM reservation 
      WHERE user_id = $1 
      ORDER BY date DESC
    `;

    const result = await client.query(query, [userId]);
    res.json({ reservations: result.rows });
  } catch (error) {
    console.error("Erreur récupération réservations:", error);
    res.status(500).json({ error: error.message });
  }
});

// Télécharger un billet PDF
router.get("/ticket/download/:ticketId", authMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const query = `
      SELECT * FROM reservation 
      WHERE ticket_id = $1 AND user_id = $2
    `;

    const result = await client.query(query, [ticketId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    const reservation = result.rows[0];

    const ticketInfo = {
      ticketId: reservation.ticket_id,
      customerName: reservation.customer_name,
      journey: reservation.journey,
      date: reservation.date,
      time: reservation.time,
      passengers: reservation.passengers,
      price: reservation.price,
    };

    const pdfBytes = await generateTicketPDF(ticketInfo);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="billet_${ticketId}.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Erreur téléchargement billet:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;