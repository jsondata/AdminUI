/* 页面交互逻辑。 */
(function () {
    const { ref, computed } = Vue;
    AdminUIPages.Navigation = {
        name: 'Navigation',
        setup() {
            const active = ref('/sample/team/members'),
                accordion = ref(true),
                horizontalActive = ref('overview');
            const items = [
                { id: 'overview', title: '概览', icon: 'grid', path: '/sample/home' },
                {
                    id: 'team',
                    title: '组织管理',
                    icon: 'users',
                    children: [
                        {
                            id: 'people',
                            title: '人员管理',
                            children: [
                                { title: '成员列表', path: '/sample/team/members' },
                                { title: '邀请记录', path: '/sample/team/invitations' },
                            ],
                        },
                        { title: '部门设置', path: '/sample/team/departments' },
                    ],
                },
                {
                    id: 'security',
                    title: '安全设置',
                    icon: 'shield',
                    children: [
                        {
                            title: '访问策略',
                            children: [
                                { title: 'IP 白名单', path: '/sample/security/ip' },
                                { title: '操作审计', path: '/sample/security/audit' },
                            ],
                        },
                        { title: '登录记录', path: '/sample/security/logs' },
                    ],
                },
            ];
            const trail = computed(() =>
                AdminUI.findMenuTrail(items, active.value).map((node) => node.title),
            );
            const code = `const menus = [{
    title: '组织管理', icon: 'users',
    children: [{
        title: '人员管理',
        children: [
            { title: '成员列表', path: '/members' },
            { title: '邀请记录', path: '/invitations' }
        ]
    }]
}];

<a-menu :items="menus" :active="active" :accordion="true" @navigate="active = $event" />`;
            return { items, active, accordion, trail, code, horizontalActive };
        },
        templateUrl: 'app/pages/navigation/index.html',
    };
})();
