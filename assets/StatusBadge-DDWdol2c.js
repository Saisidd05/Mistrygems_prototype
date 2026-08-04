import{c as o,j as e,P as n,p as r,F as t}from"./index-CtHcTWDG.js";import{C as i}from"./check-circle-2-BqZ3-s44.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=o("CircleDot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=o("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=o("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=o("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=o("Truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);function k({status:c,className:l}){const a={New:{label:"New",badgeClass:"badge-new",icon:g},Quoted:{label:"Quoted",badgeClass:"badge-quoted",icon:t},Approved:{label:"Approved",badgeClass:"badge-approved",icon:i},Procuring:{label:"Procuring",badgeClass:"badge-procuring",icon:n},"In Progress":{label:"In Progress",badgeClass:"badge-inprogress",icon:p},"Quality Check":{label:"Quality Check",badgeClass:"badge-quality",icon:h},Completed:{label:"Completed",badgeClass:"badge-completed",icon:i},Invoiced:{label:"Invoiced",badgeClass:"badge-invoiced",icon:b}},s=a[c]||a.New,d=s.icon;return e.jsxs("span",{className:r(s.badgeClass,l),children:[e.jsx(d,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:s.label})]})}function C({priority:c,className:l}){const a={High:{label:"High",class:"priority-high"},Medium:{label:"Medium",class:"priority-medium"},Low:{label:"Low",class:"priority-low"}},s=a[c]||a.Medium;return e.jsx("span",{className:r(s.class,l),children:s.label})}function x({mode:c,className:l}){const a=c==="Workshop Procures";return e.jsx("span",{className:r(a?"badge-mode-workshop":"badge-mode-client",l),children:a?e.jsxs(e.Fragment,{children:[e.jsx(n,{className:"w-3 h-3"}),e.jsx("span",{children:"Workshop Procures"})]}):e.jsxs(e.Fragment,{children:[e.jsx(u,{className:"w-3 h-3"}),e.jsx("span",{children:"Client Supplies"})]})})}export{x as M,C as P,k as S};
