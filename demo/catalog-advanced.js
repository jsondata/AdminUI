/* 补充组件示例，所有操作均在浏览器中完成。 */
(function () {
    const extras = window.AdminUICatalogExtras;
    extras.grid.html += /* HTML */ `
        <a-panel title="响应式组合与九宫格" description="手机单列、平板双列、桌面三列">
            <el-row :gutter="12">
                <el-col v-for="n in 9" :key="n" :xs="24" :sm="12" :lg="8">
                    <div class="catalog-grid-cell">区块 {{n}}</div>
                </el-col>
            </el-row>
        </a-panel>
    `;
    extras.pagination.html += /* HTML */ `
        <a-panel title="跳页与总数" description="输入页码跳转，调整每页条数">
            <el-pagination
                v-model:current-page="jumpPage"
                v-model:page-size="jumpSize"
                :page-sizes="[10,20,50]"
                :total="520"
                layout="total, sizes, prev, pager, next, jumper"
                background
            />
            <p class="catalog-state">第 {{jumpPage}} 页 · 每页 {{jumpSize}} 条</p>
        </a-panel>
    `;
    extras.tree.html += /* HTML */ `
        <a-panel title="节点搜索与展开" description="按名称筛选树节点">
            <el-input
                v-model="treeQuery"
                clearable
                placeholder="搜索节点"
                style="max-width:300px;margin-bottom:16px"
            />
            <el-tree
                :data="filteredTree"
                node-key="id"
                default-expand-all
                :props="{label:'label',children:'children'}"
                empty-text="无匹配节点"
            />
        </a-panel>
    `;
    extras.flow.html += /* HTML */ `
        <a-panel title="滚动加载" description="滚动列表到底部加载更多本地演示项">
            <div class="demo-infinite-list" @scroll="loadOnScroll">
                <div v-for="n in infiniteCount" :key="n">演示记录 {{n}}</div>
                <p>{{infiniteCount>=40?'已全部加载':'向下滚动加载更多'}}</p>
            </div>
        </a-panel>
    `;
    extras.fields.html += /* HTML */ `
        <a-panel title="表单组合与校验" description="常见的名称、联系方式及选择项组合">
            <el-form :model="comboForm" label-width="80px" style="max-width:520px" @submit.prevent>
                <el-form-item label="姓名" required>
                    <el-input v-model="comboForm.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="邮箱" required>
                    <el-input v-model="comboForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="comboForm.type">
                        <el-option label="个人" value="个人" />
                        <el-option label="团队" value="团队" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitCombo">提交</el-button>
                    <el-button @click="resetCombo">重置</el-button>
                </el-form-item>
            </el-form>
        </a-panel>
    `;
    extras.dialog.html += /* HTML */ `
        <a-panel title="确认、输入与加载" description="展示常见反馈和不同弹层内容">
            <div class="catalog-row">
                <el-button @click="promptName">输入内容</el-button>
                <el-button type="danger" plain @click="confirmDelete">删除确认</el-button>
                <el-button @click="showLoading">短时加载</el-button>
                <el-button @click="notice">右上角通知</el-button>
            </div>
        </a-panel>
        <a-panel title="自定义弹层" description="对话框支持自定义内容、宽度和页脚">
            <el-button @click="customDialog=true">打开自定义对话框</el-button>
            <el-dialog v-model="customDialog" title="发布确认" width="min(480px,92vw)">
                <el-alert title="请确认信息完整后发布" type="info" :closable="false" show-icon />
                <p class="catalog-state">该操作仅为演示。</p>
                <template #footer>
                    <el-button @click="customDialog=false">取消</el-button>
                    <el-button type="primary" @click="customDialog=false;message('发布成功')">
                        确认发布
                    </el-button>
                </template>
            </el-dialog>
        </a-panel>
    `;
    extras.date.html += /* HTML */ `
        <a-panel title="日期快捷范围与时间限制" description="常用日期范围、年月和限制选择">
            <div class="catalog-stack">
                <el-date-picker
                    v-model="quickRange"
                    type="daterange"
                    :shortcuts="dateShortcuts"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
                <el-date-picker
                    v-model="year"
                    type="year"
                    value-format="YYYY"
                    placeholder="选择年份"
                />
                <el-time-select
                    v-model="timeSlot"
                    start="09:00"
                    step="00:30"
                    end="18:00"
                    placeholder="选择工作时间"
                />
                <p class="catalog-state">
                    范围：{{quickRange && quickRange.length ? quickRange.join(' 至 ') :
                    '未选择'}}；时间：{{timeSlot || '未选择'}}
                </p>
            </div>
        </a-panel>
        <a-panel title="日期与时间组合">
            <el-date-picker
                v-model="dateTimeRange"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
            />
        </a-panel>
    `;
    extras.upload.html += /* HTML */ `
        <a-panel title="图片选择与预览" description="仅保留在当前浏览器，不上传">
            <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                accept="image/*"
                :limit="3"
                v-model:file-list="pictureFiles"
                :on-preview="previewPicture"
                :on-exceed="uploadExceeded"
            >
                ＋
            </el-upload>
            <p class="catalog-state">最多选择 3 张图片；点击缩略图预览。</p>
            <el-dialog v-model="previewOpen" title="图片预览" width="min(720px,92vw)">
                <img
                    :src="previewUrl"
                    alt="所选图片预览"
                    style="display:block;max-width:100%;max-height:70vh;margin:auto"
                />
            </el-dialog>
        </a-panel>
        <a-panel title="模拟上传进度" description="模拟进度，不发送文件">
            <div class="catalog-row">
                <el-upload
                    action="#"
                    :auto-upload="false"
                    :limit="1"
                    v-model:file-list="progressFiles"
                    :on-exceed="uploadExceeded"
                >
                    <el-button>选择文件</el-button>
                </el-upload>
                <el-button
                    type="primary"
                    :disabled="!progressFiles.length || uploadRunning"
                    @click="simulateUpload"
                >
                    {{uploadRunning?'处理中':'开始模拟'}}
                </el-button>
            </div>
            <el-progress
                class="mt-3"
                :percentage="uploadProgress"
                :status="uploadProgress===100?'success':undefined"
            />
        </a-panel>
    `;
    extras.date.code += `

<el-date-picker v-model="range" type="daterange" :shortcuts="shortcuts" value-format="YYYY-MM-DD" />
<el-time-select v-model="time" start="09:00" step="00:30" end="18:00" />`;
    extras.upload.code += `

<el-upload list-type="picture-card" :auto-upload="false" :on-preview="preview" accept="image/*" />`;
    extras.dialog.code += `

// 确认弹窗
await ElementPlus.ElMessageBox.confirm('确定删除吗？', '删除确认', { type: 'error' });`;
    extras.pagination.code += `

<el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="520" layout="total, sizes, prev, pager, next, jumper" />`;
})();
