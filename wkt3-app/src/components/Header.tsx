import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wkt3-500 rounded-full flex items-center justify-center text-white font-bold">
            W
          </div>
          <div>
            <div className="font-semibold">WKT3</div>
            <div className="text-xs text-slate-500">Trading + Games</div>
          </div>
        </div>
        <nav className="flex gap-4">
          <Link href="/auth/login" className="text-sm">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
