/* 应用内 API 文档；AdminUI 封装组件可按需使用。 */
(function () {
    const components = [
        {
            id: 'ALayout',
            title: '布局 ALayout',
            desc: '完整后台外壳，包含侧栏、顶栏、标签页和主题。',
            note: '由 createApp 自动提供工作区上下文，通常不需要单独使用。',
            props: [],
            slots: [['default', '当前页面内容']],
            events: [],
            code: `const admin = AdminUI.createApp({
  home: '/home', storageKey: 'my-app.workspace',
  routes: [{ path: '/home', title: '首页', component: Home }],
  menus: [{ title: '首页', path: '/home', icon: 'home' }]
});
admin.mount('#app');`,
        },
        {
            id: 'AMenu',
            title: '菜单 AMenu',
            desc: '递归菜单，支持祖先展开、手风琴和独立使用。',
            note: '内部叶子节点的 path 需在工作区 routes 中注册；独立菜单只发出 navigate 事件，不修改地址。',
            props: [
                ['items', 'Array', '[]', '菜单树；子节点使用 children 或 items'],
                ['active', 'String', '—', '当前选中路径'],
                ['collapsed', 'Boolean', 'false', '折叠状态'],
                ['accordion', 'Boolean', 'true', '同层手风琴'],
                ['label', 'String', '主导航', '导航的无障碍名称'],
            ],
            slots: [],
            events: [
                ['navigate', 'path', '点击内部叶子节点'],
                ['expand', '—', '折叠时请求展开侧栏'],
            ],
            code: `const items = [{ title: '管理', icon: 'users', children: [
  { title: '用户列表', path: '/users' },
  { title: '项目列表', path: '/projects' }
]}];

<a-menu :items="items" :active="active" @navigate="active = $event" />`,
        },
        {
            id: 'APageHeader',
            title: '页面标题 APageHeader',
            desc: '页面标题、分类、说明和操作区。',
            props: [
                ['title', 'String', '—', '页面标题'],
                ['description', 'String', '—', '说明'],
                ['category', 'String', '—', '分类标签'],
            ],
            slots: [['default', '右侧操作']],
            events: [],
            code: `<a-page-header title="用户管理" category="业务示例" description="管理用户">
  <el-button type="primary">新增</el-button>
</a-page-header>`,
        },
        {
            id: 'APanel',
            title: '面板 APanel',
            desc: '将标题、操作、内容和底部说明组织在一起。',
            props: [
                ['title', 'String', '—', '面板标题'],
                ['description', 'String', '—', '标题下的说明'],
            ],
            slots: [
                ['default', '面板正文'],
                ['actions', '标题右侧操作'],
                ['footer', '面板底部'],
            ],
            events: [],
            code: `<a-panel title="用户列表" description="最近更新">
  <template #actions><el-button>导出</el-button></template>
  面板内容
  <template #footer>数据说明</template>
</a-panel>`,
        },
        {
            id: 'AStatCard',
            title: '统计卡片 AStatCard',
            desc: '展示一项指标及变化信息。',
            props: [
                ['label', 'String', '—', '指标名称'],
                ['value', 'String / Number', '—', '指标值'],
                ['change', 'String', '—', '变化值'],
                ['hint', 'String', '—', '补充说明'],
                ['icon', 'String', 'chart', '图标名称'],
                ['tone', 'String', 'blue', 'blue / teal / purple / orange / red'],
            ],
            slots: [['default', '自定义补充内容']],
            events: [],
            code: `<a-stat-card label="访问量" value="12,840" change="+8%"
  hint="较上周" icon="chart" tone="teal" />`,
        },
        {
            id: 'AFilterBar',
            title: '筛选栏 AFilterBar',
            desc: '为查询与重置提供一致的布局。',
            note: '组件只触发事件，筛选状态、重置逻辑和请求由页面负责。',
            props: [],
            slots: [
                ['default', '筛选字段'],
                ['actions', '附加操作'],
            ],
            events: [
                ['search', '—', '提交查询'],
                ['reset', '—', '点击重置'],
            ],
            code: `<a-filter-bar @search="search" @reset="reset">
  <div><label for="keyword">关键词</label>
    <el-input id="keyword" v-model="keyword" clearable />
  </div>
  <template #actions><el-button>更多</el-button></template>
</a-filter-bar>`,
        },
        {
            id: 'ATable',
            title: '表格 ATable',
            desc: '配置列、选择行、自定义单元格与分页。',
            note: 'rows 应是当前页数据，组件不会再次切片。复杂表头、固定列等需求可直接使用 Element Plus 原生 el-table。',
            props: [
                ['rows', 'Array', '[]', '当前页数据'],
                ['columns', 'Array', '[]', '列配置：prop、label、width、minWidth、align、sortable'],
                ['total', 'Number', '—', '总数；不传时隐藏分页'],
                ['page', 'Number', '1', '当前页'],
                ['pageSize', 'Number', '10', '每页条数'],
                ['pageSizes', 'Array', '[]', '可选条数；非空时显示选择器'],
                ['pagerCount', 'Number', '7', '页码按钮数量；5–21 的奇数'],
                ['loading', 'Boolean', 'false', '加载状态'],
                ['selectable', 'Boolean', 'false', '显示多选列'],
                ['rowKey', 'String', 'id', '稳定唯一的行键'],
            ],
            slots: [['列 prop 对应名称', '参数 { row, value, index }']],
            events: [
                ['update:page', 'page', '页码变化'],
                ['update:pageSize', 'size', '每页条数变化'],
                ['selection-change', 'rows', '选中项变化'],
                ['sort-change', 'event', '排序变化'],
            ],
            code: `const columns = [
  { prop: 'name', label: '名称', minWidth: 180 },
  { prop: 'status', label: '状态' }
];

<a-table :rows="rows" :columns="columns" :total="total"
  v-model:page="page" v-model:page-size="pageSize"
  :page-sizes="[2, 3]" selectable>
  <template #status="{ value }"><el-tag>{{ value }}</el-tag></template>
</a-table>`,
        },
        {
            id: 'AForm',
            title: '表单 AForm',
            desc: '通过字段配置生成表单，校验成功后发出提交事件。',
            note: '组件不会发送请求；复杂布局和 Element Plus 的完整表单能力可直接使用 el-form。',
            props: [
                ['model', 'Object', '必填', '表单数据'],
                ['fields', 'Array', '[]', '字段配置'],
                ['rules', 'Object', '—', 'Element Plus 校验规则'],
                ['loading', 'Boolean', 'false', '提交按钮加载状态'],
                ['submitText', 'String', '保存', '提交按钮文字'],
                ['labelWidth', 'String', '120px', '标签宽度'],
                ['tabs', 'Array', '[]', '分组：{ name, label }'],
            ],
            slots: [
                ['字段 key', '参数 { field, model }'],
                ['actions', '表单操作区附加内容'],
            ],
            events: [
                ['submit', 'model', '校验通过时触发'],
                ['cancel', '—', '点击取消'],
            ],
            code: `const form = Vue.reactive({ title: '', type: 'article' });
const fields = [
  { key: 'title', label: '标题', col: 8 },
  { key: 'type', label: '类型', type: 'select', options: [
    { label: '文章', value: 'article' }, { label: '图集', value: 'gallery' }
  ] }
];
const rules = { title: [{ required: true, message: '请输入标题', trigger: 'blur' }] };

<a-form :model="form" :fields="fields" :rules="rules" @submit="save" />`,
        },
        {
            id: 'AEditor',
            title: '富文本 AEditor',
            desc: 'UEditor Plus 的轻量封装，支持双向绑定。',
            note: '使用前加载 UEditor Plus 配置与脚本。上传需要通过 options.uploadServiceUpload 对接服务，未配置时会提示。',
            props: [
                ['modelValue', 'String', '空字符串', '编辑器 HTML，支持 v-model'],
                ['options', 'Object', '{}', '传给 UEditor 的配置'],
            ],
            slots: [],
            events: [
                ['update:modelValue', 'html', '内容变化'],
                ['ready', 'editor', '编辑器初始化完成'],
            ],
            code: `<!-- 在 admin-ui.js 前加载编辑器 -->
<script src="vendor/ueditor-plus/ueditor.config.js"></script>
<script src="vendor/ueditor-plus/ueditor.all.js"></script>

<a-editor v-model="html" :options="editorOptions" @ready="onReady" />`,
        },
        {
            id: 'AEmpty',
            title: '空状态 AEmpty',
            desc: '在无数据时显示说明与后续操作。',
            props: [
                ['title', 'String', '暂无数据', '标题'],
                ['description', 'String', '试试调整筛选条件，或添加一条新记录。', '说明'],
            ],
            slots: [['default', '操作内容']],
            events: [],
            code: `<a-empty title="暂无项目" description="创建项目后将在这里显示。">
  <el-button type="primary">创建项目</el-button>
</a-empty>`,
        },
        {
            id: 'ACode',
            title: '代码展示 ACode',
            desc: '安全地展示纯文本代码并提供复制按钮。',
            note: '复制需要 HTTPS 或 localhost 等安全上下文；代码不会作为 HTML 执行。',
            props: [
                ['code', 'String', '—', '代码文本'],
                ['label', 'String', 'HTML / JavaScript', '语言或用途标签'],
            ],
            slots: [],
            events: [],
            code: `const source = 'const count = 1;';
<a-code :code="source" label="JavaScript" />`,
        },
        {
            id: 'AIcon',
            title: '图标 AIcon',
            desc: '使用项目内置线性 SVG 图标。',
            note: '未知名称回退为 grid；图标默认 aria-hidden，单图标按钮应给按钮添加 aria-label。',
            props: [
                ['name', 'String', 'grid', '图标名称'],
                ['size', 'Number / String', '20', '宽高（像素）'],
            ],
            slots: [],
            events: [],
            code: `<a-icon name="edit" :size="16" />
<el-button aria-label="删除"><a-icon name="trash" :size="16" /></el-button>`,
        },
    ];
    const guide = [
        {
            id: 'start',
            title: '快速开始',
            desc: '免构建加载与创建工作区。',
            note: '通过静态服务器访问，样式顺序为 Tabler → Element Plus → AdminUI，脚本顺序为 Vue → Element Plus → 中文语言包 → AdminUI。',
            code: `<link rel="stylesheet" href="vendor/tabler/tabler.min.css">
<link rel="stylesheet" href="vendor/element-plus/index.css">
<link rel="stylesheet" href="src/admin-ui.css">
<div id="app" v-cloak></div>
<script src="vendor/vue/vue.global.prod.js"></script>
<script src="vendor/element-plus/index.full.min.js"></script>
<script src="vendor/element-plus/zh-cn.min.js"></script>
<script src="src/admin-ui.js"></script>`,
        },
        {
            id: 'native',
            title: '原生组件与混合使用',
            desc: 'Vue、Element Plus 和 Tabler 都可以直接使用。',
            note: '不需要将原生组件改写成 AdminUI 组件。createApp 返回的 app 是 Vue 应用，可以在 mount 前注册自定义组件、插件和指令；AdminUI CSS 对部分 Element Plus 样式有全局调整，可按需覆盖。',
            code: `const admin = AdminUI.createApp({ home: '/home', routes, menus });
admin.app.component('MyComponent', MyComponent);
admin.mount('#app');

<!-- 可以在同一个模板中混用 -->
<a-panel title="项目">
  <div class="d-flex gap-2"><el-button type="primary">新增</el-button></div>
  <el-table :data="rows"><el-table-column prop="name" label="名称" /></el-table>
</a-panel>`,
        },
        {
            id: 'workspace',
            title: '路由与工作区',
            desc: '打开页面、访问路径参数，以及管理标签。',
            note: '不同完整地址对应不同标签；关闭标签销毁对应缓存，切换标签保留状态。beforeNavigate 为同步回调，返回 false 阻止导航；服务端仍需执行授权。',
            code: `const routes = [
  { path: '/projects', title: '项目', component: Projects },
  { path: '/projects/:id', title: '详情', component: Detail }
];
const workspace = AdminUI.useWorkspace(); // 页面 setup 中调用
workspace.open('/projects/42?tab=info');
workspace.current.value.params.id;  // '42'
workspace.current.value.query.tab; // 'info'
workspace.close('/projects/42?tab=info');
workspace.refresh();`,
        },
        {
            id: 'request',
            title: '请求与接口',
            desc: '统一配置接口地址、业务响应码与请求拦截。',
            note: '正式配置位于 config/admin-ui.js；加载 src/admin-request.js 后可使用 AdminUI.api。原生 fetch 和 AdminUI.request 仍可直接使用。',
            code: `const api = AdminUI.createRequestClient({
    baseURL: '', // 留空使用当前域名
    timeout: 15000,
    response: {
        codeField: 'code',
        successCodes: [0],
        messageField: 'message',
        dataField: 'data',
        unauthorizedCodes: [1001]
    },
    beforeRequest(url, options) { return { url, options }; },
    onUnauthorized(error) { console.log('登录已失效', error); },
    onError(error) { console.log('请求失败', error.message); }
});
const data = await api('app/mock/projects.json');`,
        },
    ];
    const byId = (id) => [...guide, ...components].find((entry) => entry.id === id);
    byId('ATable').extra = [
        {
            title: 'columns 列配置',
            rows: [
                ['prop', '字段名，同时用于具名插槽'],
                ['label', '列标题'],
                ['width / minWidth', '固定宽度 / 最小宽度'],
                ['align', 'left / center / right'],
                ['sortable', 'true 启用本地排序；custom 交由页面处理'],
            ],
        },
    ];
    byId('AForm').extra = [
        {
            title: 'fields 字段配置',
            rows: [
                ['key / label', '模型字段名 / 显示标签'],
                ['type', 'text、password、textarea、select、number、date、switch、richtext'],
                ['placeholder / disabled', '占位文字 / 禁用状态'],
                ['options / multiple', 'select 选项数组 / 是否多选'],
                ['col / maxWidth / full', '控件占 1–12 栅格 / 最大宽度 / 整行'],
                ['tab / hint', '所属表单标签 / 附加说明'],
                ['min / max / maxlength / rows', '数字范围 / 文本长度 / 多行高度'],
            ],
        },
    ];
    byId('AMenu').extra = [
        {
            title: 'items 节点配置',
            rows: [
                ['title / icon', '菜单文字 / 图标名称'],
                ['path', '内部页面路径；应注册在 routes 中'],
                ['href / target', '外部链接 / 打开方式'],
                ['children / items', '子菜单，优先使用 children'],
                ['id / badge', '可选标识 / 徽标'],
                ['group / spread', '分组标题 / 默认展开'],
            ],
        },
    ];
    byId('workspace').extra = [
        {
            title: '工作区 API',
            rows: [
                ['open(path)', '打开已注册页面，成功返回 true'],
                ['close(path | paths)', '关闭标签；守卫拒绝时返回 false'],
                ['closeRange(path, side)', '关闭左侧、右侧或全部标签'],
                ['refresh() / toggleTheme()', '重建当前页面 / 切换深浅主题'],
                ['active / opened / current / tabs', '当前路径、标签和页面信息，均为 Vue Ref'],
                ['canAccess / beforeNavigate', '启动时筛选路由 / 同步阻止导航'],
            ],
        },
    ];
    byId('request').extra = [
        {
            title: '请求选项与钩子',
            rows: [
                ['baseURL / timeout', '接口地址前缀 / 默认超时，单次请求可覆盖'],
                ['response', '业务码、成功码、消息字段、数据字段和失效码'],
                ['unauthorizedStatuses', '触发登录失效处理的 HTTP 状态码，默认 401'],
                ['timeout / responseType', '超时时间（默认 15000ms）/ json 或 text'],
                ['signal / headers / rawResponse', '取消请求 / 请求头 / 跳过业务码解析'],
                ['beforeRequest', '可同步或异步返回 { url, options }'],
                ['transformResponse', '转换协议解析后的结果；返回值为请求结果'],
                ['onUnauthorized', '登录失效时调用，之后仍会进入错误钩子'],
                ['onError', '处理错误；之后请求仍会拒绝'],
                ['error.status / code / response', 'HTTP 状态码 / 业务码 / 业务原始响应'],
            ],
        },
    ];
    byId('AEditor').extra = [
        {
            title: '上传回调',
            rows: [
                [
                    'uploadServiceUpload(type, file, callback)',
                    '通过 options 提供；由业务对接上传服务',
                ],
                ['callback.success(result)', '返回包含 state、url 等字段的成功结果'],
                ['callback.error(message)', '通知上传失败'],
                ['callback.progress(value)', '可选，上传进度为 0 至 1'],
            ],
        },
    ];
    AdminUIPages.Docs = {
        name: 'Docs',
        setup() {
            const selected = Vue.ref('start'),
                search = Vue.ref('');
            const entries = [...guide, ...components];
            const filtered = Vue.computed(() => {
                const q = search.value.trim().toLowerCase();
                return components.filter(
                    (c) => !q || (c.id + ' ' + c.title + ' ' + c.desc).toLowerCase().includes(q),
                );
            });
            const current = Vue.computed(
                () => entries.find((entry) => entry.id === selected.value) || guide[0],
            );
            const ws = AdminUI.useWorkspace();
            const demoActive = Vue.ref('/users'),
                demoKeyword = Vue.ref(''),
                demoFilter = Vue.ref(''),
                demoPage = Vue.ref(1),
                demoPageSize = Vue.ref(2),
                demoHtml = Vue.ref('<p>这里可以编辑内容。</p>');
            const requestResult = Vue.ref('点击按钮读取本地演示数据'),
                requestLoading = Vue.ref(false);
            const demoApi = AdminUI.createRequestClient({
                beforeRequest: (url, options) => ({ url, options }),
                response: { successCodes: [0] },
            });
            async function demoRequest() {
                requestLoading.value = true;
                try {
                    const data = await demoApi('app/mock/projects.json');
                    requestResult.value = JSON.stringify(data, null, 2);
                } catch (error) {
                    requestResult.value = '请求失败：' + error.message;
                } finally {
                    requestLoading.value = false;
                }
            }
            const demoForm = Vue.reactive({ title: '', type: 'article' });
            const demoFields = [
                { key: 'title', label: '标题', col: 8 },
                {
                    key: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        { label: '文章', value: 'article' },
                        { label: '图集', value: 'gallery' },
                    ],
                },
            ];
            const demoRules = {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
            };
            const demoMenus = [
                {
                    title: '管理',
                    icon: 'users',
                    children: [
                        { title: '用户列表', path: '/users' },
                        { title: '项目列表', path: '/projects' },
                    ],
                },
            ];
            const demoColumns = [
                { prop: 'name', label: '名称', minWidth: 180 },
                { prop: 'status', label: '状态' },
            ];
            const demoData = [
                { id: 1, name: '内容运营', status: '进行中' },
                { id: 2, name: '产品设计', status: '已完成' },
                { id: 3, name: '数据分析', status: '进行中' },
            ];
            const demoRows = Vue.computed(() =>
                demoData.slice(
                    (demoPage.value - 1) * demoPageSize.value,
                    demoPage.value * demoPageSize.value,
                ),
            );
            function choose(id) {
                selected.value = id;
            }
            function demoSearch() {
                demoFilter.value = demoKeyword.value.trim();
            }
            function demoReset() {
                demoKeyword.value = '';
                demoFilter.value = '';
            }
            function demoSave() {
                ElementPlus.ElMessage.success('示例表单校验通过');
            }
            return {
                selected,
                search,
                filtered,
                current,
                guide,
                components,
                ws,
                choose,
                demoActive,
                demoKeyword,
                demoFilter,
                demoPage,
                demoPageSize,
                demoHtml,
                demoForm,
                demoFields,
                demoRules,
                demoMenus,
                demoColumns,
                demoData,
                demoRows,
                demoSearch,
                demoReset,
                demoSave,
                requestResult,
                requestLoading,
                demoRequest,
            };
        },
        template: /* HTML */ `
            <div class="docs-page">
                <div class="docs-heading">
                    <div>
                        <span class="docs-eyebrow">ADMINUI / DOCUMENTATION</span>
                        <h1>开发文档</h1>
                        <p>查阅封装组件、接入方式与原生组件混用示例。</p>
                    </div>
                    <a
                        href="docs/guide/integration.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="docs-example-link"
                    >
                        打开接入示例
                        <a-icon name="external" :size="15" />
                    </a>
                </div>
                <div class="docs-layout">
                    <aside class="docs-sidebar">
                        <label class="docs-search-label" for="docs-search">搜索组件</label>
                        <el-input
                            id="docs-search"
                            v-model="search"
                            clearable
                            placeholder="组件名或用途"
                        />
                        <div class="docs-nav-label">接入指南</div>
                        <nav aria-label="文档目录">
                            <button
                                v-for="entry in guide"
                                :key="entry.id"
                                type="button"
                                :class="{'is-active':selected===entry.id}"
                                :aria-current="selected===entry.id?'page':null"
                                @click="choose(entry.id)"
                            >
                                {{entry.title}}
                            </button>
                            <div class="docs-nav-label">
                                封装组件
                                <span>{{components.length}}</span>
                            </div>
                            <button
                                v-for="entry in filtered"
                                :key="entry.id"
                                type="button"
                                :class="{'is-active':selected===entry.id}"
                                :aria-current="selected===entry.id?'page':null"
                                @click="choose(entry.id)"
                            >
                                {{entry.title}}
                            </button>
                            <p v-if="!filtered.length" class="docs-no-results">没有匹配的组件</p>
                        </nav>
                    </aside>
                    <main class="docs-content">
                        <header class="docs-content-heading">
                            <span>{{current.id.startsWith('A')?'组件参考':'接入指南'}}</span>
                            <h2>{{current.title}}</h2>
                            <p>{{current.desc}}</p>
                        </header>
                        <div v-if="current.note" class="docs-note">{{current.note}}</div>
                        <section class="docs-section">
                            <div class="docs-preview-heading">
                                <h3>效果展示</h3>
                                <span>可交互示例</span>
                            </div>
                            <div
                                class="docs-preview"
                                :class="{'is-layout':['ALayout','start','workspace'].includes(current.id)}"
                            >
                                <iframe
                                    v-if="['ALayout','start','workspace'].includes(current.id)"
                                    src="docs/guide/starter.html"
                                    title="完整工作区布局示例"
                                    loading="lazy"
                                ></iframe>
                                <div v-else-if="current.id==='request'">
                                    <el-button
                                        type="primary"
                                        :loading="requestLoading"
                                        @click="demoRequest"
                                    >
                                        读取本地演示数据
                                    </el-button>
                                    <pre class="docs-request-output">{{requestResult}}</pre>
                                </div>
                                <a-panel v-else-if="current.id==='native'" title="项目">
                                    <div class="d-flex gap-2 mb-3">
                                        <el-button type="primary" @click="demoSave">新增</el-button>
                                    </div>
                                    <el-table :data="demoRows">
                                        <el-table-column prop="name" label="名称" />
                                    </el-table>
                                </a-panel>
                                <div v-else-if="current.id==='AMenu'" class="docs-preview-menu">
                                    <a-menu
                                        :items="demoMenus"
                                        :active="demoActive"
                                        @navigate="demoActive=$event"
                                    />
                                    <p>当前选中：{{demoActive}}</p>
                                </div>
                                <a-page-header
                                    v-else-if="current.id==='APageHeader'"
                                    title="用户管理"
                                    category="业务示例"
                                    description="管理用户"
                                >
                                    <el-button type="primary" @click="demoSave">新增</el-button>
                                </a-page-header>
                                <a-panel
                                    v-else-if="current.id==='APanel'"
                                    title="用户列表"
                                    description="最近更新"
                                >
                                    <template #actions>
                                        <el-button @click="demoSave">导出</el-button>
                                    </template>
                                    面板内容
                                    <template #footer>数据说明</template>
                                </a-panel>
                                <a-stat-card
                                    v-else-if="current.id==='AStatCard'"
                                    label="访问量"
                                    value="12,840"
                                    change="+8%"
                                    hint="较上周"
                                    icon="chart"
                                    tone="teal"
                                    class="docs-preview-stat"
                                />
                                <div v-else-if="current.id==='AFilterBar'">
                                    <a-filter-bar @search="demoSearch" @reset="demoReset">
                                        <div>
                                            <label for="docs-preview-keyword">关键词</label>
                                            <el-input
                                                id="docs-preview-keyword"
                                                v-model="demoKeyword"
                                                clearable
                                            />
                                        </div>
                                        <template #actions>
                                            <el-button @click="demoSave">更多</el-button>
                                        </template>
                                    </a-filter-bar>
                                    <p class="docs-preview-hint">
                                        当前查询：{{demoFilter || '全部'}}
                                    </p>
                                </div>
                                <a-table
                                    v-else-if="current.id==='ATable'"
                                    :rows="demoRows"
                                    :columns="demoColumns"
                                    :total="demoData.length"
                                    v-model:page="demoPage"
                                    v-model:page-size="demoPageSize"
                                    :page-sizes="[2,3]"
                                    selectable
                                >
                                    <template #status="{value}">
                                        <el-tag :type="value==='已完成'?'success':'primary'">
                                            {{value}}
                                        </el-tag>
                                    </template>
                                </a-table>
                                <a-form
                                    v-else-if="current.id==='AForm'"
                                    :model="demoForm"
                                    :fields="demoFields"
                                    :rules="demoRules"
                                    label-width="80px"
                                    @submit="demoSave"
                                    @cancel="demoForm.title=''"
                                />
                                <a-editor v-else-if="current.id==='AEditor'" v-model="demoHtml" />
                                <a-empty
                                    v-else-if="current.id==='AEmpty'"
                                    title="暂无项目"
                                    description="创建项目后将在这里显示。"
                                >
                                    <el-button type="primary" @click="demoSave">创建项目</el-button>
                                </a-empty>
                                <a-code
                                    v-else-if="current.id==='ACode'"
                                    code="const count = 1;"
                                    label="JavaScript"
                                />
                                <div v-else-if="current.id==='AIcon'" class="docs-preview-icons">
                                    <div
                                        v-for="icon in ['edit','trash','search','plus','users','settings']"
                                        :key="icon"
                                    >
                                        <a-icon :name="icon" :size="24" />
                                        <code>{{icon}}</code>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section v-if="current.props && current.props.length" class="docs-section">
                            <h3>属性</h3>
                            <div class="docs-table-wrap">
                                <table class="docs-api-table">
                                    <thead>
                                        <tr>
                                            <th>属性</th>
                                            <th>类型</th>
                                            <th>默认值</th>
                                            <th>说明</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in current.props" :key="row[0]">
                                            <td><code>{{row[0]}}</code></td>
                                            <td>{{row[1]}}</td>
                                            <td>{{row[2]}}</td>
                                            <td>{{row[3]}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <section v-if="current.slots && current.slots.length" class="docs-section">
                            <h3>插槽</h3>
                            <div class="docs-table-wrap">
                                <table class="docs-api-table">
                                    <thead>
                                        <tr>
                                            <th>名称</th>
                                            <th>说明</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in current.slots" :key="row[0]">
                                            <td><code>{{row[0]}}</code></td>
                                            <td>{{row[1]}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <section
                            v-if="current.events && current.events.length"
                            class="docs-section"
                        >
                            <h3>事件</h3>
                            <div class="docs-table-wrap">
                                <table class="docs-api-table">
                                    <thead>
                                        <tr>
                                            <th>事件</th>
                                            <th>参数</th>
                                            <th>说明</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in current.events" :key="row[0]">
                                            <td><code>{{row[0]}}</code></td>
                                            <td>{{row[1]}}</td>
                                            <td>{{row[2]}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <section
                            v-for="section in current.extra || []"
                            :key="section.title"
                            class="docs-section"
                        >
                            <h3>{{section.title}}</h3>
                            <div class="docs-table-wrap">
                                <table class="docs-api-table">
                                    <thead>
                                        <tr>
                                            <th>名称</th>
                                            <th>说明</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in section.rows" :key="row[0]">
                                            <td><code>{{row[0]}}</code></td>
                                            <td>{{row[1]}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <section class="docs-section">
                            <h3>使用示例</h3>
                            <a-code :code="current.code" label="代码" />
                        </section>
                        <div
                            v-if="current.id==='AIcon' || current.id==='ATable' || current.id==='AMenu'"
                            class="docs-related"
                        >
                            <el-button
                                v-if="current.id==='AIcon'"
                                @click="ws.open('/components/icons')"
                            >
                                查看图标示例
                            </el-button>
                            <el-button
                                v-if="current.id==='ATable'"
                                @click="ws.open('/components/catalog/table')"
                            >
                                查看表格示例
                            </el-button>
                            <el-button
                                v-if="current.id==='AMenu'"
                                @click="ws.open('/components/navigation')"
                            >
                                查看菜单示例
                            </el-button>
                        </div>
                        <p class="docs-footer">
                            完整字段选项与接入边界可查看
                            <a href="docs/组件与接入.md" target="_blank" rel="noopener noreferrer">
                                Markdown 指南
                            </a>
                            。
                        </p>
                    </main>
                </div>
            </div>
        `,
    };
})();
