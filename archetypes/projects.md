---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: "One-line pitch — what it does and for whom."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

<!-- Reference implementation: content/projects/entwurf/index.md · live at /projects/entwurf/ -->

{{ "{{< hextra/hero-badge link=\"https://www.npmjs.com/package/@scope/name\" >}}" }}
  npm · @scope/name
{{ "{{< /hextra/hero-badge >}}" }}

<div class="hx-mt-6"></div>

{{ "{{< hextra/hero-headline >}}" }}
Project Name
{{ "{{< /hextra/hero-headline >}}" }}

<div class="hx-mt-6"></div>

{{ "{{< hextra/hero-subtitle >}}" }}
One or two sentences: what problem this solves and the core idea, in plain language.
{{ "{{< /hextra/hero-subtitle >}}" }}

<div class="hx-mt-6 hx-mb-6">
{{ "{{< hextra/hero-button text=\"View on GitHub\" link=\"https://github.com/junghan0611/REPO\" >}}" }}
</div>

## Quick start

```bash
# the one command that gets someone from zero to running
```

One sentence on what that command does.

### How it works

{{ "{{< hextra/feature-grid cols=\"3\" >}}" }}
  {{ "{{< hextra/feature-card" }}
        icon="share"
        title="Concept or verb one"
        subtitle="What it does, in one sentence."
  {{ ">}}" }}
  {{ "{{< hextra/feature-card" }}
        icon="sparkles"
        title="Concept or verb two"
        subtitle="What it does, in one sentence."
  {{ ">}}" }}
  {{ "{{< hextra/feature-card" }}
        icon="refresh"
        title="Concept or verb three"
        subtitle="What it does, in one sentence."
  {{ ">}}" }}
{{ "{{< /hextra/feature-grid >}}" }}

### Stack / compatibility

{{ "{{< hextra/feature-grid cols=\"3\" >}}" }}
  {{ "{{< hextra/feature-card icon=\"puzzle\" title=\"Item one\" subtitle=\"Short note.\" >}}" }}
  {{ "{{< hextra/feature-card icon=\"puzzle\" title=\"Item two\" subtitle=\"Short note.\" >}}" }}
  {{ "{{< hextra/feature-card icon=\"puzzle\" title=\"Item three\" subtitle=\"Short note.\" >}}" }}
{{ "{{< /hextra/feature-grid >}}" }}

<!-- icon names: https://v1.heroicons.com/ (see data/icons.yaml in the hextra module for the exact bundled set) -->

### A closing note or design principle worth naming

One short paragraph — the one idea a reader should leave with.

<div class="hx-mt-6">
{{ "{{< hextra/hero-button text=\"Read the full docs\" link=\"https://github.com/junghan0611/REPO#readme\" >}}" }}
</div>
