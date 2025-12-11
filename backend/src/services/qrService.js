import QRCode from "qrcode";

export async function generateQR(data) {
    return QRCode.toDataURL(data);
}