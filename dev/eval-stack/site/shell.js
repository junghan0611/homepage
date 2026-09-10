// site/shell.js — 셸 동작. 두 가지만 한다: 테마 토글, 그리고 언어 선택 기억.
// 언어 전환 자체는 JS 없이 <a href> 로 한다 — 크롤러가 읽어야 하기 때문이다.
// 제3자 스크립트 없음(homepage/AGENTS.md: 제3자 트래커 금지).

(function () {
	var LIGHT = 'catppuccin-latte';
	var DARK = 'catppuccin-mocha';
	var KEY = 'lichtung-theme';
	var root = document.documentElement;

	function apply(theme) {
		root.setAttribute('data-webtui-theme', theme);
		var btn = document.querySelector('.theme-toggle');
		if (!btn) return;
		// 버튼은 "지금 무엇인지"가 아니라 "누르면 무엇이 되는지"를 말한다.
		var next = theme === DARK ? 'light' : 'dark';
		btn.textContent = btn.getAttribute('data-label-' + next);
	}

	var saved = null;
	try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
	if (saved !== LIGHT && saved !== DARK) {
		var prefersDark = window.matchMedia
			&& window.matchMedia('(prefers-color-scheme: dark)').matches;
		saved = prefersDark ? DARK : LIGHT;
	}
	apply(saved);

	document.addEventListener('click', function (ev) {
		var btn = ev.target.closest && ev.target.closest('.theme-toggle');
		if (!btn) return;
		var next = root.getAttribute('data-webtui-theme') === DARK ? LIGHT : DARK;
		apply(next);
		try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
	});

	// 언어 선택을 기억만 한다. 리다이렉트는 하지 않는다 —
	// 자동 리다이렉트는 크롤러와 직접 링크를 깨뜨린다(Hugo 도 하지 않는다).
	document.addEventListener('click', function (ev) {
		var a = ev.target.closest && ev.target.closest('.lang-switch');
		if (!a) return;
		try { localStorage.setItem('lichtung-lang', a.getAttribute('hreflang')); } catch (e) {}
	});
})();
