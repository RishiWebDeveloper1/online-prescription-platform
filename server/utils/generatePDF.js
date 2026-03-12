import PDFDocument from 'pdfkit';

/**
 * Generates a prescription PDF entirely in memory.
 * @param {object} prescription - Populated Prescription doc (doctor + patient populated)
 * @returns {Promise<Buffer>}
 */
export const generatePrescriptionPDF = (prescription) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { doctor, patient, careToBeTaken, medicines, notes, createdAt } = prescription;

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Online Prescription Platform', { align: 'center' });

    doc.moveDown(0.5);
    doc
      .fontSize(13)
      .font('Helvetica')
      .text('Prescription', { align: 'center', underline: true });

    doc.moveDown();
    doc.fontSize(11)
      .text(`Doctor  : Dr. ${doctor.name}  |  ${doctor.specialty}`)
      .text(`Patient : ${patient.name}`)
      .text(`Date    : ${new Date(createdAt).toLocaleDateString('en-GB')}`);

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').text('Care To Be Taken', { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(11).font('Helvetica').text(careToBeTaken || '-');

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').text('Medicines', { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(11).font('Helvetica').text(medicines || '-');

    if (notes) {
      doc.moveDown();
      doc.fontSize(11).font('Helvetica-Oblique').text(`Notes: ${notes}`);
    }

    doc.end();
  });
