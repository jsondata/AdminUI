# AdminUI

一个无需 Node/Vite 构建的 Vue 3 后台 UI 库与应用框架。当前版本 **0.2.0**。

使用 Tabler 1.7.0、Element Plus 2.14.7、Vue 3.5.44 的本地浏览器发行版。设计目标类似 layuiAdmin 的“组件 + 后台框架 + 示例 + 文档”组织形式，独立实现，不使用 layuiAdmin 商业源码。依赖许可见 THIRD_PARTY_NOTICES.md。

## 运行

在本目录启动任意静态服务器，例如：

```sh
python3 -m http.server 8300 --bind 127.0.0.1
```

浏览器访问 `http://127.0.0.1:8300/`。不需要 npm install，不需要构建，也没有外部字体或 CDN 请求。

- `index.html`：完整演示站，包含工作台、独立数据报表与页面示例入口。
- `examples/starter.html`：带布局、多标签和路由的最小应用。
- `examples/components.html`：在已有页面中独立使用组件。
- `examples/integration.html`：混用 AdminUI、Vue、Element Plus、Tabler 和本地数据的完整示例。
- `examples/backend.html`：本地模拟登录、401 和上传接入示例；需运行 `python3 examples/mock_server.py`。模拟服务只用于本地开发。
- `docs/组件与接入.md`：组件 API、原生组件混用及业务接入说明。
- `docs/维护与发布.md`：轻量发行、依赖更新和验证流程。
- `examples/pages.html?type=login`、`register`、`403`、`404`、`500`、`502`：独立页面示例。登录和注册只做本地表单校验，需自行接入认证接口；错误页面的 HTTP 状态码和错误路由需由服务器配置。
- `src/admin-ui.js`：12 个组件、工作区导航、请求工具。
- `src/admin-ui.css`：主题变量、组件与响应式布局。
- `demo/`：演示业务代码和样式；`demo/data/` 包含菜单、用户、工作台、报表与图表的本地 JSON；不属于必须复制的库文件。组件中心还包含栅格、表单、日期、弹层、表格、分页、上传、树、穿梭框、颜色、滑块、评分、轮播和加载等交互示例。
- `vendor/`：上游发行文件与许可证。
- `tests/`：无需安装依赖的 Node 回归测试，仅开发验收使用。

## 两种接入方式

### 完整应用框架

HTML 依次加载：

```html
<link rel="stylesheet" href="vendor/tabler/tabler.min.css">
<link rel="stylesheet" href="vendor/element-plus/index.css">
<link rel="stylesheet" href="src/admin-ui.css">
<div id="app" v-cloak></div>
<script src="vendor/vue/vue.global.prod.js"></script>
<script src="vendor/element-plus/index.full.min.js"></script>
<script src="vendor/element-plus/zh-cn.min.js"></script>
<script src="src/admin-ui.js"></script>
```

然后定义页面：

```js
const Home = {
  setup() {
    const workspace = AdminUI.useWorkspace();
    return { workspace };
  },
  template: `<a-panel title="欢迎">
    <el-button @click="workspace.open('/users')">用户管理</el-button>
  </a-panel>`
};
const Users = { template: '<a-page-header title="用户管理" />' };

const admin = AdminUI.createApp({
  brand: { name: 'My Admin', subtitle: 'MY WORKSPACE' },
  user: { name: '管理员', role: '运营' },
  home: '/home',
  storageKey: 'my-app.user-42.workspace',
  routes: [
    { path: '/home', title: '首页', icon: 'grid', component: Home },
    { path: '/users', title: '用户管理', icon: 'users', component: Users }
  ],
  menus: [{ title: '工作空间', items: [
    { path: '/home', title: '首页', icon: 'grid' },
    { path: '/users', title: '用户管理', icon: 'users' }
  ] }]
});
admin.mount('#app');
```

返回 `{ app, workspace, mount }`，可在 mount 前继续向 app 注册业务组件。home 必须存在，route.path 不可重复。

### 仅使用组件

```js
Vue.createApp(MyPage)
  .use(ElementPlus, { locale: ElementPlusLocaleZhCn })
  .use(AdminUI)
  .mount('#app');
```

APanel、AForm、ATable 等可独立使用。ALayout 和 `useWorkspace()` 需要完整应用的工作区上下文。

## 组件 API

所有组件同时支持 PascalCase 与 kebab-case 标签。Element Plus 原生组件仍可直接使用，无需重复封装其全部 API。

| 组件 | Props | 插槽 / 事件 |
| --- | --- | --- |
| AMenu | items、active、collapsed、accordion、label | navigate(path)、expand 事件 |
| ALayout | 读取工作区配置 | default：当前页面内容 |
| APageHeader | title、description、category | default：右侧操作 |
| APanel | title、description | default、actions、footer |
| AStatCard | label、value、change、hint、icon、tone | default：自定义补充内容；tone 支持 blue/teal/purple/orange/red |
| AFilterBar | 无 | default：字段、actions：补充操作；search、reset 事件 |
| ATable | rows、columns、total、page、pageSize、pageSizes、pagerCount、loading、selectable、rowKey | 与列 prop 同名的单元格插槽；update:page、update:pageSize、selection-change、sort-change |
| AEditor | modelValue、options | UEditor Plus 富文本，支持 v-model；ready 事件提供编辑器实例 |
| AForm | model、fields、rules、loading、submitText、labelWidth、tabs | 与字段 key 同名的插槽、actions；submit、cancel 事件 |
| AEmpty | title、description | default：下一步操作 |
| ACode | code、label | 纯文本展示，HTML 不执行；剪贴板受浏览器安全上下文限制 |
| AIcon | name、size | 未知名称显示 grid 图标 |

### 表格

```html
<a-table :rows="rows" :columns="columns" :total="total"
  v-model:page="page" :page-size="10" selectable
  @selection-change="selected = $event">
  <template #status="{ row, value, index }">
    <el-tag>{{ value }}</el-tag>
  </template>
</a-table>
```

columns 为 `{ prop, label, width?, minWidth?, align?, sortable? }[]`。

pagerCount 控制显示的页码按钮数，默认为 7，可设置为 5 至 21 的奇数；页数超过该值时会显示省略号。

rows 应是父页面准备好的当前页数据；ATable 不会再切片一次。使用本地或后端分页均可。rowKey 默认 `id`，真实业务应提供稳定唯一主键。total 未传时隐藏分页栏。传入 pageSizes 数组可显示每页条数选择器，通过 update:pageSize 或 v-model:page-size 同步到父页面。排序可以配置 `sortable: 'custom'` 后监听 sort-change 请求服务器。

### 富文本编辑器

UEditor Plus 4.5.0 已随项目放在 `vendor/ueditor-plus/`。使用 `AEditor` 或 `AForm` 的 `richtext` 字段时，在 AdminUI 脚本之前加载：

```html
<script src="vendor/ueditor-plus/ueditor.config.js"></script>
<script src="vendor/ueditor-plus/ueditor.all.js"></script>
```

```html
<a-editor v-model="html" :options="editorOptions" />
```

或在表单字段中使用 `{ key: 'content', label: '内容', type: 'richtext', full: true }`。`options` 传给 UEditor 实例，`ready` 事件返回实例。默认工具栏包含图片、视频和附件入口，未配置上传服务时会显示提示。可通过 `options.uploadServiceUpload(type, file, callback)` 对接上传服务，调用 `callback.success({state: 'SUCCESS', url, original, title, size, type})` 或 `callback.error(message)`，并可用 `callback.progress(0至1)` 更新进度。演示表单仅将不超过 5 MB 的文件读入浏览器作为临时预览，不会保存到服务器。发布富文本前，业务服务应按自身安全策略处理 HTML。静态示例没有上传或持久化接口。

### 表单

表单默认标签在控件左侧，可用 `label-width` 调整标签宽度；字段默认单列排列。可通过 `tabs: [{name: 'basic', label: '基本信息'}, {name: 'detail', label: '项目详情'}]` 分组，并用字段的 `tab` 指定所属标签；未指定时归入第一个标签，提交校验失败会跳到对应标签。字段可设置 `col: 1` 至 `col: 12`，控制输入区占可用宽度的 1/12 至 12/12；普通字段默认 4，文本域和富文本默认 12。窄容器内自动铺满；日期与数字控件默认最大宽度分别为 240px 和 200px，可通过字段的 `maxWidth`（如 `360` 或 `'360px'`）调整。`full` 控制表单行的占用范围，不覆盖显式 `col`。也可在自己的布局中使用 `.aui-col-1` 至 `.aui-col-12`。

```js
const fields = [
  { key: 'title', label: '标题', col: 4, maxlength: 60 },
  { key: 'type', label: '类型', type: 'select', options: [
    { label: '文章', value: 'article' },
    { label: '图集', value: 'gallery' }
  ] },
  { key: 'enabled', label: '启用', type: 'switch' },
  { key: 'description', label: '说明', type: 'textarea', full: true }
];
const rules = { title: [{ required: true, message: '请填写标题', trigger: 'blur' }] };
```

支持 text/password/textarea/select/number/date/switch，select 可设 multiple，日期使用 YYYY-MM-DD 字符串。复杂字段用具名插槽接入，插槽参数 `{ field, model }`。校验通过才 emit submit，组件不发送请求；loading 由调用方控制，服务端还必须校验。

## 工作区 API 与行为

`AdminUI.useWorkspace()` 返回当前工作区，须在页面 setup 中调用。

- `open(path)`：打开注册的页面；已有标签复用，不重复新增，未注册路由返回 false。
- `close(path | paths[])`：关闭标签；关闭当前页选择相邻标签，全部关闭返回 home，保留空标签栏。
- `closeRange(path, 'left' | 'right' | 'all')`：以指定标签为基准批量关闭。
- `refresh()`：重建当前页面实例。未保存表单会随之重置。
- `toggleTheme()`：切换深浅主题。
- `active`、`opened`、`current`、`tabs`、`collapsed`、`mobileOpen`、`theme` 为 Vue Ref。
- `start()` / `stop()`：注册/释放浏览器事件；createApp 的根组件会自动调用。

Hash 路由与浏览器前进/返回同步，支持 `/projects/:id` 形式的单段参数和查询参数，不依赖 Vue Router。`current.value.params`、`current.value.query` 获取参数；可选 `beforeNavigate(to, from)` 同步返回 false 阻止跳转或关闭当前标签。相同路由不同参数视为不同标签。动态多级通配、异步守卫及重定向未实现。routes 是允许的页面列表，关闭标签不会注销路由。可选 `canAccess(route)` 在工作区创建时筛选路由和内部菜单，详细边界见组件与接入指南。

标签用 sessionStorage 保存，主题用 localStorage 保存。storageKey 必须为不同应用/用户设置独立名称。浏览器存储不可用时退化为当前会话内存状态。

已打开的标签各自缓存页面实例；关闭标签时销毁对应缓存，刷新只重建当前页面。标签数量没有固定上限，打开大量页面会增加内存占用。在业务页面中用 onActivated/onDeactivated 管理轮询、长任务和订阅；机密数据清理与离开确认由业务应用实现。退出账户时应卸载应用并清理其存储键。

## 主题与响应式

覆盖 `:root` 的变量即可定制：

```css
:root {
  --aui-primary: #3265f5;
  --aui-primary-soft: #edf2ff;
  --aui-bg: #f5f7fb;
  --aui-surface: #ffffff;
  --aui-sidebar: #142039;
  --aui-sidebar-width: 236px;
  --aui-radius: 10px;
}
```

深色模式使用 `html.dark` 与 `data-bs-theme="dark"`。手机采用抽屉侧栏；宽屏四列指标卡，中屏两列；表单与仪表板按断点重排。多标签不显示原生滚动条，保留手势滚动与两侧箭头。

图标可用 grid/chart/users/layers/form/settings/book/menu/search/bell/refresh/chevron/arrow/plus/check/close/code/sun/moon/box/download/clock/shield/external。

## 请求工具

```js
const data = await AdminUI.request('/api/users?page=1', {
  timeout: 15000,
  headers: { 'X-CSRF-Token': csrfToken }
});
```

`AdminUI.createRequestClient()` 可选配置请求、响应和错误钩子；详见组件与接入指南。

基于 fetch，默认同源凭据、15 秒超时、JSON 响应。非 2xx 抛出包含状态码的 Error，204 返回 null。`responseType:'text'` 可读取文本。支持调用方 AbortSignal。不会猜测 code/data 等业务协议，也不会自动做身份续期、重试或错误弹窗。

## 验证与边界

```sh
node --test tests/workspace.test.cjs
node --check src/admin-ui.js
node --check demo/pages.js
```

Node 仅用于无依赖测试，不是运行或构建依赖。页面交互仍须浏览器验收。菜单、用户初始数据、工作台、报表和图表示例通过本地 JSON 请求加载。示例用户的新增/编辑/删除仅写当前浏览器 localStorage，已有数据优先于 JSON；“恢复演示数据”会使用 users.json 重置。修改 JSON 后刷新即可；切换到真实接口时需自行处理权限与数据协议。首页部分文案和时间线仍为静态演示。

这是可继续扩展的首版 UI 库，不是完整商业后台产品。没有真实登录、后端授权、支付、服务端上传服务、可视化拖拽表单或多语言业务系统。菜单可见性不构成授权。服务端需实现权限、校验、CSRF 和审计。Vue 浏览器模板编译器需要允许动态函数编译的 CSP；严格禁止 unsafe-eval 的项目应改用预编译方案。代码复制需要 HTTPS 或 localhost；普通 file:// 环境可能受浏览器限制。


## 递归菜单（0.2.0）

菜单使用 `children` 构建树，实际渲染不限制层数；建议业务菜单不超过三级。`group: true` 表示不计入缩进的分组标题，旧的 `items` 子列表仍兼容。内部页面叶子节点的 path 必须在工作区 routes 中注册；独立页面可使用 `href`，需要新标签页时设置 `target: '_blank'`。

```js
menus: [{
  title: '组件与开发', group: true,
  children: [{
    title: '组件中心', icon: 'layers',
    children: [{
      title: '基础组件', icon: 'box',
      children: [
        { title: '按钮', path: '/components/buttons' },
        { title: '下拉选择', path: '/components/selects' }
      ]
    }]
  }]
}]
```

- 父节点展开/收起，叶子节点才触发页面导航。
- 默认 `accordion=true`，打开一个分支会收起同层其他分支；分组标题不互相排斥。
- active 变更、从搜索跳转或刷新页面时，自动展开当前叶子的完整祖先链。
- 当前叶子高亮，祖先颜色强调；完整菜单路径同步显示在面包屑中。
- 手动收起当前分支不会改写 active。结构调整时按新的层级恢复展开状态。
- 折叠侧栏时，点击一级父菜单会先展开侧栏，再展示其子菜单。手机保留抽屉模式与逐级展开。
- 节点可选字段：id、title、icon、badge、path、children、group、spread。spread 表示默认展开。
- 可独立使用 `<a-menu :items="tree" :active="path" :accordion="true" @navigate="path=$event" />`；AMenu 本身不写浏览器地址，也不负责接口权限。
- `AdminUI.findMenuTrail(tree, path)` 返回当前路径的完整节点数组，未匹配返回空数组。

真实交互示例在“组件中心 → 布局与导航 → 多级菜单”；源码位于 `demo/navigation.js`。

## 可读性基线（0.2.0）

正文、表格、按钮为 13px，侧栏菜单为 13px，面板标题为 15px，页面标题为 20px，代码为 13px。修改的是实际组件字号，不依赖浏览器缩放。宽屏内容区域铺满可用宽度，跟随浏览器窗口自适应。小屏只在顶栏显示当前页，完整菜单树保留在抽屉中。

## 组件示例覆盖范围

组件中心中的扩展示例基于 Element Plus 和 AdminUI 本地资源，展示常见交互；上传示例仅选择本地文件，不连接服务。与 layuiAdmin 同名的示例并不代表其所有参数、主题、异步接口或行为都已逐项复刻。具体业务的数据源、鉴权、上传接口和服务端分页需自行接入。


## 补充示例

组件中心现有表格固定列、复杂表头、单选与多选、单元格编辑、接口格式映射和本地分页示例；日期、弹层、图片预览与模拟上传、树搜索、滚动加载、响应式栅格和横向导航也有交互示例。图表页包含 ECharts 折线、面积、柱状、双轴、对数轴、散点及地图。上传和接口分页示例使用浏览器内数据，不连接服务器。地图数据来源和使用边界见 THIRD_PARTY_NOTICES.md。
