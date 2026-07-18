# Components catalog

`components/ui/` 是 WebCraft 基础组件的真实实现位置；本模块不复制或替代这些组件。它为已实现且已验证的组件提供正式目录数据、说明、静态真实预览和路由。

- `contracts/component-manifest.ts` 定义人工维护的可信来源清单 `ComponentManifest`。
- `types.ts` 定义页面和业务组件唯一消费的标准 `Component` 模型。
- `data/manifests/` 为每个组件保留独立 manifest，`data/components.ts` 经 Local Adapter 注册只读集合。
- `adapters/local-component-adapter.ts` 复制来源事实与数组，避免页面共享可变来源引用。

新增组件时，先在 `components/ui/` 实现并验证真实契约；随后创建独立 manifest，通过 Local Adapter 加入注册表，并为可实际渲染的组件补充静态预览。页面和业务组件只能读取标准 `Component`，不得直接导入 manifest。未来外部来源若确有需要，必须先经专属适配器和服务端运行时验证后再转换为标准模型。

`/design-system` 用于内部设计系统预览；`/components` 用于向使用者说明实际组件的能力、限制与可访问性。目录不提供复制代码、安装命令或不存在的 API，也不把不存在的操作显示为占位内容。
