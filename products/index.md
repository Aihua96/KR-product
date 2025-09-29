---
title: 产品概览
description: 瞰融信息核心产品一览、功能矩阵、典型场景与部署形态对比。
lastUpdated: true
productMatrixColumns:
  - name
  - positioning
  - scenarios
  - capabilities
  - deploy
  - tags
---

# 产品概览

<div class="page-updated"><Updated /></div>

这里汇总瞰融信息核心产品及入口，便于快速浏览与跳转，并提供功能/场景/部署形态快速对比。

<ProductStatusBar />

## 产品矩阵

<!-- PRODUCT_MATRIX_START -->
<ProductMatrix lang="zh" :columns="['name','positioning','scenarios','capabilities','deploy','tags']" />
<!-- PRODUCT_MATRIX_END -->

<noscript>
<div class="pm-noscript">
<p>（无脚本模式）精简产品表：</p>
<table>
  <thead>
    <tr>
      <th>产品</th>
      <th>定位</th>
      <th>场景</th>
      <th>能力</th>
      <th>部署</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>KRVIRT</td><td>虚拟化与算力抽象</td><td>私有云/算力池</td><td>调度/镜像/网络存储</td><td>独立/与 KRCMP</td></tr>
    <tr><td>KRCMP</td><td>多云统一管理</td><td>混合云治理</td><td>纳管/编排/配额/监控</td><td>控制平面</td></tr>
    <tr><td>KRDesktop</td><td>云桌面交付</td><td>办公/实训/隔离</td><td>协议优化/弹性/策略</td><td>依赖虚拟化</td></tr>
    <tr><td>KRStorage</td><td>存储编排</td><td>聚合/保护</td><td>多协议/监控/快照</td><td>独立/嵌入</td></tr>
  </tbody>
</table>
<p>启用 JavaScript 以获得筛选、标签、导出与排序体验。</p>
</div>
</noscript>

> 后续可添加：性能指标列、许可模式、与第三方生态集成等维度。

## 产品列表（说明版）

### 快速跳转（产品介绍）

- [KRVIRT 虚拟化平台](/products/krvirt)
- [KRCMP 云管理平台](/products/krcmp)
- [KRDesktop 云桌面](/products/krdesktop)
- [KRStorage 存储管理系统](/products/krstorage)

### 快速跳转（帮助中心）

- [KRVIRT 帮助中心](/krvirt/)
- [KRCMP 帮助中心](/krcmp/)
- [KRDesktop 帮助中心](/krdesktop/)
- [KRStorage 帮助中心](/krstorage/)

- **KRVIRT 虚拟化平台**：面向多场景的虚拟化与算力调度能力，提供安装、配置、API 与故障排除文档。
- **KRCMP 云管理平台**：统一多云与资源视图，支持多集群与多云调度。
- **KRDesktop 云桌面**：提供安全、高性能的云桌面交付能力。
- **KRStorage 存储管理系统**：面向块 / 文件 / 对象的统一存储管理与运维能力。

## 典型组合架构（占位）

> 示例：KRCMP 统一纳管 KRVIRT 与容器集群，KRStorage 提供共享持久卷，KRDesktop 复用虚拟化资源池交付桌面。

未来可加入：

- 架构图（SVG / Mermaid）
- 各组件角色说明
- 性能与容量规划参考

<!-- （重复矩阵已移除） -->
