/* Navigation and focused component examples. No backend connection. */
(function () {
  const { ref, computed } = Vue;
  AdminUIDemo.Navigation = {
    name: 'Navigation',
    setup() {
      const active = ref('/sample/team/members'), accordion = ref(true), horizontalActive = ref('overview');
      const items = [
        { id: 'overview', title: '概览', icon: 'grid', path: '/sample/home' },
        { id: 'team', title: '组织管理', icon: 'users', children: [
          { id: 'people', title: '人员管理', children: [
            { title: '成员列表', path: '/sample/team/members' },
            { title: '邀请记录', path: '/sample/team/invitations' }
          ] },
          { title: '部门设置', path: '/sample/team/departments' }
        ] },
        { id: 'security', title: '安全设置', icon: 'shield', children: [
          { title: '访问策略', children: [
            { title: 'IP 白名单', path: '/sample/security/ip' },
            { title: '操作审计', path: '/sample/security/audit' }
          ] },
          { title: '登录记录', path: '/sample/security/logs' }
        ] }
      ];
      const trail = computed(() => AdminUI.findMenuTrail(items, active.value).map(node => node.title));
      const code = `const menus = [{\n  title: '组织管理', icon: 'users',\n  children: [{\n    title: '人员管理',\n    children: [\n      { title: '成员列表', path: '/members' },\n      { title: '邀请记录', path: '/invitations' }\n    ]\n  }]\n}];\n\n<a-menu :items="menus" :active="active" :accordion="true" @navigate="active = $event" />`;
      return { items, active, accordion, trail, code, horizontalActive };
    },
    template: `<div><a-page-header category="组件中心" title="多级菜单" description="递归导航、手风琴、选中状态与路径联动"/><a-panel title="横向导航与面包屑" description="顶部导航切换和层级路径展示"><el-menu v-model:default-active="horizontalActive" mode="horizontal" :ellipsis="false"><el-menu-item index="overview">概览</el-menu-item><el-menu-item index="projects">项目</el-menu-item><el-sub-menu index="management"><template #title>管理</template><el-menu-item index="members">成员</el-menu-item><el-menu-item index="settings">设置</el-menu-item></el-sub-menu></el-menu><el-breadcrumb separator="/" class="mt-3"><el-breadcrumb-item>工作空间</el-breadcrumb-item><el-breadcrumb-item>{{horizontalActive}}</el-breadcrumb-item></el-breadcrumb></a-panel><div class="demo-component-grid"><a-panel title="三级导航 · 实时示例" description="展开父菜单，点击子菜单查看右侧路径"><div class="demo-nav-options"><el-switch v-model="accordion" aria-label="手风琴模式"/><span>手风琴模式</span></div><div class="demo-menu-sample"><a-menu :items="items" :active="active" :accordion="accordion" label="多级菜单示例" @navigate="active=$event"/></div></a-panel><div><a-panel title="当前选中路径"><div class="demo-menu-trail"><template v-for="(title,i) in trail"><span v-if="i">/</span><strong>{{title}}</strong></template></div><p class="demo-doc-text">路由：<code>{{active}}</code></p><div class="demo-button-row"><el-button @click="active='/sample/security/audit'">定位到三级菜单</el-button><el-button @click="active='/sample/team/members'">返回成员列表</el-button></div><p class="demo-doc-text mb-0">从外部修改 active 时自动展开祖先菜单；手动收起不会修改当前选中项。默认只展开同层一个分支，也可关闭手风琴模式。</p></a-panel><a-panel title="配置与使用"><a-code :code="code"/></a-panel></div></div></div>`
  };
  AdminUIDemo.Buttons = {
    name: 'Buttons',
    setup() { const loading = ref(false); let timer; Vue.onUnmounted(() => clearTimeout(timer)); function submit() { loading.value = true; timer = setTimeout(() => { loading.value = false; ElementPlus.ElMessage.success('演示操作已完成'); }, 600); } return { loading, submit }; },
    template: `<div><a-page-header category="基础组件" title="按钮" description="统一尺寸、状态和操作层次"/><a-panel title="操作层次" description="主要操作突出，其余操作保持克制"><div class="demo-button-row"><el-button type="primary" @click="submit">主要操作</el-button><el-button @click="submit">默认操作</el-button><el-button type="primary" plain @click="submit">次要操作</el-button><el-button type="danger" plain @click="submit">危险操作</el-button><el-button text type="primary" @click="submit">文字操作</el-button></div></a-panel><a-panel title="图标与状态"><div class="demo-button-row"><el-button type="primary" :loading="loading" @click="submit"><a-icon v-if="!loading" name="plus" :size="17" class="me-1"/>{{loading?'处理中':'新增记录'}}</el-button><el-button @click="submit"><a-icon name="download" :size="17" class="me-1"/>导出数据</el-button><el-button disabled>不可用</el-button></div></a-panel><a-panel title="按钮组"><el-button-group><el-button @click="submit">上一页</el-button><el-button @click="submit">下一页</el-button></el-button-group></a-panel></div>`
  };
  AdminUIDemo.Icons = {
    name: 'Icons',
    setup() {
      const keyword = ref(''), selected = ref('edit');
      const icons = [
        ['home','首页'],['grid','概览'],['menu','菜单'],['search','搜索'],['user','用户'],['users','用户组'],
        ['settings','设置'],['sliders','调整'],['bell','通知'],['book','文档'],['file','文件'],['list','列表'],
        ['chart','图表'],['layers','图层'],['box','盒子'],['form','表单'],['plus','新增'],['edit','编辑'],
        ['trash','删除'],['check','确认'],['close','关闭'],['refresh','刷新'],['download','下载'],['arrow','箭头'],
        ['chevron','方向'],['external','外部链接'],['code','代码'],['clock','时间'],['shield','安全'],['lock','锁定'],
        ['sun','浅色'],['moon','深色'],['login','登录'],['register','注册'],['server','服务器'],['network','网络']
      ];
      const filtered = computed(() => { const q = keyword.value.trim().toLowerCase(); return icons.filter(([name,label]) => name.includes(q) || label.includes(q)); });
      const code = computed(() => `<a-icon name="${selected.value}" :size="20" />`);
      return { keyword, selected, filtered, code };
    },
    template: `<div><a-page-header category="基础组件" title="图标" description="浏览常用图标，点击图标查看并复制使用代码"/><a-panel title="常用图标"><template #actions><el-input v-model="keyword" clearable placeholder="搜索名称或用途" aria-label="搜索图标" class="demo-icon-search"/></template><div class="demo-icon-grid"><button v-for="[name,label] in filtered" :key="name" type="button" class="demo-icon-card" :class="{'is-selected':selected===name}" :aria-pressed="selected===name" @click="selected=name"><a-icon :name="name" :size="24"/><strong>{{label}}</strong><code>{{name}}</code></button></div><a-empty v-if="!filtered.length" title="没有找到图标" description="尝试其他名称或用途。"/></a-panel><a-panel title="使用代码" description="选择上方图标后，可复制下面的代码"><a-code :code="code" label="Vue 模板"/></a-panel></div>`
  };
  AdminUIDemo.Selects = {
    name: 'Selects',
    setup() { return { role: ref('editor'), members: ref(['lin']), disabled: ref(false), options: [{ label: '管理员', value: 'admin' }, { label: '编辑', value: 'editor' }, { label: '普通成员', value: 'member' }] }; },
    template: `<div><a-page-header category="基础组件" title="下拉选择" description="单选、多选、搜索与禁用状态"/><div class="demo-component-grid"><a-panel title="单选与搜索"><label for="demo-select-role" class="form-label">成员角色</label><el-select id="demo-select-role" v-model="role" filterable clearable placeholder="请选择角色"><el-option v-for="item in options" :label="item.label" :value="item.value"/></el-select><p class="demo-doc-text mt-3 mb-0">当前值：<code>{{role||'未选择'}}</code></p></a-panel><a-panel title="多选"><label for="demo-select-members" class="form-label">项目成员</label><el-select id="demo-select-members" v-model="members" multiple filterable placeholder="请选择成员"><el-option label="林然" value="lin"/><el-option label="周晴" value="zhou"/><el-option label="许知远" value="xu"/></el-select><p class="demo-doc-text mt-3 mb-0">已选择 {{members.length}} 位成员</p></a-panel><a-panel title="禁用与选项分组"><div class="demo-nav-options"><el-switch v-model="disabled" aria-label="禁用选择器"/><span>禁用选择器</span></div><el-select v-model="role" :disabled="disabled" aria-label="分组角色"><el-option-group label="管理团队"><el-option label="管理员" value="admin"/><el-option label="编辑" value="editor"/></el-option-group><el-option-group label="普通成员"><el-option label="普通成员" value="member"/><el-option label="不可选择的角色" value="locked" disabled/></el-option-group></el-select></a-panel></div></div>`
  };
})();
