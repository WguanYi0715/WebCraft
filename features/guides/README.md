# Guides

`features/guides/` 提供本地可信的结构化开发指南。它不是 MDX、CMS 或在线编辑器：当前正文只来自源码中的独立 manifest，并以静态、服务端兼容页面展示。

- `contracts/guide-manifest.ts` 定义作者维护的可信来源 `GuideManifest`。
- `types.ts` 定义页面和业务组件唯一消费的标准 `Guide` 模型。
- `data/manifests/` 为每篇指南保留独立正文，`data/guides.ts` 通过 Local Adapter 注册只读集合。
- `adapters/local-guide-adapter.ts` 克隆数组、章节和代码示例，避免页面共享可变来源引用。

新增指南时，创建独立 manifest，通过 Local Adapter 加入注册表，并补充与数据边界、路由和正文结构相符的测试。页面和业务组件不得直接读取 manifest。未来外部内容必须先在服务端完成运行时验证与专属适配，才能转换为标准 `Guide`。

当前不支持任意 Markdown、HTML 或代码执行。代码示例只是可信本地字符串，以语义化 `<pre><code>` 静态展示；没有在线编辑、复制、语法高亮或执行能力。
