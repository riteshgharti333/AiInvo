import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiShieldCheck,
  HiChartBar,
  HiLightningBolt,
  HiBell,
  HiMail,
  HiDocumentDownload,
  HiSwitchHorizontal,
  HiTerminal,
  HiSparkles,
} from "react-icons/hi";

const About = () => {
  const features = [
    {
      icon: HiSparkles,
      title: "AI-Powered Generation",
      description:
        "Create invoices by simply describing what you need. AI handles the rest automatically.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: HiBell,
      title: "Smart Notifications",
      description:
        "Automated alerts for due invoices and payment reminders via email & WhatsApp.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: HiMail,
      title: "PDF & Email Delivery",
      description:
        "Generate polished invoices and send them instantly with professional PDF attachments.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: HiChartBar,
      title: "Revenue Dashboard",
      description:
        "Monitor total revenue, outstanding payments, and business performance at a glance.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: HiSwitchHorizontal,
      title: "Quote to Invoice",
      description:
        "Convert approved quotations to invoices in one click — no double data entry.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: HiShieldCheck,
      title: "Type-Safe & Reliable",
      description:
        "Shared TypeScript types and Zod validation prevent errors across the entire stack.",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-20" id="about">
      {/* Tailwind Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[radial-gradient(circle,var(--color-brand),transparent)] -translate-x-[30%] -translate-y-[20%]" />
        <div className="absolute bottom-20 right-0 w-[350px] h-[350px] rounded-full opacity-[0.03] bg-[radial-gradient(circle,#7c3aed,transparent)] translate-x-[30%] translate-y-[20%]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Section Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-brand-light text-brand"
            >
              <HiLightningBolt className="w-4 h-4" />
              <span>Why AiInvo</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6"
            >
              <span className="text-text-primary">Organise Your</span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Business Finances
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base leading-relaxed mb-8 max-w-xl text-text-secondary"
            >
              A complete billing platform that handles your entire sales
              workflow — from creating professional quotations and invoices to
              tracking payments and managing customers. Built for freelancers
              and small teams who need enterprise-grade features without the
              complexity.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base leading-relaxed mb-10 max-w-xl text-text-secondary"
            >
              Generate polished PDFs, send them via email or WhatsApp
              automatically, and get real-time alerts when invoices are due or
              overdue. Monitor your business health with revenue dashboards,
              track payment statuses, and let the system handle reminders — so
              you can focus on growing your business.
            </motion.p>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${feature.bg}`}
                  >
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1 text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-text-muted">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-border shadow-xl">
              {/* Dashboard Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-border-light">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-text-muted">
                    Dashboard — AiInvo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-surface" />
                  <div className="w-6 h-6 rounded-md bg-surface" />
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Total Invoices",
                      value: "156",
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Paid",
                      value: "$48.5K",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                    {
                      label: "Pending",
                      value: "23",
                      color: "text-amber-600",
                      bg: "bg-amber-50",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-center ${stat.bg}`}
                    >
                      <p className={`text-lg font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p
                        className={`text-[10px] font-medium ${stat.color} opacity-80`}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent Invoices Table Preview */}
                <div>
                  <p className="text-xs font-semibold mb-3 text-text-primary">
                    Recent Invoices
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        id: "INV-089",
                        customer: "Acme Corp",
                        amount: "$2,450",
                        status: "Paid",
                        statusColor: "text-emerald-600",
                        statusBg: "bg-emerald-50",
                      },
                      {
                        id: "INV-088",
                        customer: "Globex Inc",
                        amount: "$1,890",
                        status: "Pending",
                        statusColor: "text-amber-600",
                        statusBg: "bg-amber-50",
                      },
                      {
                        id: "INV-087",
                        customer: "Stark Ltd",
                        amount: "$3,200",
                        status: "Draft",
                        statusColor: "text-slate-600",
                        statusBg: "bg-slate-50",
                      },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-surface"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold bg-brand-light text-brand">
                            {invoice.customer[0]}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-primary">
                              {invoice.customer}
                            </p>
                            <p className="text-[10px] text-text-muted">
                              {invoice.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-text-primary">
                            {invoice.amount}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${invoice.statusBg} ${invoice.statusColor}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90].map(
                    (height, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-md transition-all duration-300 ${
                          i >= 8 ? "bg-brand" : "bg-brand-light"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div className="absolute -bottom-4 -right-4 z-10 animate-float-slow">
              <div className="px-5 py-3 rounded-2xl flex items-center gap-3 bg-white border border-border shadow-lg">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50">
                  <HiCheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">98%</p>
                  <p className="text-[11px] text-text-muted">
                    Customer Satisfaction
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Mini Card */}
            <motion.div className="absolute -top-4 -left-4 z-10 animate-float-medium">
              <div className="px-4 py-2.5 rounded-xl flex items-center gap-2 bg-white border border-border shadow-md">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-text-primary">
                  Invoice Sent
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
