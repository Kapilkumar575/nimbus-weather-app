export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-500 px-4 py-2 rounded text-white flex gap-2">
      ⚠ {message}
      <button onClick={onDismiss}>✕</button>
    </div>
  );
}