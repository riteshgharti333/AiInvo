import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiMenu, HiX, HiCode, HiPlay, HiExternalLink } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "about", label: "About", href: "#about" },
    { id: "features", label: "Features", href: "#features" },
    {
      id: "benefits",
      label: "Benefits",
      href: "#benefits",
    },
  ];

  const actionLinks = [
    {
      id: "github",
      label: "GitHub",
      icon: HiCode,
      href: "https://github.com/riteshgharti333/invoice",
      variant: "secondary",
      external: true,
    },
    {
      id: "demo",
      label: "View Demo",
      icon: HiPlay,
      href: "/dashboard",
      variant: "primary",
      external: false,
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: isScrolled
            ? "1px solid var(--color-border-light)"
            : "1px solid transparent",
          boxShadow: isScrolled ? "0 1px 3px rgba(0, 0, 0, 0.03)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-2 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-[72px]">
            {/* Logo Section */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <img
                src="/logo.webp"
                alt="AiInvo - AI-Powered Invoicing"
                className="w-auto h-13 sm:h-11 md:h-16 object-contain"
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              {/* Navigation Pills */}
              <div className="flex items-center p-1 rounded-xl bg-surface-hover/50">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    onClick={() => setActiveLink(link.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-4 py-2 text-sm font-bold flex items-center gap-1.5 rounded-lg transition-all duration-200"
                    style={{
                      color:
                        activeLink === link.id
                          ? "var(--color-brand)"
                          : "var(--color-text-secondary)",
                      backgroundColor:
                        activeLink === link.id ? "white" : "transparent",
                      boxShadow:
                        activeLink === link.id
                          ? "0 1px 3px rgba(0, 0, 0, 0.06)"
                          : "none",
                    }}
                  >
                    <span>{link.label}</span>
                    {activeLink === link.id && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 rounded-lg bg-white shadow-sm"
                        style={{ zIndex: -1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.a>
                ))}
              </div>

              {/* Subtle Separator */}
              <div className="w-[1px] h-5 mx-2 bg-border" />

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {actionLinks.map((link) => (
                  <motion.div key={link.id}>
                    {link.external ? (
                      <motion.a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onHoverStart={() => setHoveredAction(link.id)}
                        onHoverEnd={() => setHoveredAction(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                          link.variant === "primary"
                            ? "text-white shadow-sm"
                            : "text-text-secondary"
                        }`}
                        style={{
                          backgroundColor:
                            link.variant === "primary"
                              ? "var(--color-brand)"
                              : "transparent",
                          border:
                            link.variant === "secondary"
                              ? "1px solid var(--color-border)"
                              : "none",
                          boxShadow:
                            link.variant === "primary"
                              ? `0 2px 8px rgba(37, 99, 235, 0.2)`
                              : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (link.variant === "primary") {
                            e.currentTarget.style.backgroundColor = "#1d4ed8";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(37, 99, 235, 0.3)";
                          } else {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-surface-hover)";
                            e.currentTarget.style.borderColor =
                              "var(--color-brand-light)";
                            e.currentTarget.style.color = "var(--color-brand)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (link.variant === "primary") {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-brand)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px rgba(37, 99, 235, 0.2)";
                          } else {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.borderColor =
                              "var(--color-border)";
                            e.currentTarget.style.color =
                              "var(--color-text-secondary)";
                          }
                        }}
                      >
                        <motion.span
                          animate={{
                            rotate: hoveredAction === link.id ? 360 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <link.icon className="w-3.5 h-3.5" />
                        </motion.span>
                        <span>{link.label}</span>
                        {link.variant === "primary" && (
                          <motion.span
                            animate={{
                              x: hoveredAction === link.id ? 2 : 0,
                              opacity: hoveredAction === link.id ? 1 : 0.7,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <HiExternalLink className="w-3 h-3" />
                          </motion.span>
                        )}
                      </motion.a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setHoveredAction(null)}
                        onMouseEnter={() => setHoveredAction(link.id)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className={`relative px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                          link.variant === "primary"
                            ? "text-white shadow-sm"
                            : "text-text-secondary"
                        }`}
                        style={{
                          backgroundColor:
                            link.variant === "primary"
                              ? "var(--color-brand)"
                              : "transparent",
                          border:
                            link.variant === "secondary"
                              ? "1px solid var(--color-border)"
                              : "none",
                          boxShadow:
                            link.variant === "primary"
                              ? `0 2px 8px rgba(37, 99, 235, 0.2)`
                              : "none",
                        }}
                      >
                        <motion.span
                          animate={{
                            rotate: hoveredAction === link.id ? 360 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <link.icon className="w-3.5 h-3.5" />
                        </motion.span>
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -mr-2 rounded-xl transition-colors duration-200"
              style={{ color: "var(--color-text-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiX className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiMenu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderColor: "var(--color-border-light)",
              }}
            >
              <div className="px-6 py-4 space-y-1 max-w-7xl mx-auto">
                {/* Mobile Navigation Links */}
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setActiveLink(link.id);
                      setIsOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200"
                    style={{
                      color:
                        activeLink === link.id
                          ? "var(--color-brand)"
                          : "var(--color-text-secondary)",
                      backgroundColor:
                        activeLink === link.id
                          ? "var(--color-brand-light)"
                          : "transparent",
                    }}
                  >
                    <span className="font-medium">{link.label}</span>
                    {activeLink === link.id && (
                      <motion.div
                        layoutId="mobileIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand"
                      />
                    )}
                  </motion.a>
                ))}

                <div className="h-px my-3 bg-border-light" />

                {/* Mobile Action Buttons */}
                <div className="space-y-2 pt-1">
                  {actionLinks.map((link, index) => (
                    <motion.div key={link.id}>
                      {link.external ? (
                        <motion.a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            link.variant === "primary"
                              ? "text-white shadow-sm"
                              : "text-text-primary border"
                          }`}
                          style={{
                            backgroundColor:
                              link.variant === "primary"
                                ? "var(--color-brand)"
                                : "transparent",
                            borderColor:
                              link.variant === "secondary"
                                ? "var(--color-border)"
                                : "transparent",
                            boxShadow:
                              link.variant === "primary"
                                ? "0 2px 8px rgba(37, 99, 235, 0.2)"
                                : "none",
                          }}
                        >
                          <link.icon className="w-4 h-4" />
                          <span>{link.label}</span>
                          {link.variant === "primary" && (
                            <HiExternalLink className="w-3.5 h-3.5 opacity-70" />
                          )}
                        </motion.a>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            link.variant === "primary"
                              ? "text-white shadow-sm"
                              : "text-text-primary border"
                          }`}
                          style={{
                            backgroundColor:
                              link.variant === "primary"
                                ? "var(--color-brand)"
                                : "transparent",
                            borderColor:
                              link.variant === "secondary"
                                ? "var(--color-border)"
                                : "transparent",
                            boxShadow:
                              link.variant === "primary"
                                ? "0 2px 8px rgba(37, 99, 235, 0.2)"
                                : "none",
                          }}
                        >
                          <link.icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 md:h-[72px]" />
    </>
  );
};

export default Navbar;
