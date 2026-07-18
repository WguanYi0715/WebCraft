# components

存放跨业务复用的基础前端组件，例如通用按钮、输入框和布局原语。

当前基础组件位于 `ui/`：

- `Button`：原生按钮语义、视觉类型、尺寸、禁用与加载状态。
- `Badge`：技术标签、状态与辅助信息，不承担按钮交互职责。
- `Card`：可组合的内容容器，默认使用 Surface；Glass 只能显式选择。
- `Container`：统一内容最大宽度与页面横向安全边距。

全站共享外壳位于 `layout/`：

- `AppShell`：组织 SkipLink、Header、Main 和 Footer。
- `SiteHeader`：使用克制的 Glass 材质，导航由 `lib/navigation.ts` 提供。
- `SiteFooter`：使用低视觉权重的 Surface 材质，只展示已存在页面的必要链接。
- `SkipLink`：让键盘用户直接进入 `main-content`。

普通页面优先使用 Surface，Glass 只用于明确的功能浮层，Crystal 不属于普通组件材质。组件必须复用 `styles/` 中的设计令牌和材质，不得自行创建重复风格。

不要放只服务单一业务领域的组件，也不要在这里放页面或路由逻辑。

`/components` 是面向使用者的正式组件目录，由 `features/component-catalog/` 提供数据、说明和预览；它不替代这里的实现目录。先实现和验证真实的基础组件，再为其创建独立 catalog manifest。
