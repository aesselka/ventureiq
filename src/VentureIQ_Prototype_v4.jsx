import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = "/api/chat";
const SC = { HOME:'home', FORM:'form' };

const ICheck  = ({sz=14,col="#16a34a"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IXc     = ({sz=14,col="#dc2626"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const ISend   = ({sz=16,col="#fff"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IArrow  = ({sz=14,col="#1d4ed8"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IUpload = ({sz=22,col="#9ca3af"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>;
const IUser   = ({sz=16,col="#6b7280"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IChat   = ({sz=20,col="#fff"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IX      = ({sz=14,col="#9ca3af"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IGlobe  = ({sz=13,col="#9ca3af"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const IPlus   = ({sz=13,col="#1d4ed8"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IZap    = ({sz=16,col="#fff"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const ISave   = ({sz=13,col="#16a34a"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IVideo  = ({sz=14,col="#7c3aed"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const IShield = ({sz=14,col="#059669"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IKey    = ({sz=14,col="#d97706"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const IChevD  = ({sz=12})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
const IChevU  = ({sz=12})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>;
const IRocket = ({sz=18,col="#fff"})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>;

const T={
  bg:'#FFFFFF',surface:'#FFFFFF',surfaceAlt:'#F5F5F7',
  border:'#E4E0D8',borderLight:'#EDE9E2',
  text:'#1A1714',textMuted:'#6B6560',textSubtle:'#9B9590',
  accent:'#1d6bfc',accentHover:'#1558e0',accentBg:'#EEF4FF',accentBorder:'#C5D9FF',
  green:'#16a34a',greenBg:'#F0FDF4',greenBorder:'#86efac',
  red:'#dc2626',redBg:'#FEF2F2',redBorder:'#fca5a5',
  amber:'#d97706',amberBg:'#FFFBEB',amberBorder:'#fcd34d',
  purple:'#7c3aed',purpleBg:'#F5F3FF',purpleBorder:'#c4b5fd',
};

const L={
  ru:{
    title:'Заявка на рассмотрение',back:'← Назад',
    restored:'Черновик восстановлен',restoredSub:'Данные восстановлены из автосохранения',dismiss:'Закрыть',
    progress:'Заполнено',of:'из',fields:'полей',
    basicInfo:'Базовая информация',docUpload:'Загрузка документов',
    mandatory:'ОБЯЗАТЕЛЬНЫЕ',replace:'Заменить',upload:'Загрузить',
    founder:'Фаундер',name:'ФИО',country:'Страна',role:'Роль',
    linkType:'Тип ссылки',linkUrl:'Ссылка / профиль',addLink:'+ Добавить ссылку',
    details:'Подробнее',aiAssistant:'ИИ-ассистент',aiPlaceholder:'Напишите вопрос...',
    suggestQ1:'Что важно для pre-seed?',suggestQ2:'Как загрузить Demo?',
    siteCheck:'Gate Check пройден — все критерии',optional:'если есть',
    company:'Название компании',activity:'Вид деятельности',stage:'Стадия проекта',
    email:'Email',invest:'Запрашиваемые инвестиции',desc:'Описание проекта',
    site:'Сайт',currency:'Валюта',chooseActivity:'Выберите вид деятельности',
    pitchDeck:'Pitch Deck',subdocLabel:'СУБДОКУМЕНТЫ К PITCH DECK',
    productDemo:'PRODUCT DEMO',productDemoSub:'Чем больше доступа — тем точнее оценка CPO+CTO',
    accessLabel:'Доступ к продукту',accessSub:'Ожидается для Seed',
    videoLabel:'Видео-демонстрация',videoSub:'5–15 мин',
    publicLink:'Ссылка на публичный продукт',publicLinkSub:'без регистрации',
    legalPack:'ЮРИДИЧЕСКИЙ ПАКЕТ',legalPackSub:'Условие закрытия сделки',
    finModel:'Финансовая модель',
    submitBtn:'Отправить заявку на анализ',submitSub:'Анализ 5–15 минут · Email придёт на почту',
    switchToB:'Перейти к документам →',switchToA:'← К базовой информации',
    panelActive:'Активен',panelSwitch:'Нажмите для перехода',
    whatIs:'ЧТО ЭТО?',how:'КАК ПОДГОТОВИТЬ?',why:'ЗАЧЕМ ИНВЕСТОРУ?',
    aiSub:'Нажмите ⓘ у любого документа',
    firstRound:'1-й раунд',firstRoundDone:'✓ 1-й раунд',
  },
  en:{
    title:'Application for Review',back:'← Back',
    restored:'Draft Restored',restoredSub:'Data restored from autosave',dismiss:'Close',
    progress:'Filled',of:'of',fields:'fields',
    basicInfo:'Basic Information',docUpload:'Document Upload',
    mandatory:'REQUIRED',replace:'Replace',upload:'Upload',
    founder:'Founder',name:'Full Name',country:'Country',role:'Role',
    linkType:'Link type',linkUrl:'Link / profile',addLink:'+ Add link',
    details:'Details',aiAssistant:'AI Assistant',aiPlaceholder:'Ask a question...',
    suggestQ1:'What matters for pre-seed?',suggestQ2:'How to upload Demo?',
    siteCheck:'Gate Check passed — all criteria met',optional:'if available',
    company:'Company Name',activity:'Business Activity',stage:'Project Stage',
    email:'Email',invest:'Requested Investment',desc:'Project Description',
    site:'Website',currency:'Currency',chooseActivity:'Choose activity',
    pitchDeck:'Pitch Deck',subdocLabel:'SUBDOCUMENTS TO PITCH DECK',
    productDemo:'PRODUCT DEMO',productDemoSub:'More access = more accurate CPO+CTO evaluation',
    accessLabel:'Product Access',accessSub:'Expected for Seed',
    videoLabel:'Video Demo',videoSub:'5–15 min',
    publicLink:'Public product link',publicLinkSub:'no registration',
    legalPack:'LEGAL PACKAGE',legalPackSub:'Required before closing',
    finModel:'Financial Model',
    submitBtn:'Submit for Analysis',submitSub:'Analysis 5–15 min · Results sent by email',
    switchToB:'Go to documents →',switchToA:'← Back to basic info',
    panelActive:'Active',panelSwitch:'Click to switch',
    whatIs:'WHAT IS IT?',how:'HOW TO PREPARE?',why:'WHY FOR INVESTOR?',
    aiSub:'Click ⓘ next to any document',
    firstRound:'1st round',firstRoundDone:'✓ 1st round',
  },
};

const CA=['Казахстан','Узбекистан','Кыргызстан','Таджикистан','Туркменистан'];
const BLOCKED=['крипто','блокчейн','web3','nft','токен','gambling','казино','crypto','blockchain','token','casino','deep-tech','deeptech'];
const COUNTRIES_RU=['Казахстан','Узбекистан','Кыргызстан','Таджикистан','Туркменистан','Россия','США','Германия','Другая'];
const COUNTRIES_EN=['Kazakhstan','Uzbekistan','Kyrgyzstan','Tajikistan','Turkmenistan','Russia','USA','Germany','Other'];
const ROLES=['CEO','CTO','CPO','CMO','CFO','COO','CSO'];
const LINKS_RU=['LinkedIn','Сайт','Instagram','Telegram','Twitter/X','Другое'];
const LINKS_EN=['LinkedIn','Website','Instagram','Telegram','Twitter/X','Other'];
const STAGES_RU=['Seed — MVP + первые клиенты','Pre-seed — идея / прототип'];
const STAGES_EN=['Seed — MVP + first clients','Pre-seed — idea / prototype'];
const ACTS_RU=['SaaS / B2B-платформа','Маркетплейс','Мобильное приложение','Fintech / Payments','Edtech','Logistics Tech / Supply Chain','HR Tech / Recruitment','Legal Tech','E-commerce / Retail Tech','PropTech','Agritech','Mediatech / Content','Analytics / BI','Dev Tools / API','Cybersecurity (без R&D)'];
const ACTS_EN=['SaaS / B2B Platform','Marketplace','Mobile App','Fintech / Payments','Edtech','Logistics Tech / Supply Chain','HR Tech / Recruitment','Legal Tech','E-commerce / Retail Tech','PropTech','Agritech','Mediatech / Content','Analytics / BI','Dev Tools / API','Cybersecurity (no R&D)'];
const CURR=['USD','EUR','KZT','RUB'];

const SD={
  mkt:{id:'mkt',labelRu:'Market Sizing (TAM/SAM/SOM)',labelEn:'Market Sizing (TAM/SAM/SOM)',seed:'required',preseed:'required',
    whatRu:'Расчёт объёма рынка: TAM — весь рынок, SAM — достижимый, SOM — реальная доля.',whatEn:'Market size: TAM, SAM, SOM.',
    howRu:'Два метода: top-down и bottom-up. Указывайте источники (Statista, CB Insights).',howEn:'Top-down and bottom-up methods. Cite sources.',
    whyRu:'CMO+CCO верифицирует через независимые источники. Без источников — красный флаг.',whyEn:'Verified vs independent sources. No sources = red flag.'},
  tech:{id:'tech',labelRu:'Technology Overview',labelEn:'Technology Overview',seed:'required',preseed:'required',
    whatRu:'Стек и архитектура: frontend, backend, БД, инфраструктура.',whatEn:'Stack and architecture: frontend, backend, DB, infra.',
    howRu:'1–2 страницы + схема архитектуры. Обоснование ключевых решений.',howEn:'1–2 pages + architecture diagram.',
    whyRu:'CPO+CTO оценивает масштабируемость до 10× пользователей.',whyEn:'CPO+CTO evaluates scalability to 10× users.'},
  unit:{id:'unit',labelRu:'Unit Economics',labelEn:'Unit Economics',seed:'required',preseed:'optional',
    whatRu:'CAC, LTV, payback period, gross margin по сегментам.',whatEn:'CAC, LTV, payback period, gross margin.',
    howRu:'CAC = маркетинг / клиенты. LTV = ARPU × срок × margin. Три сценария.',howEn:'CAC = marketing / clients. LTV = ARPU × lifetime × margin.',
    whyRu:'CFO: LTV/CAC > 3× — норма. Сравнивает с бенчмарками a16z.',whyEn:'CFO: LTV/CAC > 3× is norm. vs a16z benchmarks.'},
  founders:{id:'founders',labelRu:'Профили основателей',labelEn:'Founder Profiles',seed:'required',preseed:'required',
    whatRu:'CV каждого фаундера: образование, опыт, LinkedIn.',whatEn:'CV per founder: education, experience, LinkedIn.',
    howRu:'Роль, достижения с цифрами. LinkedIn обязателен.',howEn:'Role, numbered achievements. LinkedIn required.',
    whyRu:'CHRO верифицирует через LinkedIn, Crunchbase. Без трекшна — главный актив.',whyEn:'CHRO verifies via LinkedIn, Crunchbase.'},
  cap:{id:'cap',labelRu:'Таблица капитализации (Cap Table)',labelEn:'Cap Table',seed:'required',preseed:'required',
    whatRu:'Доли: основатели, инвесторы, ESOP — с историей изменений.',whatEn:'Equity: founders, investors, ESOP — with history.',
    howRu:'Excel или PDF. Включите SAFE и конвертируемые займы.',howEn:'Excel or PDF. Include SAFEs and convertibles.',
    whyRu:'CFO и CLO оценивают dilution инвестора.',whyEn:'CFO and CLO evaluate investor dilution.'},
  val:{id:'val',labelRu:'Оценка компании (Pre-money)',labelEn:'Company Valuation (Pre-money)',seed:'required',preseed:'optional',
    whatRu:'Pre-money valuation с методологией: revenue multiple, scorecard, DCF.',whatEn:'Pre-money valuation: revenue multiple, scorecard, DCF.',
    howRu:'Метод + данные + расчёт + comparable сделки из Crunchbase.',howEn:'Method + data + calculation + Crunchbase comparables.',
    whyRu:'Без — CFO рассчитает самостоятельно тремя методами.',whyEn:'Without — CFO calculates independently.'},
  fin:{id:'fin',labelRu:'Финансовая модель',labelEn:'Financial Model',seed:'required',preseed:'required',
    whatRu:'Excel: P&L, cash flow, прогнозы 3–5 лет, burn rate, runway.',whatEn:'Excel: P&L, cash flow, 3–5 year forecasts, burn rate, runway.',
    howRu:'Три сценария: базовый, оптимистичный, консервативный. Формулы.',howEn:'Three scenarios: base, optimistic, conservative. Use formulas.',
    whyRu:'Ключевой документ CFO: арифметика и реалистичность допущений.',whyEn:'Key CFO doc: verifies arithmetic and assumptions.'},
};

const LEGAL=[
  {id:'ip',labelRu:'IP Assignment Agreements',labelEn:'IP Assignment Agreements',
    whatRu:'Передача прав на IP от основателей.',whatEn:'IP rights transfer from founders.',
    howRu:'Каждый разработчик подписывает до начала работы.',howEn:'Every developer signs before work begins.',
    whyRu:'Без — права на код у физлиц. Критический риск.',whyEn:'Without — code belongs to individuals. Critical risk.',
    exampleText:'YC IP Assignment Template',exampleUrl:'https://www.ycombinator.com/documents/'},
  {id:'tm',labelRu:'Товарные знаки, домен и Open Source',labelEn:'Trademarks, Domain & Open Source',
    whatRu:'ТЗ, домен, список OSS-библиотек с лицензиями.',whatEn:'TM, domain, OSS libraries with licenses.',
    howRu:'WHOIS, реестры патентов, список open-source.',howEn:'WHOIS, patent registries, OSS list.',
    whyRu:'GPL/AGPL в закрытом продукте = условие замены.',whyEn:'GPL/AGPL in closed product = must replace.',
    exampleText:'FOSSA for OSS audit',exampleUrl:null},
  {id:'corp',labelRu:'Учредительные документы',labelEn:'Incorporation Documents',
    whatRu:'Устав, свидетельство о регистрации, SHA.',whatEn:'Charter, registration, SHA.',
    howRu:'Если нет — оформление будет условием первого транша.',howEn:'If absent — incorporation is condition for first tranche.',
    whyRu:'Юридическая основа для сделки.',whyEn:'Legal foundation for the deal.',
    exampleText:'Официальные документы',exampleUrl:null},
  {id:'contracts',labelRu:'Договоры с сотрудниками',labelEn:'Employee Agreements',
    whatRu:'Трудовые договоры (шаблоны) с NDA.',whatEn:'Employment contracts (templates) with NDAs.',
    howRu:'Обезличенные копии без ФИО — стандарт Data Room.',howEn:'Anonymized copies — Data Room standard.',
    whyRu:'Подтверждает легальность команды.',whyEn:'Confirms team legality.',
    exampleText:'Шаблон обезличенного договора',exampleUrl:null},
  {id:'tos',labelRu:'Terms of Service & Privacy Policy',labelEn:'Terms of Service & Privacy Policy',
    whatRu:'Условия использования и политика конфиденциальности.',whatEn:'Terms of use and privacy policy.',
    howRu:'Опубликованы на сайте. Для всех юрисдикций.',howEn:'Published on site. For all jurisdictions.',
    whyRu:'GDPR нарушения = регуляторный риск.',whyEn:'GDPR violations = regulatory risk.',
    exampleText:'Termly.io или iubenda',exampleUrl:null},
];

const stageKey=s=>{if(!s)return'seed';if(s.includes('Seed')&&!s.includes('Pre'))return'seed';return'preseed';};
const docStatus=(doc,sk)=>doc[sk]==='required'?'required':doc[sk]==='optional'?'optional':'hidden';

function gateCheck(co,fnd,lang){
  const issues=[];
  if(!fnd||!fnd.length)return issues;
  if(!fnd.some(f=>CA.includes(f.country)))
    issues.push({type:'block',ru:'Нет фаундеров из ЦА. Минимум 1 из KZ/UZ/KG/TJ/TM.',en:'No Central Asia founders. Min 1 from KZ/UZ/KG/TJ/TM.'});
  const desc=(co.desc||'').toLowerCase();
  const bad=BLOCKED.find(k=>desc.includes(k));
  if(bad){
    const hard=['крипто','блокчейн','web3','nft','gambling','казино','crypto','blockchain','token','casino'].some(k=>desc.includes(k));
    issues.push({type:hard?'block':'warn',
      ru:hard?`Описание содержит "${bad}" — индустрия исключена.`:`Описание упоминает "${bad}" — уточните соответствие.`,
      en:hard?`Contains "${bad}" — excluded industry.`:`Mentions "${bad}" — verify match.`});
  }
  return issues;
}

const inp={width:'100%',boxSizing:'border-box',padding:'9px 12px',border:`1.5px solid ${T.border}`,borderRadius:10,background:'#fff',fontSize:13,color:T.text,fontFamily:'inherit',outline:'none',transition:'border-color .15s'};
const lbl={fontSize:11,color:T.textSubtle,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5,display:'block'};

function DocInfo({doc,lang,t,onAsk}){
  const [open,setOpen]=useState(false);
  if(!doc)return null;
  const lbl2=lang==='ru'?doc.labelRu:doc.labelEn;
  const q=lang==='ru'?`Объясни документ "${lbl2}": что это, как подготовить и зачем инвестору?`:`Explain "${lbl2}": what is it, how to prepare, why needed?`;
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
        <button onClick={()=>setOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',fontSize:11,color:T.textSubtle,fontFamily:'inherit',padding:'3px 0',transition:'color .15s'}}
          onMouseOver={e=>e.currentTarget.style.color=T.textMuted} onMouseOut={e=>e.currentTarget.style.color=T.textSubtle}>
          {t.details} {open?<IChevU sz={11}/>:<IChevD sz={11}/>}
        </button>
        {onAsk&&<button onClick={()=>onAsk(q)} title={lang==='ru'?'Спросить ИИ':'Ask AI'}
          style={{width:20,height:20,borderRadius:'50%',border:`1.5px solid ${T.accentBorder}`,background:T.accentBg,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:T.accent,padding:0,flexShrink:0,transition:'all .15s'}}
          onMouseOver={e=>{e.currentTarget.style.background=T.accent;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='scale(1.12)';}}
          onMouseOut={e=>{e.currentTarget.style.background=T.accentBg;e.currentTarget.style.color=T.accent;e.currentTarget.style.transform='scale(1)';}}>i</button>}
      </div>
      {open&&<div style={{marginTop:8,borderRadius:12,overflow:'hidden',border:`1px solid ${T.accentBorder}`}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
          {[
            {h:t.whatIs,b:lang==='ru'?doc.whatRu:doc.whatEn,bg:'#EFF6FF',c:'#1D4ED8'},
            {h:t.how,b:lang==='ru'?doc.howRu:doc.howEn,bg:T.greenBg,c:'#15803D'},
            {h:t.why,b:lang==='ru'?doc.whyRu:doc.whyEn,bg:T.purpleBg,c:T.purple},
            {h:lang==='ru'?'ПРИМЕР':'EXAMPLE',b:doc.exampleText||'Свободная форма',url:doc.exampleUrl,bg:'#FAF5FF',c:'#7C3AED'},
          ].map((col,i)=>(
            <div key={i} style={{padding:'10px 12px',background:col.bg,borderRight:i<3?`1px solid ${T.borderLight}`:'none'}}>
              <div style={{fontSize:10,fontWeight:700,color:col.c,letterSpacing:'.1em',marginBottom:5}}>{col.h}</div>
              <div style={{fontSize:11,color:T.textMuted,lineHeight:1.6}}>
                {col.url?<a href={col.url} target="_blank" rel="noreferrer" style={{color:'#7C3AED',fontWeight:600,textDecoration:'underline'}}>{col.b}</a>:col.b}
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

function SlotRow({id,doc,val,status,onUp,lang,t,onAsk,firstRound,onFR}){
  const label=lang==='ru'?doc.labelRu:doc.labelEn;
  const filled=Boolean(val)||firstRound;
  const opt=status==='optional';
  if(status==='hidden')return null;
  return(
    <div style={{borderTop:`1px solid ${T.borderLight}`,padding:'10px 0'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
        <div style={{flexShrink:0,width:18,paddingTop:2}}>
          {filled?<ICheck sz={14}/>:opt?<span style={{fontSize:11,color:T.amber,fontWeight:700}}>?</span>:<IXc sz={14}/>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
            <span style={{fontSize:13,fontWeight:600,color:T.text}}>{label}</span>
            {opt&&<span style={{fontSize:10,color:T.amber,background:T.amberBg,border:`1px solid ${T.amberBorder}`,padding:'1px 7px',borderRadius:5,fontWeight:600}}>{t.optional}</span>}
          </div>
          {val&&!firstRound&&<div style={{fontSize:11,color:T.textSubtle,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{val}</div>}
          {firstRound&&<div style={{fontSize:11,color:T.textMuted,marginBottom:2}}>{lang==='ru'?'Первый раунд':'First round'}</div>}
          <DocInfo doc={doc} lang={lang} t={t} onAsk={onAsk}/>
        </div>
        <div style={{flexShrink:0,display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
          {id==='rounds'&&!val&&onFR&&(
            <button onClick={onFR} style={{fontSize:11,color:firstRound?T.green:T.textMuted,padding:'5px 10px',border:`1px solid ${firstRound?T.greenBorder:T.border}`,borderRadius:8,cursor:'pointer',background:firstRound?T.greenBg:'white',fontFamily:'inherit',fontWeight:firstRound?700:500,whiteSpace:'nowrap'}}>
              {firstRound?t.firstRoundDone:t.firstRound}
            </button>
          )}
          <label style={{fontSize:11,padding:'6px 12px',border:`1.5px solid ${filled?T.border:opt?T.amberBorder:T.redBorder}`,borderRadius:9,cursor:'pointer',background:filled?'#fff':opt?T.amberBg:T.redBg,fontWeight:700,whiteSpace:'nowrap',fontFamily:'inherit',color:filled?T.textMuted:opt?T.amber:T.red,display:'block',transition:'all .15s'}}
            onMouseOver={e=>{e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.1)';e.currentTarget.style.transform='translateY(-1px)';}}
            onMouseOut={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
            {filled&&!firstRound?t.replace:t.upload}
            <input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onUp(id,f.name);}}/>
          </label>
        </div>
      </div>
    </div>
  );
}

function DropZone({id,doc,val,onUp,lang,t,onAsk}){
  const [drag,setDrag]=useState(false);
  const label=lang==='ru'?doc.labelRu:doc.labelEn;
  const onDrop=useCallback(e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files?.[0];if(f)onUp(id,f.name);},[id,onUp]);
  return(
    <div>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}
        style={{border:`2px dashed ${drag?T.accent:val?T.green:T.border}`,borderRadius:12,padding:14,textAlign:'center',background:drag?T.accentBg:val?T.greenBg:'#fafaf7',transition:'all .18s'}}>
        {val?(
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexWrap:'wrap'}}>
            <ICheck sz={14}/><span style={{fontSize:13,color:T.green,fontWeight:700,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{val}</span>
            <label style={{fontSize:12,color:T.textMuted,padding:'5px 12px',border:`1px solid ${T.border}`,borderRadius:8,cursor:'pointer',background:'white',fontFamily:'inherit',fontWeight:600,transition:'all .15s'}}
              onMouseOver={e=>e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.1)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
              {t.replace}<input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onUp(id,f.name)}}/>
            </label>
          </div>
        ):(
          <label style={{cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:7}}>
            <IUpload sz={20} col={drag?T.accent:'#bbb'}/>
            <span style={{fontSize:12,color:T.textMuted}}><span style={{color:T.accent,fontWeight:700}}>{label}</span> — {lang==='ru'?'перетащите или нажмите':'drag or click'}</span>
            <input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onUp(id,f.name)}}/>
          </label>
        )}
      </div>
      <DocInfo doc={doc} lang={lang} t={t} onAsk={onAsk}/>
    </div>
  );
}

function FounderBlock({founder,index,lang,onChange,onRemove}){
  const t=L[lang];
  const countries=lang==='ru'?COUNTRIES_RU:COUNTRIES_EN;
  const linkTypes=lang==='ru'?LINKS_RU:LINKS_EN;
  const links=founder.links||[];
  return(
    <div style={{background:'#F8F9FF',borderRadius:16,padding:18,border:`1.5px solid ${T.accentBorder}`,marginBottom:12,boxShadow:`0 0 0 3px ${T.accentBg}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:T.accentBg,border:`2px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}><IUser sz={15} col={T.accent}/></div>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>{t.founder} {index+1}</span>
        </div>
        {index>0&&<button onClick={onRemove} style={{display:'flex',alignItems:'center',gap:5,background:'#FEF2F2',border:`1px solid ${T.redBorder}`,borderRadius:8,cursor:'pointer',padding:'5px 10px',color:T.red,fontSize:12,fontFamily:'inherit',fontWeight:600,transition:'all .15s'}}
          onMouseOver={e=>e.currentTarget.style.boxShadow='0 2px 6px rgba(220,38,38,.2)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
          <IX sz={11} col={T.red}/>{lang==='ru'?'Удалить':'Remove'}
        </button>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div><label style={lbl}>{t.name}</label><input style={inp} value={founder.name||''} onChange={e=>onChange({name:e.target.value})} placeholder="Иванов Иван"/></div>
        <div><label style={lbl}>{t.country}</label>
          <select style={inp} value={founder.country||'Казахстан'} onChange={e=>onChange({country:e.target.value})}>
            {countries.map((c,i)=><option key={c} value={COUNTRIES_RU[i]}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginBottom:12}}><label style={lbl}>{t.role}</label>
        <select style={inp} value={founder.role||'CEO'} onChange={e=>onChange({role:e.target.value})}>
          {ROLES.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      {links.length>0&&<div style={{marginBottom:10}}>
        <label style={{...lbl,display:'flex',alignItems:'center',gap:4}}><IGlobe sz={10}/>{t.linkUrl}</label>
        {links.map((link,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:`130px 1fr${i>0?' 36px':''}`,gap:8,marginBottom:8,alignItems:'center'}}>
            <select style={inp} value={link.type||linkTypes[0]} onChange={e=>onChange({links:links.map((l,j)=>j===i?{...l,type:e.target.value}:l)})}>
              {linkTypes.map(lt=><option key={lt}>{lt}</option>)}
            </select>
            <input style={inp} value={link.url||''} onChange={e=>onChange({links:links.map((l,j)=>j===i?{...l,url:e.target.value}:l)})} placeholder="linkedin.com/in/username"/>
            {i>0&&<button onClick={()=>onChange({links:links.filter((_,j)=>j!==i)})}
              style={{height:38,background:'#FEF2F2',border:`1px solid ${T.redBorder}`,borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <IX sz={11} col={T.red}/></button>}
          </div>
        ))}
      </div>}
      <button onClick={()=>onChange({links:[...links,{type:linkTypes[0],url:''}]})}
        style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:T.accent,background:T.accentBg,border:`1px dashed ${T.accentBorder}`,cursor:'pointer',padding:'7px 14px',borderRadius:9,fontFamily:'inherit',fontWeight:600,transition:'all .15s'}}
        onMouseOver={e=>e.currentTarget.style.background='rgba(29,107,252,.12)'} onMouseOut={e=>e.currentTarget.style.background=T.accentBg}>
        <IPlus sz={12} col={T.accent}/>{t.addLink}
      </button>
      {links.some(l=>l.url)&&<div style={{marginTop:10,fontSize:12,color:T.green,display:'flex',alignItems:'center',gap:5,padding:'6px 10px',background:T.greenBg,borderRadius:8,border:`1px solid ${T.greenBorder}`}}>
        <ICheck sz={11} col={T.green}/>{lang==='ru'?'Агент CHRO верифицирует профиль':'CHRO agent will verify profile'}
      </div>}
    </div>
  );
}

function CompanyBlock({data,lang,onChange,founders}){
  const t=L[lang];
  const acts=lang==='ru'?ACTS_RU:ACTS_EN;
  const stages=lang==='ru'?STAGES_RU:STAGES_EN;
  const issues=gateCheck(data,founders||[],lang);
  const hasBlock=issues.some(i=>i.type==='block');
  const ok=data.company&&data.company.trim().length>1&&data.activity&&!hasBlock&&issues.length===0;
  return(
    <div style={{background:T.surface,borderRadius:16,padding:18,border:`1px solid ${T.border}`}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div><label style={lbl}>{t.company} *</label><input style={inp} value={data.company||''} onChange={e=>onChange({company:e.target.value})} placeholder="FastRoute"/></div>
        <div><label style={lbl}>{t.activity} *</label>
          <select style={inp} value={data.activity||''} onChange={e=>onChange({activity:e.target.value})}>
            <option value="">{t.chooseActivity}</option>
            {acts.map((a,i)=><option key={a} value={ACTS_RU[i]}>{a}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div><label style={lbl}>{t.stage} *</label>
          <select style={inp} value={data.stage||STAGES_RU[0]} onChange={e=>onChange({stage:e.target.value})}>
            {stages.map((s,i)=><option key={s} value={STAGES_RU[i]}>{s}</option>)}
          </select>
        </div>
        <div><label style={lbl}>{t.email} *</label><input style={inp} type="email" value={data.email||''} onChange={e=>onChange({email:e.target.value})} placeholder="alex@startup.kz"/></div>
      </div>
      <div style={{marginBottom:12}}><label style={lbl}>{t.desc}</label>
        <textarea style={{...inp,height:72,resize:'vertical',lineHeight:1.5}} value={data.desc||''} onChange={e=>onChange({desc:e.target.value})} placeholder={lang==='ru'?'Кратко опишите проект...':'Briefly describe the project...'}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 130px 85px',gap:10,marginBottom:14,alignItems:'end'}}>
        <div><label style={lbl}>{t.site}</label><input style={inp} value={data.site||''} onChange={e=>onChange({site:e.target.value})} placeholder="fastroute.kz"/></div>
        <div><label style={lbl}>{t.invest}</label><input style={inp} value={data.invest||''} onChange={e=>onChange({invest:e.target.value})} placeholder="500 000"/></div>
        <div><label style={lbl}>{t.currency}</label>
          <select style={inp} value={data.currency||'USD'} onChange={e=>onChange({currency:e.target.value})}>
            {CURR.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {ok&&<div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:T.green,background:T.greenBg,border:`1px solid ${T.greenBorder}`,borderRadius:9,padding:'9px 13px'}}><ICheck sz={13}/><strong>{t.siteCheck}</strong></div>}
      {issues.map((iss,i)=>(
        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:12,color:iss.type==='block'?T.red:T.amber,background:iss.type==='block'?T.redBg:T.amberBg,border:`1px solid ${iss.type==='block'?T.redBorder:T.amberBorder}`,borderRadius:9,padding:'10px 14px',marginTop:8}}>
          <span style={{fontSize:15,flexShrink:0}}>{iss.type==='block'?'🚫':'⚠️'}</span>
          <div style={{lineHeight:1.55}}>{lang==='ru'?iss.ru:iss.en}</div>
        </div>
      ))}
    </div>
  );
}

function AIChatPanel({lang,onClose,extMsg,extKey,ctx}){
  const t=L[lang];
  const welcome=lang==='ru'
    ?'Привет! 👋 Я здесь, чтобы помочь заполнить заявку.\n\nНажимайте кнопку ⓘ рядом с любым документом — я сразу объясню:\n• Что это такое\n• Как подготовить\n• Зачем это нужно инвестору\n\nЧем могу помочь?'
    :'Hi! 👋 I\'m here to help you complete the application.\n\nClick the ⓘ button next to any document — I\'ll immediately explain:\n• What it is\n• How to prepare it\n• Why the investor needs it\n\nHow can I help?';
  const [msgs,setMsgs]=useState([{role:'assistant',content:welcome}]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const [hist,setHist]=useState([]);
  const endRef=useRef(null);
  const inpRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,loading]);
  useEffect(()=>{if(extMsg){send(extMsg);setTimeout(()=>inpRef.current?.focus(),400);}},[extKey]);

  async function send(text){
    const q=(text||input).trim();if(!q||loading)return;
    setInput('');
    const um={role:'user',content:q};
    const nh=[...hist,um];
    setMsgs(p=>[...p,{role:'user',content:q}]);setLoading(true);
    try{
      const r=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:q,context:{...(ctx||{}),lang},history:nh.slice(-8)})});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const d=await r.json();
      const reply=d.reply||(lang==='ru'?'Ошибка. Попробуйте ещё раз.':'Error. Please try again.');
      setMsgs(p=>[...p,{role:'assistant',content:reply}]);
      setHist([...nh,{role:'assistant',content:reply}]);
    }catch{
      setMsgs(p=>[...p,{role:'assistant',content:lang==='ru'?'Не удалось подключиться. Убедитесь что /api/chat доступен.':'Could not connect. Make sure /api/chat is available.'}]);
    }
    setLoading(false);
  }

  const qs=[t.suggestQ1,t.suggestQ2,lang==='ru'?'Что такое Gate Check?':'What is Gate Check?',lang==='ru'?'Расскажи о юридическом пакете':'Tell me about the legal package'];

  return(
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.3)',zIndex:498,backdropFilter:'blur(3px)'}}/>
      <div style={{position:'fixed',top:0,right:0,bottom:0,width:'50vw',minWidth:420,maxWidth:780,background:'linear-gradient(180deg,#0d1b35 0%,#091220 100%)',zIndex:499,display:'flex',flexDirection:'column',fontFamily:'inherit',boxShadow:'-16px 0 60px rgba(0,0,0,.4)'}}>
        <div style={{padding:'22px 24px 18px',borderBottom:'1px solid rgba(255,255,255,.08)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:46,height:46,borderRadius:14,background:'linear-gradient(135deg,#3b82f6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 6px 20px rgba(59,130,246,.45)'}}><IZap sz={22}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700,color:'#fff',letterSpacing:'-0.3px'}}>{t.aiAssistant}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>{t.aiSub}</div>
            </div>
            <button onClick={onClose} style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,.1)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .15s'}}
              onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,.18)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
              <IX sz={14} col="#9ca3af"/>
            </button>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'20px 22px 8px',display:'flex',flexDirection:'column',gap:14}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',alignItems:'flex-end',gap:10}}>
              {m.role==='assistant'&&<div style={{width:30,height:30,borderRadius:9,background:'rgba(99,102,241,.25)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginBottom:2}}><IZap sz={13} col="#818cf8"/></div>}
              <div style={{maxWidth:'78%',padding:'12px 16px',borderRadius:m.role==='user'?'18px 18px 4px 18px':'4px 18px 18px 18px',background:m.role==='user'?T.accent:'rgba(255,255,255,.1)',color:'#fff',fontSize:14,lineHeight:1.7,whiteSpace:'pre-wrap',border:m.role==='user'?'none':'1px solid rgba(255,255,255,.07)'}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:'flex',alignItems:'flex-end',gap:10}}>
            <div style={{width:30,height:30,borderRadius:9,background:'rgba(99,102,241,.25)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IZap sz={13} col="#818cf8"/></div>
            <div style={{padding:'12px 18px',background:'rgba(255,255,255,.1)',borderRadius:'4px 18px 18px 18px',border:'1px solid rgba(255,255,255,.07)',display:'flex',gap:6,alignItems:'center'}}>
              {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,.5)',animation:`aDot 1.2s ${i*.2}s infinite`}}/>)}
            </div>
          </div>}
          <div ref={endRef}/>
        </div>
        {msgs.length<=2&&<div style={{padding:'4px 22px 10px',display:'flex',flexDirection:'column',gap:7}}>
          {qs.map((q,i)=>(
            <button key={i} onClick={()=>send(q)} style={{padding:'12px 16px',borderRadius:13,border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.8)',fontSize:14,textAlign:'left',cursor:'pointer',fontFamily:'inherit',transition:'all .15s',lineHeight:1.3}}
              onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,.11)';e.currentTarget.style.borderColor='rgba(255,255,255,.22)';}}
              onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.borderColor='rgba(255,255,255,.12)';}}>
              {q}
            </button>
          ))}
        </div>}
        <div style={{padding:'12px 22px 26px',borderTop:'1px solid rgba(255,255,255,.08)',flexShrink:0}}>
          <div style={{display:'flex',gap:10,background:'rgba(255,255,255,.07)',borderRadius:16,border:'1px solid rgba(255,255,255,.12)',padding:'6px 6px 6px 16px',alignItems:'flex-end'}}>
            <textarea ref={inpRef} value={input}
              onChange={e=>{setInput(e.target.value);e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,120)+'px';}}
              onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send())}
              placeholder={t.aiPlaceholder} rows={1}
              style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:15,fontFamily:'inherit',lineHeight:1.5,resize:'none',padding:'8px 0',maxHeight:120,overflowY:'auto'}}/>
            <button onClick={()=>send()} disabled={loading||!input.trim()}
              style={{width:44,height:44,borderRadius:13,background:input.trim()?T.accent:'rgba(255,255,255,.08)',border:'none',cursor:input.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .18s',boxShadow:input.trim()?'0 4px 14px rgba(29,107,252,.5)':'none'}}>
              <ISend sz={17}/>
            </button>
          </div>
          <div style={{textAlign:'center',marginTop:8,fontSize:11,color:'rgba(255,255,255,.2)'}}>{lang==='ru'?'Enter — отправить · Shift+Enter — новая строка':'Enter to send · Shift+Enter for new line'}</div>
        </div>
      </div>
      <style>{`@keyframes aDot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}`}</style>
    </>
  );
}

function ProgressBar({filled,total,lang}){
  const t=L[lang];const pct=Math.round((filled/total)*100);
  const color=pct===100?T.green:pct>=60?T.amber:T.red;
  return(
    <div style={{background:T.surface,border:`1.5px solid ${T.accentBorder}`,borderRadius:14,padding:'13px 18px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
        <span style={{fontSize:13,color:T.textMuted}}>{t.progress} <strong style={{color}}>{filled}</strong> {t.of} {total} {t.fields}</span>
        <span style={{fontSize:13,fontWeight:700,color,background:color+'20',padding:'2px 10px',borderRadius:7}}>{pct}%</span>
      </div>
      <div style={{height:7,background:'#EDE9E2',borderRadius:5,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${T.accent},#6366f1)`,borderRadius:5,transition:'width .5s ease'}}/>
      </div>
    </div>
  );
}

function Home({go}){
  return(
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2rem',padding:'3.5rem 1.5rem',background:'#fff'}}>
      <div style={{textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 14px',background:'#F0EEE9',borderRadius:100,marginBottom:14,border:`1px solid ${T.border}`}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:T.accent}}/><span style={{fontSize:11,letterSpacing:'.12em',color:T.textMuted,textTransform:'uppercase',fontWeight:600}}>Activat VC</span>
        </div>
        <h1 style={{fontSize:48,fontWeight:800,color:T.text,margin:'0 0 .75rem',letterSpacing:'-1.8px',lineHeight:1.1}}>VentureIQ</h1>
        <p style={{fontSize:14,color:T.textMuted,maxWidth:420,lineHeight:1.75,margin:'0 auto'}}>Автоматизированный due diligence стартапов. 6 ИИ-агентов, Investment Score 1–10.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',width:'100%',maxWidth:560}}>
        {[
          {l:'Фаундерам',s:'Подать заявку — ИИ-ассистент поможет',sc:SC.FORM,col:T.accent,bg:T.accentBg,bd:T.accentBorder},
          {l:'Инвесторам',s:'Демо-отчёт с чатом Orchestrator',sc:null,col:T.green,bg:T.greenBg,bd:T.greenBorder},
          {l:'Бухгалтерия',s:'Сделки к оплате · реестр платежей',sc:null,col:'#7c3aed',bg:'#F5F3FF',bd:'#C4B5FD'},
          {l:'Шаблоны',s:'Договоры — 9 слотов (SAFE/Equity/Note)',sc:null,col:T.textMuted,bg:'#F3F1EC',bd:T.border},
          {l:'Портфель',s:'Мониторинг KPI портфельных компаний',sc:null,col:'#0891b2',bg:'#ECFEFF',bd:'#A5F3FC'},
        ].map((x,i)=>(
          <button key={i} onClick={()=>x.sc&&go(x.sc)}
            style={{background:T.surface,borderRadius:14,padding:'1.25rem',boxShadow:'0 1px 4px rgba(26,23,20,.06)',cursor:x.sc?'pointer':'default',textAlign:'left',border:`1px solid ${T.border}`,transition:'box-shadow .2s,transform .18s',opacity:x.sc?1:.62}}
            onMouseEnter={e=>{if(x.sc){e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,.12)';e.currentTarget.style.transform='translateY(-2px)';}}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 4px rgba(26,23,20,.06)';e.currentTarget.style.transform='none';}}>
            <div style={{width:38,height:38,borderRadius:10,background:x.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,border:`1px solid ${x.bd}`}}><IArrow sz={17} col={x.col}/></div>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{x.l}</div>
            <p style={{fontSize:13,color:T.textMuted,lineHeight:1.5,margin:'0 0 12px'}}>{x.s}</p>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:13,color:x.col,fontWeight:600}}>{x.sc?'Открыть':'Скоро'}{x.sc&&<IArrow sz={13} col={x.col}/>}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Form({go}){
  const [lang,setLang]=useState('ru');
  const t=L[lang];
  const [panel,setPanel]=useState('A');
  const [founders,setFounders]=useState([{name:'',country:'Казахстан',role:'CEO',links:[{type:'LinkedIn',url:''}]}]);
  const [co,setCo]=useState({company:'',activity:'',stage:STAGES_RU[0],email:'',desc:'',site:'',invest:'',currency:'USD'});
  const [docs,setDocs]=useState({});
  const [showAI,setShowAI]=useState(false);
  const [aiMsg,setAiMsg]=useState(null);
  const [aiKey,setAiKey]=useState(0);

  const upDoc=(id,name)=>setDocs(d=>({...d,[id]:name}));
  const upFnd=(i,p)=>setFounders(f=>f.map((fd,j)=>j===i?{...fd,...p}:fd));
  const sk=stageKey(co.stage);
  const gs=(doc)=>docStatus(doc,sk);

  const reqIds=['pitch',...['mkt','tech','unit','founders','cap','val'].filter(id=>SD[id]&&SD[id][sk]==='required'),'fin'].filter(id=>{
    if(id==='pitch'||id==='fin')return true;
    return SD[id]&&SD[id][sk]==='required';
  });

  const issues=gateCheck(co,founders,lang);
  const blocked=issues.some(i=>i.type==='block');
  const canSub=reqIds.every(id=>Boolean(docs[id]))&&!blocked;

  const filled=[co.company,co.activity,co.stage,co.email,co.desc,co.site,co.invest,founders[0]?.name,docs.pitch,docs.fin,docs.mkt].filter(Boolean).length;

  const openAI=(msg)=>{setAiMsg(msg||null);setAiKey(k=>k+1);setShowAI(true);};

  const ctx={company:co.company,activity:co.activity,stage:co.stage,email:co.email,desc:co.desc,founders:founders.map(f=>({name:f.name,country:f.country,role:f.role}))};

  const [fr,setFr]=useState(false);
  const [pubUrl,setPubUrl]=useState('');

  const videoDoc={id:'video',labelRu:'Видео-демонстрация',labelEn:'Video Demo',whatRu:'Запись экрана 5–15 мин с комментарием.',whatEn:'Screen recording 5–15 min with commentary.',howRu:'Через Loom: регистрация, core flow, aha-момент.',howEn:'Via Loom: registration, core flow, aha moment.',whyRu:'CPO+CTO проходит продукт изнутри.',whyEn:'CPO+CTO evaluates from inside.'};
  const roundsDoc={id:'rounds',labelRu:'Документы предыдущих раундов',labelEn:'Previous Round Documents',whatRu:'Term sheet, SAFE, займы.',whatEn:'Term sheet, SAFE, loans.',howRu:'Если первый раунд — нажмите кнопку.',howEn:'First round — click the button.',whyRu:'CFO и CLO оценивают существующие обязательства.',whyEn:'CFO and CLO evaluate existing obligations.'};
  const pitchDoc={id:'pitch',labelRu:'Pitch Deck',labelEn:'Pitch Deck',whatRu:'Презентация 10–20 слайдов: проблема, решение, рынок, бизнес-модель, трекшн, команда.',whatEn:'10–20 slides: problem, solution, market, business model, traction, team.',howRu:'PDF или PowerPoint. Четко, без воды.',howEn:'PDF or PowerPoint. Clear and concise.',whyRu:'Все 6 агентов начинают с него. Без — заявка не обрабатывается.',whyEn:'All 6 agents start with it. Without — application not processed.'};

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif',background:'#fff',minHeight:'100vh',WebkitFontSmoothing:'antialiased',width:'100%'}}>
      {/* Sticky header */}
      <div style={{position:'sticky',top:0,zIndex:200,background:'rgba(255,255,255,.96)',backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)',borderBottom:`1px solid ${T.border}`,padding:'10px 20px',display:'flex',alignItems:'center',gap:16}}>
        <button onClick={()=>go(SC.HOME)}
          style={{display:'flex',alignItems:'center',gap:7,padding:'7px 16px',background:T.accent,border:'none',borderRadius:9,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all .18s',boxShadow:'0 2px 8px rgba(29,107,252,.3)'}}
          onMouseOver={e=>{e.currentTarget.style.background=T.accentHover;e.currentTarget.style.boxShadow='0 4px 14px rgba(29,107,252,.4)';}}
          onMouseOut={e=>{e.currentTarget.style.background=T.accent;e.currentTarget.style.boxShadow='0 2px 8px rgba(29,107,252,.3)';}}>
          {t.back}
        </button>
        <h1 style={{flex:1,textAlign:'center',fontSize:16,fontWeight:700,color:T.text,margin:0}}>{t.title}</h1>
        <div style={{display:'flex',gap:3,background:'#EBF3FE',borderRadius:10,padding:3}}>
          {['ru','en'].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{fontSize:13,padding:'5px 14px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'inherit',fontWeight:lang===l?700:500,background:lang===l?T.accent:'transparent',color:lang===l?'#fff':T.textMuted,boxShadow:lang===l?'0 2px 6px rgba(29,107,252,.3)':'none',transition:'all .18s'}}>
              {l==='ru'?'Ru':'Eng'}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'16px 16px 80px'}}>
        {/* Top row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 16px',background:T.accentBg,borderRadius:12,border:`1px solid ${T.accentBorder}`}}>
            <ISave sz={13} col={T.accent}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.accent}}>{t.restored}</div><div style={{fontSize:11,color:T.accent,opacity:.7}}>{t.restoredSub}</div></div>
            <button style={{fontSize:11,color:T.textMuted,background:'white',border:`1px solid ${T.border}`,borderRadius:7,padding:'4px 10px',cursor:'pointer',fontFamily:'inherit'}}>{t.dismiss}</button>
          </div>
          <ProgressBar filled={filled} total={11} lang={lang}/>
        </div>

        {/* Panels */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,alignItems:'start'}}>
          {/* Panel A */}
          <div onClick={panel==='B'?()=>setPanel('A'):undefined}
            style={{borderRadius:16,border:panel==='A'?`2px solid ${T.accentBorder}`:`1.5px solid ${T.border}`,background:T.surface,overflow:'hidden',transition:'all .3s',cursor:panel==='B'?'pointer':'default',opacity:panel==='A'?1:.75,filter:panel==='A'?'none':'saturate(0.5)'}}>
            <div style={{padding:'12px 18px',background:panel==='A'?T.accentBg:'#F5F5F7',borderBottom:`1px solid ${panel==='A'?T.accentBorder:T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:panel==='A'?T.accent:'#D1D5DB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>A</div>
                <div><div style={{fontSize:15,fontWeight:700,color:T.text}}>{t.basicInfo}</div><div style={{fontSize:11,color:T.textSubtle}}>{lang==='ru'?'Фаундеры, компания, контакты':'Founders, company, contacts'}</div></div>
              </div>
              <span style={{fontSize:11,fontWeight:600,color:panel==='A'?T.accent:T.textSubtle,background:'#fff',border:`1px solid ${panel==='A'?T.accentBorder:T.border}`,padding:'3px 10px',borderRadius:8}}>
                {panel==='A'?t.panelActive:t.panelSwitch}
              </span>
            </div>
            <div style={{padding:16,pointerEvents:panel==='A'?'auto':'none'}}>
              {founders.map((f,i)=><FounderBlock key={i} founder={f} index={i} lang={lang} onChange={p=>upFnd(i,p)} onRemove={()=>setFounders(f=>f.filter((_,j)=>j!==i))}/>)}
              <button onClick={()=>setFounders(f=>[...f,{name:'',country:'Казахстан',role:'CTO',links:[]}])}
                style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:T.accent,background:T.accentBg,border:`1.5px dashed ${T.accentBorder}`,cursor:'pointer',padding:'10px 18px',borderRadius:12,fontFamily:'inherit',fontWeight:600,width:'100%',justifyContent:'center',marginBottom:14,transition:'all .15s'}}
                onMouseOver={e=>e.currentTarget.style.background='rgba(29,107,252,.12)'} onMouseOut={e=>e.currentTarget.style.background=T.accentBg}>
                <IPlus sz={14} col={T.accent}/>{lang==='ru'?'Добавить со-фаундера':'Add co-founder'}
              </button>
              <CompanyBlock data={co} lang={lang} onChange={p=>setCo(d=>({...d,...p}))} founders={founders}/>
              <div style={{textAlign:'center',marginTop:14}}>
                <button onClick={()=>setPanel('B')} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:T.accent,fontFamily:'inherit',fontWeight:600}}>{t.switchToB}</button>
              </div>
            </div>
          </div>

          {/* Panel B */}
          <div onClick={panel==='A'?()=>setPanel('B'):undefined}
            style={{borderRadius:16,border:panel==='B'?`2px solid ${T.accentBorder}`:`1.5px solid ${T.border}`,background:T.surface,overflow:'hidden',transition:'all .3s',cursor:panel==='A'?'pointer':'default',opacity:panel==='B'?1:.75,filter:panel==='B'?'none':'saturate(0.5)'}}>
            <div style={{padding:'12px 18px',background:panel==='B'?T.accentBg:'#F5F5F7',borderBottom:`1px solid ${panel==='B'?T.accentBorder:T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:panel==='B'?T.accent:'#D1D5DB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>Б</div>
                <div><div style={{fontSize:15,fontWeight:700,color:T.text}}>{t.docUpload}</div><div style={{fontSize:11,color:T.textSubtle}}>{lang==='ru'?'Адаптировано: ':'Adapted: '}<span style={{color:T.accent,fontWeight:600}}>{sk==='seed'?'Seed':'Pre-seed'}</span></div></div>
              </div>
              <span style={{fontSize:11,fontWeight:600,color:panel==='B'?T.accent:T.textSubtle,background:'#fff',border:`1px solid ${panel==='B'?T.accentBorder:T.border}`,padding:'3px 10px',borderRadius:8}}>
                {panel==='B'?t.panelActive:t.panelSwitch}
              </span>
            </div>
            <div style={{padding:16,pointerEvents:panel==='B'?'auto':'none'}}>
              {/* Cat 1 */}
              <div style={{background:T.surface,borderRadius:16,border:`1.5px solid ${T.redBorder}`,overflow:'hidden',marginBottom:14}}>
                <div style={{padding:'12px 18px',background:'linear-gradient(135deg,#fff5f5,#fff8f8)',borderBottom:`1px solid ${T.redBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><div style={{fontSize:11,fontWeight:700,color:T.red,letterSpacing:'.1em',marginBottom:2}}>{t.mandatory}</div><div style={{fontSize:11,color:T.textSubtle}}>Pitch Deck · Субдокументы · Финансовая модель</div></div>
                  <span style={{fontSize:13,fontWeight:700,color:canSub?T.green:T.red}}>{reqIds.filter(id=>docs[id]).length}/{reqIds.length}</span>
                </div>
                <div style={{padding:16}}>
                  <DropZone id="pitch" doc={pitchDoc} val={docs.pitch} onUp={upDoc} lang={lang} t={t} onAsk={openAI}/>
                  <div style={{marginTop:14}}>
                    <div style={{fontSize:10,fontWeight:700,color:T.textSubtle,letterSpacing:'.12em',textTransform:'uppercase',textAlign:'center',padding:'7px 0',borderBottom:`1px solid ${T.borderLight}`,marginBottom:2}}>{t.subdocLabel}</div>
                    {['mkt','tech','unit','founders','cap','val'].map(id=>(
                      <SlotRow key={id} id={id} doc={SD[id]} val={docs[id]} status={gs(SD[id])} onUp={upDoc} lang={lang} t={t} onAsk={openAI}/>
                    ))}
                  </div>
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.borderLight}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
                      {t.finModel}<span style={{fontSize:10,color:T.green,background:T.greenBg,border:`1px solid ${T.greenBorder}`,padding:'1px 8px',borderRadius:5,fontWeight:700}}>Excel</span>
                    </div>
                    <SlotRow id="fin" doc={SD.fin} val={docs.fin} status={gs(SD.fin)} onUp={upDoc} lang={lang} t={t} onAsk={openAI}/>
                  </div>
                </div>
              </div>

              {/* Product Demo */}
              <div style={{background:T.surface,borderRadius:16,border:`1.5px solid ${T.purpleBorder}`,overflow:'hidden',marginBottom:14}}>
                <div style={{padding:'12px 18px',background:`linear-gradient(135deg,${T.purpleBg},#fdf8ff)`,borderBottom:`1px solid ${T.purpleBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><div style={{fontSize:11,fontWeight:700,color:T.purple,letterSpacing:'.1em',marginBottom:2}}>{t.productDemo}</div><div style={{fontSize:11,color:T.textSubtle}}>{t.productDemoSub}</div></div>
                  <div style={{width:30,height:30,borderRadius:9,background:T.purpleBg,border:`1px solid ${T.purpleBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}><IVideo sz={14} col={T.purple}/></div>
                </div>
                <div style={{padding:16}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                    <div style={{border:`1.5px solid ${T.accentBorder}`,borderRadius:12,overflow:'hidden'}}>
                      <div style={{padding:'9px 13px',background:T.accentBg,borderBottom:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:12,fontWeight:700,color:T.accent}}>{t.accessLabel}</span>
                        {sk==='seed'&&<span style={{fontSize:10,color:T.accent,background:'#fff',border:`1px solid ${T.accentBorder}`,padding:'1px 7px',borderRadius:5,marginLeft:'auto'}}>{t.accessSub}</span>}
                      </div>
                      <div style={{padding:11,display:'flex',flexDirection:'column',gap:8}}>
                        <input style={{...inp,fontSize:12}} placeholder="URL продукта" onChange={e=>upDoc('prod_url',e.target.value)}/>
                        <input style={{...inp,fontSize:12}} placeholder={lang==='ru'?'Логин / Email':'Login / Email'} onChange={e=>upDoc('prod_login',e.target.value)}/>
                        <input style={{...inp,fontSize:12}} type="password" placeholder={lang==='ru'?'Пароль':'Password'} onChange={e=>upDoc('prod_pass',e.target.value)}/>
                        <p style={{fontSize:10,color:T.textSubtle,margin:0}}>⚠ {lang==='ru'?'Credentials удаляются после анализа':'Credentials deleted after analysis'}</p>
                      </div>
                    </div>
                    <div style={{border:`1.5px solid ${T.purpleBorder}`,borderRadius:12,overflow:'hidden'}}>
                      <div style={{padding:'9px 13px',background:T.purpleBg,borderBottom:`1px solid ${T.purpleBorder}`,display:'flex',alignItems:'center',gap:6}}>
                        <IVideo sz={13} col={T.purple}/>
                        <span style={{fontSize:12,fontWeight:700,color:T.purple}}>{t.videoLabel}</span>
                        <span style={{fontSize:10,color:T.purple,background:'#fff',border:`1px solid ${T.purpleBorder}`,padding:'1px 7px',borderRadius:5,marginLeft:'auto'}}>{t.videoSub}</span>
                      </div>
                      <div style={{padding:11}}>
                        {docs.video?(
                          <div style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',background:T.greenBg,borderRadius:9,border:`1px solid ${T.greenBorder}`}}>
                            <ICheck sz={13}/><span style={{fontSize:12,color:T.green,fontWeight:600,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{docs.video}</span>
                            <label style={{fontSize:11,color:T.textMuted,cursor:'pointer'}}>{t.replace}<input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)upDoc('video',f.name)}}/></label>
                          </div>
                        ):(
                          <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:7,height:82,border:`2px dashed ${T.purpleBorder}`,borderRadius:10,cursor:'pointer',background:'#fdf8ff'}}>
                            <IUpload sz={18} col={T.purple}/>
                            <span style={{fontSize:11,color:T.purple,textAlign:'center'}}>{lang==='ru'?'Видео — перетащите':'Video — drag or click'}</span>
                            <input type="file" accept="video/*" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)upDoc('video',f.name)}}/>
                          </label>
                        )}
                        <DocInfo doc={videoDoc} lang={lang} t={t} onAsk={openAI}/>
                      </div>
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{...lbl}}>{t.publicLink} <span style={{fontSize:10,color:T.textSubtle,background:'#F5F5F7',padding:'1px 7px',borderRadius:4,fontWeight:500,textTransform:'lowercase',letterSpacing:0}}>{t.publicLinkSub}</span></label>
                    <input style={{...inp,borderColor:pubUrl?T.green:T.border}} value={pubUrl} onChange={e=>{setPubUrl(e.target.value);upDoc('public_url',e.target.value);}} placeholder="https://app.yourproduct.kz"/>
                  </div>
                  <SlotRow id="rounds" doc={roundsDoc} val={docs.rounds} status="optional" onUp={upDoc} lang={lang} t={t} onAsk={openAI} firstRound={fr} onFR={()=>setFr(v=>!v)}/>
                </div>
              </div>

              {/* Legal */}
              <div style={{background:T.surface,borderRadius:16,border:`1.5px solid ${T.greenBorder}`,overflow:'hidden',marginBottom:14}}>
                <div style={{padding:'12px 18px',background:`linear-gradient(135deg,${T.greenBg},#f0fff4)`,borderBottom:`1px solid ${T.greenBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:'.1em',marginBottom:2}}>{t.legalPack}</div><div style={{fontSize:11,color:T.textSubtle}}>{t.legalPackSub}</div></div>
                  <div style={{width:30,height:30,borderRadius:9,background:T.greenBg,border:`1px solid ${T.greenBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}><IShield sz={14} col={T.green}/></div>
                </div>
                <div style={{padding:'8px 16px 14px'}}>
                  {LEGAL.map((item,idx)=>{
                    const label2=lang==='ru'?item.labelRu:item.labelEn;
                    const filled2=Boolean(docs[item.id]);
                    return(
                      <div key={item.id} style={{borderTop:idx>0?`1px solid ${T.borderLight}`:'none',padding:'11px 0'}}>
                        <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                          <div style={{width:26,height:26,borderRadius:8,background:filled2?T.greenBg:'#F5F5F7',border:`1px solid ${filled2?T.greenBorder:T.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                            {filled2?<ICheck sz={12}/>:item.id==='ip'?<IKey sz={12}/>:<IShield sz={12} col={T.textSubtle}/>}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                              <span style={{fontSize:13,fontWeight:600,color:T.text}}>{label2}</span>
                              <span style={{fontSize:10,color:T.textSubtle,background:'#F3F1EC',padding:'1px 6px',borderRadius:4}}>{t.optional}</span>
                            </div>
                            {docs[item.id]&&<div style={{fontSize:11,color:T.textSubtle,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3}}>{docs[item.id]}</div>}
                            <DocInfo doc={item} lang={lang} t={t} onAsk={openAI}/>
                          </div>
                          <div style={{flexShrink:0}}>
                            <label style={{fontSize:11,padding:'6px 12px',borderRadius:9,background:filled2?'#fff':T.green,color:filled2?T.textMuted:'#fff',cursor:'pointer',fontWeight:700,fontFamily:'inherit',border:`1.5px solid ${filled2?T.border:T.green}`,display:'block',transition:'all .15s',whiteSpace:'nowrap'}}
                              onMouseOver={e=>e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.12)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
                              {filled2?t.replace:t.upload}<input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)upDoc(item.id,f.name)}}/>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div style={{borderRadius:16,border:`2px solid ${canSub?T.accent:T.border}`,background:canSub?T.accentBg:'#F5F5F7',padding:'18px 22px',textAlign:'center'}}>
                <button onClick={canSub?()=>alert(lang==='ru'?'Заявка отправлена! Ожидайте письмо на почту.':'Application submitted! Check your email.'):undefined}
                  style={{display:'inline-flex',alignItems:'center',gap:10,padding:'13px 32px',borderRadius:12,background:canSub?`linear-gradient(135deg,${T.accent},#6366f1)`:'#D1D5DB',border:'none',color:'#fff',fontSize:14,fontWeight:700,cursor:canSub?'pointer':'not-allowed',fontFamily:'inherit',boxShadow:canSub?'0 6px 20px rgba(29,107,252,.4)':'none',transition:'all .2s'}}
                  onMouseOver={e=>{if(canSub){e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(29,107,252,.5)';}}}
                  onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=canSub?'0 6px 20px rgba(29,107,252,.4)':'none';}}>
                  <IRocket sz={17}/>{t.submitBtn}
                </button>
                <div style={{fontSize:12,color:T.textSubtle,marginTop:8}}>{t.submitSub}</div>
                {!canSub&&<div style={{fontSize:11,color:T.red,marginTop:6}}>{lang==='ru'?blocked?'Устраните ошибки Gate Check':'Загрузите все обязательные документы':blocked?'Fix Gate Check errors':'Upload all required documents'}</div>}
              </div>
              <div style={{textAlign:'center',marginTop:10}}>
                <button onClick={()=>setPanel('A')} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:T.accent,fontFamily:'inherit',fontWeight:600}}>{t.switchToA}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI float button */}
      <button onClick={()=>openAI(null)}
        style={{position:'fixed',bottom:28,right:28,width:56,height:56,borderRadius:'50%',background:`linear-gradient(135deg,${T.accent},#6366f1)`,border:'none',cursor:'pointer',boxShadow:'0 6px 24px rgba(29,107,252,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:500,transition:'transform .18s,box-shadow .18s'}}
        onMouseOver={e=>{e.currentTarget.style.transform='scale(1.1)';e.currentTarget.style.boxShadow='0 10px 36px rgba(29,107,252,.6)';}}
        onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 6px 24px rgba(29,107,252,.5)';}}>
        <IChat sz={24}/>
      </button>

      {showAI&&<AIChatPanel lang={lang} onClose={()=>setShowAI(false)} extMsg={aiMsg} extKey={aiKey} ctx={ctx}/>}
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState(SC.HOME);
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif',background:'#fff',minHeight:'100vh',WebkitFontSmoothing:'antialiased'}}>
      {screen===SC.HOME&&<Home go={s=>setScreen(s)}/>}
      {screen===SC.FORM&&<Form go={s=>setScreen(s)}/>}
    </div>
  );
}