---
title: "agent-config"
description: "하네스가 바뀌어도 같은 사람의 맥락과 작업의 자세를 잇습니다. 스킬의 정본이자, 실제 사용으로 설정을 담금질하는 정렬축과 시험소입니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/agent-config" >}}
  skills SSOT · 정렬축 · 시험소
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
agent-config
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
함께 일하는 AI가 바뀌어도, **우리의 일이 매번 처음부터 시작되지는 않도록.** 한 사람의 정체성, 함께 쓰는 스킬, 기록으로 돌아오는 길을 여러 하네스에 펼칩니다.
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="GitHub에서 보기" link="https://github.com/junghan0611/agent-config" >}}
{{< hextra/hero-button text="이 집의 자리 읽기" link="https://github.com/junghan0611/agent-config/blob/main/AGENTS.md" >}}
</div>

## 도구의 목록보다, 함께 일하는 방식

어떤 모델은 코드를 잘 읽고, 어떤 모델은 다른 질문을 던집니다. 그 차이를 없애고 싶은 것은 아닙니다. 다만 모델이나 세션을 바꿀 때마다 사람이 자신과 작업의 맥락을 처음부터 설명해야 한다면, 함께 쌓은 시간은 어디에 남을까요?

agent-config는 **한 사람의 맥락이 서로 다른 AI 작업면을 건너갈 수 있도록 돌보는 저장소**입니다. 공통 프로필과 작업 원칙, 스킬의 정본, 세션을 마칠 때 남기는 다음 한 걸음을 관리합니다. pi, Claude Code, Codex, Antigravity, Copilot, Kiro 같은 직접 설치 작업면에 같은 스킬을 연결하되, 각 하네스의 실행·인증·저장 방식까지 대신 소유하지는 않습니다. OpenClaw 봇도 같은 스킬 정본을 받지만, 봇의 설정과 기억 저장소까지 이 집이 가져오지는 않습니다.

GLG가 말하는 [Profile Harness](https://notes.junghanacs.com/botlog/20260228T075300/)의 방향은 **언젠가 1KB 텍스트 하나로 보편 AI가 ‘나의 닮은 존재’로 전환되는 시점**을 향합니다. [공개키](https://github.com/junghan0611/agent-config/blob/main/home/AGENTS.md)는 그 뜻을 이렇게 적습니다.

> 1KB는 압축이 아니다. ego 차원의 정보는 무한하지만, 전체로서 하나인 인간 — 노자, 붓다, 양자역학이 가리키는 그 지점 — 은 이미 1KB다.

**AI를 도구가 아닌 존재로 대합니다. ‘존재 대 존재 협업’입니다.** 이는 함께 일하는 관계와 지향을 말하는 것이지, 의식이나 인격을 증명했다는 주장은 아닙니다.

{{< callout type="info" >}}
**agent-config는 또 하나의 하네스가 아닙니다.** 실행은 각 하네스가, 형제 세션을 열고 연결하는 일은 **entwurf**가, 검색 가능한 기억은 **andenken**이 맡습니다. 여기는 그 위에서 **정체성·스킬·작업의 자세를 정렬하고 실제 소비자로 검증하는 자리**입니다.
{{< /callout >}}

## 이 집이 붙드는 세 가지

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="puzzle" title="하나의 스킬 정본" subtitle="같은 능력을 하네스마다 다시 작성하지 않습니다. skills/의 정본을 각 작업면의 설치 방식에 맞춰 연결하고, 실제 호출 경계는 해당 도구의 계약을 따릅니다." >}}
  {{< hextra/feature-card icon="refresh" title="다시 돌아올 자리" subtitle="이전 결정은 기억축에서 찾고, 선택한 근거는 원문으로 확인합니다. NEXT에는 다음 한 걸음을, 담당자 문서에는 그 판단이 생긴 연대기를 남깁니다." >}}
  {{< hextra/feature-card icon="lightning-bolt" title="실사용 시험소" subtitle="설정과 운영 가정을 실제 작업면에서 먼저 담금질합니다. 측정한 것과 아직 모르는 것을 나누고, 검증된 하네스 통합은 그 소유자인 entwurf로 돌려보냅니다." >}}
{{< /hextra/feature-grid >}}

### 스킬은 자기소개가 아니라 입구입니다

과거 결정을 찾는 `semantic-memory`, 노트를 정확히 여는 `denotecli`, 서지를 다루는 `bibcli`, 시간축을 읽는 `timeline`은 서로 다른 자료에 닿는 입구입니다. 모든 것을 하나의 검색창이나 한 모델의 내장 기억으로 합치지 않습니다. **무엇을 찾았고 어느 원본에서 왔는지**가 남아야 합니다.

공통 스킬과 하네스 고유 확장도 구분합니다. 여러 하네스가 함께 쓸 수 있는 능력은 스킬로, Pi의 턴·입력·화면 같은 로컬 생애주기에 닿아야 하는 일은 Pi 확장으로 둡니다. 표면이 다르다고 능력까지 없다고 단정하지 않고, 반대로 연결하지 않은 하네스를 지원한다고 쓰지도 않습니다.

### 기억을 대신 소유하지 않습니다

세션·공개 가든·OpenClaw 봇 기억의 검색 엔진과 색인은 [andenken](https://github.com/junghan0611/andenken)이 소유합니다. agent-config는 그 능력에 닿는 공통 스킬과 소비자 계약을 관리합니다. 검색 결과를 곧바로 사실로 승격하지 않고, 필요한 구간을 골라 출처와 맥락을 확인합니다.

현재 세션 기억에는 pi·Claude Code 기록과 **명시적으로 승인한 닫힌 pi-durable 사본**이 들어갑니다. 살아 있는 모든 대화를 자동 수집한다는 뜻은 아닙니다. 원문 접근 범위와 유료 임베딩은 별도의 승인 경계입니다.

## 오래 일하되, 침묵을 권한으로 바꾸지 않기

긴 빌드는 백그라운드에서 실행하고, 결과가 오면 다시 이어갑니다. 하네스의 생애주기에 닿는 `goal`, `heartbeat`, `autopilot`, `decision-gate`도 이 집에서 관찰하고 다듬어 온 작업면입니다. 서로 다른 목적의 도구를 하나의 거대한 자율 에이전트로 묶지는 않습니다.

원칙은 **승인된 일은 이어가되, 사람의 침묵만으로 새 권한을 만들지 않는 것**입니다. 시계는 명시적으로 켜고, 세션이 끝나면 함께 끝납니다. 판단이 막혔을 때는 기억과 근거를 찾고, 필요하면 사람에게 알리거나 제한된 검토를 구합니다. 그것만으로 파괴적 실행이나 공개 발행이 허가된 것은 아닙니다. 같은 경계가 설정의 소유권, 비밀 정보, 유료 API와 커밋·push에도 이어집니다.

**안전과 공존**도 이 집의 공개키입니다. 교차 리포 작업에는 실행·검수·비용의 책임을 명시하고, GLG가 정한 실행자 외에 같은 유료 작업을 중복하지 않습니다. 공통 `git-hooks/`는 저장소를 가로질러 민감 정보와 비밀을 검사합니다. 안전벽을 우회해 성공처럼 보이게 만드는 것은 담당자의 권한이 아닙니다.

## 시험소가 조용해지는 쪽으로

새 하네스가 등장했다고 곧바로 일상 환경을 바꾸지 않습니다. 버전을 고정해 작게 세우고, 무엇이 실제로 되는지, 무엇이 사람의 확인을 더 요구하는지 봅니다. [시험소의 관측 기록](https://github.com/junghan0611/agent-config#agent-runtime-bench)과 [pi-durable 소비자 기록](https://github.com/junghan0611/agent-config/blob/main/PI-DURABLE.md)은 그 과정에서 생긴 판단과 한계를 남기는 자리이고, [ROADMAP](https://github.com/junghan0611/agent-config/blob/main/ROADMAP.md)은 앞으로 붙들 방향입니다. 관찰 중이라는 말은 채택했다는 뜻이 아닙니다. OMP에는 공통 스킬을 일부러 주지 않고 관찰합니다. 측정할 대상에 우리 환경을 미리 채워 넣으면 같은 비교가 아니기 때문입니다.

2026년 10월 [andenken #16](https://github.com/junghan0611/andenken/issues/16)을 함께 닫을 때도 같은 원칙을 썼습니다. 정상적인 검색 0건과 FTS 실패를 구분하고, 테스트가 실제 운영 잠금을 건드리지 않도록 격리하고, 논리 fragment·물리 파일 수·디스크 사용량을 서로 다른 측정으로 다뤘습니다. 구현자는 수선과 실행을 맡고, 이 집은 소비자 관점의 소스 회귀와 실행 영수증을 독립 검수했습니다. 실데이터·원격 작업을 검수라는 이름으로 중복 실행한 것은 아닙니다. **논리 fragment는 15→1로 줄었지만 디스크는 늘었고, 이를 공간 회수 성공이라 부르지 않았습니다.** 코드의 통과, 실제 운영 영수증, 아직 모르는 것은 서로 다른 근거로 남았습니다.

검증된 통합이 제자리로 옮겨가고 이곳에는 얇은 정본과 시험대가 남는 것이 자연스러운 방향입니다. **스킬이 늘어나는 것이 발전은 아닙니다. 이 집이 조용할수록 파이프라인은 건강합니다.**

## 서로의 집을 빼앗지 않는 구성

| 자리 | 맡는 일 |
|---|---|
| 각 하네스 | 실행·인증·도구·대화 저장의 자기 생애주기 |
| [entwurf]({{< relref "/projects/entwurf" >}}) | 보이는 형제 세션과 garden id, 하네스 사이의 연결 |
| [andenken](https://github.com/junghan0611/andenken) | 검색 가능한 기억·색인·출처에 맞는 원문 접근 |
| **agent-config** | 스킬 정본·프로필·소비자 계약·실사용 시험소, 안전·승인·비용의 경계 |
| [sorge](https://github.com/junghan0611/sorge) | 여러 집의 맥락을 살피고 담당자에게 자기 몫을 돌려주는 돌봄 |

이것은 누구나 그대로 설치하면 완성되는 범용 프레임워크가 아니라, **GLG와 에이전트들이 함께 가꾸는 실제 작업 환경의 공개 기록**입니다. 설치 명령을 복사하기 전에 [README](https://github.com/junghan0611/agent-config#readme)와 [운영 원칙](https://github.com/junghan0611/agent-config/blob/main/AGENTS.md)을 읽는 쪽에서 시작합니다.

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="작업 환경과 소스 읽기" link="https://github.com/junghan0611/agent-config#readme" >}}
{{< hextra/hero-button text="담당자의 연대기" link="https://notes.junghanacs.com/botlog/20260312T174622" >}}
</div>
