/* 本地静态数据演示：AdminUI 外壳 + Vue + Element Plus + Tabler */
(function () {
    const api = AdminUI.createRequestClient({
        transformResponse(response) {
            if (response.code !== 0) throw new Error(response.message || '请求失败');
            return response.data;
        },
        onError(error) {
            ElementPlus.ElMessage.error(error.message || '请求失败');
        },
    });
    const Projects = {
        setup() {
            const workspace = AdminUI.useWorkspace();
            const remote = new URLSearchParams(location.search).get('api') === '1';
            const total = Vue.ref(0);
            const rows = Vue.ref([]),
                loading = Vue.ref(false),
                keyword = Vue.ref(''),
                page = Vue.ref(1),
                pageSize = Vue.ref(3),
                error = Vue.ref('');
            const filtered = Vue.computed(() =>
                rows.value.filter((row) => row.name.includes(keyword.value.trim())),
            );
            const visible = Vue.computed(() =>
                remote
                    ? rows.value
                    : filtered.value.slice(
                          (page.value - 1) * pageSize.value,
                          page.value * pageSize.value,
                      ),
            );
            const displayTotal = Vue.computed(() => (remote ? total.value : filtered.value.length));
            Vue.watch([keyword, pageSize], () => {
                page.value = 1;
            });
            let requestId = 0;
            async function load() {
                const id = ++requestId;
                loading.value = true;
                error.value = '';
                try {
                    const params = new URLSearchParams({
                        page: page.value,
                        pageSize: pageSize.value,
                        keyword: keyword.value.trim(),
                    });
                    const data = await api(
                        remote ? '/api/projects?' + params : 'data/projects.json',
                    );
                    if (id !== requestId) return;
                    rows.value = remote ? data.rows : data;
                    if (remote) total.value = data.total;
                } catch (e) {
                    if (id === requestId) error.value = e.message;
                } finally {
                    if (id === requestId) loading.value = false;
                }
            }
            Vue.watch([keyword, pageSize, page], () => {
                if (remote) load();
            });
            Vue.onMounted(load);
            return {
                rows,
                loading,
                keyword,
                page,
                pageSize,
                error,
                filtered,
                visible,
                displayTotal,
                remote,
                load,
                workspace,
                encodeURIComponent,
            };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    title="混合接入示例"
                    description="同一页面自由组合 AdminUI、Vue、Element Plus 与 Tabler"
                />
                <a-panel title="项目列表">
                    <div class="d-flex gap-2 mb-3">
                        <el-input
                            v-model="keyword"
                            clearable
                            placeholder="搜索项目"
                            aria-label="搜索项目"
                            style="max-width:240px"
                        />
                        <el-button @click="load" :loading="loading">重新加载</el-button>
                    </div>
                    <el-alert
                        v-if="error"
                        :title="error"
                        type="error"
                        :closable="false"
                        class="mb-3"
                    />
                    <el-table :data="visible" v-loading="loading" row-key="id">
                        <el-table-column prop="name" label="项目" />
                        <el-table-column prop="owner" label="负责人" />
                        <el-table-column label="状态">
                            <template #default>
                                <span class="badge bg-green-lt">正常</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default="{row}">
                                <el-button
                                    type="primary"
                                    text
                                    @click="workspace.open('/projects/'+row.id+'?name='+encodeURIComponent(row.name))"
                                >
                                    查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="mt-3">
                        <el-pagination
                            v-model:current-page="page"
                            v-model:page-size="pageSize"
                            :total="displayTotal"
                            layout="total, prev, pager, next"
                            background
                        />
                    </div>
                    <p class="mt-3 text-secondary">
                        {{remote ? '本地示例接口根据页码、每页条数和关键词返回数据。' :
                        '此处读取本地 JSON 并在浏览器内分页。'}}
                    </p>
                </a-panel>
            </div>
        `,
    };
    const Detail = {
        setup() {
            return { workspace: AdminUI.useWorkspace() };
        },
        template: /* HTML */ `
            <div>
                <a-page-header title="项目详情" description="使用路径参数和查询参数" />
                <a-panel title="路由信息">
                    <p>项目 ID：{{workspace.current.value.params.id}}</p>
                    <p>名称：{{workspace.current.value.query.name || '未提供'}}</p>
                    <el-button @click="workspace.open('/projects')">返回列表</el-button>
                </a-panel>
            </div>
        `,
    };
    AdminUI.createApp({
        storageKey: 'adminui.integration',
        home: '/projects',
        routes: [
            { path: '/projects', title: '项目列表', icon: 'list', component: Projects },
            { path: '/projects/:id', title: '项目详情', icon: 'file', component: Detail },
        ],
        menus: [{ title: '项目列表', path: '/projects', icon: 'list' }],
    }).mount('#app');
})();
