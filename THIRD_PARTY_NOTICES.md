# 第三方依赖

本项目使用本地浏览器发行版，不从 CDN 动态下载。

| 依赖 | 本地核对版本 | 用途 | 许可证 |
| --- | --- | --- | --- |
| Tabler | 1.7.0 | 布局基础、工具类和视觉底层 | vendor/tabler/LICENSE（MIT） |
| Element Plus | 2.14.7 | 表单、选择器、表格、弹层和反馈组件 | vendor/element-plus/LICENSE（MIT） |
| UEditor Plus | 4.5.0 | 富文本编辑器 | vendor/ueditor-plus/LICENSE（Apache-2.0） |
| Apache ECharts | 5.6.0 | 图表示例 | vendor/echarts/LICENSE（Apache-2.0） |
| Vue | 3.5.44 | 浏览器运行时与模板编译器 | vendor/vue/LICENSE（MIT） |

版本来自本地发行文件头，并非“最新版”声明。vendor 下保留原始发行文件及许可证；更新依赖后须重新验收。Tabler 的 JS 文件为完整上游包的一部分，演示站不加载它，避免其交互逻辑与 Vue 重叠。

layuiAdmin 2.5.2 仅用于理解后台框架的组织与使用场景；本项目没有复制其源码、样式、图标或商业资源，也不依赖 layui。AdminUI 自身源码采用根目录 LICENSE 中的 MIT 许可，第三方依赖遵循各自许可证。

UEditor Plus 从 GegeCMS 本地发行包复制，包含已有 CSP 兼容补丁；详见 `vendor/ueditor-plus/LOCAL_PATCHES.md`。

图表示例地图数据：`vendor/echarts/maps/china.json` 来自阿里云 DataV 地理数据接口（https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json），`world.json` 来自 Apache ECharts 网站示例数据（https://github.com/apache/echarts-website/tree/asf-site/examples/data/asset/geo）。两份数据仅用于演示，使用或发布前应核实数据来源、使用条款及边界适用性。
