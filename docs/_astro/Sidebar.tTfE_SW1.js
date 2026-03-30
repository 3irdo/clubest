import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as l}from"./index.Cd_vQiNd.js";import{w as t}from"./withBase.DtQdP_C2.js";import{c as r}from"./createLucideIcon.kUSAKZz8.js";import{C as d}from"./calendar.BQ_66oL_.js";import{C as p}from"./credit-card.BheoGqld.js";import{F as m}from"./file-text.Dt3KK4Xl.js";import{U as x}from"./user.BZsfV-r1.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],y=r("chevron-left",g);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],f=r("chevron-right",b);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],w=r("layout-dashboard",u);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],k=r("settings",v);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}],["path",{d:"M3.103 6.034h17.794",key:"awc11p"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",key:"o988cm"}]],C=r("shopping-bag",j),D=({currentPath:s=t("dashboard")})=>{const[o,i]=l.useState(!1),n=[{icon:w,label:"Dashboard",path:t("/dashboard")},{icon:d,label:"Entrenamientos",path:t("training")},{icon:p,label:"Pagos",path:t("payments")},{icon:m,label:"Documentos",path:t("documents")},{icon:C,label:"Tienda",path:t("store")},{icon:x,label:"Perfil",path:t("profile")},{icon:k,label:"Administración",path:t("admin")}];return e.jsxs("aside",{className:`bg-primary-dark text-white transition-all duration-300 ${o?"w-20":"w-64"} min-h-screen relative`,children:[e.jsx("button",{onClick:()=>i(!o),className:"absolute -right-3 top-6 bg-primary text-white p-1 rounded-full shadow-lg hover:bg-primary-light transition-colors",children:o?e.jsx(f,{size:16}):e.jsx(y,{size:16})}),e.jsx("div",{className:"p-6",children:e.jsx("div",{className:"flex flex-col space-y-2 mt-8",children:n.map(a=>{const c=a.icon,h=s===a.path;return e.jsxs("a",{href:a.path,className:`flex items-center space-x-3 p-3 rounded-lg transition-colors ${h?"bg-primary text-accent-green":"hover:bg-primary hover:text-accent-green"}`,title:o?a.label:"",children:[e.jsx(c,{size:20}),!o&&e.jsx("span",{children:a.label})]},a.path)})})})]})};export{D as Sidebar};
