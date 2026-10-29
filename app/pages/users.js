/* Users 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Users = {
        name: 'Users',
        setup() {
            const initial = ref([]),
                seedReady = ref(false),
                loadingUsers = ref(false),
                dataError = ref('');
            let hasStored = false,
                disposed = false,
                loadController;
            const rows = ref([]),
                keyword = ref(''),
                status = ref(''),
                role = ref(''),
                query = reactive({ keyword: '', status: '', role: '' }),
                filters = reactive({
                    department: '',
                    position: '',
                    location: '',
                    phone: '',
                    id: '',
                    email: '',
                    dateFrom: '',
                    dateTo: '',
                    lastLogin: '',
                }),
                applied = reactive({ ...filters }),
                page = ref(1),
                pageSize = ref(8),
                filtersExpanded = ref(false),
                selected = ref([]),
                batchAction = ref(''),
                dialog = ref(false),
                saving = ref(false);
            try {
                const data = JSON.parse(localStorage.getItem('adminui.demo.users'));
                if (
                    Array.isArray(data) &&
                    data.every((r) => r && Number.isInteger(r.id) && typeof r.name === 'string')
                ) {
                    rows.value = data;
                    hasStored = true;
                }
            } catch (_) {}
            async function loadUsers() {
                if (loadingUsers.value) return;
                loadingUsers.value = true;
                dataError.value = '';
                loadController = new AbortController();
                try {
                    const data = await AdminUI.request('app/mock/users.json', {
                        signal: loadController.signal,
                    });
                    if (
                        !Array.isArray(data) ||
                        !data.every(
                            (row) =>
                                row &&
                                Number.isInteger(row.id) &&
                                typeof row.name === 'string' &&
                                typeof row.email === 'string',
                        )
                    )
                        throw new Error('用户数据格式错误');
                    if (disposed) return;
                    initial.value = data;
                    seedReady.value = true;
                    // 已有本地修改时只更新默认数据，不覆盖用户保存的列表。
                    if (!hasStored) rows.value = data.map((row) => ({ ...row }));
                } catch (error) {
                    if (!disposed && !loadController.signal.aborted)
                        dataError.value = '用户数据加载失败：' + error.message;
                } finally {
                    if (!disposed) loadingUsers.value = false;
                }
            }
            Vue.onMounted(loadUsers);
            Vue.onBeforeUnmount(() => {
                disposed = true;
                loadController?.abort();
            });
            const defaults = computed(() => new Map(initial.value.map((row) => [row.id, row])));
            const enrich = (row) => ({ ...defaults.value.get(row.id), ...row });
            const filtered = computed(() =>
                rows.value.map(enrich).filter(
                    (r) =>
                        (!query.keyword ||
                            (r.name + ' ' + r.email)
                                .toLowerCase()
                                .includes(query.keyword.toLowerCase())) &&
                        (!query.status || r.status === query.status) &&
                        (!query.role || r.role === query.role) &&
                        [
                            'department',
                            'position',
                            'location',
                            'phone',
                            'id',
                            'email',
                            'lastLogin',
                        ].every(
                            (k) =>
                                !applied[k] ||
                                String(r[k] || '')
                                    .toLowerCase()
                                    .includes(applied[k].toLowerCase()),
                        ) &&
                        (!applied.dateFrom || r.date >= applied.dateFrom) &&
                        (!applied.dateTo || r.date <= applied.dateTo),
                ),
            );
            const visible = computed(() =>
                filtered.value.slice(
                    (page.value - 1) * pageSize.value,
                    page.value * pageSize.value,
                ),
            );
            Vue.watch(pageSize, (size) => {
                page.value = Math.min(
                    page.value,
                    Math.max(1, Math.ceil(filtered.value.length / size)),
                );
            });
            const columns = [
                { prop: 'person', label: '用户信息', minWidth: 220 },
                { prop: 'role', label: '角色', minWidth: 100 },
                { prop: 'department', label: '部门', minWidth: 110 },
                { prop: 'position', label: '职位', minWidth: 110 },
                { prop: 'phone', label: '手机号', minWidth: 140 },
                { prop: 'location', label: '所在地', minWidth: 100 },
                { prop: 'lastLogin', label: '最近登录', minWidth: 130 },
                { prop: 'status', label: '状态', minWidth: 100 },
                { prop: 'date', label: '加入日期', minWidth: 130 },
                { prop: 'actions', label: '操作', width: 260 },
            ];
            const model = reactive({ id: 0, name: '', email: '', role: '成员', status: '正常' });
            const fields = [
                { key: 'name', label: '姓名', maxlength: 30 },
                { key: 'email', label: '邮箱' },
                {
                    key: 'role',
                    label: '角色',
                    type: 'select',
                    options: ['管理员', '编辑', '成员'].map((v) => ({ label: v, value: v })),
                },
                {
                    key: 'status',
                    label: '状态',
                    type: 'select',
                    options: ['正常', '停用'].map((v) => ({ label: v, value: v })),
                },
            ];
            const rules = {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入有效邮箱', trigger: 'blur' },
                ],
            };
            function persist() {
                hasStored = true;
                try {
                    localStorage.setItem('adminui.demo.users', JSON.stringify(rows.value));
                } catch (_) {
                    messages.warning('浏览器存储不可用，本次修改仅在当前页面保留');
                }
            }
            function search() {
                Object.assign(query, {
                    keyword: keyword.value.trim(),
                    status: status.value,
                    role: role.value,
                });
                Object.keys(filters).forEach((k) => (applied[k] = filters[k].trim()));
                page.value = 1;
            }
            function reset() {
                keyword.value = '';
                status.value = '';
                role.value = '';
                Object.keys(filters).forEach((k) => (filters[k] = ''));
                search();
            }
            function edit(row) {
                Object.assign(
                    model,
                    row || { id: 0, name: '', email: '', role: '成员', status: '正常' },
                );
                dialog.value = true;
            }
            function rowCommand(command, row) {
                if (command === 'status') {
                    const target = rows.value.find((item) => item.id === row.id);
                    if (target) {
                        target.status = target.status === '正常' ? '停用' : '正常';
                        persist();
                        messages.success('用户状态已更新');
                    }
                } else if (command === 'details') {
                    ElementPlus.ElMessageBox.alert(
                        '姓名：' + row.name + '\n邮箱：' + row.email + '\n部门：' + row.department,
                        '用户详情',
                        { confirmButtonText: '确定' },
                    );
                }
            }
            function save() {
                saving.value = true;
                const record = { ...model, date: model.date || '2026-10-29' };
                if (model.id) {
                    rows.value = rows.value.map((r) => (r.id === model.id ? record : r));
                } else {
                    record.id = Math.max(0, ...rows.value.map((r) => r.id)) + 1;
                    rows.value.unshift(record);
                    page.value = 1;
                }
                persist();
                saving.value = false;
                dialog.value = false;
                messages.success('演示用户已保存到当前浏览器');
            }
            async function remove(ids) {
                try {
                    await ElementPlus.ElMessageBox.confirm(
                        '将删除 ' + ids.length + ' 条本地演示记录，可用“恢复演示数据”重置。',
                        '删除演示用户',
                        {
                            confirmButtonText: '删除',
                            cancelButtonText: '取消',
                            type: 'error',
                            customClass: 'demo-delete-confirm',
                            confirmButtonClass: 'demo-delete-confirm-button',
                        },
                    );
                    rows.value = rows.value.filter((r) => !ids.includes(r.id));
                    page.value = Math.min(
                        page.value,
                        Math.max(1, Math.ceil(filtered.value.length / pageSize.value)),
                    );
                    persist();
                    selected.value = [];
                    messages.success('演示记录已删除');
                } catch (_) {}
            }
            async function runBatch() {
                if (!selected.value.length || !batchAction.value) return;
                const ids = selected.value.map((row) => row.id);
                if (batchAction.value === 'delete') {
                    await remove(ids);
                    return;
                }
                const value = batchAction.value === 'enable' ? '正常' : '停用';
                const selectedIds = new Set(ids);
                rows.value.forEach((row) => {
                    if (selectedIds.has(row.id)) row.status = value;
                });
                persist();
                messages.success(
                    '已' + (value === '正常' ? '启用' : '停用') + ' ' + ids.length + ' 条演示记录',
                );
            }
            function restore() {
                if (!seedReady.value) return;
                rows.value = initial.value.map((r) => ({ ...r }));
                reset();
                persist();
                messages.success('演示数据已恢复');
            }
            function exportRows() {
                downloadCSV(
                    'AdminUI-演示用户.csv',
                    ['ID', '姓名', '邮箱', '角色', '状态'],
                    filtered.value.map((r) => [r.id, r.name, r.email, r.role, r.status]),
                );
            }
            return {
                rows,
                seedReady,
                loadingUsers,
                dataError,
                loadUsers,
                keyword,
                status,
                role,
                filters,
                filtersExpanded,
                page,
                pageSize,
                selected,
                batchAction,
                dialog,
                saving,
                filtered,
                visible,
                columns,
                model,
                fields,
                rules,
                search,
                reset,
                edit,
                rowCommand,
                save,
                remove,
                runBatch,
                restore,
                exportRows,
            };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    title="用户管理"
                    category="业务示例"
                    description="完整的筛选、分页与本地增删改查"
                >
                    <el-button @click="exportRows">
                        <a-icon name="download" :size="14" class="me-1" />
                        导出
                    </el-button>
                    <el-button
                        type="primary"
                        :disabled="loadingUsers || (!seedReady && !rows.length)"
                        @click="edit()"
                    >
                        <a-icon name="plus" :size="15" class="me-1" />
                        新增用户
                    </el-button>
                </a-page-header>
                <a-panel>
                    <a-filter-bar
                        class="demo-user-filters"
                        :class="{'is-expanded':filtersExpanded}"
                        @search="search"
                        @reset="reset"
                    >
                        <div>
                            <label for="user-keyword">用户关键词</label>
                            <el-input
                                id="user-keyword"
                                v-model="keyword"
                                placeholder="搜索姓名或邮箱"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="user-role">角色</label>
                            <el-select
                                id="user-role"
                                v-model="role"
                                placeholder="全部角色"
                                clearable
                            >
                                <el-option
                                    v-for="r in ['管理员','编辑','成员']"
                                    :label="r"
                                    :value="r"
                                />
                            </el-select>
                        </div>
                        <div>
                            <label for="user-status">状态</label>
                            <el-select
                                id="user-status"
                                v-model="status"
                                placeholder="全部状态"
                                clearable
                            >
                                <el-option label="正常" value="正常" />
                                <el-option label="停用" value="停用" />
                            </el-select>
                        </div>
                        <div>
                            <label for="filter-department">部门</label>
                            <el-input
                                id="filter-department"
                                v-model="filters.department"
                                placeholder="输入部门"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="filter-position">职位</label>
                            <el-input
                                id="filter-position"
                                v-model="filters.position"
                                placeholder="输入职位"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="filter-location">所在地</label>
                            <el-input
                                id="filter-location"
                                v-model="filters.location"
                                placeholder="输入所在地"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="filter-phone">手机号</label>
                            <el-input
                                id="filter-phone"
                                v-model="filters.phone"
                                placeholder="输入手机号"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="filter-id">用户 ID</label>
                            <el-input
                                id="filter-id"
                                v-model="filters.id"
                                placeholder="输入用户 ID"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="filter-email">邮箱</label>
                            <el-input
                                id="filter-email"
                                v-model="filters.email"
                                placeholder="输入邮箱"
                                clearable
                            />
                        </div>
                        <div>
                            <label for="filter-dateFrom">加入日期起</label>
                            <el-input
                                id="filter-dateFrom"
                                v-model="filters.dateFrom"
                                placeholder="选择开始日期"
                                clearable
                                type="date"
                            />
                        </div>
                        <div>
                            <label for="filter-dateTo">加入日期止</label>
                            <el-input
                                id="filter-dateTo"
                                v-model="filters.dateTo"
                                placeholder="选择结束日期"
                                clearable
                                type="date"
                            />
                        </div>
                        <div>
                            <label for="filter-lastLogin">最近登录</label>
                            <el-input
                                id="filter-lastLogin"
                                v-model="filters.lastLogin"
                                placeholder="选择登录日期"
                                clearable
                                type="date"
                            />
                        </div>
                        <template #actions>
                            <button
                                type="button"
                                class="demo-filter-toggle"
                                :aria-expanded="filtersExpanded"
                                @click="filtersExpanded=!filtersExpanded"
                            >
                                {{filtersExpanded?'收起':'展开'}}
                                <a-icon
                                    name="chevron"
                                    :size="14"
                                    :class="{'is-expanded':filtersExpanded}"
                                />
                            </button>
                        </template>
                    </a-filter-bar>
                </a-panel>
                <el-alert
                    v-if="dataError"
                    :title="dataError"
                    type="error"
                    :closable="false"
                    class="mb-3"
                >
                    <el-button size="small" @click="loadUsers">重试</el-button>
                </el-alert>
                <a-panel class="demo-table-panel">
                    <div class="demo-list-toolbar">
                        <div class="demo-list-toolbar-start">
                            <h2>用户列表</h2>
                            <div class="demo-batch-actions">
                                <el-select
                                    v-model="batchAction"
                                    size="small"
                                    placeholder="选择操作"
                                    aria-label="选择批量操作"
                                    popper-class="demo-batch-dropdown"
                                >
                                    <el-option label="启用" value="enable">
                                        <span class="demo-batch-option">
                                            <a-icon name="check" :size="15" />
                                            <span>启用</span>
                                        </span>
                                    </el-option>
                                    <el-option label="停用" value="disable">
                                        <span class="demo-batch-option">
                                            <a-icon name="close" :size="15" />
                                            <span>停用</span>
                                        </span>
                                    </el-option>
                                    <el-option label="删除" value="delete">
                                        <span class="demo-batch-option is-danger">
                                            <a-icon name="trash" :size="15" />
                                            <span>删除</span>
                                        </span>
                                    </el-option>
                                </el-select>
                                <el-button
                                    size="small"
                                    :disabled="!selected.length || !batchAction"
                                    @click="runBatch"
                                >
                                    批量操作
                                </el-button>
                                <small>已选择 {{selected.length}} 条</small>
                            </div>
                        </div>
                        <el-button
                            size="small"
                            text
                            :disabled="!seedReady || loadingUsers"
                            @click="restore"
                        >
                            恢复演示数据
                        </el-button>
                    </div>
                    <a-table
                        :rows="visible"
                        :columns="columns"
                        :loading="loadingUsers"
                        :total="filtered.length"
                        v-model:page="page"
                        v-model:page-size="pageSize"
                        :page-sizes="[8,10,20,50]"
                        :pager-count="5"
                        selectable
                        @selection-change="selected=$event"
                    >
                        <template #person="{row}">
                            <div class="demo-person">
                                <span class="demo-avatar">{{row.name.slice(0,1)}}</span>
                                <div>
                                    <strong>{{row.name}}</strong>
                                    <small>{{row.email}}</small>
                                </div>
                            </div>
                        </template>
                        <template #role="{value}"><span>{{value}}</span></template>
                        <template #status="{value}">
                            <span class="demo-pill" :class="{'is-paused':value==='停用'}">
                                <span class="aui-status-dot" v-if="value==='正常'"></span>
                                {{value}}
                            </span>
                        </template>
                        <template #actions="{row}">
                            <div class="demo-table-actions">
                                <el-button size="small" type="primary" plain @click="edit(row)">
                                    <a-icon name="edit" :size="14" />
                                    编辑
                                </el-button>
                                <el-button
                                    size="small"
                                    type="danger"
                                    plain
                                    @click="remove([row.id])"
                                >
                                    <a-icon name="trash" :size="14" />
                                    删除
                                </el-button>
                                <el-dropdown trigger="click" @command="rowCommand($event,row)">
                                    <el-button size="small">
                                        更多
                                        <a-icon name="chevron" :size="13" class="demo-more-arrow" />
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item command="details">
                                                查看详情
                                            </el-dropdown-item>
                                            <el-dropdown-item command="status">
                                                {{row.status==='正常'?'停用用户':'启用用户'}}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </template>
                    </a-table>
                    <template #footer>
                        所有记录均为演示数据，仅保存在当前浏览器，不关联真实账号或权限。
                    </template>
                </a-panel>
                <el-dialog
                    v-model="dialog"
                    :title="model.id?'编辑用户':'新增用户'"
                    class="demo-user-dialog"
                    width="min(480px,92vw)"
                    destroy-on-close
                >
                    <template #header>
                        <div class="demo-user-dialog-heading">
                            <strong>{{model.id?'编辑用户':'新增用户'}}</strong>
                            <span>填写用户的基本信息和访问状态</span>
                        </div>
                    </template>
                    <a-form
                        :model="model"
                        :fields="fields"
                        :rules="rules"
                        :loading="saving"
                        label-width="70px"
                        @submit="save"
                        @cancel="dialog=false"
                    />
                </el-dialog>
            </div>
        `,
    };
    function demoEditorUpload(type, file, callback) {
        const source = typeof file.getSource === 'function' ? file.getSource() : file;
        const blob = source instanceof Blob ? source : source && source.source;
        const name = file.name || (blob && blob.name) || 'file';
        if (!(blob instanceof Blob)) {
            callback.error('无法读取所选文件');
            return;
        }
        if (blob.size > 5 * 1024 * 1024) {
            callback.error('演示文件请小于 5 MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = () =>
            callback.success({
                state: 'SUCCESS',
                url: reader.result,
                original: name,
                title: name,
                size: blob.size,
                type: name.includes('.') ? '.' + name.split('.').pop() : '',
            });
        reader.onerror = () => callback.error('文件读取失败');
        reader.onprogress = (event) => {
            if (event.lengthComputable) callback.progress(event.loaded / event.total);
        };
        reader.readAsDataURL(blob);
    }
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Users = Users;
})(window);
