/* Settings 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Settings = {
        name: 'Settings',
        setup() {
            const ws = AdminUI.useWorkspace(),
                compact = ref(false),
                notifications = ref(true);
            return { ws, compact, notifications, messages };
        },
        templateUrl: 'app/pages/settings/index.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Settings = Settings;
})(window);
