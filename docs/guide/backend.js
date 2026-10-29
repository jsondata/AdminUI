/* 仅用于本地模拟，不可作为生产环境的认证或上传代码。 */
(function () {
    const Demo = {
        setup() {
            const username = Vue.ref('demo'),
                password = Vue.ref(''),
                token = Vue.ref(''),
                message = Vue.ref(''),
                file = Vue.ref(null),
                busy = Vue.ref(false);
            const api = AdminUI.createConfiguredRequest(
                {
                    ...AdminUIConfig,
                    request: {
                        ...AdminUIConfig.request,
                        tokenName: 'Authorization',
                        tokenPrefix: 'Bearer ',
                    },
                },
                {
                    getToken: () => token.value,
                    onUnauthorized() {
                        token.value = '';
                        message.value = '登录状态失效或账号密码错误';
                    },
                    onError(error) {
                        if (!message.value) message.value = error.message;
                    },
                },
            );
            async function run(action) {
                busy.value = true;
                message.value = '';
                try {
                    await action();
                } catch (error) {
                    if (!message.value) message.value = error.message;
                } finally {
                    busy.value = false;
                }
            }
            function login() {
                run(async () => {
                    const result = await api('/api/demo-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: username.value,
                            password: password.value,
                        }),
                    });
                    token.value = result.token;
                    password.value = '';
                    message.value = '演示登录成功';
                });
            }
            function profile() {
                run(async () => {
                    const result = await api('/api/demo-private');
                    message.value = '接口返回：' + result.name;
                });
            }
            function upload() {
                run(async () => {
                    if (!file.value) throw new Error('请先选择文件');
                    const result = await api('/api/demo-upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/octet-stream' },
                        body: file.value,
                    });
                    message.value = '已接收 ' + result.size + ' 字节（未保存文件）';
                });
            }
            function choose(event) {
                file.value = event.target.files[0] || null;
            }
            function logout() {
                token.value = '';
                file.value = null;
                message.value = '已清除本页演示状态';
            }
            return {
                username,
                password,
                token,
                message,
                file,
                busy,
                login,
                profile,
                upload,
                choose,
                logout,
            };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    title="本地接口接入"
                    description="演示请求适配、登录状态、401 和上传"
                />
                <a-panel title="说明">
                    <el-alert
                        title="仅限本机演示：固定账号和令牌不能用于生产"
                        type="warning"
                        :closable="false"
                    />
                    <p class="mt-3">账号和密码均为 demo；令牌仅保存在当前页面内存。</p>
                </a-panel>
                <a-panel title="登录与请求">
                    <div class="catalog-stack" style="max-width:400px">
                        <el-input v-model="username" aria-label="账号" placeholder="账号" />
                        <el-input
                            v-model="password"
                            type="password"
                            show-password
                            aria-label="密码"
                            placeholder="密码"
                        />
                        <div class="d-flex gap-2">
                            <el-button type="primary" :loading="busy" @click="login">
                                登录
                            </el-button>
                            <el-button @click="profile">请求受保护接口</el-button>
                            <el-button @click="logout">退出</el-button>
                        </div>
                    </div>
                </a-panel>
                <a-panel title="文件上传">
                    <p>本地接口接收文件内容并返回大小，不保存文件，最大 2 MB。</p>
                    <input type="file" aria-label="选择上传文件" @change="choose" />
                    <el-button type="primary" :loading="busy" @click="upload">上传演示</el-button>
                </a-panel>
                <el-alert v-if="message" :title="message" type="info" :closable="false" />
            </div>
        `,
    };
    AdminUI.createApp({
        home: '/backend',
        storageKey: 'adminui.backend-demo',
        routes: [{ path: '/backend', title: '本地接口演示', component: Demo }],
        menus: [{ title: '本地接口演示', path: '/backend' }],
    }).mount('#app');
})();
