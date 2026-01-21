import { useState, useEffect } from 'react';
import { generateCertificateQRCode } from '../../utils/qrCode';

interface QRCodeModalProps {
  certificateId: string;
  onClose: () => void;
  onDownloadNow: () => void;
}

export function QRCodeModal({ certificateId, onClose, onDownloadNow }: QRCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const baseUrl = window.location.origin;
  const retrievalUrl = `${baseUrl}/certificate/${certificateId}`;

  useEffect(() => {
    generateCertificateQRCode({ certificateId, baseUrl }).then(setQrCodeUrl);
  }, [certificateId, baseUrl]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-deep-space-300 border-none p-8 max-w-md w-full border border-deep-space-50">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Save Your Certificate
        </h2>
        
        <div className="bg-white p-4 border-none mb-4">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code for Certificate Retrieval" 
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <span className="text-gray-400">Generating QR code...</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-sm text-center mb-4">
          Scan this QR code with your phone to retrieve your certificate later.
          Valid for 90 days.
        </p>

        <div className="bg-slate-900 p-3 border-none mb-4">
          <p className="text-xs text-gray-400 mb-1">Retrieval URL:</p>
          <p className="text-xs text-cyber-cyan-500 break-all font-mono">{retrievalUrl}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onDownloadNow}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-none font-semibold transition-all"
          >
            📄 Download Now
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-deep-space-100 hover:bg-deep-space-50 text-white border-none font-semibold transition-all"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          💡 Tip: Take a screenshot of this QR code to save it
        </p>
      </div>
    </div>
  );
}
