const ICONS = {
  success: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3a9 9 0 100 18A9 9 0 0012 3z" />
    </svg>
  ),
};

const TYPE_STYLES = {
  success: 'border-green-500/40 bg-green-500/10 text-green-400',
  error: 'border-red-500/40 bg-red-500/10 text-red-400',
  info: 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
};

const Toast = ({ message, type = 'info' }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl animate-slide-up ${TYPE_STYLES[type]}`}>
    {ICONS[type]}
    <span>{message}</span>
  </div>
);

const ToastContainer = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
    {toasts.map((t) => (
      <Toast key={t.id} message={t.message} type={t.type} />
    ))}
  </div>
);

export { Toast, ToastContainer };
