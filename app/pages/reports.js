/* Reports 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Reports = {
        name: 'Reports',
        setup() {
            const period = ref('本周');
            const datasets = ref({}),
                reportError = ref(''),
                reportLoading = ref(false);
            let reportController;
            async function loadReport() {
                if (reportLoading.value) return;
                reportLoading.value = true;
                reportError.value = '';
                reportController = new AbortController();
                try {
                    const data = await AdminUI.request('app/mock/reports.json', {
                        signal: reportController.signal,
                    });
                    if (!data || typeof data !== 'object' || Array.isArray(data))
                        throw new Error('报表数据格式错误');
                    datasets.value = data;
                } catch (error) {
                    if (!reportController.signal.aborted)
                        reportError.value = '报表数据加载失败：' + error.message;
                } finally {
                    reportLoading.value = false;
                }
            }
            Vue.onMounted(loadReport);
            Vue.onBeforeUnmount(() => reportController?.abort());
            const rows = computed(() => datasets.value[period.value] || []);
            const total = computed(() => rows.value.reduce((sum, row) => sum + row.visits, 0));
            function exportRows() {
                downloadCSV(
                    'AdminUI-渠道报表.csv',
                    ['周期', '渠道', '访问量', '访客数', '转化率'],
                    rows.value.map((r) => [period.value, r.name, r.visits, r.users, r.rate]),
                );
            }
            return { period, rows, total, exportRows, reportError, reportLoading, loadReport };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    title="数据报表"
                    category="业务示例"
                    description="按渠道查看访问与转化情况"
                >
                    <el-button @click="exportRows">
                        <a-icon name="download" :size="14" class="me-1" />
                        导出 CSV
                    </el-button>
                </a-page-header>
                <el-alert
                    v-if="reportError"
                    :title="reportError"
                    type="error"
                    :closable="false"
                    class="mb-3"
                >
                    <el-button size="small" @click="loadReport">重试</el-button>
                </el-alert>
                <a-panel title="渠道概览" description="选择统计周期查看对应的演示数据">
                    <template #actions>
                        <div class="demo-chart-period">
                            <button
                                v-for="p in ['本周','本月','全年']"
                                :class="{'is-active':period===p}"
                                @click="period=p"
                            >
                                {{p}}
                            </button>
                        </div>
                    </template>
                    <div class="report-summary">
                        <span>
                            总访问量
                            <strong>{{total.toLocaleString()}}</strong>
                        </span>
                        <span>
                            渠道数
                            <strong>{{rows.length}}</strong>
                        </span>
                        <span>
                            统计周期
                            <strong>{{period}}</strong>
                        </span>
                    </div>
                    <div class="report-channels">
                        <div v-for="row in rows" class="report-channel">
                            <span>{{row.name}}</span>
                            <div class="report-track">
                                <i :style="{width:(row.visits/total*100)+'%'}"></i>
                            </div>
                            <strong>{{row.visits.toLocaleString()}}</strong>
                            <small>{{(row.visits/total*100).toFixed(1)}}%</small>
                        </div>
                    </div>
                </a-panel>
                <a-panel title="渠道明细" description="访问量、访客数与转化率">
                    <div class="report-table-wrap">
                        <table class="report-table">
                            <thead>
                                <tr>
                                    <th>来源渠道</th>
                                    <th>访问量</th>
                                    <th>访客数</th>
                                    <th>转化率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in rows">
                                    <td>{{row.name}}</td>
                                    <td>{{row.visits.toLocaleString()}}</td>
                                    <td>{{row.users.toLocaleString()}}</td>
                                    <td>{{row.rate}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </a-panel>
            </div>
        `,
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Reports = Reports;
})(window);
