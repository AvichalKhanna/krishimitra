import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import CountUp from "react-countup";
import {
  CloudRain,
  Droplet,
  Thermometer,
  Leaf,
  Sun,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Hero() {
  const [view, setView] = useState("weather");

  const weatherMetrics = [
    { title: "Rainfall Prediction", value: 78, icon: CloudRain, color: "text-blue-600" },
    { title: "Precipitation Chance", value: 65, icon: Droplet, color: "text-green-600" },
    { title: "Soil Moisture", value: 42, icon: Thermometer, color: "text-yellow-600" },
  ];

  const soilMetrics = [
    { title: "Soil Type", value: "Loamy", icon: Leaf, color: "text-green-700" },
    { title: "Soil Health", value: "Good", icon: BarChart3, color: "text-blue-700" },
    { title: "Soil pH", value: 6.5, icon: Thermometer, color: "text-purple-600" },
    { title: "Organic Matter", value: 45, icon: Leaf, color: "text-green-500" },
  ];

  // Pick active dataset
  const activeMetrics = view === "weather" ? weatherMetrics : soilMetrics;

  const soilData = [
    { name: "Sand", value: 40, color: "#16a34a" },
    { name: "Silt", value: 30, color: "#2563eb" },
    { name: "Clay", value: 30, color: "#f59e0b" },
  ];

  const cropData = [
    { name: "Jan", growth: 30 },
    { name: "Feb", growth: 45 },
    { name: "Mar", growth: 70 },
    { name: "Apr", growth: 90 },
  ];

  return (
    <section className="w-full h-full py-20 px-3 md:px-6 lg:px-10 font-poppins relative">
      {/* Hero Title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
          Smart Farming Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real-time insights into soil, weather, and crop growth for better
          farming decisions.
        </p>
      </motion.div>

      {/* Toggle */}
      <div className="p-5 mb-10 bg-green-50 rounded-xl shadow-lg">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setView("weather")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === "weather"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Weather 🌦
          </button>
          <button
            onClick={() => setView("soil")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === "soil"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Soil 🌱
          </button>
        </div>

        {/* Arc Layout Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          <AnimatePresence mode="wait">
            {activeMetrics.map((metric, i) => (
              <motion.div
                key={metric.title}
                className="flex flex-col items-center space-y-2 bg-green-50 rounded-full w-24 h-24 justify-center shadow-xl hover:shadow-2xl transition
                hover:w-50 transition-all duration-500 ease-in-out group"
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -30 }}
                transition={{ delay: i * 0.1 }}
              >
                <metric.icon className={`${metric.color} w-8 h-8 group-hover:hidden`} />
                <p
                  className={`${metric.color} opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                              transition-all duration-300 delay-100
                              text-[0px] font-medium group-hover:text-[16px] text-gray-600`}
                >
                  {metric.title}
                </p>

                              
                <div className="w-10 h-0.5 bg-gray-300 rounded-full" />
                
                {typeof metric.value === "number" ? (
                  <p className={`text-lg font-semibold ${metric.color}`}>
                    <CountUp end={metric.value} duration={2} />
                    {metric.title.includes("pH") ? "" : "%"}
                  </p>
                ) : (
                  <div className="flex flex-col">
                  <p className={`text-sm font-semibold ${metric.color}`}>
                    {metric.value}
                  </p>
                  </div>
                )}

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Soil Composition */}
        <motion.div
          className="bg-green-50 shadow-md rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Soil Composition
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={soilData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={4}
                isAnimationActive={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {soilData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom Legend */}
          <div className="flex justify-center mt-4 gap-6">
            {soilData.map((entry, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <p className="text-sm font-medium text-gray-700">{entry.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Crop Growth */}
        <motion.div
          className="bg-green-50 shadow-md rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Crop Growth Over Months
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="growth" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
}
