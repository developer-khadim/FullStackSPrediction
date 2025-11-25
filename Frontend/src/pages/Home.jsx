import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div
      id="bg-img"
      className="min-h-[calc(100vh-120px)] w-full flex items-center justify-center px-4"
    >
      <div className="max-w-4xl w-full text-center space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-100 animate-pulse"></span>
          Smart Academic & University Spaces
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Smart Campus
            <span className="block text-indigo-400 ">
              Space Classification
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Deep-Learning powered recognition of university spaces. Upload images and instantly 
            identify classrooms, labs, offices, and outdoor areas.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/predictors"
            className="px-8 py-3.5 bg-indigo-500 text-white rounded-full font-semibold text-base hover:bg-transparent hover:border-indigo-500 hover:border-2 transition-all shadow-2xl "
          >
            Start Predicting
          </Link>
          <a
            href="https://drive.google.com/file/d/1rFdlK2guEJAM_V9ILnEwJH0SMfpWoqW2/view?usp=sharing"
            target='_blank'
            className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-base hover:bg-indigo-500 transition-all ring-1 ring-white/20"
          >
            View Report
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">6+</div>
            <div className="text-sm">Space Categories</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">MobileNetV2</div>
            <div className="text-sm">Deep Learning Model</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">Real-time</div>
            <div className="text-sm">Predictions</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
    