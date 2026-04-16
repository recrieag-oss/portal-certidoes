"use strict";(()=>{var e={};e.id=319,e.ids=[319],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},53620:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>f,routeModule:()=>x,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g});var o={};r.r(o),r.d(o,{PATCH:()=>u});var a=r(49303),i=r(88716),n=r(60670),s=r(87070),d=r(71615),p=r(90455),l=r(72331),c=r(76876);async function u(e,{params:t}){let r=d.cookies().get("admin-session-id")?.value,o=r?await (0,p.Gg)(r):null;if(!o||"admin"!==o.role)return s.NextResponse.json({error:"N\xe3o autorizado"},{status:401});let a=await l._.order.findUnique({where:{id:t.id},include:{user:!0}});if(!a)return s.NextResponse.json({error:"Pedido n\xe3o encontrado"},{status:404});let{status:i,note:n,notifyEmail:u,notifyWhatsApp:x}=await e.json(),f=[...a.statusHistory??[],{status:i,date:new Date().toISOString(),note:n}],g=await l._.order.update({where:{id:t.id},data:{status:i,statusHistory:f}}),m=a.user;if(m){let e={id:a.id,tipo:a.tipo,status:i,statusHistory:f,createdAt:a.createdAt.toISOString(),updatedAt:g.updatedAt.toISOString(),formData:a.formData,pedidoResumo:a.pedidoResumo,userId:a.userId},t={id:m.id,email:m.email,passwordHash:m.passwordHash,nome:m.nome,cpf:m.cpf,whatsapp:m.whatsapp,createdAt:m.createdAt.toISOString(),orderIds:[]},r=[];!1!==u&&r.push((0,c.q)(e,t,i,n)),!1!==x&&m.whatsapp&&r.push((0,c.U)(m.whatsapp,e,i,n)),Promise.allSettled(r).then(e=>{e.forEach((e,t)=>{"rejected"===e.status&&console.error(`[notify] notification[${t}] failed:`,e.reason)})})}return s.NextResponse.json({...g,_notified:!!m})}let x=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/orders/[id]/route",pathname:"/api/admin/orders/[id]",filename:"route",bundlePath:"app/api/admin/orders/[id]/route"},resolvedPagePath:"D:\\SITE DE DOCS\\app\\api\\admin\\orders\\[id]\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:f,staticGenerationAsyncStorage:g,serverHooks:m}=x,h="/api/admin/orders/[id]/route";function y(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}},90455:(e,t,r)=>{r.d(t,{Gg:()=>l,Gv:()=>s,SO:()=>c,c_:()=>n,ed:()=>p});var o=r(84770),a=r(72331);let i=process.env.SESSION_SECRET??"portal-certidoes-session-secret-change-in-prod";function n(e){let t=(0,o.randomBytes)(16).toString("hex"),r=(0,o.scryptSync)(e,t,64).toString("hex");return`${t}:${r}`}function s(e,t){try{let[r,a]=t.split(":"),i=(0,o.scryptSync)(e,r,64);return(0,o.timingSafeEqual)(Buffer.from(a,"hex"),i)}catch{return!1}}function d(e){let t=e.lastIndexOf(":");if(-1===t)return null;let r=e.slice(0,t),a=e.slice(t+1);return r&&a&&a===(0,o.createHmac)("sha256",i).update(r).digest("hex")?r:null}async function p(e,t){let r=(0,o.randomBytes)(32).toString("hex");return await a._.session.create({data:{id:r,userId:e,role:t,expiresAt:new Date(Date.now()+6048e5)}}),function(e){let t=(0,o.createHmac)("sha256",i).update(e).digest("hex");return`${e}:${t}`}(r)}async function l(e){let t=d(e);if(!t)return null;let r=await a._.session.findUnique({where:{id:t}});return r?r.expiresAt<new Date?(await a._.session.delete({where:{id:t}}),null):{id:r.id,userId:r.userId,role:r.role}:null}async function c(e){let t=d(e);t&&await a._.session.deleteMany({where:{id:t}})}},76876:(e,t,r)=>{r.d(t,{U:()=>s,q:()=>n});var o=r(55245),a=r(95621);let i={recebido:"#6B7280",em_analise:"#3B82F6",aguardando_cartorio:"#F59E0B",em_tramitacao:"#8B5CF6",pronto:"#10B981",finalizado:"#002776"};async function n(e,t,r,n,s){if(!process.env.SMTP_USER||!process.env.SMTP_PASS)return console.warn("[notifications] SMTP not configured – skipping email"),{ok:!1,error:"SMTP n\xe3o configurado"};let d=a.c[r],p=i[r],l=process.env.NEXT_PUBLIC_URL||"http://localhost:3000",c=`${l}/portal/pedido/${e.id}`,u="finalizado"===r,x=`
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#002776;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:.5px;">PORTAL CERTID\xd5ES</p>
            <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">${u?"Seu documento est\xe1 pronto! \uD83C\uDF89":"Atualiza\xe7\xe3o do seu pedido"}</p>
          </td>
        </tr>
        <!-- Status badge -->
        <tr>
          <td style="padding:36px 40px 0;text-align:center;">
            <span style="display:inline-block;background:${p};color:#fff;border-radius:999px;padding:8px 22px;font-size:14px;font-weight:600;">${d}</span>
            <h2 style="margin:20px 0 8px;font-size:22px;color:#0f172a;">Ol\xe1, ${t.nome}!</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
              ${u?`Sua certid\xe3o referente ao pedido <strong style="color:#002776;">${e.id}</strong> est\xe1 pronta e dispon\xedvel para download.`:`O status do seu pedido <strong style="color:#002776;">${e.id}</strong> foi atualizado.`}
            </p>
          </td>
        </tr>
        <!-- Details -->
        <tr>
          <td style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Pedido</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#0f172a;">${e.id}</p>
                </td>
                <td style="padding:18px 24px;border-bottom:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Tipo</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#0f172a;text-transform:capitalize;">${e.tipo}</p>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:18px 24px;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Status</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:${p};">${d}</p>
                  ${n?`<p style="margin:8px 0 0;font-size:14px;color:#475569;">${n}</p>`:""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:0 40px ${u?"20px":"36px"};text-align:center;">
            <a href="${c}" style="display:inline-block;background:#002776;color:#fff;text-decoration:none;border-radius:999px;padding:14px 36px;font-size:15px;font-weight:600;">
              ${u?"Acessar meu pedido →":"Acompanhar meu pedido →"}
            </a>
          </td>
        </tr>
        ${u&&s?`
        <!-- PDF download callout -->
        <tr>
          <td style="padding:0 40px 36px;text-align:center;">
            <div style="border:2px dashed #10B981;border-radius:16px;padding:20px 24px;background:#f0fdf4;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#065f46;">📎 Certid\xe3o em anexo</p>
              <p style="margin:0;font-size:13px;color:#047857;">O arquivo PDF da sua certid\xe3o est\xe1 anexado a este e-mail.</p>
            </div>
          </td>
        </tr>`:""}
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Portal Certid\xf5es \xb7 D\xfavidas? Fale com nossa equipe de suporte.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;try{let r=o.createTransport({host:process.env.SMTP_HOST||"smtp.gmail.com",port:Number(process.env.SMTP_PORT)||587,secure:!1,auth:{user:process.env.SMTP_USER||"",pass:process.env.SMTP_PASS||""}});return await r.sendMail({from:`"Portal Certid\xf5es" <${process.env.SMTP_USER}>`,to:t.email,subject:u?`✅ Sua certid\xe3o est\xe1 pronta — Pedido ${e.id}`:`Pedido ${e.id} \xb7 ${d}`,html:x,...s?{attachments:[{filename:`certidao-${e.id}.pdf`,content:s,contentType:"application/pdf"}]}:{}}),{ok:!0}}catch(e){return console.error("[notifications] Email error:",e.message),{ok:!1,error:e.message}}}async function s(e,t,r,o){let i=process.env.WHATSAPP_API_URL,n=process.env.WHATSAPP_API_TOKEN,s=process.env.WHATSAPP_API_TYPE||"evolution";if(!i||!n)return console.warn("[notifications] WhatsApp API not configured – skipping"),{ok:!1,error:"WhatsApp API n\xe3o configurada"};let d=a.c[r],p=process.env.NEXT_PUBLIC_URL||"http://localhost:3000",l=e.replace(/\D/g,""),c=`${p}/portal/pedido/${t.id}`,u="finalizado"===r?`✅ *Portal Certid\xf5es*

Ol\xe1! Sua certid\xe3o est\xe1 *pronta para download*! 🎉

📋 *Pedido:* ${t.id}
📄 *Tipo:* ${t.tipo}
`+(o?`📝 *Observa\xe7\xe3o:* ${o}

`:"\n")+`👇 *Acesse agora para baixar seu documento:*
`+`${c}

`+`_Fa\xe7a login com seu e-mail e senha cadastrados._`:`✅ *Portal Certid\xf5es*

Ol\xe1! Seu pedido *${t.id}* foi atualizado.

📋 *Status:* ${d}
`+(o?`📝 *Observa\xe7\xe3o:* ${o}

`:"\n")+`Acompanhe em: ${c}`;try{let e;let t={"Content-Type":"application/json"};if("evolution"===s)e={number:`55${l}`,text:u},t.apikey=n;else if("zapi"===s)e={phone:`55${l}`,message:u},t["Client-Token"]=n;else if("twilio"===s){let e=new URLSearchParams({To:`whatsapp:+55${l}`,From:`whatsapp:${process.env.TWILIO_WHATSAPP_FROM||""}`,Body:u});return{ok:(await fetch(i,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:`Basic ${Buffer.from(n).toString("base64")}`},body:e.toString()})).ok}}else e={phone:l,message:u},t.Authorization=`Bearer ${n}`;let r=await fetch(i,{method:"POST",headers:t,body:JSON.stringify(e)});if(!r.ok){let e=await r.text();throw Error(`HTTP ${r.status}: ${e}`)}return{ok:!0}}catch(e){return console.error("[notifications] WhatsApp error:",e.message),{ok:!1,error:e.message}}}},72331:(e,t,r)=>{r.d(t,{_:()=>a});var o=r(53524);let a=globalThis.prisma??new o.PrismaClient({log:["error"]})},95621:(e,t,r)=>{r.d(t,{c:()=>o});let o={recebido:"Recebido",em_analise:"Em an\xe1lise",aguardando_cartorio:"Aguardando cart\xf3rio",em_tramitacao:"Em tramita\xe7\xe3o",pronto:"Pronto para entrega",finalizado:"Finalizado"}}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[8948,1615,5972,5245],()=>r(53620));module.exports=o})();