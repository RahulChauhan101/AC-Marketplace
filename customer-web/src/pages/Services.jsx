import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import { services } from "../services/serviceTypes";

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="AC services for homes, shops and offices."
        description="Choose the service you need and book a verified AC professional with clear status tracking."
      />

      <section className="py-12">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="card flex flex-col p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 font-black text-brand-700">
                {service.title.charAt(0)}
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">{service.title}</h2>
              <p className="mt-3 flex-1 leading-7 text-slate-600">{service.description}</p>
              <p className="mt-5 font-bold text-brand-700">{service.price}</p>
              <Link to={`/booking?serviceType=${service.id}`} className="btn-primary mt-6">
                Book {service.title}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
