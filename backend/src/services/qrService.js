import QRCode from "qrcode";

export async function generateQR(data) {

    if (!data) {
        throw new Error("generateQR: data is required (ticketId manquant)");
    }

    return QRCode.toDataURL(String(data));
}