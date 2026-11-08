// 소문의 낙원 남자 인물(이찬혁, 애니 셀 3D). 낮은 운전석 지붕 위에 앉아 통기타를 침. 지붕 뒤 U자 파이프가 무릎 앞 허벅지 높이를 가로지르고 정강이는 그 뒤로 늘어짐(사진 17:35). 원점은 앉은 면(지붕 윗면) 가운데, 앞이 +z, 미터.
// 의상(공연 사진 17:35 + 의상 정리 그림): 크림색 반짝이 보터 모자, 짙은 곱슬머리(귀를 덮고 목덜미까지),
// 하늘색 새틴 재킷(금색 끈 고리 자수·크림 꽃·금색 테두리), 복숭앗빛 큰 깃 셔츠와 가슴 프릴, 손목 복숭앗빛 프릴 세 겹,
// 하늘색 새틴 나팔바지, 검은 구두. 검은 통기타.
export function buildMan({ THREE, mat, RoundedBoxGeometry }) {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const g = new THREE.Group();
  const add = (geo, m, p = g) => { const o = new THREE.Mesh(geo, m); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const ramp = (a, b, c) => { const t = new THREE.DataTexture(new Uint8Array([a, b, c]), 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; };
  const SOFT = ramp(165, 215, 255), FACE_RAMP = ramp(212, 236, 255);
  const canvasTex = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

  // ── 무늬
  const BLUE = "#6fa0d6", GOLD = "#d8b25a", GOLD_D = "#9c7a35", PEACH = "#f6c9a8", CREAM = "#f4ecd8";
  const smallFlower = (x, cx, cy, r) => { x.fillStyle = CREAM; for (let k = 0; k < 5; k++) { const a = k * 1.2566; x.beginPath(); x.arc(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6, r * 0.5, 0, 7); x.fill(); } x.fillStyle = GOLD; x.beginPath(); x.arc(cx, cy, r * 0.3, 0, 7); x.fill(); };
  const loop8 = (x, cx, cy, r, rot = 0) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.strokeStyle = GOLD_D; x.lineWidth = r * 0.7; x.beginPath(); x.ellipse(-r * 0.9, 0, r, r * 0.6, 0, 0, 7); x.ellipse(r * 0.9, 0, r, r * 0.6, 0, 0, 7); x.stroke(); x.strokeStyle = "#f0cf72"; x.lineWidth = r * 0.45; x.beginPath(); x.ellipse(-r * 0.9, 0, r, r * 0.6, 0, 0, 7); x.ellipse(r * 0.9, 0, r, r * 0.6, 0, 0, 7); x.stroke(); x.restore(); };
  const satin = (x, w, h, base, lit, dark) => {
    x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) { const cx = (i + 0.5) * w / 14, gr = x.createLinearGradient(cx - w / 28, 0, cx + w / 28, 0); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, i % 2 ? dark : lit); gr.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gr; x.fillRect(cx - w / 28, 0, w / 14, h); }
  };
  // 재킷 몸판(둘레 u, 앞 가운데 u=0.5, 위가 어깨): 앞이 열려 복숭앗빛 셔츠가 보이고, 열린 가장자리·밑단에 금색 테두리, 가슴·어깨에 금색 고리 자수와 크림 꽃
  const jacketTex = canvasTex(1024, 512, (x, w, h) => {
    satin(x, w, h, BLUE, "rgba(235,245,255,0.6)", "rgba(80,120,160,0.18)");
    x.fillStyle = PEACH; x.fillRect(w * 0.465, 0, w * 0.07, h);
    for (const u of [0.462, 0.538]) { x.strokeStyle = GOLD_D; x.lineWidth = 22; x.beginPath(); x.moveTo(w * u, 0); x.lineTo(w * u, h); x.stroke(); x.strokeStyle = "#f0cf72"; x.lineWidth = 13; x.stroke(); }
    x.strokeStyle = GOLD_D; x.lineWidth = 18; x.beginPath(); x.moveTo(0, h - 8); x.lineTo(w, h - 8); x.stroke(); x.strokeStyle = GOLD; x.lineWidth = 11; x.stroke();
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) { const cy = h * (0.25 + i * 0.17), cx = w * (0.5 + side * 0.09); loop8(x, cx, cy, 30, 0); smallFlower(x, cx + side * 46, cy - 18, 9); }
      for (let i = 0; i < 3; i++) loop8(x, w * (0.5 + side * (0.15 + i * 0.06)), h * 0.1, 28, side * 0.4);
      smallFlower(x, w * (0.5 + side * 0.2), h * 0.18, 10); smallFlower(x, w * (0.5 + side * 0.26), h * 0.12, 8);
    }
  });
  const pantsTex = canvasTex(512, 256, (x, w, h) => satin(x, w, h, BLUE, "rgba(235,245,255,0.55)", "rgba(80,120,160,0.2)"));
  const hatTex = canvasTex(256, 256, (x, w, h) => { x.fillStyle = CREAM; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.85)" : "rgba(200,185,150,0.5)"; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 1.2 + Math.random() * 1.6, 0, 7); x.fill(); } });

  const C = {
    jacket: mat("#ffffff", { map: jacketTex }), blue: mat(BLUE), pants: mat("#ffffff", { map: pantsTex, side: THREE.DoubleSide }), gold: mat(GOLD),
    peach: mat(PEACH, { side: THREE.DoubleSide }), frill: mat("#fcd8bc", { side: THREE.DoubleSide, emissive: new THREE.Color("#6a4632") }),
    skin: mat("#f6d2b6", { gradientMap: SOFT }), hair: mat("#3b2a25"), hairHi: mat("#5c4136"), hat: mat("#ffffff", { map: hatTex }), hatBand: mat("#e3d6b6"),
    shoe: mat("#1d1a1c"), guitar: mat("#1c1a1d"), guitarSide: mat("#2a2629"), bind: mat("#efe3c6"), fret: mat("#3a2a22"), string: mat("#e9e4d8"),
    case: mat("#7f9a7a"), caseDark: mat("#5f7a5c"), metal: mat("#c9c3b4"),
  };

  function ik(root, target, L1, L2, pole) {
    const d = target.clone().sub(root), dist = Math.min(d.length(), L1 + L2 - 1e-3), dir = d.normalize();
    const a = Math.acos(THREE.MathUtils.clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1));
    const side = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    return root.clone().add(dir.clone().multiplyScalar(Math.cos(a) * L1)).add(side.multiplyScalar(Math.sin(a) * L1));
  }
  // 굵기가 바뀌는 관(팔·다리·손가락). fold(t, a) → [반지름 배율, 색]
  function limb(pts, rFn, seg = 22, RAD = 12, fold = null) {
    const curve = new THREE.CatmullRomCurve3(pts), fr = curve.computeFrenetFrames(seg, false), pos = [], idx = [], col = [];
    for (let i = 0; i <= seg; i++) {
      const t = i / seg, c = curve.getPointAt(t), r = rFn(t), N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j < RAD; j++) { const a = j / RAD * Math.PI * 2, f = fold ? fold(t, a) : null, rr = f ? r * f[0] : r; pos.push(c.x + N.x * Math.cos(a) * rr + B.x * Math.sin(a) * rr, c.y + N.y * Math.cos(a) * rr + B.y * Math.sin(a) * rr, c.z + N.z * Math.cos(a) * rr + B.z * Math.sin(a) * rr); if (f) col.push(...f[1]); }
    }
    for (let i = 0; i < seg; i++) for (let j = 0; j < RAD; j++) { const p0 = i * RAD + j, p1 = i * RAD + (j + 1) % RAD; idx.push(p0, p1, p0 + RAD, p1, p1 + RAD, p0 + RAD); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); if (col.length) geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
  }
  const finger = (pts, r0, r1) => limb(pts, t => r0 + (r1 - r0) * t, 10, 8);

  // ── 다리(사진): 지붕 뒤 끝에 걸터앉아 다리를 꼼. 왼다리(+x)는 비스듬히 뻗어 짐칸 바닥을 딛고, 오른다리(-x)는 그 무릎 위로 꼬아 올려 발이 앞에 떠 있음
  const LEGS = {
    "-1": { knee: V(0.05, 0.1, 0.26), ankle: V(0.2, -0.13, 0.38), shoe: V(0.0, -0.06, 0.03) },
    "1": { knee: V(0.11, -0.04, 0.22), ankle: V(0.13, -0.32, 0.34), shoe: V(0.0, -0.02, 0.045) },
  };
  for (const s of [-1, 1]) {
    const hip = V(s * 0.072, 0.045, 0.0), knee = LEGS[s].knee, ankle = LEGS[s].ankle;
    // 나팔바지: 새틴 세로 광택, 앞 중심 다림질 선(밝은 마루), 바깥 솔기를 따라가는 금색 띠, 엉덩이 옆 금색 끈 고리, 밑단 금색 테두리
    const SEG = 30, RADN = 32, pr = t => (t < 0.5 ? 0.056 - 0.016 * t * 2 : 0.04 + 0.04 * Math.pow((t - 0.5) * 2, 2.2));
    const pg = limb([hip, hip.clone().lerp(knee, 0.5), knee, knee.clone().lerp(ankle, 0.5), ankle], pr, SEG, RADN), pp = pg.attributes.position, cols = [];
    for (let i = 0; i <= SEG; i++) {
      let cx = 0, cy = 0, cz = 0; for (let j = 0; j < RADN; j++) { const k = i * RADN + j; cx += pp.getX(k); cy += pp.getY(k); cz += pp.getZ(k); } cx /= RADN; cy /= RADN; cz /= RADN;
      const t = i / SEG;
      for (let j = 0; j < RADN; j++) {
        const k = i * RADN + j, dx = pp.getX(k) - cx, dy = pp.getY(k) - cy, dz = pp.getZ(k) - cz, l = Math.hypot(dx, dy, dz) || 1, ox = dx / l, fz = (t < 0.4 ? dy : dz) / l;
        let c = [0.16, 0.35, 0.67];   // 정점 색은 선형 값(#6fa0d6)
        const sheen = Math.pow(Math.max(0, Math.sin(j / RADN * Math.PI * 6 + t * 2)), 3); c = c.map((v, n) => v + ([0.62, 0.8, 1][n] - v) * sheen * 0.5);
        if (fz > 0.93) c = [0.55, 0.74, 0.97];                                   // 다림질 선
        if (s * ox > 0.9 && t > 0.12) c = [0.83, 0.54, 0.12];                    // 바깥 솔기 금색 띠
        cols.push(...c);
      }
    }
    pg.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    add(pg, mat("#ffffff", { vertexColors: true, side: THREE.DoubleSide }));
    { const hem = add(new THREE.TorusGeometry(0.08, 0.004, 6, 40), C.gold); hem.position.copy(ankle); hem.quaternion.setFromUnitVectors(V(0, 0, 1), ankle.clone().sub(knee).normalize()); }
    for (let k = 0; k < 2; k++) { const lp = add(new THREE.TorusGeometry(0.011, 0.0028, 6, 16), C.gold); lp.position.set(s * 0.122, 0.07 - k * 0.0, 0.05 + k * 0.026); lp.rotation.y = s * Math.PI / 2; lp.scale.set(1, 0.65, 1); }   // 엉덩이 옆 금색 끈 고리
    const sh = add(new THREE.SphereGeometry(1, 16, 12), C.shoe); sh.scale.set(0.04, 0.03, 0.068); sh.position.copy(ankle).add(LEGS[s].shoe); if (s < 0) sh.rotation.x = 0.5;
  }

  // ── 몸통: 재킷 몸판(앞이 열려 셔츠가 보임), 가슴 프릴, 큰 복숭앗빛 셔츠 깃, 어깨
  const BODY_PROF = [[0, 0.112], [0.06, 0.106], [0.12, 0.1], [0.2, 0.108], [0.28, 0.116], [0.33, 0.106], [0.37, 0.065]];
  const bodyR = wy => { const y = wy - 0.01; if (y <= 0) return BODY_PROF[0][1]; for (let i = 1; i < BODY_PROF.length; i++) if (y <= BODY_PROF[i][0]) { const [y0, a] = BODY_PROF[i - 1], [y1, b] = BODY_PROF[i]; return a + (b - a) * (y - y0) / (y1 - y0); } return 0.06; };
  {
    const torso = new THREE.LatheGeometry(BODY_PROF.map(([y, r]) => new THREE.Vector2(r, y)), 40); torso.scale(0.9, 1, 0.68);
    const tm = add(torso, C.jacket); tm.rotation.y = Math.PI; tm.position.y = 0.01;
    for (const s of [-1, 1]) { const sp = add(new THREE.SphereGeometry(0.05, 20, 14), C.jacket); sp.scale.set(1, 0.8, 0.9); sp.position.set(s * 0.115, 0.345, 0.0); }   // 어깨 둥글게
    // 가슴 프릴(자보): 위에서 아래로 겹친 물결 프릴 다섯 단
    for (let k = 0; k < 7; k++) {
      const pp = []; for (let i = 0; i <= 5; i++) { const t = i / 5; pp.push(new THREE.Vector2(0.006 + t * (0.044 - k * 0.003), -t * 0.034)); }
      const fg = new THREE.LatheGeometry(pp, 48), q = fg.attributes.position;
      for (let i = 0; i < q.count; i++) { const x = q.getX(i), z = q.getZ(i), y = q.getY(i), ang = Math.atan2(x, z), w = 1 + 0.25 * Math.sin(ang * 9 + k) * (-y / 0.034); q.setXYZ(i, x * w, y, z * w * 0.6); }
      fg.computeVertexNormals(); const f = add(fg, C.frill); const y = 0.345 - k * 0.026; f.position.set(0, y, bodyR(y) * 0.68 + 0.006);
    }
    // 셔츠 깃: 깃 모양 점을 몸통 표면 위로 옮겨 어깨 쪽으로 넓게 펼쳐 붙임, 끝이 뾰족
    for (const s of [-1, 1]) {
      const sh = new THREE.Shape(); sh.moveTo(0.012, 0.0); sh.lineTo(0.065, 0.006); sh.lineTo(0.135, -0.08); sh.quadraticCurveTo(0.085, -0.07, 0.04, -0.07); sh.closePath();
      const geo = new THREE.ShapeGeometry(sh, 16), q = geo.attributes.position, nrm = [];
      for (let i = 0; i < q.count; i++) {
        const x = s * q.getX(i), y = 0.39 + q.getY(i), r = bodyR(y), wx = r * 0.9, wz = r * 0.68;
        let z = Math.abs(x) < wx ? wz * Math.sqrt(1 - (x / wx) ** 2) : 0;
        const dx = x - s * 0.115, dy = y - 0.345; if (dx * dx / 0.0025 + dy * dy / 0.0016 < 1) z = Math.max(z, 0.045 * Math.sqrt(Math.max(0, 1 - dx * dx / 0.0025 - dy * dy / 0.0016)));
        q.setXYZ(i, x, y, z + 0.007); const n = V(x * 0.9, 0.35, Math.max(z, 0.01)).normalize(); nrm.push(n.x, n.y, n.z);
      }
      geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3)); add(geo, C.peach);
    }
  }

  // ── 목·머리(여자와 같은 둥근 귀여운 두상). 원점은 광대 높이 근처, 머리 비율 1.55배
  add(new THREE.CylinderGeometry(0.02, 0.027, 0.14, 16), C.skin).position.set(0, 0.42, -0.006);
  const HEAD_S = 1.55, head = new THREE.Group(); head.position.set(0, 0.515, 0.0); head.scale.setScalar(HEAD_S); g.add(head);
  const FACE_SPAN = 0.15, FACE_CY = -0.004;
  const faceTex = canvasTex(1024, 1024, (x, N) => {
    const P = (mx, my) => [N / 2 + mx / FACE_SPAN * N, N / 2 - (my - FACE_CY) / FACE_SPAN * N];
    x.fillStyle = "#f6d2b6"; x.fillRect(0, 0, N, N);
    for (const s of [-1, 1]) {
      const [bx, by] = P(s * 0.047, -0.026), gr = x.createRadialGradient(bx, by, 0, bx, by, 90); gr.addColorStop(0, "rgba(236,140,140,0.3)"); gr.addColorStop(1, "rgba(236,140,140,0)"); x.fillStyle = gr; x.fillRect(bx - 100, by - 100, 200, 200);
      // 기타를 내려다보는 눈: 아래로 둥근 눈꺼풀 선 + 속눈썹 짧게
      const [ex, ey] = P(s * 0.034, -0.01), w = 92;
      x.strokeStyle = "#2a1a1a"; x.lineCap = "round"; x.lineWidth = 15; x.beginPath(); x.moveTo(ex - w, ey - 8); x.bezierCurveTo(ex - w * 0.5, ey + 36, ex + w * 0.5, ey + 36, ex + w, ey - 8); x.stroke();
      const [bx0, by0] = P(s * 0.016, 0.026), [bx1, by1] = P(s * 0.054, 0.024);
      x.strokeStyle = "#3e2c26"; x.lineWidth = 13; x.beginPath(); x.moveTo(bx0, by0 + 6); x.quadraticCurveTo((bx0 + bx1) / 2, by0 - 10, bx1, by1 + 4); x.stroke();
    }
    { const [nx, ny] = P(0, -0.028); x.strokeStyle = "#dca088"; x.lineWidth = 6; x.beginPath(); x.moveTo(nx - 6, ny - 10); x.lineTo(nx + 4, ny + 4); x.stroke(); }
    { const [mx, my] = P(0, -0.042); x.strokeStyle = "#8a3f42"; x.lineWidth = 9; x.beginPath(); x.moveTo(mx - 34, my - 4); x.quadraticCurveTo(mx, my + 18, mx + 34, my - 4); x.stroke(); }
  });
  {
    const sk = new THREE.SphereGeometry(1, 56, 44), p = sk.attributes.position, uv = sk.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const sx = p.getX(i), sy = p.getY(i), sz = p.getZ(i), hr = Math.hypot(sx, sz), ax = hr > 1e-6 ? sx / hr : 0, az = hr > 1e-6 ? sz / hr : 0;
      let x, y, z;
      if (sy >= 0) { const h = Math.sqrt(Math.max(0, 1 - sy * sy)); y = 0.012 + 0.082 * sy; x = ax * h * 0.077; z = az * h * (az > 0 ? 0.072 : 0.08); }
      else { const u = -sy, sq = Math.cbrt(Math.max(0, 1 - u * u * u)); y = 0.012 - 0.072 * u; x = ax * 0.077 * sq * (1 - 0.28 * u * u); z = az > 0 ? az * 0.072 * sq * (1 - 0.15 * u * u) + 0.008 * u * u : az * 0.08 * Math.sqrt(Math.max(0, 1 - u * u)); }
      p.setXYZ(i, x, y, z);
      if (z > 0.02) uv.setXY(i, 0.5 + x / FACE_SPAN, 0.5 + (y - FACE_CY) / FACE_SPAN); else uv.setXY(i, 0.5 + Math.sign(x) * 0.49, 0.5 + (y - FACE_CY) / FACE_SPAN);
    }
    sk.computeVertexNormals(); add(sk, mat("#ffffff", { map: faceTex, gradientMap: FACE_RAMP }), head).receiveShadow = false;
  }

  // ── 충돌(머리카락이 어깨·목·재킷을 뚫지 않게)
  head.rotation.set(0.16, 0.18, -0.04); head.updateMatrix();
  const HM = head.matrix.clone(), HMi = HM.clone().invert();
  const COLL = { ell: [[V(0, 0.22, 0), V(0.105, 0.17, 0.08)]], sph: [[V(-0.115, 0.345, 0), 0.055], [V(0.115, 0.345, 0), 0.055]], cap: [[V(0, 0.33, -0.006), V(0, 0.47, -0.006), 0.03]] };
  function pushOut(p, m) {
    for (const [c, r] of COLL.ell) { const q = p.clone().sub(c).divide(r), l = q.length(), lim = 1 + m / Math.min(r.x, r.z); if (l < lim) p.copy(c).add(q.multiplyScalar(lim / Math.max(l, 1e-4)).multiply(r)); }
    for (const [c, r] of COLL.sph) { const q = p.clone().sub(c), l = q.length(); if (l < r + m) p.copy(c).addScaledVector(q.normalize(), r + m); }
    for (const [a, b, r] of COLL.cap) { const ab = b.clone().sub(a), t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1), cp = a.clone().addScaledVector(ab, t), q = p.clone().sub(cp), l = q.length(); if (l < r + m) p.copy(cp).addScaledVector(l > 1e-5 ? q.normalize() : V(0, 0, -1), r + m); }
    return p;
  }
  const collide = (pts, m) => pts.map((q, i) => { if (i < 2) return q; let w = q.clone().applyMatrix4(HM); for (let it = 0; it < 3; it++) w = pushOut(w, m); return w.applyMatrix4(HMi); });
  function ribbon(pts, w0, th0, seg = 36) {
    pts = collide(pts, w0 * HEAD_S * 0.6 + 0.004);
    const curve = new THREE.CatmullRomCurve3(pts), RAD = 8, pos = [], idx = [];
    for (let i = 0; i <= seg; i++) {
      const t = i / seg, c = curve.getPointAt(t), T = curve.getTangentAt(t);
      const out = c.y > -0.02 ? V(c.x, c.y + 0.02, c.z + 0.004) : V(c.x, 0, c.z + 0.02); out.addScaledVector(T, -out.dot(T)).normalize(); const B = V().crossVectors(T, out).normalize();
      const w = w0 * (1 - 0.7 * Math.pow(t, 2.2)) * (t < 0.08 ? 0.7 + 3.75 * t : 1), th = th0 * (1 - 0.7 * Math.pow(t, 1.6));
      for (let j = 0; j < RAD; j++) { const a = j / RAD * Math.PI * 2; pos.push(c.x + B.x * Math.cos(a) * w + out.x * Math.sin(a) * th, c.y + B.y * Math.cos(a) * w + out.y * Math.sin(a) * th, c.z + B.z * Math.cos(a) * w + out.z * Math.sin(a) * th); }
    }
    for (let i = 0; i < seg; i++) for (let j = 0; j < RAD; j++) { const a = i * RAD + j, b = i * RAD + (j + 1) % RAD; idx.push(a, a + RAD, b, b, a + RAD, b + RAD); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
  }

  // ── 머리카락(사진 17:35): 한 덩어리로 부푼 짙은 곱슬 웨이브. 머리를 감싼 두툼한 덩어리가 귀를 덮고 목덜미·옷깃까지 내려오며,
  // 표면은 큰 웨이브 굴곡. 가장자리에 넓고 완만한 웨이브 다발 몇 개로 윤곽을 흐트러뜨리고, 앞머리는 옆으로 흐르는 웨이브
  const locks = [];
  {
    const hm = new THREE.SphereGeometry(1, 64, 48), q = hm.attributes.position;
    for (let i = 0; i < q.count; i++) {
      const sx = q.getX(i), sy = q.getY(i), sz = q.getZ(i), th = Math.atan2(sx, sz), hr = Math.hypot(sx, sz);
      const back = 0.5 - 0.5 * Math.cos(th);   // 0 앞, 1 뒤
      const lump = 0.013 * Math.sin(th * 8 + sy * 6) * Math.cos(sy * 7 - th * 3) + 0.007 * Math.sin(th * 15 + sy * 13);   // 큰 웨이브 굴곡
      const thick = (0.008 + 0.004 * back + lump * 0.4) * (sy > 0.3 ? 0.4 : 1);
      let x = sx * (0.077 + thick), z = sz * (sz > 0 ? 0.072 + thick : 0.08 + thick), y;
      if (sy >= 0) y = 0.012 + sy * (0.082 + thick);
      else { const drop = 0.03 + 0.02 * back; y = 0.012 + sy * drop; const flare = 1 + 0.08 * (-sy) * (0.4 + 0.6 * back); x *= flare; z = sz > 0 ? z : z * flare; }
      // 얼굴(이마선 아래 앞면)은 머리 안으로 밀어 넣음. 옆머리는 귀를 덮고 볼 옆까지
      const hl = 0.048 - Math.pow(Math.min(1, Math.abs(x) / 0.085), 2.2) * 0.13;
      if (z > 0.015 && y < hl && Math.abs(x) < 0.07) { x *= 0.8; z = Math.min(z * 0.6, 0.02); }
      if (y < -0.01 && z > -0.01 && Math.abs(x) < 0.06) z = Math.min(z, -0.03);   // 턱 아래·목 앞으로는 오지 않게
      if (y > 0.07) { const k = 0.07 / y; y = 0.07 + (y - 0.07) * 0.2; x *= 0.92; z *= 0.92; }   // 모자 정수리를 뚫지 않게 모자 안에서 납작하게
      q.setXYZ(i, x, y, z);
    }
    hm.computeVertexNormals(); add(hm, C.hair, head);
    // C자 곱슬 덩어리 두 층: 머리 둘레에서 바깥·아래로 나와 끝이 바깥 위로 말림. 옆은 턱 위에서 끝나고 뒤는 목덜미까지
    for (const [layer, y0, n] of [[0, 0.05, 18], [1, 0.022, 16]]) for (let k = 0; k < n; k++) {
      const a = (k / (n - 1) - 0.5) * Math.PI * 1.5 + Math.PI + layer * 0.09, rx = Math.sin(a), rz = Math.cos(a), back = 0.5 - 0.5 * Math.cos(a);
      const out = V(rx, 0, rz), tan = V(rz, 0, -rx), L = (0.028 + 0.012 * back) * (0.85 + 0.3 * ((k * 7 + layer * 3) % 5) / 4) * (layer ? 1.05 : 1);
      const root = V(rx * 0.084, y0, rz * 0.086), tw = 0.006 * Math.sin(k * 2.3 + layer);
      const pts = [root.clone().addScaledVector(out, -0.008)];
      for (let i = 0; i <= 6; i++) { const s = i / 6, ang = s * Math.PI * 1.15; pts.push(root.clone().addScaledVector(out, 0.022 * (1 - Math.cos(ang)) + 0.004 * s).add(V(0, -L * Math.sin(Math.min(ang, Math.PI * 0.62)) / Math.sin(Math.PI * 0.62) + (ang > Math.PI * 0.62 ? 0.012 * (ang - Math.PI * 0.62) : 0), 0)).addScaledVector(tan, tw * s)); }
      locks.push(add(ribbon(pts, 0.024, 0.013, 24), (k + layer) % 3 === 0 ? C.hairHi : C.hair, head));
    }
    // 앞머리: 모자 밑에서 이마 위로 옆으로 흐르는 넓은 웨이브 다발
    const brow = (x, y) => 0.072 * Math.sqrt(Math.max(0.02, 1 - (x / 0.077) ** 2 - ((y - 0.012) / 0.082) ** 2));
    for (let k = 0; k < 5; k++) {
      const u = (k - 2) / 2, x0 = u * 0.045, pts = [];
      for (let i = 0; i <= 6; i++) { const t = i / 6, x = x0 + 0.025 * t + 0.006 * Math.sin(t * 5 + k), y = 0.07 - (0.04 + 0.01 * (k % 2)) * t; pts.push(V(x, y, brow(x, y) + 0.01 - (i === 0 ? 0.008 : 0))); }
      add(ribbon(pts, 0.026, 0.007, 24), k % 2 ? C.hairHi : C.hair, head);
    }
  }
  // ── 보터 모자: 평평한 정수리, 둘레 띠, 넓은 챙(살짝 앞으로 숙임)
  {
    const hat = new THREE.Group(); hat.position.set(0, 0.068, -0.004); hat.rotation.x = -0.12; head.add(hat);
    add(new THREE.CylinderGeometry(0.068, 0.072, 0.048, 40), C.hat, hat).position.y = 0.024;
    add(new THREE.CylinderGeometry(0.0735, 0.0735, 0.014, 40, 1, true), C.hatBand, hat).position.y = 0.01;
    const brim = new THREE.RingGeometry(0.068, 0.125, 48, 2); brim.rotateX(-Math.PI / 2); add(brim, mat("#ffffff", { map: hatTex, side: THREE.DoubleSide }), hat);
    add(new THREE.TorusGeometry(0.125, 0.0035, 6, 48), C.hat, hat).rotation.x = Math.PI / 2;
  }

  // ── 통기타(검정): 큰 몸통(아래 둘레가 큼) + 위 둘레, 크림 테두리, 울림구멍, 지판, 헤드, 줄 여섯
  const guitar = new THREE.Group(); guitar.position.set(-0.05, 0.215, 0.185); guitar.rotation.set(-0.08, 0.06, 0.38); guitar.scale.setScalar(0.85); g.add(guitar);
  const GD = 0.085;
  {
    // 몸통 윤곽: 아래 둘레(큰 원)와 위 둘레(작은 원)를 합친 바깥선만 따서 한 덩어리로 뽑음, 테두리도 바깥선 하나
    const LB = [-0.06, 0.125], UB = [0.085, 0.095], outline = [];
    for (let i = 0; i < 160; i++) {
      const a = i / 160 * Math.PI * 2, d = V(Math.cos(a), Math.sin(a), 0);
      // 중심(0.0)에서 방향 d로 나가 두 원 중 더 먼 경계까지
      let best = 0; for (const [cx, r] of [LB, UB]) { const b = d.x * (-cx), c = cx * cx - r * r, disc = b * b - c; if (disc >= 0) best = Math.max(best, -b + Math.sqrt(disc)); }
      outline.push(new THREE.Vector2(d.x * best, d.y * best * (Math.abs(d.y) > 0.1 ? 1 : 1)));
    }
    // 허리(두 원 사이) 오목하게
    for (const v of outline) { const k = Math.exp(-(((v.x - 0.03) / 0.04) ** 2)); v.y *= 1 - 0.18 * k; }
    const bodyShape = new THREE.Shape(outline);
    const bg = new THREE.ExtrudeGeometry(bodyShape, { depth: GD, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 4 }); bg.translate(0, 0, -GD / 2);
    add(bg, C.guitar, guitar);
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outline.map(v => V(v.x, v.y, GD / 2 + 0.004)), true), 200, 0.004, 6, true), C.bind, guitar);
    const hole = add(new THREE.CircleGeometry(0.032, 24), mat("#050405"), guitar); hole.position.set(0.04, 0, GD / 2 + 0.001);
    const ring = add(new THREE.RingGeometry(0.036, 0.042, 32), C.bind, guitar); ring.position.set(0.04, 0, GD / 2 + 0.0012);
    // 브리지(줄받침): 줄과 직각으로 긴 짙은 나무, 흰 새들, 흰 브리지 핀 여섯
    add(new THREE.BoxGeometry(0.026, 0.078, 0.006), mat("#3a2618"), guitar).position.set(-0.112, 0, GD / 2 + 0.003);
    add(new THREE.BoxGeometry(0.0028, 0.058, 0.004), C.bind, guitar).position.set(-0.104, 0, GD / 2 + 0.007);
    for (let i = 0; i < 6; i++) { const pn = add(new THREE.CylinderGeometry(0.0024, 0.0024, 0.004, 8), C.bind, guitar); pn.rotation.x = Math.PI / 2; pn.position.set(-0.119, (i - 2.5) * 0.0105, GD / 2 + 0.0065); }
    // 울림구멍 둘레 장식(로제트) 두 겹 + 거북등 무늬 픽가드
    const ring2 = add(new THREE.RingGeometry(0.045, 0.047, 40), C.bind, guitar); ring2.position.set(0.04, 0, GD / 2 + 0.0012);
    const ring3 = add(new THREE.RingGeometry(0.033, 0.0345, 40), mat("#b9a27a"), guitar); ring3.position.set(0.04, 0, GD / 2 + 0.0013);
    {
      const tort = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); x.fillStyle = "#4a2a1a"; x.fillRect(0, 0, 128, 128); for (let i = 0; i < 70; i++) { x.fillStyle = ["rgba(150,80,35,0.6)", "rgba(25,12,8,0.6)", "rgba(190,120,60,0.4)"][i % 3]; x.beginPath(); x.ellipse(Math.random() * 128, Math.random() * 128, 4 + Math.random() * 12, 2 + Math.random() * 6, Math.random() * 3, 0, 7); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
      const sh = new THREE.Shape(); sh.moveTo(0.02, -0.04); sh.quadraticCurveTo(0.075, -0.05, 0.072, -0.012); sh.quadraticCurveTo(0.068, -0.03, 0.04, -0.047); sh.quadraticCurveTo(0.0, -0.075, -0.035, -0.06); sh.quadraticCurveTo(-0.01, -0.045, 0.02, -0.04);
      const pgd = add(new THREE.ShapeGeometry(sh, 12), mat("#ffffff", { map: tort }), guitar); pgd.position.z = GD / 2 + 0.0011;
    }
    const neck = add(new THREE.BoxGeometry(0.4, 0.042, 0.028), C.fret, guitar); neck.position.set(0.35, 0, GD / 2 - 0.012);
    // 프렛(줄자리 금속 막대)과 자개 점, 상현(너트)
    { const NUT = 0.55, SL = 0.66, fx = n => NUT - SL * (1 - Math.pow(2, -n / 12));
      for (let n = 1; n <= 14; n++) add(new THREE.BoxGeometry(0.0022, 0.042, 0.003), C.metal, guitar).position.set(fx(n), 0, GD / 2 + 0.0035);
      for (const n of [3, 5, 7, 9, 12]) { const xm = (fx(n) + fx(n - 1)) / 2; for (const yy of n === 12 ? [-0.01, 0.01] : [0]) { const d = add(new THREE.CircleGeometry(0.0035, 12), mat("#f1ece0"), guitar); d.position.set(xm, yy, GD / 2 + 0.0024); } }
      add(new THREE.BoxGeometry(0.005, 0.044, 0.006), C.bind, guitar).position.set(NUT + 0.002, 0, GD / 2 + 0.003); }
    const head2 = add(new THREE.BoxGeometry(0.09, 0.05, 0.02), C.guitar, guitar); head2.position.set(0.59, 0, GD / 2 - 0.016); head2.rotation.y = 0.2;
    // 줄감개: 헤드 앞면의 기둥 + 양옆으로 튀어나온 손잡이
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]) {
      const post = add(new THREE.CylinderGeometry(0.003, 0.003, 0.012, 8), C.metal, guitar); post.rotation.x = Math.PI / 2; post.position.set(0.567 + i * 0.022, s * 0.014, GD / 2 - 0.002);
      const btn = add(new THREE.CylinderGeometry(0.006, 0.006, 0.004, 10), C.bind, guitar); btn.position.set(0.567 + i * 0.022, s * 0.036, GD / 2 - 0.016);
      add(new THREE.CylinderGeometry(0.0018, 0.0018, 0.012, 6), C.metal, guitar).position.set(0.567 + i * 0.022, s * 0.029, GD / 2 - 0.016);
    }
    for (let i = 0; i < 6; i++) { const y = (i - 2.5) * 0.0055, st = add(new THREE.CylinderGeometry(0.0009, 0.0009, 0.66, 4), C.string, guitar); st.rotation.z = Math.PI / 2; st.position.set(0.22, y, GD / 2 + 0.006); }
  }
  guitar.updateMatrix();
  const G = (x, y, z) => V(x, y, z).applyMatrix4(guitar.matrix);   // 기타 좌표 → 인물 좌표

  // ── 팔: 하늘색 새틴 소매(세로 결 광택), 손목 금색 띠, 복숭앗빛 프릴 세 겹
  const BL = [0.42, 0.6, 0.82], BL_HI = [0.7, 0.84, 0.98];
  const sleeveFold = (t, a) => { const w = Math.sin(a * 6 + t * 2), l = 0.5 + 0.5 * w; return [1 + 0.02 * w, BL.map((v, i) => v + (BL_HI[i] - v) * l * 0.5 - (1 - l) * 0.06)]; };
  const armR = t => 0.03 - 0.008 * t;
  function makeArm() {
    const sleeve = add(new THREE.BufferGeometry(), mat("#ffffff", { vertexColors: true }));
    const band = add(new THREE.TorusGeometry(0.023, 0.005, 6, 24), C.gold);
    const fr = [0, 1, 2].map(k => {
      const rp = []; for (let i = 0; i <= 6; i++) { const t = i / 6; rp.push(new THREE.Vector2(0.021 + k * 0.003 + t * (0.012 + k * 0.004), -t * (0.02 + k * 0.004))); }
      const geo = new THREE.LatheGeometry(rp, 48), p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = p.getY(i), ang = Math.atan2(x, z), w = 1 + 0.2 * Math.sin(ang * 8 + k * 1.4) * (-y / 0.04); p.setXYZ(i, x * w, y, z * w); }
      geo.computeVertexNormals(); return add(geo, C.frill);
    });
    const hand = new THREE.Group(); hand.matrixAutoUpdate = false; g.add(hand);
    return { sleeve, band, fr, hand };
  }
  const HAND_S = 1.4;
  // 지판을 감싸 쥔 손(왼손): 손바닥 앞(+z)에 지판(로컬 x축)이 놓이고 네 손가락이 감쌈
  function fretHand(hand) {
    { const pm = add(new THREE.SphereGeometry(1, 16, 12), C.skin, hand); pm.scale.set(0.02, 0.025, 0.012); pm.position.set(0, -0.026, 0); }
    const c = V(0, -0.048, 0.02), R = 0.018;
    for (let f = 0; f < 4; f++) { const xf = -0.013 + f * 0.0088, pts = []; for (let i = 0; i <= 5; i++) { const ph = i / 5 * Math.PI * (0.7 - f * 0.03); pts.push(V(xf, c.y - Math.sin(ph) * R, c.z - Math.cos(ph) * R)); } add(finger(pts, 0.0072, 0.006), C.skin, hand); }
    add(finger([V(-0.017, -0.014, 0.006), V(-0.02, -0.012, 0.026), V(-0.018, -0.012, 0.044)], 0.0078, 0.0064), C.skin, hand);   // 지판 뒤에서 위로 세운 엄지
  }
  // 줄을 튕기는 손(오른손): 손가락을 가볍게 굽힘
  function strumHand(hand) {   // 피크를 쥔 듯 손가락을 손바닥 쪽으로 오므린 손(엄지와 검지 사이에 작은 피크)
    { const pm = add(new THREE.SphereGeometry(1, 16, 12), C.skin, hand); pm.scale.set(0.019, 0.023, 0.012); pm.position.set(0, -0.024, 0.002); }
    const c = V(0, -0.044, 0.012), Rr = 0.011;
    for (let f = 0; f < 4; f++) { const xf = -0.011 + f * 0.0078, pts = []; for (let i = 0; i <= 5; i++) { const ph = i / 5 * Math.PI * 1.1; pts.push(V(xf, c.y - Math.sin(ph) * Rr, c.z - Math.cos(ph) * Rr)); } add(finger(pts, 0.0068, 0.006), C.skin, hand); }
    add(finger([V(-0.017, -0.012, 0.008), V(-0.02, -0.026, 0.02), V(-0.013, -0.036, 0.03)], 0.0075, 0.0062), C.skin, hand);   // 피크 위를 누르는 엄지
    const pick = add(new THREE.CircleGeometry(0.008, 3), mat("#e8c45a", { side: THREE.DoubleSide }), hand); pick.position.set(-0.01, -0.046, 0.03);
  }
  const R = makeArm(), L = makeArm(); strumHand(R.hand); fretHand(L.hand);
  // 팔: 어깨-팔꿈치-손목을 잇는 소매, 손목 띠·프릴, 손. F=손가락이 뻗는 방향, P=손바닥이 보는 방향, mirror=왼손(거울상)
  function pose(A, sh, e, wrist, F, P, mirror) {
    A.sleeve.geometry.dispose(); A.sleeve.geometry = limb([sh, sh.clone().lerp(e, 0.5), e, e.clone().lerp(wrist, 0.5), wrist], armR, 26, 28, sleeveFold);
    const dir = wrist.clone().sub(e).normalize();
    A.band.position.copy(wrist).addScaledVector(dir, -0.012); A.band.quaternion.setFromUnitVectors(V(0, 0, 1), dir);
    A.fr.forEach((f, k) => { f.position.copy(wrist).addScaledVector(dir, -0.014 - k * 0.016); f.quaternion.setFromUnitVectors(V(0, -1, 0), dir); f.scale.setScalar(0.8); });
    const Y = F.clone().negate().normalize(), Z = P.clone().addScaledVector(Y, -P.dot(Y)).normalize(), X = V().crossVectors(Y, Z);
    if (mirror) X.negate();
    A.hand.matrix.makeBasis(X.multiplyScalar(HAND_S), Y.multiplyScalar(HAND_S), Z.multiplyScalar(HAND_S)).setPosition(wrist); A.hand.matrixWorldNeedsUpdate = true;
  }
  const O = G(0, 0, 0), gDir = (x, y, z) => G(x, y, z).sub(O).normalize();
  const neckDir = gDir(1, 0, 0), upG = gDir(0, 1, 0), topN = gDir(0, 0, 1);
  const SH_R = V(-0.125, 0.35, 0), SH_L = V(0.125, 0.35, 0);

  return {
    group: g,
    update(t) {
      const strum = Math.sin(t * 7.5);
      // 오른팔(실제 연주 자세): 팔꿈치를 기타 아래 둘레의 위 가장자리에 걸치고, 팔뚝이 앞면 위를 비스듬히 지나
      // 울림구멍과 줄받침 사이에서 손가락은 아래로, 손바닥은 줄을 향함. 손목만 위아래로 움직여 줄을 튕김
      const eR = G(-0.13, 0.16, GD / 2 + 0.035), wR = G(-0.035, 0.045 + 0.022 * strum, GD / 2 + 0.05);   // 팔꿈치는 몸통 위 가장자리 바로 위·앞(몸통 밖)
      pose(R, SH_R, eR, wR, gDir(0.25, -1, 0), topN.clone().negate(), false);
      // 왼팔: 팔꿈치는 아래, 손은 지판 아래에서 올라와 엄지는 지판 뒤, 손가락은 지판 앞면을 감쌈(코드 바꾸듯 살짝 미끄러짐)
      const nC = G(0.4 + 0.015 * Math.sin(t * 0.9), 0, GD / 2 - 0.012), wL = nC.clone().addScaledVector(topN, -0.067).addScaledVector(upG, -0.028);
      pose(L, SH_L, ik(SH_L, wL, 0.19, 0.17, V(0.2, -1, 0.3)), wL, topN, upG, true);   // 손바닥은 지판 아래에서 위를 보고, 손가락은 아래 가장자리에서 앞면으로 아치
      head.rotation.set(0.16 + 0.03 * Math.sin(t * 1.9), 0.18, -0.04 + 0.03 * Math.sin(t * 0.95));
      locks.forEach((l, i) => { l.rotation.z = 0.02 * Math.sin(t * 1.4 + i * 0.6); });
    },
  };
}
