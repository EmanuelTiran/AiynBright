import { NextResponse } from 'next/server';
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const response = await fetch(
      'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jerusalem'
    );
    const data = await response.json();
    return res.status(200).json({
      time: data.dateTime || new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch time' });
  }
}