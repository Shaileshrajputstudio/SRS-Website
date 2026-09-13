// "Design Democracy" is a real, named upcoming show (from the studio's own
// brief) whose venue/date aren't confirmed yet, so those two fields stay
// placeholder text even though the entry itself is real. The "Past" press
// entries below are real coverage, fetched directly from each publication
// (title/date/author confirmed from the live article).
export type PressEntry = {
  title: string;
  venue: string;
  year: string;
  status: "Upcoming" | "Past";
  // Exhibition = a physical show/fair the studio participated in as an
  // exhibitor. Press = a publication writing about the studio. These are
  // genuinely different kinds of entries (not just past/upcoming), so the
  // page's two tabs split on this field.
  category: "Exhibition" | "Press";
  placeholder: boolean;
  description: string;
  url?: string;
  // Overrides the generic placeholder thumbnail with one of the studio's
  // own real photos, when the piece a feature covers is known.
  image?: string;
  // Additional photos for this exhibition's click-through gallery
  // (ExhibitionCard). Optional — when omitted, the gallery falls back to
  // just `image` as a single-photo set, and a placeholder entry with
  // neither ends up with nothing to show, so its card isn't clickable.
  images?: string[];
  // The publication's own real logo (downloaded from their live site) —
  // shown instead of `image` on the Press tab for credibility. Rendered
  // with object-contain on a white card, never stretched/recolored.
  logo?: string;
};

export const pressEntries: PressEntry[] = [
  {
    title: "Design Democracy",
    venue: "TBD",
    year: "2026",
    status: "Upcoming",
    category: "Exhibition",
    placeholder: true,
    description:
      "The studio's next milestone show, details to be confirmed as the exhibition approaches.",
  },
  {
    title: "ID Exhibit — Collectible",
    venue: "Asian Paints India Design (AND) 2026",
    year: "2026",
    status: "Upcoming",
    category: "Exhibition",
    placeholder: false,
    description:
      "The studio's wall-mounted collectible sculpture, shown as part of ID Exhibit, an Ogaan Media initiative at Asian Paints India Design 2026.",
    image: "/images/press/asian-paints-id-exhibit-2026.jpg",
  },
  {
    title: "From Rudraksha Beads to Vishnu's Tortoise: Inside Sama:Yantar, a Narrative-Led Lighting Collection",
    venue: "The New Indian Express",
    year: "2026",
    status: "Past",
    category: "Press",
    placeholder: false,
    description:
      "A feature on the Sama:Yantar collection: Rudrak:Sha Mala, Math:Than, and Ku:Rma, sculptural lamps drawing from Indian mythology, hand-shaped without fixed moulds.",
    url: "https://www.newindianexpress.com/magazine/2026/Sep/06/from-rudraksha-beads-to-vishnus-tortoise-inside-samayantar-a-narrative-led-lighting-collection",
    image: "/images/collections/sama-yantar-cover.jpg",
    logo: "/images/press/logos/tnie.svg",
  },
  {
    title: "Inside a Multigenerational Navsari Home Rooted in Local Materials and Craftsmanship",
    venue: "Interior Design",
    year: "2026",
    status: "Past",
    category: "Press",
    placeholder: false,
    description:
      "A 12,000-square-foot home by Design ni Dukaan, built with over 20 Indian artisans and designers. The studio's mirror and sconces, in epoxy and aluminium, hang in the foyer.",
    url: "https://interiordesign.net/projects/design-ni-dukaan-navsari-home/",
    image: "/images/products/eraya-i/1.jpg",
    logo: "/images/press/logos/interior-design.svg",
  },
  {
    title: "Shailesh Rajput Studio",
    venue: "Platform Magazine",
    year: "2026",
    status: "Past",
    category: "Press",
    placeholder: false,
    description:
      "A profile on how the studio merges functionality with emotional narrative, drawing from nature, Indian cultural tradition, and storytelling.",
    url: "https://www.platform-mag.com/design/shailesh-rajput-studio.html",
    logo: "/images/press/logos/platform-magazine.svg",
  },
  {
    title: "Shailesh Rajput Studio",
    venue: "Design Pataki — DP Cult",
    year: "2026",
    status: "Past",
    category: "Press",
    placeholder: false,
    description:
      "A brand profile on the studio's handcrafted lighting, furniture, and sculpture: hand-blown glass, copper, and brass, shaped by Maharashtrian jewellery and yogic form.",
    url: "https://www.designpataki.com/dp-cult/shailesh-rajput/",
    logo: "/images/press/logos/design-pataki.svg",
  },
];
