// Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  CloudRain,
  Thermometer,
  Database,
  Camera,
  Mic,
  Bell,
  MapPin,
  Newspaper,
  Plus,
  Bot,
  Leaf,
  Globe,
  Wifi,
  Droplets,
  Bug,
  ShoppingBasket,
  Drone,
  Loader2
} from "lucide-react";

import {
LineChart,
Line,
Tooltip,
XAxis,
YAxis,
RadialBarChart,
RadialBar,
BarChart,
Bar,
AreaChart,
Area,
ResponsiveContainer,
} from "recharts";
import Weather from "./Weather";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


/**
 * KrishiMitra - Dashboard Home page
 * - Tailwind based UI
 * - Mock realtime updates (setInterval) for soil/weather (replace with WebSocket / API)
 * - Chat widget demo with voice capture + image upload
 * - Add / edit crop quick form
 *
 * Notes:
 * - Replace mock functions (fetch..., ws...) with real endpoints.
 * - Ensure Tailwind is configured in the project.
 */

export default function Home() {
  // --- Mock realtime state (replace with real data sources) ---
  const [soilData, setSoilData] = useState({
    moisture: 42, // %
    ph: 6.3,
    nitrogen: 18, // mg/kg
    lastUpdated: new Date(),
  });

  const [lang, setLang] = useState("EN"); // EN = English, HI = Hindi

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "HI" : "EN"));
  };

  // ---------- INITIAL STATE ----------
  const [weather, setWeather] = useState({
    tempC: 26,
    rainProbability: 40,
    windKmph: 12,
    humidity: 70,
    condition: "Partly Cloudy",
    lastUpdated: new Date(),
    forecast: Array.from({ length: 10 }).map((_, i) => ({
      time: new Date(Date.now() - (9 - i) * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: 25 + Math.sin(i / 2) * 2 + Math.random(),
      rainProbability: Math.max(0, Math.min(100, 40 + Math.sin(i) * 10 + Math.random() * 5)),
      windKmph: Math.max(0, 10 + Math.sin(i / 3) * 5 + Math.random() * 2),
    })),
  });

  const messagesEndRef = useRef(null);

  const [expanded, setExpanded] = useState(false);

  // Mouse tracking for tilt animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // map values → tilt degrees
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
  };

  const [botTyping, setBotTyping] = useState(false);

  const typingTimeout = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const [alerts, setAlerts] = useState([
    { id: 1, type: "weather", text: "Light rain expected tomorrow", ts: new Date() },
  ]);

  const [crops, setCrops] = useState([
    { id: 1, name: "Wheat", stage: "Tillering", health: "Good", plantedOn: "2025-01-20" },
    { id: 2, name: "Tomato", stage: "Flowering", health: "Moderate", plantedOn: "2025-02-12" },
  ]);

  // Chat widget
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi! Send an image or speak to tell me about a field." },
  ]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  
  // Simulate real-time updates every 6 seconds
useEffect(() => {
  const id = setInterval(() => {
    // Soil data update
    setSoilData((s) => {
      const deltaMoist = Number((Math.random() * 6 - 3).toFixed(0)); 
      return {
        ...s,
        moisture: Math.max(10, Math.min(90, s.moisture + deltaMoist)),
        ph: +(s.ph + (Math.random() * 0.2 - 0.1)).toFixed(2),
        lastUpdated: new Date(),
      };
    });

    // Weather data update
    setWeather((w) => {
      const deltaTemp = +(Math.random() * 1.5 - 0.75).toFixed(1);
      const deltaRain = Number((Math.random() * 6 - 3).toFixed(0));
      const deltaWind = Number((Math.random() * 4 - 2).toFixed(0)); // wind change

      const newTemp = +(w.tempC + deltaTemp).toFixed(1);
      const newRain = Math.max(0, Math.min(100, w.rainProbability + deltaRain));
      const newWind = Math.max(0, w.windSpeed + deltaWind); // keep >= 0

      // new forecast point with all 3 metrics
      const newPoint = {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temp: newTemp,
        rain: newRain,
        wind: newWind,
      };

      return {
        ...w,
        tempC: newTemp,
        rainProbability: newRain,
        windSpeed: newWind,
        lastUpdated: new Date(),
        forecast: [...(w.forecast || []).slice(-9), newPoint], // keep only last 10
      };
    });

    // Alerts
    if (Math.random() > 0.9) {
      setAlerts((a) => [
        {
          id: Date.now(),
          type: "weather",
          text: "Sudden wind gusts expected",
          ts: new Date(),
        },
        ...a,
      ]);
    }
  }, 6000);

  return () => clearInterval(id);
}, []);



  // --- Chat voice capture using Web Speech API (desktop browsers) ---
  useEffect(() => {
    const globalAny = window;
    const SpeechRecognition =
      globalAny.SpeechRecognition || globalAny.webkitSpeechRecognition || null;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-IN";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (e) => {
      const text = e.results[0][0].transcript;
      pushUserMessage(text);
      // mock bot reply
      botReply(`You said: "${text}" — I analyzed field symptoms and recommend irrigation if moisture < 30%.`);
      setListening(false);
    };

    recognitionRef.current.onerror = () => {
      setListening(false);
      botReply("Couldn't capture voice. Please try again or type your message.");
    };
  }, []);

  const pushUserMessage = (text) => {
    setChatMessages((prev) => [...prev, { from: "user", text }]);
    setBotTyping(true);
    setTimeout(() => {
      botReply("Got it — thanks for sharing. (Mock reply)");
      setBotTyping(false);
    }, 1200);
  };

  const botReply = (text) => {
    setChatMessages((m) => [...m, { from: "bot", text }]);
  };

  const fieldCoords = [28.6139, 77.2090];

  const startListening = () => {
    if (!recognitionRef.current) {
      botReply("Voice not supported in this browser.");
      return;
    }
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // already started
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, botTyping, chatOpen]);


  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // Image upload handler (demo)
  const handleImageUpload = (file) => {
    if (!file) return;
    pushUserMessage("[Image sent]");
    botReply("Image received. Scanning for plant diseases and soil cover...");
    // mock delay
    setTimeout(() => botReply("Analysis complete: No obvious disease. Soil dryness moderate."), 1500);
  };

  // Add / edit crop helpers
  const [newCropName, setNewCropName] = useState("");
  const addCrop = () => {
    if (!newCropName.trim()) return;
    const newCrop = {
      id: Date.now(),
      name: newCropName,
      stage: "Seeding",
      health: "Good",
      plantedOn: new Date().toISOString().slice(0, 10),
    };
    setCrops((c) => [newCrop, ...c]);
    setNewCropName("");
  };

  // news ticker content (mock)
  const newsList = [
    "Govt launches new subsidy for drip irrigation.",
    "Heatwave alert in northern districts tomorrow.",
    "Market price: Tomato ₹30/kg — up 8% this week.",
  ];

  return (
    <div className="absolute top-0 left-0 min-h-screen w-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">

        <motion.div
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-50 shadow-md hover:shadow-xl transition"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        >
        {/* Avatar with gradient + initials */}
        <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-green-600 to-emerald-400 w-14 h-14 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            RS
            </div>
            {/* Small status dot */}
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </div>

        {/* Info */}
        <div>
            <h1 className="text-2xl text-gray-900 font-extrabold flex items-center gap-2 h-12">
            Rajesh Singh
            <Leaf className="w-5 h-5 text-green-600" />
            </h1>
            <p className="text-sm text-gray-600 flex text-base gap-1">
            <MapPin className="w-4 h-4 text-gray-500" />
            Farmer • Haryana
            </p>
        </div>
        </motion.div>

        <motion.div
        className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition flex flex-col w-fit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        >
        <div className="flex gap-3 items-center ml-auto">
            {/* Language Switcher */}
            <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleLang}
            className="flex items-center gap-2 bg-white shadow px-3 py-2 rounded-lg hover:shadow-lg hover:bg-green-50 transition"
            aria-label="Switch Language"
            >
            <Globe className="w-5 h-5 text-green-700" />
            <span className="text-sm font-medium text-green-800">
                {lang === "EN" ? "English" : "हिन्दी"}
            </span>
            </motion.button>

            {/* Chat Button */}
            <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setChatOpen((s) => !s)}
            className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-lg hover:shadow-lg hover:bg-green-50 transition"
            aria-label="Open Chat"
            >
            <Bot className="w-5 h-5 text-green-700" />
            <span className="hidden sm:inline font-medium text-green-800">
                Field Chat
            </span>
            </motion.button>
        </div>

        {/* Note about future languages */}
        <div className="w-full text-xs text-gray-500 mt-2 text-center sm:text-right">
            More regional languages coming soon...
        </div>
        </motion.div>
      </header>

    <div className="px-6">
      <motion.div
        className="relative flex items-center gap-4 bg-gradient-to-r from-yellow-100 to-orange-50 
                   border border-yellow-200 rounded-xl shadow-sm p-3 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 📰 Icon + Label */}
        <div className="flex items-center gap-2 bg-yellow-200/70 px-3 py-1 rounded-md">
          <Newspaper className="w-5 h-5 text-yellow-700" />
          <span className="text-sm font-semibold text-yellow-900 hidden sm:inline">
            Agri News
          </span>
        </div>

        {/* 🎵 Marquee News Items */}
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee">
            <div className="inline-block pr-8">
              {newsList.map((n, i) => (
                <span
                  key={i}
                  className="mx-8 text-sm font-medium text-yellow-800"
                >
                  • {n}
                </span>
              ))}
            </div>
            {/* duplicate for smooth loop */}
            <div className="inline-block pr-8">
              {newsList.map((n, i) => (
                <span
                  key={i + 100}
                  className="mx-8 text-sm font-medium text-yellow-800"
                >
                  • {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 🔴 Live Indicator */}
        <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Live
          <Wifi className="w-3 h-3 text-red-500" />
        </div>
      </motion.div>
    </div>

      {/* Main grid */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Soil & Weather */}
        <section className="lg:col-span-2 flex flex-col gap-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ---------------- Soil Card ---------------- */}
      <Card className="bg-gradient-to-br from-green-100 via-white to-green-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Soil - Field A
              </h3>
              <div className="flex items-baseline gap-4 mt-3 text-black flex-wrap">
                <div>
                  <div className="text-3xl font-extrabold">
                    {soilData.moisture}%
                  </div>
                  <div className="text-sm text-gray-500">Moisture</div>
                </div>
                <Separator />
                <div>
                  <div className="text-2xl font-bold">{soilData.ph}</div>
                  <div className="text-sm text-gray-500">pH</div>
                </div>
                <Separator />
                <div>
                  <div className="text-2xl font-bold">
                    {soilData.nitrogen} mg/kg
                  </div>
                  <div className="text-sm text-gray-500">Nitrogen</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Updated: {soilData.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <MapPin className="w-6 h-6 text-green-600" />
              <div className="text-xs text-gray-500">Sensor ID: S-204</div>
            </div>
          </div>

        {/* Soil Moisture Gauge + Extra Graphs */}
        <div className="mt-6 grid grid-cols-1 gap-6">
        {/* Gauge */}
        <Card className="p-4 min-w-100">
            <h4 className="text-sm font-semibold text-gray-600">Current Moisture</h4>
            <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[
                { name: "Moisture", value: safeNumber(soilData.moisture, 0), fill: "#16a34a" },
                ]}
                startAngle={90}
                endAngle={-270}
            >
                <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={10} />
                <Tooltip />
            </RadialBarChart>
            </ResponsiveContainer>
        </Card>

        {/* Moisture History */}
        <Card className="p-4 min-w-100">
            <h4 className="text-sm font-semibold text-gray-600">Moisture Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
            <LineChart data={soilData.history || []}>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="moisture" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
            </ResponsiveContainer>
        </Card>

        {/* Nutrient Comparison */}
        <Card className="p-4 min-w-100">
            <h4 className="text-sm font-semibold text-gray-600">Nutrient Levels</h4>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
                { nutrient: "Nitrogen", value: safeNumber(soilData.nitrogen, 0) },
                { nutrient: "Phosphorus", value: safeNumber(soilData.phosphorus, 0) },
                { nutrient: "Potassium", value: safeNumber(soilData.potassium, 0) },
            ]}>
                <XAxis dataKey="nutrient" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </Card>
        </div>

        </motion.div>
      </Card>
      
      <Weather weather={weather} setAlerts={() => setAlerts}/>
    </div>

    {/* Crops table + Add */}
    <Card className="p-4 bg-gradient-to-br from-green-50 to-white shadow-md rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="text-xl font-bold text-gray-800">🌱 Crops & Fields</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            value={newCropName}
            onChange={(e) => setNewCropName(e.target.value)}
            className="border border-gray-300 text-black placeholder:text-black rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Add crop (e.g., Maize)"
          />
          <button
            onClick={addCrop}
            className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Crops list */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crops.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-xl bg-white border hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="font-semibold text-gray-900 text-lg">{c.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                Stage: <span className="font-medium">{c.stage}</span> • Health:{" "}
                <span className="font-medium">{c.health}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Planted: {c.plantedOn}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-black transition">
                Edit
              </button>
              <button
                onClick={() =>
                  setCrops((arr) => arr.filter((x) => x.id !== c.id))
                }
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>

        </section>
{/* Right column: Alerts, News, Chat quick access */}
<aside className="flex flex-col gap-6 scrollbar-hide">
  {/* Alerts */}
  <Card className="p-4 rounded-2xl shadow-md bg-white">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        🚨 Alerts
      </h4>
      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
        Real-time
      </span>
    </div>

    <div className="mt-4 flex flex-col gap-3 max-h-56 overflow-auto pr-1">
      {alerts.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No active alerts 🎉</div>
      ) : (
        alerts.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-xl border border-red-200 bg-red-50 hover:shadow-sm transition"
          >
            <div className="font-medium text-red-700">{a.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {a.ts.toLocaleTimeString()}
            </div>
          </motion.div>
        ))
      )}
    </div>
  </Card>

  {/* Field Camera */}
  <Card className="p-4 rounded-2xl shadow-md bg-white">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        📸 Field Camera
      </h4>
      <span className="text-xs text-gray-500">Upload image</span>
    </div>

    <div className="mt-4 flex flex-col sm:flex-row gap-3">
      <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-3 py-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
        <Camera className="w-5 h-5 text-blue-600" />
        <span className="text-sm text-gray-700 font-medium">Upload</span>
        <input
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => botReply("Camera snapshot requested. (Mock)")}
        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
      >
        Snapshot
      </motion.button>
    </div>
  </Card>



<Card className="p-4 rounded-2xl shadow-md bg-white">
  <div className="flex items-center justify-between">
    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      🗺️ Quick Map
    </h4>
    <span className="text-xs text-gray-500">Field view</span>
  </div>

  <div className="mt-3 h-48 rounded-xl overflow-hidden border">
    {!chatOpen && <MapContainer
      center={fieldCoords}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      {/* Base map */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Weather overlay (OpenWeatherMap tiles – requires free API key) */}
      <TileLayer
        url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY`}
        opacity={0.5}
      />

      {/* Field marker */}
      <Marker position={fieldCoords}>
        <Popup>
          🌾 Your Field <br /> Weather & crop insights here.
        </Popup>
      </Marker>
    </MapContainer> }
  </div>
</Card>

{/* Shortcuts */}
<Card className="p-4 rounded-2xl shadow-md bg-white">
  <h4 className="text-lg font-semibold text-gray-800">⚡ Shortcuts</h4>
  <div className="mt-4 grid grid-cols-2 gap-3">
    {[
      { label: "Irrigation", icon: <Droplets className="w-4 h-4" /> },
      { label: "Pest Check", icon: <Bug className="w-4 h-4" /> },
      { label: "Market Prices", icon: <ShoppingBasket className="w-4 h-4" /> },
      { label: "Schedule Drone", icon: <Drone className="w-4 h-4" /> },
    ].map((s, i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center text-black gap-2 justify-center py-3 px-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border shadow-sm text-sm font-medium hover:shadow-md transition"
      >
        {s.icon}
        {s.label}
      </motion.button>
    ))}
  </div>
</Card>
        </aside>
      </main>
{/* Chat widget (floating) */}
<div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 w-full sm:w-auto hide-scrollbar">
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 250, damping: 20 }}
  >
    <div
      className={`bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300
        ${chatOpen ? "h-[80vh] sm:h-[70vh] w-full sm:w-96" : "h-14 w-60"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Field Bot</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen((s) => !s)}
            className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-xs"
          >
            {chatOpen ? "Minimize" : "Open"}
          </button>
        </div>
      </div>

      {/* Body */}
      {chatOpen && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 scrollbar-hide">
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl shadow-sm text-sm ${
                    m.from === "bot"
                      ? "bg-white text-gray-800 border"
                      : "bg-green-100 text-gray-900"
                  }`}
                >
                  <div className="text-xs opacity-60 mb-0.5">
                    {m.from === "bot" ? "KrishiBot" : "You"}
                  </div>
                  <div>{m.text}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {botTyping && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl bg-white border shadow-sm text-sm text-gray-600">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
          </div>


          {/* Input area */}
          <div className="p-3 border-t flex items-center text-black placeholder:text-black gap-2 bg-white hide-scrollbar">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  pushUserMessage(e.currentTarget.value.trim());
                  botReply("Got it — thanks for sharing. (Mock reply)");
                  e.currentTarget.value = "";
                }
              }}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Upload */}
            <label className="p-2 rounded-lg bg-gray-50 border cursor-pointer hover:bg-gray-100">
              <Camera className="w-4 h-4 text-gray-600" />
              <input
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>

            {/* Mic */}
            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              className={`p-2 rounded-lg border ${
                listening ? "bg-red-100 border-red-300" : "bg-gray-50 hover:bg-gray-100"
              }`}
              title="Hold to speak"
            >
              <Mic className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </>
      )}

      {/* Collapsed hint */}
      {!chatOpen && (
        <div className="flex items-center justify-center h-full text-sm text-gray-600">
          💬 Chat with Field Bot
        </div>
      )}
    </div>
  </motion.div>
</div>


      {/* small style used for marquee + gauge */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

/* ---------- Small helper components ---------- */

// Utility: guard against NaN or undefined values
const safeNumber = (val, fallback = 0) =>
  typeof val === "number" && !isNaN(val) ? val : fallback;

function Card({ children, className = "" }) {
  return <div className={`rounded-lg bg-white p-4 shadow ${className}`}>{children}</div>;
}
function Separator() {
  return <div className="w-px bg-gray-200 mx-3 h-8" />;
}

function SoilGauge({ value = 50 }) {
  // tiny circular gauge via SVG
  const angle = (value / 100) * 180;
  const radius = 50;
  const center = 60;
  const rad = (angle * Math.PI) / 180;
  // simple arc end coordinates (for visual only)
  const x = center + radius * Math.cos(Math.PI - rad);
  const y = center - radius * Math.sin(Math.PI - rad);

  return (
    <div className="flex items-center gap-4">
      <svg width="140" height="70" viewBox="0 0 120 60">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <path
          d="M 20 50 A 40 40 0 0 1 100 50"
          fill="none"
          stroke="#E6E6E6"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M 20 50 A 40 40 0 0 1 ${x} ${y}`}
          fill="none"
          stroke="url(#g1)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx={x} cy={y} r="4" fill="#10B981" />
      </svg>

      <div>
        <div className="text-xl font-bold">{value}%</div>
        <div className="text-xs text-gray-500">Soil moisture</div>
      </div>
    </div>
  );
}

function MiniWeatherChart({ temp }) {
  // little sparkline as inline SVG
  const t = Math.max(10, Math.min(40, temp));
  const h = 36;
  const w = 200;
  const points = [
    `${0},${h - (t - 10)}`,
    `${w * 0.25},${h - (t - 11)}`,
    `${w * 0.5},${h - (t - 9)}`,
    `${w * 0.75},${h - (t - 12)}`,
    `${w},${h - (t - 10)}`,
  ].join(" ");
  return (
    <div className="w-full">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={points} fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="text-xs text-gray-400 mt-1">Temp trend</div>
    </div>
  );
}
function pushUserMessage(text) {
  setChatMessages((p) => [...p, { from: "user", text }]);
  // Kick off bot reply (could be API call)
  botReply(() => simulateApiReply(text));
}

// simulate API (replace with real fetch)
async function simulateApiReply(userText) {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 900));
  return `Echo: ${userText}`;
}

async function botReply(getReplyOrString) {
  // start typing
  if (typingTimeout.current) clearTimeout(typingTimeout.current);
  setBotTyping(true);

  // small debounce so typing indicator is visible even for instant replies
  typingTimeout.current = window.setTimeout(async () => {
    try {
      const reply =
        typeof getReplyOrString === "function"
          ? await getReplyOrString()
          : getReplyOrString;

      if (!isMounted.current) return;
      setChatMessages((p) => [...p, { from: "bot", text: reply }]);
    } catch (err) {
      if (!isMounted.current) return;
      setChatMessages((p) => [...p, { from: "bot", text: "Failed to get reply." }]);
    } finally {
      if (isMounted.current) setBotTyping(false);
    }
  }, 300); // tweak delay if needed
}


function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border shadow-sm text-sm text-gray-600">
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0s" }} />
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}
