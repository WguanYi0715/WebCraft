# features

按业务领域组织前端或全栈功能模块。

功能专属组件、类型、状态和测试应优先贴近所属模块；跨业务复用后再考虑提升到共享目录。

当前正式首页位于 `home/`。首页专属内容和组件不得进入全局 `components/ui/`；Hero 仅使用一次 Crystal 品牌视觉。`projects/` 是第一个正式业务模块，集中保存来源 manifest、适配器、统一项目模型、注册表、查询工具与业务组件。页面只能读取标准 `Project` 输出，不得读取 manifest 或未来的外部来源格式。

`component-catalog/` 维护面向使用者的组件目录。`components/ui/` 仍是基础组件的真实实现位置；每个已实现并验证的组件通过独立 `ComponentManifest` 和 Local Adapter 进入标准 `Component` 模型，目录页面不得读取 manifest。`/design-system` 保留内部设计系统预览，`/components` 提供组件的正式说明、限制、可访问性信息和真实静态预览。

`guides/` 保存本地可信的结构化开发指南。`GuideManifest` 是作者维护的正文与来源事实，Local Adapter 将其转换为页面唯一消费的 `Guide` 模型；每篇新指南必须创建独立 manifest，页面不得直接读取 manifest。当前不支持任意 Markdown、HTML、代码执行或外部文章；未来外部内容必须先完成服务端验证与适配。

`playground/` 提供浏览器端 HTML、CSS 与 JavaScript 实验空间。只有 `playground-workspace.tsx` 管理编辑草稿、手动 Run/Reset 与当前 Console；iframe 内部监控脚本通过受验证的 `postMessage` 回传受限日志、运行时错误与未处理 Promise rejection。预览使用不含 `allow-same-origin` 的 sandboxed `srcDoc` iframe，并以内部 CSP 禁止网络请求和外部依赖。当前不提供持久化、分享、完整开发者工具、框架编译或服务端执行。

Projects、Components、Guides 与 Playground 已拥有真实路由，因此首页为四个 Pillar 提供链接。首页、Projects、Components 与 Guides 保持服务端兼容；Playground 仅在 Workspace 内使用必要客户端状态。
