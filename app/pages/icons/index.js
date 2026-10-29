/* 页面交互逻辑。 */
(function () {
    const { ref, computed } = Vue;
    AdminUIPages.Icons = {
        name: 'Icons',
        setup() {
            const keyword = ref(''),
                selected = ref('edit');
            const icons = [
                ['home', '首页'],
                ['grid', '概览'],
                ['menu', '菜单'],
                ['search', '搜索'],
                ['user', '用户'],
                ['users', '用户组'],
                ['settings', '设置'],
                ['sliders', '调整'],
                ['bell', '通知'],
                ['book', '文档'],
                ['file', '文件'],
                ['list', '列表'],
                ['chart', '图表'],
                ['layers', '图层'],
                ['box', '盒子'],
                ['form', '表单'],
                ['plus', '新增'],
                ['edit', '编辑'],
                ['trash', '删除'],
                ['check', '确认'],
                ['close', '关闭'],
                ['refresh', '刷新'],
                ['download', '下载'],
                ['arrow', '箭头'],
                ['chevron', '方向'],
                ['external', '外部链接'],
                ['code', '代码'],
                ['clock', '时间'],
                ['shield', '安全'],
                ['lock', '锁定'],
                ['sun', '浅色'],
                ['moon', '深色'],
                ['login', '登录'],
                ['register', '注册'],
                ['server', '服务器'],
                ['network', '网络'],
            ];
            const filtered = computed(() => {
                const q = keyword.value.trim().toLowerCase();
                return icons.filter(([name, label]) => name.includes(q) || label.includes(q));
            });
            const code = computed(() => `<a-icon name="${selected.value}" :size="20" />`);
            return { keyword, selected, filtered, code };
        },
        templateUrl: 'app/pages/icons/index.html',
    };
})();
