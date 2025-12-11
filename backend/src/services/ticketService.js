import path from "path";
import { generateQR } from "./qrService.js";
import { generatePDF } from "./pdfService.js";

export async function generateTicketPDF(info) {
    const qrBase64 = await generateQR(info.ticketId);

    const outputPath = path.resolve(`tickets/ticket-${info.ticketId}.pdf`);

    await generatePDF(info, qrBase64, outputPath);

    return outputPath;
}