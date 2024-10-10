"use client";

import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const VisionImprovementHub = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        className="w-full max-w-4xl shadow-lg backdrop-blur-sm bg-white/50" // Added backdrop-blur and semi-transparent background
        style={{
          backdropFilter: "blur(10px)", // Applies the blur effect
          backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
        }}
      >
        <CardContent>
          <Typography variant="h4" className="text-center text-gray-800 mb-4">
            Vision Diagnosis and Improvement
          </Typography>
          <Typography variant="body1" className="text-center text-gray-600 mb-8">
            Our platform offers various options to test and improve your vision,
            focusing on blurred vision, color blindness, and visual field
            assessment.
          </Typography>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Button
              variant="contained"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                marginBottom: { xs: '16px', sm: 0 },
                marginRight: { sm: '16px' },
                backgroundColor: '#FBBF24', // צהוב מקביל ל-yellow-400
                '&:hover': {
                  backgroundColor: '#F59E0B', // גוון כהה יותר לhover
                },
              }}
              onClick={() => router.push("/blur")}
            >
              Blurred Vision Test
            </Button>
            <Button
              variant="contained"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                marginBottom: { xs: '16px', sm: 0 },
                marginRight: { sm: '16px' },
                backgroundColor: '#FB923C', // כתום מקביל ל-orange-400
                '&:hover': {
                  backgroundColor: '#F97316', // גוון כהה יותר לhover
                },
              }}
              onClick={() => router.push("/color")}
            >
              Color Blindness Test
            </Button>
            <Button
              variant="contained"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: '#0D9488', // טיל מקביל ל-teal-600
                '&:hover': {
                  backgroundColor: '#0F766E', // גוון כהה יותר לhover
                },
              }}
              onClick={() => router.push("/field")}
            >
              Visual Field Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisionImprovementHub;
