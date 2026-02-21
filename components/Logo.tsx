export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-primary to-accent">
          YCM
        </span>
      </div>
    </div>
  );
}
