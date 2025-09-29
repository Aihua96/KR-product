<!-- legacy-anchor -->
<h2 id="overview" style="display:none">overview</h2>
<!-- legacy-anchor -->
<h2 id="core-features-placeholder" style="display:none">core-features-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="architecture-placeholder" style="display:none">architecture-placeholder</h2>
<!-- legacy-anchor -->
<h2 id="licensing-model-placeholder" style="display:none">licensing-model-placeholder</h2>

# KRDesktop Overview

KRDesktop delivers secure, performant virtual desktop & application sessions on top of the shared KRVIRT compute pool. It focuses on rapid provisioning, multimedia / peripheral optimization and centralized policy control for enterprise or education scenarios.

## Positioning
Desktop virtualization & remote workspace delivery leveraging unified infrastructure resources (compute, storage, network) already governed by KRCMP.

## Key Features
| Area | Highlights |
| ---- | ---------- |
| Desktop Pool Management | Pool templates, elastic scale in/out, lifecycle policies |
| Image & Versioning | Golden image pipeline, delta updates, rollback |
| Protocol Optimization | Adaptive bitrate, audio / USB channel optimization |
| Security & Isolation | Session isolation, clipboard / device policy, MFA integration (roadmap) |
| Monitoring | Active session metrics, user session audit trail |

## Architecture (Conceptual)
1. Access Gateway: authentication, protocol negotiation
2. Session Broker: allocation & placement across hosts
3. Image / Template Service: base image version storage
4. Optimized Protocol Stack: streaming + peripheral channels
5. Observability: session events, performance telemetry

## Performance Considerations
- Adaptive codec selection based on latency & bandwidth
- Host resource over‑commit thresholds tuned via feedback loop
- Planned: GPU acceleration awareness & allocation hints

## Integration
- Uses KRVIRT for VM lifecycle & scheduling
- Appears in KRCMP inventory (roadmap) for quota and audit unification
- Can consume KRStorage snapshot / clone for fast desktop template rollouts

## Quick Navigation
<ProductQuickLinks product="krdesktop" />

## Licensing (Placeholder)
Per concurrent desktop session or named user; evaluation mode supports small lab usage.

---
_Future additions: bandwidth sizing guide, GPU profile matrix, hardening checklist._
