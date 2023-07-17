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
//       console.log('imageData: ', imageData, width, height);
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

import React, { ChangeEvent, useState } from 'react';
import QrScanner from 'qr-scanner';

interface QRCodeScannerProps {}

const QRCodeScanner: React.FC<QRCodeScannerProps> = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setQRCodeData(null);
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (src: string) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const qrScanner = QrScanner.scanImage(img).then((result: string | null) => {
          if (result) {
            setQRCodeData(result);
          } else {
            console.error('Không tìm thấy mã QR code trên ảnh.');
          }
          // qrScanner.destroy();
        })
        .catch((error: any) => {
          console.error('Lỗi xử lý mã QR code:', error);
          // qrScanner.destroy();
        });
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {qrCodeData && <p>Mã QR code đã được phát hiện: {qrCodeData}</p>}
      {imageSrc && <img src={imageSrc} alt="Uploaded" />}
    </div>
  );
};

export default QRCodeScanner;
