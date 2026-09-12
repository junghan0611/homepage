---
title: "SICM — 실행되는 읽기판"
description: "서문과 제1장 영어 원문·한국어 번역, 고정된 소스와 계산에서 다시 그린 뷰."
type: eval
translationKey: "sicm-index"
noindex: true
comments: false
toc: false
sidebar:
  exclude: true
runtime: true
eyebrow: "Eval / SICM 읽기판"
---

*Structure and Interpretation of Classical Mechanics*의 중심 주장을 브라우저에서
실행하며 읽습니다. 첫 공개 범위는 **서문과 제1장 전체**의 영어 원문 및 한국어
읽기 번역입니다.

- [서문 — 한국어 읽기 번역](/ko/eval/sicm/preface/)
- [제1장: 라그랑주 역학 — 한국어 읽기 번역](/ko/eval/sicm/chapter-1/)
- [English source text](/eval/sicm/)

각 읽기 페이지는 정확한 upstream revision을 밝히고 대응하는 Org 소스와 adaptation
상태를 공개합니다. 원문, 번역, Homepage의 계산은 서로 다른 증거 층입니다.

## 한 문장, 하나의 계산

> “고전역학은 기만적으로 단순하다.”
>
> — Gerald Jay Sussman·Jack Wisdom, *Structure and Interpretation of Classical
> Mechanics*, 제2판

{{< eval-cell id="sicm-harmonic" >}}

`m = k = 1`이고 경로가 `q = cos(t)`일 때 오일러–라그랑주 잔차는 정확히 0입니다.
제1장은 이 스칼라 영수증에서 출발해 Figure 1.1을 계산으로 다시 그린 뷰로 이어집니다.

{{< eval-attribution rail="sicm" >}}
