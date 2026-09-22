/**
 * Registers the offline service worker.
 *
 * Guarded: never registers in the dev server or Lovable preview contexts,
 * so previews can never serve stale cached HTML. Runs only on the
 * published production site.
 */
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;

  const host = window.location.hostname;
  const isPreview = host === "localhost" || host === "127.0.0.1" || host.includes("preview");
  if (isPreview) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // Activate a waiting worker immediately on updates.
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              installing.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
  });
}
