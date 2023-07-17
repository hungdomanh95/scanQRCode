import React, { useEffect, useRef, useState } from 'react';
import  html5QrCode, { Html5QrcodeSupportedFormats }  from 'html5-qrcode';
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
  const [file, setFile] = useState();
  function handleChange(e:any) {
      console.log(e.target.files);
      // setFile(URL.createObjectURL(e.target.files[0]));
  }

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
      <input type="file" onChange={handleChange} />
    </div>
  );
};

export default QRCodeScanner;
