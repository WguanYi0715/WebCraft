# Playground

`features/playground/` 是轻量、浏览器端的代码实验空间，只支持 HTML、CSS 和 JavaScript。编辑草稿留在最小客户端 Workspace 中；用户点击 Run 后才重建预览，避免每次输入刷新 iframe。

当前内置三个可信、原创且没有外部资源的模板：Starter、Interactive Card 与 Form Feedback。选择模板本身不会覆盖编辑器；只有点击 Load template 后才会更新编辑器、预览和本地草稿。

草稿使用版本化 `webcraft.playground.draft.v1` localStorage 记录，只包含 HTML、CSS、JavaScript、更新时间和可选模板标识。字段、总量和分享 hash 都有限制；浏览器存储可能被用户清除或不可用，因此不保证永久保存。Clear Console 只清输出，Reset 恢复并运行 Starter，Clear local draft 只删除该专用存储键且保留当前编辑内容。

分享链接是 URL hash 中的 UTF-8 Base64URL 载荷，只包含版本化源码，不会上传、不会修改当前 URL，也不会自动执行。链接含有完整源码，不适合密码、Token 或私人数据；过大的示例不会生成链接。Clipboard 不可用时，界面会显示只读 URL 供手动复制。合法分享载荷优先于本地草稿，本地草稿优先于默认 Starter；无效分享不会阻止本地草稿恢复。

预览使用 iframe `srcDoc` 和仅含 `allow-scripts` 的 sandbox，不包含 `allow-same-origin`。iframe 文档拥有独立限制性 CSP：禁止网络连接、外部字体、媒体、嵌入页面、对象、表单与外部依赖；用户代码不会注入 WebCraft 主页面 DOM。

Console 来自 iframe 内部监控脚本。父页面接收消息时同时验证 iframe window、固定来源标识、当前 runId、消息类型、等级和受限字段结构；不依赖普通 origin 判断，因为 sandboxed iframe 没有同源权限且通常使用不透明来源。日志会先在 iframe 中安全序列化；注入的序列化函数始终通过显式 `serializeConsoleValue` 变量绑定，因此不依赖生产压缩后的函数自身名称。输出仍受到单条长度、对象深度、集合数量和单次运行 200 条上限约束。Clear Console 只清空当前显示，不会重新运行代码。

当前能显示 `console.log`、`console.info`、`console.warn`、`console.error`、运行时错误和未处理 Promise rejection，但它不是完整浏览器开发者工具。它不能保证捕获浏览器崩溃、无限循环或所有解析级错误。当前不提供云端账户、数据库、公共托管、多文件项目、npm 依赖或 React/Vue 编译。未来扩展不得削弱现有 sandbox、iframe CSP 或手动 Run 边界。
