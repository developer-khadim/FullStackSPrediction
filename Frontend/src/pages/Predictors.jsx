import React from 'react'
import { Link } from 'react-router-dom'


const Predictors = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] w-full text-black">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Page heading */}
        <header className="mb-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            SAUS Predictions
          </h1>
          <p className="text-sm sm:text-base text-black max-w-2xl mx-auto">
            Run your campus images through the Smart Campus Space Classification
            model and instantly detect classrooms, labs, offices, grounds, and
            other university spaces.
          </p>
        </header>

        {/* Centered card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="flex justify-center">
              <img
                src="https://saus.edu.pk/wp-content/uploads/2023/02/Shaikh-Ayaz-Uni-Logo.jpg"
                alt="SAUS logo"
                className="h-28 w-28 object-contain rounded-xl bg-white/5 p-2"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                SAUS<span className="text-indigo-600"> Predictor</span>
              </h2>
              <p className="text-sm text-black">
                Deep-learning powered recognition of university spaces from a
                single image.
              </p>
            </div>

            <ul className="text-xs text-black space-y-1 text-left sm:text-center sm:list-none list-disc list-inside">
              <li>Upload a campus photo and get the most likely space type.</li>
              <li>View model confidence for each predicted category.</li>
              <li>Use results to support mapping, planning, and navigation.</li>
            </ul>

            <Link to="/SausPre" className="mt-2 inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-400 transition-colors">
              Open Image Predictor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predictors
