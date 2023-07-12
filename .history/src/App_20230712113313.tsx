import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Html5Qrcode } from "html5-qrcode";
function App() {
  const [decodedText, setDecodedText] = useState<any>(undefined)
  const [decodedResult, setDecodedResult] = useState<any>(undefined)
  const html5QrCode = new Html5Qrcode(/* element id */ "reader");
  html5QrCode
    .start(
      "",
      {
        fps: 10, // Optional, frame per seconds for qr code scanning
        qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
      },
      (decodedText: any, decodedResult: any) => {
        setDecodedText(decodedText)
        setDecodedResult(decodedResult)
        // do something when code is read
      },
      (errorMessage: any) => {
        // parse error, ignore it.
      }
    )
    .catch((err: any) => {
      // Start failed, handle it.
    });

  return (
    <>
     {decodedText}
     {decodedResult}
    </>
  );
}

export default App;
