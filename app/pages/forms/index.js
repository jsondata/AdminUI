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
        templateUrl: 'app/pages/forms/index.html',
    };
    global.AdminUIPages = global.AdminUIPages || {};
    global.AdminUIPages.Forms = Forms;
})(window);
