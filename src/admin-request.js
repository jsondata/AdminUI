/* 可选的应用请求入口：读取正式配置并创建统一客户端。 */
(function (global) {
    const AdminUI = global.AdminUI;

    if (!AdminUI) throw new Error('请先加载 src/admin-ui.js');

    AdminUI.createConfiguredRequest = function (config, hooks = {}) {
        const request = config?.request || {};
        const response = config?.response || {};
        const getToken = hooks.getToken ?? request.getToken;

        return AdminUI.createRequestClient({
            baseURL: request.baseURL,
            timeout: request.timeout,
            unauthorizedStatuses: request.unauthorizedStatuses,
            response:
                response.enabled === false
                    ? null
                    : {
                          codeField: response.statusName,
                          successCodes: [response.statusCode?.ok ?? 0],
                          unauthorizedCodes: [response.statusCode?.logout ?? 1001],
                          messageField: response.msgName,
                          dataField: response.dataName,
                      },
            async beforeRequest(url, options) {
                const defaults = { credentials: request.credentials || 'same-origin', ...options };
                const prepared = hooks.beforeRequest
                    ? await hooks.beforeRequest(url, defaults)
                    : null;
                const target = prepared?.url ?? url;
                const { skipAuth = false, ...init } = prepared?.options ?? defaults;

                // 只向配置的接口域名携带令牌，避免绝对地址请求泄露凭据。
                if (!skipAuth && request.tokenName && typeof getToken === 'function') {
                    const base = new URL(request.baseURL || '.', global.location.href);
                    const destination = new URL(target, base);
                    if (destination.origin === base.origin) {
                        const token = await getToken();
                        if (token) {
                            const headers = new Headers(init.headers);
                            if (!headers.has(request.tokenName)) {
                                headers.set(request.tokenName, (request.tokenPrefix || '') + token);
                            }
                            init.headers = headers;
                        }
                    }
                }
                return { url: target, options: init };
            },
            transformResponse: hooks.transformResponse,
            onUnauthorized: hooks.onUnauthorized ?? request.onUnauthorized,
            onError: hooks.onError ?? request.onError,
        });
    };

    // 应用可直接复用此客户端，也可以按需创建其他客户端。
    if (global.AdminUIConfig) AdminUI.api = AdminUI.createConfiguredRequest(global.AdminUIConfig);
})(window);
