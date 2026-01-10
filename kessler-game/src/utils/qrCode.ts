import QRCode from 'qrcode';

interface QRCodeOptions {
  certificateId: string;
  baseUrl: string;
}

export async function generateCertificateQRCode(
  options: QRCodeOptions
): Promise<string> {
  const retrievalUrl = `${options.baseUrl}/certificate/${options.certificateId}`;
  
  const qrCodeDataUrl = await QRCode.toDataURL(retrievalUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#1e293b',
      light: '#f1f5f9',
    },
    errorCorrectionLevel: 'M',
  });
  
  return qrCodeDataUrl;
}
