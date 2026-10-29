/* Forms 页面。 */
(function (global) {
    'use strict';
    const { ref, reactive, computed } = Vue;
    const messages = ElementPlus.ElMessage;
    const { downloadCSV } = global.AdminUIUtils;
    const Forms = {
        name: 'Forms',
        setup() {
            const model = reactive({
                name: '',
                owner: '',
                type: 'product',
                deadline: '',
                budget: 10000,
                description: '',
                content: '<p>在这里编辑项目详情。</p>',
                notice: true,
            });
            const result = ref('');
            const fields = [
                {
                    key: 'name',
                    label: '项目名称',
                    col: 5,
                    placeholder: '例如：新一代运营平台',
                    maxlength: 40,
                },
                {
                    key: 'owner',
                    label: '负责人',
                    col: 3,
                    type: 'select',
                    options: [
                        { value: 'alex', label: 'Alex Chen' },
                        { value: 'lin', label: '林然' },
                        { value: 'zhou', label: '周晴' },
                    ],
                },
                {
                    key: 'type',
                    label: '项目类型',
                    col: 4,
                    type: 'select',
                    options: [
                        { value: 'product', label: '产品研发' },
                        { value: 'design', label: '设计项目' },
                        { value: 'operation', label: '运营活动' },
                    ],
                },
                { key: 'deadline', label: '计划完成日期', col: 3, type: 'date' },
                {
                    key: 'budget',
                    label: '计划预算',
                    col: 2,
                    type: 'number',
                    min: 0,
                    hint: '演示字段，不会产生付款或财务操作。',
                },
                { key: 'notice', label: '接收项目通知', type: 'switch' },
                {
                    key: 'description',
                    label: '项目说明',
                    type: 'textarea',
                    full: true,
                    col: 12,
                    rows: 4,
                },
                {
                    key: 'content',
                    label: '项目详情',
                    type: 'richtext',
                    full: true,
                    options: { uploadServiceUpload: demoEditorUpload },
                    hint: '图片、视频和附件为本地演示（单个不超过 5 MB），不会上传或保存到服务器。',
                },
            ];
            const rules = {
                name: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
                owner: [{ required: true, message: '请选择负责人', trigger: 'change' }],
            };
            function submit() {
                result.value = JSON.stringify(model, null, 2);
                messages.success('校验通过，已生成预览数据（未发送到服务器）');
            }
            function reset() {
                Object.assign(model, {
                    name: '',
                    owner: '',
                    type: 'product',
                    deadline: '',
                    budget: 10000,
                    description: '',
                    content: '<p>在这里编辑项目详情。</p>',
                    notice: true,
                });
                result.value = '';
            }
            return {
                model,
                fields,
                rules,
                result,
                submit,
                reset,
                formSample:
                    '<a-form :model="form" :fields="fields" :rules="rules" @submit="save" />',
            };
        },
        template: /* HTML */ `
            <div>
                <a-page-header
                    title="表单构建"
                    category="组件"
                    description="声明字段与校验规则，即可生成业务表单"
                />
                <a-panel title="创建一个新项目" description="统一的标签、间距和交互行为">
                    <a-form
                        :model="model"
                        :fields="fields"
                        :rules="rules"
                        submit-text="校验并预览"
                        @submit="submit"
                        @cancel="reset"
                    />
                </a-panel>
                <div class="demo-component-grid">
                    <a-panel title="表单数据预览" description="只在本地预览，不调用真实接口">
                        <a-code v-if="result" :code="result" label="JSON" />
                        <a-empty
                            v-else
                            title="准备好你的第一个项目"
                            description="填写上方表单，校验通过后在这里预览结果。"
                        />
                    </a-panel>
                    <a-panel title="如何使用">
                        <a-code :code="formSample" />
                        <p class="demo-doc-text mt-3 mb-0">
                            字段支持输入框、下拉框、多选、日期、数字、开关、文本域和富文本编辑。复杂字段通过同名插槽扩展。
                        </p>
                    </a-panel>
                </div>
            </div>
        `,
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Forms = Forms;
})(window);
