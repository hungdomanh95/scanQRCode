import React from 'react'
import ReactQRReader from './ReactQRReader';

type AppProps = {};

const App:React.FC<AppProps> = () => {
  return (
    <div className='container'>
      App
      <ReactQRReader/>
    </div>
  )
}

export default App
