(function(){
  "use strict";

  const PROFILE_URL = "https://kourant.digiylyfe.com/";
  const CARD_URL = "https://kourant.digiylyfe.com/carte-visite.png?v=20260714";
  const PHONE = "221772084781";
  const PHONE_TEL = "+221772084781";
  const NAME_FR = "Kourant Électricien";
  const NAME_EN = "Kourant Electrician";

  function currentLang(){
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function labels(){
    if(currentLang() === "en"){
      return {
        name: NAME_EN,
        title: "Kourant Electrician — Official DIGIY BUILD profile",
        text: "Electrical installation, renovation and troubleshooting · Saly · direct contact · 0% commission",
        wa: "Hello Kourant, I am coming from your official DIGIY BUILD profile for an electrical service.",
        hint: "Click the card to open Kourant's official profile."
      };
    }
    return {
      name: NAME_FR,
      title: "Kourant Électricien — Fiche officielle DIGIY BUILD",
      text: "Installation, rénovation et dépannage électrique · Saly · contact direct · 0% commission",
      wa: "Bonjour Kourant, je viens de votre fiche officielle DIGIY BUILD pour un besoin en électricité.",
      hint: "Cliquez sur la carte pour ouvrir la fiche officielle de Kourant Électricien."
    };
  }

  function replaceText(root){
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      if(!node.nodeValue) return;
      node.nodeValue = node.nodeValue
        .replace(/Zal\s*&\s*Kourant/g, currentLang() === "en" ? NAME_EN : NAME_FR)
        .replace(/Zal et Kourant/g, NAME_FR)
        .replace(/Électriciens/g, "Électricien")
        .replace(/Electricians/g, "Electrician");
    });
  }

  function updateMeta(){
    const lang = currentLang();
    const pack = labels();
    document.title = lang === "en"
      ? "Kourant Electrician — Electrical services | DIGIYLYFE.COM"
      : "Kourant Électricien — Installation et dépannage | DIGIYLYFE.COM";

    const desc = document.querySelector('meta[name="description"]');
    if(desc) desc.content = lang === "en"
      ? "Kourant Electrician in Saly and Petite Côte. New installation, renovation and troubleshooting. Direct contact via DIGIYLYFE.COM."
      : "Kourant Électricien à Saly et sur la Petite Côte. Installation neuve, rénovation et dépannage. Contact direct via DIGIYLYFE.COM.";

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if(ogTitle) ogTitle.content = pack.title;
    if(ogDesc) ogDesc.content = pack.text;
    if(ogImage) ogImage.content = CARD_URL;
  }

  function installCard(){
    const poster = document.querySelector(".poster");
    if(!poster) return;

    let link = document.getElementById("kourantBusinessCardLink");
    if(!link){
      poster.innerHTML = "";
      link = document.createElement("a");
      link.id = "kourantBusinessCardLink";
      link.href = PROFILE_URL;
      link.target = "_blank";
      link.rel = "noopener";
      link.style.cssText = "display:block;width:100%;cursor:pointer;border-radius:20px;outline:none";

      const img = document.createElement("img");
      img.id = "kourantBusinessCardImage";
      img.src = CARD_URL;
      img.alt = "Carte de visite officielle de Kourant Électricien";
      img.loading = "eager";
      img.style.cssText = "width:100%;max-height:760px;object-fit:contain;display:block;padding:10px";
      link.appendChild(img);
      poster.appendChild(link);
    }

    const pack = labels();
    link.href = PROFILE_URL;
    link.title = pack.hint;
    link.setAttribute("aria-label", pack.hint);

    let hint = document.getElementById("kourantBusinessCardHint");
    if(!hint){
      hint = document.createElement("div");
      hint.id = "kourantBusinessCardHint";
      hint.style.cssText = "padding:0 18px 16px;color:#fff3b2;font-size:14px;line-height:1.45;font-weight:950;text-align:center";
      poster.insertAdjacentElement("afterend", hint);
    }
    hint.textContent = pack.hint;
  }

  function updateLinks(){
    const pack = labels();
    const wa = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(pack.wa);

    ["waBtn", "bottomWa"].forEach(function(id){
      const el = document.getElementById(id);
      if(el) el.href = wa;
    });

    const call = document.getElementById("callBtn");
    if(call) call.href = "tel:" + PHONE_TEL;

    const request = document.getElementById("requestBtn") || document.querySelector('a[href*="request.html"]');
    if(request){
      const u = new URL("https://build.digiylyfe.com/request.html");
      u.searchParams.set("slug", "partenaires-kourant");
      u.searchParams.set("nom", currentLang() === "en" ? NAME_EN : NAME_FR);
      u.searchParams.set("metier", currentLang() === "en" ? "Electrical work" : "Électricien");
      u.searchParams.set("ville", "Saly");
      u.searchParams.set("lang", currentLang());
      request.href = u.toString();
    }
  }

  async function shareProfile(event){
    if(event){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    const pack = labels();
    try{
      if(navigator.share){
        await navigator.share({title:pack.title, text:pack.text, url:PROFILE_URL});
        return;
      }
    }catch(_){ }

    try{
      await navigator.clipboard.writeText(pack.title + "\n" + pack.text + "\n" + PROFILE_URL);
      const btn = event && event.currentTarget;
      if(btn){
        const old = btn.textContent;
        btn.textContent = currentLang() === "en" ? "✅ Link copied" : "✅ Lien copié";
        setTimeout(function(){ btn.textContent = old; }, 1800);
      }
    }catch(_){
      window.open("https://wa.me/?text=" + encodeURIComponent(pack.title + "\n" + pack.text + "\n" + PROFILE_URL), "_blank", "noopener");
    }
  }

  function bindActions(){
    ["shareBtn", "bottomShare"].forEach(function(id){
      const el = document.getElementById(id);
      if(!el || el.dataset.kourantShareBound === "1") return;
      el.dataset.kourantShareBound = "1";
      el.addEventListener("click", shareProfile, true);
    });

    const copy = document.getElementById("copyBtn");
    if(copy && copy.dataset.kourantCopyBound !== "1"){
      copy.dataset.kourantCopyBound = "1";
      copy.addEventListener("click", function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        navigator.clipboard.writeText(PROFILE_URL).catch(function(){ window.prompt("Copie le lien :", PROFILE_URL); });
      }, true);
    }
  }

  function updateSchema(){
    const node = document.querySelector('script[type="application/ld+json"]');
    if(!node) return;
    try{
      const data = JSON.parse(node.textContent || "{}");
      data.name = currentLang() === "en" ? NAME_EN : NAME_FR;
      data.description = currentLang() === "en"
        ? "Kourant Electrician in Saly and Petite Côte. Installation, renovation and electrical troubleshooting."
        : "Kourant Électricien à Saly et sur la Petite Côte. Installation, rénovation et dépannage électrique.";
      data.image = CARD_URL;
      data.url = PROFILE_URL;
      data.telephone = PHONE_TEL;
      node.textContent = JSON.stringify(data, null, 2);
    }catch(_){ }
  }

  function apply(){
    replaceText(document.body);
    updateMeta();
    installCard();
    updateLinks();
    bindActions();
    updateSchema();
  }

  function scheduleApply(){
    setTimeout(apply, 0);
    setTimeout(apply, 120);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", apply, {once:true});
  }else{
    apply();
  }

  ["lang-fr", "lang-en"].forEach(function(id){
    const btn = document.getElementById(id);
    if(btn) btn.addEventListener("click", scheduleApply);
  });
})();
