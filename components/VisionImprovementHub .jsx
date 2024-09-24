"use client"

import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const VisionImprovementHub = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent>
          <Typography variant="h4" className="text-center text-gray-800 mb-4">
            Vision Diagnosis & Improvement
          </Typography>
          <Typography variant="body1" className="text-center text-gray-600 mb-8">
            Our platform offers various options to test and improve your vision,
            focusing on blurred vision, color blindness, and visual field
            assessment.
          </Typography>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Button
              variant="contained"
              color="primary"
              className="w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4"
              onClick={() => router.push("/blur")}
            >
              Blurred Vision Test
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4"
              onClick={() => router.push("/color")}
            >
              Color Blindness Test
            </Button>
            <Button
              variant="contained"
              color="success"
              className="w-full sm:w-auto"
              onClick={() => router.push("/field")}
            >
              Visual Field Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisionImprovementHub;
