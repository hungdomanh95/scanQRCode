import React, { useEffect, useRef, useState } from "react";
import html5QrCode, { Html5QrcodeSupportedFormats } from "html5-qrcode";
import jsQR from "jsqr";
// import QrReader from "react-qr-reader";
const QRCodeScanner: React.FC = () => {
  // const qrRef = useRef<any>();
  // const [fileScan, setFileScan] = useState();
  // const fileError = (error:any) => {
  //   console.log('error: ', error);
  //   if (error) {
  //     console.info(error);
  //   }
  // };
  // const scanFile = (result:any) => {
  //   console.log('result: ', result);
  //   setFileScan(result);
  //   if (result) {
  //     setFileScan(result);
  //   }
  // };
  // const handleClick = () => {
  //   qrRef?.current?.openImageDialog();
  // };
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

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const scanQrCode = (file: any, callback: any) => {
    console.log("===");
    const image = new Image();
    console.log('image: ', image);
    image.src = file;
    console.log('file.content: ', file);
    image.addEventListener("load", (e:any) => {
      console.log(
        "image on load, image.naturalWidth, image.naturalHeight",
        image.naturalWidth,
        image.naturalHeight
      );

      const canvas: HTMLCanvasElement = document.createElement("canvas"); // Creates a canvas object
      console.log('canvas: ', canvas);
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
      context?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight); // Draws the image on canvas
      console.log('context: ', context);

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
      {/* <div className="card">
        <div className="card-header">
          <button className="btn btn-warning" onClick={handleClick}>
            <h5>Scan QR Code from File</h5>
          </button>
        </div>
        <div className="card-body text-start">
          <QrReader
            ref={qrRef}
            delay={300}
            onError={fileError}
            onScan={scanFile}
            style={{ width: "100%" }}
            legacyMode={true}
          />
          <h6>Scan Result:{fileScan}</h6>
        </div>
      </div> */}
      <input type="file" onChange={onSelectFile} />
      {selectedFile && <img src={preview} />}
    </div>
  );
};

export default QRCodeScanner;
