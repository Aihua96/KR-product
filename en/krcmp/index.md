<!-- legacy-anchor -->
<h2 id="overview" style="display:none">overview</h2>
<!-- legacy-anchor -->
<h2 id="core-features-placeholder" style="display:none">core-features-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="architecture-placeholder" style="display:none">architecture-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="licensing-model-placeholder" style="display:none">licensing-model-placeholder</h2>

# KRCMP Overview

KRCMP (KR Cloud Management Platform) provides a unified governance plane for multiple clusters (virtualization, container and future bare‑metal resources). It standardizes resource views, quota enforcement, multi‑tenant isolation and observability across heterogeneous infrastructure.

## Positioning
Acts as a control plane above KRVIRT / Kubernetes / storage services, offering consolidated inventory, policy orchestration and cost visibility.

## Core Capabilities
| Domain | Capability | Value |
| ------ | ---------- | ----- |
| Multi‑Cluster Onboarding | Agent / API driven registration | Fast expansion |
| Resource & Namespace Model | Unified abstraction for VMs, pods, storage | Consistent operations |
| Quota & Policy | Multi‑tenant RBAC + (planned) ABAC expressions | Isolation & governance |
| Events & Monitoring | Aggregated metric & event stream | Central troubleshooting |
| Cost & Utilization (Roadmap) | Normalized usage records, export | Chargeback / showback |

## High Level Architecture
1. Ingestion Layer: cluster connector agents & API importers
2. Core Services: identity, quota engine, policy evaluator, event bus
3. Data Services: metrics store, inventory DB, cost aggregation (planned)
4. Experience Layer: web console, OpenAPI, CLI

## Tenant & Security Model
- Hierarchical projects / namespaces
- Role templates + fine‑grained permissions
- Planned: attribute based policy overlays & audit export sink

## Integration Paths
- Consumes KRVIRT inventory to expose virtualization resources
- Surfaces KRStorage capacity & snapshot metrics
- Provides unified entry for KRDesktop workspace provisioning (future)

## Roadmap Snapshot
- Beta (v0.9): multi‑cluster registration, core inventory, basic quota
- GA Target: cost model, advanced policy, SSO federation

## Quick Navigation
<ProductQuickLinks product="krcmp" />

## Licensing (Placeholder)
Enterprise subscription aligned with managed resource count; free tier for lab scale evaluation.

---
_Additional diagrams, SLA definitions and API examples forthcoming._
