import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import BusinessDashboard from "@/components/BusinessDashboard";
import ProDashboard from "@/components/ProDashboard";
import PersonalDashboard from "@/components/PersonalDashboard";
import EnginesLab from "@/components/EnginesLab";
import type { AppMode } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ديكور AI — تصميم الواجهات والديكور الداخلي بالذكاء الاصطناعي" },
      {
        name: "description",
        content:
          "ارفع صورة واجهتك أو غرفتك واكتب طلبك بالعربية لتحصل على تصميم جديد فوراً: واجهات، كلادنج، نيون، وتجديد المنازل.",
      },
      { property: "og:title", content: "ديكور AI — تصميم بالذكاء الاصطناعي" },
      {
        property: "og:description",
        content: "تصميم واجهات المحال وتجديد المنازل بنقرة واحدة، بالعربية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mode, setMode] = useState<AppMode | null>(null);
  const [showLab, setShowLab] = useState(false);

  if (showLab) return <EnginesLab onBack={() => setShowLab(false)} />;
  if (mode === "business") return <BusinessDashboard onBack={() => setMode(null)} />;
  if (mode === "pro") return <ProDashboard onBack={() => setMode(null)} />;
  if (mode === "personal") return <PersonalDashboard onBack={() => setMode(null)} />;

  return <LandingPage onSelect={setMode} onOpenLab={() => setShowLab(true)} />;
}
