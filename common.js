// 커스텀 재채색 표현용 듀오톤 필터
document.body.insertAdjacentHTML("afterbegin", `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="tone-blue"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/>
    <feComponentTransfer><feFuncR type="table" tableValues="0 .95"/><feFuncG type="table" tableValues=".18 .93"/><feFuncB type="table" tableValues=".65 .88"/></feComponentTransfer></filter>
  <filter id="tone-night"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/>
    <feComponentTransfer><feFuncR type="table" tableValues=".05 .98"/><feFuncG type="table" tableValues=".05 .78"/><feFuncB type="table" tableValues=".12 .35"/></feComponentTransfer></filter>
  <filter id="tone-rose"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/>
    <feComponentTransfer><feFuncR type="table" tableValues=".35 1"/><feFuncG type="table" tableValues=".08 .86"/><feFuncB type="table" tableValues=".2 .84"/></feComponentTransfer></filter>
</svg>`);

function imgTag(p, alt = "") {
  const style = p.tone ? ` style="filter:url(#${p.tone})"` : "";
  return `<img src="${p.img}" alt="${alt}" loading="lazy"${style}>`;
}
const year = d => (d.match(/\d{4}/) || [d])[0];

// 원작은 작가, 커스텀은 제작일을 캡션 둘째 줄에 쓴다
const cards = ids => `<div class="cards">${ids.map(id => {
  const q = byId[id];
  return `<a class="card" href="detail.html?id=${id}" data-id="${id}">
    <span class="card__img">${imgTag(q, "")}</span>
    <span class="card__title">${q.title}</span>
    <span class="card__sub">${q.artist || q.date}</span>
  </a>`;
}).join("")}</div>`;

// 같은 디자인의 형태(이미지·머그·포스터 등)를 모두 보여 주고 지금 형태를 선택 상태로 표시한다
const formChips = (members, current) => `<ul class="forms" aria-label="형태">${members.map(q => q === current
  ? `<li><span class="chip" aria-current="page">${q.form}</span></li>`
  : `<li><a class="chip" href="detail.html?id=${q.id}" data-id="${q.id}">${q.form}</a></li>`).join("")}</ul>`;

// 대표 사진 뒤에 추가 사진을 이어 붙인 갤러리. 휴대폰은 옆으로 밀어서, PC는 드래그·썸네일·방향키로 넘긴다.
function gallery(p, photos) {
  const imgs = [imgTag(p, p.title), ...photos.map((src, i) => `<img src="${src}" alt="${p.title} 사진 ${i + 2}" loading="lazy">`)]
    .map(t => t.replace("<img", '<img draggable="false"'));
  return `
    <div class="gallery">
      <div class="gallery__track">${imgs.map(t => `<div class="gallery__slide">${t}</div>`).join("")}</div>
      <div class="gallery__thumbs">${imgs.map((t, i) =>
        `<button type="button" class="gallery__thumb" aria-label="${i + 1}번째 이미지" ${i === 0 ? "aria-current" : ""}>${t}</button>`).join("")}</div>
    </div>`;
}

// 렌더링한 영역 안의 갤러리에 썸네일 클릭, 밀기 위치 동기화, 좌우 방향키, 마우스 드래그를 연결한다
function initGalleries(root) {
  root.querySelectorAll(".gallery").forEach(g => {
    const track = g.querySelector(".gallery__track");
    const thumbs = [...g.querySelectorAll(".gallery__thumb")];
    const go = i => track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" });
    thumbs.forEach((b, i) => b.addEventListener("click", () => go(i)));

    // 마우스로 끌면 손가락으로 미는 것처럼 따라오고, 50px 넘게 끌면 이웃 사진으로 넘어간다
    let drag = null;
    track.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, i: Math.round(track.scrollLeft / track.clientWidth) };
      delete g.dataset.dragged;
      track.setPointerCapture(e.pointerId);
      track.classList.add("is-dragging");
    });
    track.addEventListener("pointermove", e => {
      if (drag) track.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    const end = e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const i = dx < -50 ? drag.i + 1 : dx > 50 ? drag.i - 1 : drag.i;
      // 조금이라도 끌었다면 바로 뒤따르는 클릭을 이동으로 처리하지 않게 표시한다
      if (Math.abs(dx) > 5) g.dataset.dragged = "1";
      track.classList.remove("is-dragging");
      drag = null;
      go(Math.max(0, Math.min(i, thumbs.length - 1)));
    };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    track.addEventListener("scroll", () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      thumbs.forEach((b, j) => b.toggleAttribute("aria-current", i === j));
    });
    g.tabIndex = 0;
    g.addEventListener("keydown", e => {
      const i = thumbs.findIndex(b => b.hasAttribute("aria-current"));
      if (e.key === "ArrowRight") go(Math.min(i + 1, thumbs.length - 1));
      if (e.key === "ArrowLeft") go(Math.max(i - 1, 0));
    });
  });
}

// 상세 내용. 상세 페이지와 홈의 상세 패널이 함께 쓴다. withAnalysis는 분석 기록 샘플 페이지에서만 켠다.
function renderDetail(p, withAnalysis = false) {
  // 이 게시물 정보: 라벨 없이 제목 > 작가·재료 > 제작일 순으로 위계를 둔다
  const members = p.design ? POSTS.filter(q => q.design === p.design) : [];
  const info = `
      <h1 class="detail__title">${p.title}</h1>
      ${p.artist ? `<p class="info__line">${p.artist}</p>` : ""}
      <p class="info__line">${p.medium}</p>
      <p class="info__line info__line--muted">${p.date}</p>
      ${members.length > 1 ? formChips(members, p) : ""}
      ${p.buy ? `<a class="buy" href="${p.buy}">구매하기</a>` : ""}`;

  // 원작·커스텀은 다른 게시물이라 구분선 아래 별도 묶음으로 둔다
  const related = [["원작", p.originals], ["커스텀", p.customs]].filter(([, ids]) => ids?.length)
    .map(([name, ids]) => `<section class="related"><h2 class="related__title">${name}</h2>${cards(ids)}</section>`).join("");

  const full = { ...p, img: p.imgFull || p.img.replace("/web-large/", "/original/") };
  // 수집 이미지의 출처·라이선스는 이미지 영역 우상단 ? 버튼의 툴팁으로 보여 준다
  const credit = p.type === "collected" ? `
      <button type="button" class="credit" aria-describedby="credit-tip">?
        <span class="credit__tip" id="credit-tip" role="tooltip">
          <span>출처</span><span>${p.source}</span>
          <span>라이선스</span><span>${p.license}</span>
        </span>
      </button>` : "";
  return `
  <article class="detail">
    <div class="detail__media">${p.photos ? gallery(full, p.photos) : `<div class="detail__frame">${imgTag(full, p.title)}</div>`}${credit}</div>
    <div class="detail__side">
      <div class="info">${info}</div>
      ${withAnalysis ? analysis(p) : ""}
      ${related}
    </div>
  </article>`;
}

// 분석 기록: 색 구성과 디지털 지문은 이미지에서 계산하고(initAnalysis), 양식 유사도는 데이터의 styles 값을 쓴다
const analysis = p => `
  <section class="analysis" data-img="${p.img}"${p.tone ? ` data-tone="${p.tone}"` : ""}>
    <div class="analysis__block">
      <h2 class="related__title">색 구성</h2>
      <div class="palette"><div class="palette__bar"></div><ul class="palette__list"></ul></div>
    </div>
    ${p.styles ? `<div class="analysis__block">
      <h2 class="related__title">양식 유사도</h2>
      <ul class="styles">${p.styles.map(([name, v]) => `
        <li><span>${name}</span><span class="styles__track"><span style="width:${v * 100}%"></span></span><span>${v.toFixed(2)}</span></li>`).join("")}
      </ul>
    </div>` : ""}
    <div class="analysis__block">
      <h2 class="related__title">디지털 지문</h2>
      <div class="print"><div class="print__grid"></div><span class="print__hex"></span></div>
    </div>
  </section>`;

// 이미지를 작게 그려 주요 색 5개(k-평균)와 비율, 픽셀 데이터의 SHA-256 값을 구한다
function initAnalysis(root) {
  root.querySelectorAll(".analysis").forEach(sec => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const w = 72, h = Math.max(1, Math.round(72 * img.naturalHeight / img.naturalWidth));
      const cv = Object.assign(document.createElement("canvas"), { width: w, height: h });
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      if (sec.dataset.tone) ctx.filter = `url(#${sec.dataset.tone})`;
      ctx.drawImage(img, 0, 0, w, h);
      let data;
      try { data = ctx.getImageData(0, 0, w, h).data; } catch { sec.querySelector(".palette").textContent = "계산할 수 없음"; return; }

      const px = [];
      for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 128) px.push([data[i], data[i + 1], data[i + 2]]);
      const k = 5, dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
      const near = c => Math.min(...cents.map(m => dist(c, m)));
      // 가장 먼 색을 차례로 고르는 방식으로 시작점을 정해 결과가 매번 같게 한다
      const cents = [px[0]];
      while (cents.length < k) cents.push(px.reduce((best, c) => near(c) > near(best) ? c : best));
      let groups;
      for (let it = 0; it < 8; it++) {
        groups = cents.map(() => []);
        px.forEach(c => { let j = 0; cents.forEach((m, n) => { if (dist(c, m) < dist(c, cents[j])) j = n; }); groups[j].push(c); });
        groups.forEach((g, j) => { if (g.length) cents[j] = [0, 1, 2].map(ch => Math.round(g.reduce((s, c) => s + c[ch], 0) / g.length)); });
      }
      const hex = c => "#" + c.map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
      const colors = cents.map((c, j) => ({ hex: hex(c), pct: groups[j].length / px.length * 100 }))
        .filter(c => c.pct >= 0.5).sort((a, b) => b.pct - a.pct);
      sec.querySelector(".palette__bar").innerHTML = colors.map(c => `<span style="background:${c.hex};flex:${c.pct}"></span>`).join("");
      sec.querySelector(".palette__list").innerHTML = colors.map(c =>
        `<li><span class="palette__chip" style="background:${c.hex}"></span>${c.hex}<span class="palette__pct">${c.pct.toFixed(1)}%</span></li>`).join("");

      const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
      const bits = [...digest].flatMap(b => [...Array(8)].map((_, i) => (b >> (7 - i)) & 1));
      sec.querySelector(".print__grid").innerHTML = bits.map(b => `<span${b ? ' class="on"' : ""}></span>`).join("");
      const hx = [...digest].map(b => b.toString(16).padStart(2, "0")).join("");
      sec.querySelector(".print__hex").textContent = `SHA-256 ${hx.slice(0, 8)} ${hx.slice(8, 16)} … ${hx.slice(-8)}`;
    };
    // 화면에 이미 표시된 외부 이미지의 캐시(교차 출처 허용 없음)를 재사용하지 않도록 주소를 구분한다
    const src = sec.dataset.img;
    img.src = src.startsWith("http") ? src + (src.includes("?") ? "&" : "?") + "analysis" : src;
  });
}
