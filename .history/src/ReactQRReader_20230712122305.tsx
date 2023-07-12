import React, { useEffect, useRef, useState } from 'react';
import { QrReader, QrReaderProps } from 'react-qr-reader';
import { BarcodeFormat, DecodeHintType, Result, BarcodeFormatUtils } from '@zxing/library';

const QRCodeScanner: React.FC = () => {
  const qrReaderRef = useRef<QrReaderProps>(null);
  const [data, setData] = useState<string>('');

  useEffect(() => {
    const qrCodeScanner = qrReaderRef.current;
    const codeReader = new window.zxing.BrowserQRCodeReader();

    codeReader.getVideoInputDevices().then((videoInputDevices) => {
      qrCodeScanner?.openVideoInputDevice(videoInputDevices[0].deviceId);
    });

    const hints = new Map<DecodeHintType, any>();
    const formats = [BarcodeFormat.PDF_417, BarcodeFormat.QR_CODE];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const scanQRCode = async () => {
      try {
        const result: Result = await codeReader.decodeOnceFromVideoDevice(undefined, 'video');
        if (result) {
          setData(result.getText());
        }
      } catch (error) {
        console.error(error);
      } finally {
        scanQRCode();
      }
    };

    scanQRCode();

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader ref={qrReaderRef} style={{ width: '100%' }} />
      <p>Scanned Data: {data}</p>
    </div>
  );
};

export default QRCodeScanner;
