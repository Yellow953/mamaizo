import Image from "next/image";
import Link from "next/link";
import { tartan as c } from "@/lib/content";

type Product = (typeof c.products)[number];

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link className="t-product" href={`/design2/shop/${p.slug}`}>
      <div className="t-photo t-photo--wide">
        <Image src={p.photo} alt={p.alt} fill sizes="(max-width: 700px) 92vw, 33vw" style={{ objectPosition: p.focus }} />
      </div>
      <div className="t-product-body">
        <p className="t-product-cat">{p.category}</p>
        <h3 className="t-display t-card-title">{p.name}</h3>
        <p className="t-muted">{p.text}</p>
        <p className="t-product-foot t-link">{c.pots.view} ←</p>
      </div>
    </Link>
  );
}
