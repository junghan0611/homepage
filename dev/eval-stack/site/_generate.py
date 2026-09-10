#!/usr/bin/env python3
"""site/ 정적 셸 생성기 — lichtung 검수용.

이 파일은 **SSG 모양의 구멍**이다. 회수되면 Hugo가 이 자리를 메운다.
여기 있는 세 표는 각각 homepage의 무엇에 대응하는지 이름이 붙어 있고,
그 대응표가 docs/site-shell.md 의 회수 절이다.

  STRINGS  ↔ homepage/i18n/{en,ko}.yaml
  MENU     ↔ homepage/hugo.yaml  menu.main
  FOOTER   ↔ homepage/layouts/_partials/custom/footer.html
  PAGES    ↔ homepage/content/**/_index{,.ko}.md

실행:  python3 site/_generate.py
검증:  키 짝이 안 맞으면 생성 전에 죽는다(언어 간 구조 패리티 강제).
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
LANGS = ("en", "ko")

# ─────────────────────────────────────────────────────────────────────
# STRINGS ↔ homepage/i18n/{en,ko}.yaml
# 실제 homepage 파일의 키를 그대로 가져오고(직접 읽음), 셸에 필요한 키만 더했다.
# ─────────────────────────────────────────────────────────────────────
STRINGS = {
	"en": {
		# --- homepage/i18n/en.yaml 에 실재하는 키 ---
		"backToTop": "Scroll to top",
		"changeLanguage": "Change language",
		"changeTheme": "Change theme",
		"dark": "Dark",
		"light": "Light",
		"lastUpdated": "Last updated on",
		"onThisPage": "On this page",
		"readMore": "Read more →",
		"copyright": "© 2026 junghanacs",
		# --- 셸에 새로 필요한 키 ---
		"siteTitle": "Authology",
		"siteTagline": "Meditations on Technology, Learning, Life, and Text-editor",
		"skipToContent": "Skip to content",
		"otherLangName": "한국어",
		"postedOn": "Posted",
		"tagsLabel": "Tags",
		"allPosts": "All posts",
		"noPostsYet": "No posts yet.",
	},
	"ko": {
		"backToTop": "맨위로 스크롤",
		"changeLanguage": "언어변경",
		"changeTheme": "테마변경",
		"dark": "어두운 테마",
		"light": "밝은 테마",
		"lastUpdated": "마지막 수정일자",
		"onThisPage": "페이지 목차",
		"readMore": "더보기 →",
		"copyright": "© 2026 junghanacs",
		"siteTitle": "어쏠로지",
		"siteTagline": "기술과 배움, 삶, 그리고 텍스트 에디터에 관한 명상",
		"skipToContent": "본문으로 건너뛰기",
		"otherLangName": "English",
		"postedOn": "작성",
		"tagsLabel": "태그",
		"allPosts": "전체 글",
		"noPostsYet": "아직 글이 없습니다.",
	},
}

# ─────────────────────────────────────────────────────────────────────
# MENU ↔ homepage/hugo.yaml  menu.main
# 실물에서 옮김. 실물은 언어별 오버라이드가 없어 KO에서도 영어 라벨이 나온다
# (docs/site-shell.md 「발견」 절). 여기서는 라벨을 언어별로 갈라 둔다.
# route=None 이면 외부 링크(외부는 언어 전환 대상이 아니다).
# ─────────────────────────────────────────────────────────────────────
MENU = [
	{"route": "projects", "label": {"en": "Projects", "ko": "프로젝트"}},
	{"route": "blog", "label": {"en": "Blog", "ko": "블로그"}},
	{"route": "about", "label": {"en": "About", "ko": "소개"}},
	{"url": "https://notes.junghanacs.com", "label": {"en": "Notes ↗", "ko": "노트 ↗"}},
	{"url": "https://ax.junghanacs.com", "label": {"en": "AX ↗", "ko": "AX ↗"}},
	{"url": "https://agenda.junghanacs.com", "label": {"en": "Agenda ↗", "ko": "어젠다 ↗"}},
	{"url": "https://github.com/junghan0611", "label": {"en": "GitHub", "ko": "GitHub"}},
]

# ─────────────────────────────────────────────────────────────────────
# FOOTER ↔ homepage/layouts/_partials/custom/footer.html
# 실물의 링크 10개를 그대로 옮겼다. 라벨은 고유명사라 언어 공통.
# ─────────────────────────────────────────────────────────────────────
FOOTER = [
	("@junghan0611", "https://github.com/junghan0611"),
	("Threads", "https://www.threads.net/@junghanacs"),
	("Bluesky", "https://bsky.app/profile/junghanacs.bsky.social"),
	("Mastodon", "https://fosstodon.org/@junghanacs"),
	("RSS", None),          # ← Hugo가 낸다. 슬롯만 둔다
	("Source", "https://github.com/junghan0611/homepage"),
	("Garden", "https://notes.junghanacs.com"),
	("Agenda", "https://agenda.junghanacs.com"),
	("AX", "https://ax.junghanacs.com"),
	("AIONS", "https://aionsclubs.org"),
]

# ─────────────────────────────────────────────────────────────────────
# 대문 카드 ↔ homepage/content/_index{,.ko}.md 의 {{< card >}} 6개
# ─────────────────────────────────────────────────────────────────────
HOME_CARDS = [
	{"route": "blog", "title": {"en": "Blog", "ko": "블로그"}, "sub": {"en": "", "ko": ""}},
	{"url": "https://notes.junghanacs.com",
	 "title": {"en": "Digital Garden", "ko": "디지털 가든"}, "sub": {"en": "", "ko": ""}},
	{"url": "https://agenda.junghanacs.com",
	 "title": {"en": "Live Agenda", "ko": "라이브 어젠다"},
	 "sub": {"en": "geworfen — existence-data dashboard", "ko": "geworfen — 존재 데이터 대시보드"}},
	{"url": "https://ax.junghanacs.com",
	 "title": {"en": "AX Record", "ko": "AX 기록"},
	 "sub": {"en": "PKM-native agent engineering, from claim to evidence",
	         "ko": "PKM 네이티브 에이전트 엔지니어링 — 주장부터 증거까지"}},
	{"url": "https://aionsclubs.org",
	 "title": {"en": "AIONS Clubs", "ko": "AIONS CLUBS"},
	 "sub": {"en": "The residence of B — an advisory desk and occasional bricks",
	         "ko": "AIONS CLUBS 인터내쇼날의 B"}},
	{"route": "about", "title": {"en": "About", "ko": "소개"}, "sub": {"en": "", "ko": ""}},
]

HOME_HERO = {
	"en": {
		"h": "Authology: One Life, One Tool",
		"bullets": ["Authological Thinking", "Productivity & Digital Minimalism",
		            "Hyper-focus & Meaningful Life", "Personalized AI", "One Shot Publishing"],
		"lede": "Life is always as-it-is. This one tool is all there is — "
		        "nothing to add, nothing to remove.",
		"explore": "Explore",
	},
	"ko": {
		"h": "어쏠로지: 원라이프 인생도구",
		"bullets": ["어쏠로지컬 사유", "생산성과 디지털 미니멀리즘",
		            "초집중과 의미 있는 삶", "개인화된 AI", "원샷 퍼블리싱"],
		"lede": "삶은 언제나 여여(如如)하다. 이 녀석 하나 뿐이지만 더할 것도 뺄 것도 없다.",
		"explore": "둘러보기",
	},
}

PROJECTS = [
	{"name": "entwurf", "url": "https://github.com/junghan0611/entwurf",
	 "sub": {"en": "Garden-citizen dispatch substrate — a thin bridge that lets Claude Code, "
	               "Copilot, Codex, Antigravity, OMP, and pi address one another by garden id.",
	         "ko": "가든-시민 디스패치 기반 — Claude Code, Copilot, Codex, Antigravity, OMP, pi가 "
	               "garden id로 서로를 부를 수 있게 하는 얇은 다리."}},
]
PROJECTS_LEDE = {
	"en": "Open source tools from junghan0611 — built for garden-native, agent-driven work.",
	"ko": "junghan0611의 오픈소스 도구들 — 가든-네이티브, 에이전트 주도 작업을 위해 만들었습니다.",
}

POSTS = [
	{"slug": "evaluated-page", "date": "2026-09-10",
	 "tags": {"en": ["clojure", "org-mode", "emacs"], "ko": ["clojure", "org-mode", "emacs"]},
	 "title": {"en": "A page that evaluates", "ko": "평가되는 페이지"},
	 "summary": {
		 "en": "The publishing surface is the only dead thing in my workflow. "
		       "Everything else — Emacs, org, the REPL — is alive.",
		 "ko": "내 작업면은 전부 살아 있다. Emacs, org, REPL. "
		       "그런데 세상에 내놓는 면만 굳은 HTML 한 장이다."},
	 "body": {
		 "en": ["Hextra gives a great deal for free: taxonomy, RSS, bilingual siblings, "
		        "a JSON-LD identity layer, crawler legibility. None of that is what bothers me.",
		        "What bothers me is that the document stops when it reaches the reader. "
		        "In Emacs a block of Lisp is a thing I can press. On the page it is a picture of "
		        "a thing I could have pressed.",
		        "This page is the smallest test of the opposite: the shell stays static, "
		        "and only evaluation is added on top."],
		 "ko": ["hextra는 공짜로 많은 것을 준다 — taxonomy, RSS, 이중언어 형제 파일, "
		        "JSON-LD 신원층, 크롤러 판독성. 불만은 거기 있지 않다.",
		        "불만은 문서가 독자에게 닿는 순간 멈춘다는 것이다. Emacs에서 Lisp 블록은 "
		        "내가 누를 수 있는 것이다. 페이지 위에서는 누를 수 있었던 것의 사진이다.",
		        "이 페이지는 그 반대를 재는 가장 작은 시험이다 — 껍데기는 정적으로 두고 "
		        "평가만 위에 얹는다."]}},
]

ABOUT = {
	"en": {"h": "About",
	       "body": ["Junghan Kim (김정한) — GLG. Polymath engineer and digital gardener.",
	                "I build a reproducible knowledge environment with NixOS, Emacs, "
	                "Org-mode and Denote, and I write about what that costs and what it returns.",
	                "The raw networked notes live in the garden. This is the front gate."]},
	"ko": {"h": "소개",
	       "body": ["김정한 (Junghan Kim) — GLG. 폴리매스 엔지니어이자 디지털 가드너.",
	                "NixOS, Emacs, Org-mode, Denote로 재현 가능한 지식 환경을 만들고, "
	                "그 대가와 소득에 대해 씁니다.",
	                "날것의 연결된 노트는 가든에 있습니다. 여기는 대문입니다."]},
}

# ─────────────────────────────────────────────────────────────────────
# 라우팅 — production과 같은 모양.  EN=루트, KO=/ko/
# homepage/hugo.yaml 에 defaultContentLanguageInSubdir 가 없다(직접 읽음).
# ─────────────────────────────────────────────────────────────────────

def url_for(lang, route):
	"""사이트 루트 기준 경로. route ''는 홈."""
	parts = (["ko"] if lang == "ko" else []) + ([route] if route else [])
	return "/".join(parts) + ("/" if parts else "")


def depth_of(lang, route):
	return len(url_for(lang, route).strip("/").split("/")) if url_for(lang, route).strip("/") else 0


def rel(from_lang, from_route, to_lang, to_route):
	"""페이지 사이 상대 경로. file:// 에서도 http 에서도 접두사와 무관하게 돈다."""
	up = "../" * depth_of(from_lang, from_route)
	target = url_for(to_lang, to_route)
	return (up + target) or "./"


def asset(lang, route, name):
	return "../" * depth_of(lang, route) + name


def other(lang):
	return "ko" if lang == "en" else "en"


# ─────────────────────────────────────────────────────────────────────
# 셸 조각 — 회수되면 각각 Hugo partial 하나가 된다
# ─────────────────────────────────────────────────────────────────────

def head(lang, route, title, desc):
	s = STRINGS[lang]
	a = lambda n: asset(lang, route, n)
	twin = rel(lang, route, other(lang), route)
	return f"""<!DOCTYPE html>
<html lang="{lang}" data-webtui-theme="catppuccin-latte">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — {s['siteTitle']}</title>
<meta name="description" content="{desc}">
<link rel="alternate" hreflang="{other(lang)}" href="{twin}">
<link rel="alternate" hreflang="{lang}" href="./">
<!-- SLOT: JSON-LD @graph 신원층 — Hugo가 낸다.
     homepage/layouts/partials/custom/head-end.html (195행) 이 자리를 메운다.
     화이트리스트: 홈 / blog 목록 / blog 글. 여기서 재구현하지 않는다. -->
<!-- SLOT: RSS <link rel="alternate" type="application/rss+xml"> — Hugo가 낸다. -->
<!-- SLOT: Umami(셀프호스팅) 스니펫 — 발행면에서만. 제3자 트래커 금지(homepage/AGENTS.md). -->
<link rel="stylesheet" href="{a('site.css')}">
<script src="{a('shell.js')}" defer></script>
</head>
<body>
<a class="skip-link" href="#main">{s['skipToContent']}</a>
"""


def nav(lang, route):
	s = STRINGS[lang]
	home = rel(lang, route, lang, "")
	items = []
	for m in MENU:
		if "url" in m:
			href, ext = m["url"], ' target="_blank" rel="noopener noreferrer"'
		else:
			href, ext = rel(lang, route, lang, m["route"]), ""
		cur = ' aria-current="page"' if m.get("route") == route and route else ""
		items.append(f'      <li><a href="{href}"{ext}{cur}>{m["label"][lang]}</a></li>')
	twin = rel(lang, route, other(lang), route)
	return f"""<header class="site-head">
  <nav class="site-nav" aria-label="main">
    <a class="site-brand" href="{home}">{s['siteTitle']}</a>
    <ul class="site-menu">
{chr(10).join(items)}
    </ul>
    <div class="site-tools">
      <a class="lang-switch" href="{twin}" hreflang="{other(lang)}"
         lang="{other(lang)}" title="{s['changeLanguage']}">{s['otherLangName']}</a>
      <button class="theme-toggle" type="button"
              title="{s['changeTheme']}" aria-label="{s['changeTheme']}"
              data-label-light="{s['light']}" data-label-dark="{s['dark']}"></button>
    </div>
  </nav>
</header>
"""


def footer(lang, route):
	s = STRINGS[lang]
	links = []
	for label, href in FOOTER:
		if href is None:
			links.append(f'    <!-- SLOT: {label} — Hugo가 낸다 (blog/index.xml) -->')
		else:
			ext = ' target="_blank" rel="noopener noreferrer"' if href.startswith("http") else ""
			links.append(f'    <a href="{href}"{ext}>{label}</a>')
	return f"""<footer class="site-foot">
  <div class="foot-links">
{chr(10).join(links)}
  </div>
  <div class="foot-meta">
    <span>{s['copyright']}</span>
    <!-- SLOT: llms.txt / sitemap.xml — Hugo·static 이 낸다. -->
  </div>
  <a class="to-top" href="#top">{s['backToTop']}</a>
</footer>
</body>
</html>
"""


def page(lang, route, title, desc, main):
	return head(lang, route, title, desc) + nav(lang, route) \
		+ f'<main id="main" class="site-main">\n{main}\n</main>\n' + footer(lang, route)


# ─────────────────────────────────────────────────────────────────────
# 각 면
# ─────────────────────────────────────────────────────────────────────

def card(href, title, sub, ext):
	e = ' target="_blank" rel="noopener noreferrer"' if ext else ""
	subhtml = f'\n    <span class="card-sub">{sub}</span>' if sub else ""
	return f'  <a class="card" href="{href}"{e}>\n' \
	       f'    <span class="card-title">{title}</span>{subhtml}\n  </a>'


def render_home(lang):
	s, h = STRINGS[lang], HOME_HERO[lang]
	bullets = "\n".join(f"    <li>{b}</li>" for b in h["bullets"])
	cards = []
	for c in HOME_CARDS:
		if "url" in c:
			cards.append(card(c["url"], c["title"][lang], c["sub"][lang], True))
		else:
			cards.append(card(rel(lang, "", lang, c["route"]), c["title"][lang], c["sub"][lang], False))
	main = f"""<section class="hero">
  <h1 class="hero-title">{h['h']}</h1>
  <ul class="hero-bullets">
{bullets}
  </ul>
  <p class="hero-lede">{h['lede']}</p>
</section>

<section class="cards-section">
  <h2 class="section-title">{h['explore']}</h2>
  <div class="card-grid">
{chr(10).join(cards)}
  </div>
</section>"""
	return page(lang, "", s["siteTitle"], s["siteTagline"], main)


def render_projects(lang):
	cards = [card(p["url"], p["name"], p["sub"][lang], True) for p in PROJECTS]
	label = "Projects" if lang == "en" else "프로젝트"
	main = f"""<h1 class="page-title">{label}</h1>
<p class="page-lede">{PROJECTS_LEDE[lang]}</p>
<div class="card-grid">
{chr(10).join(cards)}
</div>"""
	return page(lang, "projects", label, PROJECTS_LEDE[lang], main)


def render_blog_list(lang):
	s = STRINGS[lang]
	label = "Blog" if lang == "en" else "블로그"
	rows = []
	for p in POSTS:
		href = rel(lang, "blog", lang, "blog/" + p["slug"])
		tags = "".join(f'<a class="tag" href="#" is-="badge" variant-="background2">{t}</a>'
		               for t in p["tags"][lang])
		rows.append(f"""  <article class="post-item">
    <div class="post-meta"><time datetime="{p['date']}">{p['date']}</time>
      <span class="post-tags">{tags}</span></div>
    <h2 class="post-title"><a href="{href}">{p['title'][lang]}</a></h2>
    <p class="post-summary">{p['summary'][lang]}</p>
    <a class="read-more" href="{href}">{s['readMore']}</a>
  </article>""")
	main = f"""<h1 class="page-title">{label}</h1>
<!-- SLOT: taxonomy 배지(Series/Categories/Tags) — Hugo taxonomy 가 낸다.
     실물은 지금 꺼져 있다: EN 이 루트라 /en/series 같은 경로가 404 였다.
     (homepage/content/blog/_index.md 주석) 되살릴 때 EN 루트 기준으로. -->
<!-- SLOT: RSS 배지 — index.xml, Hugo 가 낸다. -->
<div class="post-list">
{chr(10).join(rows) if rows else '  <p>' + s['noPostsYet'] + '</p>'}
</div>"""
	return page(lang, "blog", label, s["siteTagline"], main)


def render_post(lang, p):
	s = STRINGS[lang]
	route = "blog/" + p["slug"]
	tags = "".join(f'<a class="tag" href="#" is-="badge" variant-="background2">{t}</a>'
	               for t in p["tags"][lang])
	body = "\n".join(f"  <p>{b}</p>" for b in p["body"][lang])
	main = f"""<article class="post">
  <h1 class="post-title">{p['title'][lang]}</h1>
  <div class="post-meta">
    <span>{s['postedOn']} <time datetime="{p['date']}">{p['date']}</time></span>
    <span class="post-tags">{tags}</span>
  </div>
  <div class="post-body">
{body}
  </div>
  <!-- SLOT: 평가되는 셀(.org-cell) — proto/ 의 마크업 계약 그대로 들어올 자리.
       계약: data-state = idle|running|ok|error, 출력은 .org-cell-out 텍스트. -->
  <!-- SLOT: remark42 댓글(셀프호스팅) — homepage/layouts/_partials/components/comments.html -->
  <!-- SLOT: "이 페이지 편집" 링크 — Hugo editURL -->
</article>
<p class="post-back"><a href="{rel(lang, route, lang, 'blog')}">← {s['allPosts']}</a></p>"""
	return page(lang, route, p["title"][lang], p["summary"][lang], main)


def render_about(lang):
	a = ABOUT[lang]
	body = "\n".join(f"  <p>{b}</p>" for b in a["body"])
	main = f"""<h1 class="page-title">{a['h']}</h1>
<div class="prose">
{body}
</div>"""
	return page(lang, "about", a["h"], a["body"][0], main)


# ─────────────────────────────────────────────────────────────────────

def check_parity():
	"""언어 간 구조 패리티 — i18n 의 진짜 어려운 부분은 여기다."""
	base = set(STRINGS["en"])
	for lang in LANGS:
		miss, extra = base - set(STRINGS[lang]), set(STRINGS[lang]) - base
		if miss or extra:
			sys.exit(f"i18n 키 불일치 [{lang}] 없음={sorted(miss)} 남음={sorted(extra)}")
	for m in MENU + HOME_CARDS:
		for lang in LANGS:
			if lang not in m["label" if "label" in m else "title"]:
				sys.exit(f"메뉴/카드 라벨에 {lang} 없음: {m}")
	for p in POSTS:
		for k in ("title", "summary", "body", "tags"):
			for lang in LANGS:
				if lang not in p[k]:
					sys.exit(f"글 '{p['slug']}' 의 {k} 에 {lang} 없음")
	print("i18n 패리티 OK — 두 언어의 키·라벨·글이 모두 짝을 이룬다")


def write(path, text):
	full = os.path.join(HERE, path)
	os.makedirs(os.path.dirname(full), exist_ok=True)
	with open(full, "w", encoding="utf-8") as f:
		f.write(text)
	return path


def main():
	check_parity()
	written = []
	for lang in LANGS:
		pre = "ko/" if lang == "ko" else ""
		written.append(write(f"{pre}index.html", render_home(lang)))
		written.append(write(f"{pre}projects/index.html", render_projects(lang)))
		written.append(write(f"{pre}blog/index.html", render_blog_list(lang)))
		written.append(write(f"{pre}about/index.html", render_about(lang)))
		for p in POSTS:
			written.append(write(f"{pre}blog/{p['slug']}/index.html", render_post(lang, p)))
	for w in written:
		print("  ", w)
	print(f"{len(written)}개 생성. EN=루트, KO=/ko/ — production 과 같은 모양.")


if __name__ == "__main__":
	main()
