import { ArrowRight, Palette, Layers, Box, Sliders, Download, Check, Loader2, FileImage, Paintbrush, Wand2, AlertCircle, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import UploadZone from "./UploadZone";
import MaskCanvas, { type MaskCanvasHandle } from "./MaskCanvas";
import { processImage, type ProcessResult } from "@/utils/imageProcessor";

interface ProDashboardProps {
  onBack: () => void;
}

const LAYERS = [
  { name: "الخلفية (Background)", visible: true, opacity: 100 },
  { name: "الجدران (Walls)", visible: true, opacity: 90 },
  { name: "الأثاث (Furniture)", visible: true, opacity: 85 },
  { name: "الإضاءة (Lighting)", visible: true, opacity: 70 },
  { name: "الإكسسوارات (Decor)", visible: false, opacity: 60 },
  { name: "الظلال (Shadows)", visible: true, opacity: 50 },
];

const MATERIALS = [
  { name: "خشب طبيعي", color: "from-amber-700 to-amber-900" },
  { name: "رخام أبيض", color: "from-slate-200 to-slate-400" },
  { name: "حجر رملي", color: "from-orange-300 to-orange-600" },
  { name: "زجاج ملون", color: "from-cyan-400 to-blue-600" },
  { name: "خرسانة معرّضة", color: "from-gray-400 to-gray-600" },
  { name: "ذهبي لامع", color: "from-yellow-400 to-amber-600" },
];

export default function ProDashboard({ onBack }: ProDashboardProps) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [activeTab, setActiveTab] = useState<"layers" | "materials">("layers");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showMask, setShowMask] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maskRef = useRef<MaskCanvasHandle>(null);

  const handleGenerate = async () => {
    if (!imageUrl) {
      setError("ارفع صورة الأول");
      return;
    }
    setError(null);
    setGenerating(true);
    setResult(null);
    try {
      const maskDataUrl = hasMask ? maskRef.current?.getMaskDataUrl() ?? null : null;
      const res = await processImage({
        imageUrl,
        prompt,
        mode: "pro",
        maskDataUrl,
      });
      setResult(res);
    } catch {
      setError("حصل خطأ أثناء معالجة الصورة — حاول تاني");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-700/60 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium text-blue-400">استوديو المصممين المحترفين</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">استوديو التصميم الاحترافي PSD & 3D</h2>
            <p className="text-slate-400 text-sm mt-1">ارفع الصورة واكتب وصفك — هنطبق التعديلات بطبقات احترافية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 shadow-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <UploadZone
              accent="blue"
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              generating={generating}
              promptPlaceholder="مثال: غرفة معيشة مودرن بإضاءة دافئة وخشب طبيعي"
              generateLabel="توليد بالطبقات"
              imageUrl={imageUrl ?? undefined}
              onImageChange={(url) => {
                setImageUrl(url);
                setShowMask(false);
                setResult(null);
                setError(null);
              }}
            />

            {/* Export options */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-slate-500 mb-2">صيغ التصدير المتاحة:</p>
              {[
                { label: "PSD — طبقات منفصلة", icon: Layers },
                { label: "FBX — مجسم ثلاثي الأبعاد", icon: Box },
                { label: "PNG — دقة عالية", icon: FileImage },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <div key={opt.label} className="flex items-center gap-3 bg-slate-950/60 rounded-xl px-4 py-2.5 border border-slate-800/60">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">{opt.label}</span>
                    <Check className="w-4 h-4 text-blue-400 mr-auto" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Canvas + Tools */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 shadow-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {/* Mask toggle */}
              {imageUrl && !generating && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/60">
                  <button
                    onClick={() => setShowMask(!showMask)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      showMask
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-blue-400 hover:border-blue-500/30"
                    }`}
                  >
                    <Paintbrush className="w-4 h-4" />
                    {showMask ? "إخفاء أداة التحديد" : "تحديد منطقة للتعديل"}
                  </button>
                  {hasMask && (
                    <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full animate-fade-in">
                      <Check className="w-3.5 h-3.5" />
                      منطقة محددة
                    </span>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {showMask && imageUrl ? (
                <MaskCanvas ref={maskRef} imageUrl={imageUrl} accent="blue" onMaskChange={setHasMask} />
              ) : generating ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  <p className="text-slate-400">
                    {hasMask ? "جاري تعديل المنطقة المحددة بالطبقات..." : "جاني معالجة الصورة وتوليد الطبقات..."}
                  </p>
                  <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 shimmer rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">معاينة قبل وبعد</h3>
                    <span className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                      <Check className="w-3.5 h-3.5" /> جاهز للتصدير
                    </span>
                  </div>

                  {/* Before / After */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">الصورة الأصلية</span>
                      <div className="rounded-2xl overflow-hidden border border-slate-700/60">
                        <img src={imageUrl!} alt="الأصلية" className="w-full h-48 object-cover" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-blue-400 flex items-center gap-1">
                        بعد التعديل <Sparkles className="w-3 h-3" />
                      </span>
                      <div className="rounded-2xl overflow-hidden border border-blue-500/30">
                        <img src={result.outputDataUrl} alt="النتيجة" className="w-full h-48 object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Applied effects */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">التعديلات المطبقة:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.appliedEffects.map((eff) => (
                        <span key={eff} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                          {eff}
                        </span>
                      ))}
                      {result.regionMode && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                          تعديل جزئي (منطقة محددة)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={result.outputDataUrl}
                      download="pro-output.jpg"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      تحميل النتيجة
                    </a>
                    <button className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                      <Box className="w-4 h-4" />
                      تصدير PSD + FBX
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-600">
                    {imageUrl ? <Wand2 className="w-8 h-8" /> : <Palette className="w-8 h-8" />}
                  </div>
                  <p className="text-slate-500 text-sm max-w-xs">
                    {imageUrl
                      ? "حدد منطقة للتعديل الجزئي، أو اكتب وصفك واضغط توليد لتطبيق التعديلات على الصورة"
                      : "ارفع الصورة واكتب وصف التصميم، وهنطبق التعديلات بطبقات احترافية"}
                  </p>
                </div>
              )}
            </div>

            {/* Tools panel */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("layers")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "layers" ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : "text-slate-400 border border-slate-800 hover:text-slate-200"}`}
                >
                  <Layers className="w-4 h-4" />
                  الطبقات
                </button>
                <button
                  onClick={() => setActiveTab("materials")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "materials" ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : "text-slate-400 border border-slate-800 hover:text-slate-200"}`}
                >
                  <Sliders className="w-4 h-4" />
                  الخامات والمواد
                </button>
              </div>

              {activeTab === "layers" ? (
                <div className="space-y-2">
                  {LAYERS.map((layer) => (
                    <div key={layer.name} className="flex items-center gap-3 bg-slate-950/60 rounded-xl px-4 py-2.5 border border-slate-800/60">
                      <button className={`w-4 h-4 rounded border ${layer.visible ? "bg-blue-500 border-blue-500" : "border-slate-600"} flex items-center justify-center`}>
                        {layer.visible && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span className={`text-sm flex-1 ${layer.visible ? "text-slate-200" : "text-slate-600"}`}>{layer.name}</span>
                      <div className="flex items-center gap-2 w-28">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${layer.opacity}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-left">{layer.opacity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => setPrompt((prev) => (prev ? prev + " " + mat.name : mat.name))}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-blue-500/40 transition-colors"
                    >
                      <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${mat.color} group-hover:scale-105 transition-transform`} />
                      <span className="text-xs text-slate-400">{mat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
