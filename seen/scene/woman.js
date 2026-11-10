// 소문의 낙원 여자 인물(애니 셀 3D). 걸터앉은 자세, 원점은 엉덩이가 닿는 자리(앉은 면 높이), 앞이 +z, 실제 크기(미터).
// 의상: 샴페인 새틴 드레스(허리 잘록한 몸판, 앞판 넝쿨 꽃 자수, 부푼 어깨, 넓게 접힌 깃), 비치는 흰 물결 소매, 흰 물결 밑단과 치맛단 들꽃 자수.
// 긴 웨이브 검은 머리(앞머리·옆머리·등까지 내려오는 머리), 감은 눈으로 활짝 웃는 얼굴, 금 귀걸이.
// 포즈: 오른손 마이크를 앞으로 내밀고 왼손은 귀 옆 머리카락에. 팔은 2관절 IK
export function buildWoman({ THREE, mat, RoundedBoxGeometry }) {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const g = new THREE.Group();
  let LACE_TEX = null;   // 치마 레이스 무늬(손목 레이스도 같이 씀)

  // 얼굴·피부는 그늘 띠가 부드럽게 지도록 밝은 쪽 램프
  const SOFT = (() => { const t = new THREE.DataTexture(new Uint8Array([165, 215, 255]), 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  // 자수 무늬: 캔버스에 그린 꽃·잎을 천에 입힘
  function embroidery(w, h, draw) {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
    x.fillStyle = "#f1c3ab"; x.fillRect(0, 0, w, h); draw(x, w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const flower = (x, cx, cy, r, col) => {
    x.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k * 1.2566; x.beginPath(); x.ellipse(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7, r * 0.55, r * 0.55, 0, 0, 7); x.fill(); }
    x.fillStyle = "#f0d27a"; x.beginPath(); x.arc(cx, cy, r * 0.35, 0, 7); x.fill();
  };
  const leaf = (x, cx, cy, r, a) => { x.fillStyle = "#8eaa78"; x.save(); x.translate(cx, cy); x.rotate(a); x.beginPath(); x.ellipse(0, 0, r, r * 0.38, 0, 0, 7); x.fill(); x.restore(); };
  // 몸판: 가운데(u=0.5)를 따라 아래로 내려가는 넝쿨에 장미·들꽃
  // 장미: 겹겹이 둥근 꽃잎 + 안쪽 소용돌이
  const rose = (x, cx, cy, r, col, dark) => {
    x.fillStyle = col; for (let k = 0; k < 7; k++) { const a = k * 0.9; x.beginPath(); x.ellipse(cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.4, r * 0.6, r * 0.5, a, 0, 7); x.fill(); }
    x.strokeStyle = dark; x.lineWidth = Math.max(2, r * 0.1); x.beginPath(); for (let t = 0; t < 12; t += 0.2) { const rr = r * 0.06 * t; x.lineTo(cx + Math.cos(t) * rr, cy + Math.sin(t) * rr * 0.85); } x.stroke();
  };
  // 몸판(둘레 u, 앞 가운데 u=0.5, 위가 가슴): 새틴 광택 띠, 앞판 솔기 두 줄, 왼쪽 가슴의 장미 꽃다발에서 넝쿨이 허리로 흘러내림
  const bodiceTex = (() => {
    const w = 1024, h = 512, c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
    x.fillStyle = "#f2c5ad"; x.fillRect(0, 0, w, h);
    for (const [u, lit] of [[0.3, 0], [0.4, 1], [0.5, 0], [0.6, 1], [0.7, 0], [0.12, 1], [0.88, 1]]) {
      const cx = u * w, gr = x.createLinearGradient(cx - 50, 0, cx + 50, 0);
      gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, lit ? "rgba(255,236,226,0.8)" : "rgba(200,140,110,0.22)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(cx - 50, 0, 100, h);
    }
    x.strokeStyle = "rgba(170,110,85,0.6)"; x.lineWidth = 3;
    for (const u of [0.42, 0.58]) { x.beginPath(); x.moveTo(u * w, 0); x.quadraticCurveTo(u * w + (u < 0.5 ? -14 : 14), h * 0.45, u * w, h); x.stroke(); }
    const vx = (y) => w * 0.47 + Math.sin(y * 0.012) * 26 + y * 0.05;
    x.strokeStyle = "#7f9a5e"; x.lineWidth = 5; x.beginPath(); for (let y = 110; y <= h; y += 8) x.lineTo(vx(y), y); x.stroke();
    for (let i = 0; i < 6; i++) { const y = 160 + i * 58, cx = vx(y), sd = i % 2 ? 1 : -1; leaf(x, cx + sd * 18, y - 6, 13, sd * 0.6); flower(x, cx + sd * 30, y - 18, i % 3 === 0 ? 13 : 10, ["#e0909e", "#a99ad0", "#f3e2b0"][i % 3]); }
    leaf(x, w * 0.4, 70, 22, -0.5); leaf(x, w * 0.5, 66, 20, 0.5); leaf(x, w * 0.44, 118, 18, 0.9);
    rose(x, w * 0.44, 82, 40, "#e48f9f", "#b45a6c"); flower(x, w * 0.505, 108, 20, "#f6e7bf"); flower(x, w * 0.395, 120, 15, "#f6e7bf"); flower(x, w * 0.49, 46, 12, "#b7a4dc");
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  // 치마 무늬(둘레 u, 아래→위 v): 새틴 세로 주름 광택 띠, 앞 중앙(u=0·1)을 타고 오르는 넝쿨 꽃, 밑단을 따라 선 들꽃 가지
  const hemTex = (() => {
    const w = 2048, h = 1024, c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
    x.fillStyle = "#f1c3ab"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 18; i++) {   // 주름 9개 × 밝은·어두운 띠
      const cx = (i + 0.5) * w / 18, gr = x.createLinearGradient(cx - w / 36, 0, cx + w / 36, 0), lit = i % 2 === 0;
      gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, lit ? "rgba(255,236,226,0.75)" : "rgba(190,120,105,0.28)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(cx - w / 36, 0, w / 18, h);
    }
    const vine = (ox) => {
      x.strokeStyle = "#7f9a5e"; x.lineWidth = 6; x.beginPath(); for (let y = h; y >= 60; y -= 10) x.lineTo(ox + Math.sin(y * 0.018) * 40, y); x.stroke();
      for (let i = 0; i < 11; i++) {
        const y = 90 + i * 82, cx = ox + Math.sin(y * 0.018) * 40, sd = i % 2 ? 1 : -1;
        x.strokeStyle = "#7f9a5e"; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, y); x.quadraticCurveTo(cx + sd * 30, y - 10, cx + sd * 52, y - 30); x.stroke();
        leaf(x, cx + sd * 26, y - 4, 15, sd * 0.6); leaf(x, cx - sd * 16, y + 20, 13, -sd * 0.7);
        flower(x, cx + sd * 54, y - 32, i % 4 === 0 ? 22 : 15, ["#e0909e", "#a99ad0", "#f3e2b0", "#d47a8a"][i % 4]);
      }
    };
    vine(0); vine(w);
    for (let i = 0; i < 30; i++) {   // 밑단 들꽃 가지
      const cx = (i + 0.5) * w / 30, base = h * 0.97, top = base - 150 - (i % 3) * 40;
      if (cx < 90 || cx > w - 90) continue;
      x.strokeStyle = "#8a6a4a"; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, base); x.quadraticCurveTo(cx + 10, (base + top) / 2, cx + (i % 2 ? 14 : -10), top); x.stroke();
      for (let k = 0; k < 4; k++) { const yy = base - 40 - k * 32, sd = k % 2 ? 1 : -1; x.beginPath(); x.moveTo(cx + 2, yy); x.lineTo(cx + sd * 20, yy - 18); x.stroke(); flower(x, cx + sd * 22, yy - 20, 7, ["#e0909e", "#a99ad0", "#f3e2b0"][(i + k) % 3]); }
      flower(x, cx + (i % 2 ? 14 : -10), top, 9, "#e0909e");
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  const C = {
    dress: mat("#f1c3ab"), sleeve: mat("#ffffff", { vertexColors: true, emissive: new THREE.Color("#2a1814") }), puff: mat("#ffffff", { vertexColors: true, emissive: new THREE.Color("#3a2420") }), collar: mat("#f9d8c4"), trim: mat("#c08470"), dressShade: mat("#dba48e"), bodice: mat("#ffffff", { map: bodiceTex }), hem: mat("#ffffff", { map: hemTex, side: THREE.DoubleSide }),
    lace: mat("#fbf6ee", { side: THREE.DoubleSide, emissive: new THREE.Color("#5a4a46") }), sheer: mat("#fbf7f6", { side: THREE.DoubleSide, emissive: new THREE.Color("#7a6e6e") }),
    skin: mat("#fcd8bd", { gradientMap: SOFT }), blush: mat("#f0a3a0", { transparent: true, opacity: 0.5, depthWrite: false, gradientMap: SOFT }),
    hair: mat("#2e1d18"), hairHi: mat("#47302a"), line: mat("#3a2629"), mouth: mat("#8a3a44"), tongue: mat("#e7868e"), teeth: mat("#ffffff", { gradientMap: SOFT }),
    gold: mat("#e0b85c"), blushGold: mat("#e9a39a"), shoe: mat("#f1e6da"), mic: mat("#2b2b2e"), grille: mat("#9a9ca2"),
  };
  // 머리카락 흔들림(화면 카드에서 계산): 뿌리는 두피에 고정되고 끝으로 갈수록 크게, 바람 물결이 위에서 아래로 흘러내리듯 이어짐.
  // 고개가 기울면 머리끝은 따라 돌지 않고 아래로 늘어진 채 남음. aSw 가 없는 물체는 움직이지 않음
  // 머리결 그림: 가는 머리카락을 여러 겹 그린 띠. 가운데는 빽빽하고 양옆·끝으로 갈수록 가늘어지며 비침(판의 모양은 이 그림의 투명도로 잘림)
  const paintHair = opaque => {
    const W = 256, H = 1024, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const x = cv.getContext("2d");
    let sd = 11; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    if (opaque) { x.fillStyle = "#3a2018"; x.fillRect(0, 0, W, H); }
    x.fillStyle = "#3a2018"; x.beginPath(); x.moveTo(W * 0.14, 0); x.lineTo(W * 0.86, 0); x.bezierCurveTo(W * 0.84, H * 0.6, W * 0.66, H * 0.9, W * 0.5, H * 0.96); x.bezierCurveTo(W * 0.34, H * 0.9, W * 0.16, H * 0.6, W * 0.14, 0); x.fill();
    const strand = (col, lw, x0, end, ph) => {
      x.strokeStyle = col; x.lineCap = "round"; let px = x0, py = 0;
      for (let y = 8; y <= end; y += 8) { const v = y / H, nx = x0 + (W / 2 - x0) * v * v * 0.45 + 3 * Math.sin(v * 9 + ph); x.lineWidth = lw * (1 - 0.75 * Math.max(0, (y - end * 0.7) / (end * 0.3))); x.beginPath(); x.moveTo(px, py); x.lineTo(nx, y); x.stroke(); px = nx; py = y; }
    };
    const DK = ["#2e1812", "#3a2018", "#4a2a1e"], MD = ["#5a3424", "#6a3e2a", "#7a4a32"], HI = ["#9a6446", "#b07a56", "#c48f68"];
    for (let i = 0; i < 70; i++) strand(DK[i % 3], 2 + 2 * r(), W * (0.06 + 0.88 * r()), H * (0.82 + 0.16 * r()), r() * 6);
    for (let i = 0; i < 60; i++) strand(MD[i % 3], 1.4 + 1.4 * r(), W * (0.1 + 0.8 * r()), H * (0.78 + 0.18 * r()), r() * 6);
    for (let i = 0; i < 26; i++) strand(HI[i % 3], 0.8 + 0.8 * r(), W * (0.18 + 0.64 * r()), H * (0.7 + 0.2 * r()), r() * 6);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  };
  const HAIR_TEX = paintHair(false);
  // 두피 덩어리용: 빈틈 없이 칠한 머리결(정수리에서 사방으로 결이 퍼져 내려감). 판 사이로 드러나도 매끈한 띠로 보이지 않게
  const SCALP_TEX = paintHair(true); SCALP_TEX.wrapS = THREE.RepeatWrapping; SCALP_TEX.repeat.set(9, 0.6); SCALP_TEX.offset.set(0, 0.4);
  // 애니풍 머리 덩어리 재질: 결 그림 없이 3단 명암(밝음·중간·그늘). 그늘은 보랏빛으로 색을 틀고, 정수리 빛 띠와 물결 마루 윤기 띠는 따로 그림
  const RAMP3 = (() => { const t = new THREE.DataTexture(new Uint8Array([70, 160, 255]), 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  const CARD = [mat("#563326", { gradientMap: RAMP3, side: THREE.DoubleSide }), mat("#4a2c21", { gradientMap: RAMP3, side: THREE.DoubleSide })];
  const HAIR_U = { uHT: { value: 0 }, uHeadDz: { value: 0 } };
  for (const m of [C.hair, C.hairHi, ...CARD]) m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, HAIR_U);
    sh.vertexShader = "attribute float aSw; uniform float uHT, uHeadDz;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      { vec3 p = position; float ph = p.y * 9. + p.x * 2.;
        float dx = aSw * (0.009 * sin(uHT * 1.2 + ph) + 0.003 * sin(uHT * 2.3 + p.x * 40. + p.z * 25.) - uHeadDz * max(0., 0.01 - p.y) * 0.9);
        float dz = aSw * 0.005 * sin(uHT * 0.95 + ph + 1.3);
        // 얼굴 옆(머리 앞쪽 절반)의 가닥은 얼굴 쪽으로는 거의 흔들리지 않음(볼을 파고들어 눌려 보이지 않게)
        float nearFace = step(-0.04, p.z) * step(-0.16, p.y);
        if (dx * p.x < 0.) dx *= mix(1., 0.1, nearFace);
        if (dz > 0.) dz *= mix(1., 0.2, nearFace);
        transformed.x += dx; transformed.z += dz;
        transformed.y += aSw * 0.0015 * sin(uHT * 1.2 + ph + 0.6); }`);
    if (!CARD.includes(m)) return;
    // 머리결 판의 명암: 물결 마루는 윤기로 밝게, 골은 깊게 어둡게. 다발마다 밝기가 다르고 안쪽 층은 어둡게(강약 대비)
    sh.vertexShader = "attribute float aWv, aTone; varying float vWv, vTone, vLen, vU; varying vec3 vHP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vWv = aWv; vTone = aTone; vLen = uv.y; vU = uv.x; vHP = position;");
    sh.fragmentShader = "varying float vWv, vTone, vLen, vU; varying vec3 vHP;\n" + sh.fragmentShader.replace("#include <map_fragment>", `#include <map_fragment>
      { float tone = vTone < 0.01 ? 1.0 : vTone, trough = smoothstep(-0.2, -0.95, vWv);
        float ln = smoothstep(0.82, 1.0, abs(sin(vU * 9.42 + vLen * 3.0 + vTone * 20.0)));   // 덩어리 안 가는 결 선 몇 줄
        diffuseColor.rgb *= tone * (1.0 - 0.14 * trough) * (1.0 - 0.28 * ln) * mix(1.0, 0.85, smoothstep(0.8, 1.0, vLen)); }`).replace("#include <opaque_fragment>", `
      { float lum = dot(outgoingLight, vec3(0.299, 0.587, 0.114)) / max(0.02, dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114))), sh = 1.0 - smoothstep(0.32, 0.5, lum);   // 그늘 판단: 원래 색 대비 받은 빛의 비율
        outgoingLight = mix(outgoingLight, outgoingLight * vec3(0.95, 0.86, 1.15) + vec3(0.01, 0.0, 0.02), sh);   // 그늘은 보랏빛
        float dRing = abs(vHP.y - (0.074 + 0.005 * sin(vHP.x * 80.0))), ring = smoothstep(0.006, 0.002, dRing) * smoothstep(0.0, 0.04, vHP.z) * (1.0 - sh);
        outgoingLight += vec3(0.0) * ring;   // 정수리 빛 띠(천사 고리)
        outgoingLight += vec3(0.05, 0.04, 0.035) * smoothstep(0.85, 0.99, vWv) * (1.0 - sh); }   // 물결 마루 윤기 띠
      #include <opaque_fragment>`);
  };
  const add = (geo, m, p = g) => { const o = new THREE.Mesh(geo, m); o.castShadow = o.receiveShadow = true; if (CARD.includes(m)) o.receiveShadow = false; p.add(o); return o; };   // 머리 덩어리는 다른 덩어리의 그림자를 받지 않음(얼룩 방지)
  const between = (o, a, b) => { o.position.copy(a).add(b).multiplyScalar(0.5); o.scale.y = a.distanceTo(b); o.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); };
  // 끝으로 갈수록 가늘어지는 관(머리카락 가닥·손가락)
  function taper(points, r0, r1, flat = 1, seg = 28, rad = 8) {
    const curve = new THREE.CatmullRomCurve3(points), geo = new THREE.TubeGeometry(curve, seg, 1, rad, false), p = geo.attributes.position;
    const frames = curve.computeFrenetFrames(seg, false);
    for (let i = 0; i <= seg; i++) {
      const t = i / seg, c = curve.getPointAt(t), r = THREE.MathUtils.lerp(r0, r1, Math.pow(t, 0.8));
      for (let j = 0; j <= rad; j++) {
        const k = i * (rad + 1) + j, v = V(p.getX(k), p.getY(k), p.getZ(k)).sub(c);
        const nn = v.dot(frames.normals[i]), bb = v.dot(frames.binormals[i]);
        const out = frames.normals[i].clone().multiplyScalar(nn * r).add(frames.binormals[i].clone().multiplyScalar(bb * r * flat)).add(c);
        p.setXYZ(k, out.x, out.y, out.z);
      }
    }
    geo.computeVertexNormals(); return geo;
  }
  function ik(root, target, L1, L2, pole) {
    const d = target.clone().sub(root), dist = Math.min(d.length(), L1 + L2 - 1e-3), dir = d.normalize();
    const a = Math.acos(THREE.MathUtils.clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1));
    const side = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    return root.clone().add(dir.clone().multiplyScalar(Math.cos(a) * L1)).add(side.multiplyScalar(Math.sin(a) * L1));
  }

  // ── 치마: 허리에서 한 장으로 이어져 무릎 위를 덮고, 무릎 앞에서 아래로 늘어지는 A라인(세로 주름, 치맛단 자수) + 흰 물결 밑단 두 겹.
  // 앉은 자세라 허리에서 무릎까지는 앞으로 밀려 나감(SKIRT_FWD)
  const SKIRT_FWD = 0.3, HEM_Y = -0.21;
  // 앉은 뒷문 판: 윗면은 원점 3.5cm 아래, 끝은 앞으로 0.30m. 판보다 낮은 치마는 판 끝 앞으로만 늘어짐
  const SEAT_TOP = -0.03, EDGE_Z = 0.325;
  const offEdge = (y, z) => (y < SEAT_TOP ? Math.max(z, EDGE_Z) : z);
  // 치마와 레이스를 따로 움직임
  //  치마: 무거운 새틴, 긴 물결로 천천히 크게 흔들림(밑단으로 갈수록 크게)
  //  레이스: 윗단은 치마 밑단에 붙어 같이 움직이고, 아래로 갈수록 가볍게 빠르고 잘게 팔랑임(치마보다 조금 늦게 따라옴)
  const FLUTTER = [], NOW = { t: 0 };
  const skirtSway = (ang, y, t) => { const w = THREE.MathUtils.smoothstep(0.05 - y, 0, 0.3); return [0.016 * w * Math.sin(t * 1.15 + ang * 2 + y * 6), 0.005 * w * Math.sin(t * 1.6 + ang * 4), 0.012 * w * Math.sin(t * 0.95 + ang * 3)]; };
  function flutter(t) {
    for (const F of FLUTTER) {
      const pa = F.geo.attributes.position, a = pa.array, b = F.base;
      for (let i = 0; i < pa.count; i++) {
        const bx = b[i * 3], by = b[i * 3 + 1], bz = b[i * 3 + 2];
        if (F.kind === "skirt") {
          const ang = Math.atan2(bx, bz - SKIRT_FWD), [dx, dy, dz] = skirtSway(ang, by, t);
          a[i * 3] = bx + dx; a[i * 3 + 1] = by + dy; a[i * 3 + 2] = offEdge(F.clampY[i], bz + dz);
        } else {
          const ang = F.ang[i], v = F.v[i], [dx, dy, dz] = skirtSway(ang, HEM_Y, t - 0.25 * v), ox = Math.sin(ang), oz = Math.cos(ang), k = F.k;
          const out = 0.009 * v * Math.sin(t * 3.1 + ang * 19 + k * 1.7), tan = 0.005 * v * Math.sin(t * 3.7 + ang * 31 + k), up = 0.006 * v * Math.sin(t * 2.6 + ang * 13 + k * 0.6);
          a[i * 3] = bx + dx + ox * out + oz * tan; a[i * 3 + 1] = by + dy + up; a[i * 3 + 2] = offEdge(-1, bz + dz + oz * out - ox * tan);
        }
      }
      pa.needsUpdate = true; F.geo.computeVertexNormals();
    }
  }
  const fwd = y => SKIRT_FWD * THREE.MathUtils.smoothstep(0.13 - y, 0, 0.14);
  {
    // 풍성한 치마: 허리에서 부풀어 무릎 위로 쌓였다가 크게 퍼지는 종 모양. 밑단으로 갈수록 깊어지는 세로 주름 14개(깊이·간격 제각각)라
    // 밑단 윤곽이 주름진 꽃잎처럼 들어갔다 나옴. 주름 골은 어둡고 마루는 밝게(정점 색). 밑단 레이스는 주름진 밑단을 그대로 따라 붙음
    const SK_R = [[HEM_Y, 0.36], [-0.17, 0.32], [-0.12, 0.29], [-0.06, 0.262], [-0.01, 0.245], [0.03, 0.215], [0.07, 0.165], [0.1, 0.12], [0.12, 0.1], [0.135, 0.092]];
    const skR = y => { for (let i = 1; i < SK_R.length; i++) if (y <= SK_R[i][0]) { const [y0, a] = SK_R[i - 1], [y1, b2] = SK_R[i], t = (y - y0) / (y1 - y0); return a + (b2 - a) * t; } return 0.092; };
    const foldAt = (ang, y) => {
      const dn = Math.pow(THREE.MathUtils.smoothstep(0.1 - y, 0, 0.32), 1.3), ph = ang * 14 + 0.9 * Math.sin(ang * 3) + 0.5 * Math.sin(ang * 7 + 1);
      const amp = 0.022 + 0.014 * Math.sin(ang * 2.3 + 0.7) + 0.008 * Math.sin(ang * 5);
      return { d: amp * dn * Math.sin(ph) + 0.012 * dn * Math.sin(ang * 4 + 0.5), shade: Math.sin(ph) * dn };
    };
    const skirtPos = (ang, y, out = 0) => { const f = foldAt(ang, y), rr = skR(y) + f.d + out, yw = y + 0.014 * Math.sin(ang * 14 + 2) * THREE.MathUtils.smoothstep(-0.13 - y, 0, 0.08); return [V(Math.sin(ang) * rr, yw, offEdge(y, Math.cos(ang) * rr * 0.78 + fwd(y))), f.shade]; };
    {
      const NA = 168, NY = 34, pos = [], col = [], uvs = [], idx = [], clampY = [];
      for (let j = 0; j <= NY; j++) {
        const y = HEM_Y + (0.135 - HEM_Y) * j / NY;
        for (let i = 0; i <= NA; i++) {
          const ang = i / NA * Math.PI * 2, [v, sh] = skirtPos(ang, y);
          pos.push(v.x, v.y, v.z); clampY.push(y); uvs.push(i / NA, j / NY);
          const k = 0.82 + 0.2 * sh; col.push(Math.min(1, k), Math.min(1, k * (sh < 0 ? 0.96 : 1)), Math.min(1, k * (sh < 0 ? 0.95 : 1)));
        }
      }
      for (let j = 0; j < NY; j++) for (let i = 0; i < NA; i++) { const a0 = j * (NA + 1) + i, b0 = a0 + NA + 1; idx.push(a0, a0 + 1, b0, a0 + 1, b0 + 1, b0); }
      const sk = new THREE.BufferGeometry(); sk.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); sk.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); sk.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); sk.setIndex(idx); sk.computeVertexNormals();
      add(sk, mat("#ffffff", { map: hemTex, side: THREE.DoubleSide, vertexColors: true }));
      FLUTTER.push({ kind: "skirt", geo: sk, base: Float32Array.from(sk.attributes.position.array), clampY: Float32Array.from(clampY) });
    }
    // 밑단 레이스(개더 프릴 세 겹): 안쪽 긴 프릴, 바깥 중간 프릴, 이음선을 덮는 짧은 윗 프릴.
    // 윗단은 촘촘히 모이고 아래로 갈수록 깊게 퍼지는 잔주름. 레이스 무늬는 구멍(아일렛)이 실제로 뚫리고 꽃 무늬, 밑단은 반원 물결과 작은 점 장식
    const laceTex = (() => {
      const w = 256, h = 128, c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
      x.fillStyle = "#fbf6f0"; x.fillRect(0, 0, w, h);
      x.strokeStyle = "rgba(205,190,185,0.9)"; x.lineWidth = 2;
      for (let i = 0; i < 4; i++) { const cx = (i + 0.5) * w / 4; x.beginPath(); x.ellipse(cx, h * 0.42, 14, 10, 0, 0, 7); x.stroke(); for (let k = 0; k < 6; k++) { const a = k * 1.047; x.beginPath(); x.ellipse(cx + Math.cos(a) * 20, h * 0.42 + Math.sin(a) * 15, 6, 4, a, 0, 7); x.stroke(); } x.beginPath(); x.moveTo(cx - 30, h * 0.66); x.quadraticCurveTo(cx, h * 0.56, cx + 30, h * 0.66); x.stroke(); }
      x.globalCompositeOperation = "destination-out";
      for (let i = 0; i < 16; i++) { x.beginPath(); x.arc((i + 0.5) * w / 16, h * 0.14, 3.2, 0, 7); x.fill(); }   // 윗줄 구멍
      for (let i = 0; i < 4; i++) { const cx = (i + 0.5) * w / 4; x.beginPath(); x.arc(cx, h * 0.42, 5, 0, 7); x.fill(); for (let k = 0; k < 6; k++) { const a = k * 1.047; x.beginPath(); x.arc(cx + Math.cos(a) * 20, h * 0.42 + Math.sin(a) * 15, 2.2, 0, 7); x.fill(); } }   // 꽃 무늬 구멍
      for (let i = 0; i < 8; i++) { x.beginPath(); x.arc((i + 1) * w / 8 - w / 16 + w / 32, h * 0.72, 2.5, 0, 7); x.fill(); }
      x.fillRect(0, h * 0.86, w, h);   // 반원 물결 아래는 비움
      x.globalCompositeOperation = "source-over"; x.fillStyle = "#fbf6f0";
      for (let i = 0; i < 8; i++) { const cx = (i + 0.5) * w / 8; x.beginPath(); x.arc(cx, h * 0.86, w / 16, 0, Math.PI); x.fill(); x.beginPath(); x.arc(cx, h * 0.86 + w / 16 + 2.5, 2.4, 0, 7); x.fill(); }   // 반원 물결 + 작은 점
      x.globalCompositeOperation = "destination-out"; for (let i = 0; i < 8; i++) { x.beginPath(); x.arc((i + 0.5) * w / 8, h * 0.86 + 2, 2.6, 0, 7); x.fill(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.anisotropy = 8; return t;
    })();
    LACE_TEX = laceTex;
    const laceMat = mat("#ffffff", { map: laceTex, alphaTest: 0.5, side: THREE.DoubleSide, emissive: new THREE.Color("#73686a") });
    for (const [k, yOff, inset, len, flare, flutes, rep] of [[0, 0.012, -0.006, 0.085, 0.034, 84, 28], [1, 0.006, 0.004, 0.06, 0.03, 72, 24], [2, 0.018, 0.012, 0.034, 0.022, 60, 20]]) {
      const NA = 420, NJ = 6, pos = [], uv = [], idx = [], angs = [], vs = [];
      for (let i = 0; i <= NA; i++) {
        const ang = i / NA * Math.PI * 2, [top] = skirtPos(ang, HEM_Y + yOff, inset), outD = V(Math.sin(ang), 0, Math.cos(ang) * 0.78).normalize(), tg = V(outD.z, 0, -outD.x);
        for (let j = 0; j <= NJ; j++) {
          const v = j / NJ, g = Math.sin(ang * flutes + k * 1.3), deep = Math.pow(v, 0.8);
          const q = top.clone().add(V(0, -len * v, 0)).addScaledVector(outD, flare * v + 0.011 * g * deep).addScaledVector(tg, 0.004 * Math.cos(ang * flutes + k) * deep);
          q.y += 0.006 * Math.sin(ang * flutes * 0.5 + k) * deep; q.z = offEdge(-1, q.z);
          pos.push(q.x, q.y, q.z); uv.push(i / NA * rep, 1 - v); angs.push(ang); vs.push(v);
        }
      }
      for (let i = 0; i < NA; i++) for (let j = 0; j < NJ; j++) { const a0 = i * (NJ + 1) + j, b0 = a0 + NJ + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      const ruff = new THREE.BufferGeometry(); ruff.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); ruff.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); ruff.setIndex(idx); ruff.computeVertexNormals();
      add(ruff, laceMat); FLUTTER.push({ kind: "lace", geo: ruff, base: Float32Array.from(pos), ang: Float32Array.from(angs), v: Float32Array.from(vs), k });
    }
    // 이음선 새틴 띠: 레이스가 달린 자리를 따라 도는 가는 띠(치마 밑단과 같이 움직임)
    {
      const NA = 240, RAD = 6, pos = [], idx = [], angs = [], vs = [];
      for (let i = 0; i <= NA; i++) {
        const ang = i / NA * Math.PI * 2, [c] = skirtPos(ang, HEM_Y + 0.02, 0.004), outD = V(Math.sin(ang), 0, Math.cos(ang) * 0.78).normalize();
        for (let j = 0; j < RAD; j++) { const a2 = j / RAD * Math.PI * 2, q = c.clone().addScaledVector(outD, Math.cos(a2) * 0.0045).add(V(0, Math.sin(a2) * 0.0045, 0)); q.z = offEdge(-1, q.z); pos.push(q.x, q.y, q.z); angs.push(ang); vs.push(0); }
      }
      for (let i = 0; i < NA; i++) for (let j = 0; j < RAD; j++) { const a0 = i * RAD + j, a1 = i * RAD + (j + 1) % RAD; idx.push(a0, a1, a0 + RAD, a1, a1 + RAD, a0 + RAD); }
      const band = new THREE.BufferGeometry(); band.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); band.setIndex(idx); band.computeVertexNormals();
      add(band, C.dressShade); FLUTTER.push({ kind: "lace", geo: band, base: Float32Array.from(pos), ang: Float32Array.from(angs), v: Float32Array.from(vs), k: 0 });
    }
    // 구두 앞코가 밑단 아래로
    for (const s of [-1, 1]) { const sh = add(new THREE.CapsuleGeometry(0.026, 0.06, 4, 10), C.shoe); sh.rotation.x = Math.PI / 2 - 0.3; sh.position.set(s * 0.07, HEM_Y - 0.1, SKIRT_FWD + 0.12); }
  }

  // 몸판 단면 반지름(높이별, 인물 좌표). 깃을 몸에 붙일 때 씀
  const BODY_PROF = [[0, 0.115], [0.05, 0.1], [0.1, 0.086], [0.16, 0.096], [0.22, 0.112], [0.28, 0.108], [0.33, 0.092], [0.37, 0.06]];
  const bodyR = (wy) => { const y = wy - 0.02; if (y <= 0) return BODY_PROF[0][1]; for (let i = 1; i < BODY_PROF.length; i++) if (y <= BODY_PROF[i][0]) { const [y0, a] = BODY_PROF[i - 1], [y1, b] = BODY_PROF[i]; return a + (b - a) * (y - y0) / (y1 - y0); } return 0.055; };
  // 삼각형마다 네 개로 나눔(비색인 도형)
  function subdivideTris(geo) {
    const p = geo.attributes.position, out = [];
    for (let i = 0; i < p.count; i += 3) {
      const a = V(p.getX(i), p.getY(i), p.getZ(i)), b = V(p.getX(i + 1), p.getY(i + 1), p.getZ(i + 1)), c = V(p.getX(i + 2), p.getY(i + 2), p.getZ(i + 2));
      const ab = a.clone().lerp(b, 0.5), bc = b.clone().lerp(c, 0.5), ca = c.clone().lerp(a, 0.5);
      for (const t of [[a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]]) for (const v of t) out.push(v.x, v.y, v.z);
    }
    const g2 = new THREE.BufferGeometry(); g2.setAttribute("position", new THREE.Float32BufferAttribute(out, 3)); return g2;
  }
  // ── 몸통: 허리가 잘록한 몸판(앞판 자수 무늬), 부푼 어깨(주름 잡힌 퍼프), 넓게 접힌 깃
  {
    const prof = [[0, 0.115], [0.05, 0.1], [0.1, 0.086], [0.16, 0.096], [0.22, 0.112], [0.28, 0.108], [0.33, 0.092], [0.37, 0.06]].map(([y, r]) => new THREE.Vector2(r, y));
    const torso = new THREE.LatheGeometry(prof, 36); torso.scale(0.86, 1, 0.68);
    const tm = add(torso, C.bodice); tm.rotation.y = Math.PI; tm.position.y = 0.02;
    // 허리선: 몸판 아래 끝이 앞 가운데로 뾰족하게 내려옴(가는 테두리)
    { const pts = []; for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 2, f = Math.max(0, Math.cos(a)); pts.push(V(Math.sin(a) * 0.075, 0.125 - 0.035 * f ** 6, Math.cos(a) * 0.057 + 0.002)); }
      add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 80, 0.004, 6, true), C.dressShade); }
    // 재킷 자락(의상 정리 그림): 허리에서 엉덩이 위로 벌어지는 짧은 새틴 자락. 앞 양옆이 뾰족하게 더 내려옴. 치마와 같은 방식으로 무릎 쪽으로 따라감
    {
      const pp = []; for (let i = 0; i <= 6; i++) { const t = i / 6; pp.push(new THREE.Vector2(0.1 + t * 0.06, 0.135 - t * 0.045)); }
      const pg = new THREE.LatheGeometry(pp, 64), q = pg.attributes.position;
      for (let i = 0; i < q.count; i++) {
        const x = q.getX(i), y = q.getY(i), z = q.getZ(i), ang = Math.atan2(x, z), r = Math.hypot(x, z), t = (0.135 - y) / 0.045;
        const yy = y - t * 0.028 * Math.exp(-(((Math.abs(ang) - 0.5) / 0.16) ** 2)), rr = r + 0.004 * t;
        q.setXYZ(i, Math.sin(ang) * rr, yy, Math.cos(ang) * rr * 0.74 + fwd(yy) + 0.004);
      }
      pg.computeVertexNormals(); add(pg, mat("#f2c5ad", { side: THREE.DoubleSide }));
    }
    // 네모난 목선 안으로 보이는 가슴 위 피부
    { const ch = add(new THREE.SphereGeometry(0.05, 24, 16), C.skin); ch.scale.set(1, 0.5, 0.62); ch.position.set(0, 0.352, 0.0); }
    for (const s of [-1, 1]) {
      // 부푼 어깨: 어깨선 위로 솟은 큰 퍼프(위가 세로 주름으로 모임)
      const puff = new THREE.SphereGeometry(0.07, 40, 22);
      { const p = puff.attributes.position, cols = []; for (let i = 0; i < p.count; i++) { const v = V(p.getX(i), p.getY(i), p.getZ(i)), ang = Math.atan2(v.x, v.z), up = Math.max(0, v.y / 0.07), pl = Math.sin(ang * 9), k = 1 + 0.13 * Math.sign(pl) * Math.pow(Math.abs(pl), 0.6) * (0.25 + 0.75 * up); p.setXYZ(i, v.x * k, v.y * 0.85 + 0.008 * up, v.z * k * 0.9); const sh = 0.5 + 0.5 * pl * (0.3 + 0.7 * up); cols.push(0.8 + 0.2 * sh, 0.56 + 0.3 * sh, 0.5 + 0.28 * sh); } puff.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3)); puff.computeVertexNormals(); }
      add(puff, C.puff).position.set(s * 0.122, 0.362, -0.006);
      // 큰 뾰족 깃: 깃 모양(2D)의 각 점을 몸통·어깨 퍼프 표면 바로 위로 옮겨, 몸을 따라 휘어 붙게 함. 가장자리 진한 테두리도 같은 표면 위
      const sh = new THREE.Shape(); sh.moveTo(0.012, -0.004); sh.lineTo(0.07, 0.004); sh.quadraticCurveTo(0.12, -0.02, 0.165, -0.08); sh.quadraticCurveTo(0.11, -0.075, 0.06, -0.1); sh.quadraticCurveTo(0.035, -0.06, 0.03, -0.035); sh.closePath();
      const onBody = (lx, ly, off) => {
        const x = s * lx, y = 0.395 + ly, r = bodyR(y), wx = r * 0.86, wz = r * 0.68;
        let z = Math.abs(x) < wx ? wz * Math.sqrt(1 - (x / wx) ** 2) : 0;
        const pc = V(s * 0.122, 0.362, -0.006), dx = x - pc.x, dy = y - pc.y, pr = 0.072;   // 어깨 퍼프 앞면
        if (dx * dx + dy * dy < pr * pr) z = Math.max(z, pc.z + Math.sqrt(pr * pr - dx * dx - dy * dy));
        return V(x, y, z + off);
      };
      const cg = new THREE.ShapeGeometry(sh, 24), cp = cg.attributes.position;
      // 삼각형을 잘게 나눠 곡면을 따라 휠 수 있게
      let cgeo = cg.toNonIndexed(); for (let it = 0; it < 3; it++) cgeo = subdivideTris(cgeo);
      const q = cgeo.attributes.position, nrm = []; for (let i = 0; i < q.count; i++) { const v = onBody(q.getX(i), q.getY(i), 0.006); q.setXYZ(i, v.x, v.y, v.z); const n = V(v.x * 0.9, 0.35, Math.max(v.z, 0.01)).normalize(); nrm.push(n.x, n.y, n.z); }
      cgeo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));   // 몸 바깥쪽으로 매끈한 법선(줄무늬 명암 없앰)
      add(cgeo, mat("#f9d8c4", { side: THREE.DoubleSide }));
      const edgePts = sh.getSpacedPoints(80).map(e => onBody(e.x, e.y, 0.008));
      add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edgePts, true), 120, 0.0018, 6, true), C.trim);
      // 깃 뒤로 세워진 부분(목 뒤를 두르는 띠)
    }
    { const st = add(new THREE.CylinderGeometry(0.027, 0.034, 0.03, 24, 1, true, Math.PI * 0.6, Math.PI * 0.8), mat("#f1c3ab", { side: THREE.DoubleSide })); st.position.set(0, 0.4, -0.004); }
  }

  // ── 목·머리·얼굴. 참조 정면 그림에서 잰 비율(HH = 정수리~턱 = 0.19): 눈높이 정수리에서 0.59HH, 얼굴 폭 0.61HH,
  // 눈 사이(눈동자 중심) 0.33HH, 코 0.74HH, 입 0.85HH. 머리 원점은 눈높이 바로 위(y=-0.02가 광대 높이)
  add(new THREE.CylinderGeometry(0.019, 0.027, 0.12, 16), C.skin).position.set(0, 0.42, -0.008);   // 위쪽 끝이 턱 안으로 들어가 떠 보이지 않게
  const HEAD_S = 1.55, head = new THREE.Group(); head.position.set(0, 0.528, 0.0); head.scale.setScalar(HEAD_S); g.add(head);
  const lerpTable = (tab, y) => { for (let i = 1; i < tab.length; i++) if (y >= tab[i][0]) { const [y0, a] = tab[i - 1], [y1, b] = tab[i]; return a + (b - a) * (y - y0) / (y1 - y0); } return tab[tab.length - 1][1]; };
  // 광대 아래 얼굴형: 높이별 반폭·앞 깊이·뒤 깊이·앞으로 나오는 정도(턱 끝이 앞으로)
  const JAW_W = [[-0.02, 0.066], [-0.045, 0.061], [-0.065, 0.047], [-0.08, 0.031], [-0.09, 0.016], [-0.095, 0.002]];
  const JAW_F = [[-0.02, 0.072], [-0.06, 0.06], [-0.08, 0.042], [-0.095, 0.01]];
  const JAW_B = [[-0.02, 0.082], [-0.06, 0.05], [-0.08, 0.03], [-0.095, 0.01]];
  const JAW_Z = [[-0.02, 0], [-0.06, 0.006], [-0.095, 0.034]];
  // 얼굴 그림: 눈·눈썹·코·입·홍조를 한 장에 그려 얼굴 앞면에 비춰 입힘(얼굴은 한 덩어리, 이목구비는 무늬)
  const FACE_SPAN = 0.15, FACE_CY = -0.004;
  const FACE_RAMP = (() => { const t = new THREE.DataTexture(new Uint8Array([212, 236, 255]), 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  const faceTex = (() => {
    const N = 1024, c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d");
    const P = (mx, my) => [N / 2 + mx / FACE_SPAN * N, N / 2 - (my - FACE_CY) / FACE_SPAN * N];
    x.fillStyle = "#fcd8bd"; x.fillRect(0, 0, N, N);
    // 단순한 얼굴: 눈웃음 선, 옅은 홍조, 점 코, 작은 웃는 입
    for (const s of [-1, 1]) {
      const [bx, by] = P(s * 0.047, -0.026), gr = x.createRadialGradient(bx, by, 0, bx, by, 100);
      gr.addColorStop(0, "rgba(246,145,150,0.45)"); gr.addColorStop(1, "rgba(246,145,150,0)"); x.fillStyle = gr; x.fillRect(bx - 110, by - 110, 220, 220);
      const [ex, ey] = P(s * 0.034, -0.009), w = 100;
      x.strokeStyle = "#2a1a1a"; x.lineCap = "round"; x.lineWidth = 16;
      x.beginPath(); x.moveTo(ex - w, ey + 14); x.bezierCurveTo(ex - w * 0.6, ey - 62, ex + w * 0.6, ey - 62, ex + w, ey + 14); x.stroke();
      const [bx0, by0] = P(s * 0.018, 0.03), [bx1, by1] = P(s * 0.05, 0.027);
      x.strokeStyle = "#6a4840"; x.lineWidth = 8; x.beginPath(); x.moveTo(bx0, by0 + 4); x.quadraticCurveTo((bx0 + bx1) / 2, by0 - 16, bx1, by1 + 6); x.stroke();
    }
    { const [nx, ny] = P(0, -0.027); x.fillStyle = "#e3a08a"; x.beginPath(); x.ellipse(nx, ny, 6, 4, 0, 0, 7); x.fill(); }
    { const [mx, my] = P(0, -0.04);
      x.fillStyle = "#a8434e"; x.beginPath(); x.moveTo(mx - 46, my - 8); x.quadraticCurveTo(mx, my + 2, mx + 46, my - 8); x.quadraticCurveTo(mx + 30, my + 42, mx, my + 44); x.quadraticCurveTo(mx - 30, my + 42, mx - 46, my - 8); x.fill();
      x.fillStyle = "#ef8c95"; x.beginPath(); x.ellipse(mx, my + 28, 20, 10, 0, 0, 7); x.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  {
    const sk = new THREE.SphereGeometry(1, 56, 44), p = sk.attributes.position, uv = sk.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const sx = p.getX(i), sy = p.getY(i), sz = p.getZ(i);
      let x, y, z;
      const hr = Math.hypot(sx, sz), ax = hr > 1e-6 ? sx / hr : 0, az = hr > 1e-6 ? sz / hr : 0;
      if (sy >= 0) { const h = Math.sqrt(Math.max(0, 1 - sy * sy)); y = 0.012 + 0.09 * sy; x = ax * h * 0.071; z = az * h * (az > 0 ? 0.072 : 0.08); }
      else { const u = -sy, sq = Math.cbrt(Math.max(0, 1 - u * u * u)); y = 0.012 - 0.07 * u; x = ax * 0.071 * sq * (1 - 0.3 * u * u); z = az > 0 ? az * 0.072 * sq * (1 - 0.15 * u * u) + 0.008 * u * u : az * 0.08 * Math.sqrt(Math.max(0, 1 - u * u)); }
      p.setXYZ(i, x, y, z);
      if (z > 0.02) uv.setXY(i, 0.5 + x / FACE_SPAN, 0.5 + (y - FACE_CY) / FACE_SPAN); else uv.setXY(i, 0.5 + Math.sign(x) * 0.49, 0.5 + (y - FACE_CY) / FACE_SPAN);
    }
    sk.computeVertexNormals();
    add(sk, mat("#ffffff", { map: faceTex, gradientMap: FACE_RAMP }), head).receiveShadow = false;
    // 귀걸이: 금빛 꽃 모양 늘어진 귀걸이
    for (const s of [-1, 1]) {
      add(new THREE.CylinderGeometry(0.0013, 0.0013, 0.014, 4), C.gold, head).position.set(s * 0.076, -0.028, 0.0);
      const ear = add(new THREE.SphereGeometry(0.014, 16, 12), C.skin, head); ear.scale.set(0.5, 1, 0.75); ear.position.set(s * 0.069, -0.01, -0.004);
      const fl = add(new THREE.CylinderGeometry(0.0075, 0.0075, 0.003, 5), C.gold, head); fl.rotation.x = Math.PI / 2; fl.position.set(s * 0.071, -0.038, 0.002);
      add(new THREE.SphereGeometry(0.003, 8, 6), C.blushGold, head).position.set(s * 0.071, -0.038, 0.004);
    }
  }
  // ── 머리카락: 두피 덩어리 + 끝이 가늘어지는 납작한 다발(리본). 가운데 가르마, 이마를 반쯤 가린 커튼 앞머리,
  // 얼굴 양옆을 감싸는 옆머리, 굵은 웨이브로 등 아래까지. 다발은 두피에 뿌리를 묻어 떠 보이지 않게
  const locks = [];
  // ── 충돌: 머리카락 다발이 몸통·어깨 퍼프·목·팔을 뚫지 않게, 다발 중심선의 점을 이 덩어리들 바깥으로 밀어냄(인물 좌표)
  const ARM = {
    R: { sh: V(-0.112, 0.35, 0), wr: V(-0.4, 0.37, 0.1), pole: V(0, -1, -0.2) },
    L: { sh: V(0.112, 0.35, 0), wr: V(0.155, 0.565, 0.065), pole: V(0.1, -0.6, 1) },
  };
  const COLL = { ell: [[V(0, 0.24, 0), V(0.1, 0.17, 0.082)]], sph: [[V(-0.12, 0.375, -0.006), 0.074], [V(0.12, 0.375, -0.006), 0.074]], cap: [[V(0, 0.33, -0.006), V(0, 0.46, -0.006), 0.03], [V(0, 0.42, 0.0), V(0, 0.48, 0.01), 0.045]] };
  for (const k of ["R", "L"]) {
    const a = ARM[k], e = ik(a.sh, a.wr, 0.19, 0.17, a.pole), d = a.wr.clone().sub(e).normalize();
    COLL.cap.push([a.sh, e, 0.042], [e, a.wr, 0.045], [a.wr, a.wr.clone().addScaledVector(d, 0.1), 0.03]);
  }
  function pushOut(p, m) {
    for (const [c, r] of COLL.ell) { const q = p.clone().sub(c).divide(r), l = q.length(), lim = 1 + m / Math.min(r.x, r.z); if (l < lim) p.copy(c).add(q.multiplyScalar(lim / Math.max(l, 1e-4)).multiply(r)); }
    for (const [c, r] of COLL.sph) { const q = p.clone().sub(c), l = q.length(); if (l < r + m) p.copy(c).addScaledVector(q.normalize(), r + m); }
    for (const [a, b, r] of COLL.cap) {
      const ab = b.clone().sub(a), t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1), cp = a.clone().addScaledVector(ab, t), q = p.clone().sub(cp), l = q.length();
      if (l < r + m) p.copy(cp).addScaledVector(l > 1e-5 ? q.normalize() : V(0, 0, -1), r + m);
    }
    return p;
  }
  // 머리 좌표 → 인물 좌표(쉬는 자세의 고개 기울기 기준)
  head.rotation.set(0.14, 0, 0.1); head.updateMatrix();
  const HM = head.matrix.clone(), HMi = HM.clone().invert();
  const collide = (pts, margin) => pts.map((q, i) => { if (i < 2) return q; const h = q.clone(); if (h.y < -0.045 && Math.abs(h.x) < 0.045) h.z = Math.min(h.z, -0.035); let w = h.applyMatrix4(HM); for (let it = 0; it < 3; it++) w = pushOut(w, margin); return w.applyMatrix4(HMi); });   // 턱 아래 높이에서는 목 뒤로
  {
    // 리본 다발: 중심선 점들을 따라 납작한 타원 단면(폭 w, 두께 th)을 이어 붙임. 두께 방향은 머리 바깥쪽
    function ribbon(pts, w0, th0, seg = 40, swing = 0, r0 = 0) {
      pts = collide(pts, w0 * HEAD_S * 0.6 + 0.004);
      const curve = new THREE.CatmullRomCurve3(pts), RAD = 8, pos = [], idx = [];
      for (let i = 0; i <= seg; i++) {
        const t = i / seg, c = curve.getPointAt(t), T = curve.getTangentAt(t);
        const out = c.y > -0.02 ? V(c.x, c.y + 0.02, c.z + 0.004) : V(c.x, 0, c.z + 0.02);
        out.addScaledVector(T, -out.dot(T)).normalize(); const B = V().crossVectors(T, out).normalize();
        const w = w0 * (1 - 0.75 * Math.pow(t, 2.2)) * (t < 0.08 ? 0.7 + 3.75 * t : 1), th = th0 * (1 - 0.8 * Math.pow(t, 1.6));
        for (let j = 0; j < RAD; j++) { const a = j / RAD * Math.PI * 2; pos.push(c.x + B.x * Math.cos(a) * w + out.x * Math.sin(a) * th, c.y + B.y * Math.cos(a) * w + out.y * Math.sin(a) * th, c.z + B.z * Math.cos(a) * w + out.z * Math.sin(a) * th); }
      }
      for (let i = 0; i < seg; i++) for (let j = 0; j < RAD; j++) { const a = i * RAD + j, b = i * RAD + (j + 1) % RAD, c2 = a + RAD, d = b + RAD; idx.push(a, c2, b, b, c2, d); }
      const sw = []; for (let i = 0; i <= seg; i++) { const f = swing * Math.pow(Math.max(0, (i / seg - r0) / (1 - r0)), 1.5); for (let j = 0; j < RAD; j++) sw.push(f); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("aSw", new THREE.Float32BufferAttribute(sw, 1)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
    }
    // 그림 입힌 판: 중심선을 따라 머리 바깥을 향한 넓은 판. 양옆은 머리 쪽으로 살짝 오므려 둥근 다발처럼 보이게.
    // 물결은 판의 폭 방향(머리 둘레 방향)으로 굽이쳐서, 정면에서 결이 S자로 흘러 보이게(앞뒤로 출렁이면 가로 줄무늬가 생김)
    function card(pts, w0, seg, swing, r0, waveFn, vs = 1, tone = 1, tip = 1.8, tipMin = 0.02) {   // vs: 그림의 몇 할까지만 쓸지(짧은 판은 끝 뾰족한 부분을 안 씀)
      pts = collide(pts, w0 * HEAD_S * 0.3 + 0.004);
      const curve = new THREE.CatmullRomCurve3(pts), A = 5, pos = [], uv = [], sw = [], idx = [], wv = [], tn = [];
      let mx = 1e-5; if (waveFn) for (let i = 0; i <= seg; i++) mx = Math.max(mx, Math.abs(waveFn(i / seg)));
      for (let i = 0; i <= seg; i++) {
        const t = i / seg, c = curve.getPointAt(t), T = curve.getTangentAt(t);
        const out = c.y > -0.02 ? V(c.x, c.y + 0.02, c.z + 0.004) : V(c.x, 0, c.z + 0.02);
        out.addScaledVector(T, -out.dot(T)).normalize(); const B = V().crossVectors(T, out).normalize();
        const w = w0 * Math.max(tipMin, 1 - Math.pow(t, tip)) * (t < 0.06 ? 0.55 + 7.5 * t : 1), ofs = waveFn ? waveFn(t) : 0, f = swing * Math.pow(Math.max(0, (t - r0) / (1 - r0)), 1.5);
        for (let j = 0; j < A; j++) { const u = j / (A - 1), a = (u - 0.5) * 2; const oo = 0.18 * ofs - a * a * w * 0.3;   // 물결이 바깥쪽으로도 굽이쳐야 얼굴 옆 윤곽에서도 물결이 보임
          pos.push(c.x + B.x * (a * w + ofs) + out.x * oo, c.y + B.y * (a * w + ofs) + out.y * oo, c.z + B.z * (a * w + ofs) + out.z * oo); uv.push(u, 1 - t * vs); sw.push(f); wv.push(ofs / mx); tn.push(tone * (0.92 + 0.16 * Math.sin(u * 7 + i * 0.02))); }
      }
      for (let i = 0; i < seg; i++) for (let j = 0; j < A - 1; j++) { const a = i * A + j, b = a + 1, c2 = a + A, d = c2 + 1; idx.push(a, c2, b, b, c2, d); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setAttribute("aSw", new THREE.Float32BufferAttribute(sw, 1)); geo.setAttribute("aWv", new THREE.Float32BufferAttribute(wv, 1)); geo.setAttribute("aTone", new THREE.Float32BufferAttribute(tn, 1)); geo.setIndex(idx); geo.computeVertexNormals();
      { const nr = geo.attributes.normal, ps = geo.attributes.position, e = V(), r = V(), n0 = V();
        for (let i = 0; i < ps.count; i++) { const x = ps.getX(i), y = ps.getY(i), z = ps.getZ(i);
          e.set(x / VOL.x ** 2, (y - 0.012) / VOL.y ** 2, z / (z > 0 ? VOL.zf : VOL.zb) ** 2).normalize(); r.set(x, 0.12, z + 0.02).normalize();
          const k = THREE.MathUtils.smoothstep(-y, 0.0, 0.09); e.lerp(r, k).normalize(); n0.set(nr.getX(i), nr.getY(i), nr.getZ(i)); if (n0.dot(e) < 0) n0.negate(); e.multiplyScalar(0.92).addScaledVector(n0, 0.08).normalize(); nr.setXYZ(i, e.x, e.y, e.z); } }
      return geo;
    }
    const hsh = k => { const v = Math.sin(k * 12.9898) * 43758.5453; return v - Math.floor(v); };
    // 머리 볼륨: 정수리가 두피에서 떠서 둥글고 높게, 관자놀이 옆도 볼록하게 부푼 모양(사진). 가닥은 모두 이 면 위에 얹음
    const VOL = { x: 0.086, y: 0.108, zf: 0.086, zb: 0.098 };
    // 두피 덩어리: 머리보다 살짝 큰 껍데기. 얼굴 쪽(이마선 아래)은 머리 안으로 밀어 넣어 숨김
    {
      const sc = new THREE.SphereGeometry(1, 40, 30), q = sc.attributes.position;
      for (let i = 0; i < q.count; i++) {
        let x = q.getX(i) * VOL.x, y = 0.012 + q.getY(i) * (q.getY(i) > 0 ? VOL.y : 0.07), z = q.getZ(i) * (q.getZ(i) > 0 ? VOL.zf : VOL.zb);
        const hl = 0.075 - Math.pow(Math.min(1, Math.abs(x) / 0.078), 2.5) * 0.1;   // 이마선: 가운데 높고 관자놀이로 내려감
        if (z > -0.01 && y < hl + 0.025) { const f = THREE.MathUtils.smoothstep(hl + 0.025 - y, 0, 0.03) * THREE.MathUtils.smoothstep(z, -0.01, 0.02), k = 1 - 0.18 * f; x *= k; z = z * k - 0.01 * f; }   // 이마선에서 계단지지 않고 부드럽게 안으로 들어감
        if (y < 0.0) z = Math.min(z, -0.02 + 0.3 * y);   // 턱 아래·목 앞으로 두피가 내려오지 않게
        q.setXYZ(i, x, y, z);
      }
      sc.computeVertexNormals(); add(sc, CARD[1], head).receiveShadow = false;   // 밑바탕은 한 톤 어둡게(틈으로 보여도 밝은 조각처럼 튀지 않게)
    }
    const wave = (d, ph) => Math.sin(d * 75 + ph);   // d: 정수리에서 내려온 거리. 파장 약 8cm
    // 가르마에서 옆으로 넘어가 아래로 떨어지는 위 머리(좌우 각 36가닥, 앞에서 뒤로. 앞쪽 8가닥은 가늘게, 얼굴 옆선 바깥으로 비켜 어깨 앞으로)
    // 잔웨이브: 촘촘한 물결이 위에서 아래까지. 가닥마다 박자를 엇갈리게 해서 한 덩어리로 뭉쳐 보이지 않게
    for (const s of [-1, 1]) for (let k = 0; k < 24; k++) {
      if (s > 0 && k < 3) continue;   // 손을 올린 쪽은 팔 앞으로 늘어지지 않게 앞 가닥 생략
      const zp = 0.064 - k * 0.0066, front = k < 3, ph = k * 0.55 + 0.6 * Math.sin(k * 7.13) + (s > 0 ? 2.1 : 0);   // 덩어리마다 물결 박자를 흩뜨림(마루가 가로로 줄지어 사다리처럼 보이지 않게)   // 네 가닥씩 비슷한 박자로 같이 굽이침
      const skullW = 0.072 * Math.sqrt(Math.max(0.15, 1 - (zp / 0.09) ** 2)), top = -0.02 + 0.124 * Math.sqrt(Math.max(0.1, 1 - (zp / 0.095) ** 2));
      const pts = [];
      // 머리 곡면 바로 위에서 출발(가르마 쪽은 거의 붙고 옆으로 갈수록 살짝 부풂). 수평까지 돌지 않고 비스듬히 내려오는 방향에서 끊어 그대로 흘러내리게
      const ryz = 0.09 * Math.sqrt(Math.max(0.1, 1 - (zp / 0.085) ** 2));
      // 두피 껍데기 면에 그대로 붙임: 정수리 윤곽은 두피의 매끈한 곡선이 되고, 가닥은 결로만 보임(가닥 끝이 윤곽 밖으로 삐죽 나오지 않게)
      const g = Math.sqrt(Math.max(0.1, 1 - (zp / (zp > 0 ? VOL.zf : VOL.zb)) ** 2));
      const a0 = Math.PI * 0.3 * THREE.MathUtils.clamp((zp - 0.0) / 0.025, 0, 1);   // 앞쪽 가닥은 가르마가 아니라 앞머리 구역 옆에서 시작
      const a1 = Math.max(Math.PI * 0.32, a0 + Math.PI * 0.06);   // 두피를 떠나는 높이: 관자놀이 위
      for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * (a1 - a0), lift = 0.0022; pts.push(V(s * (0.007 + Math.sin(a) * (VOL.x * g + lift)), 0.012 + Math.cos(a) * (VOL.y * g + lift), zp)); }
      const len = front ? 0.3 + (k % 3) * 0.03 : 0.32 + ((k * 7) % 5) * 0.02, n = 16;   // 가슴께에서 끝남. 층이 지게 길이를 섞음
      const sx = pts[4].x, sz = pts[4].z, sy = pts[4].y;
      for (let i = 1; i <= n; i++) {
        const t = i / n, y = sy - t * len, d = t * len, cw = Math.min(1, t * 25), amp = (0.006 + 0.003 * t) * cw, ca = d * 160 + ph;
        const ease = 0.5 - 0.5 * Math.cos(Math.min(1, t * 1.6) * Math.PI);   // 두피에서 바깥으로 천천히 벌어짐(꺾이지 않게). 옆머리는 얼굴 높이에서 이미 옆으로 부풀고 아래로 더 퍼짐
        const pk = s > 0 && zp > -0.01 ? 0.3 : 1;   // 손을 올린 쪽 앞머리칼은 손 뒤로 지나가게 덜 부풂
        let x = sx + s * (pk * (0.016 * Math.min(1, t * 3) + 0.060 * THREE.MathUtils.smoothstep(t, 0.12, 0.5)) + 0.032 * t * t), z = sz - 0.03 * t;   // 사진: 관자놀이는 붙고 턱~어깨 높이에서 가장 넓음   // 관자놀이 아래부터 옆으로 볼록하게 부풂   // 아래로 갈수록 조금씩 퍼짐
        if (y < -0.12 && !front) z = Math.min(z, -0.09 - 0.02 * t);   // 어깨 아래로는 등 뒤로
        if (front) { z = sz + 0.014 * Math.sin(Math.min(1, t * 2.2) * Math.PI * 0.5) - 0.004 * k * t; x = sx + s * (0.014 + pk * (0.012 * Math.min(1, t * 3) + 0.05 * THREE.MathUtils.smoothstep(t, 0.15, 0.55)) + 0.006 * t + 0.006 * (k % 3) * t); }   // 얼굴 옆선 바깥으로   // 얼굴 옆선 바깥으로 비켜 어깨 앞으로
        pts.push(V(x, y, z));
      }
      let arcL = 0; for (let i = 1; i <= 4; i++) arcL += pts[i].distanceTo(pts[i - 1]); const t0 = arcL / (arcL + len);   // 두피 위 구간이 끝나는 곳부터 물결
      const wf = tt => { const T = Math.max(0, (tt - t0) / (1 - t0)), d = T * len; return (0.008 + 0.005 * T) * Math.min(1, T * 8) * Math.cos(d * 70 + ph); };
      { const m = add(card(pts, front ? 0.016 : (s > 0 && zp > -0.02 ? 0.032 : 0.05), 120, 1, 0.12, wf, 1, (front ? 1.05 : 0.9 + 0.16 * hsh(k + s * 7)) * (zp < -0.04 ? 0.85 : 1) * (s > 0 ? 1.25 : 1), 3.5, 0.25), CARD[k % 3 === 1 ? 1 : 0], head); m.castShadow = false; if (zp > -0.03) m.receiveShadow = false; locks.push(m); }   // 정수리에 겹친 판끼리 검은 그림자 조각이 생기지 않게
    }
    // 어깨 앞으로 넘어와 상체를 덮는 가닥(사진: 마이크 든 쪽에 여러 가닥, 손 올린 쪽은 짧게).
    // 끝 자리는 충돌 처리가 몸 바깥으로 밀어 줘서 가슴 면을 타고 흐른다
    for (const s of [-1, 1]) {
      const cnt = s < 0 ? 5 : 2;
      for (let k = 0; k < cnt; k++) {
        const zp = 0.05 - k * 0.013, ph = k * 0.9 + (s > 0 ? 1.7 : 0.3);
        const g = Math.sqrt(Math.max(0.1, 1 - (zp / (zp > 0 ? VOL.zf : VOL.zb)) ** 2));
        const pts = [], a0 = Math.PI * 0.26, a1 = Math.PI * 0.44;
        for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * (a1 - a0);
          pts.push(V(s * (0.007 + Math.sin(a) * (VOL.x * g + 0.002)), 0.012 + Math.cos(a) * (VOL.y * g + 0.002), zp)); }
        const len = (s < 0 ? 0.30 : 0.22) + (k % 3) * 0.03, n = 16;
        const sx = pts[4].x, sy = pts[4].y, sz = pts[4].z;
        for (let i = 1; i <= n; i++) {
          const t = i / n, y = sy - t * len;
          const over = THREE.MathUtils.smoothstep(t, 0.18, 0.6);   // 어깨 높이에서 앞으로 넘어옴
          const x = sx * (1 - 0.42 * over) + s * (0.004 + 0.004 * (k % 2));   // 어깨를 넘으며 몸 쪽으로 모임
          const z = sz + 0.015 + 0.03 * over;   // 앞으로 넘어온 뒤는 충돌 처리가 가슴 면에 얹어 준다
          pts.push(V(x, y, z));
        }
        let arcL = 0; for (let i = 1; i <= 4; i++) arcL += pts[i].distanceTo(pts[i - 1]);
        const t0 = arcL / (arcL + len);
        const wf = tt => { const T = Math.max(0, (tt - t0) / (1 - t0)), d = T * len; return (0.006 + 0.004 * T) * Math.min(1, T * 8) * Math.cos(d * 70 + ph); };
        const m = add(card(pts, 0.026, 120, 1, 0.12, wf, 1, 1.0 + 0.14 * hsh(k * 2.9 + s * 5), 3.5, 0.25), CARD[k % 3 === 1 ? 1 : 0], head);
        m.castShadow = false; m.receiveShadow = false; locks.push(m);
      }
    }
    // 뒤통수에서 등으로 흘러내리는 뒷머리(넓게 겹쳐 빈틈을 메움)
    for (let k = 0; k < 22; k++) {
      const u = (k - 10.5) / 10.5, a = Math.PI + u * 1.1, ph = k * 0.5 + 0.6 * Math.sin(k * 5.71);
      const rx = Math.sin(a) * 0.078, rz = Math.cos(a) * 0.094;
      const pts = [V(rx * 0.5, 0.07, rz * 0.6), V(rx, 0.01, rz)];
      const len = 0.36 + ((k * 3) % 4) * 0.025;
      for (let i = 1; i <= 14; i++) { const t = i / 14, d = t * len; pts.push(V(rx * (1 + 0.3 * t + 0.38 * t * t), 0.01 - d, Math.min(rz - 0.012 * t, -0.085) - 0.012 * t)); }
      const wf = tt => { const T = Math.max(0, (tt - 0.12) / 0.88), d = T * len; return (0.008 + 0.005 * T) * Math.min(1, T * 8) * Math.cos(d * 70 + ph); };
      locks.push(add(card(pts, 0.056, 120, 1, 0.1, wf, 1, (0.86 + 0.2 * hsh(k * 3.1)) * (u > 0.2 ? 1.15 : 1), 3.5, 0.25), CARD[k % 3 === 1 ? 1 : 0], head));   // 안쪽 층: 어둡게
    }
    // 등 뒤 채움 판(다발 사이로 비어 보이지 않게)
    { const bk = add(new THREE.CylinderGeometry(0.055, 0.125, 0.36, 28, 6, true, Math.PI * 0.72, Math.PI * 0.56), mat("#4a2c22", { side: THREE.DoubleSide }), head); bk.position.set(0, -0.2, -0.075); }
    // 일자 시스루 앞머리: 이마선에서 이마 곡면을 따라 내려와 눈썹 위에서 끝남. 가닥 사이가 살짝 벌어져 이마가 비침
    const brow = (x, y) => 0.072 * Math.sqrt(Math.max(0.02, 1 - (x / 0.071) ** 2 - ((y - 0.012) / 0.09) ** 2));
    // 정수리 앞쪽: 가운데 가르마 한 점에서 사방으로 퍼져 내려가는 결(가운데는 앞으로, 양옆은 비스듬히 옆으로 흘러 옆머리로 이어짐)
    for (let k = 0; k < 16; k++) {
      const u = (k - 7.5) / 7.5, th = u * 1.5, pts = [];
      const L = (0.085 + 0.07 * Math.abs(u)) * (0.9 + 0.1 * (((k * 7) % 5) / 4));   // 끝 길이를 엇갈려 일자로 잘린 단이 생기지 않게
      for (let i = 0; i <= 8; i++) { const t = i / 8, rho = t * L, gx = Math.sin(th) * rho + Math.sign(u) * 0.002, zr = -0.03 + Math.cos(th) * (rho + 0.024 * (1 - t)), q = (zr / (zr > 0 ? VOL.zf : VOL.zb)) ** 2 + (gx / VOL.x) ** 2; if (q > 0.8 && pts.length >= 4) break; const gg = Math.sqrt(Math.max(0.03, 1 - q)); pts.push(V(gx, 0.012 + VOL.y * gg + 0.0015, zr)); }   // 머리 면을 벗어나 옆으로 삐져나오기 전에 끝냄
      { const cv = add(card(pts, 0.05, 24, 0, 0, null, 0.9, 0.95 + 0.1 * hsh(k * 1.7)), CARD[k % 3 === 1 ? 1 : 0], head); cv.castShadow = cv.receiveShadow = false; }   // 끝은 그림의 뾰족한 끝까지 써서 단 없이 흩어짐   // 바로 밑 두피·앞머리 뿌리에 검은 그림자가 지지 않게
    }
    // 시스루: 가는 가닥 두세 개씩 뭉친 다발 7개를 사이를 띄워 늘어뜨림. 다발 사이로 이마가 비치고, 가운데는 살짝 갈라짐
    const CL = [-1.0, -0.74, -0.47, -0.2, 0.05, 0.3, 0.56, 0.8, 1.02];
    CL.forEach((cu, c) => { for (let m = 0; m < 3; m++) {
      const k = c * 5 + m, u = cu + (m - 1) * 0.075, x0 = u * 0.057, edge = Math.max(0, Math.abs(u) - 0.85) / 0.2, end = 0.012 - 0.006 * Math.abs(u) ** 2 - 0.007 * (((k * 7) % 5) / 4) - 0.06 * edge, pts = [];
      // 뿌리: 정수리 앞쪽(앞머리 구역) 두피 위
      for (const zr of [0.04, 0.058]) { const gx = x0 * (0.5 + 0.1 * (zr - 0.045) / 0.015), gg = Math.sqrt(Math.max(0.05, 1 - (zr / VOL.zf) ** 2 - (gx / VOL.x) ** 2)); pts.push(V(gx, 0.012 + VOL.y * gg + 0.0008, zr)); }   // 가르마에서 퍼져 내려온 결이 끝나는 곳에서 이어받음
      for (let i = 1; i <= 14; i++) {
        // 펌 결: 다발째 완만하게 한 번 휨. 다발 가닥들은 끝에서 한 점으로 모여 뾰족한 다발이 됨
        const t = i / 14, wv = Math.min(1, t * 2.5) * (0.005 + 0.004 * t), wa = t * Math.PI * 3.2 + c * 1.3 + m * 0.15, cl = Math.pow(t, 4);   // 펌: 다발째 같이 굽이치고 끝이 말림   // 가닥마다 살짝 다른 박자로 흩어짐   // 사진: 앞머리도 물결짐
        const x = x0 * (0.6 + 0.4 * t) - (u - cu) * 0.057 * 0.25 * t * t + 0.003 * Math.sin(k * 2.1) * t - (m - 0.8) * 0.002 * t + Math.sign(u) * (0.012 * edge + 0.007 * Math.abs(u)) * t * t + wv * Math.sin(wa) + (c % 2 ? 1 : -1) * 0.004 * cl, y = 0.1 - (0.1 - end) * t + 0.005 * cl;   // 바깥 다발일수록 옆으로 살짝 휘어 흐름
        pts.push(V(x, y, brow(x, y) + 0.007 + 0.012 * Math.sin(Math.PI * Math.min(1, t * 1.5)) - 0.003 * t + 0.5 * wv * Math.cos(wa)));   // 이마선 위에서 떠올랐다 내려앉음   // 이마에서 떠서 둥글게
      }
      
      add(card(pts, 0.0105, 48, 0.12, 0.3, null, 0.85, 1.0 + 0.2 * hsh(k * 2.3)), CARD[k % 3 === 1 ? 1 : 0], head).castShadow = false;   // 앞머리도 머리결 그림 입힌 가는 판
    } });
    // 얼굴 옆을 감싸는 짧은 옆 앞머리(볼 옆으로 흘러 턱선까지)
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
      const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12, y = 0.045 - t * (0.16 + k * 0.035); pts.push(V(s * (0.06 + 0.007 * k + 0.008 * Math.sin(t * Math.PI) + 0.007 * Math.sin(t * 10 + k * 2) * Math.min(1, t * 3)), y, 0.014 - k * 0.011 + 0.004 * t)); }   // 사진: 앞머리 양끝에서 이어져 볼 옆선을 살짝 덮으며 턱까지   // 위 끝은 위 머리 안쪽에 숨겨 윤곽 밖으로 각지게 나오지 않게   // 볼 옆을 넓게 감싸며 어깨까지
      add(card(pts, 0.024, 48, 0.5, 0.15, null, 0.9, 1.05), CARD[k % 2], head).castShadow = false;
    }
  }
  // ── 팔: 어깨-팔꿈치-손목을 지나는 한 줄기 관(끊김 없이 가늘어짐, 매 프레임 다시 만듦), 소매 끝 비치는 물결 주름 두 겹
  function limb(pts, rFn, seg = 22, RAD = 12, fold = null) {
    const curve = new THREE.CatmullRomCurve3(pts), fr = curve.computeFrenetFrames(seg, false), pos = [], idx = [], col = [];
    for (let i = 0; i <= seg; i++) {
      const t = i / seg, c = curve.getPointAt(t), r = rFn(t), N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j < RAD; j++) { const a = j / RAD * Math.PI * 2, f = fold ? fold(t, a) : null, rr = f ? r * f[0] : r, ca = Math.cos(a) * rr, sa = Math.sin(a) * rr; pos.push(c.x + N.x * ca + B.x * sa, c.y + N.y * ca + B.y * sa, c.z + N.z * ca + B.z * sa); if (f) col.push(...f[1]); }
    }
    for (let i = 0; i < seg; i++) for (let j = 0; j < RAD; j++) { const p0 = i * RAD + j, p1 = i * RAD + (j + 1) % RAD; idx.push(p0, p1, p0 + RAD, p1, p1 + RAD, p0 + RAD); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); if (col.length) geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
  }
  // 블라우스 소매(비숍 소매): 팔꿈치 아래가 넉넉히 부풀었다 손목에서 오므라듦
  const armR = t => 0.028 - 0.007 * t;   // 의상 정리 그림: 손목까지 몸에 맞는 새틴 긴소매
  // 세로 주름(골은 어둡고 마루는 밝은 새틴 광택), 손목 쪽으로 갈수록 주름이 깊어짐
  const SLV = [0.86, 0.58, 0.5], SLV_HI = [1.0, 0.84, 0.76];
  const sleeveFold = (t, a) => { const g = 0.3 + 0.7 * Math.min(1, t * 1.3), w = Math.sin(a * 5 + t * 1.5), k = 1 + 0.025 * w * g, l = 0.5 + 0.5 * w * g; return [k, SLV.map((v, i) => v + (SLV_HI[i] - v) * l * 0.45 - (1 - l) * 0.1)]; };
  function makeArm() {
    const sleeve = add(new THREE.BufferGeometry(), C.sleeve);
    // 레이스 두 겹: 손목에서 부드럽게 퍼지며 늘어지는 얇은 천, 끝은 둥근 물결(뾰족한 톱니 없음)
    const fr = [0, 1].map(k => {
      const L = 0.075 + k * 0.035, rp = []; for (let i = 0; i <= 10; i++) { const t = i / 10; rp.push(new THREE.Vector2(0.022 + k * 0.004 + Math.pow(t, 1.6) * (0.022 + k * 0.008), -t * L)); }
      const geo = new THREE.LatheGeometry(rp, 72), p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = p.getY(i), ang = Math.atan2(x, z), d = -y / L, w = 1 + 0.16 * Math.sin(ang * 5 + k * 1.3) * d * d; p.setXYZ(i, x * w, y - 0.03 * Math.max(0, Math.cos(ang)) * d * d, z * w); }
      geo.computeVertexNormals(); return add(geo, C.sheer);
    });
    fr.forEach(f => (f.visible = false));
    // 손목 레이스 전용 무늬: 구멍 없이 연한 꽃 레이스 선만, 끝은 단정한 반원 물결
    const wristTex = (() => {
      const w = 256, h = 96, c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
      x.fillStyle = "#fcf8f3"; x.fillRect(0, 0, w, h * 0.8);
      x.strokeStyle = "rgba(214,200,196,0.9)"; x.lineWidth = 1.6;
      for (let i = 0; i < 4; i++) { const cx = (i + 0.5) * w / 4; x.beginPath(); x.arc(cx, h * 0.38, 9, 0, 7); x.stroke(); for (let k = 0; k < 5; k++) { const a = k * 1.2566; x.beginPath(); x.ellipse(cx + Math.cos(a) * 14, h * 0.38 + Math.sin(a) * 11, 5, 3.5, a, 0, 7); x.stroke(); } }
      x.fillStyle = "#fcf8f3"; for (let i = 0; i < 8; i++) { x.beginPath(); x.arc((i + 0.5) * w / 8, h * 0.8, w / 16, 0, Math.PI); x.fill(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.anisotropy = 8; return t;
    })();
    const wl = mat("#ffffff", { map: LACE_TEX, alphaTest: 0.5, side: THREE.DoubleSide, emissive: new THREE.Color("#7a6e6e") });   // 치마와 같은 구멍 뚫린 레이스 무늬
    const curtain = [0, 1, 2].map(() => add(new THREE.BufferGeometry(), wl));
    const cuff = add(new THREE.TorusGeometry(1, 0.11, 6, 32), C.dressShade);   // 손목 새틴 띠
    const hand = new THREE.Group(); hand.matrixAutoUpdate = false; g.add(hand);
    return { sleeve, fr, curtain, cuff, hand };
  }
  // 손가락 하나: 관절 세 마디를 지나는 가는 관
  const finger = (pts, r0, r1) => limb(pts, t => r0 + (r1 - r0) * t, 10, 8);
  // 마이크 쥔 손: 손바닥 앞(+z)에 손잡이(로컬 x축)가 가로로 놓이고 네 손가락이 그 둘레를 감싸며, 엄지가 앞에서 눌러 잡음. 마이크 머리는 -x(엄지 쪽)
  function gripHand(hand) {
    add(new RoundedBoxGeometry(0.036, 0.046, 0.02, 3, 0.009), C.skin, hand).position.set(0, -0.026, 0);
    const c = V(0, -0.05, 0.022), R = 0.02;
    for (let f = 0; f < 4; f++) {
      const xf = -0.012 + f * 0.0085, pts = [];
      for (let i = 0; i <= 5; i++) { const ph = i / 5 * Math.PI * (1.0 - f * 0.04); pts.push(V(xf, c.y - Math.sin(ph) * R, c.z - Math.cos(ph) * R)); }
      add(finger(pts, 0.0058, 0.0048), C.skin, hand);
    }
    add(finger([V(-0.016, -0.012, 0.006), V(-0.022, -0.03, 0.022), V(-0.012, -0.045, 0.045), V(-0.002, -0.05, 0.047)], 0.0068, 0.005), C.skin, hand);
    const mic = new THREE.Group(); mic.position.copy(c); mic.scale.setScalar(0.8); hand.add(mic); g.userData.mic = mic;   // 장면에서 밤 조명이 마이크를 겨눌 때 씀
    const body = add(new THREE.CylinderGeometry(0.0145, 0.011, 0.16, 16), C.mic, mic); body.rotation.z = Math.PI / 2; body.position.x = 0.02;
    add(new THREE.CylinderGeometry(0.017, 0.0155, 0.012, 16), C.gold, mic).rotation.z = Math.PI / 2; mic.children[1].position.x = -0.064;
    add(new THREE.SphereGeometry(0.027, 18, 14), C.grille, mic).position.x = -0.088;
  }
  // 머리를 만지는 손: 손가락을 살짝 벌리고 굽힌 손
  function openHand(hand) {
    add(new RoundedBoxGeometry(0.036, 0.046, 0.018, 3, 0.008), C.skin, hand).position.set(0, -0.026, 0);
    for (let f = 0; f < 4; f++) { const xf = -0.012 + f * 0.0085, sp = (f - 1.5) * 0.004; add(finger([V(xf, -0.046, 0), V(xf + sp, -0.062, 0.01), V(xf + sp * 1.4, -0.07, 0.026)], 0.0055, 0.0045), C.skin, hand); }
    add(finger([V(-0.017, -0.012, 0.005), V(-0.026, -0.03, 0.016), V(-0.028, -0.045, 0.026)], 0.0065, 0.005), C.skin, hand);
  }
  const HAND_S = 1.4, R = makeArm(), L = makeArm(); gripHand(R.hand); openHand(L.hand); 
  // side: 오른손 -1, 왼손 +1. up: 손바닥 기준 엄지 방향으로 둘 세계 방향
  function pose(A, sh, wrist, pole, up, side) {
    const e = ik(sh, wrist, 0.19, 0.17, pole);
    A.sleeve.geometry.dispose(); A.sleeve.geometry = limb([sh, sh.clone().lerp(e, 0.5), e, e.clone().lerp(wrist, 0.5), wrist], armR, 30, 36, sleeveFold);
    // 프릴 세 겹(사진): 팔 아래쪽을 따라 붙어 아래로 늘어지는 물결 레이스, 손목 쪽으로 갈수록 길어짐
    const arm = new THREE.CatmullRomCurve3([sh, sh.clone().lerp(e, 0.5), e, e.clone().lerp(wrist, 0.5), wrist]);
    A.curtain.forEach((cm, k) => {
      const NI = 120, NJ = 8, s = 1 - 0.07 * k, c = arm.getPointAt(s), T = arm.getTangentAt(s), pos = [], idx = [], uv = [];
      const N0 = Math.abs(T.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0), Nn = N0.addScaledVector(T, -N0.dot(T)).normalize(), Bn = V().crossVectors(T, Nn), r0 = armR(s) + 0.003;
      for (let i = 0; i <= NI; i++) {
        const a = i / NI * Math.PI * 2, rd = Nn.clone().multiplyScalar(Math.cos(a)).addScaledVector(Bn, Math.sin(a)), ring = c.clone().addScaledVector(rd, r0);
        const low = 0.5 - 0.5 * rd.y, L = (0.055 + 0.022 * k) * (0.7 + 0.65 * low) * (1 + 0.12 * Math.sin(a * 3 + k));   // 아래쪽이 조금 더 길게, 길이가 고르지 않게
        for (let j = 0; j <= NJ; j++) {
          const v = j / NJ, wind = Math.sin(NOW.t * 1.8 + a * 2 + k * 0.9 - v * 2.2), fold = (0.012 * Math.sin(a * 6 + k * 1.7) + 0.004 * Math.sin(a * 17 + k)) * v + 0.006 * wind * v * v;
          // 크고 부드러운 주름으로 팔뚝을 따라 흘러내리다 아래로 살짝 늘어짐. 바람에 천천히 물결침
          const q = ring.clone().addScaledVector(T, -L * v * 0.45).addScaledVector(rd, (0.02 + 0.008 * k) * v + fold).addScaledVector(V(0, -1, 0), L * (0.3 + 0.25 * low) * v * v).addScaledVector(T, 0.008 * wind * v * v);
          pos.push(q.x, q.y, q.z); uv.push(i / NI * 7, 1 - v);
        }
      }
      for (let i = 0; i < NI; i++) for (let j = 0; j < NJ; j++) { const a = i * (NJ + 1) + j, b = a + NJ + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      cm.geometry.dispose(); cm.geometry = geo;
    });
    const dir = wrist.clone().sub(e).normalize();
    { const s0 = 0.995, rr = armR(s0) + 0.004; A.cuff.position.copy(arm.getPointAt(s0)); A.cuff.quaternion.setFromUnitVectors(V(0, 0, 1), arm.getTangentAt(s0)); A.cuff.scale.set(rr, rr, rr); }
    A.fr.forEach((f, k) => { f.position.copy(wrist).addScaledVector(dir, -0.008 - k * 0.03); const hang = dir.clone().multiplyScalar(-1).add(V(0, -0.12, 0)).normalize(); f.quaternion.setFromUnitVectors(V(0, -1, 0), hang); });
    // 손 좌표: -y가 손가락 방향(팔뚝 연장), 엄지는 로컬 -x. 왼손은 거울상(행렬식 음수)
    const Y = dir.clone().negate(), X = up.clone().addScaledVector(Y, -up.dot(Y)).normalize().negate();
    const Z = side < 0 ? V().crossVectors(X, Y) : V().crossVectors(Y, X);
    A.hand.matrix.makeBasis(X.multiplyScalar(HAND_S), Y.multiplyScalar(HAND_S), Z.multiplyScalar(HAND_S)).setPosition(wrist); A.hand.matrixWorldNeedsUpdate = true;
  }
  return {
    group: g,
    update(t) {
      NOW.t = t; flutter(t);
      const sway = Math.sin(t * 2.4);
      // 오른팔(사진 17:35): 어깨 높이로 옆으로 거의 곧게 뻗어 마이크를 앞사람 쪽으로 내밂
      pose(R, ARM.R.sh, ARM.R.wr.clone().add(V(0.006 * sway, 0.008 * Math.sin(t * 1.2), 0)), ARM.R.pole, V(-0.2, 0.55, 0.8).normalize(), -1);
      // 왼팔(사진 17:35): 팔꿈치는 몸 옆 아래로 내리고 손끝을 귀 위 머리카락에
      pose(L, ARM.L.sh, ARM.L.wr.clone().add(V(0, 0.005 * Math.sin(t * 1.3), 0)), ARM.L.pole, V(0, 0, -1), 1);
      head.rotation.z = 0.1 + 0.04 * Math.sin(t * 1.2); head.rotation.x = 0.14;
      HAIR_U.uHT.value = t; HAIR_U.uHeadDz.value = head.rotation.z - 0.1;
    },
  };
}
