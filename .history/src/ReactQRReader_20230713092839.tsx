import React, { useEffect, useRef, useState } from "react";
import jsQR, { QRCode } from 'jsqr';
// import QrReader from "react-qr-reader";
const QRCodeScanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

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

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const scanQrCode = (imageSrc: any, callback: any) => {
    // const image = new Image();
    // image.src = file;
    // image.addEventListener("load", (e:any) => {
    //   console.log(
    //     "image on load, image.naturalWidth, image.naturalHeight",
    //     image.naturalWidth,
    //     image.naturalHeight
    //   );

    //   const canvas: HTMLCanvasElement = document.createElement("canvas"); // Creates a canvas object
    //   canvas.width = image.naturalWidth; // Assigns image's width to canvas
    //   canvas.height = image.naturalHeight; // Assigns image's height to canvas
    //   let context: CanvasRenderingContext2D | null;
    //   if (!(context = canvas.getContext("2d"))) {
    //     throw new Error(
    //       `2d context not supported or canvas already initialized`
    //     );
    //   }
    //   // const context:(CanvasRenderingContext2D | null) = canvas.getContext("2d") // Creates a contect object
    //   context.imageSmoothingEnabled = false;
    //   context?.drawImage(image, 0, 0); // Draws the image on canvas
    //   const imageData = context?.getImageData(
    //     0,
    //     0,
    //     image.naturalWidth,
    //     image.naturalHeight
    //   ); // Assigns image base64 string in jpeg format to a variable
    //   const code = jsQR(
    //     imageData?.data,
    //     image.naturalWidth,
    //     image.naturalHeight
    //   );

    //   console.log('code: ', code);
    //   if (code) {
    //     console.log("Found QR code", code);

    //     callback(code);
    //   }
    // });
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const { width, height } = image;

      // Tính toán kích thước mới cho hình ảnh và canvas
      const MAX_SIZE = 800; // Kích thước tối đa mới
      let newWidth = width;
      let newHeight = height;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          newWidth = MAX_SIZE;
          newHeight = (height / width) * MAX_SIZE;
        } else {
          newHeight = MAX_SIZE;
          newWidth = (width / height) * MAX_SIZE;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Vẽ hình ảnh mới lên canvas với kích thước đã tính toán
      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      const imageData = ctx.getImageData(0, 0, newWidth, newHeight).data;
      const code: QRCode | null = jsQR(imageData, newWidth, newHeight);

      if (code) {
        console.log('Mã QR code đã được phát hiện:', code.data);
      } else {
        console.log('Không tìm thấy mã QR code trong hình ảnh.');
      }
    };

  };
  useEffect(() => {
    if (preview) {
      scanQrCode(preview, (code: any) => {
        console.log("---------", code.data);
      });
    }
  }, [preview]);
  return (
    <div className="col-sm-4">
      <input type="file" onChange={onSelectFile} />
      {selectedFile && <img src={preview} style={{width:100, height:100}} />}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default QRCodeScanner;