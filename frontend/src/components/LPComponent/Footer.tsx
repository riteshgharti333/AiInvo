import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiHeart } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/riteshgharti333",
      label: "GitHub",
    },
    {
      icon: FaGlobe,
      href: "https://rgdev-portfolio-six.vercel.app/",
      label: "Portfolio",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/riteshgharti333",
      label: "LinkedIn",
    },
  ];

  return (
   <footer className="relative bg-[#111827] overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large blob - top right */}
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl"
        />

        {/* Medium blob - bottom left */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-500/25 blur-3xl"
        />

        {/* Small blob - center right */}
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/3 -right-20 w-[350px] h-[350px] rounded-full bg-cyan-400/20 blur-3xl"
        />

        {/* Small blob - bottom right */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
          className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-400/20 blur-3xl"
        />

        {/* Extra small blob - top left */}
        <motion.div
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/4 -left-20 w-[250px] h-[250px] rounded-full bg-white/15 blur-3xl"
        />

        {/* Center glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.1, 0.15, 0.1, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-300/15 blur-3xl"
        />

        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 text-center">
          {/* Logo */}
          <motion.a
            href="#"
            className="inline-flex items-center justify-center mb-4"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <img
              src="/logo.webp"
              alt="AiInvo - AI-powered invoicing"
              className="w-auto h-12 md:h-16 object-contain"
            />
          </motion.a>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm leading-relaxed mb-8 max-w-md mx-auto text-white/70"
          >
            Create professional invoices and quotations with AI. Simply describe
            what you need in one prompt, and AiInvo does the rest.
          </motion.p>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-1 mb-8"
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/dashboard"
              className="px-3 py-1.5 text-sm rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
            >
              View Demo
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 border border-white/20 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="w-full max-w-md mx-auto mb-6 border-t border-white/10" />

          {/* Copyright & Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-white/50"
          >
            <span>© {currentYear} AiInvo. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1">
              Made with
              <HiHeart className="w-3.5 h-3.5 text-red-400" />
              by Ritesh Gharti
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
