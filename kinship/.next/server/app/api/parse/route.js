"use strict";(()=>{var e={};e.id=642,e.ids=[642],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2423:(e,a,t)=>{t.r(a),t.d(a,{originalPathname:()=>_,patchFetch:()=>b,requestAsyncStorage:()=>h,routeModule:()=>m,serverHooks:()=>f,staticGenerationAsyncStorage:()=>y});var r={};t.r(r),t.d(r,{POST:()=>u});var i=t(9303),o=t(8716),n=t(670),s=t(7070),l=t(1926),c=t(2364),d=t(6079);let p={vehicle:{tag:"has_vehicle",category:"transport",detail:"Has a vehicle"},first_aid:{tag:"first_aid_trained",category:"medical",detail:"First aid training"},generator:{tag:"has_generator",category:"power",detail:"Generator / solar / battery"},spare_room:{tag:"spare_room",category:"shelter",detail:"Spare room available"},translation:{tag:"translator",category:"language",detail:"Can translate languages"},cooking:{tag:"can_cook_bulk",category:"food",detail:"Can cook for groups"},it_skills:{tag:"IT_skills",category:"communication",detail:"IT / tech skills"},tools:{tag:"has_tools",category:"equipment",detail:"Tools and equipment"},pet_care:{tag:"can_mind_pets",category:"care",detail:"Can mind pets"},childcare:{tag:"childcare_experience",category:"childcare",detail:"Childcare experience"},radio:{tag:"has_radio",category:"communication",detail:"Radio / communications equipment"},physical:{tag:"physical_labour",category:"physical_help",detail:"Can do physical labour"}},g={transport:{tag:"needs_transport",category:"transport",detail:"Needs transport / evacuation",priority:2},medical:{tag:"needs_medical",category:"medical",detail:"Needs medical support",priority:2},language:{tag:"needs_language_help",category:"language",detail:"Needs language help",priority:2},shelter:{tag:"needs_shelter",category:"shelter",detail:"Needs shelter",priority:2},power:{tag:"needs_power",category:"power",detail:"Needs power for devices",priority:2},communication:{tag:"needs_communication",category:"communication",detail:"Needs communication help",priority:2},pet_care:{tag:"needs_pet_care",category:"care",detail:"Needs pet care during evacuation",priority:3},mobility:{tag:"mobility_impaired",category:"physical_help",detail:"Needs mobility assistance",priority:1},childcare:{tag:"needs_childcare",category:"childcare",detail:"Needs childcare",priority:2},elderly:{tag:"elderly_needs_checkins",category:"care",detail:"Needs elderly check-ins",priority:2},vision_hearing:{tag:"vision_hearing_support",category:"communication",detail:"Vision / hearing support",priority:2}};async function u(e){try{let{user_id:a,raw_capabilities_text:t,raw_needs_text:r,checkbox_capabilities:i,checkbox_needs:o}=await e.json(),n=[],u=[],m=[];if(t||r){let e=process.env.ANTHROPIC_API_KEY;if(e)try{let a=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":e,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1024,system:c.P,messages:[{role:"user",content:`Capabilities: ${t||"none"}
Needs: ${r||"none"}
Extract all tags.`}]})}),i=await a.json(),o=i.content?.[0]?.text||"{}",s=JSON.parse(o);n=s.capabilities||[],u=s.needs||[],m=s.languages||[]}catch(e){console.error("Claude parse failed:",e)}}if(i&&Array.isArray(i))for(let e of i){let a=p[e];a&&!n.find(e=>e.tag===a.tag)&&n.push(a)}if(o&&Array.isArray(o))for(let e of o){let a=g[e];a&&!u.find(e=>e.tag===a.tag)&&u.push(a)}let h=(0,l.lx)();if(h){if(n.length>0){let e=n.map(e=>({id:(0,d.Z)(),user_id:a,tag:e.tag,category:e.category,detail:e.detail}));await h.from("capabilities").insert(e)}if(u.length>0){let e=u.map(e=>({id:(0,d.Z)(),user_id:a,tag:e.tag,category:e.category,detail:e.detail||"",priority:e.priority||2}));await h.from("needs").insert(e)}await h.from("profiles").update({raw_capabilities_text:t,raw_needs_text:r}).eq("id",a)}return s.NextResponse.json({capabilities:n.map((e,t)=>({id:`cap-${a}-${t}`,user_id:a,...e})),needs:u.map((e,t)=>({id:`need-${a}-${t}`,user_id:a,...e,detail:e.detail||""})),languages:m})}catch(a){let e=a instanceof Error?a.message:"Failed to parse text";return s.NextResponse.json({error:e},{status:500})}}let m=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/parse/route",pathname:"/api/parse",filename:"route",bundlePath:"app/api/parse/route"},resolvedPagePath:"C:\\Users\\jatin\\OneDrive\\Documents\\GitHub\\UniHack-project-\\kinship\\src\\app\\api\\parse\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:h,staticGenerationAsyncStorage:y,serverHooks:f}=m,_="/api/parse/route";function b(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:y})}},2364:(e,a,t)=>{t.d(a,{P:()=>i,f:()=>r});let r=`You are the Kinship resilience cluster matching engine.

Given a list of residents with their locations, capabilities, needs, and languages, create optimal emergency resilience clusters.

RULES:
- Cluster size: 4-6 people per cluster
- Proximity: members should be within 500m of each other (use lat/lng)
- Every NEED should ideally be matched by a CAPABILITY in the same cluster
- Language matching: if someone speaks limited English, at least one other member should share their language
- Diversity: clusters should have varied capabilities (not all people with cars in one group)
- If a need cannot be matched, flag it as a GAP

RESPOND WITH ONLY VALID JSON (no backticks, no markdown):
{
  "clusters": [
    {
      "name": "A friendly 2-3 word name for this cluster",
      "member_ids": ["uuid1", "uuid2"],
      "resilience_score": 0-100,
      "matched_pairs": [
        {"need": "Person X needs transport", "offer": "Person Y has a car", "strength": "strong"}
      ],
      "gaps": ["No one has a generator", "No medical training"],
      "explanation": "2-3 sentence human-readable explanation of why these people complement each other. Reference specific members by name."
    }
  ]
}`,i=`You extract structured emergency-preparedness tags from text.
Return ONLY valid JSON. No markdown. No explanation. No backticks.

Schema: {
  "capabilities": [{"tag": "string", "category": "string", "detail": "string"}],
  "needs": [{"tag": "string", "category": "string", "priority": 1|2|3}],
  "languages": ["string"]
}

Categories: transport, medical, shelter, power, communication, food, physical_help, childcare, language, equipment, care
Priority: 1=critical, 2=important, 3=nice-to-have`},1926:(e,a,t)=>{function r(){return process.env.SUPABASE_SERVICE_ROLE_KEY,null}t.d(a,{lx:()=>r}),t(7857)},6079:(e,a,t)=>{t.d(a,{Z:()=>l});let r=require("crypto"),i={randomUUID:r.randomUUID},o=new Uint8Array(256),n=o.length,s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));let l=function(e,a,t){if(i.randomUUID&&!a&&!e)return i.randomUUID();let l=(e=e||{}).random??e.rng?.()??(n>o.length-16&&((0,r.randomFillSync)(o),n=0),o.slice(n,n+=16));if(l.length<16)throw Error("Random bytes length must be >= 16");if(l[6]=15&l[6]|64,l[8]=63&l[8]|128,a){if((t=t||0)<0||t+16>a.length)throw RangeError(`UUID byte range ${t}:${t+15} is out of buffer bounds`);for(let e=0;e<16;++e)a[t+e]=l[e];return a}return function(e,a=0){return(s[e[a+0]]+s[e[a+1]]+s[e[a+2]]+s[e[a+3]]+"-"+s[e[a+4]]+s[e[a+5]]+"-"+s[e[a+6]]+s[e[a+7]]+"-"+s[e[a+8]]+s[e[a+9]]+"-"+s[e[a+10]]+s[e[a+11]]+s[e[a+12]]+s[e[a+13]]+s[e[a+14]]+s[e[a+15]]).toLowerCase()}(l)}}};var a=require("../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),r=a.X(0,[276,564],()=>t(2423));module.exports=r})();