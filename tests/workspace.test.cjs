'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
function harness(saved, hash = '#/home') {
    const storage = new Map(saved === undefined ? [] : [['test', JSON.stringify(saved)]]);
    const listeners = new Map();
    const location = { hash };
    const store = {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
    };
    const doc = { documentElement: { setAttribute() {}, classList: { toggle() {} } } };
    const context = {
        console,
        setTimeout,
        clearTimeout,
        URLSearchParams,
        AbortController,
        location,
        sessionStorage: store,
        localStorage: store,
        history: {
            replaceState(_a, _b, url) {
                location.hash = url;
            },
        },
        addEventListener: (name, cb) => listeners.set(name, cb),
        removeEventListener: (name) => listeners.delete(name),
    };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(
        fs.readFileSync(path.join(root, 'vendor/vue/vue.global.prod.js'), 'utf8'),
        context,
    );
    context.document = doc;
    vm.runInContext(fs.readFileSync(path.join(root, 'src/admin-ui.js'), 'utf8'), context);
    const options = {
        storageKey: 'test',
        home: '/home',
        routes: ['/home', '/users', '/forms', '/docs'].map((p) => ({
            path: p,
            title: p,
            component: {},
        })),
    };
    return {
        context,
        location,
        storage,
        listeners,
        make: () => context.AdminUI.createWorkspace(options),
        options,
    };
}
const plain = (value) => JSON.parse(JSON.stringify(value));
test('opens a route once and persists insertion order', () => {
    const h = harness(),
        w = h.make();
    assert.equal(w.open('/users'), true);
    w.open('/users');
    w.open('/forms');
    assert.deepEqual(plain(w.opened.value), ['/home', '/users', '/forms']);
    assert.equal(w.active.value, '/forms');
    assert.deepEqual(JSON.parse(h.storage.get('test')), ['/home', '/users', '/forms']);
});
test('rejects unknown routes and invalid configuration', () => {
    const h = harness(),
        w = h.make();
    assert.equal(w.open('/unknown'), false);
    assert.equal(w.active.value, '/home');
    assert.throws(() => h.context.AdminUI.createWorkspace({ routes: [] }), /不能为空/);
    assert.throws(
        () => h.context.AdminUI.createWorkspace({ routes: [{ path: 'a' }, { path: 'a' }] }),
        /不可重复/,
    );
    assert.throws(
        () => h.context.AdminUI.createWorkspace({ ...h.options, home: '/missing' }),
        /home/,
    );
});
test('optional access filter excludes routes and their menu branches', () => {
    const h = harness(undefined, '#/users');
    const w = h.context.AdminUI.createWorkspace({
        ...h.options,
        canAccess: (route) => route.path !== '/users',
        menus: [
            {
                title: '组',
                children: [
                    { title: '用户', path: '/users' },
                    { title: '首页', path: '/home' },
                ],
            },
        ],
    });
    assert.equal(w.active.value, '/home');
    assert.equal(w.open('/users'), false);
    assert.deepEqual(
        plain(w.menus[0].children).map((item) => item.path),
        ['/home'],
    );
    assert.throws(
        () => h.context.AdminUI.createWorkspace({ ...h.options, canAccess: () => false }),
        /home 必须允许访问/,
    );
});
test('restores saved tabs and drops unknown routes and duplicates', () => {
    const h = harness(['/home', '/bad', '/users', '/users']);
    assert.deepEqual(plain(h.make().opened.value), ['/home', '/users']);
});
test('closing current tab chooses its right neighbour', () => {
    const w = harness().make();
    w.open('/users');
    w.open('/forms');
    w.open('/users');
    w.close('/users');
    assert.equal(w.active.value, '/forms');
    assert.deepEqual(plain(w.opened.value), ['/home', '/forms']);
});
test('closing inactive tab preserves active page', () => {
    const w = harness().make();
    w.open('/users');
    w.close('/home');
    assert.equal(w.active.value, '/users');
});
test('left and right range closures preserve pivot', () => {
    const w = harness().make();
    w.open('/users');
    w.open('/forms');
    w.open('/docs');
    w.closeRange('/users', 'left');
    assert.deepEqual(plain(w.opened.value), ['/users', '/forms', '/docs']);
    w.closeRange('/users', 'right');
    assert.deepEqual(plain(w.opened.value), ['/users']);
    assert.equal(w.active.value, '/users');
});
test('invalid range action does not close any tabs', () => {
    const w = harness().make();
    w.open('/users');
    assert.equal(w.closeRange('/users', 'typo'), false);
    assert.deepEqual(plain(w.opened.value), ['/home', '/users']);
});
test('close all stays empty after hash synchronization and refresh', () => {
    const h = harness(),
        w = h.make();
    w.start();
    w.open('/users');
    w.closeRange('/users', 'all');
    h.listeners.get('hashchange')();
    assert.equal(w.active.value, '/home');
    assert.deepEqual(plain(w.opened.value), []);
    const refreshed = h.make();
    assert.deepEqual(plain(refreshed.opened.value), []);
    assert.equal(refreshed.active.value, '/home');
    refreshed.open('/forms');
    assert.deepEqual(plain(refreshed.opened.value), ['/forms']);
});
test('hash back navigation opens matching tab and releases listeners', () => {
    const h = harness(),
        w = h.make();
    w.start();
    h.location.hash = '#/users';
    h.listeners.get('hashchange')();
    assert.equal(w.active.value, '/users');
    h.location.hash = '#/unknown';
    h.listeners.get('hashchange')();
    assert.equal(w.active.value, '/home');
    assert.equal(h.location.hash, '#/home');
    w.stop();
    assert.equal(h.listeners.size, 0);
});
test('storage failures do not prevent opening pages', () => {
    const h = harness();
    h.context.sessionStorage = {
        getItem() {
            throw Error('blocked');
        },
        setItem() {
            throw Error('blocked');
        },
    };
    const w = h.make();
    assert.equal(w.open('/users'), true);
});
test('theme preference persists and refresh changes the component key', () => {
    const h = harness(),
        w = h.make();
    w.toggleTheme();
    assert.equal(w.theme.value, 'dark');
    assert.equal(h.storage.get('test.theme'), 'dark');
    w.refresh();
    assert.equal(w.refreshKey.value, 1);
});
test('refresh affects only the active tab and closing resets its key', () => {
    const w = harness().make();
    w.open('/users');
    const home = w.keyFor('/home'),
        user = w.keyFor('/users');
    w.refresh();
    assert.equal(w.keyFor('/home'), home);
    assert.notEqual(w.keyFor('/users'), user);
    w.close('/users');
    w.open('/users');
    assert.equal(w.keyFor('/users'), user);
});
test('request supports JSON, no content, HTTP errors and caller abort', async () => {
    const h = harness(),
        api = h.context.AdminUI;
    h.context.fetch = async () => ({ ok: true, status: 200, json: async () => ({ id: 1 }) });
    assert.deepEqual(await api.request('/users'), { id: 1 });
    h.context.fetch = async () => ({ ok: true, status: 204 });
    assert.equal(await api.request('/empty'), null);
    h.context.fetch = async () => ({ ok: false, status: 403 });
    await assert.rejects(api.request('/denied'), /HTTP 403/);
    const controller = new AbortController();
    controller.abort();
    h.context.fetch = async (_url, init) => {
        if (init.signal.aborted) throw Error('aborted');
    };
    await assert.rejects(api.request('/abort', { signal: controller.signal }), /aborted/);
});
test('request client applies hooks without changing the default request', async () => {
    const h = harness(),
        api = h.context.AdminUI,
        calls = [];
    h.context.fetch = async (url, init) => {
        calls.push({ url, headers: init.headers });
        return { ok: true, status: 200, json: async () => ({ code: 0, data: { id: 4 } }) };
    };
    const client = api.createRequestClient({
        beforeRequest: (url, options) => ({
            url: '/api' + url,
            options: { ...options, headers: { 'X-Test': 'yes' } },
        }),
        transformResponse: (data) => data.data,
    });
    assert.deepEqual(plain(await client('/users')), { id: 4 });
    assert.equal(calls[0].url, '/api/users');
    assert.equal(calls[0].headers['X-Test'], 'yes');
    assert.equal((await api.request('/plain')).code, 0);
    assert.equal(calls[1].url, '/plain');
});
test('request client reports errors and still rejects', async () => {
    const h = harness();
    let reported;
    h.context.fetch = async () => ({ ok: false, status: 401 });
    const client = h.context.AdminUI.createRequestClient({
        onError: (error) => {
            reported = error.status;
        },
    });
    await assert.rejects(client('/private'), /HTTP 401/);
    assert.equal(reported, 401);
});
test('request timeout aborts fetch and caller signal remains independent', async () => {
    const h = harness();
    let observed = false;
    h.context.fetch = (_url, init) =>
        new Promise((_resolve, reject) => {
            init.signal.addEventListener('abort', () => {
                observed = true;
                reject(new Error('timeout'));
            });
        });
    await assert.rejects(h.context.AdminUI.request('/slow', { timeout: 5 }), /timeout/);
    assert.equal(observed, true);
});
test('all library and demo templates compile with the bundled Vue compiler', () => {
    const h = harness();
    const decode = (s) =>
        s
            .replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    h.context.document.createElement = () => ({
        set innerHTML(value) {
            this.textContent = decode(value);
            const attr = value.match(/<div foo="([\s\S]*)">/);
            this.children = [{ getAttribute: () => (attr ? decode(attr[1]) : null) }];
        },
        textContent: '',
        children: [],
    });
    h.context.ElementPlus = { ElMessage: {} };
    for (const file of [
        'app/utils/export.js',
        ...[
            'dashboard',
            'users',
            'forms',
            'components',
            'reports',
            'pageexamples',
            'settings',
            'docs-overview',
        ].map((name) => `app/pages/${name}.js`),
        ...['navigation', 'catalog-more', 'catalog-advanced', 'catalog', 'table-examples'].map(
            (name) => `app/components/${name}.js`,
        ),
        'app/pages/charts.js',
        'app/pages/docs.js',
    ]) {
        vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), h.context);
    }
    const catalog = h.context.AdminUIPages.catalog;
    const examples = Object.fromEntries(
        Object.keys(catalog.specs).map((key) => [key, catalog.build(key)]),
    );
    for (const [name, component] of Object.entries({
        ...h.context.AdminUI.components,
        ...h.context.AdminUIPages,
        ...examples,
    })) {
        if (!component || typeof component !== 'object' || !component.template) continue;
        if (component.components)
            for (const child of Object.values(component.components))
                if (child.template)
                    assert.doesNotThrow(
                        () => h.context.Vue.compile(child.template),
                        name + ' child template',
                    );
        if (component.template)
            assert.doesNotThrow(
                () => h.context.Vue.compile(component.template),
                name + ' template',
            );
    }
});

test('direct link opens a non-home page even with an empty saved workspace', () => {
    const w = harness([], '#/users').make();
    assert.equal(w.active.value, '/users');
    assert.deepEqual(plain(w.opened.value), ['/users']);
});

test('parameterized routes and repeated query values retain distinct tabs', () => {
    const h = harness(undefined, '#/items/42?tag=a&tag=b');
    h.options.routes.push({ path: '/items/:id', title: '详情', component: {} });
    const w = h.make();
    assert.equal(w.current.value.params.id, '42');
    assert.deepEqual(plain(w.current.value.query.tag), ['a', 'b']);
    assert.equal(w.current.value.routePath, '/items/:id');
    assert.equal(w.open('/items/43?search=a%26b'), true);
    assert.equal(w.current.value.query.search, 'a&b');
    assert.equal(h.location.hash, '#/items/43?search=a%26b');
    assert.equal(w.open('/items'), false);
});
test('encoded and decoded query values do not create duplicate tabs on hashchange', () => {
    const h = harness();
    h.options.routes.push({ path: '/items/:id', title: '详情', component: {} });
    const w = h.make();
    w.start();
    w.open('/items/1?name=内容运营');
    h.location.hash = '#/items/1?name=%E5%86%85%E5%AE%B9%E8%BF%90%E8%90%A5';
    h.listeners.get('hashchange')();
    assert.equal(w.current.value.query.name, '内容运营');
    assert.equal(w.opened.value.length, 2);
    assert.equal(w.close('/items/1?name=内容运营'), true);
    assert.equal(w.opened.value.length, 1);
});
test('synchronous navigation guard rejects opening, closing and browser history', () => {
    const h = harness();
    let blocked = true;
    h.options.beforeNavigate = (to, from) => !blocked || !from || to.path === '/forms';
    const w = h.make();
    w.start();
    assert.equal(w.open('/users'), false);
    blocked = false;
    assert.equal(w.open('/users'), true);
    blocked = true;
    assert.equal(w.close('/users'), false);
    assert.equal(w.active.value, '/users');
    h.location.hash = '#/home';
    h.listeners.get('hashchange')();
    assert.equal(w.active.value, '/users');
    assert.equal(h.location.hash, '#/users');
    blocked = false;
    assert.equal(w.open('/home'), true);
});
test('direct route guard redirects blocked initial path to home', () => {
    const h = harness(undefined, '#/users');
    h.options.beforeNavigate = () => false;
    const w = h.make();
    w.start();
    assert.equal(w.active.value, '/home');
    assert.equal(h.location.hash, '#/home');
});

test('recursive menu lookup returns the complete ancestor trail', () => {
    const h = harness();
    const menus = [
        {
            title: '开发',
            group: true,
            children: [
                {
                    title: '组件',
                    children: [{ title: '基础', children: [{ title: '按钮', path: '/buttons' }] }],
                },
            ],
        },
    ];
    assert.deepEqual(
        plain(h.context.AdminUI.findMenuTrail(menus, '/buttons')).map((n) => n.title),
        ['开发', '组件', '基础', '按钮'],
    );
    assert.deepEqual(plain(h.context.AdminUI.findMenuTrail(menus, '/missing')), []);
});
test('recursive menus retain compatibility with the existing items format', () => {
    const h = harness();
    const menus = [{ title: '工作空间', items: [{ path: '/home', title: '首页' }] }];
    assert.deepEqual(
        plain(h.context.AdminUI.findMenuTrail(menus, '/home')).map((n) => n.title),
        ['工作空间', '首页'],
    );
});

test('demo menu JSON points to registered routes', async () => {
    const h = harness();
    h.context.ElementPlus = { ElMessage: {} };
    h.context.AdminUIPages = {};
    for (const file of [
        'app/components/catalog-more.js',
        'app/components/catalog-advanced.js',
        'app/components/catalog.js',
    ]) {
        vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), h.context);
    }
    const menus = JSON.parse(fs.readFileSync(path.join(root, 'app/mock/menus.json'), 'utf8'));
    const options = await new Promise((resolve) => {
        h.context.AdminUI = {
            request: async () => menus,
            createApp: (config) => {
                resolve(config);
                return { mount() {} };
            },
        };
        vm.runInContext(fs.readFileSync(path.join(root, 'app/main.js'), 'utf8'), h.context);
    });
    const paths = new Set(options.routes.map((route) => route.path));
    function check(items) {
        for (const item of items) {
            if (item.path) assert.ok(paths.has(item.path), `unregistered menu route: ${item.path}`);
            if (item.children) check(item.children);
            if (item.items) check(item.items);
        }
    }
    check(menus);
});

test('demo JSON data supports users, charts and reporting', () => {
    const read = (name) =>
        JSON.parse(fs.readFileSync(path.join(root, 'app/mock', name + '.json'), 'utf8'));
    const users = read('users'),
        charts = read('charts'),
        dashboard = read('dashboard'),
        reports = read('reports');
    assert.ok(users.length > 0);
    assert.equal(new Set(users.map((user) => user.id)).size, users.length);
    assert.ok(users.every((user) => Number.isInteger(user.id) && user.name && user.email));
    assert.ok(charts.days.length > 0 && charts.datasets.length > 0);
    assert.ok(
        charts.datasets.every(
            (chart) =>
                chart.title &&
                chart.type &&
                (chart.type === 'map' ? Array.isArray(chart.values) : Array.isArray(chart.series)),
        ),
    );
    assert.ok(dashboard.series && dashboard.projects && dashboard.stats);
    assert.ok(Object.values(reports).every((rows) => Array.isArray(rows) && rows.length > 0));
});

test('configured request client applies base URL, timeout and response protocol', async () => {
    const h = harness();
    const calls = [];
    h.context.fetch = async (url, init) => {
        calls.push({ url, init });
        return { ok: true, status: 200, json: async () => ({ status: 200, result: { id: 7 } }) };
    };
    const api = h.context.AdminUI.createRequestClient({
        baseURL: 'https://api.example.test/v1/',
        timeout: 5000,
        response: { codeField: 'status', successCodes: [200], dataField: 'result' },
        beforeRequest: (url, options) => ({
            url,
            options: { ...options, headers: { 'X-Test': 'yes' } },
        }),
    });
    assert.deepEqual(plain(await api('/users')), { id: 7 });
    assert.equal(calls[0].url, 'https://api.example.test/v1/users');
    assert.equal(calls[0].init.headers['X-Test'], 'yes');
    assert.deepEqual(plain(await api('https://other.example.test/info', { rawResponse: true })), {
        status: 200,
        result: { id: 7 },
    });
    assert.equal(calls[1].url, 'https://other.example.test/info');
    assert.equal('rawResponse' in calls[1].init, false);
});

test('configured request client handles business and HTTP unauthorized errors', async () => {
    const h = harness();
    const events = [];
    const api = h.context.AdminUI.createRequestClient({
        response: { unauthorizedCodes: [1001] },
        unauthorizedStatuses: [403],
        onUnauthorized: (error) => events.push(['unauthorized', error.code ?? error.status]),
        onError: (error) => events.push(['error', error.code ?? error.status]),
    });
    h.context.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ code: 1001, message: '登录失效' }),
    });
    await assert.rejects(
        api('/private'),
        (error) => error.message === '登录失效' && error.code === 1001,
    );
    h.context.fetch = async () => ({ ok: false, status: 403 });
    await assert.rejects(api('/private'), /HTTP 403/);
    assert.deepEqual(events, [
        ['unauthorized', 1001],
        ['error', 1001],
        ['unauthorized', 403],
        ['error', 403],
    ]);
    h.context.fetch = async () => ({ ok: true, status: 200, json: async () => ({ data: [] }) });
    await assert.rejects(api('/bad'), /缺少业务状态码/);
});

test('production request configuration works without demo files and restricts token headers', async () => {
    const h = harness();
    h.context.URL = URL;
    h.context.Headers = Headers;
    h.location.href = 'https://app.example.test/index.html';
    const calls = [];
    h.context.fetch = async (url, init) => {
        calls.push({ url, init });
        return { ok: true, status: 200, json: async () => ({ code: 0, data: { id: 1 } }) };
    };
    for (const file of ['config/admin-ui.js', 'src/admin-request.js']) {
        vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), h.context);
    }
    assert.deepEqual(plain(await h.context.AdminUI.api('/users')), { id: 1 });
    const config = {
        ...h.context.AdminUIConfig,
        request: {
            baseURL: 'https://api.example.test',
            tokenName: 'Authorization',
            tokenPrefix: 'Bearer ',
        },
    };
    const api = h.context.AdminUI.createConfiguredRequest(config, { getToken: () => 'test-token' });
    await api('/private');
    assert.equal(calls[1].init.headers.get('Authorization'), 'Bearer test-token');
    await api('https://other.example.test/public');
    assert.equal(calls[2].init.headers, undefined);
    await api('/public', { skipAuth: true });
    assert.equal(calls[3].init.headers, undefined);
    assert.equal('skipAuth' in calls[3].init, false);
});

test('application entry and menu local resources resolve after directory organization', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
        const file = match[1].split('?')[0];
        assert.ok(fs.existsSync(path.join(root, file)), `missing application resource: ${file}`);
    }
    const menus = JSON.parse(fs.readFileSync(path.join(root, 'app/mock/menus.json'), 'utf8'));
    function check(items) {
        for (const item of items) {
            if (item.href && !/^(?:https?:|\/\/)/.test(item.href)) {
                const file = item.href.split('?')[0].split('#')[0];
                assert.ok(fs.existsSync(path.join(root, file)), `missing menu target: ${file}`);
            }
            if (item.children) check(item.children);
            if (item.items) check(item.items);
        }
    }
    check(menus);
});
