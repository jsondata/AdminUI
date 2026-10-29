/* 按需读取页面模板；页面逻辑仍由 Vue 组件负责。 */
(function (global) {
    const pending = new Map();

    function loadTemplate(url) {
        if (!pending.has(url)) {
            const request = AdminUI.request(url, { responseType: 'text' }).finally(() => {
                pending.delete(url);
            });
            pending.set(url, request);
        }
        return pending.get(url);
    }

    AdminUI.createPage = function (page) {
        if (!page || !page.templateUrl) return page;

        return {
            name: 'PageLoader',
            inheritAttrs: false,
            setup(_props, { attrs, slots }) {
                const component = Vue.shallowRef(null);
                const error = Vue.ref('');
                const loading = Vue.ref(false);
                let disposed = false;

                async function load() {
                    if (loading.value) return;
                    loading.value = true;
                    error.value = '';
                    try {
                        const template = await loadTemplate(page.templateUrl);
                        if (!disposed) component.value = { ...page, template };
                    } catch (cause) {
                        if (!disposed) error.value = cause?.message || '未知错误';
                    } finally {
                        if (!disposed) loading.value = false;
                    }
                }

                Vue.onMounted(load);
                Vue.onBeforeUnmount(() => {
                    disposed = true;
                });

                return () => {
                    if (component.value) return Vue.h(component.value, attrs, slots);
                    if (error.value) {
                        return Vue.h('div', { class: 'alert alert-danger', role: 'alert' }, [
                            Vue.h('p', '页面加载失败：' + error.value),
                            Vue.h(
                                'button',
                                { type: 'button', class: 'btn btn-outline-danger', onClick: load },
                                '重新加载',
                            ),
                        ]);
                    }
                    return Vue.h('p', { role: 'status' }, '正在加载页面…');
                };
            },
        };
    };
})(window);
