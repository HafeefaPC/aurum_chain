"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const titleControls = useAnimation();
  const [bgColor, setBgColor] = useState("bg-yellow-400");
  const [textColor, setTextColor] = useState("text-black");

  useEffect(() => {
    const animateColors = async () => {
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setBgColor("bg-black");
        setTextColor("text-yellow-400");
        await new Promise(resolve => setTimeout(resolve, 100));
        setBgColor("bg-yellow-400");
        setTextColor("text-black");
      }
      setBgColor("bg-black");
      setTextColor("text-yellow-400");
    };

    const animateTitle = async () => {
      await titleControls.start({ scale: [1, 1.1, 0.9, 1.05, 1], transition: { duration: 0.5 } });
    };

    animateColors();
    animateTitle();
  }, [titleControls]);

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center`}>
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      >
        <div className="relative">
          <motion.h1
            animate={titleControls}
            className={`text-8xl font-bold ${textColor}`}
            style={{
              fontFamily: "'Goldman', sans-serif",
            }}
          >
            CHRYSUS
          </motion.h1>
        </div>
        <motion.p
          className={`text-xl ${textColor} mt-4 italic font-light tracking-wide`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Because nothing says &apos;trust&apos; like onchain tracked bling ✨
        </motion.p>
      </motion.header>

      <motion.footer
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      ></motion.footer>
    </div>
  );
};

export default Home;
