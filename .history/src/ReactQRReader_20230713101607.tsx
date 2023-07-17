// import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
// import jsQR, { QRCode } from 'jsqr';

// interface QRCodeScannerProps {}

// const QRCodeScanner: React.FC<QRCodeScannerProps> = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);
//   const [qrCodeData, setQRCodeData] = useState<string | null>(null);

//   const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     console.log('handleImageUpload: ');
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImageSrc(reader.result as string);
//         setQRCodeData(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');

//     if (!canvas || !ctx || !imageSrc) return;

//     const image = new Image();
//     image.src = imageSrc;

//     image.onload = () => {
//       const { width, height } = image;

//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(image, 0, 0);

//       const imageData = ctx.getImageData(0, 0, width, height).data;
//       const code: QRCode | null = jsQR(imageData, width, height);
//       console.log('code: ', code);

//       if (code) {
//         const { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner } = code.location;
//         const topLeft = { x: topLeftCorner.x, y: topLeftCorner.y };
//         const topRight = { x: topRightCorner.x, y: topRightCorner.y };
//         const bottomLeft = { x: bottomLeftCorner.x, y: bottomLeftCorner.y };
//         const bottomRight = { x: bottomRightCorner.x, y: bottomRightCorner.y };

//         ctx.lineWidth = 5;
//         ctx.strokeStyle = 'red';

//         // Vẽ khung vuông xung quanh khu vực QR code
//         ctx.beginPath();
//         ctx.moveTo(topLeft.x, topLeft.y);
//         ctx.lineTo(topRight.x, topRight.y);
//         ctx.lineTo(bottomRight.x, bottomRight.y);
//         ctx.lineTo(bottomLeft.x, bottomLeft.y);
//         ctx.lineTo(topLeft.x, topLeft.y);
//         ctx.stroke();

//         setQRCodeData(code.data);
//       }else {
//         console.log('Không tìm thấy mã QR code trong hình ảnh.');
//       }
//     };
//   }, [imageSrc]);

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {imageSrc && (
//         <div>
//           <canvas ref={canvasRef}></canvas>
//           {qrCodeData && <p>Mã QR code đã được phát hiện: {qrCodeData}</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRCodeScanner;


import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BinaryBitmap, HybridBinarizer, MultiFormatReader, NotFoundException, HTMLCanvasElementLuminanceSource } from '@zxing/library';

interface QRCodeScannerProps {}

const QRCodeScanner: React.FC<QRCodeScannerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setQRCodeData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || !imageSrc) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const { width, height } = image;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0);

      const codeReader = new MultiFormatReader();

      try {
        const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
        const binarizer = new HybridBinarizer(luminanceSource);
        const bitmap = new BinaryBitmap(binarizer);
        const result:any = codeReader.decode(bitmap);
        const { text, boundingBox } = result;
        const { x, y, width, height } = boundingBox;

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';

        // Vẽ khung vuông xung quanh khu vực mã QR code
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();

        setQRCodeData(text);
      } catch (error) {
        if (error instanceof NotFoundException) {
          console.error('Không tìm thấy mã QR code trên ảnh.');
        } else {
          console.error('Lỗi khi đọc mã QR code:', error);
        }
      }
    };
  }, [imageSrc]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {qrCodeData && (
        <div>
          <p>Mã QR code đã được phát hiện: {qrCodeData}</p>
          <canvas ref={canvasRef}></canvas>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
