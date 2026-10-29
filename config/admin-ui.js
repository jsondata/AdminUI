/* 应用配置：部署时按实际接口调整。 */
window.AdminUIConfig = {
    request: {
        // 留空使用当前域名；也可填写包含路径的接口地址。
        baseURL: '',
        timeout: 15000,
        credentials: 'same-origin',
        // 配置请求头名称并提供 getToken 后，才会自动携带令牌。
        tokenName: false,
        tokenPrefix: '',
        getToken: null,
        unauthorizedStatuses: [401],
        // 按应用需要处理登录失效和其他错误。
        onUnauthorized: null,
        onError: null,
    },
    response: {
        // 按服务端返回结构配置；enabled 为 false 时不解析业务码。
        enabled: true,
        statusName: 'code',
        statusCode: { ok: 0, logout: 1001 },
        msgName: 'message',
        dataName: 'data',
    },
};
