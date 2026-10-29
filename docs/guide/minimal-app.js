/* 正式应用入口：在此注册业务页面和菜单。 */
(function () {
    const Home = {
        template: /* HTML */ `
            <div>
                <a-page-header title="工作台" description="在 app/main.js 中注册业务页面。" />
                <a-panel title="开始使用">
                    <p>接口地址和响应格式可在 config/admin-ui.js 中配置。</p>
                </a-panel>
            </div>
        `,
    };

    const routes = [{ path: '/home', title: '工作台', icon: 'home', component: Home }];
    const menus = [{ title: '工作台', path: '/home', icon: 'home' }];

    AdminUI.createApp({
        brand: { name: 'AdminUI', subtitle: '应用工作区' },
        home: '/home',
        storageKey: 'adminui.app.workspace',
        routes,
        menus,
    }).mount('#app');
})();
