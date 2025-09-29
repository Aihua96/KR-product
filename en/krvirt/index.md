<!-- legacy-anchor -->
<h2 id="overview" style="display:none">overview</h2>
<!-- legacy-anchor -->
<h2 id="core-features-placeholder" style="display:none">core-features-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="architecture-placeholder" style="display:none">architecture-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="licensing-model-placeholder" style="display:none">licensing-model-placeholder</h2>

# KRVIRT Overview

KRVIRT is a server virtualization & compute abstraction platform designed for secure, compliant private / hybrid cloud scenarios. It consolidates heterogeneous physical resources into elastic pools and exposes a programmable interface for higher‑level platforms or automation.

## Positioning
KRVIRT focuses on high‑performance virtualization, image lifecycle management, storage / network integration and resource scheduling required by data center modernization and domestic (xinchuang) compliance initiatives.

## Core Features
| Area | Highlights |
| ---- | ---------- |
| Compute Scheduling | NUMA / CPU pinning, over‑commit policies, affinity & anti‑affinity rules |
| Image & Template | Layered base images, template cloning, version tagging |
| Storage Integration | Pluggable backends (block / file), snapshot & clone workflow |
| Network | Multi‑network attachment, security group & isolation constructs |
| Observability | VM lifecycle events, metrics export, audit logging |
| API & Extensibility | REST / (planned) OpenAPI spec, future webhook & operator hooks |

## Typical Architecture
Logical layers:
1. Resource Layer: physical hosts, storage backends, network fabric
2. Virtualization Control: hypervisor management, scheduling, image service
3. Platform Services: API gateway, authN/Z, metering, events
4. Consumer Layer: portal / higher cloud management (e.g., KRCMP) / automation pipelines

```
 [Automation / Portal]
	   |
   [API & Auth Layer]
	   |
 [Scheduler] --- [Image Service] --- [Metrics/Audit]
     |                  |                 |
  [Hypervisors / Hosts]---[Storage Backends]---[Networks]
```

## Lifecycle & Versioning
Current public version: v1.3 (GA). Minor releases deliver incremental scheduling optimizations and security hardening; patch releases focus on CVE remediation & stability. Preview features are guarded by flags and excluded from default SLAs.

## Security & Compliance (Summary)
- Isolation via namespace & cgroup boundaries
- Image provenance & digest verification
- Auditable event log (create / modify / delete VM, policy changes)
- Planned: attestation & integrity scanning pipeline

## Integration Scenarios
- Unified management with KRCMP for multi‑cloud governance
- Upstream consumption by desktop delivery (KRDesktop) leveraging the same resource pool
- Storage orchestration synergy with KRStorage snapshot / replica features

## Quick Navigation
<ProductQuickLinks product="krvirt" />

## Licensing Model (Placeholder)
Enterprise subscription with per‑CPU socket or per‑core options (final model TBD). Evaluation builds available for POC environments.

---
_This English page will evolve; architecture diagram and performance benchmarks to be added in future iterations._
