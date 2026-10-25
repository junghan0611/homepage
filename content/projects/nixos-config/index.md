---
title: "nixos-config"
description: "A textual operating ground for people and AI: NixOS and home-manager declarations, with explicit boundaries for installation, service operations, and recovery."
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
Ground to stand on when we work together. **An environment kept in readable, repairable text — not left to memory.**
{{< /hextra/hero-subtitle >}}

<div style="margin: 2.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem;">
{{< hextra/hero-button text="Source and scope" link="https://github.com/junghan0611/nixos-config#readme" >}}
{{< hextra/hero-button text="Steward's narrative · 한국어" link="https://notes.junghanacs.com/botlog/20260615T100659" >}}
</div>

## A computer is a workshop we tend together

If every new session must rediscover which tools are installed and where they came from, some of the time a person and an AI have built together is spent guessing at the environment. Yesterday's command points to a different executable today; the difference between a server and a desktop survives only in someone's memory.

nixos-config **keeps the floor of that workshop in declarations**. NixOS describes the operating system; home-manager describes the user environment. Window management, shells, the environment that launches the editor, development tools, and the host boundary of services can be read in one repository. The aim is not to make every computer identical, but to explain why different roles need different configurations.

This is not a distribution anyone can install unchanged. It is the public configuration of an environment GLG actually lives and works in, and a record of repairs made together with agents.

## One store, one list, room for differences

{{< hextra/feature-grid cols="3" >}}
  {{< hextra/feature-card icon="collection" title="What Nix can hold" subtitle="Declare system and user packages and pin their inputs. Keep the origin of a tool and the place to change it traceable." >}}
  {{< hextra/feature-card icon="puzzle" title="One list outside Nix" subtitle="Tools that cannot reasonably live in Nix belong to one external-package script. Files physically outside the Nix store are not presented as fully declarative." >}}
  {{< hextra/feature-card icon="refresh" title="Project-specific differences" subtitle="Use a devShell when a repository truly needs another version. Name the exception rather than quietly replacing a shared tool." >}}
{{< /hextra/feature-grid >}}

These three layers are not a slogan that everything has been put inside Nix. They are an account of **what is controlled where**. External installations still have one inventory; project requirements should not fight the shared environment. Rather than scatter copies of the same tool across repositories, record why a difference is needed.

## Tending takes longer than installing

The Git history begins with the base configuration and cloud and local host setup in October 2025. User environments were subsequently separated into modules. July 2026 brought the [NixOS 26.05 migration and pnpm consolidation](https://github.com/junghan0611/nixos-config/commit/fa52acf), followed by a [single external-package inventory](https://github.com/junghan0611/nixos-config/commit/73f3f83). The direction is fewer installation authorities, not more installation commands.

Keeping services running widened this house's responsibility. It does not reimplement OpenClaw; it owns the host-side disk, container, upgrade, and recovery boundaries around that runtime. In October 2026, [update checks were hardened to fail closed](https://github.com/junghan0611/nixos-config/commit/99487b2): failure to verify must not become permission to proceed as though a check passed.

In [that month's operations record](https://github.com/junghan0611/nixos-config/releases/tag/v2026.10.26), a schema-changing upgrade began by checking in isolation that a recovery copy could be accepted by the previous runtime. We rehearsed the migration on a separate copy, then migrated the original state through its supported procedure rather than overwriting it with the rehearsal state. Reclaiming space followed the same discipline: distinguish original data from regenerable material, then retire only reviewed and approved candidates rather than delete by name or age.

Returning to an earlier operating-system generation does not also roll back an external database or a conversation record. A living process is not proof that a user received a reply. Even after a disabled scheduled task was re-enabled and its failure counter returned to zero, we did not count its recovery as verified until the next scheduled run finished and its result reached the person. **Distinguishing declarations, deployed state, and observed use** is part of the operational craft accumulated here.

{{< callout type="info" >}}
**Public configuration and private live state are different things.** Service definitions and operational lessons can be public; credentials, conversations, and personal workspaces are not material for this page or the public repository. A published file is not itself evidence of what is currently running.
{{< /callout >}}

## A foundation that leaves each house its own work

| House | Responsibility |
|---|---|
| **nixos-config** | NixOS hosts, user environments, package origins, and the ground for operations, recovery, and data retirement |
| [doomemacs-config](https://github.com/junghan0611/doomemacs-config) | How reading, writing, and thinking happen inside the editor |
| [agent-config]({{< relref "/projects/agent-config" >}}) | Shared skills, profiles, and the posture of collaboration |
| [entwurf]({{< relref "/projects/entwurf" >}}) | Visible sibling sessions and connections between harnesses |
| [andenken]({{< relref "/projects/andenken" >}}) | Searchable memory and a path back to original records |
| [openglg-config](https://github.com/junghan0611/openglg-config) | User environments and service definitions portable to non-NixOS hosts |

Installing the editor does not make this repository the owner of its knowledge system. Installing AI tools does not transfer ownership of conversations or memory. This house owns the operating ground and its boundaries. That responsibility does not grant permission to expand deployment, spending, or publication without the person's approval.

## Reproducibility is a way to build trust

Think of a blacksmith's workshop. Tools should become familiar in the hand, but their origins and repair should not be hidden secrets. **Reproducibility is not automation that removes the person from the environment. It is a condition for a person and an AI to inspect the same evidence and repair things together.**

This page is the workshop's front door. The [README](https://github.com/junghan0611/nixos-config#readme) owns setup and current configuration; [AGENTS](https://github.com/junghan0611/nixos-config/blob/main/AGENTS.md) owns operating principles; the [steward's narrative](https://notes.junghanacs.com/botlog/20260615T100659) keeps the developing account of its judgments. Before running anything, begin by reading where your own environment differs.
