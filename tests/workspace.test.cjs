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
  const store = { getItem: key => storage.get(key) ?? null, setItem: (key,value) => storage.set(key,value) };
  const doc = { documentElement: { setAttribute(){}, classList: { toggle(){} } } };
  const context = { console, setTimeout, clearTimeout, URLSearchParams, AbortController, location, sessionStorage:store, localStorage:store, history:{ replaceState(_a,_b,url){location.hash=url;} }, addEventListener:(name,cb)=>listeners.set(name,cb),removeEventListener:name=>listeners.delete(name) };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'vendor/vue/vue.global.prod.js'),'utf8'),context);
  context.document = doc;
  vm.runInContext(fs.readFileSync(path.join(root,'src/admin-ui.js'),'utf8'),context);
  const options = {storageKey:'test',home:'/home',routes:['/home','/users','/forms','/docs'].map(p=>({path:p,title:p,component:{}}))};
  return { context, location, storage, listeners, make:()=>context.AdminUI.createWorkspace(options), options };
}
const plain = value => JSON.parse(JSON.stringify(value));
test('opens a route once and persists insertion order',()=>{const h=harness(),w=h.make();assert.equal(w.open('/users'),true);w.open('/users');w.open('/forms');assert.deepEqual(plain(w.opened.value),['/home','/users','/forms']);assert.equal(w.active.value,'/forms');assert.deepEqual(JSON.parse(h.storage.get('test')),['/home','/users','/forms']);});
test('rejects unknown routes and invalid configuration',()=>{const h=harness(),w=h.make();assert.equal(w.open('/unknown'),false);assert.equal(w.active.value,'/home');assert.throws(()=>h.context.AdminUI.createWorkspace({routes:[]}),/不能为空/);assert.throws(()=>h.context.AdminUI.createWorkspace({routes:[{path:'a'},{path:'a'}]}),/不可重复/);assert.throws(()=>h.context.AdminUI.createWorkspace({...h.options,home:'/missing'}),/home/);});
test('restores saved tabs and drops unknown routes and duplicates',()=>{const h=harness(['/home','/bad','/users','/users']);assert.deepEqual(plain(h.make().opened.value),['/home','/users']);});
test('closing current tab chooses its right neighbour',()=>{const w=harness().make();w.open('/users');w.open('/forms');w.open('/users');w.close('/users');assert.equal(w.active.value,'/forms');assert.deepEqual(plain(w.opened.value),['/home','/forms']);});
test('closing inactive tab preserves active page',()=>{const w=harness().make();w.open('/users');w.close('/home');assert.equal(w.active.value,'/users');});
test('left and right range closures preserve pivot',()=>{const w=harness().make();w.open('/users');w.open('/forms');w.open('/docs');w.closeRange('/users','left');assert.deepEqual(plain(w.opened.value),['/users','/forms','/docs']);w.closeRange('/users','right');assert.deepEqual(plain(w.opened.value),['/users']);assert.equal(w.active.value,'/users');});
test('close all stays empty after hash synchronization and refresh',()=>{const h=harness(),w=h.make();w.start();w.open('/users');w.closeRange('/users','all');h.listeners.get('hashchange')();assert.equal(w.active.value,'/home');assert.deepEqual(plain(w.opened.value),[]);const refreshed=h.make();assert.deepEqual(plain(refreshed.opened.value),[]);assert.equal(refreshed.active.value,'/home');refreshed.open('/forms');assert.deepEqual(plain(refreshed.opened.value),['/forms']);});
test('hash back navigation opens matching tab and releases listeners',()=>{const h=harness(),w=h.make();w.start();h.location.hash='#/users';h.listeners.get('hashchange')();assert.equal(w.active.value,'/users');h.location.hash='#/unknown';h.listeners.get('hashchange')();assert.equal(w.active.value,'/home');assert.equal(h.location.hash,'#/home');w.stop();assert.equal(h.listeners.size,0);});
test('storage failures do not prevent opening pages',()=>{const h=harness();h.context.sessionStorage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};const w=h.make();assert.equal(w.open('/users'),true);});
test('theme preference persists and refresh changes the component key',()=>{const h=harness(),w=h.make();w.toggleTheme();assert.equal(w.theme.value,'dark');assert.equal(h.storage.get('test.theme'),'dark');w.refresh();assert.equal(w.refreshKey.value,1);});
test('request supports JSON, no content, HTTP errors and caller abort',async()=>{const h=harness(),api=h.context.AdminUI;h.context.fetch=async()=>({ok:true,status:200,json:async()=>({id:1})});assert.deepEqual(await api.request('/users'),{id:1});h.context.fetch=async()=>({ok:true,status:204});assert.equal(await api.request('/empty'),null);h.context.fetch=async()=>({ok:false,status:403});await assert.rejects(api.request('/denied'),/HTTP 403/);const controller=new AbortController();controller.abort();h.context.fetch=async(_url,init)=>{if(init.signal.aborted)throw Error('aborted')};await assert.rejects(api.request('/abort',{signal:controller.signal}),/aborted/);});
test('all library and demo templates compile with the bundled Vue compiler',()=>{
  const h=harness();
  const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  h.context.document.createElement=()=>({set innerHTML(value){this.textContent=decode(value);const attr=value.match(/<div foo="([\s\S]*)">/);this.children=[{getAttribute:()=>attr?decode(attr[1]):null}];},textContent:'',children:[]});
  h.context.ElementPlus={ElMessage:{}};
  vm.runInContext(fs.readFileSync(path.join(root,'demo/pages.js'),'utf8'),h.context);
  vm.runInContext(fs.readFileSync(path.join(root,'demo/navigation.js'),'utf8'),h.context);
  vm.runInContext(fs.readFileSync(path.join(root,'demo/catalog-more.js'),'utf8'),h.context);
  vm.runInContext(fs.readFileSync(path.join(root,'demo/catalog-advanced.js'),'utf8'),h.context);
  vm.runInContext(fs.readFileSync(path.join(root,'demo/catalog.js'),'utf8'),h.context);
  vm.runInContext(fs.readFileSync(path.join(root,'demo/table-examples.js'),'utf8'),h.context);
  vm.runInContext(fs.readFileSync(path.join(root,'demo/charts.js'),'utf8'),h.context);
  const catalog=h.context.AdminUIDemo.catalog;
  const examples=Object.fromEntries(Object.keys(catalog.specs).map(key=>[key,catalog.build(key)]));
  for(const [name,component] of Object.entries({...h.context.AdminUI.components,...h.context.AdminUIDemo,...examples})){
    if(!component || typeof component !== 'object' || !component.template) continue;
    if(component.components)for(const child of Object.values(component.components))if(child.template)assert.doesNotThrow(()=>h.context.Vue.compile(child.template),name+' child template');
    if(component.template)assert.doesNotThrow(()=>h.context.Vue.compile(component.template),name+' template');
  }
});

test('direct link opens a non-home page even with an empty saved workspace',()=>{const w=harness([],'#/users').make();assert.equal(w.active.value,'/users');assert.deepEqual(plain(w.opened.value),['/users']);});

test('recursive menu lookup returns the complete ancestor trail',()=>{
  const h=harness();
  const menus=[{title:'开发',group:true,children:[{title:'组件',children:[{title:'基础',children:[{title:'按钮',path:'/buttons'}]}]}]}];
  assert.deepEqual(plain(h.context.AdminUI.findMenuTrail(menus,'/buttons')).map(n=>n.title),['开发','组件','基础','按钮']);
  assert.deepEqual(plain(h.context.AdminUI.findMenuTrail(menus,'/missing')),[]);
});
test('recursive menus retain compatibility with the existing items format',()=>{
  const h=harness();
  const menus=[{title:'工作空间',items:[{path:'/home',title:'首页'}]}];
  assert.deepEqual(plain(h.context.AdminUI.findMenuTrail(menus,'/home')).map(n=>n.title),['工作空间','首页']);
});
