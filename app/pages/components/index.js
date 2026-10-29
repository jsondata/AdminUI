/* Components 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Components = {
        name: 'Components',
        setup() {
            const selected = ref('blue'),
                multi = ref(['form']),
                check = ref(true),
                radio = ref('a'),
                visible = ref(false),
                drawer = ref(false),
                tab = ref('base'),
                notice = ref('暂无操作');
            const colors = [
                { name: 'Primary', value: '#3265f5' },
                { name: 'Success', value: '#28ae94' },
                { name: 'Warning', value: '#e6a04c' },
                { name: 'Danger', value: '#e17b7b' },
                { name: 'Surface', value: '#f5f7fb' },
            ];
            function message(type) {
                messages[type](
                    '这是一条' +
                        { success: '成功', warning: '提醒', info: '信息', error: '错误' }[type] +
                        '消息',
                );
                notice.value = '触发了 ' + type + ' 消息';
            }
            return { selected, multi, check, radio, visible, drawer, tab, colors, message, notice };
        },
        templateUrl: 'app/pages/components/index.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Components = Components;
})(window);
