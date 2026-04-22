export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">

      <div className="h-32 bg-white/20 rounded"></div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/20 rounded"></div>
        ))}
      </div>

    </div>
  );
}