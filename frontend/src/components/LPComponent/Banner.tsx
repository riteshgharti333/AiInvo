import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import {
  HiArrowRight,
  HiBadgeCheck,
  HiPlay,
  HiSparkles,
  HiLightningBolt,
  HiDocumentDownload,
  HiBell,
  HiDeviceMobile,
  HiDocumentText,
  HiClipboardList,
  HiCurrencyDollar,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const Banner = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prompts = [
    {
      text: "Create an invoice for Suresh...",
      customer: "Suresh Kumar",
      service: "Web Development",
      amount: "₹15,000",
      gst: "₹2,700",
      total: "₹17,700",
    },
    {
      text: "Invoice Rahul for Website Design...",
      customer: "Rahul Sharma",
      service: "Website Design",
      amount: "₹25,000",
      gst: "₹4,500",
      total: "₹29,500",
    },
    {
      text: "Make quotation for Ruchi web design 50% discount...",
      customer: "Ruchi Verma",
      service: "Web Design (50% OFF)",
      amount: "₹12,500",
      gst: "₹2,250",
      total: "₹14,750",
    },
  ];

  const typePrompt = (text: string) => {
    // Clear any existing intervals
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTypedText("");
    setShowInvoice(false);
    setIsProcessing(false);

    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.substring(0, index + 1));
        index++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        // Start processing
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(true);
          timeoutRef.current = setTimeout(() => {
            setIsProcessing(false);
            setShowInvoice(true);
          }, 1800);
        }, 600);
      }
    }, 50);
  };

  // Auto-typing and animation loop
  useEffect(() => {
    // Start initial typing
    typePrompt(prompts[0].text);

    // Cycle through prompts
    cycleIntervalRef.current = setInterval(() => {
      setCurrentPrompt((prev) => {
        const next = (prev + 1) % prompts.length;
        return next;
      });
    }, 6500);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Restart typing when prompt changes
  useEffect(() => {
    if (currentPrompt > 0) {
      const text = prompts[currentPrompt].text;
      typePrompt(text);
    }
  }, [currentPrompt]);

  const highlights = [
    { icon: HiSparkles, label: "AI-Powered Generation" },
    { icon: HiDocumentText, label: "Invoice Management" },
    { icon: HiClipboardList, label: "Quotation Management" },
    { icon: HiBell, label: "Real-time Notifications" },
    { icon: HiDeviceMobile, label: "Auto Alerts (Email & WhatsApp)" },
    { icon: HiDocumentDownload, label: "Instant PDF Generation" },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-20">
      {/* Tailwind Animations */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes typing-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-cursor {
          animation: typing-cursor 1s step-end infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-[0.04] blur-3xl bg-[radial-gradient(circle,#6366f1,transparent_70%)] translate-x-[30%] -translate-y-[30%]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl bg-[radial-gradient(circle,#8b5cf6,transparent_70%)] -translate-x-[20%] translate-y-[20%]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
            >
              <HiSparkles className="w-4 h-4" />
              <span>AI-Powered Invoice Generator</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-gray-900">Invoices, generated</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  by simply asking.
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full opacity-20 bg-gradient-to-r from-blue-600 to-purple-600" />
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 text-gray-600">
              Describe the invoice you need in plain English. Our AI handles the
              rest — generating professional invoices, calculating GST, and
              sending automated reminders via email & WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
              <a
                href="https://github.com/riteshgharti333/invoice-ready"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaGithub className="w-4 h-4" />
                  View on GitHub
                  <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>

              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <HiPlay className="w-3 h-3" />
                </span>
                View Demo
              </Link>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center lg:justify-start">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-300 cursor-default bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-gray-900 hover:-translate-y-0.5"
                >
                  <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - AI Command Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.3,
            }}
            className="relative max-w-lg mx-auto lg:max-w-none w-full"
          >
            {/* AI Command Bar */}
            <div className="relative z-20">
              <div className="animate-pulse-glow bg-white backdrop-blur-xl rounded-2xl border border-gray-200 shadow-2xl shadow-blue-500/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <HiSparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-gray-900 font-mono">
                      {typedText}
                      <span className="typing-cursor text-blue-600">|</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <HiArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {isProcessing && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>AI is generating your invoice...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Preview */}
            <AnimatePresence>
              {showInvoice && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative z-10 -mt-4"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 ml-4 mr-4 sm:ml-8 sm:mr-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Invoice
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          INV-2024-AI-089
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Due Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Sep 25, 2024
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <p className="text-xs text-gray-400 font-medium">
                        Bill To
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {prompts[currentPrompt].customer}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {prompts[currentPrompt].service}
                        </span>
                        <span className="font-medium text-gray-900">
                          {prompts[currentPrompt].amount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">GST (18%)</span>
                        <span className="font-medium text-gray-900">
                          {prompts[currentPrompt].gst}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">
                        Total
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {prompts[currentPrompt].total}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-20 blur-xl animate-float-slow" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full opacity-20 blur-xl animate-float-medium" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
