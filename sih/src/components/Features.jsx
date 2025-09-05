// Features.jsx
import { motion } from "framer-motion";
import {
  Cpu,
  CloudRain,
  Leaf,
  TrendingUp,
  FlaskConical,   // ✅ works
  Mic,
  UserCheck,
  Clock,
  AlertTriangle,
  LanguagesIcon
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

const features = [
  {
    id: "ai",
    title: "AI-driven Insights",
    desc: "Actionable, data-backed recommendations tuned to your farm.",
    icon: Cpu,
    chart: null,
    accent: "from-green-400 to-green-600",
  },
  {
    id: "weather",
    title: "Real-time Weather",
    desc: "Live forecasts, rainfall & precipitation chance updates.",
    icon: CloudRain,
    chart: "weather",
    accent: "from-blue-400 to-blue-600",
  },
  {
    id: "tips",
    title: "Customized Farming Tips",
    desc: "Crop-specific guidance based on soil & climate.",
    icon: Leaf,
    chart: null,
    accent: "from-emerald-400 to-emerald-600",
  },
  {
    id: "yield",
    title: "Crop Yield Prediction",
    desc: "Forecast yield trends so you can plan harvests better.",
    icon: TrendingUp,
    chart: "yield",
    accent: "from-yellow-400 to-amber-600",
  },
    {
    id: "soil",
    title: "Soil Health Testing",
    desc: "pH, organic matter & composition visualized simply.",
    icon: FlaskConical,  // ✅ instead of Flask
    chart: "soil",
    accent: "from-indigo-400 to-indigo-600",
    },
  {
    id: "voice",
    title: "Voice Response",
    desc: "Voice-first commands & replies for hands-free use.",
    icon: Mic,
    chart: null,
    accent: "from-cyan-400 to-cyan-600",
  },
  {
    id: "human",
    title: "Human-like Interaction",
    desc: "Conversational UI — clear, polite and easy to talk with.",
    icon: UserCheck,
    chart: null,
    accent: "from-rose-400 to-rose-600",
  },
  {
    id: "harvest",
    title: "Optimum Harvest Times",
    desc: "Signals for best harvest windows to maximize yield.",
    icon: Clock,
    chart: "harvest",
    accent: "from-lime-400 to-lime-600",
  },
  {
    id: "disaster",
    title: "Disaster Management",
    desc: "Live alerts & mitigation steps for floods, droughts & storms.",
    icon: AlertTriangle,
    chart: null,
    accent: "from-red-400 to-red-600",
  },
  {
    id: "regionallanguage",
    title: "Regional Language",
    desc: "Regional Language support and responses",
    icon: LanguagesIcon,
    chart: null,
    accent: "from-green-400 to-green-600",
  },
];

const sampleWeather = [
  { t: "1", v: 10 },
  { t: "2", v: 20 },
  { t: "3", v: 18 },
  { t: "4", v: 28 },
  { t: "5", v: 22 },
];

const sampleYield = [
  { t: "Jan", v: 30 },
  { t: "Feb", v: 45 },
  { t: "Mar", v: 60 },
  { t: "Apr", v: 75 },
  { t: "May", v: 68 },
];

const sampleSoil = [
  { t: "pH", v: 6.5 },
  { t: "OM", v: 45 },
  { t: "N", v: 30 },
  { t: "P", v: 25 },
];

export default function Features() {
  return (
    <section className="w-full py-16 px-4 md:px-12 lg:px-20 font-poppins bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-700">
            Key Features — Krishi Mitra
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Farmer-friendly tools that turn weather & soil data into confident decisions.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, type: "spring", stiffness: 120 }}
                className="relative bg-white border border-green-50 rounded-2xl p-5 shadow-sm hover:shadow-lg transition hover:-translate-y-1"
              >
                {/* left accent vertical */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b ${f.accent}`}
                />

                <div className="flex items-start space-x-4">
                  {/* Icon circle */}
                  <div
                    className={`flex-shrink-0 rounded-lg p-3 bg-gradient-to-br ${f.accent} bg-opacity-95 text-white shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{f.desc}</p>

                    {/* small chart area for certain features */}
                    {f.chart === "weather" && (
                      <div className="mt-4 h-20">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sampleWeather}>
                            <Tooltip
                              wrapperStyle={{ background: "white", borderRadius: 8 }}
                              cursor={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke="#0ea5a4"
                              strokeWidth={2}
                              dot={false}
                              strokeOpacity={0.95}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {f.chart === "yield" && (
                      <div className="mt-4 h-20">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sampleYield}>
                            <Tooltip wrapperStyle={{ background: "white", borderRadius: 8 }} />
                            <Area
                              type="monotone"
                              dataKey="v"
                              stroke="#84cc16"
                              fill="#ecfccb"
                              strokeWidth={2}
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {f.chart === "soil" && (
                      <div className="mt-4 h-20">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sampleSoil}>
                            <Tooltip wrapperStyle={{ background: "white", borderRadius: 8 }} />
                            <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA badge bottom-right */}
                <div className="absolute right-4 bottom-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                  >
                    Live
                    <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                  </motion.div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Extra footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-gray-500 text-center"
        >
          Designed for farmers — clear language, large touch targets, and actionable data.
        </motion.div>
      </div>
    </section>
  );
}
