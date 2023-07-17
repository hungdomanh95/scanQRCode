
import React, { useEffect, useRef, useState } from 'react';
import jsQR, { QRCode } from 'jsqr';
type QRCodeScannerProps = {};

const QRCodeScanner:React.FC<QRCodeScannerProps> = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl as any);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
  }
  useEffect(() => {
    if (preview) {
      console.log('preview: ', preview);
      scanQrCode(preview);
    }
  }, [preview]);

  const scanQrCode = (imageSrc:any) => {
    console.log('imageSrc: ', imageSrc);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const image:any = new Image();
    image.src  = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const code: QRCode | null = jsQR(imageData, canvas.width, canvas.height);

      if (code) {
        console.log('Mã QR code đã được phát hiện:', code.data);
      } else {
        console.log('Không tìm thấy mã QR code trong hình ảnh.');
      }
    };
  }

  return<>
   <input type="file" onChange={onSelectFile} />
  <canvas ref={canvasRef}></canvas>;
  </>
}

export default QRCodeScanner
