import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { services } from "../services/serviceTypes";

export default function SearchServicemen() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ city: "", pincode: "", serviceType: "" });
  const [servicemen, setServicemen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchServicemen = async (nextFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/servicemen", { params: nextFilters });
      setServicemen(data.data.servicemen);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load servicemen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicemen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchServicemen();
  };

  const useMyAddress = () => {
    const nextFilters = {
      ...filters,
      city: user?.address?.city || "",
      pincode: user?.address?.pincode || "",
    };

    setFilters(nextFilters);
    fetchServicemen(nextFilters);
  };

  return (
    <>
      <PageHeader
        eyebrow="Nearby servicemen"
        title="Find available servicemen near you."
        description="Search by pincode, city and service type. Exact pincode matches appear first."
      />

      <section className="py-12">
        <div className="container-page">
          <form onSubmit={handleSubmit} className="card grid gap-4 p-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              className="input"
              placeholder="City, e.g. Ahmedabad"
              value={filters.city}
              onChange={(event) => setFilters({ ...filters, city: event.target.value })}
            />
            <input
              className="input"
              placeholder="Pincode, e.g. 382350"
              value={filters.pincode}
              onChange={(event) => setFilters({ ...filters, pincode: event.target.value })}
            />
            <select
              className="input"
              value={filters.serviceType}
              onChange={(event) =>
                setFilters({ ...filters, serviceType: event.target.value })
              }
            >
              <option value="">All services</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.logo} {service.title}
                </option>
              ))}
            </select>
            <button className="btn-primary" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {user?.address && (
            <button onClick={useMyAddress} className="btn-secondary mt-4">
              Use my saved address
            </button>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {servicemen.map((serviceman) => (
              <article key={serviceman._id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">{serviceman.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {serviceman.serviceArea?.city || "Service area not listed"}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    Available
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-brand-700">
                  {serviceman.nearbyMatch === "pincode"
                    ? "Nearest match: your pincode"
                    : serviceman.nearbyMatch === "city"
                      ? "Nearby match: your city"
                      : "Available serviceman"}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(serviceman.serviceCategories || []).map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-sm text-slate-600">
                  Phone: {serviceman.phone || "Shared after booking"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Pincodes:{" "}
                  {serviceman.serviceArea?.pincodes?.length
                    ? serviceman.serviceArea.pincodes.join(", ")
                    : "Not listed"}
                </p>
                <Link to="/booking" className="btn-primary mt-6 w-full">
                  Book Service
                </Link>
              </article>
            ))}
          </div>

          {!loading && servicemen.length === 0 && (
            <div className="card mt-8 p-8 text-center text-slate-600">
              No servicemen found. Try a different pincode, city or service type.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
