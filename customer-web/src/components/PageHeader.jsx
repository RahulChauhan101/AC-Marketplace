export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="bg-white py-12">
      <div className="container-page">
        {eyebrow && (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        )}
      </div>
    </section>
  );
}
