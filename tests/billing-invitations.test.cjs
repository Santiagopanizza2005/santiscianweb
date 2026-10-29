const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const id='84a2f5bf-3dab-4fa6-a479-c09293c15b0e';
const checkout='https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=fixture';
let row, reads, posts, updates, failRemote, failPersistence, badAccount;
class MercadoPagoError extends Error {constructor(status){super('Provider error');this.status=status}}
function config(){return {environment:'production',collector:'123',origin:'https://www.santiscian.com'}}
function reset(){
 process.env.SUPABASE_SECRET_KEY='private-invitation-test-key-not-a-real-secret';
 delete process.env.RESEND_API_KEY; delete process.env.BILLING_EMAIL_FROM;
 row={id,environment:'production',invitation_created_at:new Date().toISOString(),status:'draft',mp_id:null,checkout_url:null,service:'Mantenimiento de prueba',amount:150000,email:'contact@example.test',client_name:'Cliente'};
 reads=0;posts=[];updates=[];failRemote=null;failPersistence=false;badAccount=false;
}
const db={from(){reads++;let filters=[],update;
 const exec=()=>{if(!row||!filters.every(([k,v])=>row[k]===v))return {data:null,error:null};if(update){updates.push(update);row={...row,...update}}return {data:{...row},error:null}};
 return {select(){return this},eq(k,v){filters.push([k,v]);return this},update(v){update=v;return this},maybeSingle:async()=>exec(),then(resolve,reject){return Promise.resolve(exec()).then(resolve,reject)}};
}};
const oldLoad=Module._load;
Module._load=function(request,parent,isMain){
 if(request==='server-only')return {};
 if(request.endsWith('/supabase-admin'))return {getSupabaseAdminClient:()=>db};
 if(request==='./mercadopago')return {billingConfig:config,MercadoPagoError,verifyBillingAccount:async()=>{if(badAccount)throw Error('Wrong collector');return config()},mpRequest:async(path,method,body,key)=>{posts.push({path,method,body,key});if(failRemote)throw failRemote;return {id:'fixture',init_point:checkout,status:'pending'}}};
 if(request==='./sync')return {syncPreapproval:async(remote)=>{if(failPersistence)throw Error('Write failed');row={...row,mp_id:remote.id,status:remote.status,checkout_url:remote.init_point};return true}};
 return oldLoad.call(this,request,parent,isMain);
};
const {invitationToken,verifyInvitationToken,invitationUrl}=require('../lib/billing/invitations.ts');
const {loadInvitation,startCustomerCheckout}=require('../lib/billing/customer-checkout.ts');
const token=()=>invitationToken(row.id,row.environment,row.invitation_created_at);

test('signed invitations reject guessed, tampered, expired and future links before database access',async()=>{
 reset();const signed=token();assert.ok(verifyInvitationToken(id,signed));
 for(const invalid of ['anything',signed.slice(0,-1)+(signed.endsWith('a')?'b':'a'),invitationToken(id,'production',new Date(Date.now()-31*86400000).toISOString()),invitationToken(id,'production',new Date(Date.now()+86400000).toISOString())])assert.equal(await loadInvitation(id,invalid),null);
 assert.equal(reads,0);assert.equal(posts.length,0);
 assert.equal(verifyInvitationToken('f4a2f5bf-3dab-4fa6-a479-c09293c15b0e',signed),null);
});
test('reissued links revoke previous invitations and test links cannot use a production connection',async()=>{
 reset();const old=token();row.invitation_created_at=new Date(Date.now()+1000).toISOString();assert.equal(await loadInvitation(id,old),null);
 row.environment='test';assert.equal(await loadInvitation(id,token()),null);assert.equal(posts.length,0);
});
test('customer email is separate from contact email and simultaneous submits create only one checkout',async()=>{
 reset();const signed=token();const result=await Promise.all([startCustomerCheckout(id,signed,'PAYER@example.test'),startCustomerCheckout(id,signed,'PAYER@example.test')]);
 assert.equal(posts.length,1);assert.equal(posts[0].body.payer_email,'payer@example.test');assert.equal(posts[0].key,id);
 assert.equal(row.email,'contact@example.test');assert.equal(row.payer_email,'payer@example.test');assert.equal(row.status,'pending');assert.ok(result.some(r=>r.url===checkout));
 const again=await startCustomerCheckout(id,signed,'payer@example.test');assert.equal(again.url,checkout);assert.equal(posts.length,1);
});
test('invalid email, cancelled subscription and wrong merchant never create a checkout',async()=>{
 reset();assert.ok((await startCustomerCheckout(id,token(),'bad')).error);assert.equal(reads,0);
 row.status='cancelled';assert.ok((await startCustomerCheckout(id,token(),'payer@example.test')).error);assert.equal(posts.length,0);
 reset();badAccount=true;assert.ok((await startCustomerCheckout(id,token(),'payer@example.test')).error);assert.equal(updates.length,0);
});
test('uncertain provider outcomes and failed persistence block automatic recreation',async()=>{
 for(const failedWrite of [false,true]){reset();failPersistence=failedWrite;failRemote=failedWrite?null:new TypeError('fetch failed');const signed=token();assert.ok((await startCustomerCheckout(id,signed,'payer@example.test')).error);assert.equal(row.status,'create_unknown');assert.ok((await startCustomerCheckout(id,signed,'payer@example.test')).error);assert.equal(posts.length,1)}
});
test('definitive rejection allows correcting payer email without changing contact email',async()=>{
 reset();failRemote=new MercadoPagoError(400);const signed=token();assert.ok((await startCustomerCheckout(id,signed,'wrong@example.test')).error);assert.equal(row.status,'draft');
 failRemote=null;assert.equal((await startCustomerCheckout(id,signed,'correct@example.test')).url,checkout);assert.equal(row.payer_email,'correct@example.test');assert.equal(row.email,'contact@example.test');
});
