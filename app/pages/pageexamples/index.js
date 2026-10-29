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
        templateUrl: 'app/pages/pageexamples/index.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.PageExamples = PageExamples;
})(window);
