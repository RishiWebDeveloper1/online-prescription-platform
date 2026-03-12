import QRCode from 'qrcode';

/**
 * Generates a QR code representing a payment payload.
 * Returns a base64 data-URL string that can be stored in MongoDB
 * and rendered directly in the frontend (<img src={qrCodeData} />).
 *
 * @param {{ doctorId: string, patientId: string, fee: number, consultationRef?: string }} payload
 * @returns {Promise<string>} base64 PNG data URL
 */
export const generatePaymentQR = (payload) =>
  QRCode.toDataURL(JSON.stringify(payload), {
    errorCorrectionLevel: 'H',
    width: 300,
  });
