(function(){
"use strict";

/* ===== Firebase ===== */
var firebaseConfig={apiKey:"AIzaSyAhTuTzf9axFCAAEVnKK_jlvQ9ipP8puZg",authDomain:"anime-chat-app-66dbe.firebaseapp.com",projectId:"anime-chat-app-66dbe",storageBucket:"anime-chat-app-66dbe.firebasestorage.app",messagingSenderId:"945550755759",appId:"1:945550755759:web:98de13682bad4415e5d15a",measurementId:"G-SP50V3K8FR"};
var db=null;
try{firebase.initializeApp(firebaseConfig);db=firebase.firestore()}catch(e){console.error(e)}

/* ===== القسم الحالي ===== */
var SECTION=window.SECTION||"all";
var BASE=window.BASE||"./";

/* ===== أقسام الموقع ===== */
var SECTIONS={
    netflix:{name:"Netflix",icon:"fa-tv",color:"#e50914",services:["netflix"],desc:"حسابات Netflix بريميوم"},
    spotify:{name:"Spotify",icon:"fa-headphones",color:"#1db954",services:["spotify"],desc:"حسابات Spotify بريميوم"},
    disney:{name:"Disney+",icon:"fa-wand-magic-sparkles",color:"#113ccf",services:["disney"],desc:"حسابات Disney+ بريميوم"},
    hbo:{name:"HBO Max",icon:"fa-film",color:"#b08beb",services:["hbo"],desc:"حسابات HBO Max بريميوم"},
    instagram:{name:"Instagram",icon:"fa-camera",color:"#e1306c",services:["instagram"],desc:"حسابات Instagram"},
    gaming:{name:"ألعاب",icon:"fa-gamepad",color:"#00d4ff",services:["steam","fortnite","minecraft"],desc:"حسابات Steam, Fortnite, Minecraft"},
    other:{name:"أخرى",icon:"fa-ellipsis",color:"#888",services:["canva","chatgpt","crunchyroll","discord","tiktok","twitter","other"],desc:"Canva, ChatGPT, وأكثر"}
};

/* ===== بيانات الخدمات ===== */
var SVC={
    netflix:{n:"Netflix",i:"N",c:"#e50914",bg:"rgba(229,9,20,.15)",cat:"streaming"},
    spotify:{n:"Spotify",i:"S",c:"#1db954",bg:"rgba(29,185,84,.15)",cat:"streaming"},
    disney:{n:"Disney+",i:"D",c:"#113ccf",bg:"rgba(17,60,207,.15)",cat:"streaming"},
    hbo:{n:"HBO Max",i:"H",c:"#b08beb",bg:"rgba(176,139,235,.15)",cat:"streaming"},
    crunchyroll:{n:"Crunchyroll",i:"C",c:"#f47521",bg:"rgba(244,117,33,.15)",cat:"streaming"},
    instagram:{n:"Instagram",i:"I",c:"#e1306c",bg:"rgba(225,48,108,.15)",cat:"social"},
    twitter:{n:"Twitter / X",i:"X",c:"#ccc",bg:"rgba(200,200,200,.08)",cat:"social"},
    tiktok:{n:"TikTok",i:"T",c:"#ff0050",bg:"rgba(255,0,80,.15)",cat:"social"},
    discord:{n:"Discord",i:"D",c:"#5865f2",bg:"rgba(88,101,242,.15)",cat:"social"},
    steam:{n:"Steam",i:"S",c:"#66c0f4",bg:"rgba(102,192,244,.1)",cat:"gaming"},
    fortnite:{n:"Fortnite",i:"F",c:"#00d4ff",bg:"rgba(0,212,255,.1)",cat:"gaming"},
    minecraft:{n:"Minecraft",i:"M",c:"#62b546",bg:"rgba(98,181,70,.15)",cat:"gaming"},
    canva:{n:"Canva",i:"C",c:"#00c4cc",bg:"rgba(0,196,204,.15)",cat:"other"},
    chatgpt:{n:"ChatGPT",i:"G",c:"#10a37f",bg:"rgba(16,163,127,.15)",cat:"other"},
    other:{n:"أخرى",i:"?",c:"#888",bg:"rgba(136,136,136,.1)",cat:"other"}
};

/* ===== حالة ===== */
var leaks=[],curFilter="all",cpaTarget=null,cpaDone=0,cpaLink="",cpaNeeded=1,adminPass="admin123";

/* ===== مساعدات ===== */
function $(s){return document.querySelector(s)}
function $$(s){return document.querySelectorAll(s)}
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function toast(m,ok){var d=document.createElement("div");d.className="toast "+(ok?"g":"r");d.innerHTML='<i class="fas fa-'+(ok?"check-circle":"exclamation-circle")+'"></i> '+m;$("#toasts").appendChild(d);setTimeout(function(){d.remove()},3000)}
function ago(ts){var d=Date.now()-ts,m=Math.floor(d/60000),h=Math.floor(d/3600000),dy=Math.floor(d/86400000);if(m<1)return"الآن";if(m<60)return"منذ "+m+" د";if(h<24)return"منذ "+h+" س";return"منذ "+dy+" ي"}

/* ===== بارتاكل ===== */
(function(){var c=document.getElementById("dots");if(!c)return;for(var i=0;i<20;i++){var d=document.createElement("div");d.className="dot";d.style.left=Math.random()*100+"%";d.style.animationDuration=(10+Math.random()*14)+"s";d.style.animationDelay=Math.random()*12+"s";var sz=(1+Math.random()*2)+"px";d.style.width=sz;d.style.height=sz;c.appendChild(d)}})();

/* ===== بناء الصفحة ===== */
function buildPage(){
    var app=document.getElementById("app");
    var h="";
    h+=buildHeader();
    h+=buildNav();
    if(SECTION==="all") h+=buildMainHero();
    else h+=buildSectionHero();
    if(SECTION==="all") h+=buildToolbar();
    else h+=buildSecSearch();
    h+='<div class="grid" id="grid"><div class="loading"><i class="fas fa-spinner"></i><p>جاري التحميل...</p></div></div>';
    h+='<footer>LEAK ZONE &copy; 2025</footer>';
    h+=buildModals();
    app.innerHTML=h;
    bindEvents();
}

/* === هيدر === */
function buildHeader(){
    var h='<header><div class="hdr">';
    h+='<a class="logo" href="'+BASE+'"><div class="logo-b"><i class="fas fa-skull-crossbones"></i></div><span class="logo-t">LEAK ZONE</span></a>';
    h+='<div style="display:flex;gap:8px;align-items:center">';
    if(SECTION!=="all") h+='<a href="'+BASE+'" class="btn btn-g"><i class="fas fa-home"></i></a>';
    h+='<button class="btn btn-g" id="menuBtn"><i class="fas fa-bars"></i></button>';
    h+='<button class="btn btn-g" id="refBtn" title="تحديث"><i class="fas fa-rotate"></i></button>';
    h+='<button class="btn btn-g" id="admBtn"><i class="fas fa-shield-halved"></i></button>';
    h+='</div></div></header>';
    return h;
}

/* === Navigation === */
function buildNav(){
    var h='<div class="nav-wrap" id="navWrap"><div class="nav-inner"><ul class="nav-list">';
    h+='<li><a href="'+BASE+'"'+(SECTION==="all"?' class="active"':'')+'><div class="ni" style="background:var(--adim);color:var(--acc)"><i class="fas fa-house"></i></div>الرئيسية</a></li>';
    var keys=Object.keys(SECTIONS);
    for(var i=0;i<keys.length;i++){
        var k=keys[i],s=SECTIONS[k];
        h+='<li><a href="'+BASE+k+'/"'+(SECTION===k?' class="active"':'')+'><div class="ni" style="background:'+s.color+'22;color:'+s.color+'"><i class="fas '+s.icon+'"></i></div>'+s.name+'</a></li>';
    }
    h+='</ul><button class="nav-close" id="navClose"><i class="fas fa-times"></i> إغلاق</button></div></div>';
    return h;
}

/* === Hero رئيسي === */
function buildMainHero(){
    return '<section class="hero"><div class="hero-tag"><span class="bk"></span> يتم التحديث بشكل مستمر</div><h1>تسريبات <em>حصرية</em> ومجانية</h1><p>حسابات بريميوم — كلمات المرور مشفّرة، كمّل العروض باش تفكّها</p><div class="stats"><div><div class="st-n" id="sT">0</div><div class="st-l">تسريبة متاحة</div></div><div><div class="st-n" id="sD">0</div><div class="st-l">أضيفت اليوم</div></div><div><div class="st-n" id="sS">0</div><div class="st-l">منصة مختلفة</div></div></div></section>';
}

/* === Hero قسم === */
function buildSectionHero(){
    var s=SECTIONS[SECTION];if(!s)return"";
    return '<section class="hero"><a href="'+BASE+'" class="hero-back"><i class="fas fa-arrow-right"></i> العودة للرئيسية</a><div class="hero-section-icon" style="background:'+s.color+'22;color:'+s.color+'"><i class="fas '+s.icon+'"></i></div><h1><em>'+s.name+'</em></h1><p>'+s.desc+'</p><div class="stats"><div><div class="st-n" id="sT">0</div><div class="st-l">تسريبة في هذا القسم</div></div></div></section>';
}

/* === Toolbar رئيسي === */
function buildToolbar(){
    return '<div class="toolbar"><div class="sw"><i class="fas fa-search"></i><input type="text" id="srch" placeholder="ابحث عن بريد أو منصة..."></div><button class="fb on" data-f="all">الكل</button><button class="fb" data-f="streaming">ستريمنغ</button><button class="fb" data-f="social">سوشيال</button><button class="fb" data-f="gaming">ألعاب</button><button class="fb" data-f="other">أخرى</button></div>';
}

/* === بحث قسم === */
function buildSecSearch(){
    return '<div class="sec-search"><div class="sw"><i class="fas fa-search"></i><input type="text" id="srch" placeholder="ابحث في هذا القسم..."></div></div>';
}

/* === المودالات === */
function buildModals(){
    var h='';
    /* CPA */
    h+='<div class="ov" id="ovCpa"><div class="mdl md"><div class="mh"><div class="mi"><i class="fas fa-lock"></i></div><h3>فك تشفير كلمة المرور</h3><p>كمّل واحد من العروض باش تفكّ التشفير</p></div><div class="mb">';
    h+='<div class="ofr" data-o="1"><div class="ofr-i"><i class="fas fa-mobile-screen"></i></div><div class="ofr-t"><strong>نزّل تطبيق مجاني</strong><span>نزّل وافتحه لمرة واحدة</span></div><i class="fas fa-chevron-left" style="color:var(--mut);font-size:12px"></i></div>';
    h+='<div class="ofr" data-o="2"><div class="ofr-i"><i class="fas fa-envelope"></i></div><div class="ofr-t"><strong>سجّل بالإيميل</strong><span>اعمل حساب جديد</span></div><i class="fas fa-chevron-left" style="color:var(--mut);font-size:12px"></i></div>';
    h+='<div class="ofr" data-o="3"><div class="ofr-i"><i class="fas fa-clipboard-check"></i></div><div class="ofr-t"><strong>أكمل استبيان</strong><span>أجب على 3 أسئلة</span></div><i class="fas fa-chevron-left" style="color:var(--mut);font-size:12px"></i></div>';
    h+='</div><div class="mf"><div class="pw2"><div class="pw2-f" id="pBar"></div></div><div class="pw2-t" id="pTxt">0 / 1 عروض</div><button class="mc" id="cpaX">إغلاق</button></div></div></div>';
    /* Login */
    h+='<div class="ov" id="ovLog"><div class="mdl sm"><div class="mh"><div class="mi"><i class="fas fa-user-shield"></i></div><h3>دخول لوحة التحكم</h3><p>كلمة المرور الافتراضية: admin123</p></div><div class="mb"><div class="fg"><label>كلمة المرور</label><input type="password" id="pIn" placeholder="admin123"></div><button class="btn btn-a" style="width:100%" id="logGo"><i class="fas fa-arrow-right-to-bracket"></i> دخول</button><div class="lerr" id="logE">كلمة المرور غالطة!</div></div><div class="mf"><button class="mc" id="logX">إلغاء</button></div></div></div>';
    /* Admin */
    h+='<div class="ov" id="ovAdm"><div class="mdl lg"><div class="atabs"><button class="at on" data-t="add"><i class="fas fa-plus"></i> إضافة</button><button class="at" data-t="man"><i class="fas fa-list"></i> إدارة</button><button class="at" data-t="set"><i class="fas fa-gear"></i> إعدادات</button></div>';
    h+='<div class="ap on" id="pAdd">';
    h+='<div class="fg"><label>المنصة</label><select id="aSvc"><option value="netflix">Netflix</option><option value="spotify">Spotify</option><option value="disney">Disney+</option><option value="hbo">HBO Max</option><option value="crunchyroll">Crunchyroll</option><option value="instagram">Instagram</option><option value="twitter">Twitter / X</option><option value="tiktok">TikTok</option><option value="discord">Discord</option><option value="steam">Steam</option><option value="fortnite">Fortnite</option><option value="minecraft">Minecraft</option><option value="canva">Canva</option><option value="chatgpt">ChatGPT</option><option value="other">أخرى</option></select></div>';
    h+='<div class="fg"><label>البريد الإلكتروني</label><input type="text" id="aEm" placeholder="example@mail.com"></div>';
    h+='<div class="fg"><label>كلمة المرور</label><input type="text" id="aPw" placeholder="password123"></div>';
    h+='<div class="frow"><div class="fg"><label>البلد</label><input type="text" id="aCo" placeholder="US"></div><div class="fg"><label>النوع</label><select id="aTy"><option value="premium">بريميوم</option><option value="free">مجاني</option><option value="cracked">كراك</option></select></div></div>';
    h+='<div class="fg"><label>ملاحظات</label><textarea id="aNo" placeholder="اختياري..."></textarea></div>';
    h+='<button class="btn btn-a" style="width:100%" id="addGo"><i class="fas fa-paper-plane"></i> نشر</button></div>';
    h+='<div class="ap" id="pMan"><div id="aList"></div></div>';
    h+='<div class="ap" id="pSet">';
    h+='<div class="fg"><label>تغيير كلمة مرور الأدمن</label><input type="password" id="nPw" placeholder="الجديدة"></div>';
    h+='<button class="btn btn-a" style="width:100%;margin-bottom:14px" id="chPw"><i class="fas fa-key"></i> تحديث</button>';
    h+='<div class="fg"><label>رابط CPA</label><input type="text" id="cpaIn" placeholder="https://..."></div>';
    h+='<button class="btn btn-a" style="width:100%;margin-bottom:14px" id="svCpa"><i class="fas fa-link"></i> حفظ</button>';
    h+='<div class="fg"><label>عدد العروض المطلوبة</label><select id="cpaCnt"><option value="1">عرض واحد</option><option value="2">عرضين</option><option value="3">3 عروض</option></select></div>';
    h+='<button class="btn btn-r" style="width:100%;margin-top:14px" id="clrAll"><i class="fas fa-trash"></i> حذف الكل</button></div>';
    h+='<div style="padding:0 20px 16px;text-align:center"><button class="mc" id="admX">إغلاق</button></div></div></div>';
    return h;
}

/* ===== ربط الأحداث ===== */
function bindEvents(){
    var mb=$("#menuBtn");if(mb)mb.addEventListener("click",function(){document.body.classList.add("nav-open")});
    var nc=$("#navClose");if(nc)nc.addEventListener("click",function(){document.body.classList.remove("nav-open")});
    var nw=$("#navWrap");if(nw)nw.addEventListener("click",function(e){if(e.target===nw)document.body.classList.remove("nav-open")});
    var rb=$("#refBtn");if(rb)rb.addEventListener("click",loadLeaks);
    var ab=$("#admBtn");if(ab)ab.addEventListener("click",function(){$("#pIn").value="";$("#logE").style.display="none";$("#ovLog").classList.add("open");setTimeout(function(){$("#pIn").focus()},100)});
    var lx=$("#logX");if(lx)lx.addEventListener("click",function(){$("#ovLog").classList.remove("open")});
    var lg=$("#logGo");if(lg)lg.addEventListener("click",doLogin);
    var pi=$("#pIn");if(pi)pi.addEventListener("keydown",function(e){if(e.key==="Enter")doLogin()});
    var cx=$("#cpaX");if(cx)cx.addEventListener("click",closeCpa);
    var ax=$("#admX");if(ax)ax.addEventListener("click",function(){$("#ovAdm").classList.remove("open")});
    var ag=$("#addGo");if(ag)ag.addEventListener("click",addLeak);
    var cp=$("#chPw");if(cp)cp.addEventListener("click",changePass);
    var sc=$("#svCpa");if(sc)sc.addEventListener("click",saveCpa);
    var ca=$("#clrAll");if(ca)ca.addEventListener("click",clearAll);
    var sr=$("#srch");if(sr)sr.addEventListener("input",render);
    $$(".fb").forEach(function(b){b.addEventListener("click",function(){$$(".fb").forEach(function(x){x.classList.remove("on")});b.classList.add("on");curFilter=b.getAttribute("data-f");render()})});
    $$(".at").forEach(function(t){t.addEventListener("click",function(){$$(".at").forEach(function(x){x.classList.remove("on")});t.classList.add("on");var id=t.getAttribute("data-t");$$(".ap").forEach(function(p){p.classList.remove("on")});if(id==="add")$("#pAdd").classList.add("on");if(id==="man"){$("#pMan").classList.add("on");renderAdminList()}if(id==="set"){$("#pSet").classList.add("on");$("#cpaIn").value=cpaLink;$("#cpaCnt").value=String(cpaNeeded)}})});
    $$("#ovCpa .ofr").forEach(function(o){o.addEventListener("click",function(){if(o.classList.contains("used"))return;if(cpaLink)window.open(cpaLink,"_blank");cpaDone++;o.classList.add("used");var ico=o.querySelector("i:last-child");if(ico){ico.className="fas fa-check";ico.style.color="var(--acc)";ico.style.fontSize=""}updProg();if(cpaDone>=cpaNeeded){setTimeout(function(){db.collection("lz_leaks").doc(cpaTarget).update({unlocked:true}).then(function(){for(var i=0;i<leaks.length;i++){if(leaks[i].id===cpaTarget){leaks[i].unlocked=true;break}}render();closeCpa();toast("تم فك التشفير!",true)}).catch(function(){toast("خطأ!",false)})},1200)}})});
    $$(".ov").forEach(function(ov){ov.addEventListener("click",function(e){if(e.target===ov)ov.classList.remove("open")})});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){$$(".ov.open").forEach(function(o){o.classList.remove("open")});document.body.classList.remove("nav-open")}});
    document.addEventListener("click",function(e){
        var cb=e.target.closest("[data-ul]");if(cb)openCpa(cb.getAttribute("data-ul"));
        var dl=e.target.closest("[data-del]");if(dl)deleteLeak(dl.getAttribute("data-del"));
        if(e.target.classList.contains("cp-i")){var pw=e.target.getAttribute("data-cp");if(navigator.clipboard){navigator.clipboard.writeText(pw).then(function(){toast("تم النسخ!",true)})}else{var ta=document.createElement("textarea");ta.value=pw;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);toast("تم النسخ!",true)}}
    });
}

/* ===== Firebase — تحميل ===== */
function loadSettings(){
    if(!db)return;
    db.collection("lz_settings").doc("admin").get().then(function(doc){
        if(doc.exists){var d=doc.data();if(d.password)adminPass=d.password;if(d.cpaLink)cpaLink=d.cpaLink;if(d.cpaCount)cpaNeeded=parseInt(d.cpaCount)||1}
        else{db.collection("lz_settings").doc("admin").set({password:adminPass,cpaLink:"",cpaCount:1})}
    }).catch(function(){})
}

function loadLeaks(){
    if(!db){$("#grid").innerHTML='<div class="empty"><i class="fas fa-exclamation-triangle"></i><h3>خطأ</h3><p>تعذر الاتصال بقاعدة البيانات</p></div>';return}
    $("#grid").innerHTML='<div class="loading"><i class="fas fa-spinner"></i><p>جاري التحميل...</p></div>';
    db.collection("lz_leaks").orderBy("t","desc").get().then(function(snap){
        leaks=[];snap.forEach(function(doc){var d=doc.data();leaks.push({id:doc.id,svc:d.svc||"other",email:d.email||"",pw:d.pw||"",country:d.country||"",type:d.type||"premium",notes:d.notes||"",t:d.t||Date.now(),unlocked:!!d.unlocked})});
        render();stats();
    }).catch(function(e){console.error(e);$("#grid").innerHTML='<div class="empty"><i class="fas fa-exclamation-triangle"></i><h3>خطأ في التحميل</h3><p>تأكد من فعّال Firestore وأن القواعد مفتوحة</p></div>'})
}

/* ===== إحصائيات ===== */
function stats(){
    var filtered=getSectionLeaks();
    $("#sT").textContent=filtered.length;
    if(SECTION==="all"){
        var today=new Date();today.setHours(0,0,0,0);var ct=0,sv={};
        for(var i=0;i<leaks.length;i++){if(leaks[i].t>=today.getTime())ct++;sv[leaks[i].svc]=1}
        $("#sD").textContent=ct;$("#sS").textContent=Object.keys(sv).length;
    }
}

/* ===== فلتر القسم ===== */
function getSectionLeaks(){
    if(SECTION==="all")return leaks;
    var sec=SECTIONS[SECTION];if(!sec)return[];
    return leaks.filter(function(l){return sec.services.indexOf(l.svc)!==-1});
}

/* ===== عرض ===== */
function render(){
    var q=$("#srch").value.toLowerCase().trim();
    var arr=getSectionLeaks();
    /* فلتر التصنيف (الرئيسية فقط) */
    if(SECTION==="all"&&curFilter!=="all"){arr=arr.filter(function(l){var sv=SVC[l.svc]||SVC.other;return sv.cat===curFilter})}
    /* فلتر البحث */
    if(q){arr=arr.filter(function(l){var sv=SVC[l.svc]||SVC.other;var ok=false;if(l.email.toLowerCase().indexOf(q)!==-1)ok=true;if(sv.n.toLowerCase().indexOf(q)!==-1)ok=true;if(l.country&&l.country.toLowerCase().indexOf(q)!==-1)ok=true;return ok})}
    if(!arr.length){$("#grid").innerHTML='<div class="empty"><i class="fas fa-ghost"></i><h3>ما لقينا شي</h3><p>جرّب بحث أو فلتر آخر</p></div>';return}
    var h="";
    for(var i=0;i<arr.length;i++){
        var L=arr[i],sv=SVC[L.svc]||SVC.other,ul=!!L.unlocked,mask="••••••••••••";
        var tl=L.type==="premium"?"بريميوم":L.type==="cracked"?"كراك":"مجاني";
        h+='<div class="card" style="animation-delay:'+i*0.05+'s"><div class="ct"><div class="sb"><div class="si" style="background:'+sv.bg+';color:'+sv.c+'">'+sv.i+'</div><span class="sn">'+sv.n+'</span></div><span class="ct-time">'+ago(L.t)+'</span></div><div class="cm">';
        h+='<div class="fl"><div class="fl-l"><i class="fas fa-envelope"></i> البريد</div><div class="fl-v" style="direction:ltr;text-align:right">'+esc(L.email)+'</div></div>';
        h+='<div class="fl"><div class="fl-l"><i class="fas fa-key"></i> كلمة المرور</div><div class="fl-v"><span class="'+(ul?'pw-s':'pw-h')+'">'+(ul?esc(L.pw):mask)+'</span>';
        if(ul)h+='<i class="fas fa-copy cp-i" data-cp="'+esc(L.pw)+'"></i>';
        h+='</div></div>';
        if(L.notes)h+='<div class="fl"><div class="fl-l"><i class="fas fa-info-circle"></i> ملاحظات</div><div class="fl-v" style="font-family:Tajawal;font-size:.8rem">'+esc(L.notes)+'</div></div>';
        h+='</div><div class="cb">';
        if(ul)h+='<button class="ub ok"><i class="fas fa-check-circle"></i> تم فك التشفير</button>';
        else h+='<button class="ub" data-ul="'+L.id+'"><i class="fas fa-lock-open"></i> فك التشفير</button>';
        h+='<div class="tags"><span class="tag">'+tl+'</span>';if(L.country)h+='<span class="tag"><i class="fas fa-globe" style="margin-left:3px"></i>'+esc(L.country)+'</span>';h+='<span class="tag g"><i class="fas fa-check" style="margin-left:3px"></i>متحقق</span></div></div></div>';
    }
    $("#grid").innerHTML=h;
}

/* ===== CPA ===== */
function openCpa(id){cpaTarget=id;cpaDone=0;updProg();$$("#ovCpa .ofr").forEach(function(o){o.classList.remove("used");var ico=o.querySelector("i:last-child");if(ico){ico.className="fas fa-chevron-left";ico.style.color="var(--mut)";ico.style.fontSize="12px"}});$("#ovCpa").classList.add("open");if(cpaLink)setTimeout(function(){window.open(cpaLink,"_blank")},400)}
function closeCpa(){$("#ovCpa").classList.remove("open");cpaTarget=null;cpaDone=0}
function updProg(){var p=Math.min(cpaDone,cpaNeeded)/cpaNeeded*100;$("#pBar").style.width=p+"%";$("#pTxt").textContent=cpaDone+" / "+cpaNeeded+" عروض"}

/* ===== أدمن ===== */
function doLogin(){var p=$("#pIn").value;if(p===adminPass){$("#ovLog").classList.remove("open");$("#ovAdm").classList.add("open");renderAdminList();$("#cpaIn").value=cpaLink;$("#cpaCnt").value=String(cpaNeeded)}else{$("#logE").style.display="block";$("#pIn").value="";$("#pIn").focus()}}
function addLeak(){
    if(!db)return;var svc=$("#aSvc").value,em=$("#aEm").value.trim(),pw=$("#aPw").value.trim(),co=$("#aCo").value.trim(),ty=$("#aTy").value,no=$("#aNo").value.trim();
    if(!em){toast("أدخل البريد!",false);return}if(em.indexOf("@")===-1){toast("بريد غير صالح!",false);return}if(!pw){toast("أدخل كلمة المرور!",false);return}
    db.collection("lz_leaks").add({svc:svc,email:em,pw:pw,country:co||"N/A",type:ty,notes:no,t:Date.now(),unlocked:false}).then(function(ref){
        leaks.unshift({id:ref.id,svc:svc,email:em,pw:pw,country:co||"N/A",type:ty,notes:no,t:Date.now(),unlocked:false});render();stats();$("#aEm").value="";$("#aPw").value="";$("#aCo").value="";$("#aNo").value="";toast("تم النشر!",true);
    }).catch(function(){toast("خطأ!",false)})
}
function renderAdminList(){
    var el=$("#aList");if(!el)return;if(!leaks.length){el.innerHTML='<p style="color:var(--mut);text-align:center;padding:1.5rem">ما في شي</p>';return}
    var h="";for(var i=0;i<leaks.length;i++){var L=leaks[i],sv=SVC[L.svc]||SVC.other;h+='<div class="ali"><div class="si" style="background:'+sv.bg+';color:'+sv.c+'">'+sv.i+'</div><div class="ali-i"><div class="em">'+esc(L.email)+'</div><div class="sl">'+sv.n+'</div></div><button class="btn btn-r btn-s" data-del="'+L.id+'"><i class="fas fa-trash"></i></button></div>'}
    el.innerHTML=h;
}
function deleteLeak(id){if(!db)return;db.collection("lz_leaks").doc(id).delete().then(function(){leaks=leaks.filter(function(l){return l.id!==id});render();renderAdminList();stats();toast("تم الحذف!",true)}).catch(function(){toast("خطأ!",false)})}
function changePass(){var p=$("#nPw").value.trim();if(p.length<4){toast("4 حروف على الأقل!",false);return}adminPass=p;$("#nPw").value="";saveSettings();toast("تم التحديث!",true)}
function saveCpa(){cpaLink=$("#cpaIn").value.trim();cpaNeeded=parseInt($("#cpaCnt").value)||1;saveSettings();toast("تم الحفظ!",true)}
function saveSettings(){if(!db)return;db.collection("lz_settings").doc("admin").set({password:adminPass,cpaLink:cpaLink,cpaCount:cpaNeeded},{merge:true}).catch(function(){})}
function clearAll(){if(!db||!leaks.length){toast("ما في شي!",false);return}var batch=db.batch();for(var i=0;i<leaks.length;i++){batch.delete(db.collection("lz_leaks").doc(leaks[i].id))}batch.commit().then(function(){leaks=[];render();renderAdminList();stats();toast("تم حذف الكل!",true)}).catch(function(){toast("خطأ!",false)})}

/* ===== بدء ===== */
buildPage();
if(db){loadSettings();loadLeaks()}
})();
