import { useEffect, useState } from "react";
import { Download, Smartphone, Share2, Plus, X } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

const DISMISS_KEY = "pwa-install-dismissed";

export default function InstallBanner() {
  const { canInstall, showIosGuide, isStandalone, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);
  const [stepsOpen, setStepsOpen] = useState(false);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (isStandalone || dismissed) return null;
  if (!canInstall && !showIosGuide) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4" dir="rtl">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card/95 p-4 shadow-lg shadow-black/40 backdrop-blur">
        {canInstall ? (
          <>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">ثبّت التطبيق على هاتفك</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  وصول أسرع من الشاشة الرئيسية وتجربة كاملة بوضع ملء الشاشة.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="إغلاق"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              تثبيت التطبيق
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">أضف التطبيق إلى الشاشة الرئيسية</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  ثبّت ديكور AI على جهازك للوصول السريع في أي وقت.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="إغلاق"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {showIosSteps ? (
              <button
                type="button"
                onClick={() => setStepsOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                كيف أثبّت على الآيفون؟
              </button>
            ) : (
              <ol className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Share2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                  اضغط زر المشاركة في أسفل متصفح Safari.
                </li>
                <li className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5 shrink-0 text-primary" />
                  اختر «إضافة إلى الشاشة الرئيسية» ثم «إضافة».
                </li>
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  );
}
