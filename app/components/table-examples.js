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
        template: /* HTML */ `
            <div>
                <a-page-header
                    category="组件示例"
                    title="表格组件"
                    description="排序、选择、固定列、复杂表头和行内编辑"
                />
                <a-panel title="基础表格" description="单选当前行、点击表头排序，双击行查看提示">
                    <div class="catalog-row">
                        <el-input
                            v-model="keyword"
                            clearable
                            placeholder="搜索项目名称"
                            aria-label="搜索项目名称"
                            style="max-width:240px"
                        />
                        <span>
                            当前行：{{current ? current.name : '未选择'}} · 已勾选
                            {{selected.length}} 项
                        </span>
                    </div>
                    <el-table
                        :data="filtered"
                        row-key="id"
                        highlight-current-row
                        @selection-change="selected=$event"
                        @current-change="current=$event"
                        @row-dblclick="rowEvent"
                        :default-sort="{prop:'score',order:'descending'}"
                    >
                        <el-table-column type="selection" width="48" />
                        <el-table-column label="单选" width="70">
                            <template #default="{row}">
                                <el-radio
                                    v-model="selectedId"
                                    :value="row.id"
                                    :aria-label="'选择'+row.name"
                                >
                                    <span class="visually-hidden">{{row.name}}</span>
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="项目名称" min-width="150" />
                        <el-table-column prop="owner" label="负责人" min-width="110" />
                        <el-table-column prop="score" label="评分" sortable min-width="100" />
                        <el-table-column prop="department" label="部门" min-width="110" />
                    </el-table>
                </a-panel>
                <a-panel title="复杂表头与固定列" description="窄屏可横向滚动，首尾列保持可见">
                    <el-table :data="rows" row-key="id" border>
                        <el-table-column label="项目" fixed="left">
                            <el-table-column prop="name" label="名称" width="180" />
                            <el-table-column prop="owner" label="负责人" width="130" />
                        </el-table-column>
                        <el-table-column label="组织信息">
                            <el-table-column prop="department" label="部门" width="160" />
                            <el-table-column prop="city" label="城市" width="160" />
                        </el-table-column>
                        <el-table-column label="评估">
                            <el-table-column prop="score" label="评分" width="150" sortable />
                            <el-table-column label="状态" width="140">
                                <template #default="{row}">
                                    <el-tag :type="row.enabled?'success':'info'">
                                        {{row.enabled?'启用':'停用'}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="100">
                            <template #default="{row}">
                                <el-button type="primary" text @click="rowEvent(row)">
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </a-panel>
                <a-panel
                    title="单元格编辑与行内表单"
                    description="双击名称编辑，按 Enter 保存、Esc 取消；切换开关直接更新演示数据"
                >
                    <el-table :data="rows" row-key="id" border>
                        <el-table-column label="项目名称" min-width="200">
                            <template #default="{row}">
                                <el-input
                                    v-if="editing===row.id"
                                    v-model="draft"
                                    size="small"
                                    @keyup.enter="finishEdit(row)"
                                    @keyup.esc="cancelEdit"
                                />
                                <button
                                    v-else
                                    type="button"
                                    class="demo-editable-cell"
                                    @dblclick="startEdit(row)"
                                    :aria-label="'双击编辑'+row.name"
                                >
                                    {{row.name}}
                                    <a-icon name="edit" :size="14" />
                                </button>
                            </template>
                        </el-table-column>
                        <el-table-column label="评分" min-width="150">
                            <template #default="{row}">
                                <el-input-number
                                    v-model="row.score"
                                    :min="0"
                                    :max="100"
                                    size="small"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="启用" min-width="100">
                            <template #default="{row}">
                                <el-switch v-model="row.enabled" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template #default="{row}">
                                <template v-if="editing===row.id">
                                    <el-button type="primary" text @click="finishEdit(row)">
                                        保存
                                    </el-button>
                                    <el-button text @click="cancelEdit">取消</el-button>
                                </template>
                                <el-button v-else type="primary" text @click="startEdit(row)">
                                    编辑名称
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </a-panel>
                <a-panel
                    title="接口格式解析与分页"
                    description="本地模拟接口响应，将 records 映射为表格数据；真实服务端需传入页码与每页数量"
                >
                    <template #actions>
                        <el-button @click="loadRemote">重新加载</el-button>
                    </template>
                    <el-table :data="remoteRows" v-loading="remoteLoading" row-key="id">
                        <el-table-column prop="id" label="编号" />
                        <el-table-column prop="name" label="项目" />
                        <el-table-column prop="owner" label="负责人" />
                    </el-table>
                    <div class="demo-remote-pagination">
                        <el-pagination
                            v-model:current-page="remotePage"
                            v-model:page-size="remoteSize"
                            :page-sizes="[3,5,10]"
                            :total="remoteTotal"
                            layout="total, sizes, prev, pager, next"
                            background
                        />
                    </div>
                    <a-code :code="parseCode" label="数据解析" />
                </a-panel>
                <a-panel title="代码示例"><a-code :code="code" label="Vue 模板" /></a-panel>
            </div>
        `,
    };
})();
