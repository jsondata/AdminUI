(function () {
  'use strict';
  const { createApp, ref, reactive } = Vue;
  const errors = {
    '403': { label: '访问受限', subtitle: 'FORBIDDEN', title: '这里暂时无法访问', description: '当前账号没有访问此页面的权限。请返回工作台，或联系管理员确认权限。', help: '需要访问？请联系你的工作空间管理员。' },
    '404': { label: '页面未找到', subtitle: 'NOT FOUND', title: '没有找到这个页面', description: '你访问的页面可能已经移动或不存在。请检查地址，或返回工作台继续浏览。', help: '确认地址无误？试试从工作台重新进入。' },
    '500': { label: '服务异常', subtitle: 'SERVER ERROR', title: '服务遇到了一点问题', description: '服务器暂时无法处理你的请求。请稍后重试，或返回工作台。', help: '如果问题持续出现，请联系系统管理员。' },
    '502': { label: '连接异常', subtitle: 'BAD GATEWAY', title: '暂时无法连接服务', description: '网关暂时无法连接上游服务。请稍等片刻后重试。', help: '如果问题持续出现，请联系系统管理员。' }
  };
  const requested = new URLSearchParams(location.search).get('type') || 'login';
  const type = ['login', 'register', ...Object.keys(errors)].includes(requested) ? requested : '404';
  document.title = (type === 'login' ? '登录' : type === 'register' ? '注册' : type) + ' · AdminUI';
  createApp({
    setup() {
      const formRef = ref();
      const form = reactive({ name: '', email: '', password: '', confirm: '' });
      const notice = ref('');
      const rules = {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, ...(type === 'register' ? [{ min: 8, message: '密码至少 8 位', trigger: 'blur' }] : [])],
        confirm: [{ required: true, message: '请再次输入密码', trigger: 'blur' }, { validator: (_rule, value, callback) => value === form.password ? callback() : callback(new Error('两次输入的密码不一致')), trigger: 'blur' }]
      };
      async function submit() {
        try { await formRef.value.validate(); notice.value = '表单校验通过。当前是演示页面，请接入账号服务。'; }
        catch (_) { notice.value = '请检查表单中的提示。'; }
      }
      function goBack() { if (history.length > 1) history.back(); else location.href = '../index.html#/dashboard'; }
      return { type, isAuth: type === 'login' || type === 'register', error: errors[type], formRef, form, rules, notice, submit, goBack };
    }
  }).use(ElementPlus, { locale: ElementPlusLocaleZhCn }).mount('#app');
})();
