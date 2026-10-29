/* AdminUI 0.2.0 · MIT · Browser global, no build step. */
(function (global) {
  'use strict';
  const V = global.Vue;
  const { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted, provide, inject } = V;
  const workspaceKey = Symbol('AdminUI.workspace');
  const paths = {
    layout_group: 'M3 4h18v16H3z M3 9h18 M9 9v11',
    form_group: 'M5 3h14v18H5z M8 8h8 M8 12h8 M8 16h5',
    data_group: 'M4 5h16v14H4z M4 10h16 M10 10v9',
    grid_demo: 'M3 3h5v5H3z M10 3h5v5h-5z M17 3h4v5h-4z M3 10h5v5H3z M10 10h5v5h-5z M17 10h4v5h-4z M3 17h5v4H3z M10 17h5v4h-5z M17 17h4v4h-4z',
    fields_demo: 'M4 5h16v5H4z M4 14h7v5H4z M14 14h6v5h-6z',
    tabs_demo: 'M3 8h18v12H3z M4 8V4h6v4 M12 8V4h6v4',
    progress_demo: 'M3 9h18v6H3z M6 12h8',
    panel_demo: 'M4 4h16v16H4z M4 8h16 M7 12h7',
    badge_demo: 'M12 3l2 3 4 1 1 4 2 2-2 3-1 4-4 1-2 2-3-2-4-1-1-4-2-3 2-2 1-4 4-1z',
    timeline_demo: 'M6 4v16 M4 6h4 M4 12h4 M4 18h4 M12 6h8 M12 12h6 M12 18h8',
    animation_demo: 'M4 12h4 M6 7h4 M6 17h4 M14 5l7 7-7 7',
    utility_demo: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 10v6 M12 7h.01',
    dialog_demo: 'M4 5h16v11H9l-5 4z M8 9h8 M8 12h5',
    date_demo: 'M4 6h16v14H4z M7 3v6 M17 3v6 M4 10h16 M8 14h3 M13 14h3 M8 17h3',
    static_demo: 'M4 4h16v16H4z M4 9h16 M4 14h16 M10 9v11',
    table_demo: 'M3 5h18v14H3z M3 10h18 M9 10v9 M15 10v9',
    pagination_demo: 'M3 9l-3 3 3 3 M7 8h4v8H7z M14 8h4v8h-4z M21 9l3 3-3 3',
    tree_table_demo: 'M4 4h16v16H4z M8 7v9h4 M12 11h5 M12 16h5',
    dropdown_demo: 'M4 5h16v5H4z M8 14l4 4 4-4',
    upload_demo: 'M12 15V3 M8 7l4-4 4 4 M4 14v6h16v-6',
    transfer_demo: 'M3 6h7v12H3z M14 6h7v12h-7z M10 10h4 M12 8l2 2-2 2 M14 14h-4',
    tree_demo: 'M12 3v5 M5 11v-3h14v3 M2 12h6v6H2z M16 12h6v6h-6z M9 2h6v5H9z',
    color_demo: 'M12 3a9 9 0 1 0 0 18h1a3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4 M7 8h.01 M10 6h.01 M15 6h.01',
    slider_demo: 'M3 7h18 M8 4v6 M3 17h18 M16 14v6',
    rate_demo: 'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
    carousel_demo: 'M4 5h16v14H4z M2 10l-2 2 2 2 M22 10l2 2-2 2 M8 21h8',
    flow_demo: 'M5 5h14 M5 9h14 M5 13h14 M12 16v5 M9 18l3 3 3-3',
    code_demo: 'M8 6l-5 6 5 6 M16 6l5 6-5 6 M14 3l-4 18',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    home: 'M3 11l9-8 9 8 M5 10v10h14V10 M9 20v-6h6v6',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M4 21v-1a8 8 0 0 1 16 0v1',
    sliders: 'M4 7h16 M4 17h16 M8 4v6 M16 14v6',
    panels: 'M4 4h16v16H4z M4 9h16 M10 9v11',
    list: 'M8 4H5v17h14V4h-3 M9 3h6v3H9z M8 10h8 M8 14h8 M8 18h5',
    file: 'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',
    overview: 'M4 4h16v16H4z M4 10h16 M12 10v10',
    login: 'M14 4h5v16h-5 M3 12h12 M11 8l4 4-4 4',
    register: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M2 21a7 7 0 0 1 14 0 M19 10v6 M16 13h6',
    lock: 'M6 10h12v10H6z M8 10V7a4 4 0 0 1 8 0v3 M12 14v2',
    missing: 'M5 3h9l5 5v13H5z M14 3v5h5 M9 13l6 5 M15 13l-6 5',
    server: 'M4 4h16v6H4z M4 14h16v6H4z M7 7h.01 M7 17h.01 M11 7h6 M11 17h6',
    network: 'M12 3v5 M5 16v-3h14v3 M2 16h6v5H2z M9 3h6v5H9z M16 16h6v5h-6z',
    chart: 'M4 4v16h16 M8 15l4-5 4 3 4-7', users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    layers: 'M12 3L2 8l10 5 10-5-10-5 M2 12l10 5 10-5 M2 16l10 5 10-5',
    form: 'M9 5h11 M9 12h11 M9 19h11 M3 5h1 M3 12h1 M3 19h1',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',
    book: 'M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V3 M4 17h16 M8 7h8 M8 11h6',
    menu: 'M4 6h16 M4 12h16 M4 18h16', search: 'M21 21l-5-5 M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
    refresh: 'M20 7v5h-5 M4 17v-5h5 M5 7a8 8 0 0 1 13-2l2 3 M4 16l2 3a8 8 0 0 0 13-2',
    chevron: 'M9 5l7 7-7 7', arrow: 'M5 12h14 M14 7l5 5-5 5', plus: 'M12 5v14 M5 12h14',
    edit: 'M4 20l4-.8L19 8l-3-3L5 16z M14 7l3 3',
    trash: 'M4 7h16 M10 11v6 M14 11v6 M6 7l1 13h10l1-13 M9 7V4h6v3',
    check: 'M5 12l4 4L19 6', close: 'M6 6l12 12 M6 18L18 6', code: 'M8 5l-6 7 6 7 M16 5l6 7-6 7 M14 3l-4 18',
    sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1',
    moon: 'M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10', box: 'M12 3l9 5v9l-9 5-9-5V8l9-5 M3 8l9 5 9-5 M12 13v9',
    download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2',
    shield: 'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3 M8 12l3 3 5-6', external: 'M14 3h7v7 M21 3L10 14 M10 3H3v18h18v-7'
  };
  const AIcon = { props: { name: { default: 'grid' }, size: { default: 20 } }, template: '<svg :width="size" :height="size" class="aui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="path"/></svg>', setup: p => ({ path: computed(() => paths[p.name] || paths.grid) }) };
  const APageHeader = { props: ['title', 'description', 'category'], template: '<div class="aui-page-heading"><div class="aui-page-heading-main"><span v-if="category" class="aui-category">{{category}}</span><h1>{{title}}</h1><p v-if="description">{{description}}</p></div><div class="aui-heading-actions"><slot/></div></div>' };
  const APanel = { props: ['title', 'description'], template: '<section class="aui-panel"><header v-if="title || $slots.actions" class="aui-panel-header"><div><h2>{{title}}</h2><p v-if="description">{{description}}</p></div><div class="aui-panel-actions"><slot name="actions"/></div></header><div class="aui-panel-body"><slot/></div><footer v-if="$slots.footer" class="aui-panel-footer"><slot name="footer"/></footer></section>' };
  const AStatCard = { props: ['label', 'value', 'change', 'hint', 'icon', 'tone'], template: '<article class="aui-stat"><div class="aui-stat-top"><span>{{label}}</span><span class="aui-stat-icon" :class="\'is-\'+(tone||\'blue\')"><a-icon :name="icon||\'chart\'"/></span></div><div class="aui-stat-value">{{value}}</div><div class="aui-stat-bottom"><span v-if="change" class="aui-stat-change" :class="tone===\'red\'?\'is-negative\':\'\'">{{change}}</span><span>{{hint}}</span></div><slot/></article>' };
  const AFilterBar = { emits: ['search', 'reset'], template: '<form class="aui-filter-bar" @submit.prevent="$emit(\'search\')"><div class="aui-filter-fields"><slot/></div><div class="aui-filter-actions"><el-button type="primary" native-type="submit">查询</el-button><el-button @click="$emit(\'reset\')">重置</el-button><slot name="actions"/></div></form>' };
  const AEmpty = { props: { title: { default: '暂无数据' }, description: { default: '试试调整筛选条件，或添加一条新记录。' } }, template: '<div class="aui-empty"><span class="aui-empty-icon"><a-icon name="box" :size="32"/></span><h3>{{title}}</h3><p>{{description}}</p><slot/></div>' };
  const ACode = { props: ['code', 'label'], setup(p) { const copied = ref(false), error = ref(''); let timer; onUnmounted(() => clearTimeout(timer)); async function copy() { try { if (!navigator.clipboard) throw new Error('当前浏览器不支持剪贴板，请直接选择代码复制'); await navigator.clipboard.writeText(p.code || ''); copied.value = true; timer = setTimeout(() => copied.value = false, 1800); } catch (e) { error.value = e.message; } } return { copy, copied, error }; }, template: '<div class="aui-code"><div class="aui-code-head"><span>{{label||\'HTML / JavaScript\'}}</span><button @click="copy">{{copied?\'已复制\':\'复制代码\'}}</button></div><pre><code>{{code}}</code></pre><p v-if="error" class="aui-code-error" role="status">{{error}}</p></div>' };
  // Schema table keeps pagination and selection explicit so it supports local or remote data.
  const ATable = {
    props: { rows: { default: () => [] }, columns: { default: () => [] }, total: Number, page: { default: 1 }, pageSize: { default: 10 }, pagerCount: { type: Number, default: 7 }, pageSizes: { type: Array, default: () => [] }, loading: Boolean, selectable: Boolean, rowKey: { default: 'id' } },
    emits: ['update:page', 'update:pageSize', 'selection-change', 'sort-change'],
    template: `<div class="aui-table"><el-table :data="rows" :row-key="rowKey" v-loading="loading" @selection-change="$emit('selection-change',$event)" @sort-change="$emit('sort-change',$event)"><el-table-column v-if="selectable" type="selection" width="48"/><el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth||100" :sortable="col.sortable||false" :align="col.align||'left'"><template #default="scope"><slot :name="col.prop" :row="scope.row" :value="scope.row[col.prop]" :index="scope.$index">{{scope.row[col.prop] ?? '—'}}</slot></template></el-table-column><template #empty><a-empty title="没有符合条件的记录" description="调整筛选条件后重试。"/></template></el-table><div v-if="total !== undefined" class="aui-pagination"><el-pagination background :total="total" :current-page="page" :page-size="pageSize" :pager-count="pagerCount" layout="prev, pager, next" @update:current-page="$emit('update:page',$event)"/><div class="aui-pagination-info"><span>共 {{total}} 条记录</span><el-pagination v-if="pageSizes.length" :total="total" :page-size="pageSize" :page-sizes="pageSizes" layout="sizes" @update:page-size="$emit('update:pageSize',$event)"/></div></div></div>`
  };
  const AEditor = {
    props: { modelValue: { default: '' }, options: { default: () => ({}) } },
    emits: ['update:modelValue', 'ready'],
    setup(props, { emit }) {
      const id = 'aui-editor-' + V.useId().replace(/[^a-z0-9-]/gi, '');
      const error = ref(''); let editor = null, ready = false, disposed = false, setting = false;
      onMounted(() => {
        if (!global.UE || !global.UEDITOR_CONFIG) { error.value = '请先加载 UEditor Plus 的配置和脚本'; return; }
        try {
          editor = global.UE.getEditor(id, {
            initialFrameWidth: '100%', initialFrameHeight: 260, autoHeightEnabled: false,
            loadConfigFromServer: false, autoSaveEnable: false, autoSaveRestore: false,
            catchRemoteImageEnable: false,
            serverUrl: '', imageActionName: 'uploadimage', imageFieldName: 'file', imageUrlPrefix: '',
            imageAllowFiles: ['.png','.jpg','.jpeg','.gif','.webp','.bmp'], imageMaxSize: 5 * 1024 * 1024,
            imageCompressEnable: false, imageConfig: { disableUpload: false, disableOnline: true },
            videoActionName: 'uploadvideo', videoFieldName: 'file', videoUrlPrefix: '',
            videoAllowFiles: ['.mp4','.webm','.mov'], videoMaxSize: 5 * 1024 * 1024,
            fileActionName: 'uploadfile', fileFieldName: 'file', fileUrlPrefix: '',
            fileAllowFiles: ['.pdf','.zip','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.txt'], fileMaxSize: 5 * 1024 * 1024,
            uploadServiceEnable: true, uploadServiceUpload: (_type, _file, callback) => callback.error('请先配置上传服务'),
            toolbars: [['source','|','undo','redo','|','bold','italic','underline','strikethrough','removeformat','|','forecolor','backcolor','|','paragraph','fontfamily','fontsize','|','justifyleft','justifycenter','justifyright','|','insertorderedlist','insertunorderedlist','blockquote','|','link','unlink','|','simpleupload','insertimage','insertvideo','attachment','|','inserttable','horizontal','spechars','fullscreen']],
            ...props.options
          });
          editor.ready(() => {
            if (disposed) return;
            ready = true; setting = true; editor.setContent(props.modelValue || ''); setting = false;
            editor.addListener('contentChange', () => { if (!setting && !disposed) emit('update:modelValue', editor.getContent()); });
            emit('ready', editor);
          });
        } catch (e) { error.value = '编辑器初始化失败：' + e.message; }
      });
      watch(() => props.modelValue, value => {
        if (ready && editor && !disposed && editor.getContent() !== (value || '')) { setting = true; editor.setContent(value || ''); setting = false; }
      });
      V.onBeforeUnmount(() => { disposed = true; if (editor) { editor.destroy(); editor = null; } });
      return { id, error };
    },
    template: `<div class="aui-editor"><div v-if="error" class="aui-editor-error" role="alert">{{error}}</div><div :id="id"></div></div>`
  };
  const AForm = {
    props: { model: { required: true }, fields: { default: () => [] }, rules: Object, loading: Boolean, submitText: { default: '保存' }, labelWidth: { default: '120px' }, tabs: { default: () => [] } }, emits: ['submit', 'cancel'],
    setup(p, { emit }) { const form = ref(), currentTab = ref(p.tabs[0]?.name || ''); function visible(field) { return !p.tabs.length || (field.tab || p.tabs[0].name) === currentTab.value; } function controlCol(field) { const col = Number(field.col); return Number.isInteger(col) && col >= 1 && col <= 12 ? col : (field.full || field.type === 'richtext' || field.type === 'textarea' ? 12 : 4); } async function submit() { try { await form.value.validate(); emit('submit', p.model); } catch (errors) { const invalid = p.fields.find(field => errors && errors[field.key]); if (invalid && p.tabs.length) currentTab.value = invalid.tab || p.tabs[0].name; } } return { form, submit, controlCol, currentTab, visible }; },
    template: `<el-form ref="form" :model="model" :rules="rules" label-position="right" :label-width="labelWidth" :inline-message="true" class="aui-schema-form" @submit.prevent="submit"><el-tabs v-if="tabs.length" v-model="currentTab" class="aui-form-tabs"><el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name"/></el-tabs><div class="aui-form-grid"><el-form-item v-for="field in fields" v-show="visible(field)" :key="field.key" :label="field.label" :prop="field.key" :class="{'is-full':field.full || field.type==='richtext'}"><div class="aui-field-control" :class="['aui-col-'+controlCol(field), 'is-'+(field.type||'text')]" :style="field.maxWidth ? {maxWidth: typeof field.maxWidth === 'number' ? field.maxWidth + 'px' : field.maxWidth} : null"><slot :name="field.key" :field="field" :model="model"><el-select v-if="field.type==='select'" v-model="model[field.key]" :placeholder="field.placeholder||'请选择'" :multiple="field.multiple" :disabled="field.disabled"><el-option v-for="o in field.options" :key="o.value" :label="o.label" :value="o.value"/></el-select><el-switch v-else-if="field.type==='switch'" v-model="model[field.key]" :disabled="field.disabled"/><el-input-number v-else-if="field.type==='number'" v-model="model[field.key]" :min="field.min" :max="field.max"/><el-date-picker v-else-if="field.type==='date'" v-model="model[field.key]" value-format="YYYY-MM-DD" type="date" :placeholder="field.placeholder||'选择日期'"/><template v-else-if="field.type==='richtext'"><a-editor v-if="visible(field)" v-model="model[field.key]" :options="field.options || {}"/></template><el-input v-else v-model="model[field.key]" :type="field.type==='textarea'?'textarea':field.type==='password'?'password':'text'" :rows="field.rows||3" :show-password="field.type==='password'" :placeholder="field.placeholder||'请输入'+field.label" :disabled="field.disabled" :maxlength="field.maxlength"/></slot></div><small v-if="field.hint" class="aui-field-hint">{{field.hint}}</small></el-form-item></div><div class="aui-form-actions"><el-button type="primary" native-type="submit" :loading="loading">{{submitText}}</el-button><el-button @click="$emit('cancel')">取消</el-button><slot name="actions"/></div></el-form>`
  };
  // Menus are a tree; page routes and navigation structure remain independent.
  const menuChildren = node => node.children || node.items || [];
  function findMenuTrail(items, path) {
    for (const item of items) {
      if (item.path === path) return [item];
      const trail = findMenuTrail(menuChildren(item), path);
      if (trail.length) return [item, ...trail];
    }
    return [];
  }
  const AMenuBranch = {
    name: 'AMenuBranch',
    props: ['items', 'active', 'expanded', 'level', 'prefix', 'accordion', 'collapsed'],
    emits: ['navigate', 'expand'],
    setup(props, { emit }) {
      const nodeId = index => props.prefix + '-' + index;
      const hasActive = node => findMenuTrail([node], props.active).length > 0;
      function toggle(index) {
        const id = nodeId(index);
        if (props.collapsed) emit('expand');
        const next = props.collapsed || !props.expanded[id];
        if (next && props.accordion) props.items.forEach((_, i) => { if (i !== index) props.expanded[nodeId(i)] = false; });
        props.expanded[id] = next;
      }
      function navigate(event, node) {
        if (!node.href) { event.preventDefault(); emit('navigate', node.path); }
      }
      return { nodeId, hasActive, toggle, navigate, menuChildren };
    },
    template: `<ul class="aui-menu-list" :class="{'is-nested':level>0}"><li v-for="(node,index) in items" :key="node.id || node.path || nodeId(index)" :class="{'has-active':hasActive(node),'is-section':node.group}">
      <button v-if="menuChildren(node).length" class="aui-menu-parent" :class="{'is-section-title':node.group,'is-expanded':expanded[nodeId(index)]}" :style="{'--menu-depth':level}" :title="node.title" :aria-expanded="!!expanded[nodeId(index)]" :aria-controls="nodeId(index)" @click="toggle(index)"><a-icon v-if="!node.group" :name="node.icon || 'layers'" :size="18"/><span class="aui-menu-label">{{node.title}}</span><span v-if="node.badge" class="aui-menu-badge">{{node.badge}}</span><a-icon class="aui-menu-chevron" name="chevron" :size="14"/></button>
      <a v-else class="aui-menu-leaf" :class="{'is-active':node.path===active}" :style="{'--menu-depth':level}" :href="node.href || '#'+node.path" :target="node.href && node.target ? node.target : null" :rel="node.target==='_blank'?'noopener noreferrer':null" :title="node.title" :aria-current="node.path===active?'page':null" @click="navigate($event,node)"><a-icon v-if="level===0 || node.icon" :name="node.icon || 'grid'" :size="18"/><span v-else class="aui-menu-leaf-dot"></span><span class="aui-menu-label">{{node.title}}</span><span v-if="node.badge" class="aui-menu-badge">{{node.badge}}</span></a>
      <div v-if="menuChildren(node).length" v-show="expanded[nodeId(index)]" :id="nodeId(index)" class="aui-menu-children"><a-menu-branch :items="menuChildren(node)" :active="active" :expanded="expanded" :level="level+(node.group?0:1)" :prefix="nodeId(index)" :accordion="accordion" :collapsed="collapsed" @navigate="$emit('navigate',$event)" @expand="$emit('expand')"/></div>
    </li></ul>`
  };
  const AMenu = {
    components: { AMenuBranch },
    props: { items: { default: () => [] }, active: String, collapsed: Boolean, accordion: { default: true }, label: { default: '主导航' } },
    emits: ['navigate', 'expand'],
    setup(props) {
      const expanded = reactive({});
      const prefix = 'aui-menu-' + V.useId().replace(/[^a-z0-9-]/gi, '');
      function reveal(items, base) {
        items.forEach((node, index) => {
          const id = base + '-' + index;
          if ((node.group || node.spread) && expanded[id] === undefined) expanded[id] = true;
          if (menuChildren(node).length && findMenuTrail([node], props.active).length) {
            if (props.accordion) items.forEach((_, i) => { if (i !== index && !items[i].group) expanded[base + '-' + i] = false; });
            expanded[id] = true;
            reveal(menuChildren(node), id);
          }
        });
      }
      watch(() => [props.active, props.items], () => reveal(props.items, prefix), { immediate: true });
      return { expanded, prefix };
    },
    template: `<nav class="aui-menu" :aria-label="label"><a-menu-branch :items="items" :active="active" :expanded="expanded" :level="0" :prefix="prefix" :accordion="accordion" :collapsed="collapsed" @navigate="$emit('navigate',$event)" @expand="$emit('expand')"/></nav>`
  };
  function createWorkspace(options) {
    const routes = options.routes || [];
    if (!routes.length) throw new Error('AdminUI: routes 不能为空');
    if (new Set(routes.map(r => r.path)).size !== routes.length) throw new Error('AdminUI: route.path 不可重复');
    const home = options.home || routes[0].path;
    if (!routes.some(r => r.path === home)) throw new Error('AdminUI: home 必须在 routes 中注册');
    const storageKey = options.storageKey || 'adminui.workspace';
    const find = path => routes.find(route => route.path === path);
    const readHash = () => { try { return decodeURIComponent(location.hash.slice(1)); } catch (_) { return ''; } };
    const saved = (() => { try { const value = JSON.parse(sessionStorage.getItem(storageKey)); return Array.isArray(value) ? [...new Set(value.filter(path => find(path)))] : null; } catch (_) { return null; } })();
    const initial = find(readHash()) ? readHash() : home;
    const initialTabs = saved || [initial];
    if (initial !== home && !initialTabs.includes(initial)) initialTabs.push(initial);
    const active = ref(initial), opened = ref(initialTabs), refreshKey = ref(0);
    const current = computed(() => find(active.value));
    const tabs = computed(() => opened.value.map(find).filter(Boolean));
    const collapsed = ref(false), mobileOpen = ref(false), theme = ref('light');
    try { theme.value = localStorage.getItem(storageKey + '.theme') === 'dark' ? 'dark' : 'light'; } catch (_) {}
    const persist = () => { try { sessionStorage.setItem(storageKey, JSON.stringify(opened.value)); } catch (_) {} };
    function open(path) { if (!find(path)) return false; if (!opened.value.includes(path)) opened.value = [...opened.value, path]; active.value = path; mobileOpen.value = false; persist(); if (readHash() !== path) location.hash = encodeURI(path); return true; }
    function close(paths) {
      const closing = Array.isArray(paths) ? paths : [paths];
      const before = opened.value, remaining = before.filter(path => !closing.includes(path));
      if (closing.includes(active.value)) { const index = before.indexOf(active.value); const next = before.slice(index + 1).find(path => !closing.includes(path)) || [...before.slice(0, index)].reverse().find(path => !closing.includes(path)); active.value = next || home; location.hash = encodeURI(active.value); }
      opened.value = remaining; persist();
    }
    function closeRange(path, side) { const index = opened.value.indexOf(path); if (index < 0) return; close(side === 'left' ? opened.value.slice(0, index) : side === 'right' ? opened.value.slice(index + 1) : [...opened.value]); }
    function sync() { const path = readHash(); if (!find(path)) { active.value = home; history.replaceState(null, '', '#' + encodeURI(home)); return; } if (path !== active.value) open(path); }
    function applyTheme() { document.documentElement.setAttribute('data-bs-theme', theme.value); document.documentElement.classList.toggle('dark', theme.value === 'dark'); try { localStorage.setItem(storageKey + '.theme', theme.value); } catch (_) {} }
    function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark'; applyTheme(); }
    function refresh() { refreshKey.value++; }
    function start() { window.addEventListener('hashchange', sync); applyTheme(); if (!find(readHash())) history.replaceState(null, '', '#' + encodeURI(initial)); persist(); }
    function stop() { window.removeEventListener('hashchange', sync); }
    return { routes, menus: options.menus || [], brand: options.brand || { name: 'AdminUI', subtitle: '让后台开发更从容' }, user: options.user || { name: 'Admin', role: '管理员' }, home, active, opened, current, tabs, refreshKey, collapsed, mobileOpen, theme, open, close, closeRange, refresh, toggleTheme, start, stop };
  }
  const ALayout = {
    setup() {
      const ws = inject(workspaceKey); if (!ws) throw new Error('ALayout 需要通过 AdminUI.createApp 创建工作区');
      const strip = ref(), tabbar = ref(), hasOverflow = ref(false), canLeft = ref(false), canRight = ref(false), search = ref(''), searchOpen = ref(false), searchInput = ref();
      const context = reactive({ open: false, path: '', x: 0, y: 0 });
      let observer;
      const results = computed(() => ws.routes.filter(route => (route.title + ' ' + (route.description || '')).toLowerCase().includes(search.value.toLowerCase())).slice(0, 8));
      const breadcrumbs = computed(() => findMenuTrail(ws.menus, ws.active.value).map(node => node.title));
      const contextIndex = computed(() => ws.opened.value.indexOf(context.path));
      function updateScroll() { if (!strip.value || !tabbar.value) return; const tabs = [...strip.value.children]; const style = getComputedStyle(strip.value); const barStyle = getComputedStyle(tabbar.value); const tabsWidth = tabs.reduce((width, tab) => width + tab.getBoundingClientRect().width, 0) + Math.max(0, tabs.length - 1) * (parseFloat(style.columnGap) || 0); const available = tabbar.value.clientWidth - (parseFloat(barStyle.paddingLeft) || 0) - (parseFloat(barStyle.paddingRight) || 0); hasOverflow.value = tabsWidth > available + 1; canLeft.value = strip.value.scrollLeft > 1; canRight.value = strip.value.scrollLeft + strip.value.clientWidth < strip.value.scrollWidth - 1; }
      function scroll(direction) {
        const element = strip.value;
        if (!element) return;
        const left = element.scrollLeft, max = Math.max(0, element.scrollWidth - element.clientWidth);
        const viewport = element.getBoundingClientRect();
        const tabs = [...element.children];
        const tab = direction > 0
          ? tabs.find(item => item.getBoundingClientRect().right > viewport.right + 1)
          : tabs.reverse().find(item => item.getBoundingClientRect().left < viewport.left - 1);
        const rect = tab?.getBoundingClientRect();
        const target = rect ? left + (direction > 0 ? rect.right - viewport.right : rect.left - viewport.left) : (direction > 0 ? max : 0);
        element.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: 'smooth' });
        context.open = false;
      }
      function openContext(event, path) { const rect = event.currentTarget.getBoundingClientRect(); Object.assign(context, { open: true, path, x: Math.max(8, Math.min(event.clientX || rect.left, innerWidth - 190)), y: Math.max(8, Math.min(event.clientY || rect.bottom, innerHeight - 160)) }); }
      function closeContext(side) { ws.closeRange(context.path, side); context.open = false; }
      function dismiss(event) { if (!event?.target?.closest?.('.aui-context-menu')) context.open = false; }
      function onKey(event) { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchOpen.value = !searchOpen.value; nextTick(() => searchInput.value?.focus()); } if (event.key === 'Escape') { searchOpen.value = false; context.open = false; ws.mobileOpen.value = false; } }
      function choose(path) { ws.open(path); searchOpen.value = false; search.value = ''; }
      watch(() => [ws.active.value, ws.tabs.value, ws.collapsed.value, hasOverflow.value], async () => { await nextTick(); updateScroll(); await nextTick(); strip.value?.querySelector('[aria-current="page"]')?.closest('.aui-tab')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); updateScroll(); }, { immediate: true });
      onMounted(() => { observer = new ResizeObserver(updateScroll); if (strip.value) observer.observe(strip.value); if (tabbar.value) observer.observe(tabbar.value); document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', onKey); window.addEventListener('scroll', dismiss, true); window.addEventListener('blur', dismiss); });
      onUnmounted(() => { observer?.disconnect(); document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', dismiss, true); window.removeEventListener('blur', dismiss); });
      return { ws, strip, tabbar, hasOverflow, canLeft, canRight, search, searchOpen, searchInput, results, breadcrumbs, context, contextIndex, scroll, updateScroll, openContext, closeContext, choose };
    },
    template: `<div class="aui-shell" :class="{'is-collapsed':ws.collapsed.value,'is-mobile-open':ws.mobileOpen.value}">
      <button v-if="ws.mobileOpen.value" class="aui-sidebar-backdrop" aria-label="关闭导航" @click="ws.mobileOpen.value=false"></button>
      <aside class="aui-sidebar"><a :href="'#'+ws.home" class="aui-brand" @click.prevent="ws.open(ws.home)"><span class="aui-brand-mark">A<span></span></span><div><strong>{{ws.brand.name}}</strong><small>{{ws.brand.subtitle}}</small></div></a>
      <div class="aui-workspace-label"><span class="aui-workspace-dot"></span><span>默认工作空间</span><span class="aui-sidebar-version">v0.2</span></div>
      <a-menu class="aui-side-nav" :items="ws.menus" :active="ws.active.value" :collapsed="ws.collapsed.value && !ws.mobileOpen.value" @navigate="ws.open" @expand="ws.collapsed.value=false"/>
      <div class="aui-sidebar-note"><span class="aui-note-mark"><a-icon name="layers" :size="20"/></span><div><strong>少一点搭建，多一点创造</strong><p>专注你的下一件作品。</p></div></div><div class="aui-sidebar-bottom"><span class="aui-status-dot"></span><span>All systems operational</span><a-icon name="external" :size="13"/></div></aside>
      <div class="aui-main"><header class="aui-topbar"><div class="aui-topbar-start"><button class="aui-icon-button aui-desktop-toggle" :aria-label="ws.collapsed.value?'展开导航':'收起导航'" @click="ws.collapsed.value=!ws.collapsed.value"><a-icon name="menu"/></button><button class="aui-icon-button aui-mobile-toggle" aria-label="打开导航" @click="ws.mobileOpen.value=true"><a-icon name="menu"/></button><div class="aui-breadcrumb"><template v-for="(title,index) in breadcrumbs" :key="index"><span v-if="index" class="aui-breadcrumb-separator">/</span><strong v-if="index===breadcrumbs.length-1">{{title}}</strong><span v-else>{{title}}</span></template><strong v-if="!breadcrumbs.length">{{ws.current.value.title}}</strong></div></div><div class="aui-topbar-actions"><button class="aui-search-trigger" @click="searchOpen=true; $nextTick(()=>searchInput?.focus())"><a-icon name="search" :size="16"/><span>搜索页面、组件…</span><kbd>⌘ K</kbd></button><button class="aui-icon-button" aria-label="刷新当前页面" title="刷新当前页面" @click="ws.refresh"><a-icon name="refresh" :size="18"/></button><button class="aui-icon-button" :aria-label="ws.theme.value==='dark'?'切换浅色主题':'切换深色主题'" @click="ws.toggleTheme"><a-icon :name="ws.theme.value==='dark'?'sun':'moon'" :size="18"/></button><div class="aui-user"><span class="aui-user-avatar">{{ws.user.name.slice(0,1)}}</span><div><strong>{{ws.user.name}}</strong><small>{{ws.user.role}}</small></div></div></div></header>
      <div ref="tabbar" class="aui-tabbar"><button v-if="hasOverflow" class="aui-tab-arrow aui-tab-arrow-left" aria-label="向左移动标签" title="向左移动标签" :disabled="!canLeft" @click="scroll(-1)"><a-icon name="chevron" :size="17"/></button><nav ref="strip" class="aui-tabs" aria-label="已打开的页面" @scroll="updateScroll"><div v-for="tab in ws.tabs.value" :key="tab.path" class="aui-tab" :class="{'is-active':tab.path===ws.active.value}" @contextmenu.prevent="openContext($event,tab.path)" @keydown.shift.f10.prevent="openContext($event,tab.path)"><a :href="'#'+tab.path" :aria-current="tab.path===ws.active.value?'page':null" @click.prevent="ws.open(tab.path)"><a-icon :name="tab.icon||'grid'" :size="15"/>{{tab.title}}</a><button :aria-label="'关闭'+tab.title+'标签'" @click="ws.close(tab.path)"><a-icon name="close" :size="13"/></button></div></nav><button v-if="hasOverflow" class="aui-tab-arrow" aria-label="向右移动标签" title="向右移动标签" :disabled="!canRight" @click="scroll(1)"><a-icon name="chevron" :size="17"/></button></div>
      <main class="aui-content" id="main-content" tabindex="-1"><slot/></main><footer class="aui-footer"><span>AdminUI · Made for the way you build.</span><span>Tabler + Element Plus + Vue 3</span></footer></div>
      <teleport to="body"><div v-if="context.open" class="aui-context-menu" role="menu" aria-label="标签操作" :style="{left:context.x+'px',top:context.y+'px'}"><button role="menuitem" :disabled="contextIndex<=0" @click="closeContext('left')">关闭左边所有</button><button role="menuitem" :disabled="contextIndex>=ws.tabs.value.length-1" @click="closeContext('right')">关闭右边所有</button><button role="menuitem" @click="closeContext('all')">关闭全部</button></div></teleport>
      <el-dialog v-model="searchOpen" title="快速跳转" width="min(560px, 92vw)" class="aui-search-dialog" :show-close="true"><el-input ref="searchInput" v-model="search" placeholder="输入页面或组件名称" aria-label="搜索页面" @keydown.enter="results[0] && choose(results[0].path)"/><div class="aui-search-results"><button v-for="item in results" :key="item.path" @click="choose(item.path)"><a-icon :name="item.icon"/><span><strong>{{item.title}}</strong><small>{{item.description}}</small></span><a-icon name="arrow" :size="16"/></button><a-empty v-if="!results.length" title="没有找到页面" description="换一个关键词试试。"/></div></el-dialog>
    </div>`
  };
  const components = { AMenu, AIcon, APageHeader, APanel, AStatCard, AFilterBar, AEmpty, ACode, ATable, AEditor, AForm, ALayout };
  const AdminUI = {
    version: '0.2.0', components, createWorkspace, findMenuTrail,
    useWorkspace() { const ws = inject(workspaceKey); if (!ws) throw new Error('请在 AdminUI 工作区内调用 useWorkspace'); return ws; },
    install(app) { Object.entries(components).forEach(([name, component]) => app.component(name, component)); },
    createApp(options) {
      const ws = createWorkspace(options);
      const root = { setup() { provide(workspaceKey, ws); onMounted(ws.start); onUnmounted(ws.stop); return { ws }; }, template: '<a-layout><keep-alive :max="20"><component :is="ws.current.value.component" :key="ws.active.value+\':\'+ws.refreshKey.value"/></keep-alive></a-layout>' };
      const app = V.createApp(root); app.use(global.ElementPlus, { locale: global.ElementPlusLocaleZhCn }); app.use(AdminUI);
      return { app, workspace: ws, mount: selector => app.mount(selector || '#app') };
    },
    async request(url, options = {}) {
      const { timeout = 15000, responseType = 'json', ...init } = options;
      const controller = new AbortController();
      const relay = () => controller.abort(init.signal?.reason);
      if (init.signal?.aborted) relay(); else init.signal?.addEventListener('abort', relay, { once: true });
      const timer = setTimeout(() => controller.abort(), timeout);
      try { const response = await fetch(url, { credentials: 'same-origin', ...init, signal: controller.signal }); if (!response.ok) throw new Error('HTTP ' + response.status); if (response.status === 204) return null; return responseType === 'text' ? await response.text() : await response.json(); }
      finally { clearTimeout(timer); init.signal?.removeEventListener('abort', relay); }
    }
  };
  global.AdminUI = AdminUI;
})(window);
