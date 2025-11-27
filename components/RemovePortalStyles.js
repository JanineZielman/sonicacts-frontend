import { useEffect } from "react";

const RemovePortalStyles = () => {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const isBiennial2026 = window.location.pathname.startsWith("/biennial/biennial-2026");
    if (!isBiennial2026) return;

    // Remove all <style> tags without data attributes
    const styles = Array.from(document.head.querySelectorAll("style"))
      .filter(style => !Array.from(style.attributes).some(attr => attr.name.startsWith("data-")));

    styles.forEach(style => style.remove());
  }, []);

  return null;
};

export default RemovePortalStyles;
