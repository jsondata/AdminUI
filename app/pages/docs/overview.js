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
        templateUrl: 'app/pages/docs/overview.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Docs = Docs;
})(window);
