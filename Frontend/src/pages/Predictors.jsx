import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import SausPre from '../components/SausPre';

const Predictors = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPredictor, setShowPredictor] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = () => {
    if (selectedImage) {
      setShowPredictor(true);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setShowPredictor(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleChooseDifferent = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full text-black">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Page heading */}
        <header className="mb-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SAUS Predictions
          </h1>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
            Run your campus images through the Smart Campus Space Classification
            model and instantly detect classrooms, labs, offices, grounds, and
            other university spaces.
          </p>
        </header>

        {/* Centered card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 shadow-2xl p-6 sm:p-8 space-y-5 text-center hover:shadow-indigo-200 transition-shadow">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-30 rounded-full"></div>
                <img
                  src="https://saus.edu.pk/wp-content/uploads/2023/02/Shaikh-Ayaz-Uni-Logo.jpg"
                  alt="SAUS logo"
                  className="h-28 w-28 object-contain rounded-xl bg-white p-2 border-2 border-indigo-200 shadow-lg relative z-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">
                SAUS<span className="text-indigo-600"> Predictor</span>
              </h2>
              <p className="text-sm text-gray-600">
                Deep-learning powered recognition of university spaces from a
                single image.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <ul className="text-xs text-gray-700 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">✓</span>
                  <span>Upload a campus photo and get the most likely space type.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">✓</span>
                  <span>View model confidence for each predicted category.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">✓</span>
                  <span>Use results to support mapping, planning, and navigation.</span>
                </li>
              </ul>
            </div>

            <button 
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-xl hover:-translate-y-0.5"
              onClick={() => setShowModal(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Open Image Predictor
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && !showPredictor && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-500 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              {/* Gradient Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl border-b-2 border-indigo-500 sticky top-0 z-10">
                <button 
                  onClick={resetModal}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h3 className="text-2xl font-bold text-white text-center pr-8 flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image for Prediction
                </h3>
              </div>
              
              {/* Modal body */}
              <div className="p-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-indigo-600">📸</span>
                    Select Campus Image
                  </label>
                  
                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50 scale-105'
                        : imagePreview
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {imagePreview ? (
                      <div className="space-y-4 text-center">
                        <div className="relative inline-block">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="mx-auto max-h-64 rounded-lg object-contain border-2 border-white shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-700">✓ Image uploaded successfully!</p>
                          <p className="text-xs text-gray-600 truncate max-w-xs mx-auto" title={selectedImage?.name}>
                            {selectedImage?.name}
                          </p>
                          <button
                            onClick={handleChooseDifferent}
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
                          >
                            Choose a different image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center">
                        <svg
                          className="mx-auto h-16 w-16 text-indigo-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-700 font-medium mb-2">
                            Drag and drop your image here
                          </p>
                          <p className="text-gray-500 text-sm mb-4">or</p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                          >
                            Browse Files
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePredict}
                    disabled={!selectedImage}
                    className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all shadow-lg ${
                      selectedImage 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedImage ? '🎯 Predict Now' : 'Select Image First'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Results Modal */}
        {showPredictor && (
          <SausPre 
            onClose={resetModal} 
            imagePreview={imagePreview} 
            selectedImage={selectedImage} 
          />
        )}
      </div>
    </div>
  );
};

export default Predictors;
