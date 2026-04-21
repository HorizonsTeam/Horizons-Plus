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
import { pool } from "../db.js";
import { sendMail } from "../server/mailer.js";
import { generateTicketPDF } from "../services/ticketService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// Helpers
function normalizeDate(rawDate) {
  const d = new Date(rawDate);
  if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return new Date().toISOString().split("T")[0];
}

async function createReservation({
  ticketId,
  userId,
  customerName,
  journey,
  date,
  time,
  passengers,
  price,
  transportType,
}) {
  const query = `
    INSERT INTO reservation (ticket_id, user_id, customer_name, journey, date, time, passengers, price, transport_type, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
    RETURNING *
  `;
  const values = [
    ticketId,
    userId,
    customerName,
    journey,
    normalizeDate(date),
    time,
    parseInt(passengers),
    parseFloat(price),
    transportType || "TRAIN",
    "confirmed",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

function itemHtmlBlock(item) {
  return `
    <div style="padding:12px;margin-bottom:12px;border:1px solid #e5e7eb;border-radius:8px;">
      <p style="margin:0 0 6px 0;"><strong>${item.journey}</strong></p>
      <ul style="margin:0;padding-left:18px;">
        <li>Date : ${item.date}</li>
        <li>Heure : ${item.time}</li>
        <li>Classe : ${item.class || "—"}</li>
        <li>Passagers : ${item.passengers}</li>
        <li>Prix : ${item.price} €</li>
        <li>ID Billet : ${item.ticketId}</li>
      </ul>
    </div>`;
}

// Confirmation email + Sauvegarde réservation(s)
router.post("/send-confirmation", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      email,
      customerName,
      items,
      totalPrice,
      // Single-mode fallback fields (backward compat)
      journey,
      date,
      time,
      price,
      passengers,
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obligatoire" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    // Normalize to an array either way
    const sourceItems = Array.isArray(items) && items.length > 0
      ? items
      : [{
          journey,
          date,
          time,
          price,
          passengers: passengers ?? 1,
          class: null,
          transportType: "TRAIN",
        }];

    const createdTickets = [];
    const attachments = [];

    for (const raw of sourceItems) {
      const ticketId = "TICKET-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const ticketInfo = {
        ticketId,
        customerName,
        journey: raw.journey,
        date: raw.date,
        time: raw.time,
        price: raw.price,
        passengers: raw.passengers ?? 1,
      };

      const pdfBytes = await generateTicketPDF(ticketInfo);

      await createReservation({
        ticketId,
        userId,
        customerName,
        journey: raw.journey,
        date: raw.date,
        time: raw.time,
        passengers: raw.passengers ?? 1,
        price: raw.price,
        transportType: raw.transportType || "TRAIN",
      });

      createdTickets.push({ ...ticketInfo, class: raw.class });
      attachments.push({
        filename: `Billet-${ticketId}.pdf`,
        content: pdfBytes,
        contentType: "application/pdf",
      });
    }

    const isCart = createdTickets.length > 1;
    const total = typeof totalPrice === "number"
      ? totalPrice
      : createdTickets.reduce((s, t) => s + parseFloat(t.price || 0), 0);

    const html = isCart
      ? `
        <h2>Votre commande Horizons+ est confirmée !</h2>
        <p>Merci <strong>${customerName}</strong>. Voici le détail de vos ${createdTickets.length} billets :</p>
        ${createdTickets.map(itemHtmlBlock).join("")}
        <p style="font-size:18px;margin-top:20px;"><strong>Total payé : ${total.toFixed(2)} €</strong></p>
        <p>Vous pouvez retrouver vos billets dans votre espace personnel "Mes réservations".</p>
      `
      : `
        <h2>Votre billet Horizons+ est confirmé !</h2>
        <p>Merci <strong>${customerName}</strong>.</p>
        ${itemHtmlBlock(createdTickets[0])}
        <p>Vous pouvez retrouver votre billet dans votre espace personnel "Mes réservations".</p>
      `;

    await sendMail({
      to: email,
      subject: isCart
        ? `Confirmation de votre commande Horizons+ (${createdTickets.length} billets)`
        : "Confirmation de votre billet Horizons+",
      html,
      attachments,
    });

    console.log("Réservations créées:", createdTickets.map((t) => t.ticketId).join(", "));

    res.json({
      success: true,
      ticketIds: createdTickets.map((t) => t.ticketId),
      ticketId: createdTickets[0]?.ticketId, // legacy field
      message: isCart
        ? "Commande enregistrée et email envoyé"
        : "Réservation créée et email envoyé avec succès",
    });

  } catch (error) {
    console.error("Erreur send-confirmation:", error);
    res.status(500).json({ error: "Erreur lors de la création de la réservation." });
  }
});

export default router;