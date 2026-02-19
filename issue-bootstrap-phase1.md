## 背景
我们要建设一个基于 `shadcn + Base UI` 的可复用前端模块仓库，目标是让使用者可以通过 `shadcn add` 直接安装 block/template 到自己的项目中。

## Deep Research 结论（工程最佳实践）
1. `shadcn` 的可分发模式应基于 **Registry**，并生成静态可访问 JSON（`shadcn build` 输出到 `public/r`）。
2. Registry 根配置与每个 item 需要严格遵循 schema（`registry.json` / `registry-item.json`），避免 CLI 安装失败。
3. item 级别应显式声明 `dependencies` / `devDependencies` / `registryDependencies`，保证安装可重现。
4. 建议从 Day 1 支持 `namespace`（`shadcn add @namespace/item`），后续便于多团队/多产品线扩展。
5. 若未来提供私有 blocks，需要使用私有 registry + `shadcn login` 授权流，提前在架构中预留。
6. Base UI 适合做“行为与可访问性底座”（unstyled/headless），外层再接 shadcn 风格层，以保证可定制和可访问性。
7. 版本管理应采用 `SemVer + Changesets`，并在 monorepo 中使用 `pnpm workspace` 保证本地联调和依赖一致性。
8. npm 包（若提供辅助包）应使用 `package.json#exports` 限制公开入口，减少破坏性升级风险。

## Phase 1 目标（先把“可安装、可验证、可发布”跑通）
- 建立 monorepo 基线（`pnpm workspace`）。
- 搭建 shadcn registry 工程并能生成、托管、被 CLI 安装。
- 交付第一批可复用 blocks/templates（最小 6 个，覆盖 3 类场景）。
- 建立质量门禁（lint/typecheck/test/install-smoke）。
- 建立版本与发布流水线（changesets + changelog + 静态产物发布）。

## 执行拆解
### 1) 工程初始化
- [ ] 初始化 `pnpm-workspace.yaml`。
- [ ] 建立目录：
  - [ ] `apps/registry`（文档站点 + registry 静态产物托管）
  - [ ] `packages/blocks`（block/template 源码）
  - [ ] `packages/config`（eslint/tsconfig/tailwind 共享配置，可选）
- [ ] 统一脚本：`dev`, `build`, `lint`, `typecheck`, `test`, `build:registry`。

### 2) Registry 基础设施
- [ ] 新建 `registry.json`，定义基础 metadata 与分类。
- [ ] 建立至少 6 个 `registry-item.json`，每个 item 完整声明依赖与文件映射。
- [ ] 跑通 `shadcn build`，确保生成 `public/r`。
- [ ] 本地验证 `shadcn add <registry-url>/<item>.json` 可安装。
- [ ] 预留 namespace 结构（如 `@frontend-template-blocks/...`）。

### 3) Block/Template 设计约束
- [ ] 每个 block 必须：
  - [ ] 暴露清晰 props API（最小必要参数）
  - [ ] 默认无业务耦合（无硬编码接口/域模型）
  - [ ] 提供可访问性说明（键盘操作、ARIA、焦点管理）
  - [ ] 支持主题 token（不硬编码品牌颜色）
- [ ] Base UI 仅承担交互行为层；视觉层通过 shadcn/tailwind token 化。

### 4) 质量与回归
- [ ] lint + typecheck 作为 PR 必过门禁。
- [ ] 为每个 block 提供至少一个渲染/交互测试。
- [ ] 新增 install smoke test：在临时示例工程中执行 `shadcn add` 并验证构建通过。
- [ ] 建立向后兼容检查（删除/重命名 item 需显式记录 breaking change）。

### 5) 发布与版本
- [ ] 接入 Changesets，按 SemVer 自动计算版本与 changelog。
- [ ] 发布策略：
  - [ ] registry 静态 JSON 部署到稳定 URL（Vercel 或 GitHub Pages）
  - [ ] 可选 npm 辅助包按 `exports` 管控入口
- [ ] 文档补齐：安装方式、版本策略、迁移说明。

## Definition of Done
- [ ] 外部空项目可通过 `shadcn add` 成功安装任一 block。
- [ ] 6 个 blocks/templates 在 React 18+ 下可运行，且通过 lint/typecheck/test。
- [ ] 产物 URL 稳定可访问，registry schema 校验通过。
- [ ] 至少 1 次 changeset 发布流程在 CI 跑通。
- [ ] README 提供 10 分钟内可完成的接入路径。

## 风险与应对
- 风险：schema 漂移导致 CLI 安装失败。
  - 应对：增加 schema 校验 + install smoke test。
- 风险：block 与业务代码耦合，复用性下降。
  - 应对：引入“无业务耦合”审核清单和 PR 模板。
- 风险：版本不透明导致升级成本高。
  - 应对：强制 changesets，严格区分 major/minor/patch。

## 参考（Primary Sources）
- shadcn Registry Docs: https://ui.shadcn.com/docs/registry
- shadcn Registry Getting Started: https://ui.shadcn.com/docs/registry/getting-started
- shadcn Registry JSON: https://ui.shadcn.com/docs/registry/registry-json
- shadcn Registry Item JSON: https://ui.shadcn.com/docs/registry/registry-item-json
- shadcn Registry Namespace: https://ui.shadcn.com/docs/registry/namespace
- shadcn Private Registries: https://ui.shadcn.com/docs/registry/private
- Base UI Overview/Quick Start: https://base-ui.com/react/overview/quick-start
- Base UI Comparison: https://base-ui.com/react/overview/comparison
- Base UI Accessibility: https://base-ui.com/react/overview/accessibility
- npm package.json exports: https://docs.npmjs.com/cli/v11/configuring-npm/package-json#exports
- SemVer: https://semver.org/
- pnpm Workspaces: https://pnpm.io/workspaces
- Changesets: https://github.com/changesets/changesets
