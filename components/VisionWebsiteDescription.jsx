import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const VisionWebsiteDescription = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-4xl shadow-xl rounded-lg bg-white">
        <CardContent>
          <Typography variant="h4" component="h1" className="text-center text-orange-500 font-bold mb-4">
            Vision Diagnosis & Improvement
          </Typography>
          <Typography variant="body1" className="text-gray-700 leading-relaxed mb-6">
            Our website offers comprehensive tools for individuals with vision-related issues, helping diagnose and improve their sight.
          </Typography>
          
          {/* Needs Section */}
          <div className="mb-6">
            <Typography variant="h5" component="h2" className="text-orange-500 font-semibold mb-2">
              Needs of People Using Our Website
            </Typography>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Assess and improve blurred vision with tailored exercises.</li>
              <li>Diagnose color blindness and improve color recognition.</li>
              <li>Evaluate and enhance the visual field for better peripheral vision.</li>
            </ul>
          </div>

          {/* Special Features Section */}
          <div>
            <Typography variant="h5" component="h2" className="text-orange-500 font-semibold mb-2">
              Special Features of Our Website
            </Typography>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Interactive vision tests for clarity, color blindness, and visual field assessment.</li>
              <li>Customizable exercises for personalized vision improvement.</li>
              <li>Modern and consistent design with Material-UI integration.</li>
              <li>Dynamically adjustable elements for accurate field of vision tests.</li>
              <li>Progress tracking to monitor vision health over time.</li>
            </ul>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="contained" color="primary" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisionWebsiteDescription;
