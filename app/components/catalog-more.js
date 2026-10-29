/* 补充交互示例和简洁的接入代码。 */
(function (global) {
    global.AdminUICatalogExtras = {
        grid: {
            html: /* HTML */ `
                <a-panel title="混合比例" description="常见的侧栏与内容区布局">
                    <el-row :gutter="16">
                        <el-col :xs="24" :md="6">
                            <div class="catalog-grid-cell">侧栏 · 6</div>
                        </el-col>
                        <el-col :xs="24" :md="18">
                            <div class="catalog-grid-cell is-light">内容区 · 18</div>
                        </el-col>
                    </el-row>
                </a-panel>
            `,
            code: `<el-row :gutter="16">
    <el-col :xs="24" :md="6">侧栏</el-col>
    <el-col :xs="24" :md="18">内容</el-col>
</el-row>`,
        },
        fields: {
            html: /* HTML */ `
                <div class="demo-component-grid">
                    <a-panel title="输入框状态" description="清除、密码、禁用和字数限制">
                        <div class="catalog-demo-fields">
                            <label>可清除</label>
                            <el-input v-model="extraText" clearable placeholder="输入后可清除" />
                            <label>密码输入</label>
                            <el-input
                                v-model="password"
                                type="password"
                                show-password
                                placeholder="点击图标显示密码"
                            />
                            <label>带前后缀</label>
                            <el-input v-model="website" placeholder="请输入域名">
                                <template #prepend>https://</template>
                                <template #append>.com</template>
                            </el-input>
                            <label>禁用状态</label>
                            <el-input disabled placeholder="不可编辑" />
                            <label>字数限制</label>
                            <el-input
                                v-model="remark"
                                maxlength="40"
                                show-word-limit
                                type="textarea"
                                :rows="3"
                                placeholder="最多输入 40 个字符"
                            />
                        </div>
                    </a-panel>
                    <a-panel title="单选、多选与开关" description="展示边框、按钮及禁用状态">
                        <div class="catalog-demo-fields">
                            <label>按钮式单选</label>
                            <el-radio-group v-model="extraChoice">
                                <el-radio-button value="a">公开</el-radio-button>
                                <el-radio-button value="b">私有</el-radio-button>
                            </el-radio-group>
                            <label>带边框多选</label>
                            <el-checkbox-group v-model="extraChecks">
                                <el-checkbox value="news" border>新闻</el-checkbox>
                                <el-checkbox value="updates" border>更新</el-checkbox>
                                <el-checkbox value="disabled" border disabled>不可选</el-checkbox>
                            </el-checkbox-group>
                            <label>开关状态</label>
                            <div class="catalog-row">
                                <el-switch
                                    v-model="extraEnabled"
                                    active-text="开启"
                                    inactive-text="关闭"
                                />
                                <el-switch disabled :model-value="true" />
                            </div>
                            <p class="catalog-state">
                                当前：{{extraChoice==='a'?'公开':'私有'}} · 已选
                                {{extraChecks.length}} 项
                            </p>
                        </div>
                    </a-panel>
                </div>
            `,
            code: `<el-input v-model="title" clearable placeholder="请输入标题" />
<el-input v-model="password" type="password" show-password />
<el-radio-group v-model="visibility">
    <el-radio value="public">公开</el-radio>
    <el-radio value="private">私有</el-radio>
</el-radio-group>
<el-switch v-model="enabled" />`,
        },
        tabs: {
            html: /* HTML */ `
                <a-panel title="标签位置" description="同一组选项支持不同方向">
                    <el-radio-group v-model="tabPosition" class="mb-3">
                        <el-radio-button value="top">顶部</el-radio-button>
                        <el-radio-button value="left">左侧</el-radio-button>
                    </el-radio-group>
                    <el-tabs :tab-position="tabPosition" style="min-height:110px">
                        <el-tab-pane label="基本信息">这里是基本信息。</el-tab-pane>
                        <el-tab-pane label="通知设置">这里是通知设置。</el-tab-pane>
                        <el-tab-pane label="安全设置">这里是安全设置。</el-tab-pane>
                    </el-tabs>
                </a-panel>
            `,
            code: `<el-tabs v-model="activeTab">
    <el-tab-pane label="概览" name="overview">概览内容</el-tab-pane>
    <el-tab-pane label="成员" name="members">成员内容</el-tab-pane>
</el-tabs>`,
        },
        progress: {
            html: /* HTML */ `
                <a-panel title="状态与条纹">
                    <div class="catalog-stack">
                        <el-progress :percentage="25" status="exception" />
                        <el-progress :percentage="65" :stroke-width="14" striped striped-flow />
                        <el-progress :percentage="100" status="success" />
                    </div>
                </a-panel>
            `,
            code: `<el-progress :percentage="progress" />
<el-progress :percentage="75" striped striped-flow />
<el-progress type="circle" :percentage="progress" />`,
        },
        panel: {
            html: /* HTML */ `
                <a-panel title="可折叠内容" description="将较长的说明按需展开">
                    <el-collapse v-model="collapse">
                        <el-collapse-item title="什么时候使用面板？" name="one">
                            将相关的标题、操作和内容放在同一个区域。
                        </el-collapse-item>
                        <el-collapse-item title="如何放置操作？" name="two">
                            通过 actions 插槽放置按钮或筛选控件。
                        </el-collapse-item>
                    </el-collapse>
                </a-panel>
            `,
            code: `<a-panel title="项目概况" description="当前进度">
    <template #actions>
        <el-button>编辑</el-button>
    </template>
    面板内容
    <template #footer>更新时间</template>
</a-panel>`,
        },
        badge: {
            html: /* HTML */ `
                <a-panel title="数量变化与上限">
                    <div class="catalog-row">
                        <el-badge :value="badgeCount" :max="99">
                            <el-button>待办事项</el-button>
                        </el-badge>
                        <el-button @click="badgeCount++">增加</el-button>
                        <el-button @click="badgeCount=Math.max(0,badgeCount-1)">减少</el-button>
                        <el-tag type="info" effect="plain" round>草稿</el-tag>
                        <el-tag type="success" effect="dark" round>在线</el-tag>
                    </div>
                </a-panel>
            `,
            code: `<el-badge :value="unread" :max="99">
    <el-button>消息</el-button>
</el-badge>
<el-tag type="success">已完成</el-tag>`,
        },
        timeline: {
            html: /* HTML */ `
                <a-panel title="自定义节点">
                    <el-timeline>
                        <el-timeline-item timestamp="09:00" color="#3265f5" size="large">
                            创建任务
                        </el-timeline-item>
                        <el-timeline-item timestamp="11:30" type="warning" hollow>
                            等待审核
                        </el-timeline-item>
                        <el-timeline-item timestamp="14:00" type="success">
                            发布完成
                        </el-timeline-item>
                    </el-timeline>
                </a-panel>
            `,
            code: `<el-timeline>
    <el-timeline-item timestamp="今天" type="primary">创建项目</el-timeline-item>
    <el-timeline-item timestamp="明天">开始执行</el-timeline-item>
</el-timeline>`,
        },
        animation: {
            html: /* HTML */ `
                <a-panel title="折叠与展开">
                    <el-button @click="expanded=!expanded">
                        {{expanded?'收起':'展开'}}说明
                    </el-button>
                    <el-collapse-transition>
                        <div v-show="expanded" class="catalog-transition">
                            这块内容使用高度过渡，适合折叠说明。
                        </div>
                    </el-collapse-transition>
                </a-panel>
            `,
            code: `<transition name="el-fade-in-linear">
    <div v-show="visible">需要显示的内容</div>
</transition>`,
        },
        utility: {
            html: /* HTML */ `
                <a-panel title="文字提示">
                    <div class="catalog-row">
                        <el-tooltip content="这是补充说明" placement="top">
                            <el-button>悬停查看提示</el-button>
                        </el-tooltip>
                        <el-popover
                            placement="top"
                            :width="220"
                            trigger="click"
                            content="这里可以展示更详细的说明。"
                        >
                            <template #reference><el-button>点击查看详情</el-button></template>
                        </el-popover>
                    </div>
                </a-panel>
            `,
            code: `<el-alert title="保存成功" type="success" show-icon />
<el-tooltip content="补充说明">
    <el-button>查看</el-button>
</el-tooltip>
<el-divider />`,
        },
        dialog: {
            html: /* HTML */ `
                <a-panel title="提示样式">
                    <div class="catalog-row">
                        <el-button @click="notify('success')">成功消息</el-button>
                        <el-button @click="notify('warning')">警告消息</el-button>
                        <el-button @click="notify('error')">错误消息</el-button>
                    </div>
                </a-panel>
            `,
            code: `<el-button @click="dialog = true">打开</el-button>
<el-dialog v-model="dialog" title="编辑信息">
    <el-input v-model="name" />
</el-dialog>
// 显示保存成功的提示
ElMessage.success('保存成功')`,
        },
        date: {
            html: /* HTML */ `
                <a-panel title="快捷选择与禁用日期">
                    <div class="catalog-stack">
                        <el-date-picker
                            v-model="date"
                            type="date"
                            placeholder="只选择今天之后"
                            :disabled-date="disablePast"
                            value-format="YYYY-MM-DD"
                        />
                        <el-date-picker
                            v-model="month"
                            type="month"
                            placeholder="选择月份"
                            value-format="YYYY-MM"
                        />
                        <p class="catalog-state">月份：{{month || '未选择'}}</p>
                    </div>
                </a-panel>
            `,
            code: `<el-date-picker v-model="date" type="date" value-format="YYYY-MM-DD" />
<el-date-picker v-model="range" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />`,
        },
        static_table: {
            html: /* HTML */ `
                <a-panel title="紧凑表格">
                    <div class="report-table-wrap">
                        <table class="report-table catalog-table-striped">
                            <thead>
                                <tr>
                                    <th>编号</th>
                                    <th>名称</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in rows" :key="row.id">
                                    <td>{{row.id}}</td>
                                    <td>{{row.name}}</td>
                                    <td>{{row.status}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </a-panel>
            `,
            code: `<table class="report-table">
    <thead>
        <tr>
            <th>名称</th>
            <th>状态</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>项目一</td>
            <td>进行中</td>
        </tr>
    </tbody>
</table>`,
        },
        table: {
            html: /* HTML */ `
                <a-panel title="筛选与行操作">
                    <el-input
                        v-model="tableQuery"
                        clearable
                        placeholder="搜索项目名称"
                        style="max-width:280px;margin-bottom:16px"
                    />
                    <el-table :data="filteredRows" stripe border>
                        <el-table-column prop="name" label="项目" />
                        <el-table-column prop="owner" label="负责人" />
                        <el-table-column label="操作" width="100">
                            <template #default="scope">
                                <el-button
                                    type="primary"
                                    text
                                    @click="message('查看 '+scope.row.name)"
                                >
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p class="catalog-state">找到 {{filteredRows.length}} 条记录</p>
                </a-panel>
            `,
            code: `<el-table :data="rows" stripe @selection-change="selected = $event">
    <el-table-column type="selection" />
    <el-table-column prop="name" label="项目" sortable />
</el-table>`,
        },
        pagination: {
            html: /* HTML */ `
                <a-panel
                    title="多页省略"
                    description="页数较多时保留首页和末页，中间自动显示省略号"
                >
                    <el-pagination
                        v-model:current-page="longPage"
                        :page-size="10"
                        :total="200"
                        :pager-count="7"
                        layout="prev, pager, next"
                        background
                    />
                    <p class="catalog-state">
                        当前第 {{longPage}} 页，共 20 页。点击省略号可快速跳转。
                    </p>
                </a-panel>
                <a-panel title="紧凑分页">
                    <el-pagination
                        v-model:current-page="page"
                        :page-size="10"
                        :total="80"
                        layout="prev, pager, next"
                        small
                    />
                    <p class="catalog-state">与上面的页码同步：第 {{page}} 页</p>
                </a-panel>
            `,
            code: `<el-pagination v-model:current-page="page" :page-size="10" :total="200" :pager-count="7" layout="prev, pager, next" background />`,
        },
        tree_table: {
            html: /* HTML */ `
                <a-panel title="可选层级">
                    <el-table
                        :data="treeRows"
                        row-key="id"
                        default-expand-all
                        :tree-props="{children:'children'}"
                    >
                        <el-table-column type="selection" width="50" />
                        <el-table-column prop="name" label="部门" />
                        <el-table-column prop="status" label="状态" />
                    </el-table>
                </a-panel>
            `,
            code: `<el-table :data="rows" row-key="id" :tree-props="{ children: 'children' }">
    <el-table-column prop="name" label="名称" />
</el-table>`,
        },
        dropdown: {
            html: /* HTML */ `
                <a-panel title="触发方式">
                    <div class="catalog-row">
                        <el-dropdown trigger="click" @command="message">
                            <el-button>点击打开 ▾</el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="复制链接">复制链接</el-dropdown-item>
                                    <el-dropdown-item command="导出">导出</el-dropdown-item>
                                    <el-dropdown-item disabled>不可用</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-dropdown @command="message">
                            <el-button>悬停打开 ▾</el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="预览">预览</el-dropdown-item>
                                    <el-dropdown-item command="分享">分享</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </a-panel>
            `,
            code: `<el-dropdown @command="onCommand">
    <el-button>更多操作</el-button>
    <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
        </el-dropdown-menu>
    </template>
</el-dropdown>`,
        },
        upload: {
            html: /* HTML */ `
                <a-panel title="拖拽选择" description="仅选择文件，不会上传">
                    <el-upload
                        drag
                        action="#"
                        :auto-upload="false"
                        v-model:file-list="dragFiles"
                        multiple
                    >
                        <div class="catalog-upload-icon">⇧</div>
                        <div>
                            拖拽文件到这里，或
                            <em>点击选择</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">演示只在浏览器中保留文件列表。</div>
                        </template>
                    </el-upload>
                </a-panel>
            `,
            code: `<el-upload action="#" :auto-upload="false" v-model:file-list="files">
    <el-button>选择文件</el-button>
</el-upload>
<!-- 接入服务时配置 action 或 http-request -->`,
        },
        transfer: {
            html: /* HTML */ `
                <a-panel title="禁用指定选项">
                    <el-transfer
                        v-model="chosen2"
                        :data="transferDisabled"
                        :titles="['待选择','已选择']"
                    />
                    <p class="catalog-state">已选择 {{chosen2.length}} 项</p>
                </a-panel>
            `,
            code: `<el-transfer v-model="selected" :data="items" :titles="['可选', '已选']" filterable />
// 选项数据示例：[{ key: 1, label: '成员' }]`,
        },
        tree: {
            html: /* HTML */ `
                <a-panel title="单选与节点点击">
                    <el-tree
                        :data="treeData"
                        node-key="id"
                        highlight-current
                        default-expand-all
                        @node-click="treeSelected=$event.label"
                    />
                    <p class="catalog-state">当前节点：{{treeSelected || '未选择'}}</p>
                </a-panel>
            `,
            code: `<el-tree :data="nodes" node-key="id" show-checkbox :props="{ label: 'label', children: 'children' }" />`,
        },
        color: {
            html: /* HTML */ `
                <a-panel title="预设颜色">
                    <div class="catalog-row">
                        <el-color-picker
                            v-model="color"
                            :predefine="['#3265f5','#28ae94','#e6a04c','#e17b7b']"
                        />
                        <span>点击选择预设色</span>
                    </div>
                </a-panel>
            `,
            code: `<el-color-picker v-model="color" show-alpha :predefine="['#3265f5', '#28ae94', '#e6a04c']" />`,
        },
        slider: {
            html: /* HTML */ `
                <a-panel title="刻度与禁用状态">
                    <div class="catalog-stack">
                        <el-slider
                            v-model="slider"
                            :step="20"
                            show-stops
                            :marks="{0:'低',100:'高'}"
                        />
                        <el-slider :model-value="60" disabled />
                    </div>
                </a-panel>
            `,
            code: `<el-slider v-model="value" :step="10" show-stops />
<el-slider v-model="range" range />`,
        },
        rate: {
            html: /* HTML */ `
                <a-panel title="文字反馈与只读">
                    <div class="catalog-stack">
                        <el-rate
                            v-model="rating"
                            show-text
                            :texts="['很差','较差','一般','满意','非常满意']"
                        />
                        <el-rate :model-value="3" disabled show-score />
                    </div>
                </a-panel>
            `,
            code: `<el-rate v-model="rating" show-score />
<el-rate :model-value="4" disabled />`,
        },
        carousel: {
            html: /* HTML */ `
                <a-panel title="卡片轮播">
                    <el-carousel type="card" height="180px" :autoplay="false">
                        <el-carousel-item v-for="n in 4" :key="n">
                            <div class="catalog-slide" :class="'slide-'+(n%3)">
                                <strong>内容 {{n}}</strong>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </a-panel>
            `,
            code: `<el-carousel height="240px">
    <el-carousel-item v-for="item in items" :key="item.id">{{ item.title }}</el-carousel-item>
</el-carousel>`,
        },
        flow: {
            html: /* HTML */ `
                <a-panel title="列表重置">
                    <div class="catalog-row">
                        <el-button @click="count=10">恢复初始数量</el-button>
                        <span>当前已展示 {{count}} 条</span>
                    </div>
                </a-panel>
            `,
            code: `<div v-for="item in visibleItems" :key="item.id">{{ item.title }}</div>
<el-button :disabled="finished" @click="loadMore">加载更多</el-button>`,
        },
        code: {
            html: /* HTML */ `
                <a-panel title="不同语言"><a-code :code="htmlCode" label="HTML" /></a-panel>
            `,
            code: `<a-code :code="source" label="JavaScript" />`,
        },
    };
})(window);
