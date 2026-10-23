# 이미지 아카이브 사이트 인수인계

다른 컴퓨터에서 이 사이트 작업을 이어 가기 위한 문서다. 사이트 설계 규칙은 [design-spec.md](design-spec.md), 이미지 이용 주의사항은 [image-usage-cautions.md](image-usage-cautions.md)에 있다.

## 1. 현재 상태 (2026-10-23 기준)

- **공개 주소:** https://2wdoridu.github.io/archive/
- **저장소:** https://github.com/2wdoridu/archive (공개, `main` 브랜치 루트에서 GitHub Pages 배포)
- **단계:** 시안. 정적 HTML·CSS·JS로 만든 시안을 그대로 공개 중이다. 설계 문서의 최종 구조(Astro + 게시물 폴더)로는 아직 옮기지 않았다.
- **자리표시로 남아 있는 것:** 사이트 이름 `ARCHIVE`, 인스타그램 계정 `@instagram_handle`, 정보 페이지의 이름·소개·이메일·판매처, 모든 구매 링크(`#`), 직접 만든 작품(Work)과 커스텀 작품 이미지, 굿즈 사진.

## 2. 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 홈: 대형 사이트 이름, 판매품 필터, 벽돌형 그리드, PC 분할 상세 패널 |
| `detail.html` | 상세 페이지(`detail.html?id=게시물 식별자`) |
| `info.html` | 정보 페이지 |
| `style.css` | 전체 스타일. 색·여백·상단 바 높이 등은 `:root` 변수 |
| `common.js` | 공통 함수: 상세 렌더링(`renderDetail`), 갤러리, 카드, 형태 칩 |
| `data.js` | 게시물 데이터(`POSTS`). 디자인 하나를 이미지·굿즈 형태별 게시물로 펼치는 `design()` 포함 |
| `_tools/serve.mjs` | 로컬 확인용 정적 서버 |
| `_notes/` | 문서. 밑줄로 시작하는 폴더라 GitHub Pages 사이트에는 공개되지 않는다 |
| `CLAUDE.md` | Claude Code 작업 규칙 |

## 3. 다른 컴퓨터에서 시작하기

1. Git, Node.js, GitHub CLI, Claude Code를 설치한다.
2. GitHub CLI로 로그인한다: `gh auth login` 실행 후 브라우저에서 계정 `2wdoridu`으로 승인한다.
3. 저장소를 내려받는다: `gh repo clone 2wdoridu/archive`
4. 받은 `archive` 폴더에서 Claude Code를 연다. `CLAUDE.md`가 자동으로 읽힌다.
5. 로컬 확인: `node _tools/serve.mjs 4321` 실행 후 `http://localhost:4321` 접속.

커밋 작성자 이메일은 GitHub 비공개 주소를 쓴다.

```
git config user.name "2wdoridu"
git config user.email "40047261+2wdoridu@users.noreply.github.com"
```

## 4. 수정하고 배포하는 방법

1. 파일을 고치고 로컬 서버로 확인한다. PC는 1920px과 1536px(1920 모니터 + Windows 배율 125%), 휴대폰은 390px로 확인한다.
2. `index.html`, `detail.html`, `info.html`에서 CSS·JS를 부르는 주소의 버전 표시(`?v=날짜-번호`)를 올린다. 현재 값은 `20261023-4`.
3. 커밋하고 `git push` 한다.
4. 1~2분 뒤 공개 주소에 반영된다. 브라우저가 예전 파일을 보여 주면 Ctrl+F5.

## 5. 게시된 수집 원작

모두 각 미술관 공식 데이터로 권리를 확인했다.

| 식별자 | 작품 | 작가 | 연도 | 소장처 | 권리 | 원본 |
|---|---|---|---|---|---|---|
| `gazette-bon-ton` | 경이로운 나무, 아이들의 크리스마스 의상 | 샤를 마르탱 | 1914 | 레이크스 | Public Domain Mark | [링크](https://www.rijksmuseum.nl/en/collection/object/Gazette-du-Bon-Ton-1914-No-1-Pl-III-LArbre-Merveilleux-Costumes-denfants-pour-Noel--715df1a6ef636ab30d1d6921a4bfc438) |
| `pentecost` | 오순절 | 작자 미상(레겐스부르크) | 1030–1040년경 | 게티 | CC0 | [링크](https://www.getty.edu/art/collection/object/103S5G) |
| `christmas-card-1950` | 1950–1951년 성탄·신년 카드 | 작자 미상 | 1950 | 레이크스 | Public Domain Mark | [링크](https://www.rijksmuseum.nl/en/collection/object/Kerst-en-nieuwjaarswens-voor-1950-1951-van-Irene-en-Alfred-Brod--bf56bfb60a14d042443465e24c6488eb) |
| `last-supper` | 최후의 만찬 | 작자 미상(15세기 독일) | 15세기 | 메트로폴리탄 | CC0 | [링크](https://www.metmuseum.org/art/collection/search/382397) |
| `sweets-print` | 여러 가지 과자와 맛있는 것들 | 루트키 & 크라넨뷔르흐 출판 | 1848–1881 | 레이크스 | Public Domain Mark | [링크](https://www.rijksmuseum.nl/en/collection/object/Van-velerlei-gebak-en-ook-van-lekkernij-Is-deze-prent-voorzien-wat-uwe-keus-ook-zij-Beschouw-dus-lieve-jeugd-haar-steeds-tot-uw-vermaak-En-kies-er-alles-uit-dat-is-naar-uwen-smaak--05a50e4563ec840861bcc6527a621426) |
| `tortilla-vendor` | 머리에 쟁반을 인 토르티야 장수 | 판초 피에로 | 1848년경 | 메트로폴리탄 | CC0 | [링크](https://www.metmuseum.org/art/collection/search/819254) |
| `christmas-1874` | 크리스마스 | 작자 미상 | 1874 | 메트로폴리탄 | CC0 | [링크](https://www.metmuseum.org/art/collection/search/768558) |
| `harpers-christmas` | 하퍼스 매거진 크리스마스호 | 하비 엘리스 | 1898 | 메트로폴리탄 | CC0 | [링크](https://www.metmuseum.org/art/collection/search/339102) |

- `christmas-card-1950`: 카드 안쪽에 실제 개인 이름과 손글씨가 있어 제목에서 이름을 뺐다. 굿즈로 만들 때는 앞면 천사 그림만 쓴다.
- `harpers-christmas`: 상표 문제로 커스텀·굿즈 원작으로 연결하지 않는다. [image-usage-cautions.md](image-usage-cautions.md) 참고.

### 권리 확인 결과 사용할 수 없는 작품

| 작품 | 이유 |
|---|---|
| 앤드루 와이어스, Christmas Card (미국 국립미술관 59804) | 작가 2009년 사망, 저작권 있음, 다운로드 불가 |
| 구스타프 바우만, Fröhliche Weihnachten (시카고 20263) | 작가 1971년 사망, 시카고 미술관 퍼블릭 도메인 아님 |
| 에드워드 고리, Christmas Card with Robot and Female Prisoner (시카고 202030) | 작가 2000년 사망 |
| 오스틴 쿠퍼, Do your Christmas Shopping between 10 and 4 (시카고 14940) | 작가 1964년 사망, 런던 지하철 상표 문제도 있음 |
| 잔 비에루마 오스팅, Het Kerstmandje (레이크스) | 레이크스 Copyright 항목에 저작권자 표기, 다운로드 불가 |

### 권리 확인 방법

- **메트로폴리탄:** 공식 API `https://collectionapi.metmuseum.org/public/collection/v1/objects/{번호}`의 `isPublicDomain`이 `true`면 CC0.
- **게티:** 작품 IIIF 매니페스트의 `rights`가 CC0인지 확인한다. 작품 데이터의 CC BY 4.0은 게티가 쓴 설명 글에만 해당한다.
- **시카고:** 공식 API `https://api.artic.edu/api/v1/artworks/{번호}`의 `is_public_domain`.
- **레이크스:** 작품 페이지 Copyright 항목이 Public Domain Mark인지, 이미지 다운로드가 열려 있는지.
- 공통: 저작권은 제작 연도가 아니라 작가 사망 후 70년 기준이다. 작자 미상은 공표 후 70년.

## 6. 남은 작업

1. **툴루즈 로트레크 「A Merry Christmas」 추가:** 시카고 미술관 84458, 퍼블릭 도메인 확인 완료. 시카고 미술관이 외부 사이트에서 이미지를 불러오는 것을 막아서 링크로는 쓸 수 없다. 사용자가 작품 페이지에서 이미지를 직접 내려받으면, 사이트용 크기로 줄여 저장소에 넣고 수집 원작으로 등록한다.
2. **실제 내용 채우기:** 사이트 이름, 인스타그램 계정, 정보 페이지 내용, 판매처 링크(네이버 스마트스토어 상품 페이지), 실제 작품·커스텀 이미지, 굿즈 사진.
3. **커스텀 이미지 교체:** 커스텀 4개는 시안용 재채색 이미지(고흐 붓꽃 등)를 쓰고 있어 연결된 원작과 그림 내용이 다르다. 실제 커스텀 작품으로 바꾼다.
4. **최종 구조로 이전:** 설계 문서의 Astro + 게시물 폴더 구조로 옮기고, 배포 전 자동 검사(필수 항목, 원작 연결, 허용 라이선스)를 넣는다.
5. **사이트 아이콘(favicon) 추가.**

## 7. 결정 이력

### 기획
- 설명 없이 제목·제작일·재료 같은 정보만 보여 주는 아카이브. 시크한 톤, lummi.ai 같은 벽돌형 그리드.
- 내 작품(Work), 커스텀(Custom, 박물관 원작을 재채색하거나 요소를 강조한 작품), 수집(Collected)을 한 피드에 섞는다.
- 게시물 추가는 PC에서 Claude Code로 한다.
- "패러디" 대신 "커스텀"을 쓴다. 굿즈 맞춤 주문으로 오해될 수 있다는 점은 알고 정했다.

### 콘텐츠 모델
- 굿즈를 메인으로 둔다. 디자인 하나를 이미지 형태와 굿즈 형태(머그, 포스터 등)별 게시물로 나눠 피드에 각각 노출한다.
- 상세에서 같은 디자인의 형태끼리 형태 선택 칩으로 이동하고, 원작은 별도 묶음으로 둔다.
- 굿즈 게시물은 여러 장의 사진(정면·측면 등)을 갤러리로 보여 준다.

### 화면
- 라이트 배경(미색 `#F4F4F1`), Archivo + IBM Plex Mono, 한글은 Pretendard + 나눔고딕코딩, 강조색은 클라인 블루 하나.
- 화면 문구는 한국어로 쓴다.
- PC 홈은 구글 이미지 검색처럼 그리드 왼쪽, 상세 패널 오른쪽으로 나눈다. 패널 이미지를 누르면 상세 페이지로 간다.
- 상세는 이미지 아래에 정보. 항목 이름 없이 위계로 구분하고, 원작·커스텀 묶음은 구분선 아래에 둔다.
- 상세 페이지 닫기 버튼은 상단 바 오른쪽 끝에 둔다.
- 상세 좌우 여백은 화면 폭의 12.5%(1920px에서 240px).
- 상단 바 높이 PC 64px, 휴대폰 52px.
- 피드의 내 작품 표시(파란 점)는 없앴다.

### 배포
- NAS 하위 폴더 배포를 검토했으나 GitHub Pages로 정했다. NAS 웹 폴더 루트에는 다른 업무 시스템이 운영 중이라 절대 덮어쓰지 않는다.
- 커밋별 상세 변경은 `git log`로 확인한다.

## 8. 사업 구조 요약

```
손님: 사이트에서 [구매하기] → 네이버 스마트스토어에서 주문·결제
  → 주문 정보가 굿즈 제작·배송 대행사(POD SHOP)로 자동 전달
  → 판매자가 미리 등록한 디자인으로 제작 → 포장 → 손님에게 직접 택배
  → 구매확정 후 네이버가 판매자에게 정산
```

- 재고가 없고, 판매자는 디자인 등록·홍보·고객 응대만 한다.
- POD SHOP 기준: 결제 후 1시간이 지나면 제작이 시작되어 취소 불가, 단순 변심 반품 불가, 불량·파손은 수령 후 7일 이내 사진과 함께 접수하면 재제작 또는 환불.
- 상품 페이지에 주문 제작 상품의 반품 제한, 1시간 이후 취소 불가, 화면과 인쇄 색상 차이를 미리 알린다.
