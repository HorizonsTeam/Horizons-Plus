import { generateQR } from "./qrService.js";
import { generatePDF } from "./pdfService.js";

export async function generateTicketPDF(info) {

    const qrBase64 = await generateQR(info.ticketId);
    const pdfBytes = await generatePDF(info, qrBase64);
    
    return pdfBytes;
}