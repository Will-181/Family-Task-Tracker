import { Header } from "@/components/header";
import { DashboardContent } from "./dashboard-content";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DashboardContent />
    </div>
  );
}
