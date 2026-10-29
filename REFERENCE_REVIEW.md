# layuiAdmin 参考检查与 AdminUI 调整

检查日期：2026-10-29。参考目录：`/Users/wangjunyuan/Code/php/test/layuiAdmin-v2.5.2`。

本轮实际检查了以下材料，目的是理解框架组织和交互，AdminUI 不复制其商业源码与资源。

| 检查材料 | 观察 | AdminUI 落地 |
| --- | --- | --- |
| single/res/config.js | views/modules/core 分层，独立视图，pageTabs，主题与请求协议配置 | 库 src、演示 demo、接入 examples 分离；路由与菜单分离；保持不预设后端协议 |
| single/res/json/menu.js | 一级栏目下可嵌套二级和三级 list，包含主页、组件、表单、表格、业务和系统设置等分类 | 独立 AMenu 递归组件；children 树；分组、父节点、叶子节点分别处理 |
| single/res/views/layout.html | 每级选中判断、父项展开、手风琴模式、导航与页面标签联动 | 祖先链自动展开、同层手风琴、完整面包屑、叶子选中、标签联动 |
| single/res/views/component/nav/index.html | 导航本身是可演示组件，有层级、徽标和不同模式 | 增加可独立使用的三级菜单实时示例和配置代码，非静态装饰 |
| single/res/views/user/administrators/list.html | 筛选表单、操作区、数据列表和弹窗组成实际页面 | 保留 AFilterBar + ATable + AForm 业务组合，并提高字号与控件可读性 |
| single/res/adminui/src/css/admin.css | 固定侧栏、逐级缩进、折叠菜单、40px 级标签栏等实用布局 | 252px 侧栏、44px 级菜单行、逐级缩进、折叠后可恢复父菜单、移动抽屉 |
| iframe/tree.txt 与 iframe/res/json/menu.js 路径 | iframe 版同样按核心库、业务视图、模块和演示 JSON 组织 | 当前继续使用 Vue 单页版；不把独立 iframe 多页能力描述为已实现 |

## 修正上一版的问题

- 原来大部分标签、表格和文档正文只有 9–12px，现在按 14–15px 的阅读基线调整。
- 原来只有菜单分组，没有递归菜单；现在组件支持多级子节点，并有实际三级导航可验收。
- 原来的深色文档横幅标题被上游标题颜色覆盖；现在改为明确的浅色文档头部与主题文本颜色。
- 原来宽屏内容无边界，信息散落；现在控制最大行长与网格宽度，并取消为了对齐而拉高的空面板。
- 新增按钮、下拉选择、多级菜单三个专门示例页，现有页面仍保留。

## 边界

这次对齐的是框架的组织与交互能力，不意味着已经具备 layuiAdmin 全部示例、接口模块、上传、登录授权或 iframe 运行模式。当前功能范围与缓存生命周期仍以 README 为准。
