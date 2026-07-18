# styles

存放设计令牌、主题和全局样式扩展。

- `tokens.css`：颜色、排版、间距、尺寸、层级和主题变量的唯一来源。
- `materials.css`：Surface、Mist、Glass、Crystal 四级材质的可复用类；不应默认应用到所有组件。
- `motion.css`：时间、缓动、少量动效基础与减少动画支持。
- `components.css`：基础组件与内部设计系统预览的受限样式；只能映射既有令牌和材质，不建立第二套主题或业务样式。
- `layout.css`：全站应用外壳、导航、页脚和 SkipLink 样式；使用既有令牌，正文内容不默认玻璃化。
- `home.css`：正式首页的受限静态视觉样式；仅使用 `.home-*` 命名空间和既有令牌，不影响设计系统预览。
- `projects.css`：Projects 列表、详情与恢复状态的受限静态视觉样式；仅使用 `.projects-*` 命名空间和既有令牌，以 Surface 为主、Mist 为辅助，不使用 Crystal。
- `component-catalog.css`：Components 列表、详情、预览与恢复状态的受限静态视觉样式；仅使用 `.component-catalog-*` 命名空间和既有令牌，以 Surface 为主、Mist 为辅助，Glass 仅用于小型真实预览，不使用 Crystal。
- `guides.css`：Guides 列表、长文详情、代码示例与恢复状态的受限静态视觉样式；仅使用 `.guides-*` 命名空间和既有令牌，正文与代码以 Surface 为主、辅助信息使用 Mist，不使用 Crystal。
- `playground.css`：Playground 编辑区、模板/草稿/分享控制、隔离预览、Console 与状态反馈的受限样式；仅使用 `.playground-*` 命名空间和既有令牌，以 Surface 为主、Mist 用于辅助信息，Glass 仅用于预览边框，不使用 Crystal；长分享 URL 与 Console 仅在自身区域滚动并安全换行。
- `system-pages.css`：全局 404 与错误恢复页的受限样式；仅使用 `.system-page-*` 命名空间和既有令牌，以 Surface 为主，不使用 Crystal，不影响业务模块。

应用全局样式入口保持在 `app/globals.css`；不要把页面、业务组件或第三方预览专属样式集中到此目录，也不要自行重复定义已有令牌。
