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
        template: /* HTML */ `
            <div class="demo-settings">
                <a-page-header
                    title="偏好设置"
                    category="工作空间"
                    description="主题偏好保存在当前浏览器"
                />
                <a-panel title="外观与布局">
                    <div class="demo-setting-row">
                        <div>
                            <strong>深色主题</strong>
                            <small>同步调整基础组件和业务界面的配色。</small>
                        </div>
                        <el-switch
                            :model-value="ws.theme.value==='dark'"
                            aria-label="深色主题"
                            @change="ws.toggleTheme"
                        />
                    </div>
                    <div class="demo-setting-row">
                        <div>
                            <strong>收起侧栏</strong>
                            <small>为主要内容留出更多空间。</small>
                        </div>
                        <el-switch v-model="ws.collapsed.value" aria-label="收起侧栏" />
                    </div>
                </a-panel>
                <a-panel title="使用边界">
                    <el-alert title="当前是静态演示站" type="info" :closable="false" />
                    <p class="demo-doc-text mt-3 mb-0">
                        AdminUI
                        提供界面与交互，不包含真实登录、服务器授权、业务数据和通知服务。生产接入时，由你的后端负责身份、权限与数据校验。
                    </p>
                </a-panel>
            </div>
        `,
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Settings = Settings;
})(window);
