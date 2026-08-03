import{c as l,r as p,w as f,j as e,x as j}from"./index-C5v9BWKZ.js";import{G as u}from"./GlassCard-SvYC04d1.js";import{A as N}from"./alert-circle-Cf08dXlU.js";import{A as g}from"./alert-triangle-seh5H_N3.js";import{C as k}from"./check-circle-2-kvhFEHb7.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=l("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=l("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=l("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=l("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]),i={whatsapp:{icon:w,color:"text-emerald-500",label:"WhatsApp"},sms:{icon:v,color:"text-blue-500",label:"SMS"},"in-app":{icon:j,color:"text-slate-400",label:"In-App"}};function R(){const[n,c]=p.useState(f),x=()=>{c(t=>t.map(a=>({...a,read:!0})))},o=t=>{c(a=>a.map(s=>s.id===t?{...s,read:!0}:s))},d=["Today","Yesterday","Older"],m=t=>{switch(t){case"success":return e.jsx(k,{className:"w-5 h-5 text-emerald-500"});case"warning":return e.jsx(g,{className:"w-5 h-5 text-amber-500"});case"error":return e.jsx(N,{className:"w-5 h-5 text-red-500"});default:return e.jsx(b,{className:"w-5 h-5 text-blue-500"})}};return e.jsxs("div",{className:"space-y-6 max-w-4xl",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",children:"Notification Center"}),e.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400 mt-1",children:"System alerts, job status changes, and team updates"})]}),e.jsxs("button",{onClick:x,className:"btn-secondary text-xs",children:[e.jsx(y,{className:"w-4 h-4"}),e.jsx("span",{children:"Mark All as Read"})]})]}),e.jsx("div",{className:"space-y-6",children:d.map(t=>{const a=n.filter(s=>s.group===t);return a.length===0?null:e.jsxs("div",{className:"space-y-3",children:[e.jsx("h2",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider pl-1",children:t}),e.jsx("div",{className:"space-y-2.5",children:a.map(s=>{const r=i[s.channel]||i["in-app"],h=r.icon;return e.jsx(u,{onClick:()=>o(s.id),className:`p-4 cursor-pointer transition-all ${s.read?"opacity-80":"border-l-4 border-l-orange-500 bg-orange-50/20 dark:bg-orange-950/10"}`,children:e.jsxs("div",{className:"flex items-start gap-3.5",children:[e.jsx("div",{className:"mt-0.5 flex-shrink-0",children:m(s.type)}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:`text-sm font-bold ${s.read?"text-slate-700 dark:text-slate-300":"text-slate-900 dark:text-white"}`,children:s.title}),e.jsxs("span",{className:`inline-flex items-center gap-1 text-[10px] font-semibold ${r.color}`,children:[e.jsx(h,{className:"w-3 h-3"}),r.label]})]}),e.jsx("span",{className:"text-[11px] text-slate-400 flex-shrink-0",children:s.time})]}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-400 mt-1",children:s.message})]})]})},s.id)})})]},t)})})]})}export{R as default};
