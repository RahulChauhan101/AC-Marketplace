export default function BrandLogo({ className = "", suffix = "" }) {
  return (
    <div className={`brand ${className}`.trim()}>
      <span className="brand-mark">SW</span>
      <span className="brand-name">
        <span className="brand-accent">S</span>ervice
        <span className="brand-accent">W</span>ale
        {suffix ? <span className="brand-suffix">{suffix}</span> : null}
      </span>
    </div>
  );
}
