/* 使用本地演示数据展示 ECharts 图表。 */
(function () {
    const { ref, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } = Vue;
    let days = [];
    const colors = ['#16b8a6', '#438bfa', '#65bc87', '#f3ad68', '#dd7586'];
    function optionFor(item, dark, width) {
        const text = dark ? '#b9c5d9' : '#64748b',
            line = dark ? '#34425a' : '#e8edf3';
        if (item.type === 'map') {
            return {
                title: {
                    text: item.subtitle,
                    left: 12,
                    top: 6,
                    textStyle: { fontSize: 14, fontWeight: 500, color: text },
                },
                tooltip: {
                    trigger: 'item',
                    confine: true,
                    formatter: (p) => p.name + '<br/>演示值：' + p.value,
                },
                visualMap: {
                    min: 0,
                    max: 100,
                    left: 12,
                    bottom: 10,
                    calculable: true,
                    text: ['高', '低'],
                    textStyle: { color: text },
                    inRange: { color: ['#e6f3fa', '#63b6d3', '#1676ad'] },
                },
                series: [
                    {
                        type: 'map',
                        map: item.map,
                        roam: true,
                        scaleLimit: { min: 0.8, max: 5 },
                        layoutCenter: ['55%', '50%'],
                        layoutSize:
                            item.map === 'adminui-world' ? (width < 700 ? '90%' : '135%') : '95%',
                        itemStyle: { borderColor: dark ? '#7ca1b5' : '#fff', borderWidth: 0.6 },
                        emphasis: {
                            label: { show: true, color: '#172b46' },
                            itemStyle: { areaColor: '#f3b563' },
                        },
                        data: item.values,
                    },
                ],
            };
        }
        const base = {
            color: colors,
            animationDuration: 500,
            textStyle: { color: text },
            title: {
                text: item.subtitle,
                left: 12,
                top: 6,
                textStyle: { fontSize: 14, fontWeight: 500, color: text },
            },
            tooltip: { trigger: item.type === 'donut' ? 'item' : 'axis', confine: true },
            legend: { top: 38, left: 'center', textStyle: { color: text }, type: 'scroll' },
            grid: { left: 52, right: 24, top: 82, bottom: 38, containLabel: true },
        };
        if (item.type === 'scatterline' || item.type === 'scatter')
            return {
                ...base,
                xAxis: {
                    type: 'value',
                    name: '投入',
                    splitLine: { lineStyle: { color: line } },
                    axisLabel: { color: text },
                },
                yAxis: {
                    type: 'value',
                    name: '产出',
                    splitLine: { lineStyle: { color: line } },
                    axisLabel: { color: text },
                },
                series: item.series.map((data, i) => ({
                    name: item.names[i],
                    type: item.type === 'scatter' ? 'scatter' : 'line',
                    data,
                    symbolSize: item.type === 'scatter' ? 12 : 7,
                })),
            };
        if (item.type === 'log')
            return {
                ...base,
                xAxis: { type: 'category', data: days, axisLabel: { color: text } },
                yAxis: {
                    type: 'log',
                    logBase: 10,
                    axisLabel: { color: text },
                    splitLine: { lineStyle: { color: line } },
                },
                series: item.series.map((data, i) => ({
                    name: item.names[i],
                    type: 'line',
                    data,
                    symbol: 'circle',
                })),
            };
        if (item.type === 'dual')
            return {
                ...base,
                xAxis: { type: 'category', data: days, axisLabel: { color: text } },
                yAxis: [
                    {
                        type: 'value',
                        name: '访问量',
                        splitLine: { lineStyle: { color: line } },
                        axisLabel: { color: text },
                    },
                    {
                        type: 'value',
                        name: '转化率',
                        axisLabel: { color: text, formatter: '{value}%' },
                        splitLine: { show: false },
                    },
                ],
                series: [
                    { name: item.names[0], type: 'bar', data: item.series[0], barMaxWidth: 28 },
                    {
                        name: item.names[1],
                        type: 'line',
                        yAxisIndex: 1,
                        data: item.series[1],
                        smooth: true,
                    },
                ],
            };
        if (item.type === 'donut')
            return {
                ...base,
                legend: { ...base.legend, top: 38 },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '66%'],
                        center: ['50%', '58%'],
                        avoidLabelOverlap: true,
                        label: { color: text, formatter: '{b}  {d}%' },
                        data: item.names.map((name, i) => ({ name, value: item.series[i] })),
                    },
                ],
            };
        const category = {
            type: 'category',
            data: item.labels || days,
            axisLine: { lineStyle: { color: line } },
            axisTick: { show: false },
            axisLabel: { color: text },
            boundaryGap:
                item.type === 'bar' || item.type === 'stackbar' || item.type === 'horizontal',
        };
        const value = {
            type: 'value',
            axisLabel: { color: text, formatter: item.unit ? '{value} ' + item.unit : '{value}' },
            splitLine: { lineStyle: { color: line } },
            axisLine: { show: false },
        };
        return {
            ...base,
            xAxis: item.type === 'horizontal' ? value : category,
            yAxis: item.type === 'horizontal' ? category : value,
            series: item.series.map((data, i) => ({
                name: item.names[i],
                type: ['bar', 'stackbar', 'horizontal'].includes(item.type) ? 'bar' : 'line',
                data,
                smooth: item.type === 'smooth',
                stack: ['area', 'stackbar'].includes(item.type) ? 'total' : undefined,
                areaStyle: ['area', 'smooth'].includes(item.type)
                    ? { opacity: item.type === 'area' ? 0.3 : 0.12 }
                    : undefined,
                symbol: 'circle',
                symbolSize: 6,
                barMaxWidth: 26,
                emphasis: { focus: 'series' },
            })),
        };
    }
    AdminUIPages.Charts = {
        name: 'Charts',
        setup() {
            const nodes = ref([]),
                datasets = ref([]),
                loading = ref(true);
            let charts = [],
                observer,
                themeObserver,
                active = false,
                generation = 0,
                dataRequest;
            const mapError = ref('');
            async function loadData() {
                if (!dataRequest)
                    dataRequest = AdminUI.request('app/mock/charts.json')
                        .then((data) => {
                            if (!Array.isArray(data.days) || !Array.isArray(data.datasets))
                                throw new Error('图表数据格式错误');
                            days = data.days;
                            datasets.value = data.datasets;
                        })
                        .catch((error) => {
                            dataRequest = null;
                            throw error;
                        });
                return dataRequest;
            }
            function dispose() {
                charts.forEach((c) => c.dispose());
                charts = [];
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            }
            async function render() {
                // 页面切换或重复加载时，只允许最新一次请求渲染图表。
                const token = ++generation;
                if (!active || !window.echarts) return;
                loading.value = true;
                try {
                    await loadData();
                    await nextTick();
                    await Promise.all(
                        datasets.value
                            .filter((item) => item.type === 'map' && !echarts.getMap(item.map))
                            .map(async (item) => {
                                const geo = await AdminUI.request(item.file);
                                echarts.registerMap(item.map, geo);
                            }),
                    );
                    if (token === generation) mapError.value = '';
                } catch (e) {
                    if (token === generation)
                        mapError.value =
                            '图表数据加载失败，请检查 JSON 文件和静态服务器：' + e.message;
                } finally {
                    if (token === generation) loading.value = false;
                }
                if (!active || token !== generation || !datasets.value.length) return;
                dispose();
                const dark = document.documentElement.classList.contains('dark');
                charts = nodes.value.map((node, i) => {
                    const chart = echarts.init(node);
                    if (datasets.value[i].type !== 'map' || echarts.getMap(datasets.value[i].map))
                        chart.setOption(optionFor(datasets.value[i], dark, node.clientWidth));
                    return chart;
                });
                observer = new ResizeObserver((entries) =>
                    entries.forEach((e) => {
                        const index = nodes.value.indexOf(e.target),
                            chart = charts[index];
                        if (chart) {
                            chart.resize();
                            if (datasets.value[index]?.map === 'adminui-world')
                                chart.setOption({
                                    series: [
                                        { layoutSize: e.target.clientWidth < 700 ? '90%' : '135%' },
                                    ],
                                });
                        }
                    }),
                );
                nodes.value.forEach((node) => observer.observe(node));
            }
            onMounted(() => {
                active = true;
                render();
                themeObserver = new MutationObserver(() => render());
                themeObserver.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['class'],
                });
            });
            onActivated(() => {
                active = true;
                if (!charts.length) render();
                else charts.forEach((c) => c.resize());
            });
            onDeactivated(() => {
                active = false;
                dispose();
            });
            onUnmounted(() => {
                active = false;
                dispose();
                if (themeObserver) themeObserver.disconnect();
            });
            const code = `const chart = echarts.init(document.getElementById('chart'));
chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['访问量'] },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
    yAxis: { type: 'value' },
    series: [{ name: '访问量', type: 'line', smooth: true, data: [120, 200, 150, 260, 220] }]
});
// 容器尺寸变化时调用 chart.resize()；销毁页面时调用 chart.dispose()。`;
            return { datasets, nodes, code, mapError, loading, render };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    category="组件示例"
                    title="图表"
                    description="基于 ECharts 的常用图表示例，支持悬浮提示和图例切换"
                />
                <el-alert
                    v-if="mapError"
                    :title="mapError"
                    type="error"
                    :closable="false"
                    class="mb-3"
                >
                    <el-button size="small" @click="render">重试</el-button>
                </el-alert>
                <p v-if="loading && !datasets.length">正在加载图表数据…</p>
                <div class="demo-charts-grid">
                    <a-panel v-for="(item,i) in datasets" :key="item.title" :title="item.title">
                        <div
                            :ref="el => { if (el) nodes[i] = el }"
                            class="demo-echart"
                            :class="{'is-map':item.type==='map'}"
                            role="img"
                            :aria-label="item.title+'：'+item.subtitle"
                        ></div>
                    </a-panel>
                </div>
                <a-panel
                    title="接入示例"
                    description="ECharts 已在演示站本地加载；图表数据可替换为业务数据"
                >
                    <a-code :code="code" label="JavaScript" />
                </a-panel>
            </div>
        `,
    };
})();
