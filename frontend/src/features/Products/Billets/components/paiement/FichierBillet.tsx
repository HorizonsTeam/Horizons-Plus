import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

import type { User } from './Types/Types';


export async function CreationDuBilletPDF(user: User) {
    // 1. Create the PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 2. Draw text
    const text = `
Billet de Voyage
Nom : ${user.Nom}
Prénom : ${user.Prenom}
Date : ${user.BirthDate}
Email : ${user.Email}
`;

    page.drawText(text, {
        x: 50,
        y: 750,
        size: 14,
        font,
        color: rgb(0, 0, 0),
    });

    // 3. Generate QR Code (base64 PNG)
    const qrDataUrl = await QRCode.toDataURL(
        `BILLET | ${user.Nom} ${user.Prenom} | ${user.Email}`
    );

    // Convert base64 to bytes
    const qrBase64 = qrDataUrl.split(",")[1];
    const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));

    // Embed QR
    const qrImage = await pdfDoc.embedPng(qrBytes);

    // Draw QR
    page.drawImage(qrImage, {
        x: 50,
        y: 550,
        width: 150,
        height: 150,
    });

    // 4. Export PDF
    const pdfBytes = await pdfDoc.save();

    // 5. Download inside browser
    const arrayBuffer = pdfBytes.slice().buffer;
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Billet.pdf";
    a.click();

    URL.revokeObjectURL(url);

}
