import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";

export async function generatePDF(ticketInfo, qrBase64, outputPath) {
    console.log("tikcketinfo", ticketInfo.journey);
    const pdfDoc = await PDFDocument.create();
    
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    page.drawText("Billet Horizons+", {
        x: 50,
        y: height - 80,
        size: 28,
        font,
        color: rgb(0, 0, 0),
    });

    console.log("ticket info avant", ticketInfo.journey);
    ticketInfo.journey = ticketInfo.journey.replace("→", "->");
    console.log("ticket info apres", ticketInfo.journey);

    const text = [
        `Nom : ${ticketInfo.customerName}`,
        `Trajet : ${ticketInfo.journey}`,
        `Date : ${ticketInfo.date}`,
        `Heure : ${ticketInfo.time}`,
        `Passagers : ${ticketInfo.passengers}`,
        `Prix : ${ticketInfo.price} €`,
        `ID Billet : ${ticketInfo.ticketId}`,
    ];

    let y = height - 140;
    text.forEach((line) => {
        page.drawText(line, {
            x: 50,
            y,
            size: 16,
            font,
        });
        y -= 30;
    });

    const qrImageBase64 = qrBase64.replace(/^data:image\/png;base64,/, "");
    const qrImageBytes = Buffer.from(qrImageBase64, "base64");
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    const qrSize = 150;
    page.drawImage(qrImage, {
        x: width - qrSize - 50,
        y: height - qrSize - 200,
        width: qrSize,
        height: qrSize,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
}