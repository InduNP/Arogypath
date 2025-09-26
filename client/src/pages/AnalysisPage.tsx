import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './AnalysisPage.css'; // We'll create this

const AnalysisPage: React.FC = () => {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [tongueImage, setTongueImage] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string>('');
  const [tonguePreview, setTonguePreview] = useState<string>('');
  
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'face' | 'tongue') => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageType === 'face') {
        setFaceImage(file);
        setFacePreview(URL.createObjectURL(file));
      } else {
        setTongueImage(file);
        setTonguePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async () => {
    if (!faceImage || !tongueImage) {
      setError('Please upload both images to proceed.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult('');

    const formData = new FormData();
    formData.append('faceImage', faceImage);
    formData.append('tongueImage', tongueImage);

    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      const token = storedUserInfo ? JSON.parse(storedUserInfo).token : null;
      if (!token) throw new Error('Authentication token not found.');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post('/api/analysis/image', formData, config);
      setAnalysisResult(data.analysis);

    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="analysis-container">
      <h2>Ayurvedic Wellness Analysis</h2>
      <p className="disclaimer">
        <strong>Disclaimer:</strong> This tool provides wellness suggestions based on Ayurvedic principles and is not a medical diagnosis. Consult a professional for any health concerns.
      </p>

      {!analysisResult ? (
        <div className="upload-section">
          <div className="upload-box">
            <label htmlFor="face-upload">Upload Face Image</label>
            <input id="face-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'face')} />
            {facePreview && <img src={facePreview} alt="Face Preview" className="preview-image" />}
          </div>
          <div className="upload-box">
            <label htmlFor="tongue-upload">Upload Tongue Image</label>
            <input id="tongue-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'tongue')} />
            {tonguePreview && <img src={tonguePreview} alt="Tongue Preview" className="preview-image" />}
          </div>
        </div>
      ) : null}
      
      {isLoading && <div className="loading-spinner">Analyzing Images...</div>}

      {!analysisResult && !isLoading && (
        <div className="analyze-button-container">
          <button onClick={handleSubmit} disabled={!faceImage || !tongueImage}>
            Analyze My Images
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {analysisResult && (
        <div className="analysis-result">
          <ReactMarkdown>{analysisResult}</ReactMarkdown>
          <button onClick={() => window.location.reload()} className="analyze-button-container">
            Start a New Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;