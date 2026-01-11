import { GreetingWidget } from "@/widgets/greeting-widget";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Full-Stack App
      </h1>
      <GreetingWidget />
    </div>
  );
}
