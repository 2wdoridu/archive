// 관람 기록 데이터. 최신순으로 적는다.
// 이미지 비율은 3:4(1080×1440). 휴대폰 카메라 기본 비율이자 인스타그램 그리드 비율이다.
// 지금은 모든 항목이 같은 샘플 이미지를 쓴다.
const SEEN = [
  { id: "akmu-paradise-of-rumors-gangneung", kind: "콘서트", title: "소문의 낙원", by: "악뮤", date: "2026.11.07", place: "강릉 스피드 스케이팅 경기장", img: "img/sample.webp" },
  { id: "sample-1", kind: "영화",   title: "샘플 영화 1",   date: "2026.11.02", place: "샘플 극장",   img: "img/sample.webp" },
  { id: "sample-2", kind: "콘서트", title: "샘플 콘서트 1", date: "2026.10.25", place: "샘플 공연장", img: "img/sample.webp" },
  { id: "sample-3", kind: "전시",   title: "샘플 전시 1",   date: "2026.10.18", place: "샘플 미술관", img: "img/sample.webp" },
  { id: "sample-4", kind: "뮤지컬", title: "샘플 뮤지컬 1", date: "2026.10.11", place: "샘플 극장",   img: "img/sample.webp" },
  { id: "sample-5", kind: "영화",   title: "샘플 영화 2",   date: "2026.10.03", place: "샘플 극장",   img: "img/sample.webp" },
  { id: "sample-6", kind: "전시",   title: "샘플 전시 2",   date: "2026.09.27", place: "샘플 미술관", img: "img/sample.webp" },
  { id: "sample-7", kind: "콘서트", title: "샘플 콘서트 2", date: "2026.09.20", place: "샘플 공연장", img: "img/sample.webp" },
  { id: "sample-8", kind: "뮤지컬", title: "샘플 뮤지컬 2", date: "2026.09.13", place: "샘플 극장",   img: "img/sample.webp" },
];
