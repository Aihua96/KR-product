---
title: Products Overview
description: Overview matrix of Kanrong core products.
lastUpdated: true
productMatrixColumns:
  - name
  - positioning
  - scenarios
  - capabilities
  - deploy
  - tags
---

# Products Overview


This page provides an interactive matrix comparing the core product lines. You can:

- Toggle which attribute rows are visible (left column)
- Filter by tags (multi-select, ANY / ALL modes)
- Keyword search across name / positioning / scenarios / capabilities / deployment / tags / version / status
- Sort products alphabetically (click the left header)
- Export the current view to CSV or Markdown (transposed: fields as rows, products as columns)

Data source: a shared `data/products.json` which is validated during build. The component fetches `/products.json` at runtime.

<!-- PRODUCT_MATRIX_EN_START -->
<ProductMatrix lang="en" :columns="['name','positioning','scenarios','capabilities','deploy','tags']" />
<!-- PRODUCT_MATRIX_EN_END -->

<noscript>
<div class="pm-noscript">
<p>(No JS) Compact product table:</p>
<table>
  <thead>
    <tr>
      <th>Product</th><th>Positioning</th><th>Scenario</th><th>Capability</th><th>Deploy</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>KRVIRT</td><td>Virtualization</td><td>Private cloud</td><td>Sched/Image/Net/Storage</td><td>Standalone/With KRCMP</td></tr>
    <tr><td>KRCMP</td><td>Multi-cloud mgmt</td><td>Hybrid governance</td><td>Onboard/Orchestr/Quota/Mon</td><td>Control plane</td></tr>
    <tr><td>KRDesktop</td><td>Desktop delivery</td><td>Office/Training</td><td>Protocol/Scaling/Policy</td><td>On virtualization</td></tr>
    <tr><td>KRStorage</td><td>Storage orchestration</td><td>Aggregation/Protection</td><td>Multi-proto/Metrics/Snapshot</td><td>Standalone/Embedded</td></tr>
  </tbody>
</table>
<p>Enable JavaScript for filtering, tags, export and sorting features.</p>
</div>
</noscript>

_Translation in progress – content is placeholder; features are fully wired._
