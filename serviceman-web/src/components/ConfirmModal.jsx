export default function ConfirmModal({
  cancelLabel = "No",
  confirmLabel = "Yes",
  message,
  onCancel,
  onConfirm,
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
        <p className="muted">{message}</p>
        <div className="modal-actions">
          <button className="btn secondary" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button className="btn orange" onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
