/* PageExamples 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const PageExamples = {
        name: 'PageExamples',
        setup() {
            const pages = [
                { type: 'login', title: '登录页', desc: '账号与密码登录表单' },
                { type: 'register', title: '注册页', desc: '创建账号与表单校验' },
                { type: '403', title: '403 无权限', desc: '访问受限时的提示' },
                { type: '404', title: '404 页面不存在', desc: '页面未找到时的提示' },
                { type: '500', title: '500 服务器错误', desc: '服务异常时的提示' },
                { type: '502', title: '502 网关错误', desc: '上游服务不可用时的提示' },
            ];
            return { pages };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    title="页面示例"
                    category="页面"
                    description="登录、注册及常见状态页面"
                />
                <div class="page-example-grid">
                    <a
                        v-for="page in pages"
                        class="page-example-card"
                        :href="'app/pages/standalone/pages.html?type='+page.type"
                        target="_blank"
                        rel="noopener"
                    >
                        <span class="page-example-icon">
                            <a-icon
                                :name="page.type==='login'?'user':page.type==='register'?'plus':'file'"
                            />
                        </span>
                        <strong>{{page.title}}</strong>
                        <p>{{page.desc}}</p>
                        <span class="page-example-link">打开页面 →</span>
                    </a>
                </div>
            </div>
        `,
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.PageExamples = PageExamples;
})(window);
