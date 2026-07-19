// AnimatedLinks.js
"use client"; // This ensures Framer Motion is used on the client

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnimatedLinks() {
  return (
    <div className="mt-8 space-y-4">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:bg-blue-600"
      >
        <Link href="/blur/improve" passHref>
          Improve Blur
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:bg-green-600"
      >
        <Link href="/blur/diagnosis" passHref>
          Diagnosis Blur
        </Link>
      </motion.div>
    </div>
  );
}
