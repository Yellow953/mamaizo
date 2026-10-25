// All site copy lives here. Placeholder text until the client sends the real copy.

// TODO: set the real number, format https://wa.me/961XXXXXXXX
export const WHATSAPP_URL = "https://wa.me/961XXXXXXXX";
export const INSTAGRAM_URL = "https://www.instagram.com/mamaizocooks/";
export const TIKTOK_URL = "https://www.tiktok.com/@mamaizo";

// Arabic first, RTL ("Tartan" design)
export const tartan = {
  meta: {
    title: "ماما إيزو · طبخ صحّي بدقايق",
    description: "طبخ صحّي بدقايق، بطنجرة وحدة وبلا زيت. احجزي جلسة طبخ مجانية مع ماما إيزو.",
  },
  name: "ماما إيزو",
  nav: {
    home: "الرئيسية",
    shop: "المتجر",
    recipes: "الوصفات",
    team: "انضمّي لفريقي",
    contact: "تواصلي معي",
    session: "احجزي جلسة مجانية",
    menu: "القائمة",
    close: "سكّري",
  },
  hero: {
    badge: "ملكة AMC ٢٠٢٣ – ٢٠٢٥",
    title: "طبخ صحّي",
    titleAccent: "بدقايق.",
    body: "بطنجرة وحدة، بلا زيت، وبلا تعب. بساعد الإمّهات المشغولين يحطّوا أكل طيّب وصحّي عالسفرة بوقت أقل.",
    primary: "احجزي جلسة طبخ مجانية",
    secondary: "شوفي الطناجر",
    photo: "/images/hero.jpg",
    photoAlt: "ماما إيزو حاملة طنجرة ستانلس ستيل",
    stat: "80%",
    statLabel: "وقت أقل",
  },
  promises: ["طنجرة وحدة", "بلا زيت", "مَي أقل", "بلا ستريس"],
  generations: {
    title: "كل جيل إلو طريقته،",
    accent: "بس الطعمة اللي بتجمعنا وحدة.",
    items: [
      { who: "تيتا", text: "بتعرف المقادير «عالعين»." },
      { who: "الماما", text: "بتلفّ ورق العنب وهيّ عم تحكي عالتلفون." },
      { who: "وإنتِ", text: "بعدك عم تعيدي الريل… ومع ماما إيزو بتخلصي بنص الوقت." },
    ],
  },
  pots: {
    title: "الطناجر",
    more: "كل الطناجر",
    view: "شوفي التفاصيل",
  },
  // Shared by the home page, the shop and the product pages. Never add prices.
  // TODO: real product names and details from the client. Photos are Instagram reel covers for now.
  // focus is the object-position used to crop each tall reel cover into a wide card.
  products: [
    {
      slug: "everyday-pot",
      name: "[اسم الطنجرة]",
      category: "طناجر",
      text: "للطبخ اليومي: رز، يخنة، وطبخة كاملة سوا.",
      description: "الطنجرة اللي ما بتفلّ عن الغاز. بتطبخي فيها الرز واليخنة والخضرة سوا، بلا زيت وبمَي قليلة، وبتحافظ عالطعمة والقيمة الغذائية.",
      cooks: ["رز بالدجاج", "يخنة خضرة", "لوبية بالرز"],
      features: ["[ميزة من الزبونة]", "[الحجم أو السعة]", "[نوع الغاز أو البلاطة]"],
      photo: "/images/pot-everyday.jpg",
      alt: "ماما إيزو مع طبخة جاهزة",
      focus: "50% 72%",
    },
    {
      slug: "oval-grill",
      name: "Oval Grill",
      category: "مشاوي",
      text: "مشاوي الأحد بالبيت، بلا فحم وبلا دخّان.",
      description: "مشاوي صحية جوّا البيت. الدهن ما بينزل عالفحم، فما في دخّان، واللحمة بتضل طريّة وزاكية.",
      cooks: ["مشاوي لحمة", "دجاج مشوي", "خضرة مشوية"],
      features: ["بلا فحم وبلا دخّان", "[الحجم]", "[ميزة من الزبونة]"],
      photo: "/images/pot-grill.jpg",
      alt: "مشاوي صحية عالـ Oval Grill",
      focus: "50% 88%",
    },
    {
      slug: "starter-set",
      name: "[اسم الطقم]",
      category: "أطقم",
      text: "أوّل طقم لبيت جديد، كل شي بتحتاجيه.",
      description: "طقم كامل لبيت جديد أو لعروس: طناجر ومقالي لكل طبخة، من الترويقة للعشا.",
      cooks: ["كل طبخات البيت", "قلي بلا زيت", "حلويات"],
      features: ["[شو في بالطقم]", "[عدد القطع]", "[ميزة من الزبونة]"],
      photo: "/images/pot-set.jpg",
      alt: "طناجر ومقالي من الطقم",
      focus: "50% 55%",
    },
  ],
  shop: {
    meta: { title: "المتجر · ماما إيزو", description: "طناجر ومشاوي وأطقم. اطلبي عالواتساب أو احجزي جلسة طبخ مجانية." },
    kicker: "المتجر",
    title: "طناجر بتغيّر طريقة طبخك.",
    body: "شوفي الطناجر واختاري اللي بيناسبك. للطلب أو لأي سؤال، بعتيلي عالواتساب.",
    all: "الكل",
    help: {
      title: "مش عارفة شو تختاري؟",
      body: "احجزي جلسة طبخ مجانية ومنجرّب الطناجر سوا بمطبخك.",
      cta: "احجزي جلسة مجانية",
    },
  },
  product: {
    back: "← رجعة عالمتجر",
    cooks: "شو فيكي تطبخي فيها",
    features: "التفاصيل",
    order: "اطلبي عالواتساب",
    session: "جرّبيها بجلسة مجانية",
    note: "للطلب والتفاصيل، بعتيلي عالواتساب وبردّ عليكي بسرعة.",
    related: "طناجر تانية",
    // Prefilled WhatsApp message; {name} is replaced with the product name
    message: "مرحبا ماما إيزو، بدّي إعرف أكتر عن {name}",
  },
  contact: {
    meta: { title: "تواصلي معي · ماما إيزو", description: "احجزي جلسة طبخ مجانية، اطلبي، أو انضمّي لفريق ماما إيزو." },
    kicker: "تواصلي معي",
    title: "بعتيلي، وبردّ عليكي بسرعة.",
    body: "لجلسة طبخ مجانية، لطلب، أو لتنضمّي لفريقي. كل شي بيصير عالواتساب.",
    channels: [
      { key: "whatsapp", label: "واتساب", value: "[رقم الواتساب]" },
      { key: "instagram", label: "إنستغرام", value: "@mamaizocooks" },
      { key: "tiktok", label: "تيك توك", value: "@mamaizo" },
    ],
    form: {
      title: "خلّيني إعرف شو بدّك",
      name: "اسمك",
      area: "منطقتك",
      topic: "شو بدّك؟",
      topics: ["جلسة طبخ مجانية", "بدّي اطلب", "بدّي انضمّ للفريق", "عندي سؤال"],
      message: "رسالتك (اختياري)",
      submit: "بعتي عالواتساب",
      hint: "رح يفتح الواتساب والرسالة جاهزة، بس كبسي إرسال.",
      // Lines of the WhatsApp message built from the form
      greeting: "مرحبا ماما إيزو،",
      nameLine: "اسمي",
      areaLine: "من",
      topicLine: "بخصوص",
    },
  },
  recipes: {
    title: "طبخات سريعة",
    items: [
      { name: "لوبية بالرز", time: "6 دقايق", photo: "/images/recipe-loubyeh.jpg" },
      { name: "فوكاشيا", time: "أسرع وأسهل", photo: "/images/recipe-focaccia.jpg" },
      { name: "سوشي كيك", time: "من حواضر البيت", photo: "/images/recipe-sushi.jpg" },
      { name: "مغربية", time: "مش نهار كامل", photo: "/images/recipe-moghrabieh.jpg" },
    ],
  },
  session: {
    title: "جلسة طبخ",
    accent: "مجانية",
    titleEnd: "معي",
    body: "منطبخ سوا وجبة كاملة بطنجرة وحدة، وبتدوقي الفرق بإيدك.",
    cta: "احجزي عالواتساب",
    message: "مرحبا ماما إيزو، بدّي احجز جلسة طبخ مجانية",
  },
  team: {
    kicker: "Make money smarter",
    title: "اشتغلي معي.",
    body: "من ١٣ سنة أخدت فرصة صغيرة غيّرتلي حياتي. اليوم دوري إفتح نفس الباب لستّات بدّن يبنوا شي لإلن.",
    cta: "إسأليني عن الفريق",
    message: "مرحبا ماما إيزو، بدّي إعرف أكتر عن الانضمام لفريقك",
    photo: "/images/team.jpg",
    photoAlt: "ماما إيزو بالجنينة",
  },
  footer: { instagram: "Instagram", tiktok: "TikTok", whatsapp: "WhatsApp" },
  notFound: {
    title: "هالصفحة مش موجودة.",
    body: "يمكن الرابط غلط. رجعي عالمتجر وشوفي الطناجر.",
    cta: "رجعة عالمتجر",
  },
};
