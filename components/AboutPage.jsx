"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const SECTION_COLORS = {
  story: "bg-yellow-400",
  mission: "bg-orange-500",
  services: "bg-gray-800",
  journey: "bg-teal-600",
};

const COPY = {
  story:
    "My journey into the world of vision diagnosis and improvement is deeply personal. It all began when my child was born with cortical blindness. This life-changing event led me down a path that would not only transform my child's life but also become my life's mission. When faced with my child's diagnosis, I dove headfirst into understanding everything I could about vision disorders and potential treatments. Through intensive work and unwavering determination, we achieved what once seemed impossible — my child gained the ability to see objects and identify shapes.",
  mission:
    "This amazing progress ignited a passion within me that I knew I had to share with the world. While it's not my clinical profession, it has become the driving force of my life. I've dedicated countless hours to research, learning, and developing techniques to help people with various vision impairments. My approach is rooted in personal experience and fueled by the joy of witnessing progress. I understand the challenges, fears, and hopes that come with vision impairments because I've lived them.",
  services:
    "Through this website, I aim to share knowledge, offer support, and provide hope to those facing similar challenges. Whether you're a parent of a child with vision impairments, an individual struggling with your own vision issues, or simply someone interested in vision health, you'll find resources here to assist you on your journey.",
  journey:
    "Remember, progress is possible. My child's journey is a testament to that. While every case is unique, and results may vary, I believe in the power of dedication, knowledge, and never giving up hope. I'm not here just to share information — I'm here to share a vision of possibility. Let's work together to harness the potential of your vision or that of your loved ones. Your journey towards clearer sight begins here, and I'm honored to be a part of it.",
};

function Section({ title, children, color }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mb-8 overflow-hidden rounded-lg bg-white shadow-lg"
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between p-4 text-left text-xl font-bold text-white ${SECTION_COLORS[color]}`}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {title}

        <svg
          className={`h-6 w-6 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <motion.div
        id={contentId}
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
        aria-hidden={!isOpen}
      >
        <div className="p-4">{children}</div>
      </motion.div>
    </motion.section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center text-4xl font-bold text-white"
        >
          Emanuel Tiran and Josh Bloch
        </motion.h1>

        <Section title="My Story" color="story">
          <p className="leading-relaxed text-gray-800">{COPY.story}</p>
        </Section>

        <Section title="My Mission" color="mission">
          <p className="leading-relaxed text-gray-800">{COPY.mission}</p>
        </Section>

        <Section title="Our Services" color="services">
          <p className="mb-4 leading-relaxed text-gray-800">
            {COPY.services}
          </p>

          <ul className="list-inside list-disc space-y-2 text-gray-800">
            <li>Diagnosis and treatment of blurred vision</li>
            <li>Understanding and managing color blindness</li>
            <li>Techniques for improving visual field</li>
          </ul>
        </Section>

        <Section title="Join the Journey" color="journey">
          <p className="mb-4 leading-relaxed text-gray-800">
            {COPY.journey}
          </p>

          <Link
            className="rounded bg-purple-600 px-4 py-2 text-white transition duration-300 hover:bg-purple-700"
            href="mailto:eatiran39@gmail.com?subject=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3%20%D7%9C%D7%9E%D7%A1%D7%A2&body=%D7%A9%D7%9C%D7%95%D7%9D%2C%20"
          >
            Contact Us Now
          </Link>
        </Section>
      </div>
    </main>
  );
}