import NotFoundContent from "@/components/NotFoundContent";
import SiteChrome from "@/components/SiteChrome";

// Unmatched URLs render outside the (site) layout, so this adds the site chrome itself
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
