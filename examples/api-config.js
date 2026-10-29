/* 本地示例的接口配置；业务项目可复制并按服务端协议修改。 */
window.AdminUIApiConfig = {
    // 空字符串表示使用当前域名；也可以填写 https://api.example.com。
    baseURL: '',
    timeout: 15000,
    unauthorizedStatuses: [401],
    response: {
        codeField: 'code',
        successCodes: [0],
        messageField: 'message',
        dataField: 'data',
        unauthorizedCodes: [401],
    },
};
