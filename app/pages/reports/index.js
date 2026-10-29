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
        templateUrl: 'app/pages/reports/index.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Reports = Reports;
})(window);
