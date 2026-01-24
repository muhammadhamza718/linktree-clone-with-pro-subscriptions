'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';

interface QRCodeComponentProps {
  url: string;
  size?: number;
}

export default function QRCodeComponent({ url, size = 128 }: QRCodeComponentProps) {
  const [showQR, setShowQR] = useState(false);

  if (!url) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowQR(!showQR)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </button>

      {showQR && (
        <div className="mt-4 flex flex-col items-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <QRCode
              value={url}
              size={size}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Scan to visit profile</p>
        </div>
      )}
    </div>
  );
}