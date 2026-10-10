'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const langCodes=['fr','en','es','pt','it','de','nl','ar'];
test('KOURANT: current owner V3 on correct BUILD profile',()=>{
 assert.match(html,/https:\/\/build\.digiylyfe\.com\/acces-proprietaire-v3\.html/);
 assert.doesNotMatch(html,/acces-proprietaire-v2\.html/);
 assert.match(html,/u\.searchParams\.set\('site','partenaires-kourant'\)/);
 assert.match(html,/u\.searchParams\.set\('lang',lang\)/);
 assert.match(html,/u\.searchParams\.set\('return',profile\(\)\)/);
 assert.match(html,/id="ownerAccessBtn"/);
});
test('Owner button stays visible when installed as PWA',()=>{
 assert.doesNotMatch(html,/@media\s*\(display-mode:\s*standalone\)\s*\{\s*#ownerAccessBtn\s*\{\s*display:\s*none/);
 assert.doesNotMatch(html,/matchMedia\s*\(\s*['"]\(display-mode:\s*standalone\)/);
 assert.doesNotMatch(html,/navigator\.standalone\s*===\s*true/);
 assert.match(html,/getElementById\('ownerAccessBtn'\)\.hidden=false/);
});
test('WORLD8 owner labels and direct contacts remain intact',()=>{
 for(const lang of langCodes)assert.match(html,new RegExp(lang+":'🔐"),"missing owner label "+lang);
 assert.match(html,/const PHONE='221772084781'/);
 assert.match(html,/https:\/\/wa\.me\//);
 assert.match(html,/manifest\.webmanifest/);
});
test('No secret or owner email leaks to public site',()=>{
 assert.doesNotMatch(html,/serignesaliou351|service_role|sb_secret_|access_token=/i);
 assert.doesNotMatch(html,/auth\.signInWithOtp/);
 const scripts=html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/g)||[];
 for(const tag of scripts){const code=tag.replace(/^<script\b[^>]*>/,'').replace(/<\/script>$/,'');if(code.trim())new vm.Script(code)}
});
