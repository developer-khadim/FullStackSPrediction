import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Predictors from './pages/Predictors';
import Aboutus from './pages/Aboutus';
import Navbar from './components/Navbar';
import SausPre from './components/SausPre';
import SignIn from './pages/SignIn';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';



const App = () => {
  return (
    <Router>
    
        <Navbar/>
        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/predictors"
              element={
                <ProtectedRoute>
                  <Predictors />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<Aboutus />} />
            <Route
              path="/SausPre"
              element={
                <ProtectedRoute>
                  <SausPre />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
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