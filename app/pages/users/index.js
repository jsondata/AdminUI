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
        templateUrl: 'app/pages/users/index.html',
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
