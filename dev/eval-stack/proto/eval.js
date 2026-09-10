// eval 축 소유. .org-cell의 data-state와 .org-cell-out만 건드린다.
// 마크업: .org-section 이 <details> 여도 이 파일은 .org-cell 만 조회.
// Emmy: 공식 scittle CDN 에는 없다. scittle-kitchen@0.8.33-105 의
// scittle.emmy.js (jsdelivr) 가 우회로. index.html 이 그 플러그인을 신다.
// npm 패키지명 "emmy" 는 무관한 이벤트 이미터 — 그 경로는 여전히 아님.
document.querySelectorAll('.org-cell').forEach(function (cell) {
	var btn = cell.querySelector('.org-cell-eval');
	var src = cell.querySelector('.org-cell-src');
	var out = cell.querySelector('.org-cell-out');

	btn.addEventListener('click', function () {
		cell.dataset.state = 'running';
		try {
			var result = scittle.core.eval_string(src.value);
			cell.dataset.state = 'ok';
			out.textContent = String(result);
		} catch (e) {
			cell.dataset.state = 'error';
			out.textContent = 'ERROR: ' + (e && e.message ? e.message : String(e));
		}
	});
});
