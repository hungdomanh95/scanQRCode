// // @ts-check

// import React, { useState } from 'react';
// import './App.css';
// import Html5QrcodePlugin from './Html5QrcodePlugin.tsx';
// import ResultContainerPlugin from './ResultContainerPlugin.tsx';

// const App = () => {
//     const [decodedResults, setDecodedResults] = useState([]);
//     const [decodedText, setDecodedText] = useState('');
//     const onNewScanResult = (decodedText:any, decodedResult:any) => {
//         console.log("App [result]", decodedResult);
//         setDecodedResults(decodedResult);
//         setDecodedText(decodedText)
//     };

//     return (
//         <div className="App">
//             <section className="App-section">
//                 <br />
//                 <br />
//                 {decodedText}
//                 <Html5QrcodePlugin
//                     fps={10}
//                     qrbox={250}
//                     disableFlip={false}
//                     qrCodeSuccessCallback={onNewScanResult}
//                 />
//                 <ResultContainerPlugin results={decodedResults} />
//             </section>
//         </div>
//     );
// };

// export default App;
import { Html5Qrcode } from "html5-qrcode";
import { ChangeEvent, useEffect, useRef, useState } from "react";
const qrcodeRegionId = "html5qr-code-full-region";

const App = () => {
  const [imageSrc, setImageSrc] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [qrCodeData, setQRCodeData] = useState<any>(null);

  const [typeImgUp, setTypeImgUp] = useState<any>(null);
  const [typeImgConvert, setTypeImgConvert] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setTypeImgUp(file?.type)
    if (file) {
        setPreviewImage(file)
      setImageSrc(URL.createObjectURL(file));
      setQRCodeData(null);
    }
  };

  useEffect(() => {
    const processImage = async () => {
      if (!previewImage) return;

      const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
      html5Qrcode.scanFileV2(previewImage, true)
      .then((data:any) => {
        // success, use decodedText
        setQRCodeData(data?.decodedText);
        // console.log(decodedText);
      })
      .catch(err => {
        // failure, handle it.
        console.log(`Error scanning file. Reason: ${err}`)
      });

    //   try {
    //       const qrCodeData = await html5Qrcode.scanFileV2(previewImage, true);
    //       console.log('qrCodeData: ', qrCodeData);
    //       setQRCodeData(qrCodeData);
    //       html5Qrcode.clear();
    //   } catch (error:any) {
    //     console.error('Lỗi xử lý mã QR code:', error);
    //     setQRCodeData(error?.message || 'Đã xảy ra lỗi khi xử lý ảnh.');
    //   } finally {
    //     html5Qrcode.clear();
    //     // URL.revokeObjectURL(imageSrc);
    //   }
    };

    processImage();
  }, [previewImage]);

//   useEffect(()=>{
//     const canvas = document.createElement('canvas');
//     const ctx = canvas?.getContext('2d')!;
//     if (!canvas || !ctx || !imageSrc) return;
//     const image = new Image();
//     image.src = imageSrc

//     image.onload = () => {
//       const { width, height } = image;

//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(image, 0, 0);
//       canvas.toBlob((blob:any) => {
//         let file = new File([blob], "fileName.png", { type: "image/png" })
//         // setTypeImage(`${URL.revokeObjectURL(imageSrc).type} ${file.type}`)
//         setTypeImgConvert(file?.type)
//         setPreviewImage(file);
//       }, 'image/png');
//     }
//   },[imageSrc])

  const handleScanButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div>
          {previewImage && (
            <div style={{height:"auto"}}>
                <img src={URL.createObjectURL(previewImage)} alt="Uploaded" style={{height:300}} />
                <div style={{textAlign:"center"}} >{typeImgUp + ' -> ' + typeImgConvert}</div>
                <div id={qrcodeRegionId}/>
            </div>
          )}

          <input
            type="file"
            accept="image/png, image/jfif, image/jpeg, image/jpg, image/pjpeg, image/pjp"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button onClick={handleScanButtonClick}>Choose Image</button>
          {qrCodeData}
          {/* { previewImage && <p>{qrCodeData ? qrCodeData : "Đang quét mã QR code..."}</p> } */}
    </div>
  );
};

export default App;
