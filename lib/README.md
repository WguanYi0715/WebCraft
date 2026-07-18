# lib

`site-config.ts` 是服务端站点基础配置的唯一来源：统一品牌、默认 Metadata、站点 URL、canonical URL 和页面 Metadata。`SITE_URL` 缺失或不是无凭据的 HTTP/HTTPS URL 时会安全回退到 `http://localhost:3000`；部署时必须在服务器环境设置为真实 HTTPS URL。它只供 Metadata、Sitemap 和 Robots 等服务端路径使用，不向客户端暴露。

存放跨模块通用工具、基础配置和共享能力。

仅在至少两个真实使用场景需要共享时放入此处，避免成为无边界的杂项目录。
