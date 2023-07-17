import {
  Html5QrcodeScanType,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region_hung";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: any) => {
  let config = {
    fps: null,
    qrbox: null,
    aspectRatio: null,
    disableFlip: null,
    formatsToSupport: [
    //   Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
    ],
    showZoomSliderIfSupported: true,
    defaultZoomValueIfSupported: 2,
    willReadFrequently: true,
    useBarCodeDetectorIfSupported: true,
    focusMode: "continuous",
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_FILE],
  };
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props: any) => {
  useEffect(() => {
    // when component mounts
    const config: any = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} style={{width:600}} />;
};

export default Html5QrcodePlugin;
