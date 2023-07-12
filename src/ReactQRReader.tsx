import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
type ReactQRReaderProps = {};

const ReactQRReader: React.FC<ReactQRReaderProps> = () => {
  const [data, setData] = useState("No result");
  return (
    <div className="container">
      ReactQRReader
      <QrReader
        constraints={{ facingMode: "user" }}
        onResult={(result: any, error: any) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        containerStyle={{ width: "100%" }}
      />
      <p>{data}</p>
    </div>
  );
};

export default ReactQRReader;
