export const SERVICE_LOGOS = {
  installation: "🔧",
  repair: "🛠️",
  maintenance: "🧰",
  "gas-refill": "⛽",
  inspection: "🔍",
  "electronics-repair": "📱",
  "tv-repair": "📺",
  "fridge-repair": "🧊",
  "ac-repair": "❄️",
  "cooler-repair": "💨",
  "fan-repair": "🌀",
  "microwave-oven-repair": "🍳",
  "light-repair": "💡",
  electrician: "⚡",
  "water-purifier-repair": "💧",
  plumber: "🔩",
  "gas-stove-repair": "🔥",
};

export const services = [
  {
    id: "installation",
    title: "AC Installation",
    description: "Professional split, window and commercial AC installation with quality checks.",
    price: "From ₹1,499",
    logo: SERVICE_LOGOS.installation,
  },
  {
    id: "repair",
    title: "AC Repair",
    description: "Fast diagnosis and repair for cooling issues, noise, leakage and electrical faults.",
    price: "From ₹499",
    logo: SERVICE_LOGOS.repair,
  },
  {
    id: "maintenance",
    title: "AC Maintenance",
    description: "Deep cleaning, filter service, coil cleaning and preventive inspection.",
    price: "From ₹699",
    logo: SERVICE_LOGOS.maintenance,
  },
  {
    id: "gas-refill",
    title: "Gas Refill",
    description: "Refrigerant leak checks and gas refill service from verified technicians.",
    price: "From ₹1,999",
    logo: SERVICE_LOGOS["gas-refill"],
  },
  {
    id: "inspection",
    title: "AC Inspection",
    description: "Detailed health check before summer, purchase, move-in or warranty work.",
    price: "From ₹299",
    logo: SERVICE_LOGOS.inspection,
  },
  {
    id: "electronics-repair",
    title: "Electronics Repair",
    description: "Repair support for common home electronics issues and component faults.",
    price: "From ₹399",
    logo: SERVICE_LOGOS["electronics-repair"],
  },
  {
    id: "tv-repair",
    title: "TV Repair",
    description: "LED, LCD and smart TV diagnosis, display, sound and power issue repair.",
    price: "From ₹499",
    logo: SERVICE_LOGOS["tv-repair"],
  },
  {
    id: "fridge-repair",
    title: "Fridge Repair",
    description: "Cooling, compressor, gas leakage and thermostat repair for refrigerators.",
    price: "From ₹599",
    logo: SERVICE_LOGOS["fridge-repair"],
  },
  {
    id: "ac-repair",
    title: "AC Repair Service",
    description: "Dedicated AC repair for cooling, leakage, noise and electrical problems.",
    price: "From ₹499",
    logo: SERVICE_LOGOS["ac-repair"],
  },
  {
    id: "cooler-repair",
    title: "Cooler Repair",
    description: "Water pump, motor, wiring and cooling pad service for air coolers.",
    price: "From ₹299",
    logo: SERVICE_LOGOS["cooler-repair"],
  },
  {
    id: "fan-repair",
    title: "Fan Repair",
    description: "Ceiling, table and exhaust fan repair, regulator replacement and wiring fixes.",
    price: "From ₹199",
    logo: SERVICE_LOGOS["fan-repair"],
  },
  {
    id: "microwave-oven-repair",
    title: "Microwave Oven Repair",
    description: "Heating, turntable, panel and power issue repair for microwave ovens.",
    price: "From ₹499",
    logo: SERVICE_LOGOS["microwave-oven-repair"],
  },
  {
    id: "light-repair",
    title: "Light Repair",
    description: "LED, tube light, holder, switch and wiring repair for lighting issues.",
    price: "From ₹199",
    logo: SERVICE_LOGOS["light-repair"],
  },
  {
    id: "electrician",
    title: "Electrician",
    description: "Switchboard, wiring, MCB, socket and basic electrical maintenance service.",
    price: "From ₹299",
    logo: SERVICE_LOGOS.electrician,
  },
  {
    id: "water-purifier-repair",
    title: "Water Purifier Repair",
    description: "RO/UV filter, pump, leakage and water taste issue diagnosis and repair.",
    price: "From ₹399",
    logo: SERVICE_LOGOS["water-purifier-repair"],
  },
  {
    id: "plumber",
    title: "Plumber",
    description: "Tap, leakage, flush, pipe fitting and general plumbing service.",
    price: "From ₹299",
    logo: SERVICE_LOGOS.plumber,
  },
  {
    id: "gas-stove-repair",
    title: "Gas Stove Repair",
    description: "Burner, knob, leakage and ignition repair for gas stoves.",
    price: "From ₹299",
    logo: SERVICE_LOGOS["gas-stove-repair"],
  },
];

export const serviceTypes = services.map(({ id, title, logo }) => ({
  id,
  label: title,
  logo,
}));

export const getServiceLogo = (serviceId) => SERVICE_LOGOS[serviceId] || "🛠️";

export const getServiceLabel = (serviceId) => {
  const match = serviceTypes.find((service) => service.id === serviceId);
  return match?.label || serviceId;
};
