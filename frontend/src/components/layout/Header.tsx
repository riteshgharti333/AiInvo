import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Command } from "cmdk";
import {
  TbSearch,
  TbPlus,
  TbUser,
  TbLogin,
  TbSettings,
  TbHelp,
  TbLogout,
  TbX,
  TbCommand,
} from "react-icons/tb";
import { LoginPanel } from "./LoginPanel";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../utils/toast";
import { Button } from "../ui/ButtonProps";
import { searchItems, type SearchItem } from "../../assets/data";

const avatarMap: Record<string, string> = {
  av1: "/avatars/av1.png",
  av2: "/avatars/av2.png",
  av3: "/avatars/av3.png",
  av4: "/avatars/av4.png",
  av5: "/avatars/av5.png",
  av6: "/avatars/av6.png",
};

export function Header() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/avatars/av1.png");
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();

  // Load stored avatar
  useEffect(() => {
    const loadAvatar = () => {
      const saved = localStorage.getItem("userAvatar");
      if (saved) {
        const { avatarId } = JSON.parse(saved);
        setUserAvatar(avatarMap[avatarId] || "/avatars/av1.png");
      }
    };

    // Load initially
    loadAvatar();

    // Listen for storage changes (for real-time updates)
    window.addEventListener("storage", loadAvatar);

    // Custom event for same-tab updates
    window.addEventListener("avatarUpdated", loadAvatar);

    return () => {
      window.removeEventListener("storage", loadAvatar);
      window.removeEventListener("avatarUpdated", loadAvatar);
    };
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        const input = document.querySelector<HTMLInputElement>(
          "[data-search-input]",
        );
        input?.focus();
      }
      // Escape closes
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-search]")) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      toast.success(response.message || "Logged out successfully");
      setShowUserMenu(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="top-0 z-30">
        <div className="flex items-center justify-between h-20">
          {/* Left - Brand + Greeting */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center">
              <img
                src="/logo.webp"
                alt="AiInvo - AI-powered invoicing, simplified"
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Mobile logo */}
            <div className="sm:hidden">
              <img
                src="/logo-icon.png"
                alt="AiInvo"
                className="h-9 w-9 object-contain"
              />
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Search with cmdk Inline */}
            <div data-search className="relative hidden md:block">
              <Command className="relative">
                <div className="relative">
                  <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none z-10" />
                  <Command.Input
                    ref={inputRef}
                    placeholder="Search pages..."
                    onFocus={() => setSearchOpen(true)}
                    className="w-[280px] pl-10 pr-12 py-2.5 bg-white rounded-2xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none border border-transparent focus:border-brand/30 focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <kbd
                    onClick={() => inputRef.current?.focus()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-white border border-border rounded-md text-text-muted font-mono cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <TbCommand size={12} className="inline -mt-px" />K
                  </kbd>
                </div>

                {/* Dropdown — only cmdk List */}
                {searchOpen && (
                  <div className="absolute z-20 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
                    <Command.List className="max-h-64 overflow-y-auto p-2">
                      <Command.Empty className="px-4 py-8 text-center text-sm text-text-muted">
                        No results found
                      </Command.Empty>

                      <Command.Group
                        heading="Pages"
                        className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-3 pt-3 pb-1"
                      >
                        {searchItems
                          .filter((i) => i.type === "Page")
                          .map((item) => (
                            <Command.Item
                              key={item.path + item.label}
                              value={item.label}
                              onSelect={() => handleSelect(item)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-primary cursor-pointer hover:bg-surface-hover transition-colors aria-selected:bg-brand/10 aria-selected:text-brand"
                            >
                              <div className="w-7 h-7 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                                <item.icon size={14} className="text-brand" />
                              </div>
                              <span className="font-medium">{item.label}</span>
                            </Command.Item>
                          ))}
                      </Command.Group>

                      <Command.Group
                        heading="Create"
                        className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-3 pt-3 pb-1"
                      >
                        {searchItems
                          .filter((i) => i.type === "Create")
                          .map((item) => (
                            <Command.Item
                              key={item.path + item.label}
                              value={item.label}
                              onSelect={() => handleSelect(item)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-primary cursor-pointer hover:bg-surface-hover transition-colors aria-selected:bg-brand/10 aria-selected:text-brand"
                            >
                              <div className="w-7 h-7 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                                <item.icon size={14} className="text-brand" />
                              </div>
                              <span className="font-medium">{item.label}</span>
                            </Command.Item>
                          ))}
                      </Command.Group>
                    </Command.List>

                    <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                      <span>↑↓ Navigate</span>
                      <span>↵ Open</span>
                      <span>Esc Close</span>
                    </div>
                  </div>
                )}
              </Command>
            </div>

            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 hover:bg-surface-hover rounded-2xl transition-colors md:hidden"
            >
              <TbSearch size={20} className="text-text-secondary" />
            </button>

            {/* Notification Bell - Component */}
            {isAuthenticated && <NotificationDropdown />}

            <Link to={"/invoice/new-invoice"}>
              <Button variant="primary" size="md" icon={TbPlus}>
                New Invoice
              </Button>
            </Link>

            {/* User Avatar / Login */}
            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-10 h-10 object-cover cursor-pointer rounded-full hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300 "
                />

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-12 w-64 bg-white rounded-3xl border border-border shadow-2xl z-20 overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-gradient-to-br from-brand/5 to-purple-500/5 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0">
                            <img
                              src={userAvatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {[
                          { icon: TbUser, label: "Profile", path: "/profile" },
                          {
                            icon: TbSettings,
                            label: "Settings",
                            path: "/settings",
                          },
                          { icon: TbHelp, label: "Help & Support", path: "#" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              navigate(item.path);
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                          >
                            <item.icon size={18} className="shrink-0" />
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-danger hover:bg-danger-light/50 transition-all font-medium"
                        >
                          <TbLogout size={18} className="shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-border rounded-2xl text-sm font-semibold text-text-secondary hover:border-brand hover:text-brand hover:bg-brand-light/10 transition-all duration-200"
              >
                <TbLogin size={18} />
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Slide-in Panel */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLogin(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col rounded-l-3xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
                <h2 className="text-lg font-bold text-text-primary">
                  Welcome Back
                </h2>
                <button
                  onClick={() => setShowLogin(false)}
                  className="p-2 hover:bg-surface-hover rounded-xl transition-colors"
                >
                  <TbX size={20} className="text-text-secondary" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <LoginPanel onSuccess={() => setShowLogin(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
