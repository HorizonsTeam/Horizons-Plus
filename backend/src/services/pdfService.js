import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function formatDate(value) {
    if (value == null) return "";
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export async function generatePDF(ticketInfo, qrBase64) {
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

    const journey = String(ticketInfo.journey ?? "").replace("→", "->");

    const lines = [
        `Nom : ${ticketInfo.customerName ?? ""}`,
        `Trajet : ${journey}`,
        `Date : ${formatDate(ticketInfo.date)}`,
        `Heure : ${ticketInfo.time ?? ""}`,
        `Passagers : ${ticketInfo.passengers ?? ""}`,
        `Prix : ${ticketInfo.price ?? ""} €`,
        `ID Billet : ${ticketInfo.ticketId ?? ""}`,
    ];

    let y = height - 140;
    lines.forEach((line) => {
        page.drawText(String(line), {
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

    return pdfDoc.save();
}
