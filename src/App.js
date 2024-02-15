import React, { useState } from 'react';

const MODE = 'demo';

const OPTIONS = {
  demo: {
    url: 'https://demo.api4ai.cloud/ocr/v1/results',
    headers: { 'A4A-CLIENT-APP-ID': 'sample' }
  },
  rapidapi: {
    url: 'https://ocr43.p.rapidapi.com/v1/results',
    headers: { 'X-RapidAPI-Key': '' } // Your RapidAPI key goes here
  }
};

function App() {
  const [rawResponse, setRawResponse] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProcessing(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const requestOptions = {
        method: 'POST',
        body: formData,
        headers: OPTIONS[MODE].headers
      };
      const response = await fetch(OPTIONS[MODE].url, requestOptions);
      const data = await response.json();
      setRawResponse(JSON.stringify(data, null, 2));
      setRecognizedText(data.results[0].entities[0].objects[0].entities[0].text);
    } catch (error) {
      console.error(error);
    }

    setProcessing(false);
  };

  return (
    <div className="container">
      <article style={{ marginTop: '0px', textAlign: 'center' }}>
        <h3>OCR API sample</h3>
        <p>This API processes images and performs Optical Character Recognition.</p>
      </article>
      <label htmlFor="file">Select image to upload
        <input type="file" id="file" name="file" onChange={handleFileChange} />
      </label>
      {processing && <h4 style={{ textAlign: 'center' }} aria-busy="true">Processing</h4>}
      <section id="sectionParsed" style={{ display: recognizedText ? 'block' : 'none' }}>
        <h4 style={{ textAlign: 'center' }}>Recognized Text</h4>
        <table style={{ margin: 'auto' }}>
          <tbody>
            {recognizedText.split('\n').map((line, index) => (
              <tr key={index}>
                <td>{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section id="sectionRaw" style={{ display: rawResponse ? 'block' : 'none' }}>
        <h4 style={{ textAlign: 'center' }}>Raw Response</h4>
        <table style={{ margin: 'auto' }}>
          <tbody>
            {rawResponse.split('\n').map((line, index) => (
              <tr key={index}>
                <td>{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
