"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Section = ({ title, children, color }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                // className={`w-full text-left bg-teal-600 text-white p-4 font-bold text-xl flex justify-between items-center`}
                className={`w-full text-left bg-${color} text-white p-4 font-bold text-xl flex justify-between items-center`}
            >
                {title}
                <svg
                    className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="p-4">{children}</div>
            </motion.div>
        </motion.div>
    );
};

const AboutPage = () => {
    return (
        <div className="min-h-screen  p-8">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-white mb-8 text-center"
                >
                    Emanuel Tiran And Joush Bloch
                </motion.h1>

                <Section title="My Story" color='yellow-400'>
                    <p className="text-gray-800 leading-relaxed">
                        My journey into the world of vision diagnosis and improvement is deeply personal. It all began when my child was born with cortical blindness. This life-changing event led me down a path that would not only transform my child's life but also become my life's mission. When faced with my child's diagnosis, I dove headfirst into understanding everything I could about vision disorders and potential treatments. Through intensive work and unwavering determination, we achieved what once seemed impossible - my child gained the ability to see objects and identify shapes.
                    </p>
                </Section>

                <Section title="My Mission" color='orange-500'>
                    <p className="text-gray-800 leading-relaxed">
                        This amazing progress ignited a passion within me that I knew I had to share with the world. While it's not my clinical profession, it has become the driving force of my life. I've dedicated countless hours to research, learning, and developing techniques to help people with various vision impairments. My approach is rooted in personal experience and fueled by the joy of witnessing progress. I understand the challenges, fears, and hopes that come with vision impairments because I've lived them.
                    </p>
                </Section>

                <Section title="Our Services" color='gray-800'>
                    <p className="text-gray-800 leading-relaxed mb-4">
                        Through this website, I aim to share knowledge, offer support, and provide hope to those facing similar challenges. Whether you're a parent of a child with vision impairments, an individual struggling with your own vision issues, or simply someone interested in vision health, you'll find resources here to assist you on your journey.
                    </p>
                    <ul className="list-disc list-inside text-gray-800 space-y-2">
                        <li>Diagnosis and treatment of blurred vision</li>
                        <li>Understanding and managing color blindness</li>
                        <li>Techniques for improving visual field</li>
                    </ul>
                </Section>

                <Section title="Join the Journey" color='teal-600'>
                    <p className="text-gray-800 leading-relaxed mb-4">
                        Remember, progress is possible. My child's journey is a testament to that. While every case is unique, and results may vary, I believe in the power of dedication, knowledge, and never giving up hope. I'm not here just to share information - I'm here to share a vision of possibility. Let's work together to harness the potential of your vision or that of your loved ones. Your journey towards clearer sight begins here, and I'm honored to be a part of it.
                    </p>
                    <Link className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
                        href={`mailto:eatiran39@gmail.com?subject=אני מעוניין להצטרף למסע&body=שלום,%20"`}> Contact Us Now</Link>
                </Section>
            </div>
        </div>
    );
};

export default AboutPage;