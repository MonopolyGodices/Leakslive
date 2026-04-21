(function(){
"use strict";
try{firebase.initializeApp(FB_CONFIG)}catch(e){console.error(e)}
var db=null;try{db=firebase.firestore()}catch(e){}

var SECTION=window.SECTION||"all";
var BASE=window.BASE||"./";

var SECTIONS={
    vcc:{name:"VCC Gen",icon:"fa-credit-card",color:"#ffd700",services:[],desc:"Generate virtual test cards"},
    netflix:{name:"Netflix",icon:"fa-tv",color:"#e50914",services:["netflix"],desc:"Premium Netflix accounts"},
    spotify:{name:"Spotify",icon:"fa-headphones",color:"#1db954",services:["spotify"],desc:"Premium Spotify accounts"},
    disney:{name:"Disney+",icon:"fa-wand-magic-sparkles",color:"#113ccf",services:["disney"],desc:"Premium Disney+ accounts"},
    hbo:{name:"HBO Max",icon:"fa-film",color:"#b08beb",services:["hbo"],desc:"Premium HBO Max accounts"},
    instagram:{name:"Instagram",icon:"fa-camera",color:"#e1306c",services:["instagram"],desc:"Instagram accounts"},
    gaming:{name:"Gaming",icon:"fa-gamepad",color:"#00d4ff",services:["steam","fortnite","minecraft"],desc:"Steam, Fortnite, Minecraft"},
    other:{name:"Other",icon:"fa-ellipsis",color:"#888",services:["canva","chatgpt","crunchyroll","discord","tiktok","twitter","other"],desc:"Canva, ChatGPT & more"}
};

var SVC={netflix:{n:"Netflix",i:"N",c:"#e50914",bg:"rgba(229,9,20,.15)",cat:"streaming"},spotify:{n:"Spotify",i:"S",c:"#1db954",bg:"rgba(29,185,84,.15)",cat:"streaming"},disney:{n:"Disney+",i:"D",c:"#113ccf",bg:"rgba(17,60,207,.15)",cat:"streaming"},hbo:{n:"HBO Max",i:"H",c:"#b08beb",bg:"rgba(176,139,235,.15)",cat:"streaming"},crunchyroll:{n:"Crunchyroll",i:"C",c:"#f47521",bg:"rgba(244,117,33,.15)",cat:"streaming"},instagram:{n:"Instagram",i:"I",c:"#e1306c",bg:"rgba(225,48,108,.15)",cat:"social"},twitter:{n:"Twitter / X",i:"X",c:"#ccc",bg:"rgba(200,200,200,.08)",cat:"social"},tiktok:{n:"TikTok",i:"T",c:"#ff0050",bg:"rgba(255,0,80,.15)",cat:"social"},discord:{n:"Discord",i:"D",c:"#5865f2",bg:"rgba(88,101,242,.15)",cat:"social"},steam:{n:"Steam",i:"S",c:"#66c0f4",bg:"rgba(102,192,244,.1)",cat:"gaming"},fortnite:{n:"Fortnite",i:"F",c:"#00d4ff",bg:"rgba(0,212,255,.1)",cat:"gaming"},minecraft:{n:"Minecraft",i:"M",c:"#62b546",bg:"rgba(98,181,70,.15)",cat:"gaming"},canva:{n:"Canva",i:"C",c:"#00c4cc",bg:"rgba(0,196,204,.15)",cat:"other"},chatgpt:{n:"ChatGPT",i:"G",c:"#10a37f",bg:"rgba(16,163,127,.15)",cat:"other"},other:{n:"Other",i:"?",c:"#888",bg:"rgba(136,136,136,.1)",cat:"other"}};

var leaks=[],curFilter="all",cpaTarget=null,cpaDone=0,cpaLink="",cpaNeeded=1;

/* ===== Security: Base64 ===== */
function encPw(p){try{return btoa(unescape(encodeURIComponent(p)))}catch(e){return p}}
function decPw(p){try{return decodeURIComponent(escape(atob(p)))}catch(e){return p}}

/* ===== Security: Session Unlock ===== */
function getUnlocked(){var u=sessionStorage.getItem("lz_u");return u?u.split(","):[]}
function isUnlocked(id){return getUnlocked().indexOf(id)!==-1}
function unlockLeak(id){var arr=getUnlocked();if(arr.indexOf(id)===-1){arr.push(id);sessionStorage.setItem("lz_u",arr.join(","))}}

function $(s){return document.querySelector(s)}
function $$(s){return document.querySelectorAll(s)}
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function toast(m,ok){var d=document.createElement("div");d.className="toast "+(ok?"g":"r");d.innerHTML='<i class="fas fa-'+(ok?"check-circle":"exclamation-circle")+'"></i> '+m;$("#toasts").appendChild(d);setTimeout(function(){d.remove()},3000)}
function ago(ts){var d=Date.now()-ts,m=Math.floor(d/60000),h=Math.floor(d/3600000),dy=Math.floor(d/86400000);if(m<1)return"Just now";if(m<60)return m+"m ago";if(h<24)return h+"h ago";return dy+"d ago"}
function copyText(v){if(navigator.clipboard){navigator.clipboard.writeText(v).then(function(){toast("Copied!",true)})}else{var ta=document.createElement("textarea");ta.value=v;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);toast("Copied!",true)}}

(function(){var c=document.getElementById("dots");if(!c)return;for(var i=0;i<20;i++){var d=document.createElement("div");d.className="dot";d.style.left=Math.random()*100+"%";d.style.animationDuration=(10+Math.random()*14)+"s";d.style.animationDelay=Math.random()*12+"s";var sz=(1+Math.random()*2)+"px";d.style.width=sz;d.style.height=sz;c.appendChild(d)}})();

function buildPage(){
    var app=document.getElementById("app");var h="";
    if(SECTION==="vcc"){buildVccPage();return}
    h+=buildHeader();h+=buildNav();
    if(SECTION==="all")h+=buildMainHero();else h+=buildSectionHero();
    if(SECTION==="all")h+=buildToolbar();else h+=buildSecSearch();
    h+='<div class="grid" id="grid"><div class="loading"><i class="fas fa-spinner"></i><p>Loading...</p></div></div>';
    h+='<footer>LEAK ZONE &copy; 2025</footer>';
    h+=buildModals();app.innerHTML=h;bindEvents();
}

function buildHeader(){
    var h='<header><div class="hdr">';
    h+='<a class="logo" href="'+BASE+'"><div class="logo-b"><i class="fas fa-skull-crossbones"></i></div><span class="logo-t">LEAK ZONE</span></a>';
    h+='<div style="display:flex;gap:8px;align-items:center">';
    if(SECTION!=="all")h+='<a href="'+BASE+'" class="btn btn-g"><i class="fas fa-home"></i></a>';
    h+='<button class="btn btn-g" id="menuBtn"><i class="fas fa-bars"></i></button>';
    h+='<button class="btn btn-g" id="refBtn" title="Refresh"><i class="fas fa-rotate"></i></button>';
    h+='</div></div></header>';return h;
}

function buildNav(){
    var h='<div class="nav-wrap" id="navWrap"><div class="nav-inner"><ul class="nav-list">';
    h+='<li><a href="'+BASE+'"'+(SECTION==="all"?' class="active"':'')+'><div class="ni" style="background:var(--adim);color:var(--acc)"><i class="fas fa-house"></i></div>Home</a></li>';
    var keys=Object.keys(SECTIONS);
    for(var i=0;i<keys.length;i++){var k=keys[i],s=SECTIONS[k];h+='<li><a href="'+BASE+k+'/"'+(SECTION===k?' class="active"':'')+'><div class="ni" style="background:'+s.color+'22;color:'+s.color+'"><i class="fas '+s.icon+'"></i></div>'+s.name+'</a></li>'}
    h+='</ul><button class="nav-close" id="navClose"><i class="fas fa-times"></i> Close</button></div></div>';return h;
}

function buildMainHero(){
    return '<section class="hero"><div class="hero-tag"><span class="bk"></span> Continuously updated</div><h1>Exclusive <em>Free Leaks</em></h1><p>Premium accounts — Passwords are encrypted, complete offers to unlock them</p><div class="stats"><div><div class="st-n" id="sT">0</div><div class="st-l">Leaks available</div></div><div><div class="st-n" id="sD">0</div><div class="st-l">Added today</div></div><div><div class="st-n" id="sS">0</div><div class="st-l">Platforms</div></div></div></section>';
}
function buildSectionHero(){var s=SECTIONS[SECTION];if(!s)return"";return '<section class="hero"><a href="'+BASE+'" class="hero-back"><i class="fas fa-arrow-left"></i> Back to Home</a><div class="hero-section-icon" style="background:'+s.color+'22;color:'+s.color+'"><i class="fas '+s.icon+'"></i></div><h1><em>'+s.name+'</em></h1><p>'+s.desc+'</p><div class="stats"><div><div class="st-n" id="sT">0</div><div class="st-l">Leaks in this section</div></div></div></section>'}
function buildToolbar(){return '<div class="toolbar"><div class="sw"><i class="fas fa-search"></i><input type="text" id="srch" placeholder="Search by email or platform..."></div><button class="fb on" data-f="all">All</button><button class="fb" data-f="streaming">Streaming</button><button class="fb" data-f="social">Social</button><button class="fb" data-f="gaming">Gaming</button><button class="fb" data-f="other">Other</button></div>'}
function buildSecSearch(){return '<div class="sec-search"><div class="sw"><i class="fas fa-search"></i><input type="text" id="srch" placeholder="Search in this section..."></div></div>'}

function buildModals(){
    var h='';
    h+='<div class="ov" id="ovCpa"><div class="mdl md"><div class="mh"><div class="mi"><i class="fas fa-lock"></i></div><h3>Unlock Password</h3><p>Complete the verification to unlock</p></div><div class="mb">';
    h+='<div data-captcha-enable="true"></div>';
    h+='<div class="ofr" data-o="1"><div class="ofr-i"><i class="fas fa-mobile-screen"></i></div><div class="ofr-t"><strong>Download a free app</strong><span>Download and open it once</span></div><i class="fas fa-chevron-right" style="color:var(--mut);font-size:12px"></i></div>';
    h+='<div class="ofr" data-o="2"><div class="ofr-i"><i class="fas fa-envelope"></i></div><div class="ofr-t"><strong>Sign up with email</strong><span>Create a new account</span></div><i class="fas fa-chevron-right" style="color:var(--mut);font-size:12px"></i></div>';
    h+='<div class="ofr" data-o="3"><div class="ofr-i"><i class="fas fa-clipboard-check"></i></div><div class="ofr-t"><strong>Complete a survey</strong><span>Answer 3 questions</span></div><i class="fas fa-chevron-right" style="color:var(--mut);font-size:12px"></i></div>';
    h+='</div><div class="mf"><div class="pw2"><div class="pw2-f" id="pBar"></div></div><div class="pw2-t" id="pTxt">0 / 1 offers completed</div><button class="mc" id="cpaX">Close</button></div></div></div>';
    return h;
}

function bindEvents(){
    var mb=$("#menuBtn");if(mb)mb.addEventListener("click",function(){document.body.classList.add("nav-open")});
    var nc=$("#navClose");if(nc)nc.addEventListener("click",function(){document.body.classList.remove("nav-open")});
    var nw=$("#navWrap");if(nw)nw.addEventListener("click",function(e){if(e.target===nw)document.body.classList.remove("nav-open")});
    var rb=$("#refBtn");if(rb)rb.addEventListener("click",loadLeaks);
    var cx=$("#cpaX");if(cx)cx.addEventListener("click",closeCpa);
    var sr=$("#srch");if(sr)sr.addEventListener("input",render);
    $$(".fb").forEach(function(b){b.addEventListener("click",function(){$$(".fb").forEach(function(x){x.classList.remove("on")});b.classList.add("on");curFilter=b.getAttribute("data-f");render()})});
    $$("#ovCpa .ofr").forEach(function(o){o.addEventListener("click",function(){if(o.classList.contains("used"))return;if(cpaLink)window.open(cpaLink,"_blank");cpaDone++;o.classList.add("used");var ico=o.querySelector("i:last-child");if(ico){ico.className="fas fa-check";ico.style.color="var(--acc)";ico.style.fontSize=""}updProg();if(cpaDone>=cpaNeeded){setTimeout(function(){unlockLeak(cpaTarget);render();closeCpa();toast("Password unlocked!",true)},1200)}})});
    $$(".ov").forEach(function(ov){ov.addEventListener("click",function(e){if(e.target===ov)ov.classList.remove("open")})});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){$$(".ov.open").forEach(function(o){o.classList.remove("open")});document.body.classList.remove("nav-open")}});
    document.addEventListener("click",function(e){var cb=e.target.closest("[data-ul]");if(cb)openCpa(cb.getAttribute("data-ul"));if(e.target.classList.contains("cp-i"))copyText(e.target.getAttribute("data-cp"));var vi=e.target.closest("[data-vc]");if(vi)copyText(vi.getAttribute("data-vc"))});
}

function loadLeaks(){
    if(!db){$("#grid").innerHTML='<div class="empty"><i class="fas fa-exclamation-triangle"></i><h3>Error</h3><p>Could not connect</p></div>';return}
    $("#grid").innerHTML='<div class="loading"><i class="fas fa-spinner"></i><p>Loading...</p></div>';
    db.collection("lz_settings").doc("admin").get().then(function(doc){
        if(doc.exists){var d=doc.data();if(d.cpaLink)cpaLink=d.cpaLink;if(d.cpaCount)cpaNeeded=parseInt(d.cpaCount)||1}
    }).catch(function(){});
    db.collection("lz_leaks").orderBy("t","desc").get().then(function(snap){
        leaks=[];snap.forEach(function(doc){var d=doc.data();leaks.push({id:doc.id,svc:d.svc||"other",email:d.email||"",pw:d.pw||"",country:d.country||"",type:d.type||"premium",notes:d.notes||"",t:d.t||Date.now()})});
        render();stats();
    }).catch(function(e){console.error(e);$("#grid").innerHTML='<div class="empty"><i class="fas fa-exclamation-triangle"></i><h3>Error</h3><p>Firestore not enabled or rules are closed</p></div>'})
}

function stats(){var filtered=getSectionLeaks();$("#sT").textContent=filtered.length;if(SECTION==="all"){var today=new Date();today.setHours(0,0,0,0);var ct=0,sv={};for(var i=0;i<leaks.length;i++){if(leaks[i].t>=today.getTime())ct++;sv[leaks[i].svc]=1}$("#sD").textContent=ct;$("#sS").textContent=Object.keys(sv).length}}
function getSectionLeaks(){if(SECTION==="all")return leaks;var sec=SECTIONS[SECTION];if(!sec)return[];return leaks.filter(function(l){return sec.services.indexOf(l.svc)!==-1})}

function render(){
    var q=$("#srch").value.toLowerCase().trim();var arr=getSectionLeaks();
    if(SECTION==="all"&&curFilter!=="all"){arr=arr.filter(function(l){var sv=SVC[l.svc]||SVC.other;return sv.cat===curFilter})}
    if(q){arr=arr.filter(function(l){var sv=SVC[l.svc]||SVC.other;var ok=false;if(l.email.toLowerCase().indexOf(q)!==-1)ok=true;if(sv.n.toLowerCase().indexOf(q)!==-1)ok=true;if(l.country&&l.country.toLowerCase().indexOf(q)!==-1)ok=true;return ok})}
    if(!arr.length){$("#grid").innerHTML='<div class="empty"><i class="fas fa-ghost"></i><h3>Nothing found</h3><p>Try a different search or filter</p></div>';return}
    var h="";
    for(var i=0;i<arr.length;i++){
        var L=arr[i],sv=SVC[L.svc]||SVC.other,ul=isUnlocked(L.id),mask="••••••••••••";
        var realPw=decPw(L.pw),displayPw=ul?realPw:mask;
        var tl=L.type==="premium"?"Premium":L.type==="cracked"?"Cracked":"Free";
        h+='<div class="card" style="animation-delay:'+i*0.05+'s"><div class="ct"><div class="sb"><div class="si" style="background:'+sv.bg+';color:'+sv.c+'">'+sv.i+'</div><span class="sn">'+sv.n+'</span></div><span class="ct-time">'+ago(L.t)+'</span></div><div class="cm">';
        h+='<div class="fl"><div class="fl-l"><i class="fas fa-envelope"></i> Email</div><div class="fl-v">'+esc(L.email)+'</div></div>';
        h+='<div class="fl"><div class="fl-l"><i class="fas fa-key"></i> Password</div><div class="fl-v"><span class="'+(ul?'pw-s':'pw-h')+'">'+esc(displayPw)+'</span>';
        if(ul)h+='<i class="fas fa-copy cp-i" data-cp="'+esc(realPw)+'"></i>';
        h+='</div></div>';
        if(L.notes)h+='<div class="fl"><div class="fl-l"><i class="fas fa-info-circle"></i> Notes</div><div class="fl-v" style="font-family:Tajawal;font-size:.8rem">'+esc(L.notes)+'</div></div>';
        h+='</div><div class="cb">';
        if(ul)h+='<button class="ub ok"><i class="fas fa-check-circle"></i> Unlocked</button>';
        else h+='<button class="ub" data-ul="'+L.id+'"><i class="fas fa-lock-open"></i> Unlock — Complete offer</button>';
        h+='<div class="tags"><span class="tag">'+tl+'</span>';if(L.country)h+='<span class="tag"><i class="fas fa-globe" style="margin-right:3px"></i>'+esc(L.country)+'</span>';h+='<span class="tag g"><i class="fas fa-check" style="margin-right:3px"></i>Verified</span></div></div></div>';
    }
    $("#grid").innerHTML=h;
}

function openCpa(id){cpaTarget=id;cpaDone=0;updProg();$$("#ovCpa .ofr").forEach(function(o){o.classList.remove("used");var ico=o.querySelector("i:last-child");if(ico){ico.className="fas fa-chevron-right";ico.style.color="var(--mut)";ico.style.fontSize="12px"}});$("#ovCpa").classList.add("open");if(cpaLink)setTimeout(function(){window.open(cpaLink,"_blank")},400)}
function closeCpa(){$("#ovCpa").classList.remove("open");cpaTarget=null;cpaDone=0}
function updProg(){var p=Math.min(cpaDone,cpaNeeded)/cpaNeeded*100;$("#pBar").style.width=p+"%";$("#pTxt").textContent=cpaDone+" / "+cpaNeeded+" offers completed"}

/* ===== VCC ===== */
var VCC_NAMES=["John Smith","Jane Johnson","Michael Williams","Sarah Brown","David Jones","Emily Garcia","Robert Miller","Lisa Davis","James Rodriguez","Maria Martinez","William Hernandez","Jennifer Lopez","Richard Gonzalez","Patricia Wilson","Thomas Anderson","Linda Taylor","Charles Moore","Barbara Jackson","Christopher Martin","Elizabeth Lee"];
function vccDetectType(bin){if(!bin||!bin.length)return"visa";var f=bin.charAt(0);if(f==="4")return"visa";if(f==="5")return"mastercard";if(f==="3")return"amex";return"visa"}
function vccGenNum(bin){var type=vccDetectType(bin),len=type==="amex"?15:16,num=bin||"";if(!num){var pfxes={visa:["4"],mastercard:["51","52","53","54","55"],amex:["34","37"]};num=pfxes[type][Math.floor(Math.random()*pfxes[type].length)]}while(num.length<len-1)num+=Math.floor(Math.random()*10);var s=0,al=true;for(var i=num.length-1;i>=0;i--){var n=parseInt(num[i],10);if(al){n*=2;if(n>9)n-=9}s+=n;al=!al}return num+((10-(s%10))%10)}
function vccFmt(n){var r="";for(var i=0;i<n.length;i++){if(i>0&&i%4===0)r+=" ";r+=n[i]}return r}
function vccExp(){var m=String(Math.floor(Math.random()*12)+1);if(m.length<2)m="0"+m;var y=String(new Date().getFullYear()+1+Math.floor(Math.random()*5));return m+"/"+y.slice(2)}
function vccCvv(type){var l=type==="amex"?4:3,v="";for(var i=0;i<l;i++)v+=Math.floor(Math.random()*10);return v}
function vccCard(bin){var type=vccDetectType(bin),n=vccGenNum(bin);return{num:n,fmt:vccFmt(n),exp:vccExp(),cvv:vccCvv(type),name:VCC_NAMES[Math.floor(Math.random()*VCC_NAMES.length)],type:type,brand:{visa:"VISA",mastercard:"MASTERCARD",amex:"AMEX"}[type]||"CARD",css:type}}

function buildVccPage(){
    var app=document.getElementById("app");var h="";
    h+=buildHeader();h+=buildNav();
    h+='<section class="hero"><a href="'+BASE+'" class="hero-back"><i class="fas fa-arrow-left"></i> Back to Home</a><div class="hero-section-icon" style="background:rgba(255,215,0,.12);color:#ffd700"><i class="fas fa-credit-card"></i></div><h1><em>VCC Generator</em></h1><p>Generate virtual test cards for payment gateway testing</p></section>';
    h+='<div class="vcc-page">';
    h+='<div class="vcc-controls" style="margin-bottom:12px"><input type="text" id="vccBin" placeholder="6-digit BIN (e.g. 453201)" maxlength="6" style="flex:1;min-width:180px;padding:10px 14px;border-radius:8px;border:1px solid var(--bdr);background:var(--card);color:var(--txt);font-family:Fira Code,monospace;font-size:.95rem;letter-spacing:3px;outline:0" oninput="this.value=this.value.replace(/[^0-9]/g,\'\')"></div>';
    h+='<div class="vcc-controls"><select id="vccT"><option value="">Auto-detect</option><option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="amex">Amex</option></select><button class="vcc-gen" id="vccGen"><i class="fas fa-rotate"></i> Generate</button></div>';
    h+='<div class="vcc-output" id="vccOut"></div>';
    h+='<div class="vcc-sep">or generate in bulk</div>';
    h+='<div class="vcc-bulk"><div class="vcc-bulk-ctrl"><input type="text" id="vccBBin" placeholder="BIN" maxlength="6" style="width:110px;padding:10px;border-radius:8px;border:1px solid var(--bdr);background:var(--card);color:var(--txt);font-family:Fira Code,monospace;font-size:.85rem;outline:0" oninput="this.value=this.value.replace(/[^0-9]/g,\'\')"><select id="vccBC" style="flex:0 0 auto;min-width:80px"><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select><button class="vcc-gen" id="vccBG"><i class="fas fa-layer-group"></i> Bulk</button></div><div class="vcc-bulk-out" id="vccBulk"></div></div>';
    h+='<div class="vcc-disc"><i class="fas fa-exclamation-triangle"></i> For testing only. Pass Luhn but cannot process transactions.</div></div><footer>LEAK ZONE &copy; 2025</footer>';
    h+=buildModals();app.innerHTML=h;bindEvents();
    document.getElementById("vccGen").addEventListener("click",vccSingle);
    document.getElementById("vccBG").addEventListener("click",vccBulk);
    vccSingle();
}

function vccSingle(){var bin=document.getElementById("vccBin").value.trim(),ts=document.getElementById("vccT").value,c=vccCard(bin);if(ts)c=vccCard(bin);var h='<div class="vcc-card '+c.css+'" style="animation:cu .4s ease both"><div class="vcc-top"><span class="vcc-brand">'+c.brand+'</span><div class="vcc-chip"></div></div><div class="vcc-num">'+c.fmt+'</div><div class="vcc-bot"><div><div class="vcc-holder-label">Card Holder</div><div class="vcc-holder">'+c.name+'</div></div><div class="vcc-info"><div class="vcc-info-row"><span class="vcc-info-label">Expires</span><div class="vcc-info-val">'+c.exp+'</div></div><div class="vcc-info-row"><span class="vcc-info-label">CVV</span><div class="vcc-info-val">'+c.cvv+'</div></div></div></div></div>';
    h+='<div class="vcc-acts"><button class="vcc-ab" data-vc="'+esc(c.num+"|"+c.exp+"|"+c.cvv+"|"+c.name)+'"><i class="fas fa-copy"></i> Copy All</button><button class="vcc-ab" data-vc="'+esc(c.num)+'"><i class="fas fa-hashtag"></i> Number</button><button class="vcc-ab" data-vc="'+esc(c.cvv)+'"><i class="fas fa-lock"></i> CVV</button><button class="vcc-ab" data-vc="'+esc(c.exp)+'"><i class="fas fa-calendar"></i> Expiry</button></div>';
    document.getElementById("vccOut").innerHTML=h;
}

function vccBulk(){var bin=document.getElementById("vccBBin").value.trim(),n=parseInt(document.getElementById("vccBC").value)||10,lines=[];lines.push("Number                | Expiry  | CVV  | Name");lines.push("".padEnd(72,"-"));for(var i=0;i<n;i++){var c=vccCard(bin);lines.push(c.fmt.padEnd(24)+"| "+c.exp+"    | "+c.cvv+"   | "+c.name)}var el=document.getElementById("vccBulk");el.textContent=lines.join("\n");el.classList.add("show");toast(n+" cards generated!",true)}

buildPage();
if(db)loadLeaks();
})();
