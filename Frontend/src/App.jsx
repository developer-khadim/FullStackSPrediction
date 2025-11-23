import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import Home from './pages/Home';
import Predictors from './pages/Predictors';
import Aboutus from './pages/Aboutus';
import Navbar from './components/Navbar';
import SausPre from './pages/SausPre';


const App = () => {
  return (
    <Router>
    
        <Navbar/>
        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predictors" element={<Predictors />} />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/SausPre" element={<SausPre />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-indigo-700 text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Developed with ❤️ by Khadim Ali. All rights reserved.</p>
          </div>
        </footer>
   
    </Router>
  );
};

export default App;