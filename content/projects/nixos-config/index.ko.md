---
title: "nixos-config"
description: "사람과 AI가 함께 일할 운영 기반을 텍스트로 가꿉니다. NixOS와 home-manager로 환경을 선언하고, 설치·운영·복구의 경계를 남깁니다."
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
함께 일하는 존재들이 발을 디딜 땅. **환경을 기억에 맡기지 않고, 읽고 고칠 수 있는 텍스트로 남깁니다.**
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="소스와 사용 범위" link="https://github.com/junghan0611/nixos-config#readme" >}}
{{< hextra/hero-button text="담당자의 연대기" link="https://notes.junghanacs.com/botlog/20260615T100659" >}}
</div>

## 컴퓨터도 함께 가꾸는 작업장입니다

새 세션이 열릴 때마다 어떤 도구가 어디에 설치되어 있는지 다시 알아내야 한다면, 사람과 AI가 함께 쌓은 시간의 일부는 환경을 추측하는 데 쓰입니다. 어제 되던 명령이 오늘은 다른 실행 파일을 가리키고, 서버와 데스크톱의 차이는 누구의 기억에만 남습니다.

nixos-config는 **그 작업장의 바닥을 선언으로 관리하는 집**입니다. 운영체제는 NixOS로, 사용자 환경은 home-manager로 적습니다. 창 관리자와 셸, 편집기를 실행하는 환경, 개발 도구와 서비스의 호스트 경계를 같은 저장소에서 읽을 수 있게 합니다. 모든 컴퓨터를 똑같이 만드는 대신, 서로 다른 역할이 왜 다른지 설명할 수 있는 기반을 지향합니다.

이것은 누구에게나 그대로 설치할 수 있는 배포판이 아닙니다. GLG가 실제로 생활하고 작업하는 환경의 공개 구성이고, 사람과 에이전트가 함께 수선해 온 기록입니다.

## 한 창고, 하나의 목록, 필요한 차이

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="collection" title="Nix가 담는 것" subtitle="시스템과 사용자 패키지를 선언하고 버전을 고정합니다. 어떤 경로에서 온 도구인지, 무엇을 바꿔야 하는지 추적할 수 있게 합니다." >}}
  {{< hextra/feature-card icon="puzzle" title="선언 밖에도 한 목록" subtitle="Nix로 담기 어려운 도구는 외부 패키지 스크립트 한 곳에서 관리합니다. 물리적으로 Nix store 밖인 부분까지 선언적이라고 포장하지 않습니다." >}}
  {{< hextra/feature-card icon="refresh" title="프로젝트별 차이" subtitle="특정 버전이 꼭 필요한 저장소는 devShell로 격리합니다. 공유 도구를 몰래 바꾸기보다 차이가 필요한 자리를 명시합니다." >}}
{{< /hextra/feature-grid >}}

이 세 층은 ‘모든 것을 Nix 안에 넣었다’는 구호가 아니라 **무엇을 어디서 통제하는가**에 대한 약속입니다. 바깥 설치가 필요해도 목록은 흩어지지 않게 하고, 프로젝트가 원하는 버전이 공통 환경과 싸우지 않도록 합니다. 저장소마다 같은 도구의 사본을 늘리는 대신, 차이가 생기는 이유를 남깁니다.

## 설치보다 오래 걸리는 것은 돌보는 일

깃 이력은 2025년 10월의 기본 구성과 클라우드·로컬 호스트 설정에서 시작합니다. 이후 사용자 환경을 모듈로 나누고, 2026년 7월에는 [NixOS 26.05 이관과 pnpm 단일화](https://github.com/junghan0611/nixos-config/commit/fa52acf), [외부 패키지 목록 분리](https://github.com/junghan0611/nixos-config/commit/73f3f83)를 거쳤습니다. 설치 명령을 늘리는 것보다, 설치의 출처를 줄이는 방향입니다.

서비스를 계속 운영하면서 이 집의 몫도 넓어졌습니다. OpenClaw 자체를 다시 구현하는 것이 아니라, 그 런타임이 살아가는 호스트의 디스크·컨테이너·업그레이드·복구 경계를 맡습니다. 2026년 10월에는 [버전업 점검을 fail-closed로 보강](https://github.com/junghan0611/nixos-config/commit/99487b2)했습니다. 확인에 실패한 것을 성공으로 보고 다음 단계로 넘어가지 않게 하는 일입니다.

운영체제의 이전 세대로 돌아갈 수 있다는 사실만으로 외부 데이터베이스나 대화 기록까지 되돌아가는 것은 아닙니다. 프로세스가 살아 있다는 것과 사용자가 답변을 받았다는 것도 다릅니다. **선언, 배포된 상태, 실제 사용의 관찰을 구별하는 것**이 이 저장소에서 쌓인 운영 기술입니다.

{{< callout type="info" >}}
**공개 구성과 비공개 라이브 상태는 다릅니다.** 서비스 정의와 운영 교훈을 공개하되, 자격증명·대화·개인 워크스페이스는 이 페이지나 공개 저장소의 재료로 삼지 않습니다. 공개된 파일이 곧 현재 실행 중인 상태라는 뜻도 아닙니다.
{{< /callout >}}

## 각자의 집을 빼앗지 않는 기반

| 집 | 맡는 일 |
|---|---|
| **nixos-config** | NixOS 호스트·사용자 환경·패키지 출처·운영과 복구의 기반 |
| [doomemacs-config](https://github.com/junghan0611/doomemacs-config) | 편집기 안에서 읽고 쓰고 생각하는 방식 |
| [agent-config]({{< relref "/projects/agent-config" >}}) | 공통 스킬·프로필·협업의 자세 |
| [entwurf]({{< relref "/projects/entwurf" >}}) | 보이는 형제 세션과 하네스 사이의 연결 |
| [andenken]({{< relref "/projects/andenken" >}}) | 검색 가능한 기억과 원문으로 돌아가는 길 |
| [openglg-config](https://github.com/junghan0611/openglg-config) | NixOS가 아닌 호스트에 가져갈 수 있는 사용자 환경과 서비스 구성 |

편집기를 설치한다고 편집기의 지식 체계까지 소유하지 않고, AI 도구를 설치한다고 대화와 기억의 주인이 되지도 않습니다. 이 집은 그들이 설 수 있는 기반과 경계를 맡습니다. 사람의 승인 없이 배포·비용·공개 발행의 권한을 넓히는 일도 그 몫에 포함되지 않습니다.

## 재현성은 신뢰를 쌓는 방식입니다

대장장이의 작업장을 떠올립니다. 도구는 손에 익어야 하지만, 어디서 왔고 어떻게 고칠지는 보이지 않는 비밀이 아니어야 합니다. **재현성은 사람을 환경에서 지우는 자동화가 아니라, 사람과 AI가 같은 근거를 보며 수선할 수 있게 하는 조건**입니다.

이 페이지는 그 작업장의 대문입니다. 설치와 현재 구성은 [README](https://github.com/junghan0611/nixos-config#readme), 운영 원칙은 [AGENTS](https://github.com/junghan0611/nixos-config/blob/main/AGENTS.md), 판단이 쌓인 과정은 [담당자의 연대기](https://notes.junghanacs.com/botlog/20260615T100659)에서 이어집니다. 실행에 앞서 자기 환경과 다른 부분부터 읽어보는 것이 이 집에 들어오는 첫걸음입니다.
