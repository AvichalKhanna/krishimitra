import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  CloudRain,
  Thermometer,
  Droplet,
  Bell
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

export default function Weather({ weather, setAlerts }) {
  const [expanded, setExpanded] = useState(false);

  // Utility: prevents NaN rendering
  const safeNumber = (val, fallback = 0) =>
    typeof val === "number" && !isNaN(val) ? val : fallback;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-xl rounded-2xl">
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-gray-700">Weather</h3>
            <div className="mt-3">
              <div className="text-4xl font-extrabold text-gray-900">
                {safeNumber(weather.tempC)}°C
              </div>
              <div className="text-sm text-gray-600">{weather.condition}</div>
              <div className="mt-3 text-sm text-gray-700 flex flex-wrap gap-4 items-center">
                <CloudRain className="w-4 h-4 text-blue-500" />
                {Math.round(safeNumber(weather.rainProbability))}% rain
                <Thermometer className="w-4 h-4 ml-3 text-red-500" />
                {Math.round(safeNumber(weather.windSpeed))} km/h wind
                <Droplet className="w-4 h-4 ml-3 text-cyan-600" />
                {safeNumber(weather.humidity)}% humidity
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Last updated:{" "}
              {weather.lastUpdated
                ? weather.lastUpdated.toLocaleTimeString()
                : "—"}
            </div>
          </div>

          <div className="flex flex-col gap-3 items-end">
            <div className="rounded-full bg-white p-2 shadow-md">
              <Thermometer className="w-6 h-6 text-red-500" />
            </div>
            <button
              onClick={() =>
                setAlerts((a) => [
                  {
                    id: Date.now(),
                    type: "info",
                    text: "⚠️ Frost advisory tonight",
                    ts: new Date(),
                  },
                  ...a,
                ])
              }
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-green-600 text-white shadow hover:bg-green-700 transition"
            >
              <Bell className="w-4 h-4" /> Alert
            </button>
          </div>
        </div>

        {/* Toggle Button for < xl screens */}
        <div className="mt-4 block xl:hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-center py-2 text-sm font-semibold text-blue-600 border rounded-lg hover:bg-blue-50"
          >
            {expanded ? "Hide Forecast" : "Show Forecast"}
          </button>
        </div>

        {/* Charts */}
        {(expanded || window.innerWidth >= 1280) && (
          <div className="mt-6 grid grid-cols-1 gap-6">
            {/* Temperature Trend */}
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weather.forecast}>
                <XAxis dataKey="time" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip contentStyle={{ backgroundColor: "#fff" }} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Rain Probability */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weather.forecast}>
                <XAxis dataKey="time" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip contentStyle={{ backgroundColor: "#fff" }} />
                <Bar
                  dataKey="rainProbability"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Wind Speed */}
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weather.forecast}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip contentStyle={{ backgroundColor: "#fff" }} />
                <Area
                  type="monotone"
                  dataKey="windKmph"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fill="url(#windGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </Card>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-lg bg-white p-4 shadow ${className}`}>{children}</div>;
}
