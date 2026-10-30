// 시안용 게시물 데이터. Collected 이미지는 메트로폴리탄·게티·레이크스 미술관의 퍼블릭 도메인 이미지와 공유마당 CC BY 이미지다.
// 커스텀 이미지는 시안용 자리표시다. 양식 유사도(styles)는 계산값이 아닌 시안용 예시값이다.
const MET = "https://images.metmuseum.org/CRDImages/ep/web-large/";
const MET_DP = "https://images.metmuseum.org/CRDImages/dp/web-large/";
const GETTY = "https://media.getty.edu/iiif/image/20afcc0d-d5cd-43e9-88c1-ba36486b7700/";
const RIJKS = "https://iiif.micr.io/";
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
  { id: "seguy-papillons-19", type: "collected", title: "나비, 도판 19", date: "1920", medium: "도안집 Papillons 수록 도판",
    artist: "에밀알랭 세귀", source: "공유마당(한국저작권위원회)", license: "CC BY 4.0",
    sourceUrl: "https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13375588&menuNo=200018",
    img: "img/seguy-papillons-19.jpg", imgFull: "img/seguy-papillons-19-full.jpg",
    styles: [["아르데코", 0.86], ["아르누보", 0.58], ["일본 판화", 0.31]] },
  { id: "gazette-bon-ton", type: "collected", title: "경이로운 나무, 아이들의 크리스마스 의상", date: "1914", medium: "석판화, 스텐실 손채색",
    artist: "샤를 마르탱", sourceUrl: "https://www.rijksmuseum.nl/en/collection/object/Gazette-du-Bon-Ton-1914-No-1-Pl-III-LArbre-Merveilleux-Costumes-denfants-pour-Noel--715df1a6ef636ab30d1d6921a4bfc438",
    source: "레이크스 미술관", license: "퍼블릭 도메인",
    img: RIJKS + "dDUHw/full/800,/0/default.jpg", imgFull: RIJKS + "dDUHw/full/2000,/0/default.jpg",
    styles: [["아르데코", 0.79], ["패션 일러스트", 0.74], ["아르누보", 0.42]] },
  { id: "pentecost", type: "collected", title: "오순절", date: "1030–1040년경", medium: "양피지에 템페라, 금박, 잉크",
    artist: "작자 미상(레겐스부르크)", source: "게티 미술관", license: "CC0",
    sourceUrl: "https://www.getty.edu/art/collection/object/103S5G",
    img: GETTY + "full/800,/0/default.jpg", imgFull: GETTY + "full/2000,/0/default.jpg", customs: ["field-of-irises"],
    styles: [["중세 채색 필사본", 0.93], ["비잔틴", 0.61], ["로마네스크", 0.55]] },
  ...design({ id: "field-of-irises", type: "custom", title: "붓꽃 들판", date: "2026.10", medium: "디지털, 재채색",
    img: MET + "DP346474.jpg", tone: "tone-blue", color: "#6f95dd", originals: ["pentecost", "christmas-1874"],
    styles: [["후기 인상주의", 0.77], ["듀오톤 그래픽", 0.52], ["청사진", 0.34]] }, ["머그", "포스터"]),
  { id: "christmas-card-1950", type: "collected", title: "1950–1951년 성탄·신년 카드", date: "1950", medium: "인쇄 카드",
    artist: "작자 미상", sourceUrl: "https://www.rijksmuseum.nl/en/collection/object/Kerst-en-nieuwjaarswens-voor-1950-1951-van-Irene-en-Alfred-Brod--bf56bfb60a14d042443465e24c6488eb",
    source: "레이크스 미술관", license: "퍼블릭 도메인",
    img: RIJKS + "vuNPF/full/800,/0/default.jpg", imgFull: RIJKS + "vuNPF/full/2000,/0/default.jpg" },
  { id: "last-supper", type: "collected", title: "최후의 만찬", date: "15세기", medium: "채색 목판화",
    artist: "작자 미상(15세기 독일)", source: SOURCE, license: "CC0",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/382397",
    img: MET_DP + "DP813487.jpg", customs: ["irises-night", "harvest-blue"] },
  ...design({ id: "noon-plane", type: "work", title: "정오의 면", date: "2026.09", medium: "디지털", color: "#c8402c",
    styles: [["바우하우스", 0.71], ["미니멀리즘", 0.66], ["구성주의", 0.48]],
    img: workSvg(800, 1000, '<rect width="800" height="1000" fill="#e9e4d8"/><rect x="120" y="140" width="560" height="420" fill="#1d1d1b"/><circle cx="560" cy="700" r="150" fill="#c8402c"/>') }, ["액자", "티셔츠"]),
  { id: "sweets-print", type: "collected", title: "여러 가지 과자와 맛있는 것들", date: "1848–1881", medium: "판화",
    artist: "루트키 & 크라넨뷔르흐 출판", sourceUrl: "https://www.rijksmuseum.nl/en/collection/object/Van-velerlei-gebak-en-ook-van-lekkernij-Is-deze-prent-voorzien-wat-uwe-keus-ook-zij-Beschouw-dus-lieve-jeugd-haar-steeds-tot-uw-vermaak-En-kies-er-alles-uit-dat-is-naar-uwen-smaak--05a50e4563ec840861bcc6527a621426",
    source: "레이크스 미술관", license: "퍼블릭 도메인",
    img: RIJKS + "LxtaB/full/800,/0/default.jpg", imgFull: RIJKS + "LxtaB/full/2000,/0/default.jpg" },
  { id: "tortilla-vendor", type: "collected", title: "머리에 쟁반을 인 토르티야 장수", date: "1848년경", medium: "수채",
    artist: "판초 피에로", source: SOURCE, license: "CC0",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/819254",
    img: MET_DP + "DP883531.jpg", customs: ["bubbles-again"] },
  ...design({ id: "irises-night", type: "custom", title: "밤의 붓꽃", date: "2026.09", medium: "디지털, 재채색",
    img: MET + "DP346474.jpg", tone: "tone-night", color: "#cdb98a", originals: ["last-supper"] }, ["머그"]),
  { id: "christmas-1874", type: "collected", title: "크리스마스", date: "1874", medium: "흰 카드에 크로모리소그래피",
    artist: "작자 미상", source: SOURCE, license: "CC0",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/768558",
    img: MET_DP + "DP885938.jpg", customs: ["field-of-irises"] },
  ...design({ id: "two-stones", type: "work", title: "두 개의 돌", date: "2026.08", medium: "디지털", color: "#2b2b28",
    img: workSvg(900, 600, '<rect width="900" height="600" fill="#d9dccf"/><ellipse cx="330" cy="330" rx="190" ry="150" fill="#2b2b28"/><ellipse cx="610" cy="370" rx="120" ry="95" fill="#8a8578"/>') }),
  // 잡지 이름이 상표일 수 있어 굿즈·커스텀 원작으로 연결하지 않는다(_notes/image-usage-cautions.md)
  { id: "harpers-christmas", type: "collected", title: "하퍼스 매거진 크리스마스호", date: "1898", medium: "컬러 석판화",
    artist: "하비 엘리스", source: SOURCE, license: "CC0",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/339102",
    img: MET_DP + "DP864602.jpg" },
  ...design({ id: "bubbles-again", type: "custom", title: "다시, 비눗방울", date: "2026.08", medium: "디지털, 재채색",
    img: MET + "DP356133.jpg", tone: "tone-rose", color: "#b05a8c", originals: ["tortilla-vendor"] }, ["액자"]),
  ...design({ id: "window-study", type: "work", title: "창 연구", date: "2026.07", medium: "디지털", color: "#3d5a80",
    img: workSvg(700, 1000, '<rect width="700" height="1000" fill="#f0eee8"/><rect x="90" y="90" width="520" height="820" fill="none" stroke="#1d1d1b" stroke-width="18"/><rect x="90" y="500" width="520" height="410" fill="#3d5a80"/>') }, ["포스터"]),
  ...design({ id: "harvest-blue", type: "custom", title: "푸른 수확", date: "2026.07", medium: "디지털, 재채색",
    img: MET + "DP119115.jpg", tone: "tone-blue", color: "#6f95dd", originals: ["last-supper"] }, ["포스터"]),
  ...design({ id: "half-moon", type: "work", title: "반달", date: "2026.06", medium: "디지털", color: "#1d1d1b",
    img: workSvg(800, 800, '<rect width="800" height="800" fill="#1d1d1b"/><path d="M400 180a220 220 0 0 1 0 440z" fill="#efe9dc"/>') }, ["머그"]),
];

const byId = Object.fromEntries(POSTS.map(p => [p.id, p]));
const GOODS_ORDER = ["액자", "머그", "포스터", "티셔츠"];
const isGoods = p => p.form && p.form !== "이미지";
const GOODS = [...new Set(POSTS.filter(isGoods).map(p => p.form))]
  .sort((a, b) => GOODS_ORDER.indexOf(a) - GOODS_ORDER.indexOf(b));
