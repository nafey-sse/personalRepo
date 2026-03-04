import { useState } from "react";

const PLANS = [
  {
    id: "budget",
    name: "Budget Beast",
    subtitle: "₹4,500–6,000 per unit",
    tag: "RECOMMENDED",
    color: "#00E676",
    hardware: [
      { item: "Orange Pi Zero 3 (1GB)", price: "₹1,800–2,200", note: "Allwinner H618, 4K HDMI, WiFi+BT" },
      { item: "7\" LCD IPS (1024×600)", price: "₹1,600–2,500", note: "HDMI, capacitive touch optional" },
      { item: "4G USB Dongle (JioFi/Airtel)", price: "₹500–800", note: "For cellular connectivity" },
      { item: "32GB MicroSD (Class 10)", price: "₹300", note: "OS + cached content" },
      { item: "5V/3A Power Supply + Buck Converter", price: "₹200–400", note: "From vehicle 12V battery" },
      { item: "Custom 3D-printed / acrylic enclosure", price: "₹300–500", note: "Weatherproof, vibration dampened" },
    ],
    pros: [
      "Cheapest per-unit cost at scale",
      "Tiny footprint, easy to mount",
      "Low power draw (~5W total)",
      "Runs Armbian + Chromium kiosk perfectly",
    ],
    cons: [
      "Smaller community vs RPi",
      "Some Linux driver headaches",
      "No official signage OS support",
      "You'll be writing custom scripts",
    ],
  },
  {
    id: "solid",
    name: "Solid Middle Ground",
    subtitle: "₹8,000–11,000 per unit",
    tag: "RELIABLE",
    color: "#448AFF",
    hardware: [
      { item: "Raspberry Pi 4B (2GB)", price: "₹4,500–5,500", note: "Proven, massive ecosystem" },
      { item: "Official RPi 7\" Touch Display 2", price: "₹5,000–6,200", note: "DSI, 800×480, plug & play" },
      { item: "4G HAT or USB Dongle", price: "₹800–1,500", note: "SIM7600 HAT or USB dongle" },
      { item: "32GB MicroSD", price: "₹300", note: "Industrial grade recommended" },
      { item: "5V/3A via 12V buck converter", price: "₹200–400", note: "Vehicle power" },
      { item: "Aluminum enclosure", price: "₹500–800", note: "Heat dissipation + rugged" },
    ],
    pros: [
      "PiSignage / Yodeck / info-beamer support out of box",
      "Huge community, every problem is solved",
      "Touch Display 2 is compact, clean, DSI-connected",
      "GPIO access for future sensors (GPS, accelerometer)",
    ],
    cons: [
      "2x cost of budget option",
      "RPi 4 runs hot in Indian summers without active cooling",
      "Official display is only 5\" or 7\" — not huge",
      "SD card corruption risk in vibration environments",
    ],
  },
  {
    id: "android",
    name: "Android Stick Hack",
    subtitle: "₹3,000–5,000 per unit",
    tag: "CHEAPEST",
    color: "#FF9100",
    hardware: [
      { item: "Android TV Stick (H96/X96)", price: "₹1,500–2,500", note: "Amlogic S905, Android 12+" },
      { item: "7\" USB-powered portable monitor", price: "₹1,500–2,500", note: "HDMI input, 1024×600" },
      { item: "4G via phone hotspot or USB tether", price: "₹0–500", note: "Driver's phone or dedicated SIM" },
      { item: "USB OTG + power splitter", price: "₹200", note: "For peripherals" },
      { item: "Vehicle mount bracket", price: "₹200–300", note: "3D printed or fabricated" },
    ],
    pros: [
      "Absolute cheapest entry point",
      "PosterBooking / PiSignage Android app ready",
      "Driver could use the same device for navigation",
      "Easy to replace — commodity hardware",
    ],
    cons: [
      "Android TV sticks are unreliable for 24/7",
      "No GPIO, no hardware expansion",
      "WiFi only on most sticks — no ethernet fallback",
      "Overheating in enclosed auto cabins",
      "OS bloat, random updates can break signage",
    ],
  },
];

const SOFTWARE_OPTIONS = [
  {
    name: "PiSignage",
    cost: "Free (2 screens) / $20/yr per screen",
    features: "Scheduling, groups, remote update, offline playback, analytics",
    best: "Best for RPi-based fleet. Indian company (Colloqi). Great support.",
    url: "pisignage.com",
  },
  {
    name: "Custom Stack (Self-hosted)",
    cost: "Free (your time)",
    features: "Full control: Node.js backend + Chromium kiosk + MQTT for commands",
    best: "Best if you want zero recurring costs and own the entire pipeline.",
    url: "Build it yourself",
  },
  {
    name: "info-beamer",
    cost: "From $7/mo per device",
    features: "Cloud dashboard, geo-fencing, video walls, 12yr RPi support",
    best: "Best for scaling to 100+ screens with enterprise features.",
    url: "info-beamer.com",
  },
  {
    name: "PosterBooking",
    cost: "Free (10 screens)",
    features: "White-label CMS, playlist, scheduling, RPi + Android + Fire TV",
    best: "Best if you want a free CMS with white-label for client-facing.",
    url: "posterbooking.com",
  },
];

const ARCHITECTURE = {
  title: "System Architecture",
  layers: [
    {
      name: "VEHICLE UNIT",
      color: "#00E676",
      components: [
        "SBC (RPi/OrangePi) + Display",
        "4G Modem (always-on or scheduled)",
        "GPS Module (optional, for geo-tracking)",
        "Power Management (12V→5V buck converter + UPS capacitor)",
        "Local content cache (SD card)",
      ],
    },
    {
      name: "CONNECTIVITY",
      color: "#448AFF",
      components: [
        "4G LTE SIM (Jio/Airtel — ₹149–199/mo for 1.5GB/day)",
        "MQTT broker for real-time heartbeat + commands",
        "HTTPS for content sync (pull model, scheduled)",
        "WebSocket for live admin panel updates",
      ],
    },
    {
      name: "CLOUD BACKEND",
      color: "#FF9100",
      components: [
        "VPS (DigitalOcean/Hetzner ₹500–1000/mo)",
        "Content CMS — upload ads, schedule playlists",
        "Device Registry — track online/offline, GPS, uptime",
        "Analytics — ad impressions, screen-on time, proof-of-play",
        "Alert system — device offline, low storage, SIM issues",
      ],
    },
    {
      name: "ADMIN PANEL",
      color: "#E040FB",
      components: [
        "React dashboard (live device map via GPS)",
        "Ad campaign management + scheduling",
        "Real-time device status (online/offline/last seen)",
        "Proof-of-play reports for advertisers",
        "Remote commands: reboot, update content, screenshot",
      ],
    },
  ],
};

const SCHEDULE_LOGIC = `
# 1-Hour Online Window — How It Works

## On the device (cron job or systemd timer):
- Wake 4G modem at scheduled time (e.g., 2 AM)
- Sync new content from server (download queue)
- Send heartbeat + GPS + proof-of-play logs
- Receive any pending commands (reboot, config change)
- Download next day's playlist
- Kill 4G modem after sync complete

## On the admin panel:
- Dashboard shows "Last Sync" timestamp per device
- Alerts if a device misses its sync window
- Queue commands that execute on next sync

## Why this is smart:
- 4G data cost: ~₹149/mo (Jio 1.5GB/day plan)
- 1 hour sync uses maybe 200–500MB depending on content
- Rest of the day: device plays from local cache
- No streaming = no buffering = no dropped ads
`;

const BOM_COMPARISON = {
  headers: ["Component", "Budget (OPi)", "Mid (RPi)", "Android Stick"],
  rows: [
    ["SBC / Player", "₹2,000", "₹5,000", "₹2,000"],
    ["Display 7\"", "₹2,000", "₹5,500", "₹2,000"],
    ["4G Connectivity", "₹700", "₹1,200", "₹300"],
    ["Power Supply", "₹300", "₹300", "₹200"],
    ["Enclosure", "₹400", "₹700", "₹300"],
    ["SD Card / Storage", "₹300", "₹300", "₹0 (built-in)"],
    ["Cables + Misc", "₹200", "₹300", "₹200"],
    ["TOTAL per unit", "₹5,900", "₹12,300", "₹5,000"],
    ["10 units", "₹59,000", "₹1,23,000", "₹50,000"],
    ["50 units", "₹2,95,000", "₹6,15,000", "₹2,50,000"],
  ],
};

const MISTAKES = [
  {
    mistake: "Using flexible/bendable LED panels",
    why: "They need LED controllers, custom PCBs, high current draw (12V+), and look like garbage at close range in a small auto cabin. You're not building Times Square.",
    fix: "Use a standard 7–10\" IPS LCD. Sharp, readable, cheap, low power.",
  },
  {
    mistake: "Raspberry Pi 5 for this project",
    why: "Overkill. You're displaying images and short videos, not running ML models. RPi 5 costs ₹7K–12K for 4GB. The 2GB RPi 4 or Orange Pi does the same job for half.",
    fix: "RPi 4 (2GB) or Orange Pi Zero 3. Save money per unit, scale more vehicles.",
  },
  {
    mistake: "Always-on 4G streaming",
    why: "Streaming ads over 4G = ₹500+/mo data costs per device, buffering issues, and it dies when signal drops in tunnels/basements.",
    fix: "Sync-and-cache model. Download content during 1-hour window, play from local storage all day.",
  },
  {
    mistake: "No power management from vehicle battery",
    why: "Vehicle voltage fluctuates 10V–14.5V. Direct USB will fry your board. Also, auto drivers turn off engines at signals — instant power cut = SD card corruption.",
    fix: "Buck converter (12V→5V) + supercapacitor or small UPS HAT for graceful shutdown on power loss.",
  },
  {
    mistake: "No proof-of-play",
    why: "Advertisers won't pay you if you can't prove their ad actually displayed. Screenshots or logs are table stakes.",
    fix: "Log every ad impression with timestamp + GPS. Optionally take periodic screenshots and upload during sync.",
  },
  {
    mistake: "Ignoring Indian summer heat",
    why: "Inside a parked auto in Bangalore summer = 50°C+. Your RPi will thermal throttle and your LCD will fade or die.",
    fix: "Aluminum enclosure with passive heatsink. Consider auto-sleep when vehicle is stationary for 30+ min. Use industrial-rated SD cards.",
  },
];

export default function CabAdPlan() {
  const [activeTab, setActiveTab] = useState("options");
  const [selectedPlan, setSelectedPlan] = useState("budget");
  const [expandedMistake, setExpandedMistake] = useState(null);

  const tabs = [
    { id: "options", label: "Hardware Options" },
    { id: "architecture", label: "Architecture" },
    { id: "software", label: "Software" },
    { id: "bom", label: "Cost Breakdown" },
    { id: "mistakes", label: "Don't Screw Up" },
    { id: "schedule", label: "Sync Strategy" },
  ];

  const plan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      background: "#0A0A0F",
      color: "#E0E0E0",
      minHeight: "100vh",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-block",
          background: "#00E676",
          color: "#000",
          padding: "4px 12px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          marginBottom: 8,
        }}>
          SYSTEM DESIGN DOCUMENT
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: 4,
        }}>
          Cab & Auto Ad Screen Network
        </h1>
        <p style={{ color: "#666", fontSize: 13 }}>
          DOOH Advertising Platform — Hardware + Software + Admin Panel Blueprint
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #222",
        marginBottom: 24,
        overflowX: "auto",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "#1A1A24" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #00E676" : "2px solid transparent",
              color: activeTab === tab.id ? "#00E676" : "#555",
              padding: "10px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* HARDWARE OPTIONS TAB */}
      {activeTab === "options" && (
        <div>
          {/* Plan selector */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                style={{
                  flex: "1 1 180px",
                  background: selectedPlan === p.id ? "#1A1A24" : "#111",
                  border: selectedPlan === p.id ? `1px solid ${p.color}` : "1px solid #222",
                  borderRadius: 8,
                  padding: 16,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}>
                  <span style={{
                    color: p.color,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>{p.name}</span>
                  <span style={{
                    background: p.color + "22",
                    color: p.color,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 3,
                    letterSpacing: 1,
                  }}>{p.tag}</span>
                </div>
                <span style={{ color: "#888", fontSize: 12 }}>{p.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Selected plan detail */}
          {plan && (
            <div style={{
              background: "#111118",
              border: `1px solid ${plan.color}33`,
              borderRadius: 8,
              padding: 20,
            }}>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: plan.color,
                fontSize: 18,
                marginBottom: 16,
              }}>
                Bill of Materials — {plan.name}
              </h3>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #333" }}>
                      {["Component", "Est. Price (INR)", "Notes"].map((h) => (
                        <th key={h} style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          color: "#666",
                          fontWeight: 600,
                          fontSize: 10,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plan.hardware.map((hw, i) => (
                      <tr key={i} style={{
                        borderBottom: "1px solid #1A1A24",
                        transition: "background 0.15s",
                      }}>
                        <td style={{ padding: "10px 12px", color: "#ccc", fontWeight: 500 }}>{hw.item}</td>
                        <td style={{ padding: "10px 12px", color: plan.color, fontWeight: 600 }}>{hw.price}</td>
                        <td style={{ padding: "10px 12px", color: "#666", fontSize: 11 }}>{hw.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 250px" }}>
                  <div style={{ color: "#00E676", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                    ✓ PROS
                  </div>
                  {plan.pros.map((p, i) => (
                    <div key={i} style={{
                      padding: "6px 0",
                      borderBottom: "1px solid #1a1a24",
                      fontSize: 12,
                      color: "#aaa",
                    }}>
                      {p}
                    </div>
                  ))}
                </div>
                <div style={{ flex: "1 1 250px" }}>
                  <div style={{ color: "#FF5252", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                    ✗ CONS
                  </div>
                  {plan.cons.map((c, i) => (
                    <div key={i} style={{
                      padding: "6px 0",
                      borderBottom: "1px solid #1a1a24",
                      fontSize: 12,
                      color: "#888",
                    }}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Verdict */}
          <div style={{
            marginTop: 20,
            background: "#00E67611",
            border: "1px solid #00E67633",
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ color: "#00E676", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
              MY VERDICT
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#ccc" }}>
              Start with <strong style={{ color: "#fff" }}>Raspberry Pi 4 (2GB)</strong> for your first 5–10 units. The ecosystem support is unbeatable — PiSignage literally works out of the box, and every problem you'll hit has been solved by someone on the forums. Once you've validated the business model and have paying advertisers, switch to <strong style={{ color: "#fff" }}>Orange Pi Zero 3</strong> for units 10–100+ to cut per-unit cost by 40%. The Android stick option is a trap — it seems cheap until you're driving across Bangalore at 2 AM rebooting frozen Fire Sticks.
            </p>
          </div>
        </div>
      )}

      {/* ARCHITECTURE TAB */}
      {activeTab === "architecture" && (
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#fff",
            fontSize: 18,
            marginBottom: 20,
          }}>
            {ARCHITECTURE.title}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ARCHITECTURE.layers.map((layer, idx) => (
              <div key={idx}>
                <div style={{
                  background: "#111118",
                  border: `1px solid ${layer.color}44`,
                  borderRadius: 8,
                  padding: 16,
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: layer.color + "22",
                    color: layer.color,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 3,
                    letterSpacing: 1,
                  }}>
                    LAYER {idx + 1}
                  </div>
                  <div style={{
                    color: layer.color,
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 10,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {layer.name}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {layer.components.map((comp, ci) => (
                      <span key={ci} style={{
                        background: "#0A0A0F",
                        border: "1px solid #222",
                        borderRadius: 4,
                        padding: "6px 10px",
                        fontSize: 11,
                        color: "#aaa",
                      }}>
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
                {idx < ARCHITECTURE.layers.length - 1 && (
                  <div style={{
                    textAlign: "center",
                    color: "#333",
                    fontSize: 18,
                    padding: "4px 0",
                  }}>
                    ↕
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 20,
            background: "#448AFF11",
            border: "1px solid #448AFF33",
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ color: "#448AFF", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
              KEY DESIGN DECISIONS
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: "#aaa" }}>
              <strong style={{ color: "#fff" }}>Pull, don't push.</strong> Devices pull content on schedule. Server never pushes. This means if a device is offline, it just plays cached content — no crashes, no blank screens.<br/>
              <strong style={{ color: "#fff" }}>MQTT for heartbeat only.</strong> Lightweight 50-byte pings every 5 min when online. Admin panel updates in real-time without polling.<br/>
              <strong style={{ color: "#fff" }}>GPS is optional but powerful.</strong> Add a ₹200 GPS module and suddenly you can sell geo-targeted ads: "Show Swiggy ads only when the auto is near Koramangala."<br/>
              <strong style={{ color: "#fff" }}>Proof-of-play is your revenue engine.</strong> Every ad display is logged: timestamp, duration, GPS coordinates. This is what you sell to advertisers.
            </div>
          </div>
        </div>
      )}

      {/* SOFTWARE TAB */}
      {activeTab === "software" && (
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#fff",
            fontSize: 18,
            marginBottom: 20,
          }}>
            Software Stack Options
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SOFTWARE_OPTIONS.map((sw, i) => (
              <div key={i} style={{
                background: "#111118",
                border: "1px solid #222",
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {sw.name}
                    </span>
                    <span style={{
                      marginLeft: 10,
                      background: "#00E67622",
                      color: "#00E676",
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 3,
                      fontWeight: 600,
                    }}>
                      {sw.cost}
                    </span>
                  </div>
                  <span style={{ color: "#555", fontSize: 11 }}>{sw.url}</span>
                </div>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 6 }}>
                  <strong style={{ color: "#aaa" }}>Features:</strong> {sw.features}
                </p>
                <p style={{ fontSize: 12, color: "#448AFF", lineHeight: 1.6 }}>
                  → {sw.best}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 20,
            background: "#FF910011",
            border: "1px solid #FF910033",
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ color: "#FF9100", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
              MY RECOMMENDATION
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#ccc" }}>
              <strong style={{ color: "#fff" }}>Phase 1 (0–10 units):</strong> Use PiSignage. Free for 2 screens, ₹1,700/yr per screen after that. You'll be live in a day. Focus on signing advertisers, not building CMS software.<br/><br/>
              <strong style={{ color: "#fff" }}>Phase 2 (10–50 units):</strong> Build custom. Your admin panel, your proof-of-play, your analytics. Node.js + React + MQTT + PostgreSQL. You'll own the data and the platform.<br/><br/>
              <strong style={{ color: "#fff" }}>Phase 3 (50+ units):</strong> Your custom platform IS the product. License it to other cab ad networks. Now you're a SaaS company, not just an ad network.
            </p>
          </div>
        </div>
      )}

      {/* COST BREAKDOWN TAB */}
      {activeTab === "bom" && (
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#fff",
            fontSize: 18,
            marginBottom: 20,
          }}>
            Cost Comparison — Per Unit & At Scale
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {BOM_COMPARISON.headers.map((h, i) => (
                    <th key={i} style={{
                      textAlign: i === 0 ? "left" : "right",
                      padding: "10px 12px",
                      color: "#666",
                      fontWeight: 600,
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      borderBottom: "1px solid #333",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOM_COMPARISON.rows.map((row, ri) => {
                  const isTotal = row[0].includes("TOTAL") || row[0].includes("units");
                  return (
                    <tr key={ri} style={{
                      borderBottom: "1px solid #1a1a24",
                      background: isTotal ? "#1A1A24" : "transparent",
                    }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          textAlign: ci === 0 ? "left" : "right",
                          padding: "10px 12px",
                          color: isTotal ? "#fff" : (ci === 0 ? "#aaa" : "#888"),
                          fontWeight: isTotal ? 700 : 400,
                          fontSize: isTotal ? 13 : 12,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: 20,
            background: "#111118",
            border: "1px solid #222",
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ color: "#E040FB", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
              RECURRING MONTHLY COSTS PER UNIT
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                { label: "4G SIM Data", cost: "₹149–199/mo", note: "Jio 1.5GB/day plan" },
                { label: "Cloud Server", cost: "₹20–40/unit/mo", note: "Shared VPS amortized" },
                { label: "Signage Software", cost: "₹0–150/unit/mo", note: "Depends on platform" },
                { label: "Maintenance Reserve", cost: "₹100/unit/mo", note: "SD cards, repairs" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#0A0A0F",
                  border: "1px solid #1a1a24",
                  borderRadius: 6,
                  padding: 12,
                }}>
                  <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: "#E040FB", fontSize: 16, fontWeight: 700 }}>{item.cost}</div>
                  <div style={{ color: "#555", fontSize: 10, marginTop: 4 }}>{item.note}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 16,
              padding: 12,
              background: "#E040FB11",
              borderRadius: 6,
              fontSize: 13,
              color: "#ccc",
            }}>
              <strong style={{ color: "#E040FB" }}>Bottom line:</strong> ₹300–500/mo recurring per unit. If each screen earns you ₹3,000–5,000/mo from advertisers, you're looking at 6–10x ROI on operating costs. Unit hardware pays for itself in 2–3 months.
            </div>
          </div>
        </div>
      )}

      {/* MISTAKES TAB */}
      {activeTab === "mistakes" && (
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#FF5252",
            fontSize: 18,
            marginBottom: 20,
          }}>
            Mistakes That Will Kill This Project
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MISTAKES.map((m, i) => (
              <div
                key={i}
                style={{
                  background: "#111118",
                  border: expandedMistake === i ? "1px solid #FF5252" : "1px solid #222",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setExpandedMistake(expandedMistake === i ? null : i)}
              >
                <div style={{
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      color: "#FF5252",
                      fontWeight: 700,
                      fontSize: 11,
                      background: "#FF525222",
                      padding: "2px 8px",
                      borderRadius: 3,
                    }}>#{i + 1}</span>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{m.mistake}</span>
                  </div>
                  <span style={{ color: "#555", fontSize: 16, transition: "transform 0.2s", transform: expandedMistake === i ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                </div>
                {expandedMistake === i && (
                  <div style={{
                    padding: "0 16px 16px",
                    borderTop: "1px solid #222",
                  }}>
                    <div style={{ padding: "12px 0", fontSize: 12, color: "#FF8A80", lineHeight: 1.6 }}>
                      <strong>Why it's bad:</strong> {m.why}
                    </div>
                    <div style={{
                      padding: "10px 12px",
                      background: "#00E67611",
                      border: "1px solid #00E67633",
                      borderRadius: 4,
                      fontSize: 12,
                      color: "#00E676",
                      lineHeight: 1.6,
                    }}>
                      <strong>Fix:</strong> {m.fix}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYNC STRATEGY TAB */}
      {activeTab === "schedule" && (
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#fff",
            fontSize: 18,
            marginBottom: 20,
          }}>
            1-Hour Online Sync Strategy
          </h3>

          <div style={{
            background: "#111118",
            border: "1px solid #222",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
          }}>
            <div style={{ color: "#00E676", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
              SYNC TIMELINE
            </div>
            <div style={{ position: "relative" }}>
              {[
                { time: "02:00 AM", action: "Wake 4G modem", detail: "systemd timer triggers modem power-on via GPIO or USB", color: "#448AFF" },
                { time: "02:01", action: "Heartbeat + Auth", detail: "Device sends ID, GPS, battery status. Server authenticates.", color: "#448AFF" },
                { time: "02:02", action: "Upload logs", detail: "Proof-of-play data, ad impressions, error logs pushed to server", color: "#FF9100" },
                { time: "02:05", action: "Download content", detail: "Pull new ads, playlist schedule, config changes. Delta sync only.", color: "#00E676" },
                { time: "02:30", action: "Execute commands", detail: "Process queued commands: reboot, screenshot, config update", color: "#E040FB" },
                { time: "02:50", action: "Verify + checksum", detail: "Validate downloaded content integrity. Re-download corrupted files.", color: "#FF9100" },
                { time: "03:00", action: "Kill modem. Sleep.", detail: "Modem power off. Device returns to offline playback mode.", color: "#FF5252" },
              ].map((step, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "start",
                  padding: "10px 0",
                  borderLeft: `2px solid ${step.color}44`,
                  marginLeft: 40,
                  paddingLeft: 16,
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    left: -7,
                    top: 12,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: step.color,
                    boxShadow: `0 0 8px ${step.color}66`,
                  }} />
                  <div style={{
                    position: "absolute",
                    left: -64,
                    top: 10,
                    color: "#555",
                    fontSize: 10,
                    fontWeight: 600,
                    width: 50,
                    textAlign: "right",
                  }}>{step.time}</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{step.action}</div>
                    <div style={{ color: "#666", fontSize: 11 }}>{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 12,
          }}>
            {[
              {
                title: "Data Usage Per Sync",
                value: "200–500 MB",
                detail: "Depends on content type. Images: ~50MB. Videos: ~300MB. Config: <1MB.",
                color: "#448AFF",
              },
              {
                title: "Monthly 4G Cost",
                value: "₹149–199",
                detail: "Jio 1.5GB/day plan covers sync easily. Airtel ₹199 for 1.5GB/day.",
                color: "#00E676",
              },
              {
                title: "Offline Playback",
                value: "23 hours/day",
                detail: "Content plays from local SD card. No network = no problem. No buffering.",
                color: "#FF9100",
              },
            ].map((card, i) => (
              <div key={i} style={{
                background: "#111118",
                border: `1px solid ${card.color}33`,
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ color: "#666", fontSize: 11, marginBottom: 6 }}>{card.title}</div>
                <div style={{ color: card.color, fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>
                  {card.value}
                </div>
                <div style={{ color: "#555", fontSize: 11, lineHeight: 1.5 }}>{card.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 32,
        paddingTop: 16,
        borderTop: "1px solid #1a1a24",
        fontSize: 11,
        color: "#333",
        textAlign: "center",
      }}>
        CAB AD NETWORK — SYSTEM DESIGN v1.0 — BANGALORE, INDIA
      </div>
    </div>
  );
}