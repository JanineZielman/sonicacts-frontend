import { useEffect } from "react";
import { useRouter } from "next/router";

const RemovePortalStyles = () => {
  const router = useRouter();

  useEffect(() => {
    // Wait until the component is mounted and router is ready
    if (!router?.pathname) return;

    const isBiennial2026 = router.pathname.startsWith("/biennial/biennial-2026");
    if (!isBiennial2026) return;

    // Small delay to ensure all <style> tags are rendered
    const timer = setTimeout(() => {
      const styles = Array.from(document.head.querySelectorAll("style"))
        .filter(style => !Array.from(style.attributes).some(attr => attr.name.startsWith("data-")));

      styles.forEach(style => style.remove());
    }, 50); // 50ms delay is usually enough

    return () => clearTimeout(timer);
  }, [router]);

  return null;
};

export default RemovePortalStyles;
