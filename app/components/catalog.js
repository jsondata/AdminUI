/* 组件示例仅使用本地状态。 */
(function () {
    const { ref, computed } = Vue;
    const specs = {
        grid: [
            '栅格布局',
            '响应式分栏与间距',
            /* HTML */ `
                <a-panel title="基础栅格" description="通过 24 栅格分配宽度">
                    <el-row :gutter="16">
                        <el-col v-for="i in 3" :key="i" :span="8">
                            <div class="catalog-grid-cell">8 / 24</div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" class="mt-3">
                        <el-col :span="6"><div class="catalog-grid-cell">6 / 24</div></el-col>
                        <el-col :span="18">
                            <div class="catalog-grid-cell is-light">18 / 24</div>
                        </el-col>
                    </el-row>
                </a-panel>
                <a-panel title="响应式栅格" description="窄屏单列，宽屏多列">
                    <el-row :gutter="16">
                        <el-col v-for="i in 4" :key="i" :xs="24" :sm="12" :lg="6">
                            <div class="catalog-grid-cell">区块 {{i}}</div>
                        </el-col>
                    </el-row>
                </a-panel>
            `,
        ],
        fields: [
            '表单元素',
            '文本、单选、多选和开关',
            /* HTML */ `
                <a-panel title="输入与选择">
                    <div class="catalog-stack">
                        <el-input v-model="text" placeholder="输入内容" clearable />
                        <el-input
                            v-model="longText"
                            type="textarea"
                            :rows="3"
                            placeholder="多行内容"
                        />
                        <el-radio-group v-model="choice">
                            <el-radio value="a">选项 A</el-radio>
                            <el-radio value="b">选项 B</el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-model="checks">
                            <el-checkbox value="news">新闻</el-checkbox>
                            <el-checkbox value="updates">更新</el-checkbox>
                        </el-checkbox-group>
                        <el-switch v-model="enabled" active-text="启用通知" />
                    </div>
                </a-panel>
            `,
        ],
        tabs: [
            '选项卡',
            '不同内容之间的切换',
            /* HTML */ `
                <a-panel title="基础选项卡">
                    <el-tabs v-model="tab">
                        <el-tab-pane label="概览" name="overview">查看项目的基本情况。</el-tab-pane>
                        <el-tab-pane label="成员" name="members">管理参与项目的成员。</el-tab-pane>
                        <el-tab-pane label="设置" name="settings">调整项目的显示设置。</el-tab-pane>
                    </el-tabs>
                </a-panel>
                <a-panel title="卡片标签">
                    <el-tabs type="card">
                        <el-tab-pane label="待处理">3 项任务待处理</el-tab-pane>
                        <el-tab-pane label="已完成">12 项任务已完成</el-tab-pane>
                    </el-tabs>
                </a-panel>
            `,
        ],
        progress: [
            '进度条',
            '线性与环形进度',
            /* HTML */ `
                <a-panel title="线性进度">
                    <div class="catalog-stack">
                        <el-progress :percentage="progress" />
                        <el-progress :percentage="progress" status="success" />
                        <el-slider v-model="progress" aria-label="调整进度" />
                    </div>
                </a-panel>
                <a-panel title="环形进度">
                    <div class="catalog-row">
                        <el-progress type="circle" :percentage="progress" />
                        <el-progress type="dashboard" :percentage="progress" />
                    </div>
                </a-panel>
            `,
        ],
        panel: [
            '面板',
            '内容容器与插槽',
            /* HTML */ `
                <div class="demo-component-grid">
                    <a-panel title="基础面板" description="可放置任意业务内容">
                        <p>面板提供统一的标题、正文和边界。</p>
                        <template #footer>面板底部区域</template>
                    </a-panel>
                    <a-panel title="操作面板">
                        <template #actions>
                            <el-button text type="primary" @click="message('操作已触发')">
                                更多
                            </el-button>
                        </template>
                        <p>右上角可以放置筛选、按钮等操作。</p>
                    </a-panel>
                </div>
            `,
        ],
        badge: [
            '徽章',
            '数量与状态提示',
            /* HTML */ `
                <a-panel title="徽章与标签">
                    <div class="catalog-row">
                        <el-badge :value="12"><el-button>消息</el-button></el-badge>
                        <el-badge is-dot><el-button>通知</el-button></el-badge>
                        <el-tag>进行中</el-tag>
                        <el-tag type="success">已完成</el-tag>
                        <el-tag type="warning">待审核</el-tag>
                        <el-tag type="danger">已停用</el-tag>
                    </div>
                </a-panel>
            `,
        ],
        timeline: [
            '时间线',
            '展示事件的先后顺序',
            /* HTML */ `
                <a-panel title="项目动态">
                    <el-timeline>
                        <el-timeline-item timestamp="今天 10:30" type="primary">
                            项目已创建
                        </el-timeline-item>
                        <el-timeline-item timestamp="昨天 15:20" type="success">
                            完成需求评审
                        </el-timeline-item>
                        <el-timeline-item timestamp="10 月 25 日">提交初始方案</el-timeline-item>
                    </el-timeline>
                </a-panel>
            `,
        ],
        animation: [
            '动画',
            '过渡与加载状态',
            /* HTML */ `
                <a-panel title="过渡效果">
                    <el-button @click="visible=!visible">{{visible?'隐藏':'显示'}}内容</el-button>
                    <transition name="el-fade-in-linear">
                        <div v-show="visible" class="catalog-transition">内容通过淡入淡出显示</div>
                    </transition>
                </a-panel>
                <a-panel title="加载占位"><el-skeleton :rows="3" animated /></a-panel>
            `,
        ],
        utility: [
            '辅助元素',
            '提示、分割线与空状态',
            /* HTML */ `
                <a-panel title="提示与分隔">
                    <el-alert title="操作已完成" type="success" :closable="false" show-icon />
                    <el-divider>说明</el-divider>
                    <el-alert title="请核对填写的信息" type="warning" :closable="false" show-icon />
                </a-panel>
                <a-panel title="空状态">
                    <a-empty title="暂无记录" description="添加记录后会显示在这里。">
                        <el-button type="primary" @click="message('演示操作')">添加记录</el-button>
                    </a-empty>
                </a-panel>
            `,
        ],
        dialog: [
            '通用弹层',
            '对话框、抽屉与消息',
            /* HTML */ `
                <a-panel title="弹层与反馈">
                    <div class="catalog-row">
                        <el-button type="primary" @click="dialog=true">打开对话框</el-button>
                        <el-button @click="drawer=true">打开抽屉</el-button>
                        <el-button @click="confirmAction">确认提示</el-button>
                        <el-button @click="message('这是一条提示消息')">消息提示</el-button>
                    </div>
                </a-panel>
                <el-dialog v-model="dialog" title="编辑信息" width="min(480px,92vw)">
                    <el-input v-model="text" placeholder="输入内容" />
                    <template #footer>
                        <el-button @click="dialog=false">取消</el-button>
                        <el-button type="primary" @click="dialog=false;message('已确认')">
                            确认
                        </el-button>
                    </template>
                </el-dialog>
                <el-drawer v-model="drawer" title="查看详情" size="min(400px,90vw)">
                    <p>抽屉适合展示与当前页面相关的详情。</p>
                </el-drawer>
            `,
        ],
        date: [
            '日期时间',
            '日期、日期范围和时间选择',
            /* HTML */ `
                <a-panel title="日期与时间">
                    <div class="catalog-stack">
                        <el-date-picker
                            v-model="date"
                            type="date"
                            placeholder="选择日期"
                            value-format="YYYY-MM-DD"
                        />
                        <el-date-picker
                            v-model="range"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD"
                        />
                        <el-time-picker
                            v-model="time"
                            placeholder="选择时间"
                            value-format="HH:mm:ss"
                        />
                        <p class="demo-doc-text">
                            日期：{{date || '未选择'}}；时间：{{time || '未选择'}}
                        </p>
                    </div>
                </a-panel>
            `,
        ],
        static_table: [
            '静态表格',
            '基础表格与状态',
            /* HTML */ `
                <a-panel title="静态表格">
                    <div class="report-table-wrap">
                        <table class="report-table">
                            <thead>
                                <tr>
                                    <th>项目</th>
                                    <th>负责人</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in rows" :key="row.id">
                                    <td>{{row.name}}</td>
                                    <td>{{row.owner}}</td>
                                    <td>{{row.status}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </a-panel>
            `,
        ],
        table: [
            '表格组件',
            '排序、选择与筛选',
            /* HTML */ `
                <a-panel title="数据表格" description="选择行或点击表头排序">
                    <el-table :data="rows" @selection-change="selected=$event">
                        <el-table-column type="selection" width="48" />
                        <el-table-column prop="name" label="项目" sortable />
                        <el-table-column prop="owner" label="负责人" />
                        <el-table-column prop="status" label="状态" />
                    </el-table>
                    <p class="demo-doc-text mt-3 mb-0">已选择 {{selected.length}} 条</p>
                </a-panel>
            `,
        ],
        pagination: [
            '分页',
            '页码、每页条数与数据联动',
            /* HTML */ `
                <a-panel title="分页示例">
                    <p>当前第 {{page}} 页，每页 {{pageSize}} 条</p>
                    <el-pagination
                        v-model:current-page="page"
                        v-model:page-size="pageSize"
                        :page-sizes="[5,10,20]"
                        :total="80"
                        layout="total, sizes, prev, pager, next"
                        background
                    />
                </a-panel>
            `,
        ],
        tree_table: [
            '树形表格',
            '展开层级与关联数据',
            /* HTML */ `
                <a-panel title="部门与成员">
                    <el-table
                        :data="treeRows"
                        row-key="id"
                        default-expand-all
                        :tree-props="{children:'children'}"
                    >
                        <el-table-column prop="name" label="部门 / 成员" />
                        <el-table-column prop="owner" label="负责人" />
                        <el-table-column prop="status" label="状态" />
                    </el-table>
                </a-panel>
            `,
        ],
        dropdown: [
            '下拉菜单',
            '操作菜单与命令回调',
            /* HTML */ `
                <a-panel title="更多操作">
                    <el-dropdown @command="message">
                        <el-button type="primary">操作菜单 ▾</el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="编辑">编辑</el-dropdown-item>
                                <el-dropdown-item command="复制">复制</el-dropdown-item>
                                <el-dropdown-item command="归档" divided>归档</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <p class="demo-doc-text mt-3 mb-0">选择菜单项后显示对应命令。</p>
                </a-panel>
            `,
        ],
        upload: [
            '文件上传',
            '本地选择和列表演示',
            /* HTML */ `
                <a-panel title="选择文件" description="仅展示本地选择，不上传到服务器">
                    <el-upload action="#" :auto-upload="false" v-model:file-list="files" multiple>
                        <el-button type="primary">选择文件</el-button>
                        <template #tip>
                            <div class="el-upload__tip">文件仅保留在当前页面，刷新后清空。</div>
                        </template>
                    </el-upload>
                </a-panel>
            `,
        ],
        transfer: [
            '穿梭框',
            '在两个列表间移动选项',
            /* HTML */ `
                <a-panel title="选择成员">
                    <el-transfer
                        v-model="chosen"
                        :data="transferData"
                        :titles="['可选成员','已选成员']"
                        filterable
                        filter-placeholder="搜索成员"
                    />
                    <p class="demo-doc-text mt-3 mb-0">已选择 {{chosen.length}} 项</p>
                </a-panel>
            `,
        ],
        tree: [
            '树形组件',
            '层级展开、选择与搜索',
            /* HTML */ `
                <a-panel title="组织结构">
                    <el-tree
                        :data="treeData"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        :props="{label:'label',children:'children'}"
                    />
                </a-panel>
            `,
        ],
        color: [
            '颜色选择器',
            '颜色和透明度',
            /* HTML */ `
                <a-panel title="选择颜色">
                    <div class="catalog-row">
                        <el-color-picker v-model="color" show-alpha />
                        <span>当前颜色：{{color || '未选择'}}</span>
                    </div>
                    <div
                        class="catalog-color-swatch"
                        :style="{background:color || 'transparent'}"
                    ></div>
                </a-panel>
            `,
        ],
        slider: [
            '滑块',
            '范围与步长',
            /* HTML */ `
                <a-panel title="调整数值">
                    <div class="catalog-stack">
                        <el-slider v-model="slider" show-input />
                        <el-slider v-model="rangeSlider" range :step="10" show-stops />
                        <p class="demo-doc-text">
                            当前值：{{slider}}；范围：{{rangeSlider.join(' - ')}}
                        </p>
                    </div>
                </a-panel>
            `,
        ],
        rate: [
            '评分',
            '评分选择与禁用状态',
            /* HTML */ `
                <a-panel title="评分">
                    <div class="catalog-stack">
                        <el-rate v-model="rating" show-score />
                        <el-rate :model-value="4" disabled show-score />
                        <p class="demo-doc-text">当前评分：{{rating}}</p>
                    </div>
                </a-panel>
            `,
        ],
        carousel: [
            '轮播',
            '切换展示内容',
            /* HTML */ `
                <a-panel title="轮播示例">
                    <el-carousel height="240px" :interval="5000">
                        <el-carousel-item
                            v-for="(label,i) in ['清晰的工作空间','专注每一项任务','让协作更简单']"
                            :key="label"
                        >
                            <div class="catalog-slide" :class="'slide-'+i">
                                <small>ADMINUI / 0{{i+1}}</small>
                                <strong>{{label}}</strong>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </a-panel>
            `,
        ],
        flow: [
            '流加载',
            '按需加载更多列表项',
            /* HTML */ `
                <a-panel title="动态列表">
                    <div class="catalog-flow">
                        <div v-for="i in count" :key="i">第 {{i}} 条演示记录</div>
                    </div>
                    <el-button
                        class="mt-3"
                        :disabled="count>=30"
                        @click="count=Math.min(count+5,30)"
                    >
                        {{count>=30?'已全部加载':'加载更多'}}
                    </el-button>
                </a-panel>
            `,
        ],
        code: [
            '代码展示',
            '代码块与复制',
            /* HTML */ `
                <a-panel title="代码示例">
                    <a-code :code="code" label="JavaScript" />
                    <p class="demo-doc-text mt-3 mb-0">代码作为文本展示，可在安全上下文中复制。</p>
                </a-panel>
            `,
        ],
    };
    const menu = [
        {
            title: '布局与展示',
            icon: 'layout_group',
            items: [
                'grid',
                'tabs',
                'progress',
                'panel',
                'badge',
                'timeline',
                'animation',
                'utility',
                'carousel',
            ],
        },
        {
            title: '输入与选择',
            icon: 'form_group',
            items: [
                'fields',
                'date',
                'dropdown',
                'upload',
                'transfer',
                'tree',
                'color',
                'slider',
                'rate',
            ],
        },
        {
            title: '数据与反馈',
            icon: 'data_group',
            items: ['dialog', 'static_table', 'table', 'pagination', 'tree_table', 'flow', 'code'],
        },
    ];
    const icons = {
        grid: 'grid_demo',
        fields: 'fields_demo',
        tabs: 'tabs_demo',
        progress: 'progress_demo',
        panel: 'panel_demo',
        badge: 'badge_demo',
        timeline: 'timeline_demo',
        animation: 'animation_demo',
        utility: 'utility_demo',
        dialog: 'dialog_demo',
        date: 'date_demo',
        static_table: 'static_demo',
        table: 'table_demo',
        pagination: 'pagination_demo',
        tree_table: 'tree_table_demo',
        dropdown: 'dropdown_demo',
        upload: 'upload_demo',
        transfer: 'transfer_demo',
        tree: 'tree_demo',
        color: 'color_demo',
        slider: 'slider_demo',
        rate: 'rate_demo',
        carousel: 'carousel_demo',
        flow: 'flow_demo',
        code: 'code_demo',
    };
    function build(key) {
        const [title, description, body] = specs[key];
        const extra = window.AdminUICatalogExtras[key];
        return {
            name: 'Catalog_' + key,
            setup() {
                const text = ref(''),
                    choice = ref('a'),
                    checks = ref(['news']),
                    enabled = ref(true),
                    tab = ref('overview'),
                    progress = ref(65),
                    visible = ref(true),
                    dialog = ref(false),
                    drawer = ref(false),
                    date = ref(''),
                    range = ref([]),
                    time = ref(''),
                    selected = ref([]),
                    page = ref(1),
                    longPage = ref(10),
                    pageSize = ref(10),
                    files = ref([]),
                    chosen = ref([2]),
                    color = ref('#3265f5'),
                    slider = ref(40),
                    rangeSlider = ref([20, 70]),
                    rating = ref(4),
                    count = ref(10);
                const rows = [
                    { id: 1, name: '产品设计', owner: '林然', status: '进行中' },
                    { id: 2, name: '内容运营', owner: '周晴', status: '待审核' },
                    { id: 3, name: '组件建设', owner: '许知远', status: '已完成' },
                ];
                const treeRows = [
                    {
                        id: 1,
                        name: '产品团队',
                        owner: '林然',
                        status: '正常',
                        children: [
                            { id: 11, name: '设计组', owner: '周晴', status: '正常' },
                            { id: 12, name: '研发组', owner: '许知远', status: '正常' },
                        ],
                    },
                    { id: 2, name: '运营团队', owner: '陈一', status: '正常' },
                ];
                const treeData = [
                    {
                        id: 1,
                        label: '产品团队',
                        children: [
                            { id: 11, label: '设计组' },
                            { id: 12, label: '研发组' },
                        ],
                    },
                    { id: 2, label: '运营团队', children: [{ id: 21, label: '内容组' }] },
                ];
                const transferData = ['林然', '周晴', '许知远', '陈一', '王宁'].map((label, i) => ({
                    key: i + 1,
                    label,
                }));
                const extraChoice = ref('a'),
                    extraChecks = ref(['news']),
                    extraEnabled = ref(true),
                    longText = ref(''),
                    extraText = ref(''),
                    password = ref(''),
                    website = ref(''),
                    remark = ref(''),
                    tabPosition = ref('top'),
                    collapse = ref(['one']),
                    badgeCount = ref(5),
                    expanded = ref(true),
                    month = ref(''),
                    tableQuery = ref(''),
                    dragFiles = ref([]),
                    chosen2 = ref([]),
                    treeSelected = ref('');
                const jumpPage = ref(10),
                    jumpSize = ref(10),
                    treeQuery = ref(''),
                    infiniteCount = ref(10),
                    comboForm = Vue.reactive({ name: '', email: '', type: '个人' });
                const filteredTree = computed(() => {
                    const q = treeQuery.value.trim().toLowerCase();
                    if (!q) return treeData;
                    return treeData
                        .map((group) => ({
                            ...group,
                            children: group.label.toLowerCase().includes(q)
                                ? group.children
                                : group.children.filter((child) =>
                                      child.label.toLowerCase().includes(q),
                                  ),
                        }))
                        .filter(
                            (group) =>
                                group.label.toLowerCase().includes(q) || group.children.length,
                        );
                });
                function loadOnScroll(event) {
                    const el = event.target;
                    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12)
                        infiniteCount.value = Math.min(40, infiniteCount.value + 5);
                }
                function submitCombo() {
                    if (!comboForm.name.trim() || !/^\S+@\S+\.\S+$/.test(comboForm.email)) {
                        ElementPlus.ElMessage.warning('请填写姓名和有效邮箱');
                        return;
                    }
                    ElementPlus.ElMessage.success('校验通过');
                }
                function resetCombo() {
                    Object.assign(comboForm, { name: '', email: '', type: '个人' });
                }
                const customDialog = ref(false),
                    quickRange = ref([]),
                    year = ref(''),
                    timeSlot = ref(''),
                    dateTimeRange = ref([]),
                    pictureFiles = ref([]),
                    previewOpen = ref(false),
                    previewUrl = ref(''),
                    progressFiles = ref([]),
                    uploadProgress = ref(0),
                    uploadRunning = ref(false);
                let uploadTimer;
                const dateShortcuts = [
                    {
                        text: '最近 7 天',
                        value: () => {
                            const end = new Date(),
                                start = new Date();
                            start.setDate(start.getDate() - 6);
                            return [start, end];
                        },
                    },
                    {
                        text: '最近 30 天',
                        value: () => {
                            const end = new Date(),
                                start = new Date();
                            start.setDate(start.getDate() - 29);
                            return [start, end];
                        },
                    },
                ];
                function previewPicture(file) {
                    previewUrl.value = file.url;
                    previewOpen.value = true;
                }
                function uploadExceeded() {
                    ElementPlus.ElMessage.warning('已达到文件数量上限');
                }
                function simulateUpload() {
                    if (!progressFiles.value.length || uploadRunning.value) return;
                    uploadProgress.value = 0;
                    uploadRunning.value = true;
                    uploadTimer = setInterval(() => {
                        uploadProgress.value = Math.min(100, uploadProgress.value + 10);
                        if (uploadProgress.value === 100) {
                            clearInterval(uploadTimer);
                            uploadRunning.value = false;
                        }
                    }, 150);
                }
                Vue.onUnmounted(() => clearInterval(uploadTimer));
                async function promptName() {
                    try {
                        const result = await ElementPlus.ElMessageBox.prompt(
                            '请输入项目名称',
                            '输入示例',
                            { inputPattern: /\S/, inputErrorMessage: '请输入名称' },
                        );
                        message('已输入：' + result.value);
                    } catch (_) {}
                }
                async function confirmDelete() {
                    try {
                        await ElementPlus.ElMessageBox.confirm(
                            '确定删除这条演示记录吗？',
                            '删除确认',
                            {
                                type: 'error',
                                confirmButtonText: '删除',
                                cancelButtonText: '取消',
                                confirmButtonClass: 'demo-delete-confirm-button',
                                customClass: 'demo-delete-confirm',
                            },
                        );
                        message('已确认删除');
                    } catch (_) {}
                }
                function showLoading() {
                    const loading = ElementPlus.ElLoading.service({ text: '处理中…' });
                    setTimeout(() => loading.close(), 900);
                }
                function notice() {
                    ElementPlus.ElNotification({
                        title: '通知',
                        message: '这是一条演示通知。',
                        type: 'success',
                    });
                }
                const filteredRows = computed(() =>
                    rows.filter((row) =>
                        row.name.toLowerCase().includes(tableQuery.value.trim().toLowerCase()),
                    ),
                );
                const transferDisabled = transferData.map((item) => ({
                    ...item,
                    disabled: item.key === 3,
                }));
                const htmlCode = '<div class="card">\n  <h2>项目概览</h2>\n</div>';
                const sampleCode = extra.code;
                function disablePast(date) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date.getTime() < today.getTime();
                }
                function notify(type) {
                    ElementPlus.ElMessage[type](
                        { success: '操作成功', warning: '请检查输入', error: '操作失败' }[type],
                    );
                }
                const code = "const options = {\n  title: 'AdminUI',\n  active: true\n};";
                function message(value) {
                    ElementPlus.ElMessage.info(String(value));
                }
                async function confirmAction() {
                    try {
                        await ElementPlus.ElMessageBox.confirm('确认执行这个演示操作？', '确认', {
                            type: 'warning',
                        });
                        ElementPlus.ElMessage.success('已确认');
                    } catch (_) {}
                }
                return {
                    text,
                    choice,
                    checks,
                    enabled,
                    tab,
                    progress,
                    visible,
                    dialog,
                    drawer,
                    date,
                    range,
                    time,
                    selected,
                    page,
                    longPage,
                    pageSize,
                    files,
                    chosen,
                    color,
                    slider,
                    rangeSlider,
                    rating,
                    count,
                    rows,
                    treeRows,
                    treeData,
                    transferData,
                    code,
                    message,
                    confirmAction,
                    extraChoice,
                    extraChecks,
                    extraEnabled,
                    longText,
                    extraText,
                    password,
                    website,
                    remark,
                    tabPosition,
                    collapse,
                    badgeCount,
                    expanded,
                    month,
                    tableQuery,
                    dragFiles,
                    chosen2,
                    treeSelected,
                    filteredRows,
                    transferDisabled,
                    htmlCode,
                    sampleCode,
                    disablePast,
                    notify,
                    customDialog,
                    quickRange,
                    year,
                    timeSlot,
                    dateTimeRange,
                    pictureFiles,
                    previewOpen,
                    previewUrl,
                    progressFiles,
                    uploadProgress,
                    uploadRunning,
                    dateShortcuts,
                    previewPicture,
                    uploadExceeded,
                    simulateUpload,
                    promptName,
                    confirmDelete,
                    showLoading,
                    notice,
                    jumpPage,
                    jumpSize,
                    treeQuery,
                    filteredTree,
                    infiniteCount,
                    loadOnScroll,
                    comboForm,
                    submitCombo,
                    resetCombo,
                };
            },
            template: /* HTML */ `
                <div>
                    <a-page-header
                        category="组件示例"
                        title="${title}"
                        description="${description}"
                    />
                    ${body}${extra.html}
                    <a-panel title="代码示例" description="可参考组件的基本接入方式">
                        <a-code :code="sampleCode" label="Vue 模板" />
                    </a-panel>
                </div>
            `,
        };
    }
    AdminUIPages.catalog = { specs, menu, icons, build };
})();
