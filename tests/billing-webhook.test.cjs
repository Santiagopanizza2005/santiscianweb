const assert = require('node:assert/strict');
const test = require('node:test');
const { createHmac } = require('node:crypto');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText, filename);
const oldLoad = Module._load;
Module._load = function(request, parent, isMain) {if(request==='server-only')return {};return oldLoad.call(this,request,parent,isMain)};
const {POST} = require('../app/api/mercadopago/webhook/route.ts');
Object.assign(process.env,{MERCADOPAGO_ACCESS_TOKEN:'test-not-a-real-token',MERCADOPAGO_COLLECTOR_ID:'123',MERCADOPAGO_ENVIRONMENT:'test',MERCADOPAGO_WEBHOOK_SECRET:'a'.repeat(64),BILLING_PUBLIC_ORIGIN:'https://santiscian.com'});
let calls=0;
global.fetch=async()=>{calls++;throw Error('Unexpected network request')};
const req = (query='',body={},headers={}) => new Request(`https://santiscian.com/api/mercadopago/webhook?${query}`,{method:'POST',body:JSON.stringify(body),headers});
const signedQuery = 'data.id=123';
const signedHeaders = () => ({'x-request-id':'test-request','x-signature':'ts=1704908010,v1='+createHmac('sha256',process.env.MERCADOPAGO_WEBHOOK_SECRET).update('id:123;request-id:test-request;ts:1704908010;').digest('hex')});
test('webhook remains unavailable without merchant credentials',async()=>{
 const token=process.env.MERCADOPAGO_ACCESS_TOKEN;delete process.env.MERCADOPAGO_ACCESS_TOKEN;
 assert.equal((await POST(req('data.id=123'))).status,503);process.env.MERCADOPAGO_ACCESS_TOKEN=token;
});
test('unsigned requests and invalid secrets cannot trigger network calls or database writes',async()=>{
 for(const query of ['data.id=123','data.id=123&key=bad'])assert.equal((await POST(req(query,{type:'subscription_preapproval'}))).status,401);
 assert.equal(calls,0);
});
test('body cannot replace the authenticated resource ID',async()=>{
 assert.equal((await POST(req(signedQuery,{type:'subscription_preapproval',data:{id:'999'}},signedHeaders()))).status,400);
 assert.equal(calls,0);
});
test('events from another environment or merchant are ignored before requesting the provider',async()=>{
 const query=signedQuery;
 assert.equal((await POST(req(query,{type:'subscription_preapproval',live_mode:true},signedHeaders()))).status,200);
 assert.equal((await POST(req(query,{type:'subscription_preapproval',user_id:999},signedHeaders()))).status,200);
 assert.equal(calls,0);
});
test('oversized webhook bodies are rejected before JSON parsing',async()=>{
 const query=signedQuery;
 assert.equal((await POST(req(query,{text:'x'.repeat(17000)},signedHeaders()))).status,413);
 assert.equal(calls,0);
});
