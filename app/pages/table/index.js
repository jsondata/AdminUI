/* 使用本地示例数据展示表格交互。 */
(function () {
    const { ref } = Vue;
    AdminUIPages.TableExamples = {
        name: 'TableExamples',
        setup() {
            const rows = ref([
                {
                    id: 1,
                    name: '内容运营',
                    owner: '林然',
                    department: '运营部',
                    city: '上海',
                    score: 86,
                    enabled: true,
                },
                {
                    id: 2,
                    name: '产品设计',
                    owner: '周晴',
                    department: '产品部',
                    city: '杭州',
                    score: 92,
                    enabled: true,
                },
                {
                    id: 3,
                    name: '数据分析',
                    owner: '许知远',
                    department: '研发部',
                    city: '北京',
                    score: 78,
                    enabled: false,
                },
            ]);
            const current = ref(null),
                selectedId = ref(null),
                selected = ref([]),
                keyword = ref(''),
                editing = ref(null),
                draft = ref('');
            const filtered = Vue.computed(() =>
                rows.value.filter((row) => row.name.includes(keyword.value.trim())),
            );
            function startEdit(row) {
                editing.value = row.id;
                draft.value = row.name;
            }
            function finishEdit(row) {
                const value = draft.value.trim();
                if (!value) {
                    ElementPlus.ElMessage.warning('名称不能为空');
                    return;
                }
                row.name = value;
                editing.value = null;
            }
            function cancelEdit() {
                editing.value = null;
            }
            function rowEvent(row) {
                ElementPlus.ElMessage.info('当前行：' + row.name);
            }
            const remoteRows = ref([]),
                remoteTotal = ref(0),
                remotePage = ref(1),
                remoteLoading = ref(false),
                remoteSize = ref(3);
            const mockResponse = {
                result: {
                    total: 7,
                    records: [
                        { uid: 101, title: '接口项目 A', owner: '林然' },
                        { uid: 102, title: '接口项目 B', owner: '周晴' },
                        { uid: 103, title: '接口项目 C', owner: '许知远' },
                        { uid: 104, title: '接口项目 D', owner: '陈一' },
                        { uid: 105, title: '接口项目 E', owner: '王宁' },
                        { uid: 106, title: '接口项目 F', owner: '李明' },
                        { uid: 107, title: '接口项目 G', owner: '沈言' },
                    ],
                },
            };
            function loadRemote() {
                remoteLoading.value = true;
                const { records, total } = mockResponse.result;
                remoteTotal.value = total;
                remoteRows.value = records
                    .slice(
                        (remotePage.value - 1) * remoteSize.value,
                        remotePage.value * remoteSize.value,
                    )
                    .map((item) => ({ id: item.uid, name: item.title, owner: item.owner }));
                remoteLoading.value = false;
            }
            Vue.watch([remotePage, remoteSize], () => {
                remotePage.value = Math.min(
                    remotePage.value,
                    Math.max(1, Math.ceil(mockResponse.result.total / remoteSize.value)),
                );
                loadRemote();
            });
            loadRemote();
            const parseCode = `// 将接口格式映射为表格所需的 rows 和 total
const { records, total } = response.result;
rows.value = records.map(item => ({
  id: item.uid, name: item.title, owner: item.owner
}));
// 真实服务端分页时，请求参数使用 page 和 pageSize。`;
            const code = `<el-table :data="rows" row-key="id" highlight-current-row
    @current-change="current = $event" @row-dblclick="onRow">
    <el-table-column label="项目" fixed="left">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="owner" label="负责人" />
    </el-table-column>
    <el-table-column label="组织信息">
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="city" label="城市" />
    </el-table-column>
</el-table>`;
            return {
                rows,
                current,
                selectedId,
                selected,
                keyword,
                filtered,
                editing,
                draft,
                startEdit,
                finishEdit,
                cancelEdit,
                rowEvent,
                code,
                remoteRows,
                remoteTotal,
                remotePage,
                remoteSize,
                remoteLoading,
                loadRemote,
                parseCode,
            };
        },
        templateUrl: 'app/pages/table/index.html',
    };
})();
