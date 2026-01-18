// import express from "express";
// import Stripe from "stripe";
// import { sendMail } from "../server/mailer.js";  // le même que reset password
// import { generateTicketPDF } from "../services/ticketService.js";

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Payment intent
// router.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount, currency } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       automatic_payment_methods: { enabled: true },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });

//   } catch (error) {
//     console.error("Erreur payment intent:", error);
//     res.status(500).json({ error: error.message });
//   }
// });


// // Confirmation email
// router.post("/send-confirmation", async (req, res) => {
//   try {
//     const { email, customerName, journey, date, time, price, passengers } = req.body;

//     if (!email) {
//       return res.status(400).json({ error: "Email obligatoire" });
//     }

//     const ticketId = "TICKET-" + Date.now();

//     const ticketInfo = {
//       ticketId,
//       customerName,
//       journey,
//       date,
//       time,
//       price,
//       passengers,
//     };

//     const pdfBytes = await generateTicketPDF(ticketInfo);


//     const html = `
//       <h2>Votre billet Horizons+ est confirmé !</h2>
//       <p>Merci <strong>${customerName}</strong>.</p>

//       <h3>Détails :</h3>
//       <ul>
//         <li><strong>Trajet :</strong> ${journey}</li>
//         <li><strong>Date :</strong> ${date}</li>
//         <li><strong>Heure :</strong> ${time}</li>
//         <li><strong>Passagers :</strong> ${passengers}</li>
//         <li><strong>Prix :</strong> ${price} €</li>
//       </ul>
//     `;


//     await sendMail({
//       to: email,
//       subject: "Confirmation de votre billet Horizons+",
//       html,
//       attachments: [
//         {
//           filename: `Billet-${ticketId}.pdf`,
//           content: pdfBytes,
//           contentType: "application/pdf",
//         },
//       ],
//     });

//     res.json({ success: true });

//   } catch (error) {
//     console.error("Erreur send-confirmation:", error);
//     res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
//   }
// });

// export default router;

import express from "express";
import Stripe from "stripe";
import pg from "pg";
import { sendMail } from "../server/mailer.js";
import { generateTicketPDF } from "../services/ticketService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Connexion PostgreSQL directe
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect().catch(err => console.error("Erreur connexion DB:", err));

// Payment intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Erreur payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Confirmation email + Sauvegarde réservation EN BASE DE DONNÉES
router.post("/send-confirmation", authMiddleware, async (req, res) => {
  try {
    const { email, customerName, journey, date, time, price, passengers } = req.body;
    const userId = req.userId;

    if (!email) {
      return res.status(400).json({ error: "Email obligatoire" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const ticketId = "TICKET-" + Date.now();

    const ticketInfo = {
      ticketId,
      customerName,
      journey,
      date,
      time,
      price,
      passengers,
    };

    const pdfBytes = await generateTicketPDF(ticketInfo);

    // Insère directement en base de données avec SQL
    const query = `
      INSERT INTO reservation (ticket_id, user_id, customer_name, journey, date, time, passengers, price, transport_type, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    // Je formate la date 
    const dateObj = new Date(date);
    const values = [
      ticketId,
      userId,
      customerName,
      journey,
      dateObj.toISOString().split('T')[0],
      time,
      parseInt(passengers),
      parseFloat(price),
      "TRAIN",
      "confirmed"
    ];

    const result = await client.query(query, values);
    console.log("Réservation créée:", result.rows[0].ticket_id);

    const html = `
      <h2>Votre billet Horizons+ est confirmé !</h2>
      <p>Merci <strong>${customerName}</strong>.</p>

      <h3>Détails :</h3>
      <ul>
        <li><strong>Trajet :</strong> ${journey}</li>
        <li><strong>Date :</strong> ${date}</li>
        <li><strong>Heure :</strong> ${time}</li>
        <li><strong>Passagers :</strong> ${passengers}</li>
        <li><strong>Prix :</strong> ${price} €</li>
        <li><strong>ID Billet :</strong> ${ticketId}</li>
      </ul>

      <p>Vous pouvez retrouver votre billet dans votre espace personnel "Mes réservations".</p>
    `;

    await sendMail({
      to: email,
      subject: "Confirmation de votre billet Horizons+",
      html,
      attachments: [
        {
          filename: `Billet-${ticketId}.pdf`,
          content: pdfBytes,
          contentType: "application/pdf",
        },
      ],
    });

    res.json({ 
      success: true, 
      ticketId,
      message: "Réservation créée et email envoyé avec succès"
    });

  } catch (error) {
    console.error("Erreur send-confirmation:", error);
    res.status(500).json({ error: "Erreur lors de la création de la réservation." });
  }
});

export default router;