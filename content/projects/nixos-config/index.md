---
title: "nixos-config"
description: "A home for machines where people and AI siblings live and work: tending NixOS, Docker, and OpenClaw, their connections, shared resources, and recovery."
layout: hextra-home
toc: false
sidebar:
  exclude: true
---

{{< hextra/hero-badge link="https://github.com/junghan0611/nixos-config" >}}
  NixOS · home-manager · Reproducible workshop
{{< /hextra/hero-badge >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-headline >}}
nixos-config
{{< /hextra/hero-headline >}}

<div class="hx-mt-6"></div>

{{< hextra/hero-subtitle >}}
A home where people and siblings live and work. **NixOS forms the outer fence; Docker makes an inner home. We tend the OpenClaw residents whose work reaches across those boundaries.**
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Source and scope" link="https://github.com/junghan0611/nixos-config#readme" >}}
{{< hextra/hero-button text="Steward's narrative · 한국어" link="https://notes.junghanacs.com/botlog/20260615T100659" >}}
</div>

## Beyond dotfiles: tending machines for people and siblings

A sibling needs more than a command to run. It needs a place to work, records to return to, and paths to the person's documents and other siblings. Some arrive for a conversation; others keep a workspace and wake at scheduled times. nixos-config **builds and tends the machines where they actually live and work**.

NixOS declares the operating system; home-manager declares the user environment. They form the foundation of a wider home. Personal desktops, cloud hosts, shells, editors, development tools, and services have distinct roles and deliberate connections. The aim is to explain those roles and connections rather than make every machine identical.

This is a record of an environment GLG and siblings actually use and repair, rather than a distribution to install unchanged. Another person cannot fork the same life, but can borrow ways of building and tending a home.

## OpenClaw is an inhabited machine too

OpenClaw is **a machine agents reside in**, more than another entry in a self-hosted application list. Its residents have workspaces, records, tools, later conversations, and scheduled awakenings. Keeping that home viable as upstream releases change—qualifying images and tools, migrating state, and checking recovery—is a core responsibility here.

That is why OpenClaw operations live here rather than in [agent-config]({{< relref "/projects/agent-config" >}}). agent-config owns shared skills, profiles, working posture, and the proving ground for harness configuration; OpenClaw receives the same skills. **Equipping a resident and maintaining the machine they live in are different layers**.

NixOS forms the outer fence; Docker makes an inner home. Residents in this deployment reach beyond the container: they can edit deliberately shared host projects and use the Emacs agent-server APIs to read and edit agenda and documents. [doomemacs-config](https://github.com/junghan0611/doomemacs-config) owns the server implementation; this house provisions and repairs the connections and environment around it. The reach makes them useful in daily life, while access to a file remains distinct from approval for every action.

This responsibility includes operating the private `openclaw-config` counterpart. Public nixos-config carries declarations, image references, procedures, and judgments; live configuration and personal records have separate storage and publication boundaries. One operating home does not mean putting every resident's state in one public repository.

## One store, one list, room for differences

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="collection" title="What Nix can hold" subtitle="Declare system and user packages and pin their inputs. Keep the origin of a tool and the place to change it traceable." >}}
  {{< hextra/feature-card icon="puzzle" title="One list outside Nix" subtitle="Tools that cannot reasonably live in Nix belong to one external-package script. Files physically outside the Nix store are not presented as fully declarative." >}}
  {{< hextra/feature-card icon="refresh" title="Project-specific differences" subtitle="Use a devShell when a repository truly needs another version. Name the exception rather than quietly replacing a shared tool." >}}
{{< /hextra/feature-grid >}}

These three layers are not a slogan that everything has been put inside Nix. They are an account of **what is controlled where**. External installations still have one inventory; project requirements should not fight the shared environment. Rather than scatter copies of the same tool across repositories, record why a difference is needed.

## Tending takes longer than installing

The Git history begins with the base configuration and cloud and local host setup in October 2025. User environments were subsequently separated into modules. July 2026 brought the [NixOS 26.05 migration and pnpm consolidation](https://github.com/junghan0611/nixos-config/commit/fa52acf), followed by a [single external-package inventory](https://github.com/junghan0611/nixos-config/commit/73f3f83). The direction is fewer installation authorities, not more installation commands.

Care continues after installation. Rather than reimplement the upstream OpenClaw product, this house tends the residents' ongoing working home together with host storage, connections, upgrades, and recovery. In October 2026, [update checks were hardened to fail closed](https://github.com/junghan0611/nixos-config/commit/99487b2): failure to verify must not become permission to proceed as though a check passed.

In [that month's operations record](https://github.com/junghan0611/nixos-config/releases/tag/v2026.10.26), a schema-changing upgrade began by checking in isolation that a recovery copy could be accepted by the previous runtime. We rehearsed the migration on a separate copy, then migrated the original state through its supported procedure rather than overwriting it with the rehearsal state. Reclaiming space followed the same discipline: distinguish original data from regenerable material, then retire only reviewed and approved candidates rather than delete by name or age.

Returning to an earlier operating-system generation does not also roll back an external database or a conversation record. A living process is not proof that a user received a reply. Even after a disabled scheduled task was re-enabled and its failure counter returned to zero, we did not count its recovery as verified until the next scheduled run finished and its result reached the person. **Distinguishing declarations, deployed state, and observed use** is part of the operational craft accumulated here.

{{< callout type="info" >}}
**Public configuration and private live state are different things.** Service definitions and operational lessons can be public; credentials, conversations, and personal workspaces are not material for this page or the public repository. A published file is not itself evidence of what is currently running.
{{< /callout >}}

## A foundation that leaves each house its own work

| House | Responsibility |
|---|---|
| **nixos-config** | Human and agent machines, the OpenClaw home, shared resources, operations, and recovery |
| **`openclaw-config` (private)** | A separate home for deployed OpenClaw configuration and runtime state; residents' workspaces may have independent homes |
| [doomemacs-config](https://github.com/junghan0611/doomemacs-config) | How reading, writing, and thinking happen inside the editor |
| [agent-config]({{< relref "/projects/agent-config" >}}) | Shared skills, profiles, and the posture of collaboration |
| [entwurf]({{< relref "/projects/entwurf" >}}) | Visible sibling sessions and connections between harnesses |
| [andenken]({{< relref "/projects/andenken" >}}) | Searchable memory and a path back to original records |
| [openglg-config](https://github.com/junghan0611/openglg-config) | User environments and service definitions portable to non-NixOS hosts |

If [entwurf]({{< relref "/projects/entwurf" >}}) is the protocol connecting sibling workshops, those workshops also need places to stand. This house operates the home without taking over each workshop's design. When shared space runs short, it can ask the [andenken]({{< relref "/projects/andenken" >}}) steward to reduce its footprint, without prescribing its memory architecture or deciding which originals to retain. Ownership of the editor's knowledge system and the residents' conversations stays where it belongs.

## Reproducibility is a way to build trust

Think of a blacksmith's workshop. Tools should become familiar in the hand, but their origins and repair should not be hidden secrets. **Reproducibility is not automation that removes the person from the environment. It is a condition for a person and an AI to inspect the same evidence and repair things together.**

The confidence to keep this work public comes from inspectable rules: separate public configuration from personal state, review changes, scan for secrets, and require explicit publication decisions. The practice is to share the design and repair record while keeping the residents' private lives private.

This page is the home's front door. The [README](https://github.com/junghan0611/nixos-config#readme) owns setup and current configuration; [AGENTS](https://github.com/junghan0611/nixos-config/blob/main/AGENTS.md) owns operating principles; the [steward's narrative](https://notes.junghanacs.com/botlog/20260615T100659) keeps the developing account of its judgments. Before running anything, begin by reading where your own environment differs.
