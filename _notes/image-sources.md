# 이미지 수집처

아카이브에 올릴 이미지를 구하는 사이트 목록이다. 기준은 **아카이브 사이트에 다시 올리기, 편집해서 게시하기, 굿즈로 판매하기**가 모두 가능한 것이다. 각 사이트의 이용 조건은 2026-10-30에 공식 페이지에서 확인했다.

게시 전 작품별 권리 확인 방법은 [handoff.md](handoff.md) 5절, 상표·개인정보 등 저작권 외 주의사항은 [image-usage-cautions.md](image-usage-cautions.md)를 따른다.

## 1. 공통 주의사항

- 사이트 전체가 자유 이용이라도 **작품마다 원본 페이지의 라이선스를 다시 확인**하고 `data.js`의 `sourceUrl`에 기록한다.
- 사용자가 올리는 사이트(Flickr, Wikimedia Commons, Openclipart 등)의 라이선스는 올린 사람이 붙인 것이다. 캐릭터, 로고, 영화·책 표지, 팬 작품이 섞여 있으면 라이선스 표시와 관계없이 쓰지 않는다.
- CC0나 퍼블릭 도메인이라도 상표권과 초상권은 따로 남는다. 기관 이름과 로고는 굿즈에 쓰지 않는다.
- CC BY는 작가, 작품명, 출처, 라이선스를 표기한다. CC BY-SA, NC, ND가 붙은 이미지는 쓰지 않는다.

## 2. 미술관·박물관·도서관

| 사이트 | 운영 | 쓸 수 있는 범위 | 자유 이용만 보는 주소 | 주로 있는 것 |
|---|---|---|---|---|
| 메트로폴리탄 미술관 | 미국 | 공식 API `isPublicDomain`이 `true`인 작품(CC0) | https://www.metmuseum.org/art/collection/search?showOnly=openAccess | 회화, 판화, 공예 |
| 게티 미술관 | 미국 | IIIF 매니페스트 `rights`가 CC0인 작품 | https://www.getty.edu/art/collection/ | 필사본, 회화, 사진 |
| 레이크스 미술관 | 네덜란드 | Copyright 항목이 Public Domain Mark인 작품 | https://www.rijksmuseum.nl/en/collection | 회화, 판화, 인쇄물 |
| 시카고 미술관 | 미국 | 공식 API `is_public_domain`이 `true`인 작품. 외부 사이트에서 이미지를 불러오면 막히므로 파일을 저장소에 넣는다 | https://www.artic.edu/collection (자유 이용 필터 주소는 봇 차단으로 확인하지 못함) | 회화, 포스터, 판화 |
| Smithsonian Open Access | 미국 | CC0 표시 작품. 출처 표기 불필요 | https://www.si.edu/search/images?edan_fq[0]=media_usage:CC0 | 사물 사진, 판화, 포스터, 자연사 |
| Paris Musées | 프랑스 파리시 | CC0 표시 작품 | https://www.parismuseescollections.paris.fr/en/recherche/image-libre/true | 판화, 포스터, 장식미술, 사진 |
| SMK Open | 덴마크 국립미술관 | "Free to use"(Public Domain Mark) 작품. 미술관이 찍은 전시장 사진(CC BY-SA)은 제외 | https://open.smk.dk/en/art?q=*&filters=public_domain%3Atrue | 회화, 드로잉, 판화 |
| Wellcome Collection | 영국 | Public Domain Mark·CC0 작품. 출처 표기를 요청함 | https://wellcomecollection.org/search/images?locations.license=pdm | 의학·박물학 삽화 |
| NDL 이미지뱅크 | 일본 국립국회도서관 | 보호기간 만료 이미지. 상업 이용 가능, 출처 표기를 요청함 | https://www.ndl.go.jp/imagebank/ | 우키요에, 일본 옛 삽화 |
| Biodiversity Heritage Library | 국제 도서관 연합 | 퍼블릭 도메인 자료. 권리 필터가 없어 자료마다 Copyright Status를 확인 | https://www.biodiversitylibrary.org/ | 동식물 도판 |
| Library of Congress Free to Use | 미국 의회도서관 | 주제별 묶음 안의 퍼블릭 도메인 자료. 자료마다 Rights Advisory 확인 | https://www.loc.gov/free-to-use/ | 그림책, 포스터, 일본 판화 |

## 3. 국가 공유저작물 서비스

| 사이트 | 쓸 수 있는 범위 | 주소 | 주로 있는 것 |
|---|---|---|---|
| 공유마당 | 이용조건이 `기증저작물 자유이용` 또는 `CC BY`인 작품. `조건부이용`과 NC·ND·SA는 제외. 모두 출처 표기 필요 | 일러스트 검색: https://gongu.copyright.or.kr/gongu/wrt/wrtCl/listWrtImage.do?menuNo=200018&searchWrd=%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8 | 국내 작가 기증 일러스트, 국외 고전 일러스트(장식 도안, 동식물 도감, 그림책 삽화) |
| 공공누리 | 제1유형 저작물. 출처 표기 필요. 상표로 등록된 캐릭터·로고는 제외 | https://www.kogl.or.kr/recommend/recommendDivList.do?division=img&atcTypeCode=1 | 공공기관 사진, 문양, 유물 |

공유마당의 국외 일러스트는 한국저작권위원회가 해마다 하는 공유저작물 DB 구축 사업으로 모은 것이다. 이 사업의 납품물은 CC BY 또는 CC0로 표시되므로, 저작권이 끝난 옛 작품도 CC BY로 표시되어 있다.

## 4. 여러 기관 자료를 모은 포털

규모는 크지만 기관마다 라이선스가 달라 작품마다 확인해야 한다.

| 사이트 | 자유 이용 필터 | 주의 |
|---|---|---|
| Wikimedia Commons | https://commons.wikimedia.org/w/index.php?search=illustration&title=Special:MediaSearch&type=image&haslicense=unrestricted&sort=recency | 사용자가 올리는 곳 |
| Openverse | https://openverse.org/search/image?q=illustration&license_type=commercial,modification | CC BY-SA가 섞임. 원본 사이트에서 다시 확인 |
| Flickr | https://www.flickr.com/search/?text=illustration&license=9%2C10&sort=date-posted-desc (CC0·공용 도메인) | 라이선스는 올린 사람이 붙인 것. 팬 작품이 많음 |
| Europeana | 검색 API `reusability=open` | CC BY-SA가 섞임. 웹사이트 이용 조건 원문은 확인하지 못함 |
| DPLA | https://dp.la/search?q=illustration&rightsCategory=%22Unlimited+Re-Use%22 | 권리가 불확실한 No Known Copyright 항목이 섞임 |
| Japan Search | 검색 화면 利用条件 → 商用利用 (`f-rights=+com`) | 편집 금지(CC BY-ND) 항목이 섞일 수 있음 |

## 5. 현대 일러스트 (CC0)

조건은 모두 충족하지만 양이 적고 그림체가 단순하다.

| 사이트 | 주소 | 내용 |
|---|---|---|
| Open Peeps | https://www.openpeeps.com/ | 손그림 인물 |
| Humaaans | https://www.humaaans.com/ | 조합형 인물 |
| Open Doodles | https://www.opendoodles.com/ | 낙서풍 인물, 약 30점 |
| Lukasz Adam | https://lukaszadam.com/illustrations | 플랫 일러스트, 약 120점 |
| Openclipart | https://openclipart.org/ | 클립아트. 사용자가 올리는 곳 |
| Public Domain Vectors | https://publicdomainvectors.org/ | 클립아트. 사용자가 올리는 곳 |

## 6. 쓰지 않는 사이트

| 사이트 | 이유 |
|---|---|
| Unsplash, Pexels, Pixabay | 이미지 그대로의 재배포·판매, 비슷한 서비스 구성을 금지 |
| unDraw, ManyPixels, DrawKit, Blush, Lummi | 재배포 또는 묶음 배포 금지. DrawKit·Blush는 굿즈 판매도 금지 |
| Freepik, Vecteezy, Storyset, Pixeltrue, Craftwork, Absurd Design | 재배포 금지, 대부분 굿즈 판매 금지 |
| rawpixel | 무료 상업 이용은 퍼블릭 도메인 컬렉션만 가능하고 나머지는 재배포 금지 |
| いらすとや, Loose Drawing, ソコスト, イラストAC 등 일본 무료 일러스트 | 소재가 중심인 콘텐츠·상품의 재배포·판매 금지 |
| 어반브러시 | 다른 사이트 재업로드 금지 |
| Gallica(프랑스 국립도서관) | 상업적 재이용은 유료 라이선스 |
| Civitai, Lexica | 사이트 안에서만 이용 허락, 또는 무료 플랜 비상업 |
| littledeep.com | 도박 사이트로 넘어감. 접속하지 않는다 |
