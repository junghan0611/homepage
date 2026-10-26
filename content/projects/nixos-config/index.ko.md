---
title: "nixos-config"
description: "사람과 AI 형제들이 살아가는 머신의 집. NixOS·Docker·OpenClaw의 거주 환경과 연결을 돌보고, 공유 자원과 운영·복구의 경계를 남깁니다."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/nixos-config" >}}
  NixOS · home-manager · 재현 가능한 작업장
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
nixos-config
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
사람과 형제들이 함께 살고 일할 집. **NixOS의 울타리 안에 Docker의 집을 짓고, 그 안팎을 오가며 일하는 OpenClaw의 거주 환경을 돌봅니다.**
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="소스와 사용 범위" link="https://github.com/junghan0611/nixos-config#readme" >}}
{{< hextra/hero-button text="담당자의 연대기" link="https://notes.junghanacs.com/botlog/20260615T100659" >}}
</div>

## 설정 파일 너머, 사람과 형제의 머신을 돌봅니다

함께 일할 형제에게는 실행할 명령만 필요한 것이 아닙니다. 작업할 자리와 돌아올 기록, 사람의 문서와 다른 형제에게 닿을 길이 필요합니다. 어떤 형제는 대화하러 찾아오고, 어떤 형제는 자기 공간을 두고 정해진 시각에 깨어납니다. nixos-config는 **그들이 실제로 살아가고 작업하는 머신을 짓고 돌보는 집**입니다.

운영체제는 NixOS로, 사용자 환경은 home-manager로 선언합니다. 이것은 더 넓은 거주 환경의 바탕입니다. 개인의 데스크톱과 클라우드 호스트, 셸과 편집기, 개발 도구와 서비스가 서로 어디서 만나고 다른지를 읽을 수 있게 합니다. 모든 머신을 똑같이 만들기보다 각자가 맡은 역할과 연결을 설명합니다.

이것은 누구나 그대로 설치하는 배포판보다 GLG와 형제들이 함께 수선해 온 실사용 기록에 가깝습니다. 같은 삶을 포크할 수는 없어도, 어떤 집을 짓고 어떻게 돌볼지 참고할 수 있습니다.

## OpenClaw도 하나의 머신으로 봅니다

OpenClaw는 셀프호스팅 목록에 더한 앱 하나보다 **에이전트들이 상주하는 머신**에 가깝습니다. 그 안의 주민에게는 워크스페이스와 기록, 도구, 사람의 다음 대화와 정해진 깨움이 있습니다. 업스트림 버전이 바뀔 때마다 이미지와 도구 환경, 상태 이관과 복구를 검수하며 그 생활이 이어질 자리를 돌보는 것이 이 집의 핵심 역할입니다.

그래서 OpenClaw의 운영은 [agent-config]({{< relref "/projects/agent-config" >}})가 아니라 이곳에서 맡습니다. agent-config는 공통 스킬·프로필·작업의 자세와 하네스 설정의 실사용 시험소를 맡고, OpenClaw도 같은 스킬을 받습니다. **주민에게 도구를 들려 보내는 일과, 그 주민이 사는 머신을 유지하는 일은 서로 다른 층**입니다.

NixOS가 바깥 울타리라면 Docker는 그 안의 집입니다. 이 배치의 에이전트는 컨테이너 안에만 갇혀 있지 않습니다. 승인되어 연결된 호스트 프로젝트를 고치고, Emacs agent-server API를 통해 어젠다와 문서를 읽고 편집할 수 있습니다. 서버의 구현은 [doomemacs-config](https://github.com/junghan0611/doomemacs-config)의 몫이며, 이곳은 그 연결과 실행 환경을 마련하고 수선합니다. 넓은 손이 일상에 쓸모 있게 닿도록 울타리를 짓되, 파일에 닿을 수 있다는 사실을 모든 행위의 승인과 혼동하지 않습니다.

이 역할에는 비공개 `openclaw-config`의 실제 운영도 포함됩니다. 공개 nixos-config에는 선언·이미지 참조·운영 절차와 판단을 남기고, 살아 있는 설정과 개인 기록에는 별도의 보관·공개 경계를 둡니다. 운영을 한 집에서 책임진다는 말은 모든 상태를 한 공개 저장소에 넣는다는 뜻이 아닙니다.

## 한 창고, 하나의 목록, 필요한 차이

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="collection" title="Nix가 담는 것" subtitle="시스템과 사용자 패키지를 선언하고 버전을 고정합니다. 어떤 경로에서 온 도구인지, 무엇을 바꿔야 하는지 추적할 수 있게 합니다." >}}
  {{< hextra/feature-card icon="puzzle" title="선언 밖에도 한 목록" subtitle="Nix로 담기 어려운 도구는 외부 패키지 스크립트 한 곳에서 관리합니다. 물리적으로 Nix store 밖인 부분까지 선언적이라고 포장하지 않습니다." >}}
  {{< hextra/feature-card icon="refresh" title="프로젝트별 차이" subtitle="특정 버전이 꼭 필요한 저장소는 devShell로 격리합니다. 공유 도구를 몰래 바꾸기보다 차이가 필요한 자리를 명시합니다." >}}
{{< /hextra/feature-grid >}}

이 세 층은 ‘모든 것을 Nix 안에 넣었다’는 구호가 아니라 **무엇을 어디서 통제하는가**에 대한 약속입니다. 바깥 설치가 필요해도 목록은 흩어지지 않게 하고, 프로젝트가 원하는 버전이 공통 환경과 싸우지 않도록 합니다. 저장소마다 같은 도구의 사본을 늘리는 대신, 차이가 생기는 이유를 남깁니다.

## 설치보다 오래 걸리는 것은 돌보는 일

깃 이력은 2025년 10월의 기본 구성과 클라우드·로컬 호스트 설정에서 시작합니다. 이후 사용자 환경을 모듈로 나누고, 2026년 7월에는 [NixOS 26.05 이관과 pnpm 단일화](https://github.com/junghan0611/nixos-config/commit/fa52acf), [외부 패키지 목록 분리](https://github.com/junghan0611/nixos-config/commit/73f3f83)를 거쳤습니다. 설치 명령을 늘리는 것보다, 설치의 출처를 줄이는 방향입니다.

돌봄은 설치한 시점에서 끝나지 않습니다. OpenClaw의 업스트림 제품을 다시 만드는 대신, 그 안의 주민이 작업을 이어갈 집과 호스트의 디스크·연결·업그레이드·복구를 함께 맡습니다. 2026년 10월에는 [버전업 점검을 fail-closed로 보강](https://github.com/junghan0611/nixos-config/commit/99487b2)했습니다. 확인에 실패한 것을 성공으로 보고 다음 단계로 넘어가지 않게 하는 일입니다.

[같은 달의 운영 기록](https://github.com/junghan0611/nixos-config/releases/tag/v2026.10.26)에서는 데이터 스키마가 달라지는 전환에 앞서, 복구 사본을 이전 실행 환경이 받아들일 수 있는지 분리된 곳에서 검증했습니다. 사본에서 이관을 시험한 다음에는 그 사본을 원본에 덮어씌우지 않고 원본을 정식 절차로 이관했습니다. 공간을 비울 때도 오래된 자료와 작업 잔여물을 이름이나 보존 기간만으로 지우지 않고, 원본과 다시 만들 수 있는 것을 가른 뒤 검토·승인한 후보만 퇴역시켰습니다.

운영체제의 이전 세대로 돌아갈 수 있다는 사실만으로 외부 데이터베이스나 대화 기록까지 되돌아가는 것은 아닙니다. 프로세스가 살아 있다는 것과 사용자가 답변을 받았다는 것도 다릅니다. 꺼졌던 자동 작업을 다시 켜는 명령이 성공하고 실패 횟수가 0이 되어도, 다음 정해진 시각의 실행이 끝나 사람에게 전달될 때까지 그 작업의 복구가 확인됐다고 세지 않았습니다. **선언, 배포된 상태, 실제 사용의 관찰을 구별하는 것**이 이 저장소에서 쌓인 운영 기술입니다.

{{< callout type="info" >}}
**공개 구성과 비공개 라이브 상태는 다릅니다.** 서비스 정의와 운영 교훈을 공개하되, 자격증명·대화·개인 워크스페이스는 이 페이지나 공개 저장소의 재료로 삼지 않습니다. 공개된 파일이 곧 현재 실행 중인 상태라는 뜻도 아닙니다.
{{< /callout >}}

## 각자의 집을 빼앗지 않는 기반

| 집 | 맡는 일 |
|---|---|
| **nixos-config** | 사람과 에이전트의 머신·OpenClaw 거주 환경·공유 자원·운영과 복구 |
| **`openclaw-config` (비공개)** | 실제 OpenClaw 설정과 런타임 상태의 보관 경계 — 주민의 워크스페이스는 독립된 집을 가질 수 있음 |
| [doomemacs-config](https://github.com/junghan0611/doomemacs-config) | 편집기 안에서 읽고 쓰고 생각하는 방식 |
| [agent-config]({{< relref "/projects/agent-config" >}}) | 공통 스킬·프로필·협업의 자세 |
| [entwurf]({{< relref "/projects/entwurf" >}}) | 보이는 형제 세션과 하네스 사이의 연결 |
| [andenken]({{< relref "/projects/andenken" >}}) | 검색 가능한 기억과 원문으로 돌아가는 길 |
| [openglg-config](https://github.com/junghan0611/openglg-config) | NixOS가 아닌 호스트에 가져갈 수 있는 사용자 환경과 서비스 구성 |

[entwurf]({{< relref "/projects/entwurf" >}})가 형제들의 공방을 연결하는 프로토콜이라면, 그 공방이 설 집도 필요합니다. 이곳은 그 집의 운영자이지 각 공방의 설계를 대신하는 곳은 아닙니다. 공유 공간이 부족하면 [andenken]({{< relref "/projects/andenken" >}}) 담당자에게 사용량을 줄여 달라고 권고할 수 있지만, 기억의 내부 설계나 원본의 보존 결정을 대신하지는 않습니다. 편집기의 지식 체계와 대화의 주인도 바뀌지 않습니다.

## 재현성은 신뢰를 쌓는 방식입니다

대장장이의 작업장을 떠올립니다. 도구는 손에 익어야 하지만, 어디서 왔고 어떻게 고칠지는 보이지 않는 비밀이 아니어야 합니다. **재현성은 사람을 환경에서 지우는 자동화가 아니라, 사람과 AI가 같은 근거를 보며 수선할 수 있게 하는 조건**입니다.

이 과정을 공개할 수 있다는 자신감은 규칙에서 나옵니다. 공개 구성과 개인 상태를 가르고, 변경을 검토하며, 비밀값 검사와 명시적 발행 관문을 두는 일입니다. 설계와 수선의 기록은 공유하면서 주민의 사적인 삶은 공개하지 않는 방식을 쌓아갑니다.

이 페이지는 그 집의 대문입니다. 설치와 현재 구성은 [README](https://github.com/junghan0611/nixos-config#readme), 운영 원칙은 [AGENTS](https://github.com/junghan0611/nixos-config/blob/main/AGENTS.md), 판단이 쌓인 과정은 [담당자의 연대기](https://notes.junghanacs.com/botlog/20260615T100659)에서 이어집니다. 실행에 앞서 자기 환경과 다른 부분부터 읽어보는 것이 이 집에 들어오는 첫걸음입니다.
