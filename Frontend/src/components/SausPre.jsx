import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { X } from 'lucide-react';
import { predictSausage } from '../API/API';

ChartJS.register(ArcElement, Tooltip, Legend);

const SausPre = ({ onClose, imagePreview, selectedImage }) => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedImage) predictImage();
  }, [selectedImage]);

  const predictImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictSausage(selectedImage);
      setPredictionData(data);
    } catch (err) {
      setError(err.message || 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const popupClass =
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md px-4 py-10 transition-all duration-300";

  const renderShell = (content) => (
    <div className={popupClass} onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white/90 shadow-2xl ring-1 ring-black/10 p-6 space-y-4 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        {content}
      </div>
    </div>
  );


  if (loading) {
    return renderShell(
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-indigo-500/80 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white animate-ping" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200 animate-spin" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Analyzing Image</h3>
          <p className="text-sm text-slate-500 mt-1">Hang tight while we inspect every detail.</p>    
        </div>
        <div className="w-full">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-progress-bar rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return renderShell(
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <X className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">We hit a snag</h3>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
          <button
            onClick={predictImage}
            className="flex-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!predictionData) return null;

  const colors = ['#6366f1', '#8b5cf6', '#f472b6'];
  const { top_3_predictions = [], confidence = 0, predicted_class } = predictionData;
  const sortedPredictions = [...top_3_predictions].sort(
    (a, b) => b.confidence - a.confidence
  );
  if (predicted_class) {
    const idx = sortedPredictions.findIndex(
      (pred) => pred.class === predicted_class
    );
    if (idx > 0) {
      const [match] = sortedPredictions.splice(idx, 1);
      sortedPredictions.unshift(match);
    }
  }
  const total = sortedPredictions.reduce((sum, { confidence }) => sum + confidence, 0) || 1;

  const statsData = sortedPredictions.map((pred, index) => {
    const percentage = ((pred.confidence / total) * 100).toFixed(0);
    return {
      label: pred.class,
      raw: pred.confidence,
      percentLabel: `${percentage}%`,
      percentValue: Number(percentage),
      color: colors[index] || '#c4b5fd'
    };
  });

  const chartData = {
    labels: statsData.map((stat) => stat.label),
    datasets: [
      {
        data: statsData.map((stat) => stat.raw),
        backgroundColor: statsData.map((stat) => stat.color),
        borderWidth: 0,
        hoverOffset: 6,
        cutout: '70%'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 12,
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 12 }
      }
    }
  };

  return (
    <div className={popupClass} onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">SAUS predictor</p>
            <h2 className="text-lg font-semibold">Results</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/15 p-2 hover:bg-white/25 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {imagePreview && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 flex flex-col gap-3 items-center">
                <img
                  src={imagePreview}
                  alt="Analyzed sausage"
                  className="w-full h-40 object-cover rounded-2xl"
                />
                <div className="text-center">
                  <p className="text-xs text-slate-500">Uploaded image</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">{(confidence * 100).toFixed(0)}%</p>
                  <p className="text-xs text-slate-500">Model confidence</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-100 bg-white p-4 flex flex-col items-center gap-3">
              <div className="relative w-40 h-40">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-sm text-slate-600">
                  <span>Top class</span>
                  <span className="font-semibold text-slate-900">
                    {predicted_class || statsData[0]?.label || '—'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Hover to view class shares.</p>
            </div>
          </div>

          {statsData.length > 0 && (
            <div className="space-y-3">
              {statsData.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                      {stat.label}
                    </span>
                    <span className="text-slate-500">{stat.percentLabel}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white shadow-inner mt-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${stat.percentValue}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-full bg-indigo-600 text-white py-3 text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SausPre;

