---
title: "Clay — Notebook Authoring Rail"
description: "The JVM-side notebook source and its explicit publication boundary."
type: eval
noindex: true
comments: false
toc: false
sidebar:
  exclude: true
runtime: true
eyebrow: "Eval / Clay"
---

Clay is the JVM-side authoring path. Its notebook stays Clojure source; Netlify does not
run Clojure and this release does not commit Clay-rendered document HTML.

## A split receipt

The maintained notebook is
[`dev/eval/clay/notebooks/preface.clj`](https://github.com/junghan0611/homepage/blob/main/dev/eval/clay/notebooks/preface.clj).
It owns the JVM calculation. This page owns only the browser half of the receipt:

{{< eval-cell id="clay-emmy" >}}

## Publication boundary

A future rendered Clay notebook must pass its own release gate: source digest,
self-hosted dependencies, attribution, and stale-output verification. The former Clay
prototype injected CDN assets and contained a longer SICM excerpt, so it is not copied
into the public site.
