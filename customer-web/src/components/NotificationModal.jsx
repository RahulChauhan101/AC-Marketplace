export default function NotificationModal({
  confirmLabel = "OK",
  message,
  onClose,
  open,
  title,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true">
        <h3 className="modal-title">{title}</h3>
        <p className="text-slate-600">{message}</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose} type="button">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
