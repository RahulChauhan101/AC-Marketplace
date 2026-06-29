import { Link } from "react-router-dom";

import BrandLogo from "../components/BrandLogo";
import { services } from "../services/serviceTypes";

const stats = [
  ["2 hour", "average response"],
  ["4.8/5", "customer rating"],
  ["100%", "verified partners"],
];

const bookingSteps = [
  { label: "Select service", to: "/services" },
  { label: "Choose schedule", to: "/booking" },
  { label: "Track booking", to: "/bookings" },
];

export default function Home() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4">
              <BrandLogo />
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
              Book trusted service professionals near you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              ServiceWale connects customers with verified servicemen for repair,
              installation, maintenance, plumbing, electrical and appliance services.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/booking" className="btn-primary">
                Book a Service
              </Link>
              <Link to="/servicemen" className="btn-secondary">
                Search Nearby Servicemen
              </Link>
            </div>
          </div>

          <div className="card relative p-6">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-sm text-orange-200">Live booking estimate</p>
              <h2 className="mt-3 text-3xl font-black">Need a trusted technician?</h2>
              <p className="mt-3 text-slate-300">
                Get an expert visit scheduled today with upfront pricing and status tracking.
              </p>
              <div className="mt-6 space-y-3">
                {bookingSteps.map((step, index) => (
                  <Link
                    key={step.label}
                    to={step.to}
                    className="flex items-center gap-3 rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-400 text-sm font-black text-slate-950">
                      {index + 1}
                    </span>
                    <span className="font-semibold">{step.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {stats.map(([value, label]) => (
            <div key={label} className="card p-6 text-center">
              <p className="text-3xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
                Popular services
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Everything your home needs
              </h2>
            </div>
            <Link to="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <article key={service.id} className="card p-6">
                <h3 className="text-xl font-black text-slate-950">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
                <p className="mt-5 font-bold text-brand-700">{service.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
