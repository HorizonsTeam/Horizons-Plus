import express from "express";
import Stripe from "stripe";
import { sendMail } from "../server/mailer.js";  // le même que reset password
import { generateTicketPDF } from "../services/ticketService.js";
import fs from "fs";

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


// Confirmation email
router.post("/send-confirmation", async (req, res) => {
  try {
    const { email, customerName, journey, date, time, price, passengers } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obligatoire" });
    }
    
    const ticketId = "TICKET-" + Date.now();

    const pdfPath = await generateTicketPDF({
      ticketId,
      customerName,
      journey,
      date,
      time,
      price,
      passengers,
    });

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
      </ul>
    `;

    await sendMail({
      to: email,
      subject: "Confirmation de votre billet Horizons+",
      html,
      attachments: [
        {
          filename: `Billet-${ticketId}.pdf`,
          path: pdfPath,
        },
      ],
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Erreur send-confirmation:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
  }
});

export default router;
