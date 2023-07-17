// @ts-check

import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.tsx';
import ResultContainerPlugin from './ResultContainerPlugin.tsx';

const App = () => {
    const [decodedResults, setDecodedResults] = useState([]);
    const [decodedText, setDecodedText] = useState('');
    const onNewScanResult = (decodedText:any, decodedResult:any) => {
        console.log("App [result]", decodedResult);
        setDecodedResults(decodedResult);
        setDecodedText(decodedText)
    };

    return (
        <div className="App">
            <section className="App-section">
                <br />
                <br />
                {decodedText}
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                />
                <ResultContainerPlugin results={decodedResults} />
            </section>
        </div>
    );
};

export default App;
