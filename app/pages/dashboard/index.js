/* Dashboard 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Dashboard = {
        name: 'Dashboard',
        setup() {
            const ws = AdminUI.useWorkspace(),
                period = ref('本周');
            const series = ref({}),
                totals = ref({}),
                projects = ref([]),
                shortcuts = ref([]),
                stats = ref([]),
                dashboardError = ref(''),
                dashboardLoading = ref(false);
            let dashboardController;
            async function loadDashboard() {
                if (dashboardLoading.value) return;
                dashboardLoading.value = true;
                dashboardError.value = '';
                dashboardController = new AbortController();
                try {
                    const data = await AdminUI.request('app/mock/dashboard.json', {
                        signal: dashboardController.signal,
                    });
                    if (
                        !data.series ||
                        !data.totals ||
                        !Array.isArray(data.projects) ||
                        !Array.isArray(data.shortcuts) ||
                        !Array.isArray(data.stats)
                    )
                        throw new Error('工作台数据格式错误');
                    series.value = data.series;
                    totals.value = data.totals;
                    projects.value = data.projects;
                    shortcuts.value = data.shortcuts;
                    stats.value = data.stats;
                } catch (error) {
                    if (!dashboardController.signal.aborted)
                        dashboardError.value = '工作台数据加载失败：' + error.message;
                } finally {
                    dashboardLoading.value = false;
                }
            }
            Vue.onMounted(loadDashboard);
            Vue.onBeforeUnmount(() => dashboardController?.abort());
            const line = computed(() =>
                (series.value[period.value] || [])
                    .map((n, i) => `${i ? 'L' : 'M'}${46 + i * 42},${201 - n * 0.82}`)
                    .join(' '),
            );
            const area = computed(() => (line.value ? line.value + ' L592,204 L46,204 Z' : ''));
            function exportReport() {
                downloadCSV(
                    'AdminUI-演示报表.csv',
                    ['周期', '访问量', '数据说明'],
                    Object.entries(totals.value).map(([k, v]) => [k, v, '本地演示数据']),
                );
                messages.success('演示报表已导出');
            }
            return {
                ws,
                period,
                line,
                area,
                totals,
                projects,
                shortcuts,
                stats,
                dashboardError,
                dashboardLoading,
                loadDashboard,
                exportReport,
            };
        },
        templateUrl: 'app/pages/dashboard/index.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Dashboard = Dashboard;
})(window);
