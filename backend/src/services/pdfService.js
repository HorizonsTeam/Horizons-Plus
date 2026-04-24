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

const VERT_DARK  = rgb(16 / 255, 48 / 255, 53 / 255);
const BLUE_LIGHT = rgb(152 / 255, 234 / 255, 243 / 255); 
const WHITE      = rgb(1, 1, 1);                      
const GRAY_TEXT  = rgb(0.42, 0.42, 0.42);              
const GRAY_LIGHT = rgb(0.88, 0.88, 0.88);              
const BLACK      = rgb(0.1, 0.1, 0.1);

export async function generatePDF(ticketInfo, qrBase64) {
  const { ticketId, customerName, journey, date, time, price, passengers } = ticketInfo;

  // Parse origine / destination
  const parts       = journey.replace("→", "->").split("->");
  const origin      = parts[0]?.trim() ?? journey;
  const destination = parts[1]?.trim() ?? "";

  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([600, 340]);
  const { width, height } = page.getSize();

  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: VERT_DARK });

  page.drawText("HORIZONS+", {
    x: 28, y: height - 26,
    size: 9, font: fontReg, color: BLUE_LIGHT,
  });
  page.drawText("Billet de train", {
    x: 28, y: height - 54,
    size: 20, font: fontBold, color: WHITE,
  });

  // Badge ID billet
  const badgeLabel = ticketId;
  const badgeW     = fontReg.widthOfTextAtSize(badgeLabel, 10) + 24;
  const badgeX     = width - badgeW - 28;
  page.drawRectangle({ x: badgeX, y: height - 58, width: badgeW, height: 20, color: BLUE_LIGHT });
  page.drawText(badgeLabel, { x: badgeX + 12, y: height - 51, size: 10, font: fontReg, color: WHITE });
  page.drawText("Confirmé", { x: badgeX + 12, y: height - 31, size: 9, font: fontReg, color: BLUE_LIGHT });

  // Trajet 
  const routeY = height - 122;

  page.drawText(origin, { x: 28, y: routeY, size: 22, font: fontBold, color: BLACK });

  const destW = fontBold.widthOfTextAtSize(destination, 22);
  page.drawText(destination, { x: width - destW - 28, y: routeY, size: 22, font: fontBold, color: BLACK });

  // Ligne entre les deux villes
  const lineY  = routeY - 16;
  const lineX1 = 28  + fontBold.widthOfTextAtSize(origin, 22) + 12;
  const lineX2 = width - 28 - destW - 12;
  const midX   = (lineX1 + lineX2) / 2;

  page.drawLine({ start: { x: lineX1, y: lineY }, end: { x: lineX2, y: lineY }, thickness: 1.5, color: VERT_DARK });
  page.drawCircle({ x: lineX1, y: lineY, size: 4, color: VERT_DARK });
  page.drawCircle({ x: lineX2, y: lineY, size: 4, color: VERT_DARK });

  const tag  = "Direct";
  const tagW = fontReg.widthOfTextAtSize(tag, 10);
  page.drawText(tag, { x: midX - tagW / 2, y: lineY - 14, size: 10, font: fontReg, color: GRAY_TEXT });

  const sepY = height - 178;
  for (let x = 28; x < width - 28; x += 10) {
    page.drawLine({ start: { x, y: sepY }, end: { x: x + 5, y: sepY }, thickness: 1, color: GRAY_LIGHT });
  }
  page.drawCircle({ x: 8,         y: sepY, size: 10, color: rgb(0.94, 0.94, 0.94) });
  page.drawCircle({ x: width - 8, y: sepY, size: 10, color: rgb(0.94, 0.94, 0.94) });

  const row1Y = height - 210;
  const row2Y = height - 255;

  const row1 = [
    { label: "DATE",      value: formatDate(date),       x: 28  },
    { label: "DEPART",    value: time,                   x: 160 },
    { label: "PASSAGERS", value: `${passengers}`,        x: 292 },
    { label: "CLASSE",    value: "2eme classe",          x: 424 },
  ];
  const row2 = [
    { label: "PASSAGER",   value: customerName,          x: 28  },
    { label: "PRIX TOTAL", value: `${price} EUR`,        x: 160, accent: true },
  ];

  for (const { label, value, x, accent } of [...row1, ...row2]) {
    const y = row1.find(f => f.x === x && f.label === label) ? row1Y : row2Y;
    page.drawText(label, { x, y: y + 16, size: 8,  font: fontReg,  color: GRAY_TEXT });
    page.drawText(String(value ?? ""), { x, y, size: 12, font: fontBold, color: accent ? VERT_DARK : BLACK });
  }

  // QR Code 
  if (qrBase64) {
    const qrClean = qrBase64.replace(/^data:image\/png;base64,/, "");
    const qrBytes = Buffer.from(qrClean, "base64");
    const qrImage = await pdfDoc.embedPng(qrBytes);
    const qrSize  = 90;
    page.drawImage(qrImage, {
      x: width - qrSize - 28,
      y: 22,
      width: qrSize,
      height: qrSize,
    });
  }

  // Note bas de page 
  page.drawText(
    "Presentez ce billet au controleur. Valable uniquement pour le trajet et la date indiqueée.",
    { x: 28, y: 28, size: 8, font: fontReg, color: GRAY_TEXT, maxWidth: 440 }
  );

  return pdfDoc.save();
}