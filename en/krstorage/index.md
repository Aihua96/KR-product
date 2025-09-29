<!-- legacy-anchor -->
<h2 id="overview" style="display:none">overview</h2>
<!-- legacy-anchor -->
<h2 id="core-features-placeholder" style="display:none">core-features-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="architecture-placeholder" style="display:none">architecture-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="licensing-model-placeholder" style="display:none">licensing-model-placeholder</h2>

# KRStorage Overview

KRStorage unifies provisioning, lifecycle management and observability for heterogeneous storage backends (block, file – object roadmap) and exposes them as consistent volumes / shares to upper layer platforms.

## Positioning
Acts as a storage orchestration & data services layer supplying capacity, performance insight and snapshot / replica features to KRVIRT, KRDesktop and future container workloads.

## Core Capabilities
| Domain | Capability | Value |
| ------ | ---------- | ----- |
| Backend Aggregation | Multiple vendor / protocol drivers | Avoid lock‑in |
| Provisioning & Policy | Class-based QoS, retention, access modes | Predictable service |
| Snapshot & Clone | Point‑in‑time copy / fast clone | Rapid test & recovery |
| Metrics & Alerts | Capacity, IOPS, latency export | Optimization & planning |
| Data Protection (Roadmap) | Remote replication, backup hooks | Resilience |

## Architecture Overview
1. Driver Interface Layer (adapters for block / file vendors)
2. Core Controller (provisioner, snapshot manager, policy engine)
3. Metadata & Metrics Store
4. API / Integration (REST + future CSI-like interfaces)

## Operations
- Capacity planning dashboard (hot vs cold tiers)
- Policy templates for performance classes
- Periodic snapshot schedules with retention pruning

## Integration Scenarios
- Supplies persistent storage to VMs (via KRVIRT)
- Desktop profile disks & user data (KRDesktop)
- Future: container orchestration persistent volumes

## Quick Navigation
<ProductQuickLinks product="krstorage" />

## Licensing (Placeholder)
Core orchestration (Preview) available under evaluation license; GA will introduce tiered data services add‑ons.

---
_Planned enhancements: replication topology diagram, performance benchmark tables, backup integration examples._
