import Stage from "@/components/Stage";
import Overlay from "@/components/Overlay";
import ScrollDriver from "@/components/ScrollDriver";
import { INSTAGRAM_URL, WHATSAPP_URL, brand, nav } from "@/lib/content";

export default function Home() {
  return (
    <>
      <nav className="nav">
        <a className="logo" href="#" aria-label={nav.home}>
          {brand.name}
        </a>
        <div className="nav-links">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            {nav.instagram}
          </a>
          <a className="nav-order" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            {nav.order}
          </a>
        </div>
      </nav>

      <main>
        <div id="spacer" aria-hidden="true" />
        <div className="stage">
          <Stage />
          <Overlay />
        </div>
      </main>

      <ScrollDriver />
    </>
  );
}
