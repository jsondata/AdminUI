/* Independent ECharts examples, using local demo data. */
(function () {
  const { ref, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } = Vue;
  const days = ['周一','周二','周三','周四','周五','周六','周日'];
  const colors = ['#16b8a6','#438bfa','#65bc87','#f3ad68','#dd7586'];
  const datasets = [
    { title:'标准折线图', subtitle:'未来一周气温变化', type:'line', names:['最高气温','最低气温'], series:[[12,11,15,13,12,13,10],[1,-2,2,5,3,2,0]], unit:'°C' },
    { title:'堆积面积图', subtitle:'不同渠道访问趋势', type:'area', names:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎'], series:[[120,132,101,134,90,230,210],[220,182,191,234,290,330,310],[150,232,201,154,190,330,410],[320,332,301,334,390,430,410],[820,932,901,934,1290,1330,1320]] },
    { title:'多系列折线图', subtitle:'各渠道每日访问量', type:'line', names:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎'], series:[[120,132,101,134,90,230,210],[220,182,191,234,290,330,310],[150,232,201,154,190,330,410],[320,332,301,334,390,430,410],[820,932,901,934,1290,1330,1320]] },
    { title:'平滑面积图', subtitle:'近七日访问量', type:'smooth', names:['访问量','访客数'], series:[[180,240,210,320,280,390,350],[110,150,140,210,190,250,230]] },
    { title:'分组柱状图', subtitle:'各季度业务收入', type:'bar', names:['产品销售','服务收入'], labels:['第一季度','第二季度','第三季度','第四季度'], series:[[210,285,265,360],[140,190,225,280]] },
    { title:'堆积柱状图', subtitle:'各渠道每周贡献', type:'stackbar', names:['自然搜索','直接访问','社交媒体'], series:[[120,132,101,134,90,230,210],[220,182,191,234,290,330,310],[150,232,201,154,190,330,410]] },
    { title:'环形图', subtitle:'访问来源占比', type:'donut', names:['自然搜索','直接访问','社交媒体','其他'], series:[42,28,18,12] },
    { title:'横向条形图', subtitle:'项目完成数量', type:'horizontal', names:['项目数量'], labels:['设计','研发','运营','市场','支持'], series:[[68,85,52,73,40]] },
    { title:'双数值轴折线图', subtitle:'不等距数据对比', type:'scatterline', names:['数据 A','数据 B'], series:[[[1,8],[3,6],[7,11],[12,5],[18,9]],[[1,2],[4,4],[8,3],[13,7],[18,6]]] },
    { title:'对数轴', subtitle:'不同增长速度对比', type:'log', names:['系列 A','系列 B'], series:[[1,2,4,8,16,32,64],[1,3,9,27,81,243,729]] },
    { title:'双 Y 轴图表', subtitle:'访问量与转化率', type:'dual', names:['访问量','转化率'], series:[[320,400,380,500,460,560,610],[3.2,3.8,3.4,4.1,4.4,4.6,4.8]] },
    { title:'散点图', subtitle:'项目投入与产出', type:'scatter', names:['项目样本'], series:[[[10,18],[18,25],[25,20],[32,38],[40,35],[52,55],[62,49],[70,68],[82,73]]] },
    { title:'中国地图', subtitle:'各省级地区演示数据', type:'map', map:'adminui-china', file:'vendor/echarts/maps/china.json' },
    { title:'世界地图', subtitle:'各国家和地区演示数据', type:'map', map:'adminui-world', file:'vendor/echarts/maps/world.json' }
  ];
  function optionFor(item, dark, width) {
    const text = dark ? '#b9c5d9' : '#64748b', line = dark ? '#34425a' : '#e8edf3';
    if (item.type === 'map') {
      const features = echarts.getMap(item.map).geoJSON.features;
      return { title:{text:item.subtitle,left:12,top:6,textStyle:{fontSize:14,fontWeight:500,color:text}}, tooltip:{trigger:'item',confine:true,formatter:p=>p.name+'<br/>演示值：'+p.value}, visualMap:{min:0,max:100,left:12,bottom:10,calculable:true,text:['高','低'],textStyle:{color:text},inRange:{color:['#e6f3fa','#63b6d3','#1676ad']}}, series:[{type:'map',map:item.map,roam:true,scaleLimit:{min:0.8,max:5},layoutCenter:['55%','50%'],layoutSize:item.map==='adminui-world'?(width<700?'90%':'135%'):'95%',itemStyle:{borderColor:dark?'#7ca1b5':'#fff',borderWidth:0.6},emphasis:{label:{show:true,color:'#172b46'},itemStyle:{areaColor:'#f3b563'}},data:features.map((feature,i)=>({name:feature.properties.name,value:(i*37+17)%101}))}] };
    }
    const base = { color:colors, animationDuration:500, textStyle:{color:text}, title:{text:item.subtitle,left:12,top:6,textStyle:{fontSize:14,fontWeight:500,color:text}}, tooltip:{trigger:item.type==='donut'?'item':'axis', confine:true}, legend:{top:38,left:'center',textStyle:{color:text},type:'scroll'}, grid:{left:52,right:24,top:82,bottom:38,containLabel:true} };
    if(item.type==='scatterline'||item.type==='scatter') return {...base,xAxis:{type:'value',name:'投入',splitLine:{lineStyle:{color:line}},axisLabel:{color:text}},yAxis:{type:'value',name:'产出',splitLine:{lineStyle:{color:line}},axisLabel:{color:text}},series:item.series.map((data,i)=>({name:item.names[i],type:item.type==='scatter'?'scatter':'line',data,symbolSize:item.type==='scatter'?12:7}))};
    if(item.type==='log') return {...base,xAxis:{type:'category',data:days,axisLabel:{color:text}},yAxis:{type:'log',logBase:10,axisLabel:{color:text},splitLine:{lineStyle:{color:line}}},series:item.series.map((data,i)=>({name:item.names[i],type:'line',data,symbol:'circle'}))};
    if(item.type==='dual') return {...base,xAxis:{type:'category',data:days,axisLabel:{color:text}},yAxis:[{type:'value',name:'访问量',splitLine:{lineStyle:{color:line}},axisLabel:{color:text}},{type:'value',name:'转化率',axisLabel:{color:text,formatter:'{value}%'},splitLine:{show:false}}],series:[{name:item.names[0],type:'bar',data:item.series[0],barMaxWidth:28},{name:item.names[1],type:'line',yAxisIndex:1,data:item.series[1],smooth:true}]};
    if(item.type==='donut') return {...base, legend:{...base.legend,top:38}, series:[{type:'pie',radius:['40%','66%'],center:['50%','58%'],avoidLabelOverlap:true,label:{color:text,formatter:'{b}  {d}%'},data:item.names.map((name,i)=>({name,value:item.series[i]}))}]};
    const category = {type:'category',data:item.labels||days,axisLine:{lineStyle:{color:line}},axisTick:{show:false},axisLabel:{color:text},boundaryGap:item.type==='bar'||item.type==='stackbar'||item.type==='horizontal'};
    const value = {type:'value',axisLabel:{color:text,formatter:item.unit?'{value} '+item.unit:'{value}'},splitLine:{lineStyle:{color:line}},axisLine:{show:false}};
    return {...base,xAxis:item.type==='horizontal'?value:category,yAxis:item.type==='horizontal'?category:value,series:item.series.map((data,i)=>({name:item.names[i],type:['bar','stackbar','horizontal'].includes(item.type)?'bar':'line',data, smooth:item.type==='smooth',stack:['area','stackbar'].includes(item.type)?'total':undefined,areaStyle:['area','smooth'].includes(item.type)?{opacity:item.type==='area'?0.3:0.12}:undefined,symbol:'circle',symbolSize:6,barMaxWidth:26,emphasis:{focus:'series'}}))};
  }
  AdminUIDemo.Charts = {
    name:'Charts',
    setup() {
      const nodes=ref([]); let charts=[], observer, themeObserver, active=false, generation=0; const mapError=ref('');
      function dispose(){charts.forEach(c=>c.dispose()); charts=[]; if(observer){observer.disconnect();observer=null;}}
      async function render(){const token=++generation; await nextTick(); if(!active || !window.echarts)return; try { await Promise.all(datasets.filter(item=>item.type==='map'&&!echarts.getMap(item.map)).map(async item=>{const response=await fetch(item.file);if(!response.ok)throw new Error('地图数据加载失败');echarts.registerMap(item.map,await response.json());})); mapError.value=''; } catch(e) { mapError.value='地图数据加载失败，请通过本地服务器访问并检查地图文件。'; } if(!active || token!==generation)return; dispose(); const dark=document.documentElement.classList.contains('dark'); charts=nodes.value.map((node,i)=>{const chart=echarts.init(node);if(datasets[i].type!=='map'||echarts.getMap(datasets[i].map))chart.setOption(optionFor(datasets[i],dark,node.clientWidth));return chart;}); observer=new ResizeObserver(entries=>entries.forEach(e=>{const index=nodes.value.indexOf(e.target), chart=charts[index];if(chart){chart.resize();if(datasets[index]?.map==='adminui-world')chart.setOption({series:[{layoutSize:e.target.clientWidth<700?'90%':'135%'}]});}}));nodes.value.forEach(node=>observer.observe(node));}
      onMounted(()=>{active=true;render();themeObserver=new MutationObserver(()=>render());themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});});
      onActivated(()=>{active=true;if(!charts.length)render();else charts.forEach(c=>c.resize());});
      onDeactivated(()=>{active=false;dispose();});
      onUnmounted(()=>{active=false;dispose();if(themeObserver)themeObserver.disconnect();});
      const code=`const chart = echarts.init(document.getElementById('chart'));\nchart.setOption({\n  tooltip: { trigger: 'axis' },\n  legend: { data: ['访问量'] },\n  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },\n  yAxis: { type: 'value' },\n  series: [{ name: '访问量', type: 'line', smooth: true, data: [120, 200, 150, 260, 220] }]\n});\n// 容器尺寸变化时调用 chart.resize()；销毁页面时调用 chart.dispose()。`;
      return { datasets,nodes,code,mapError };
    },
    template:`<div><a-page-header category="组件示例" title="图表" description="基于 ECharts 的常用图表示例，支持悬浮提示和图例切换"/><el-alert v-if="mapError" :title="mapError" type="error" :closable="false" class="mb-3"/><div class="demo-charts-grid"><a-panel v-for="(item,i) in datasets" :key="item.title" :title="item.title"><div :ref="el => { if (el) nodes[i] = el }" class="demo-echart" :class="{'is-map':item.type==='map'}" role="img" :aria-label="item.title+'：'+item.subtitle"></div></a-panel></div><a-panel title="接入示例" description="ECharts 已在演示站本地加载；图表数据可替换为业务数据"><a-code :code="code" label="JavaScript"/></a-panel></div>`
  };
})();
