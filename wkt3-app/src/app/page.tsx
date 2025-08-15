import AuthModal from "@/components/AuthModal";
import QuotesRotator from "@/components/QuotesRotator";

export default function Page() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl p-6 shadow-sm bg-gradient-to-r from-wkt3-50 to-wkt3-100">
        <h1 className="text-3xl font-bold">Welcome to WKT3</h1>
        <p className="text-sm text-slate-700">
          AI trading + multi-game platform
        </p>
        <div className="mt-4">
          <QuotesRotator />
        </div>
      </div>

      <AuthModal />
      <div>— future: Game cards, Live matches, Leaderboards —</div>
    </section>
  );
}
