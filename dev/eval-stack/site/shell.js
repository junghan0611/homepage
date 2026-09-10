// site/shell.js — 테마 토글 + 언어 선택 기억.
// 언어 전환 자체는 JS 없이 <a href>. 제3자 스크립트 없음.

(function () {
	var LIGHT = 'catppuccin-latte';
	var DARK = 'catppuccin-mocha';
	var KEY = 'lichtung-theme';
	var root = document.documentElement;

	function apply(theme) {
		root.setAttribute('data-webtui-theme', theme);
		document.querySelectorAll('.theme-btn').forEach(function (btn) {
			btn.setAttribute(
				'aria-pressed',
				btn.getAttribute('data-theme') === theme ? 'true' : 'false'
			);
		});
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
		var btn = ev.target.closest && ev.target.closest('.theme-btn');
		if (!btn) return;
		var next = btn.getAttribute('data-theme');
		if (next !== LIGHT && next !== DARK) return;
		apply(next);
		try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
	});

	document.addEventListener('click', function (ev) {
		var a = ev.target.closest && ev.target.closest('.seg a[hreflang]');
		if (!a) return;
		try { localStorage.setItem('lichtung-lang', a.getAttribute('hreflang')); } catch (e) {}
	});
})();
