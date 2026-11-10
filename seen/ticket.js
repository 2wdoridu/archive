// 카드 뒷면 티켓. 목록 칸과 상세 뒷면이 같이 쓴다. 한 기록의 제목·날짜·시간·장소로 그린다
function ticketSVG(s) {
  const [y, m, d] = s.date.split(".").map(Number);
  const wd = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date(y, m - 1, d).getDay()];
  let h = 0; for (const c of s.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  let bars = "", x = 182;
  while (x < 280) { h = (h * 1103515245 + 12345) >>> 0; const w = 1 + (h >>> 28) % 3; bars += `<rect x="${x}" y="330" width="${w}" height="40" fill="#3b2140"/>`; x += w + 1 + (h >>> 24) % 3; }
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" font-family="Archivo, 'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', sans-serif">
  <defs>
    <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f78cf"/><stop offset=".55" stop-color="#b9a0d8"/><stop offset="1" stop-color="#f2c2b0"/></linearGradient>
    <radialGradient id="tsun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8e8"/><stop offset=".45" stop-color="#ffe7c9" stop-opacity=".9"/><stop offset="1" stop-color="#ffd7c0" stop-opacity="0"/></radialGradient>
    <pattern id="tdot" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#7a3d55" fill-opacity=".08"/></pattern>
  </defs>
  <rect width="300" height="400" fill="#fbf4ee"/><rect width="300" height="400" fill="url(#tdot)"/>
  <rect width="300" height="158" fill="url(#tsky)"/>
  <circle cx="92" cy="74" r="44" fill="url(#tsun)"/><circle cx="92" cy="74" r="15" fill="#fffaf0"/>
  ${[[214,28],[248,52],[176,40],[268,22],[36,30],[130,20]].map(([a,b],k)=>`<path d="M${a} ${b-4} L${a+1} ${b-1} L${a+4} ${b} L${a+1} ${b+1} L${a} ${b+4} L${a-1} ${b+1} L${a-4} ${b} L${a-1} ${b-1} Z" fill="#fff" fill-opacity="${.55+.1*k%.4}"/>`).join("")}
  <path d="M0 112 L34 92 L58 104 L96 78 L128 100 L160 86 L196 106 L232 84 L268 100 L300 90 V158 H0 Z" fill="#c99aae"/>
  <path d="M0 130 L46 112 L84 126 L122 108 L170 128 L214 114 L258 130 L300 118 V158 H0 Z" fill="#a9788f"/>
  <path d="M0 158 L0 146 C60 138 110 150 150 144 C196 138 250 150 300 142 L300 158 Z" fill="#e8b4a0"/>
  <path d="M138 158 C146 150 156 146 170 144 L176 145 C162 148 152 152 150 158 Z" fill="#fbf4ee" fill-opacity=".85"/>
  <text x="22" y="186" font-size="9" letter-spacing="2.6" fill="#8a5a72" font-weight="600">AKMU 2026 CONCERT</text>
  <text x="20" y="214" font-size="31" font-weight="800" fill="#3b2140" letter-spacing="-.5">${s.title}</text>
  <line x1="22" y1="227" x2="278" y2="227" stroke="#3b2140" stroke-opacity=".18"/>
  <g font-size="7.5" letter-spacing="1.6" fill="#8a5a72" font-weight="600"><text x="22" y="244">DATE</text><text x="150" y="244">TIME</text><text x="22" y="279">VENUE</text></g>
  <g font-size="13" fill="#3b2140" font-weight="700"><text x="22" y="260">${s.date} ${wd}</text><text x="150" y="260">${s.time || ""}</text></g>
  <text x="22" y="295" font-size="11.5" fill="#3b2140" font-weight="600">${s.place}</text>
  <line x1="24" y1="316" x2="276" y2="316" stroke="#3b2140" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="1.5 4" stroke-linecap="round"/>
  <circle cx="0" cy="316" r="11" fill="#d7a9a2"/><circle cx="300" cy="316" r="11" fill="#d7a9a2"/>
  <text x="22" y="344" font-size="15" font-weight="800" letter-spacing="1.5" fill="#3b2140">ADMIT ONE</text>
  <text x="22" y="358" font-size="8" letter-spacing="1.2" fill="#8a5a72">${s.by} · ${s.title}</text>
  ${bars}
  <rect x="0" y="388" width="300" height="12" fill="url(#tsky)"/>
</svg>`;
}
