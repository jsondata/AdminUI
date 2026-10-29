/* Docs 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Docs = {
        name: 'Docs',
        setup() {
            const ws = AdminUI.useWorkspace();
            const sample = `const page = {
    template: '<a-page-header title="我的页面" />'
};

AdminUI.createApp({
    home: '/home',
    storageKey: 'my-app.user-42.workspace',
    routes: [{ path: '/home', title: '首页',
        icon: 'grid', component: page }],
    menus: [{ title: '工作空间', items: [
        { path: '/home', title: '首页', icon: 'grid' }
    ] }]
}).mount('#app');`;
            const api = [
                ['AMenu', '递归菜单、手风琴、祖先展开与选中联动'],
                ['ALayout', '导航、侧栏、顶栏、多标签、搜索与主题'],
                ['APageHeader', '紧凑的分类、标题、说明和操作区'],
                ['APanel', '统一标题、内容、底部与操作插槽'],
                ['AStatCard', '指标、变化率、图标和扩展内容'],
                ['AFilterBar', '筛选布局、search / reset 事件'],
                ['ATable', '列配置、选择、分页与单元格插槽'],
                ['AForm', '字段配置、校验、自定义字段插槽'],
                ['AEditor', 'UEditor Plus 富文本编辑'],
                ['AEmpty', '空状态、说明和下一步操作'],
                ['ACode', '代码展示与复制（需安全上下文）'],
                ['AIcon', '内置的线性 SVG 图标'],
            ];
            return { ws, sample, api };
        },
        template: /* HTML */ `
            <div>
                <div class="demo-doc-lead">
                    <div class="demo-eyebrow">ADMINUI / GETTING STARTED</div>
                    <h1>开发文档</h1>
                    <p>
                        用 Tabler 统一视觉，用 Element Plus 处理交互，用 Vue 3
                        组织应用。直接引入本地资源，即可开始。没有构建步骤，也没有后端语言限制。
                    </p>
                </div>
                <div class="demo-component-grid">
                    <a-panel
                        title="组件与接入指南"
                        description="封装组件 API、原生组件混用及请求扩展"
                    >
                        <p class="demo-doc-text">
                            可以自由组合 Vue、Element Plus、Tabler 与
                            AdminUI；查看完整指南或运行混合接入示例。
                        </p>
                        <div class="demo-button-row">
                            <a href="docs/组件与接入.md" target="_blank" rel="noopener noreferrer">
                                查看完整指南
                            </a>
                            <a
                                href="docs/guide/integration.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                打开混合接入示例
                            </a>
                        </div>
                    </a-panel>
                    <a-panel title="01 / 开始使用" description="先引入依赖，再注册页面与菜单">
                        <p class="demo-doc-text">
                            项目包含完整浏览器版依赖。直接打开
                            <code>docs/guide/starter.html</code>
                            即可运行最小示例；生产环境建议通过静态服务部署。
                        </p>
                        <a-code :code="sample" />
                        <p class="demo-doc-text mt-3 mb-0">
                            样式顺序：Tabler → Element Plus → AdminUI。脚本顺序：Vue → Element Plus
                            → 中文语言包 → AdminUI → 业务代码。
                        </p>
                    </a-panel>
                    <a-panel title="02 / 组件目录" description="独立注册，也可以使用完整工作区框架">
                        <table class="demo-doc-table">
                            <thead>
                                <tr>
                                    <th>组件</th>
                                    <th>用途</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in api">
                                    <td><strong>{{row[0]}}</strong></td>
                                    <td>{{row[1]}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </a-panel>
                    <a-panel title="03 / 导航与多标签">
                        <p class="demo-doc-text">
                            在页面
                            <code>setup()</code>
                            中调用
                            <code>AdminUI.useWorkspace()</code>
                            ，使用
                            <code>workspace.open('/users')</code>
                            打开页面。同一路由复用已有标签。
                        </p>
                        <p class="demo-doc-text">
                            标签支持关闭、右键关闭左右及全部、刷新保留、左右箭头滚动。浏览器返回与前进也会同步页面。主题偏好使用
                            localStorage，标签使用 sessionStorage。
                        </p>
                        <el-button @click="ws.open('/users')">
                            打开用户管理示例
                            <a-icon name="arrow" :size="14" class="ms-1" />
                        </el-button>
                    </a-panel>
                    <a-panel title="04 / 数据与接口">
                        <p class="demo-doc-text">
                            示例使用本地数据。
                            <code>AdminUI.request(url, options)</code>
                            是带超时与 HTTP 错误处理的 Fetch
                            工具，不会预设业务响应格式。需要授权时由应用配置 headers 和 CSRF 令牌。
                        </p>
                        <p class="demo-doc-text mb-0">
                            ATable 的 rows、total、page
                            均由父页面控制，可以使用本地筛选，也可以调用后端分页接口。完整
                            API、生命周期与限制见项目 README。
                        </p>
                    </a-panel>
                </div>
            </div>
        `,
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Docs = Docs;
})(window);
