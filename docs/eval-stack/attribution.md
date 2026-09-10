# 예우·라이선스 감사 — SICM / Emmy / 스택

담당: claude-opus-5 (claudecode, garden id `20260910T122049-f3aa75`, 2026-09-10 KST).
조율: garden id `20260910T105902-b5c352`. 커밋 안 함. 이 파일 하나만 씀.

**증거 표기** — 각 사실 문장에 붙는다.
`[1차 실측]` 이 세션에서 직접 받아 읽은 원본 파일 / HTTP 응답 ·
`[직접 읽음 path:line]` 로컬 파일 ·
`[웹 출처 URL]` 원격 문서 ·
`[미확인]` 확인하지 못함, 추정.

**면책.** 나는 변호사가 아니고 이것은 법률 자문이 아니다. 아래는 **원문을 직접 받아 읽고
정리한 판정 재료**이며, 조항 인용은 전부 1차 텍스트에서 왔다. 다만 "모르겠다"로 닫지
않는다 — 무엇을 하면 조항이 충족되는지, 무엇이 회색인지, 무엇이 확인 불가인지를 갈라
적었다. 회색과 확인 불가는 그렇다고 이름 붙였다.

**이 일의 성격.** 법무 회피가 아니다. GLG 원문: *"스승들에 대한 존경에 예우를 해야된다.
내 입장에선."* 조항 충족은 예우의 최소선이고, §3이 이 문서의 목적이다. §2는 그 최소선을
못 지키면 예우가 성립하지 않기 때문에 있다.

---

## 0. 지금 당장 지켜야 하는 것

**의무는 아직 발생하지 않았다.** `proto/`는 로컬 파일이고 이 리포에 배포 설정이 없다
`[1차 실측: 리포 루트에 netlify.toml·CI 워크플로 없음, 파일은 KONZEPT.md·NEXT.md·docs/·proto/ 뿐]`.
GPL의 의무도 CC의 의무도 **"Distribute / convey"** 시점에 걸린다. Netlify든 GitHub Pages든
공개 URL로 올리는 순간 발생한다. 그러니 지금은 시간이 있고, 발행 전에 아래를 닫으면 된다.

발행 전 체크리스트 — 순서대로:

1. **`scittle.emmy.js`에는 라이선스 배너가 한 줄도 없다.** [1차 실측: 4,093,648 B 전체
   내려받아 `licen[cs]e|GPL|copyright` grep → 0건] 그러니 **페이지가 대신 말해야 한다.**
   고지를 안 붙이면 GPL 위반 상태로 발행된다. → §2.5

2. **JavaScript 라이선스 라벨 페이지 한 장** (`/javascript.html` 또는 Hugo 페이지)과, Emmy를
   싣는 모든 페이지 푸터에 `rel="jslicense"` 링크. FSF가 이 형식이 GNU 라이선스 조항을
   충족한다고 명시한다 `[웹 출처 https://www.gnu.org/licenses/javascript-labels.html]`. → §2.5 (붙여넣을 마크업 있음)

3. **대응 소스(Corresponding Source) 경로를 페이지에 적는다.** GPLv3 §6(d)는 소스가 다른
   서버에 있어도 되지만 *"clear directions next to the object code saying where to find the
   Corresponding Source"*를 요구한다 `[1차 실측: Emmy LICENSE 사본 §6(d) 원문]`.
   여기서 대응 소스 = Emmy `v0.32.0` 태그 + scittle-kitchen 빌드 설정. → §2.5

4. **SICM 원문을 인용하는 페이지에 CC BY-NC-SA 3.0 고지와 저자 표기.** 라이선스 URI를 반드시
   포함해야 한다(§4(a)·4(b) 모두 *"include a copy of, or the URI, for"* 요구)
   `[1차 실측: CC BY-NC-SA 3.0 legalcode 원문]`. → §3.3 (붙여넣을 문안 있음)

5. **저자 표기를 고친다.** 온라인 2판의 저자는 **Sussman과 Wisdom 둘**이다. Mayer는 1판
   공저자다. → §1.1

6. **NC 경계를 문서에 못 박는다.** SICM 원문을 싣는 페이지에는 광고·후원 버튼·유료
   게이트·제휴 링크를 영구히 두지 않는다. 사이트가 수익화되면 그 페이지는 내리거나
   링크로 바꾼다. → §1.1·§6

7. **리포 라이선스를 정한다.** 지금 `lichtung`에 `LICENSE` 파일이 없다
   `[1차 실측: 리포 루트 목록]`. SICM 발췌와 Emmy가 같이 들어오면 단일 라이선스로는 안 닫힌다. → §4

---

## 1. 각 저작별 판정표

| 대상 | 라이선스 | 확실도 | 증거 |
|---|---|---|---|
| SICM 2판 온라인 (Sussman·Wisdom, MIT Press) | **CC BY-NC-SA 3.0 Unported**, © 2014 MIT | 확정 | MIT Press 콘텐츠 서버에서 zip 직접 받아 `copyright.html` 읽음 |
| tgvaughan/sicm (HTML 판) | **CC BY-NC-SA 3.0 Unported** | 확정 | 리포 `LICENSE` 원문 |
| mentat-collective/sicm-book (org 판, Sam Ritchie) = GLG 로컬 원본 | **CC BY-NC-SA 3.0 Unported** | 확정 | 로컬 `LICENSE` + 상류 `README.md` |
| Emmy (Colin Smith · Sam Ritchie) | **GPL-3.0-only** | 확정 (only/or-later는 §1.4 참조) | `LICENSE` 축자 GPLv3 + 소스 SPDX 헤더 |
| SICMUtils (구 이름) | **GPL-3.0**, archived, Emmy로 이전 | 확정 | 리포 README 경고문 + API |
| scittle (borkdude) | **EPL-1.0** | 확정 | `LICENSE` 첫 줄 + GitHub API |
| scittle-kitchen (Timothy Pratley) — 빌드 프로세스 | **EPL-1.0** | 확정 | `LICENSE` + npm registry |
| scittle-kitchen이 배포하는 `scittle.emmy.js` — **산출물** | **혼합. 실효 GPL-3.0** | 확정 (구성은 실측) | §1.5 |
| KaTeX | **MIT**, © 2013-2020 Khan Academy and other contributors | 확정 | `LICENSE` 원문 |
| WebTUI (`@webtui/css`, `@webtui/theme-catppuccin`) | **MIT**, © 2025 WebTUI | 확정 | GitHub API `licenses` + npm 핀 버전별 확인 |
| odex-js (번들 안) | **BSD-2-Clause**, Colin Smith | 확정 | npm + 소스 문자열 일치 |
| fraction.js (번들 안) | **MIT**, Robert Eisele | 확정 | npm + 번들 문자열 |

---

### 1.1 SICM 2판 — 온라인판 (원저)

**판정: CC BY-NC-SA 3.0 Unported. NC 조항 있음.**

MIT Press 콘텐츠 서버가 지금도 2판 전문 zip을 서빙한다
[1차 실측: https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/9579/sicm_edition_2.zip
→ HTTP 200, 4,201,563 B, `application/zip`].
그 안 `copyright.html` 원문 `[1차 실측: unzip -p로 추출]`:

> Structure and Interpretation of Classical Mechanics
> © 2014 Massachusetts Institute of Technology
> This work is licensed under the Creative Commons
> Attribution-NonCommercial-ShareAlike 3.0 Unported License.
> To view a copy of this license, visit creativecommons.org.
> ISBN 978-0-262-02896-7

이게 이 임무 전체의 1차 출처다. 파생판들의 README가 가리키던 옛 MIT Press URL
(`mitpress.mit.edu/sites/default/files/titles/content/sicm_edition_2/book.html`)은 지금 **403**이다
`[1차 실측]`. 그래서 파생판 README의 링크를 그대로 베끼면 죽은 링크를 물려받는다. 위 zip URL이
현재 살아 있는 경로다.

**저자 표기 정정 — 임무 브리핑의 「Sussman · Wisdom · Mayer」는 온라인 2판에 대해서는 틀렸다.**
2판 titlepage는 두 사람만 적는다 `[1차 실측: zip 안 titlepage.html]`:

> Structure and Interpretation of Classical Mechanics / second edition /
> Gerald Jay Sussman and Jack Wisdom / The MIT Press

Mayer는 **1판 공저자**다. 2판 acknowledgments가 직접 그렇게 말한다 `[1차 실측: zip 안 acknowledgments.html]`:

> Julie worked with first-edition coauthor Meinhard (Hardy) Mayer to create the index.
> … We thank the MIT Mathematics and EECS departments for sabbatical support for Meinhard Mayer,
> who collaborated with us on the first edition. We are sad to report that Hardy is no longer with us.
> We sorely miss him.

예우의 관점에서 이건 사소한 정정이 아니다. **2판 저자로 Mayer를 넣는 것은 틀린 공로 배분이고,
1판에서 그를 빼는 것도 틀린 배분이다.** 페이지 문안은 "2판: Sussman·Wisdom"으로 적고, 1판을
언급할 자리가 있으면 Mayer를 그 자리에 적는다. §3.3 문안이 그렇게 되어 있다.

**NC 조항 — 핵심.** 3.0 legalcode §4(c) 원문 `[1차 실측: https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode]`:

> You may not exercise any of the rights granted to You in Section 3 above in any manner that is
> primarily intended for or directed toward commercial advantage or private monetary compensation.

CC 자신의 FAQ가 이 경계를 이렇게 좁힌다 `[웹 출처 https://creativecommons.org/faq/]`:

> CC's definition does not turn on the type of user: if you are a nonprofit … your use could still
> run afoul of the NC restriction, and if you are a for-profit entity, your use … does not necessarily
> mean you have violated the term. Whether a use is commercial will depend on the specifics of the
> situation and the intentions of the user. … CC cannot advise you on what is and is not commercial use.

**junghanacs.com에 대한 판단 — 회색이지만 방향은 분명하다.**

측정된 사실:
- 같은 도메인에 `/cv`와 `/about` 콘텐츠 디렉터리가 있다 `[직접 읽음: ~/repos/gh/homepage/content/ 목록]`.
- homepage `NEXT.md`가 연재 의도를 이렇게 적는다 — *"초반 연재는 이직 시장에서도 GLG를 정확히
  소개할 수 있도록"* `[직접 읽음 ~/repos/gh/homepage/NEXT.md:8-9]`.
- 광고·후원·결제·제휴는 발견되지 않았다 `[1차 실측: hugo.yaml + content/ 전체에 adsense·sponsor·
  buymeacoffee·patreon·paypal·donate·ko-fi·pricing grep → 관련 히트 0]`.

판단: NC 심사의 문장은 *"primarily intended for or directed toward commercial advantage or private
monetary compensation"*이고, 심사 대상은 **그 저작물을 쓰는 행위**이지 사이트 전체의 존재 목적이
아니다. 광고도 유료 게이트도 없는 개인 사이트에 SICM 본문을 무료 공개로 올리는 것은 그 문장에
정면으로 걸리지 않는다. 같은 도메인 어딘가에 이력서가 있다는 사실만으로 걸린다면, 모든 개발자
개인 블로그의 CC-NC 인용이 위반이 되고 그런 해석은 통용되지 않는다 `[해석 — 조문 인용은 1차,
결론은 내 판단]`.

동시에, **회색은 회색이라고 적는다.** 이 판단을 지탱하는 것은 "무료·무광고"라는 사실 상태이지
조문의 명시적 안전지대가 아니다. 그래서 방어선은 상태를 유지하는 것이다:

- SICM 원문을 싣는 페이지에 **광고·후원 버튼·유료 구독·제휴 링크·리드 수집 폼을 두지 않는다.**
- **그 페이지를 포트폴리오 상품으로 프레이밍하지 않는다.** 「이 페이지를 내가 만들었다」는
  `/projects`에서 말하고, **SICM 본문 자체는 그 자랑의 재료가 아니라 인용된 스승의 문장**으로
  둔다. 링크는 얼마든지 걸어도 된다 — 링크는 CC 심사 대상이 아니다.
- **사이트가 수익화되면**(광고·유료 뉴스레터·강의 판매·스폰서) 그 시점에 SICM 본문 페이지는
  내리거나 인용 최소화 + 원문 링크로 바꾼다. 이 조건을 리포 `AGENTS.md`나 attribution 문서에
  적어두면 미래의 자신에게 넘어간다.
- 가장 안전한 선택지는 **발췌를 짧게 유지하고 원문을 링크**하는 것이다. §3.4.

**ShareAlike — §4 결정에 직결.** 3.0 §4(b) 원문 `[1차 실측]`:

> You may Distribute or Publicly Perform an Adaptation only under: (i) the terms of this License;
> (ii) a later version of this License with the same License Elements as this License; (iii) a Creative
> Commons jurisdiction license … that contains the same License Elements as this License … ("Applicable License").

즉 SICM 본문을 **각색(adaptation)**한 결과물은 BY-NC-SA 3.0 또는 BY-NC-SA 4.0으로만 나갈 수 있다.
MIT도, CC BY도, CC0도 안 된다. 다만 §4(a)가 **collection**은 다르게 다룬다 — *"this does not require
the Collection apart from the Work itself to be made subject to the terms of this License."*
번역·재조판·org→HTML 변환은 각색 쪽이고, "인용 블록으로 담고 그 옆에 내 해설을 붙인 페이지"는
경계에 있다 `[미확인: 이 판정은 사실관계에 달렸고 나는 판단 권한이 없다]`. §4에서 이 양쪽을
모두 만족시키는 배치를 제안한다.

---

### 1.2 tgvaughan/sicm — Tim Vaughan의 HTML 판

**판정: CC BY-NC-SA 3.0 Unported. 별개 저작물이며 별도 표기 대상.**

`LICENSE` 원문 `[1차 실측: raw.githubusercontent.com/tgvaughan/sicm/master/LICENSE]`:

> LICENSING TERMS
> The contents of this repository are licensed under the Creative Commons
> Attribution-NonCommercial-ShareAlike 3.0 Unported License
> (http://creativecommons.org/licenses/by-nc-sa/3.0/).

**주의 — GitHub API는 이 리포를 `NOASSERTION`으로 표시한다** `[1차 실측: api.github.com/repos/tgvaughan/sicm]`.
자동 라이선스 인식기가 이 짧은 커스텀 문구를 못 읽기 때문이지, 라이선스가 불명확한 게 아니다.
**자동 스캐너만 믿으면 이 저작물이 라이선스 미상으로 보인다.** 파일을 읽어야 한다.

Vaughan의 기여는 단순 변환이 아니다. README `[1차 실측]`:

> It is a port of the CC BY-NC-SA-licensed second edition hosted by MIT Press, applying the beautiful
> style of **Andres Raba's HTML5/EPUB3 version** of Ableson and Sussman's "Structure and Interpretation
> of Computer Programs".

즉 조판·타이포그래피 판단이 들어간 저작이고, 그 스타일 자체가 또 Andres Raba의 SICP HTML5 판에서
왔다 — 스승 사슬이 한 겹 더 있다. 라이브 사이트는 지금도 살아 있다
`[1차 실측: https://tgvaughan.github.io/sicm/ → HTTP 200]`.

그리고 **Emmy 자신이 SICM 참조로 이 사이트를 링크한다** — `emmy.env` 네임스페이스 독스트링
`[1차 실측: raw .../emmy/v0.32.0/src/emmy/env.cljc]`:

> The purpose of `emmy.env` is to bundle all of the functions used in
> [Structure and Interpretation of Classical Mechanics](https://tgvaughan.github.io/sicm/) …

**Emmy가 이미 Vaughan을 예우 사슬에 넣어두었다.** 우리가 그를 빼면 상류보다 못한 표기가 된다.

---

### 1.3 GLG 로컬 org — `~/sync/code/junghan0611/sicm-book/`

**판정: CC BY-NC-SA 3.0 Unported. 그리고 이것은 Sam Ritchie의 저작이다.**

로컬 `LICENSE` 전문 `[직접 읽음 ~/sync/code/junghan0611/sicm-book/LICENSE]`:

> LICENSING TERMS
> The contents of this repository are licensed under the Creative Commons
> Attribution-NonCommercial-ShareAlike 3.0 Unported License
> (http://creativecommons.org/licenses/by-nc-sa/3.0/).

tgvaughan의 LICENSE와 축자 동일하다(끝 개행 1바이트 차이) `[1차 실측: 양쪽 원문 대조]`.

**이 리포의 정체 — 이게 이 절의 핵심이다.** GitHub API `[1차 실측: api.github.com/repos/junghan0611/sicm-book]`:

```
fork    True
parent  mentat-collective/sicm-book
source  mentat-collective/sicm-book
```

`mentat-collective`는 **Emmy를 만드는 그 조직**이다. 즉 GLG가 몇 년째 읽어온 org 파일은
**Sam Ritchie가 손으로 옮긴 판**이다. 상류 README `[1차 실측: raw .../mentat-collective/sicm-book/main/README.md,
로컬 README.md와 축자 동일]`:

> It is a port of the CC BY-NC-SA-licensed second edition hosted by MIT Press, obtained by converting
> @tgvaughan's HTML Port to org-mode format via Pandoc **and then doing much more conversion by hand**.

*"much more conversion by hand"* — 이건 기계 변환이 아니라 노동이다.

전체 사슬 `[1차 실측 + 로컬 README-wiki.md 직접 읽음]`:

```
Sussman · Wisdom (원저, MIT Press 2판, CC BY-NC-SA 3.0)
  └─ Tim Vaughan       — HTML 판 (Andres Raba의 SICP 스타일 적용)
       └─ Sam Ritchie  — org-mode 판, 손으로 다듬음   ← GLG가 읽는 것
            ├─ James Crook — markdown 판 (scorpiodiagrams)
            └─ 김정한(GLG) — 이 포크
```

`.github/FUNDING.yml`에 `github: sritchie`가 그대로 남아 있다 `[직접 읽음 ~/sync/code/junghan0611/sicm-book/.github/FUNDING.yml]`.
포크가 상류 후원 설정을 물려받은 흔적이다.

**상류의 사소한 오타 하나** — README와 `org/toc.org` 모두 링크 텍스트를 「CC BY-SA 3.0」으로
적는데 URL은 `by-nc-sa/3.0`이다 `[1차 실측: 로컬 README.md 마지막 문단; 직접 읽음
~/sync/code/junghan0611/sicm-book/org/toc.org:17-20]`. 실제 라이선스는 **BY-NC-SA**다.
**이 오타를 그대로 베끼면 NC 조항이 사라진 것처럼 보이는 고지가 된다.** §3.3 문안은 NC를
명시적으로 적는다.

---

### 1.4 Emmy — Colin Smith · Sam Ritchie

**판정: GPL-3.0-only. 예외조항 없음.**

「Emmy 패키지 라이선스는 GPL」은 `docs/review-grok.md`에서 상속받은 문장이고 출처가
scittle-kitchen README였다. **1차 출처에서 다시 닫았다:**

- `LICENSE`가 **축자 GNU GPL v3 전문**이다 `[1차 실측: raw .../emmy/main/LICENSE, 673행,
  md5 4fe869ee987a340198fb0d54c55c47f1]`. 끝에 덧붙인 추가 조항·예외조항이 **없다**
  [1차 실측: `exception|classpath|linking|combine` grep → 히트 6건이 전부 GPL 본문
  보일러플레이트(§7, §13, 부록)이고 프로젝트가 덧붙인 문장은 0].
- GitHub API SPDX: `GPL-3.0` `[1차 실측]`.
- README `[1차 실측]`: *"Copyright © 2016-2024 Colin Smith, Sam Ritchie. Distributed under the
  [GPL v3](LICENSE) license."*
- `CITATION.cff` `[1차 실측]`: `license: GPL-3.0`, `license-url: https://www.gnu.org/licenses/gpl-3.0.en.html`.

**only인가 or-later인가 — 실측으로 갈린다.** 소스 파일 헤더가 결정적이다
`[1차 실측: src/emmy/env.cljc 1행]`:

```clojure
#_"SPDX-License-Identifier: GPL-3.0"
```

`-or-later`가 없다. 그리고 리포 전체에서 `"any later version"` 문자열은 **`LICENSE` 파일 안에서만**
나온다 [1차 실측: GitHub 코드검색 `repo:mentat-collective/emmy "any later version"` → total 1, path=LICENSE].
그 LICENSE 안의 등장은 GPL 부록("How to Apply These Terms")의 예시 문구이지 Emmy의 선언이 아니다.

→ **가장 안전한 읽기는 GPL-3.0-only.** or-later로 취급할 근거를 나는 찾지 못했다.
이건 §2.5에서 실제 문제가 된다 — FSF의 라벨 식별자 목록에는 `GNU-GPL-3.0-or-later`는 있어도
**`GPL-3.0-only`가 없다** `[1차 실측: gnu.org/licenses/javascript-labels.html의 식별자 목록]`.
대응은 §2.5에 적었다.

**구 이름 `sicm-utils` — 여기서 닫는다.**

- 정확한 이름은 하이픈 없는 **`SICMUtils`**, 리포는 `sicmutils/sicmutils`, Clojars 좌표
  `sicmutils/sicmutils` `[1차 실측: 리포 README, GitHub API]`.
- 라이선스 **GPL-3.0**, 리포는 **archived** [1차 실측: api.github.com/repos/sicmutils/sicmutils
  → `"archived": true`, spdx `GPL-3.0`].
- README 첫 줄 `[1차 실측]`:
  > **All development has moved to the [Emmy] repository. This repository is no longer maintained.**
- 현재 좌표는 **`org.mentat/emmy`**다 `[1차 실측: Emmy README Clojars 배지]`.

→ 「Emmy의 구 이름이 sicm-utils였다」는 **거의 맞다. 정확히는 `SICMUtils`이고, 이름 변경이라기보다
리포 이전 + 재명명이다. 라이선스는 양쪽 다 GPL-3.0으로 동일하다.** 문서에 옛 이름을 적을 일이
있으면 `SICMUtils`로 적는다.

---

### 1.5 실제로 브라우저에 실리는 것 — `scittle.emmy.js` 해부

이 절이 §2의 사실 기반이다. **패키지 라이선스와 산출물 라이선스가 다르다.**

`scittle-kitchen`의 npm 메타데이터는 `EPL-1.0`을 선언한다
`[1차 실측: registry.npmjs.org/scittle-kitchen → license "EPL-1.0", 0.8.33-105 동일]`.
**이건 `dist/scittle.emmy.js`에 대해 오도한다.** kitchen README가 스스로 정정한다 `[1차 실측]`:

> Plugins bundle source packages which may be governed by a different license.
> Refer to the source package license to be sure it meets your license needs.
> **For example the Emmy package is licensed under GPL.**
> Scittle Kitchen (the build process) is distributed under the EPL License.

→ **npm license 필드만 읽는 자동 스캐너는 GPL을 놓친다.** SBOM·의존성 감사 도구를 쓸 계획이면
이 항목은 손으로 넣어야 한다.

**번들 구성 — 직접 열어서 확인했다** `[1차 실측: 4,093,648 B 전체 다운로드 후 분석]`:

| 구성요소 | 라이선스 | 어떻게 확인했나 |
|---|---|---|
| Emmy `org.mentat/emmy 0.32.0` | **GPL-3.0-only** | kitchen `plugin-templates.edn:126` 의 `:deps {org.mentat/emmy {:mvn/version "0.32.0"}}` `[1차 실측]` |
| ClojureScript 런타임 + scittle/SCI | EPL-1.0 | 번들에 `cljs.core` 147회, `goog.` 9회 `[1차 실측: grep 카운트]` |
| **odex-js** (Bulirsch–Stoer ODE 적분기) | **BSD-2-Clause**, Colin Smith | `shadow$provide[0]`이 `Solver` 클래스이고 상태 enum이 `Start / BasicIntegrationStep / ConvergenceStep / HopeForConvergence / Accept / Reject`. odex 원본 `src/odex.ts:613`의 `STATE` enum과 **문자열 완전 일치** `[1차 실측: 양쪽 원문 대조]` |
| **fraction.js** | **MIT**, Robert Eisele | 번들에 `bigfraction` 49회 `[1차 실측]`; Emmy `src/deps.cljs`가 `{"fraction.js" "4.2.1" "odex" "3.0.0-rc.4"}` 선언 `[1차 실측]` |

odex와 fraction.js의 라이선스는 npm registry에서 확인했다 `[1차 실측: odex@3.0.0-rc.4 → BSD-2-Clause,
author Colin Smith; fraction.js@4.2.1 → MIT, author Robert Eisele]`.

**odex도 Colin Smith다.** Emmy 공동 저작권자와 같은 사람이다 — 스승 명단에서 그를 빼면 안 되는
이유가 하나 더 늘었다.

**그리고 번들에는 라이선스 배너가 없다.** [1차 실측: 파일 전체에서 `licen[cs]e`·`GPL`·`copyright`
대소문자 무시 grep → 0건. 파일은 shadow-cljs advanced 컴파일 산출물로 첫 바이트부터 미니파이
코드다] shadow-cljs `:release` 빌드가 주석을 전부 제거했기 때문이다.

→ **결론: 브라우저로 가는 4MB 파일은 GPL 저작물이면서 자기가 GPL이라고 말하지 않는다.
그 말을 페이지가 대신 해야 한다.** 이것이 §0-1이다.

**비미니파이 빌드도 배포된다** — kitchen이 `dist/dev/` 아래에 dev 빌드를 낸다
`[1차 실측: dist/dev/scittle.emmy.js → HTTP 200, 11,939,960 B; dist/dev/scittle.js → HTTP 200, 6,841,808 B]`.
§2.5에서 라벨표의 "source" 칸에 쓸 수 있다. 다만 **dev JS는 GPL이 말하는 "대응 소스"가 아니다** —
수정에 적합한 형태는 ClojureScript 소스이고, 그건 Emmy `v0.32.0` 태그 + kitchen 빌드 설정이다.
Emmy `v0.32.0` 태그는 실재한다 [1차 실측: api.github.com/repos/mentat-collective/emmy/tags → `v0.32.0`
sha 53fd9909b8, release published 2024-08-13]. **주의: 태그 이름에 `v` 접두가 붙는다** — `0.32.0`으로
링크하면 404다 `[1차 실측: github.com/.../releases/tag/0.32.0 → 404]`.

---

### 1.6 scittle · KaTeX · WebTUI

**scittle (Michiel Borkent / borkdude) — EPL-1.0.**
`[1차 실측: raw .../babashka/scittle/main/LICENSE 첫 줄 "Eclipse Public License - v 1.0";
GitHub API spdx EPL-1.0]`. npm `scittle` 패키지는 license 필드가 비어 있다 `[1차 실측: registry.npmjs.org/scittle
→ license None]` — 리포 LICENSE가 정본이다.
**현재 `proto/index.html`은 공식 scittle이 아니라 kitchen의 scittle을 싣는다**
`[직접 읽음 proto/index.html:90]`. 다만 `proto/sci-eval.html:13`과 `sci-eval-v2.html:25`는
공식 `scittle@0.8.33`을 싣는다 `[직접 읽음]` — 그 두 파일은 Emmy를 안 쓰므로 GPL 문제가 없다.

**KaTeX — MIT.** `[1차 실측: raw .../KaTeX/KaTeX/main/LICENSE]`
> The MIT License (MIT) / Copyright (c) 2013-2020 Khan Academy and other contributors

핀된 `katex@0.18.7`도 `license: MIT` `[1차 실측: registry.npmjs.org/katex/0.18.7]`.
MIT은 *"The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software"*를 요구한다 — CDN 링크만 걸어도 **고지는 우리 몫**이다.
`katex.min.js`에는 배너 주석이 있지만, 라벨표에 넣는 것이 확실하다.

**WebTUI — MIT.** `[1차 실측: api.github.com/repos/webtui/webtui/license → spdx MIT,
"MIT License / Copyright (c) 2025 WebTUI"]`
`proto/style.css:7-8`이 두 패키지를 `@import`한다 `[직접 읽음]`:
`@webtui/css@0.1.9` (MIT `[1차 실측: registry.npmjs.org/@webtui/css/0.1.9 → license MIT]`)와
`@webtui/theme-catppuccin@0.0.5` (MIT `[1차 실측: registry.npmjs.org 최신 0.0.5 → MIT]`).
CSS는 GPL 논의와 무관하지만 MIT 고지 대상이다.

---

### 1.7 상류의 미해결 긴장 — EPL × GPL

**FSF는 EPL 1.0을 GPL 비호환으로 본다.** license-list 원문 `[1차 실측: gnu.org/licenses/license-list.en.html]`:

> **Eclipse Public License Version 1.0** — The Eclipse Public License is similar to the Common Public
> License, and our comments on the CPL apply equally to the EPL.

그리고 CPL 항목 `[1차 실측: 같은 문서]`:

> This is a free software license. Unfortunately, **its weak copyleft and choice of law clause make it
> incompatible with the GNU GPL.**

Clojure와 ClojureScript는 EPL-1.0이고 Emmy는 GPL-3.0이다. 즉 **"GPL 라이브러리가 EPL 런타임 위에서
돈다"는 긴장은 Emmy 자체에 이미 있다.** scittle.emmy.js는 그 둘을 한 파일로 컴파일한다.

**이건 GLG가 만든 문제가 아니고 GLG가 풀 수 있는 문제도 아니다.** Emmy 저자들이 EPL Clojure 위에서
GPL을 고르며 감수한 판단이고, kitchen은 그 조합을 그대로 번들했을 뿐이다. 여기 적는 이유는 둘:
(a) 나중에 "이 스택 라이선스 깨끗해?"라고 물었을 때 이미 답이 있게 하려고, (b) **상류가 이미
받아들인 조합을 우리가 재발명해서 걱정할 필요는 없다**는 것을 명시하려고.
`[미확인: 이 긴장을 Emmy나 kitchen이 어디서 명시적으로 논의했는지는 찾지 못했다.]`

---

## 2. GPL JS를 웹페이지로 내보내는 것 — 배포인가

### 2.1 답

**그렇다고 보고 움직여라.** 확립된 판례를 나는 찾지 못했지만 `[미확인: 이 쟁점에 대한 법원 판결
확인 못 함]`, **조문·FSF 입장·업계 관행 셋이 같은 방향을 가리키고, 셋 다 실측했다.**

핵심 구분: GPL이 걸리는 것은 **"서버에서 프로그램을 돌리는 것"이 아니라 "사용자 기기로 코드를
보내는 것"**이다. AGPL이 따로 만들어진 이유가 그 반대편(서버 실행)을 덮기 위해서였다. JS는
**사용자의 CPU에서 돈다.** 그래서 JS는 AGPL을 기다릴 필요 없이 평범한 GPL 배포다.

이 구분을 가장 압축한 관행 서술 `[웹 출처 https://opensource.stackexchange.com/questions/10178/]`:

> whose hardware is the code running? A nodejs application running on infrastructure under your direct
> control … You're not distributing the code. **Javascript client side is running on someone else's CPUs.
> You're distributing.**

같은 커뮤니티에서 Discourse(GPLv2+)를 예로 든 답 `[웹 출처 https://opensource.stackexchange.com/questions/11725/]`:

> Discourse is a web application, GPLv2+-licensed, containing JavaScript elements which are downloaded
> by clients onto their browsers. It seems to me that this **absolutely is distribution**, and that you
> are therefore entitled to reuse this JS code under GPLv2+.

이 논의는 법정 판결이 아니라 커뮤니티 해석이다. **그래서 "확정"이 아니라 "이 방향으로 움직여라"다.**
다만 아래 §2.3의 관행은 해석이 아니라 실물이다 — 수백 개 프로젝트가 이미 그렇게 하고 있다.

FSF 쪽은 아예 도덕 명제로 못 박아 두었다 `[1차 실측: gnu.org/philosophy/javascript-trap.html]`:

> This page describes **the wrong of sending nonfree programs to run in your computer.**
> … browsers run other nonfree programs which they don't ask you about … These programs are most often
> written in JavaScript.

### 2.2 따라오는 의무 — 조문에서

전부 내가 받은 Emmy `LICENSE` 사본에서 인용한다 `[1차 실측]`.

**(a) 대응 소스의 정의 (§1).**

> The "Corresponding Source" for a work in object code form means **all the source code needed to
> generate, install, and (for an executable work) run the object code and to modify the work**,
> including scripts to control those activities.

미니파이된 `scittle.emmy.js`는 object code 쪽이다. 대응 소스 = Emmy ClojureScript 소스(v0.32.0) +
kitchen의 빌드 스크립트/플러그인 설정. dev JS 빌드는 "modify the work"에 적합한 형태가 아니므로
대응 소스의 **대체물이 아니다**.

**(b) 대응 소스를 어떻게 주는가 (§6(d)) — 이게 우리가 쓸 조항이다.**

> d) Convey the object code by offering access from a designated place …, and offer equivalent access
> to the Corresponding Source in the same way through the same place at no further charge. … If the
> place to copy the object code is a network server, **the Corresponding Source may be on a different
> server (operated by you or a third party) that supports equivalent copying facilities, provided you
> maintain clear directions next to the object code saying where to find the Corresponding Source.**
> Regardless of what server hosts the Corresponding Source, **you remain obligated to ensure that it is
> available for as long as needed** to satisfy these requirements.

→ **소스를 우리가 호스팅할 필요가 없다.** GitHub의 Emmy `v0.32.0`을 가리키면 된다. 대신 두 가지가
따라온다: (1) *clear directions* — 페이지가 어디를 봐야 하는지 말해야 한다, (2) *remain obligated to
ensure it is available* — GitHub가 그 태그를 내리면 우리 책임이 남는다. 후자가 현실적으로 걸릴
확률은 낮지만, 안전판은 **Emmy v0.32.0 소스 tarball 사본을 리포에 두거나 릴리스 자산으로 붙이는 것**이다.

**(c) 결합 저작물 (§5(c))와 단순 병합(aggregate).**

> c) You must license the entire work, as a whole, under this License to anyone who comes into
> possession of a copy. This License will therefore apply … to the whole of the work, and all its parts,
> **regardless of how they are packaged.**

반대편:

> A compilation of a covered work with other separate and independent works, **which are not by their
> nature extensions of the covered work, and which are not combined with it such as to form a larger
> program**, in or on a volume of a storage or distribution medium, is called an "aggregate" …
> Inclusion of a covered work in an aggregate does not cause this License to apply to the other parts.

### 2.3 관행 — 이론보다 이쪽이 답에 가깝다

**(1) FSF가 정한 형식이 실제로 존재하고, 그것으로 충분하다고 FSF가 말한다.**
`[1차 실측: https://www.gnu.org/licenses/javascript-labels.html]`

> **If you do these things, you will comply with the relevant conditions in the GNU software licenses,
> such as the GNU General Public License.**

방법 자체도 그 페이지가 명시한다: `id="jslicense-labels1"` 테이블 한 장 + 각 페이지에서
`rel="jslicense"` 링크. 3칸 = (파일 링크 / 라이선스 링크 / 소스 링크).

**(2) 이 형식은 이론이 아니라 널리 쓰인다 — 세어봤다.**
[1차 실측: GitHub 코드검색 `"jslicense-labels1" in:file` → **total_count 423**]
상위 결과에 실제로 있는 것들: `ether/etherpad`, `gogs/gogs`, `melpa/melpa`, `iv-org/invidious`,
`yacy/yacy_search_server`, `pump-io/pump.io`, `freedombox/FreedomBox`, `snowdriftcoop/snowdrift`,
`toddsundsted/ktistec`, `adventuregamestudio/ags-manual`.

**(3) CDN에서 싣는 경우에도 같은 형식이 통한다 — MELPA가 선례다.**
`[1차 실측: raw .../melpa/melpa/master/html/jslicense.html]` 표의 실제 행:

```html
<td><a href="https://cdnjs.cloudflare.com/ajax/libs/mithril/0.2.5/mithril.min.js">mithril.min.js</a></td>
<td><a href="http://www.jclark.com/xml/copying.txt">Expat</a></td>
<td><a href="https://cdnjs.cloudflare.com/ajax/libs/mithril/0.2.5/mithril.js">mithril.js</a></td>
```

**미니파이 파일과 소스 파일 모두 CDN URL을 그대로 가리킨다.** 우리도 jsDelivr URL을 그대로
쓰면 된다 — 파일을 리포로 복사해 올 필요가 없다.

**(4) GPL 계열 항목이 실제로 그 표에 들어간다.**
`[1차 실측: raw .../freedombox/FreedomBox/main/static/jslicense.html]`

```html
<td><a href="http://www.gnu.org/licenses/gpl-2.0.html">GNU General Public License version 2 or later</a></td>
<td><a href="http://www.gnu.org/licenses/agpl-3.0.html">GNU Affero General Public License, version 3 or later</a></td>
```

**(5) 그리고 Emmy 저자들 자신의 관행.**
`emmy.mentat.org`는 Clerk으로 빌드된 정적 페이지이고 컴파일된 Emmy JS를 브라우저로 보낸다.
페이지에 **GPLv3 배지와 `LICENSE` 링크가 실려 있다**
[1차 실측: https://emmy.mentat.org/ HTTP 200, 113,330 B 받아서
`license-GPLv3-brightgreen.svg`와 `github.com/mentat-collective/emmy/blob/main/LICENSE` 확인].
**LibreJS 라벨(`rel="jslicense"`)은 없다** [1차 실측: 같은 문서에 `jslicense` 문자열 0건].

→ 이게 중요한 관행 신호다. **상류의 실제 관행은 "GPL임을 눈에 보이게 밝히고 LICENSE로 링크하는 것"**
이지 LibreJS 완전 준수가 아니다. 우리가 라벨표까지 붙이면 상류보다 엄격한 쪽이고, 그건 예우의
방향과 일치한다. 반대로 **최소한 emmy.mentat.org 수준(배지 + LICENSE 링크)은 무조건 해야 한다** —
그보다 못한 건 상류가 스스로 지키는 선 아래로 내려가는 것이다.

### 2.4 결합 저작물 판정 — 우리 `eval.js`는 어디에 있나

**사실부터.** `proto/eval.js`는 Emmy를 전혀 모른다 `[직접 읽음 proto/eval.js 전체, 22행]`.
하는 일은 `.org-cell`을 순회하며 버튼 클릭에 `scittle.core.eval_string(src.value)`를 부르고
결과를 `.org-cell-out`에 문자열로 넣는 것뿐이다 `[직접 읽음 proto/eval.js:6-21]`.
`emmy`라는 심볼이 `eval.js`에 없다 — Emmy는 **사용자가 셀에 친 `(require '[emmy.env :as e])`**로
런타임에 들어온다 `[직접 읽음 proto/index.html:83-84]`.

**그래서 스펙트럼은 이렇다:**

| 보수적 읽기 | 느슨한 읽기 |
|---|---|
| 페이지가 Emmy를 `<script>`로 싣고 그 위에서 평가 UI를 돌린다. 사용자 눈에 하나의 프로그램이다 → §5(c) 「the whole of the work … regardless of how they are packaged」 → **`eval.js`와 페이지 JS도 GPL-3.0** | `eval.js`는 scittle의 공개 함수 하나만 부른다. Emmy는 별도로 로드된 미리 컴파일된 라이브러리이고 우리 코드와 내부 자료구조를 주고받지 않는다 → **aggregate**, `eval.js`는 자유 라이선스 |

**나는 판정할 권한이 없고, 실제로 이 경계는 다툼이 있다.** 커뮤니티 답변도 정확히 이 지점에서
갈린다 `[웹 출처 https://opensource.stackexchange.com/questions/8869/]`:

> If you use a GPLv3 licensed library in the front-end … then the entire front-end code must be released
> under the GPLv3 license, when that front-end code is distributed.

바로 아래 반대 의견:

> I don't agree … using a GPLv3 library does not make your website GPL, if you merely include the library
> in its compiled form provided by the author and exported to the window namespace. …
> **Where's the line between two separate programs, and one program with two parts? This is a legal
> question, which ultimately judges will decide.**

**실무적 권고 — 이 다툼을 피해 가는 값싼 길이 있다.**

`eval.js`는 22행이다. **그걸 GPL-3.0-only로 내면 이 논쟁 전체가 사라진다.** 잃는 것이 사실상 없다:
- 재사용 가치가 큰 코드가 아니다(버튼 → `eval_string` → textContent).
- Emmy를 쓰겠다고 이미 정했다면 GPL 생태계 안에 있는 것이고, 그 안에서 GPL 파일 하나는 마찰이 아니다.
- **예우의 관점에서도 이쪽이 맞다** — Sussman·Wisdom·Ritchie·Smith가 자유 소프트웨어로 낸 것 위에
  얹으면서 우리 층만 잠글 이유가 없다.

정말 `eval.js`를 MIT로 두고 싶다면 §2.6의 「Emmy 격리」가 그 요구를 정직하게 만족시킨다.
**"aggregate라고 우기면서 MIT로 두는 것"은 회색을 회색인 채로 감수하는 선택이다** — 나는 권하지 않는다.

### 2.5 실제로 붙일 것 — 형식과 배치

아래는 전부 붙여넣을 수 있는 실물이다. **`proto/` 아래는 내 소유가 아니므로 적용하지 않았다.**
적용은 UI/eval 축 담당이 한다.

**(1) 파일 배치**

```
lichtung/
├── LICENSE                     ← 리포 기본 라이선스 (§4에서 결정)
├── LICENSES/                   ← 제3자 라이선스 전문 사본
│   ├── GPL-3.0.txt             ← Emmy
│   ├── EPL-1.0.txt             ← scittle, scittle-kitchen
│   ├── MIT-katex.txt
│   ├── MIT-webtui.txt
│   ├── MIT-fractionjs.txt
│   ├── BSD-2-Clause-odex.txt
│   └── CC-BY-NC-SA-3.0.txt     ← SICM 계열 텍스트
├── docs/attribution.md         ← 이 문서 (사람이 읽는 정본)
└── (발행면)/javascript.html    ← 기계가 읽는 라벨표
```

**(2) JavaScript 라이선스 라벨 페이지 — 그대로 붙여넣기**

식별자 문제 하나: FSF 목록에는 `GNU-GPL-3.0-or-later`만 있고 **`only`가 없다**
`[1차 실측: javascript-labels.html 식별자 목록]`. Emmy는 or-later 근거가 없으므로(§1.4),
목록 식별자를 억지로 쓰면 **없는 권한을 수령자에게 주는 잘못된 고지**가 된다.
→ **텍스트는 정확하게 "version 3"로 쓰고, 링크는 GPLv3 전문으로 건다.** LibreJS 자동 인식은
포기하되 고지의 정확성을 택한다. (FSF 문서 자체가 목록을 *"Good license identifiers"*라고만 하고
닫힌 집합이라고 하지 않는다 `[1차 실측]`.)

```html
<h1>JavaScript license information</h1>

<p>이 사이트가 브라우저로 보내는 JavaScript의 라이선스와 대응 소스입니다.
   This table lists the licenses and corresponding source of the JavaScript
   this site sends to your browser.</p>

<table id="jslicense-labels1">
  <tr>
    <td><a href="https://cdn.jsdelivr.net/npm/scittle-kitchen@0.8.33-105/dist/scittle.emmy.js">scittle.emmy.js</a></td>
    <td><a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License, version 3</a></td>
    <td><a href="https://github.com/mentat-collective/emmy/tree/v0.32.0">emmy v0.32.0 (ClojureScript source)</a></td>
  </tr>
  <tr>
    <td><a href="https://cdn.jsdelivr.net/npm/scittle-kitchen@0.8.33-105/dist/scittle.js">scittle.js</a></td>
    <td><a href="https://www.eclipse.org/legal/epl-v10.html">Eclipse Public License, version 1.0</a></td>
    <td><a href="https://github.com/babashka/scittle">babashka/scittle</a></td>
  </tr>
  <tr>
    <td><a href="https://cdn.jsdelivr.net/npm/katex@0.18.7/dist/katex.min.js">katex.min.js</a></td>
    <td><a href="https://opensource.org/licenses/MIT">Expat (MIT)</a></td>
    <td><a href="https://github.com/KaTeX/KaTeX/tree/v0.18.7">KaTeX v0.18.7</a></td>
  </tr>
  <tr>
    <td><a href="https://cdn.jsdelivr.net/npm/katex@0.18.7/dist/contrib/auto-render.min.js">auto-render.min.js</a></td>
    <td><a href="https://opensource.org/licenses/MIT">Expat (MIT)</a></td>
    <td><a href="https://github.com/KaTeX/KaTeX/tree/v0.18.7">KaTeX v0.18.7</a></td>
  </tr>
  <tr>
    <td><a href="/eval.js">eval.js</a></td>
    <td><a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License, version 3</a></td>
    <td><a href="/eval.js">eval.js</a></td>
  </tr>
</table>

<h2>대응 소스에 관하여 / On Corresponding Source</h2>
<p><code>scittle.emmy.js</code>는 <a href="https://github.com/mentat-collective/emmy">Emmy</a>
   (GPL-3.0, © 2016–2024 Colin Smith, Sam Ritchie)를 컴파일한 것입니다. 수정에 적합한 형태의
   소스는 Emmy <a href="https://github.com/mentat-collective/emmy/tree/v0.32.0">v0.32.0</a>이며,
   이를 브라우저용으로 묶는 빌드 설정은
   <a href="https://github.com/timothypratley/scittle-kitchen">scittle-kitchen</a>의
   <code>plugin-templates.edn</code>에 있습니다.
   비미니파이 빌드는
   <a href="https://cdn.jsdelivr.net/npm/scittle-kitchen@0.8.33-105/dist/dev/scittle.emmy.js">여기</a>에서
   받을 수 있습니다.</p>
<p>번들에는 <a href="https://github.com/littleredcomputer/odex-js">odex</a>(BSD-2-Clause, Colin Smith)와
   <a href="https://github.com/infusion/Fraction.js">fraction.js</a>(MIT, Robert Eisele)도 포함됩니다.</p>
<p>CSS: <a href="https://github.com/webtui/webtui">WebTUI</a> (MIT, © 2025 WebTUI),
   <a href="https://katex.org">KaTeX</a> (MIT, © 2013–2020 Khan Academy and other contributors).</p>
```

**(3) Emmy를 싣는 모든 페이지의 푸터**

```html
<footer class="org-colophon">
  <a href="/javascript.html" rel="jslicense">JavaScript 라이선스 정보 · JavaScript license information</a>
</footer>
```

FSF 요구 `[1차 실측]`: *"This link can be small, but it should be clearly visible to people who visit your site."*

**(4) 인라인 `<script>`가 있는 페이지 — `@licstart`/`@licend`**

`proto/index.html:94-105`에 KaTeX `renderMathInElement` 인라인 스크립트가 있다 `[직접 읽음]`.
라벨표 방식은 **인라인 JS에 적용되지 않는다** — FSF 명시 `[1차 실측: javascript-labels.html]`:

> The web labels method is not applicable to inline JavaScript included directly in HTML pages —
> their license information should be stated directly in those pages.

가장 싼 해결은 **인라인 스크립트를 외부 파일로 빼는 것**이다(그러면 라벨표에 한 행 추가로 끝).
인라인을 유지한다면 FSF 서식대로:

```html
<script>
/*
@licstart  The following is the entire license notice for the JavaScript code in this page.

Copyright (C) 2026  Junghan Kim

The JavaScript code in this page is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License (GNU GPL) as published by
the Free Software Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY; without even the
implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you may distribute
non-source (e.g., minimized or compacted) forms of that code without the copy of the
GNU GPL normally required by section 4, provided you include this license notice and
a URL through which recipients can access the Corresponding Source.

@licend  The above is the entire license notice for the JavaScript code in this page.
*/
</script>
```

`[1차 실측: 서식 원문 https://www.gnu.org/software/librejs/free-your-javascript.html]`
(주의: 이 서식은 **우리가 쓴 코드**를 GPL로 낸다고 선언하는 것이다. §2.4에서 `eval.js`를
GPL-3.0으로 내기로 하면 일관되고, MIT로 두기로 하면 이 문구를 그대로 쓰면 안 된다.)

### 2.6 GPL이 이 판에 무겁다면 — 대안 셋

**대안 A — Emmy 없이 KaTeX만.**
비용 0, 전송 ≈81 KB `[docs/review-grok.md 실측 인용]`, 라이선스 전부 MIT/EPL로 단순해진다.
**잃는 것이 결정적이다: 수식이 표기만 되고 값이 아니게 된다.** KONZEPT §1의 *"수식이 이미지가
아니라 값"*이 그대로 무너진다 `[직접 읽음 KONZEPT.md §1]`. **이건 라이선스 회피를 위해 판의 축을
버리는 것이다 — 권하지 않는다.**

**대안 B — Emmy를 별도 페이지로 격리.**
`/sicm/` 같은 하위 경로 몇 장만 Emmy를 싣고 GPL 의무를 그 페이지들에 국한한다. 홈페이지 본체와
`eval.js`는 원하는 라이선스를 유지한다. aggregate 논쟁도 페이지 경계가 명확해져 약해진다.
**대가:** "평가되는 페이지"가 사이트 전역 성질이 아니라 특별실이 된다. **KONZEPT §4의 프로토타입
한 장이 정확히 그 특별실이므로, 지금 단계에서는 비용이 0에 가깝다.**

**대안 C — 조항을 충족하고 간다.** ← **권고**
§2.5의 다섯 항목이 전부다: 라벨표 한 장, 푸터 링크 한 줄, 대응 소스 문단 하나, `LICENSES/`
디렉터리, `eval.js`에 GPL 헤더. **한 시간 작업이고 반복 비용이 없다.** 그리고 이게 예우의
방향과 같다 — Emmy를 쓰면서 Emmy가 GPL이라고 말하지 않는 페이지보다, 말하는 페이지가 낫다.

**추천: C. 지금 단계에서는 B와 C가 사실상 같은 일이다** (프로토타입이 이미 별도 페이지이므로).
homepage 본체로 옮길 때 B의 경계를 유지할지만 다시 정하면 된다.

---

## 3. 예우의 형식 — 페이지가 스스로 말하게 하라

### 3.1 원칙

**독자가 어디까지가 스승의 문장이고 어디부터가 우리 계산인지 헷갈리면, 조항을 다 지켜도 예우는
실패한 것이다.** 반대로 그 구분이 눈에 즉시 갈리면 조항 대부분은 부산물로 충족된다.

CC 3.0 §4(d)가 요구하는 것도 결국 그 구분이다 `[1차 실측: legalcode 원문]` — 원저자 이름, 저작
제목, 라이선스 URI, 그리고 각색의 경우 *"a credit identifying the use of the Work in the Adaptation"*.
그리고 같은 조항이 반대쪽 선도 긋는다:

> you may not implicitly or explicitly assert or imply any connection with, sponsorship or endorsement
> by the Original Author … of You or Your use of the Work

→ **"Sussman이 승인한 페이지"처럼 보이면 안 된다.** 아래 설계와 문안이 그 양쪽을 동시에 만족시킨다.

### 3.2 시각·의미 구분 — 마크업 제안

전제: `proto/style.css`에 이미 `.org-body blockquote`가 있다 —
`border-left: 2px solid var(--surface2); padding-left: 1ch; color: var(--subtext0)`
`[직접 읽음 proto/style.css:67-72]`. 지금은 **인용과 본문의 대비가 약하다**(둘 다 `--subtext0`).

**제안 (적용은 UI 축 담당 몫):**

```html
<!-- 스승의 문장 -->
<blockquote class="org-quote" data-source="sicm">
  <p>The Lagrangian formulation of mechanics …</p>
  <cite class="org-cite">— SICM 2판 §1.4 「Computing Actions」</cite>
</blockquote>

<!-- 우리 해설 — 아무 표시 없음이 기본 -->
<div class="org-body"><p>여기서 …</p></div>

<!-- 우리 계산 — 원문에 없다 -->
<div class="org-cell" data-lang="clojure" data-state="idle" data-origin="ours">
  …
</div>
```

```css
/* 스승의 문장: 왼쪽 두 줄 + 다른 색 + 인용부호 앵커 */
.org-quote[data-source] {
  border-left: 3px double var(--blue);
  padding-left: 1.5ch;
  margin: 1lh 0;
  color: var(--text);            /* 본문(--subtext0)보다 밝게 — 원문이 더 또렷하다 */
}
.org-quote[data-source="sicm"]::before {
  content: "#+begin_quote  SICM 2e · Sussman & Wisdom";
  display: block;
  color: var(--overlay1);
  font-size: 0.8em;
}
.org-quote[data-source]::after {
  content: "#+end_quote";
  display: block;
  color: var(--overlay1);
  font-size: 0.8em;
}
.org-cite { display: block; margin-top: 0.4lh; color: var(--overlay1); font-size: 0.85em; font-style: normal; }

/* 우리 계산: 원문에 없다는 것을 셀이 스스로 말한다 */
.org-cell[data-origin="ours"]::before {
  content: "# 이 셀은 원문에 없습니다 — Emmy로 다시 계산한 것입니다.";
  display: block;
  color: var(--overlay1);
  font-size: 0.8em;
  margin-bottom: 0.3lh;
}
```

**설계 근거 셋:**
1. **`#+begin_quote` / `#+end_quote`를 그대로 보여준다.** 이 페이지의 문법은 org를 흉내내는
   것이고(`style.css`가 이미 `*`, `:tag:`, `:PROPERTIES:`를 `content:`로 그린다
   `[직접 읽음 proto/style.css:37-38, 46-49, 57-58]`), org 사용자에게 인용 경계는 **이미 아는 기호**다.
   새 관습을 발명하는 대신 org의 것을 쓴다.
2. **인용을 본문보다 *밝게* 한다.** 보통 인용은 흐리게 처리하지만, 여기서는 반대가 맞다 —
   **원문이 주인공이고 우리 해설이 주석**이다. 색 위계가 예우의 위계를 그대로 말한다.
3. **셀이 스스로 "원문에 없다"고 말한다.** `docs/review-grok.md`가 이미 같은 원칙을 세워두었다 —
   *"v1 「보이는 소스 ≠ 평가 소스」"* 문제의식과 `look.html`이 *"하드코딩 스냅샷이라고 페이지가
   먼저 말한다"*는 처리 `[직접 읽음 docs/review-grok.md]`. **같은 정직성을 출처 축으로 확장하는 것뿐이다.**

[미확인: 위 CSS는 실제로 렌더해보지 않았다. proto/는 내 소유가 아니라 건드리지 않았다.
`--blue`, `--overlay1`, `--text`, `--subtext0`는 style.css가 이미 쓰는 catppuccin 변수다
`[직접 읽음 proto/style.css]`.]

### 3.3 붙여넣을 문안

**(A) SICM을 인용하는 페이지 상단 — 한국어**

> **원문 출처.** 이 페이지의 인용 블록은 Gerald Jay Sussman과 Jack Wisdom의
> 『Structure and Interpretation of Classical Mechanics』 제2판(The MIT Press,
> © 2014 Massachusetts Institute of Technology)에서 가져왔습니다. 원문은
> [CC BY-NC-SA 3.0 Unported](https://creativecommons.org/licenses/by-nc-sa/3.0/)로
> 공개되어 있으며, 이 페이지도 같은 조건으로 공개합니다.
>
> 텍스트는 Tim Vaughan의 [HTML 판](https://tgvaughan.github.io/sicm/)을 Sam Ritchie가
> [org-mode 판](https://github.com/mentat-collective/sicm-book)으로 옮긴 것을 다시 옮겼습니다.
> 계산은 Colin Smith와 Sam Ritchie의 [Emmy](https://github.com/mentat-collective/emmy)가
> 브라우저 안에서 수행합니다.
>
> **인용 블록 안의 문장은 원저자들의 것이고, 그 밖의 해설과 계산 셀은 김정한(GLG)의 것입니다.**
> 원저자들이 이 페이지를 검토하거나 승인한 바 없습니다.

**(B) 같은 블록 — 영어**

> **Source.** The quoted passages on this page are from *Structure and Interpretation of Classical
> Mechanics*, second edition, by Gerald Jay Sussman and Jack Wisdom (The MIT Press,
> © 2014 Massachusetts Institute of Technology), made available under
> [CC BY-NC-SA 3.0 Unported](https://creativecommons.org/licenses/by-nc-sa/3.0/).
> This page is offered under the same terms.
>
> The text follows Tim Vaughan's [HTML port](https://tgvaughan.github.io/sicm/) as rendered into
> org-mode by Sam Ritchie ([mentat-collective/sicm-book](https://github.com/mentat-collective/sicm-book)).
> The computation is performed in your browser by
> [Emmy](https://github.com/mentat-collective/emmy), by Colin Smith and Sam Ritchie.
>
> **Text inside quote blocks is the authors'. Everything else — commentary and evaluated cells —
> is by Junghan Kim (GLG).** The original authors have neither reviewed nor endorsed this page.

**(C) 개별 인용 블록 캡션** (각 블록 하단, `<cite class="org-cite">`)

```
— SICM 2판 §1.4 「Computing Actions」
— SICM 2e, §1.4 "Computing Actions"
```

**(D) 계산 셀 캡션** (원문 예제를 다시 돌리는 셀)

> 이 셀은 원문에 없습니다. 원문 §1.4의 예제를 Emmy로 다시 계산한 것입니다.
> This cell is not in the book. It re-computes the example from §1.4 using Emmy.

원문 코드를 거의 그대로 옮긴 셀이라면 이렇게:

> 원문 §1.4의 Scheme 코드를 Emmy(Clojure)로 옮긴 것입니다. 원문의 표기는 scmutils입니다.
> Adapted from the Scheme code in §1.4; the book uses scmutils, this uses Emmy (Clojure).

**(E) 페이지 푸터 — 소프트웨어 예우 + 라이선스 고지 한 덩어리**

> **이 페이지를 움직이는 것들.**
> [Emmy](https://github.com/mentat-collective/emmy) — Colin Smith, Sam Ritchie (GPL-3.0).
> [scittle](https://github.com/babashka/scittle) — Michiel Borkent (EPL-1.0).
> [scittle-kitchen](https://github.com/timothypratley/scittle-kitchen) — Timothy Pratley (EPL-1.0).
> [KaTeX](https://katex.org) — Khan Academy and contributors (MIT).
> [WebTUI](https://webtui.ironclad.sh) (MIT).
> [odex](https://github.com/littleredcomputer/odex-js) — Colin Smith (BSD-2-Clause).
> [fraction.js](https://github.com/infusion/Fraction.js) — Robert Eisele (MIT).
>
> [JavaScript 라이선스 정보 · JavaScript license information](/javascript.html)

**(F) 리포 README / `docs/` 첫 화면**

> ## 출처와 예우
>
> 이 저장소는 남의 노동 위에 서 있습니다.
>
> - **Gerald Jay Sussman · Jack Wisdom** — 『Structure and Interpretation of Classical Mechanics』
>   제2판 (The MIT Press, © 2014 MIT). CC BY-NC-SA 3.0 Unported.
>   1판은 **Meinhard E. Mayer**와 함께 썼습니다.
> - **Tim Vaughan** — HTML 판. <https://tgvaughan.github.io/sicm/> · CC BY-NC-SA 3.0.
>   조판은 **Andres Raba**의 SICP HTML5 판에서 왔습니다.
> - **Sam Ritchie** — org-mode 판. 손으로 다듬은 변환입니다.
>   <https://github.com/mentat-collective/sicm-book> · CC BY-NC-SA 3.0.
> - **Colin Smith · Sam Ritchie** — Emmy. 이 페이지의 수식이 값이 되는 것은 전적으로 이들 덕분입니다.
>   <https://github.com/mentat-collective/emmy> · GPL-3.0.
> - **Michiel Borkent** (scittle) · **Timothy Pratley** (scittle-kitchen) — Emmy를 브라우저까지
>   실어다 준 경로. EPL-1.0.
>
> 인용 문장은 원저자들의 것이고, 그 밖의 것은 제 것이며 제 잘못입니다.
> 원저자 누구도 이 저장소를 검토하거나 승인하지 않았습니다.

**(G) 인용 시 Emmy를 인용하는 형식** — Emmy 저자들이 직접 요청한 서식이 있다
`[1차 실측: CITATION.cff + README 「Citing Emmy」]`. 학술적 맥락에서 쓸 경우 그대로:

```bibtex
@software{Ritchie_Emmy_Functional_Computer_2016,
  author  = {Ritchie, Sam and Smith, Colin},
  license = {GPL-3.0},
  title   = {{Emmy: Functional Computer Algebra in Clojure}},
  url     = {https://github.com/mentat-collective/emmy},
  version = {0.32.0},
  year    = {2016}
}
```

**저자들이 요청한 방식으로 인용하는 것이 예우의 가장 값싸고 확실한 형태다.** `bibcli`로 SSOT에
넣어두면 반복 비용이 0이 된다.

### 3.4 발췌 범위 — 어디까지 인용할 수 있나

**법적 상한은 「전부」다.** CC BY-NC-SA 3.0은 비상업 조건과 표기·동일조건 아래 **전문 복제와 재배포를
허용한다** `[1차 실측: legalcode §3 — reproduce, incorporate into Collections, create Adaptations,
Distribute]`. 실제로 tgvaughan, Sam Ritchie, James Crook 세 사람이 각각 **전문**을 공개 웹에 올려두고
있고 아무 문제가 되지 않았다 `[1차 실측: 세 리포 README + tgvaughan.github.io/sicm HTTP 200]`.

**그러니 「얼마나 인용할 수 있나」는 저작권 물음이 아니다. 편집과 예우의 물음이다.**
그 관점에서 선을 긋는다:

| 범위 | 판단 |
|---|---|
| 절(section) 하나의 핵심 문단 1~3개 + 그 위 계산 | **권장.** 페이지가 말하려는 것이 "이 문장이 어떻게 값이 되는가"라면 이게 정확한 분량이다 |
| 장(chapter) 전체 | 가능하지만 **이 판의 목적이 아니다.** 전문 열람은 이미 세 군데에 있다 — 우리가 넷째를 만들 이유가 없다 |
| 전문 미러 | **하지 마라.** 예우가 아니라 **대체**다. 원문 트래픽과 맥락을 우리 쪽으로 끌어오면서 아무것도 더하지 않는다 |
| 수식·정의만 발췌하고 산문은 링크 | 안전하지만 **너무 인색하다.** SICM의 값어치는 산문에 있다 |

**원칙 한 줄: 우리 계산이 없으면 그 인용도 없다.**
인용은 **우리가 그 자리에서 무언가를 계산해 보이기 위해** 있는 것이고, 계산이 붙지 않는 인용은
페이지에서 뺀다. 이러면 분량이 자동으로 정직해지고, NC 회색지대(§1.1)에서도 가장 방어하기 쉬운
형태가 된다 — **인용 없이 링크만으로 성립하는 페이지는 NC 논쟁 자체가 없다.**

그리고 **원문 링크를 매 인용마다 건다.** 독자가 한 클릭으로 스승에게 갈 수 있어야 한다. 이건
조항이 아니라 예우다.

### 3.5 스승 명단 — 라이브러리 저자를 도구 제공자로 격하하지 않는다

이 판에서 이름이 불려야 하는 사람들, 그리고 **각자가 실제로 한 일** (전부 §1에서 실측한 근거 위에):

| 사람 | 한 일 | 없으면 |
|---|---|---|
| **Gerald Jay Sussman · Jack Wisdom** | SICM. 고전역학을 실행 가능한 형식으로 다시 씀 | 이 판에 담을 내용이 없다 |
| **Meinhard E. Mayer** | 1판 공저 | 2판이 서 있는 자리가 없다 |
| **Julie Sussman, PPA** | 원고 재구성·색인 (acknowledgments가 명시) `[1차 실측]` | 지금 읽는 형태의 책이 아니다 |
| **Colin Smith** | scmutils를 Clojure로 옮긴 최초 작업(SICMUtils), odex, Emmy 공동 저작권자 | **Emmy가 없다** |
| **Sam Ritchie** | Emmy 유지·발전, **그리고 GLG가 읽어온 org 판을 손으로 만든 사람** | 계산도 없고 GLG가 읽은 텍스트도 없다 |
| **Tim Vaughan** | HTML 판. Emmy 자신이 SICM 참조로 이 사이트를 링크한다 `[1차 실측: env.cljc]` | org 판의 출발점이 없다 |
| **Andres Raba** | SICP HTML5 판 조판 — Vaughan이 가져온 스타일 | 이 계통의 웹 조판 관습이 없다 |
| **Michiel Borkent (borkdude)** | scittle/SCI — 브라우저에서 Clojure가 평가된다 | **"평가되는 페이지" 자체가 없다** |
| **Timothy Pratley** | scittle-kitchen — Emmy를 CDN 한 줄로 실을 수 있게 함 | shadow-cljs 커스텀 번들을 직접 만들어야 한다 |
| **Robert Eisele** | fraction.js | Emmy의 유리수 산술이 없다 |

**GLG가 「스승」이라 부른 대상에 Sam Ritchie와 Tim Vaughan이 들어간다는 조율자의 지적은 실측으로
더 강해진다.** Sam Ritchie는 **두 번** 들어간다 — Emmy의 저자이면서, GLG가 몇 년째 읽어온 org
파일을 손으로 만든 사람이다(§1.3). 그리고 Colin Smith는 브리핑 명단에 없었지만
**Emmy의 공동 저작권자이자 이 계통을 Clojure로 처음 옮긴 사람**이다(§1.4) — 빠지면 안 된다.

§3.3 (E)·(F) 문안이 이 명단을 반영한다. **"Powered by Emmy" 같은 배지 한 줄로 줄이지 마라.**
그건 도구 제공자 표기이지 예우가 아니다.

---

## 4. 우리 쪽 라이선스 — `lichtung`

현재 `LICENSE` 파일이 없다 `[1차 실측: 리포 루트]`. 두 개의 제약이 동시에 걸린다:

- **위에서(SICM):** BY-NC-SA 3.0의 ShareAlike. 각색물은 BY-NC-SA 3.0/4.0으로만 나갈 수 있다(§1.1).
- **아래에서(Emmy):** GPL-3.0. 결합 저작물로 판정되는 범위는 GPL-3.0으로 나가야 한다(§2.4).

**CC-SA와 GPL은 서로 호환되지 않는다** — CC가 명명한 호환 라이선스 목록에 GPL은 없다
`[웹 출처 https://creativecommons.org/compatiblelicenses — 목록 확인, GPL 부재]`
[미확인: 이 목록 페이지를 직접 받아 읽지는 않았다. CC FAQ가 "one that CC has named as compatible"
로 이 목록을 가리키는 것까지가 1차 실측이다 `[1차 실측: ccfaq]`.]

**→ 단일 라이선스로는 안 닫힌다. 부위별로 나눠야 한다. 이건 회피가 아니라 정상적인 방식이고
REUSE/SPDX가 정확히 이걸 위해 있다.**

**권고 배치:**

| 부위 | 라이선스 | 이유 |
|---|---|---|
| SICM에서 온 텍스트 (인용·번역·재조판) | **CC BY-NC-SA 3.0** (또는 4.0) | ShareAlike 강제. 선택지가 없다 |
| GLG 자신의 산문·해설·설계 문서(`KONZEPT.md`, `docs/*`) | **CC BY-SA 4.0** 권장 | GLG의 글이고 SICM 각색이 아니다. NC를 물려받을 이유가 없다 `[판단]` |
| Emmy와 맞물리는 JS (`eval.js`, Emmy를 싣는 페이지 스크립트) | **GPL-3.0-only** | §2.4의 논쟁을 없애는 값싼 길 |
| 그 밖의 코드 (CSS, 빌드 스크립트, Emmy와 무관한 JS) | **MIT** 권장 | 재사용 가치가 있고 제약이 없다 |

**주의 — 라이선스 버전 선택 한 가지.** SICM 원문이 3.0이므로 각색물을 **4.0**으로 올릴 수 있다
(§4(b)의 *"a later version … with the same License Elements"*) `[1차 실측]`. 4.0이 더 명확하고
국제적으로 더 잘 다뤄지므로 **BY-NC-SA 4.0**을 권한다. 다만 **BY-NC-SA 3.0으로 그대로 두는 것도
완전히 유효**하고, 상류 셋(Vaughan·Ritchie·Crook)이 전부 3.0을 유지하고 있다 `[1차 실측]` —
사슬의 일관성을 중시한다면 3.0이 맞다. **GLG 결정 항목이다.**

**실무 형태 — REUSE 스타일 (권장):**

```
lichtung/
├── LICENSE            ← 기본값 하나만 (예: MIT). "부위별로 다르다"는 것을 README가 즉시 말함
├── LICENSES/          ← §2.5 (1)의 디렉터리
└── REUSE.toml  또는  각 파일 상단 SPDX 헤더
```

파일 상단 헤더 예:

```clojure
;; SPDX-FileCopyrightText: 2026 Junghan Kim
;; SPDX-License-Identifier: GPL-3.0-only
```

```markdown
<!--
SPDX-FileCopyrightText: 2014 Massachusetts Institute of Technology
SPDX-FileCopyrightText: 2026 Junghan Kim
SPDX-License-Identifier: CC-BY-NC-SA-3.0
-->
```

[미확인: REUSE 도구(`reuse lint`)를 이 리포에 적용해보지 않았다. SPDX 헤더 서식 자체는 Emmy가
이미 쓰는 방식과 같다 `[1차 실측: env.cljc:1]`.]

**리포 이름.** `lichtung`은 자리표시자다 `[직접 읽음 KONZEPT.md §5]`. 라이선스 문서에 이름이
박히므로 **이름을 먼저 정하고 LICENSE를 넣는 편이 정정 비용이 적다.**

---

## 5. 확인하지 못한 것 — 명시

라이선스 판정에 추정이 섞이는 것이 이 임무에서 제일 위험하므로, 닫지 못한 것을 그대로 적는다.

1. **GPL JS = 배포**에 대한 **법원 판결을 찾지 못했다.** §2.1은 조문 + FSF 입장 + 커뮤니티 관행
   + 대규모 실사용(423건)에 근거한 판단이지 판례가 아니다.
2. **`eval.js` + Emmy가 결합 저작물인지 aggregate인지 판정하지 못했다.** §2.4에 양쪽 읽기와
   회피 경로를 적었다. 이건 원리적으로 내가 판정할 수 있는 종류의 물음이 아니다.
3. **NC와 「이력·구직 맥락이 있는 개인 사이트」의 관계에 확립된 기준이 없다.** CC 스스로
   *"CC cannot advise you on what is and is not commercial use"*라고 한다 `[1차 실측]`.
   §1.1은 방어 가능한 상태를 유지하는 방법이지 안전 확인이 아니다.
4. **`creativecommons.org/compatiblelicenses` 페이지를 직접 받아 읽지 않았다.** GPL이 CC-SA
   호환 목록에 없다는 것은 널리 알려진 사실이나 이 세션의 1차 실측이 아니다.
5. **공식 scittle + kitchen emmy 플러그인 혼용**은 재보지 않았다. kitchen README가 말리므로
   `proto/index.html`이 짝을 맞춘 상태다 `[직접 읽음 proto/index.html:90-91]`.
   (이건 `docs/review-grok.md`의 남은 항목과 같다.)
6. **§3.2의 CSS를 렌더해보지 않았다.** `proto/`가 내 소유가 아니어서 적용도 측정도 안 했다.
7. **SICM 3판이나 더 새로운 공식 온라인판이 있는지 확인하지 못했다.** 현재 MIT Press 콘텐츠
   서버가 2판을 서빙하는 것까지만 실측했다 `[1차 실측]`. `mitpress.mit.edu` 본 사이트는
   내 요청에 **403**을 돌려줘서 서지 페이지를 못 읽었다 `[1차 실측]`.
8. **`docs/sicm-sample.md`와 `proto/sicm.html`은 형제(grok)가 작업 중이라 내용 판단을 하지 않았다.**
   존재만 확인했다 `[1차 실측: 디렉터리 목록]`. 위 문안이 실제 그 파일들에 어떻게 앉을지는
   그 축 담당이 정한다.

---

## 6. GLG 결정 필요

**결정 1 — Emmy를 싣는가.** (§2.6)
싣는다면 GPL 고지 의무가 따라오고, 그 작업은 §2.5로 한 시간이면 닫힌다.
안 실으면 KONZEPT의 *"수식이 값"*이 무너진다. **권고: 싣고 조항을 충족한다(대안 C).**

**결정 2 — `eval.js`와 페이지 JS를 GPL-3.0으로 낼 것인가.** (§2.4)
GPL로 내면 결합 저작물 논쟁이 사라진다. 22행짜리 파일이라 잃는 것이 없다.
MIT로 두겠다면 Emmy를 별도 페이지로 격리하는 편이 정직하다(대안 B).
**권고: GPL-3.0-only.**

**결정 3 — SICM 텍스트를 BY-NC-SA 3.0으로 둘 것인가, 4.0으로 올릴 것인가.** (§4)
둘 다 유효하다. 3.0 = 상류 셋과 사슬 일관성. 4.0 = 더 명확한 조문.
**권고: 4.0. 다만 사슬 일관성을 중시하면 3.0도 옳다.**

**결정 4 — 발췌 범위.** (§3.4)
**권고: "우리 계산이 없으면 그 인용도 없다."** 절 단위 핵심 문단 1~3개. 전문 미러는 하지 않는다.

**결정 5 — NC 경계를 어디에 적어둘 것인가.** (§1.1)
사이트 수익화 시 SICM 페이지를 내린다는 조건을 어디에 남길지 — 이 문서, 리포 `AGENTS.md`,
또는 homepage `AGENTS.md`. **권고: homepage 쪽에도 남긴다.** 발행면이 거기이기 때문이다.

**결정 6 — 리포 이름.** (§4)
`lichtung`이 자리표시자이므로, LICENSE·SPDX 헤더·고지 문안에 이름이 박히기 전에 정하는 편이 싸다.

**결정 7 — 라벨표를 붙일 것인가, emmy.mentat.org 수준(배지 + LICENSE 링크)에서 멈출 것인가.** (§2.3)
상류의 실제 관행은 후자다. 전자가 더 엄격하고 예우의 방향과 맞는다.
**권고: 라벨표까지. 비용이 한 장짜리 HTML이다.**

---

### 부록 — 이 감사에서 은퇴시키거나 정정한 문장

1. **「Emmy 패키지 라이선스는 GPL」** (`docs/review-grok.md`, 출처는 kitchen README)
   → **유지되고 더 좁혀졌다: GPL-3.0-only, 예외조항 없음.**
   영수증: Emmy `LICENSE` 축자 GPLv3 673행(md5 `4fe869ee98…`) + `src/emmy/env.cljc:1`의
   `SPDX-License-Identifier: GPL-3.0` + 리포 전체에서 `"any later version"`이 LICENSE 밖에 0건.
   **상속받은 사실이 1차 출처에서 닫혔다.**

2. **「SICM 저자 = Sussman · Wisdom · Mayer」** (임무 브리핑)
   → **온라인 2판에 대해서는 정정.** 2판 title page는 Sussman·Wisdom 둘. Mayer는 1판 공저자.
   영수증: MIT Press zip 안 `titlepage.html`, `acknowledgments.html` 원문.

3. **「Emmy의 구 이름이 sicm-utils」**
   → **거의 맞다. 정확히는 `SICMUtils`** (하이픈 없음), 리포 `sicmutils/sicmutils`, archived,
   GPL-3.0 동일. 영수증: 리포 README 경고문 + GitHub API `archived: true`.

4. **파생판 README들이 가리키는 MIT Press 원문 URL**
   → **죽었다(403).** 영수증: 직접 요청. 살아 있는 경로는 `mitp-content-server.mit.edu/…/sicm_edition_2.zip` (200).
   **문안에 이 링크를 베껴 쓰면 안 된다.**

5. **상류 README/`toc.org`의 「CC BY-SA 3.0」 링크 텍스트**
   → **오타. 실제는 BY-NC-SA 3.0** (URL은 맞게 `by-nc-sa`를 가리킨다).
   그대로 베끼면 **NC가 사라진 고지**가 된다.

6. **npm `scittle-kitchen`의 `license: EPL-1.0`**
   → **`dist/scittle.emmy.js`에 대해 오도한다.** 그 파일은 GPL-3.0 Emmy를 담는다.
   자동 라이선스 스캐너가 이 GPL을 놓친다.

7. **GitHub API가 `tgvaughan/sicm`을 `NOASSERTION`으로 표시**
   → **라이선스는 명확하다(CC BY-NC-SA 3.0).** 자동 인식기가 짧은 커스텀 LICENSE를 못 읽을 뿐.
