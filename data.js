// 시안용 게시물 데이터. Collected 이미지는 메트로폴리탄 미술관 Open Access(퍼블릭 도메인).
const MET = "https://images.metmuseum.org/CRDImages/ep/web-large/";
const SOURCE = "메트로폴리탄 미술관";

// 자리표시 이미지용 SVG
function workSvg(w, h, shapes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${shapes}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// 굿즈 사진 자리표시: 형태별로 2~3장, 디자인의 대표색 c로 인쇄면을 칠한다
const BG = '<rect width="800" height="800" fill="#e7e6e1"/>';
const BODY = "#fbfbf8";
const GOODS_PHOTOS = {
  머그: c => [
    BG + `<rect x="230" y="200" width="300" height="400" rx="18" fill="${BODY}"/><path d="M530 290h46a54 54 0 0 1 0 108h-46" fill="none" stroke="${BODY}" stroke-width="30"/><rect x="262" y="270" width="236" height="250" fill="${c}"/>`,
    BG + `<rect x="250" y="200" width="300" height="400" rx="18" fill="${BODY}"/><path d="M550 280h70a70 70 0 0 1 0 140h-70" fill="none" stroke="${BODY}" stroke-width="34"/><rect x="250" y="270" width="140" height="250" fill="${c}"/>`,
    BG + `<rect x="250" y="200" width="300" height="400" rx="18" fill="${BODY}"/><path d="M250 290h-46a54 54 0 0 0 0 108h46" fill="none" stroke="${BODY}" stroke-width="30"/>`,
  ],
  포스터: c => [
    BG + `<rect x="220" y="110" width="360" height="500" fill="${BODY}"/><rect x="246" y="136" width="308" height="400" fill="${c}"/><rect x="246" y="556" width="120" height="10" fill="#c9c8c2"/>`,
    BG + `<rect x="80" y="80" width="640" height="640" fill="${BODY}"/><rect x="130" y="130" width="590" height="590" fill="${c}"/>`,
  ],
  액자: c => [
    BG + `<rect x="200" y="120" width="400" height="520" fill="#1d1d1b"/><rect x="226" y="146" width="348" height="468" fill="${BODY}"/><rect x="276" y="196" width="248" height="330" fill="${c}"/>`,
    BG + `<rect x="120" y="60" width="680" height="740" fill="#1d1d1b"/><rect x="160" y="100" width="640" height="700" fill="${BODY}"/><rect x="250" y="190" width="550" height="610" fill="${c}"/>`,
  ],
  티셔츠: c => [
    BG + `<path d="M270 170l-120 70 50 110 70-30v330h260V320l70 30 50-110-120-70c-20 40-60 60-130 60s-110-20-130-60z" fill="${BODY}"/><rect x="330" y="300" width="140" height="160" fill="${c}"/>`,
    BG + `<path d="M270 170l-120 70 50 110 70-30v330h260V320l70 30 50-110-120-70c-20 20-60 30-130 30s-110-10-130-30z" fill="${BODY}"/>`,
  ],
};
const GOODS_INFO = {
  액자: { slug: "frame", medium: "원목 액자, A4" },
  머그: { slug: "mug", medium: "세라믹 머그, 11oz" },
  포스터: { slug: "poster", medium: "아트 포스터, A3" },
  티셔츠: { slug: "tshirt", medium: "면 티셔츠" },
};

// 디자인 하나를 이미지 게시물 + 굿즈 형태별 게시물로 펼친다. 같은 디자인끼리는 design 값으로 묶인다.
function design(base, forms = []) {
  // 이미지 형태의 구매하기는 디자인 전체 상품 페이지로 연결한다
  const head = { ...base, design: base.id, form: "이미지", buy: "#" };
  const goods = forms.map(form => {
    const photos = GOODS_PHOTOS[form](base.color).map(s => workSvg(800, 800, s));
    return {
      id: `${base.id}-${GOODS_INFO[form].slug}`, type: base.type, design: base.id, form,
      title: `${base.title} ${form}`, date: base.date, medium: GOODS_INFO[form].medium,
      img: photos[0], photos: photos.slice(1), originals: base.originals, buy: "#",
    };
  });
  return [head, ...goods];
}

const POSTS = [
  ...design({ id: "field-of-irises", type: "custom", title: "붓꽃 들판", date: "2026.10", medium: "디지털, 재채색",
    img: MET + "DP346474.jpg", tone: "tone-blue", color: "#6f95dd", originals: ["irises", "wheat-field"] }, ["머그", "포스터"]),
  { id: "harvesters", type: "collected", title: "곡물 수확", date: "1565", medium: "목판에 유채",
    artist: "피터르 브뤼헐(아버지)", source: SOURCE, license: "CC0", img: MET + "DP119115.jpg", customs: ["harvest-blue"] },
  ...design({ id: "noon-plane", type: "work", title: "정오의 면", date: "2026.09", medium: "디지털", color: "#c8402c",
    img: workSvg(800, 1000, '<rect width="800" height="1000" fill="#e9e4d8"/><rect x="120" y="140" width="560" height="420" fill="#1d1d1b"/><circle cx="560" cy="700" r="150" fill="#c8402c"/>') }, ["액자", "티셔츠"]),
  { id: "irises", type: "collected", title: "붓꽃", date: "1890", medium: "캔버스에 유채",
    artist: "빈센트 반 고흐", source: SOURCE, license: "CC0", img: MET + "DP346474.jpg", customs: ["field-of-irises", "irises-night"] },
  { id: "soap-bubbles", type: "collected", title: "비눗방울", date: "1733–34년경", medium: "캔버스에 유채",
    artist: "장 시메옹 샤르댕", source: SOURCE, license: "CC0", img: MET + "DP356133.jpg", customs: ["bubbles-again"] },
  ...design({ id: "irises-night", type: "custom", title: "밤의 붓꽃", date: "2026.09", medium: "디지털, 재채색",
    img: MET + "DP346474.jpg", tone: "tone-night", color: "#cdb98a", originals: ["irises"] }, ["머그"]),
  { id: "wheat-field", type: "collected", title: "사이프러스가 있는 밀밭", date: "1889", medium: "캔버스에 유채",
    artist: "빈센트 반 고흐", source: SOURCE, license: "CC0", img: MET + "DP-42549-001.jpg", customs: ["field-of-irises"] },
  ...design({ id: "two-stones", type: "work", title: "두 개의 돌", date: "2026.08", medium: "디지털", color: "#2b2b28",
    img: workSvg(900, 600, '<rect width="900" height="600" fill="#d9dccf"/><ellipse cx="330" cy="330" rx="190" ry="150" fill="#2b2b28"/><ellipse cx="610" cy="370" rx="120" ry="95" fill="#8a8578"/>') }),
  { id: "still-life", type: "collected", title: "사과와 앵초 화분이 있는 정물", date: "1890년경", medium: "캔버스에 유채",
    artist: "폴 세잔", source: SOURCE, license: "CC0", img: MET + "DT47.jpg" },
  { id: "horse-fair", type: "collected", title: "말 시장", date: "1852–55", medium: "캔버스에 유채",
    artist: "로자 보뇌르", source: SOURCE, license: "CC0", img: MET + "DP-23550-001.jpg" },
  ...design({ id: "bubbles-again", type: "custom", title: "다시, 비눗방울", date: "2026.08", medium: "디지털, 재채색",
    img: MET + "DP356133.jpg", tone: "tone-rose", color: "#b05a8c", originals: ["soap-bubbles"] }, ["액자"]),
  { id: "piazza", type: "collected", title: "산 마르코 광장", date: "1720년대 후반", medium: "캔버스에 유채",
    artist: "카날레토", source: SOURCE, license: "CC0", img: MET + "DP-14286-009.jpg" },
  ...design({ id: "window-study", type: "work", title: "창 연구", date: "2026.07", medium: "디지털", color: "#3d5a80",
    img: workSvg(700, 1000, '<rect width="700" height="1000" fill="#f0eee8"/><rect x="90" y="90" width="520" height="820" fill="none" stroke="#1d1d1b" stroke-width="18"/><rect x="90" y="500" width="520" height="410" fill="#3d5a80"/>') }, ["포스터"]),
  { id: "card-players", type: "collected", title: "카드놀이 하는 사람들", date: "1890–92", medium: "캔버스에 유채",
    artist: "폴 세잔", source: SOURCE, license: "CC0", img: MET + "DP231550.jpg" },
  { id: "parrot", type: "collected", title: "앵무새와 여인", date: "1866", medium: "캔버스에 유채",
    artist: "귀스타브 쿠르베", source: SOURCE, license: "CC0", img: MET + "DP-17680-001.jpg" },
  ...design({ id: "harvest-blue", type: "custom", title: "푸른 수확", date: "2026.07", medium: "디지털, 재채색",
    img: MET + "DP119115.jpg", tone: "tone-blue", color: "#6f95dd", originals: ["harvesters"] }, ["포스터"]),
  { id: "hagar", type: "collected", title: "광야의 하갈", date: "1835", medium: "캔버스에 유채",
    artist: "카미유 코로", source: SOURCE, license: "CC0", img: MET + "DT2013.jpg" },
  ...design({ id: "half-moon", type: "work", title: "반달", date: "2026.06", medium: "디지털", color: "#1d1d1b",
    img: workSvg(800, 800, '<rect width="800" height="800" fill="#1d1d1b"/><path d="M400 180a220 220 0 0 1 0 440z" fill="#efe9dc"/>') }, ["머그"]),
];

const byId = Object.fromEntries(POSTS.map(p => [p.id, p]));
const GOODS_ORDER = ["액자", "머그", "포스터", "티셔츠"];
const isGoods = p => p.form && p.form !== "이미지";
const GOODS = [...new Set(POSTS.filter(isGoods).map(p => p.form))]
  .sort((a, b) => GOODS_ORDER.indexOf(a) - GOODS_ORDER.indexOf(b));
