import React, { useEffect, useRef, useState } from "react";
import html5QrCode, { Html5QrcodeSupportedFormats } from "html5-qrcode";
import jsQR from "jsqr";
import { BrowserQRCodeReader } from '@zxing/browser';
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

  const scanQrCode = (file: any, callback: any) => {
    const image = new Image();
    image.src = file;
    image.addEventListener("load", (e:any) => {
      console.log(
        "image on load, image.naturalWidth, image.naturalHeight",
        image.naturalWidth,
        image.naturalHeight
      );

      const canvas: HTMLCanvasElement = document.createElement("canvas"); // Creates a canvas object
      canvas.width = image.naturalWidth; // Assigns image's width to canvas
      canvas.height = image.naturalHeight; // Assigns image's height to canvas
      let context: CanvasRenderingContext2D | null;
      if (!(context = canvas.getContext("2d"))) {
        throw new Error(
          `2d context not supported or canvas already initialized`
        );
      }
      // const context:(CanvasRenderingContext2D | null) = canvas.getContext("2d") // Creates a contect object
      context.imageSmoothingEnabled = false;
      context?.drawImage(image, 0, 0); // Draws the image on canvas
      const imageData = context?.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      ); // Assigns image base64 string in jpeg format to a variable
      const code = jsQR(
        imageData?.data,
        image.naturalWidth,
        image.naturalHeight
      );

      console.log('code: ', code);
      if (code) {
        console.log("Found QR code", code);

        callback(code);
      }
    });


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
      <canvas ref={canvasRef}></canvas>;
    </div>
  );
};

export default QRCodeScanner;