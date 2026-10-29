/* 页面交互逻辑。 */
(function () {
    const { ref, computed } = Vue;
    AdminUIPages.Selects = {
        name: 'Selects',
        setup() {
            return {
                role: ref('editor'),
                members: ref(['lin']),
                disabled: ref(false),
                options: [
                    { label: '管理员', value: 'admin' },
                    { label: '编辑', value: 'editor' },
                    { label: '普通成员', value: 'member' },
                ],
            };
        },
        templateUrl: 'app/pages/selects/index.html',
    };
})();
