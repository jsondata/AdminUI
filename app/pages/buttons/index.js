/* 页面交互逻辑。 */
(function () {
    const { ref, computed } = Vue;
    AdminUIPages.Buttons = {
        name: 'Buttons',
        setup() {
            const loading = ref(false);
            let timer;
            Vue.onUnmounted(() => clearTimeout(timer));
            function submit() {
                loading.value = true;
                timer = setTimeout(() => {
                    loading.value = false;
                    ElementPlus.ElMessage.success('演示操作已完成');
                }, 600);
            }
            return { loading, submit };
        },
        templateUrl: 'app/pages/buttons/index.html',
    };
})();
