import { HealthCheckButton } from "@/features/health-check";

export function GreetingWidget() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Welcome
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Next.js 15 + Go + PostgreSQL
      </p>
      <HealthCheckButton />
    </div>
  );
}
