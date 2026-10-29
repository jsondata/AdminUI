(function () {
    const D = AdminUIDemo;
    const routes = [
        {
            path: '/dashboard',
            title: '工作台',
            description: '关键指标与工作动态',
            icon: 'home',
            component: D.Dashboard,
        },
        {
            path: '/users',
            title: '用户管理',
            description: '用户列表、筛选与本地增删改查',
            icon: 'user',
            component: D.Users,
        },
        {
            path: '/reports',
            title: '数据报表',
            description: '趋势图、周期切换与导出',
            icon: 'chart',
            component: D.Reports,
        },
        {
            path: '/components',
            title: '组件总览',
            description: '基础交互与组件示例',
            icon: 'panels',
            component: D.Components,
        },
        {
            path: '/components/buttons',
            title: '按钮',
            description: '操作层次、尺寸和状态',
            icon: 'plus',
            component: D.Buttons,
        },
        {
            path: '/components/charts',
            title: '图表',
            description: '折线、柱状与环形图',
            icon: 'chart',
            component: D.Charts,
        },
        {
            path: '/components/icons',
            title: '图标',
            description: '常用图标与使用代码',
            icon: 'box',
            component: D.Icons,
        },
        {
            path: '/components/selects',
            title: '下拉选择',
            description: '单选、多选、搜索与分组',
            icon: 'check',
            component: D.Selects,
        },
        {
            path: '/components/navigation',
            title: '多级菜单',
            description: '递归导航、手风琴与路径联动',
            icon: 'menu',
            component: D.Navigation,
        },
        {
            path: '/forms',
            title: '表单构建',
            description: '字段、校验与数据预览',
            icon: 'list',
            component: D.Forms,
        },
        {
            path: '/settings',
            title: '偏好设置',
            description: '外观、主题与布局',
            icon: 'sliders',
            component: D.Settings,
        },
        {
            path: '/pages',
            title: '页面示例',
            description: '登录、注册与错误页面',
            icon: 'shield',
            component: D.PageExamples,
        },
        {
            path: '/docs',
            title: '使用文档',
            description: '快速开始与组件 API',
            icon: 'file',
            component: D.Docs,
        },
    ];
    const catalog = D.catalog;
    for (const [key, spec] of Object.entries(catalog.specs)) {
        routes.push({
            path: '/components/catalog/' + key,
            title: spec[0],
            description: spec[1],
            icon: catalog.icons[key],
            component: key === 'table' ? D.TableExamples : catalog.build(key),
        });
    }
    async function start() {
        const menus = await AdminUI.request('demo/data/menus.json');
        if (!Array.isArray(menus)) throw new Error('菜单数据格式错误');
        AdminUI.createApp({
            brand: { name: 'AdminUI', subtitle: '应用开发组件库' },
            user: { name: 'Alex Chen', role: '工作空间管理员' },
            home: '/dashboard',
            storageKey: 'adminui.demo.workspace.v1',
            routes,
            menus,
        }).mount('#app');
    }
    start().catch((error) => {
        const app = document.getElementById('app');
        app.removeAttribute('v-cloak');
        app.textContent =
            '菜单加载失败，请检查 demo/data/menus.json 和静态服务器：' + error.message;
    });
})();
