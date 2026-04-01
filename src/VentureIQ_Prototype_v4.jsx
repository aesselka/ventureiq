import { useState, useRef, useEffect, useCallback } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

// ── Icons ──────────────────────────────────────────────────────────────────
const ICheck   = ({sz=14,col="#16a34a"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IWarn    = ({sz=14,col="#d97706"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IXc      = ({sz=14,col="#dc2626"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const ISend    = ({sz=14,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IDown    = ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
const IUp      = ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>;
const IArrow   = ({sz=14,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IZap     = ({sz=14,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IChat    = ({sz=14,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IDl      = ({sz=12,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IInfo    = ({sz=13,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const IFile    = ({sz=14,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IPlus    = ({sz=13,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IX       = ({sz=13}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IGlobe   = ({sz=14,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const ISave    = ({sz=13,col="#16a34a"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IClock   = ({sz=13,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IEye     = ({sz=13,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const ILinkedIn= ({sz=13}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="#0077b5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const IUser    = ({sz=13,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IVideo   = ({sz=13,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const IKey     = ({sz=13,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const IUpload  = ({sz=22,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>;
const IStop    = ({sz=14,col="#dc2626"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;

// ── Constants ──────────────────────────────────────────────────────────────
const SC = { HOME:'home', FORM:'form', PROC:'proc', DASH:'dash', STATUS:'status', ACCT:'acct', TMPL:'tmpl', PORT:'port' };
const CA_RU = ['Казахстан','Узбекистан','Кыргызстан','Таджикистан','Туркменистан'];
const CA_EN = ['Kazakhstan','Uzbekistan','Kyrgyzstan','Tajikistan','Turkmenistan'];
const sc   = s => s>=7?'#16a34a':s>=5?'#d97706':'#dc2626';
const scBg = s => s>=7?'#f0fdf4':s>=5?'#fffbeb':'#fef2f2';
const AIDS = ['cmo','clo','cfo','cpo','cro','chro'];

const FORBIDDEN_KW = ['crypto','blockchain','web3','nft','gambling','casino','казино','betting','deep-tech','deeptech','биоинформатика','геномика'];

const COUNTRIES_RU = ['Казахстан','Узбекистан','Кыргызстан','Таджикистан','Туркменистан','Россия','США','Другая'];
const COUNTRIES_EN = ['Kazakhstan','Uzbekistan','Kyrgyzstan','Tajikistan','Turkmenistan','Russia','USA','Other'];
const ROLES_RU = ['CEO','CTO','CPO','CMO','CFO','COO','CSO','Другая'];
const ROLES_EN = ['CEO','CTO','CPO','CMO','CFO','COO','CSO','Other'];
const LINK_TYPES_RU = ['LinkedIn','Сайт','Instagram','Telegram','Twitter/X','Другое'];
const LINK_TYPES_EN = ['LinkedIn','Website','Instagram','Telegram','Twitter/X','Other'];
const LINK_PLACEHOLDERS = {
  'LinkedIn':'linkedin.com/in/username','Сайт':'example.com','Website':'example.com',
  'Instagram':'instagram.com/username','Telegram':'t.me/username',
  'Twitter/X':'twitter.com/username','Другое':'https://','Other':'https://',
};

const ACTIVITIES_RU = [
  'SaaS / B2B-платформа','Маркетплейс','Мобильное приложение','Fintech / Payments','Edtech',
  'Logistics Tech / Supply Chain','HR Tech / Recruitment','Legal Tech','E-commerce / Retail Tech',
  'PropTech','Agritech','Mediatech / Content','Adtech / Marketing Tech','CRM / ERP',
  'Analytics / BI','Dev Tools / API','Cybersecurity (без R&D)','IoT Platform (без R&D)',
];
const ACTIVITIES_EN = [
  'SaaS / B2B Platform','Marketplace','Mobile App','Fintech / Payments','Edtech',
  'Logistics Tech / Supply Chain','HR Tech / Recruitment','Legal Tech','E-commerce / Retail Tech',
  'PropTech','Agritech','Mediatech / Content','Adtech / Marketing Tech','CRM / ERP',
  'Analytics / BI','Dev Tools / API','Cybersecurity (no R&D)','IoT Platform (no R&D)',
];

const ACTIVITY_RULES = [
  { key:'SaaS / B2B-платформа',          kw:['saas','b2b','подписк','платформ','mrr','arr','api','лицензи','subscription'] },
  { key:'Маркетплейс',                   kw:['маркетплейс','marketplace','продав','покупател','транзакц','комисси','листинг'] },
  { key:'Мобильное приложение',          kw:['мобил','приложен','app','ios','android','пользовател','dau','mau'] },
  { key:'Fintech / Payments',            kw:['fintech','финтех','платёж','payment','транзакц','банк','кошелёк','эквайр'] },
  { key:'Edtech',                        kw:['edtech','образован','обучен','курс','студент','учащ','школ','learning'] },
  { key:'Logistics Tech / Supply Chain', kw:['логистик','доставк','груз','склад','маршрут','перевозк','tms','wms'] },
  { key:'HR Tech / Recruitment',         kw:['hr','рекрутинг','найм','сотрудник','персонал','кандидат','recruitment'] },
  { key:'Legal Tech',                    kw:['юридич','legal','договор','право','документ','нотариус','compliance'] },
  { key:'E-commerce / Retail Tech',      kw:['ecommerce','e-commerce','интернет-магазин','ритейл','розниц','товар','корзин'] },
  { key:'PropTech',                      kw:['недвижим','proptech','аренд','жильё','ипотек','объект','риелтор'] },
  { key:'Agritech',                      kw:['агро','сельск','agri','ферм','урожай','посев','животновод'] },
  { key:'Mediatech / Content',           kw:['медиа','контент','media','видео','подкаст','стриминг','creator'] },
  { key:'Adtech / Marketing Tech',       kw:['реклам','adtech','маркетинг','таргетинг','attribution'] },
  { key:'CRM / ERP',                     kw:['crm','erp','автоматизац','бизнес-процес','pipeline','воронк'] },
  { key:'Analytics / BI',               kw:['аналитик','bi','dashboard','данные','data','отчёт','метрик','insight'] },
  { key:'Dev Tools / API',              kw:['dev','api','разработчик','инструмент','sdk','cli','developer'] },
  { key:'Cybersecurity (без R&D)',       kw:['безопасност','cyber','угроз','защит','уязвимост','пентест','soc'] },
  { key:'IoT Platform (без R&D)',        kw:['iot','устройств','датчик','sensor','умный','smart'] },
];

function checkDescVsActivity(desc, activityRu, lang) {
  if (!desc || desc.trim().length < 20 || !activityRu) return null;
  const rule = ACTIVITY_RULES.find(r => r.key === activityRu);
  if (!rule) return null;
  const matched = rule.kw.filter(k => desc.toLowerCase().includes(k));
  if (matched.length === 0) return {
    type:'mismatch',
    msg: lang==='ru'
      ? `Описание не соответствует типу «${activityRu}». Упомяните ключевые аспекты (например: ${rule.kw.slice(0,3).join(', ')}) — или выберите другой вид деятельности.`
      : `Description doesn't match "${activityRu}". Mention key aspects (e.g. ${rule.kw.slice(0,3).join(', ')}) — or select a different type.`,
  };
  return null;
}

// ── 4-column doc info ──────────────────────────────────────────────────────
const DOC_INFO = {
  pitch:{ what:'Презентация стартапа 10–20 слайдов: проблема, решение, рынок, бизнес-модель, трекшн, команда.',how:'Максимум 4 строки на слайде. Два варианта: "send deck" (самодостаточный) и "talk deck" (для презентации).',why:'Первый документ для всех 6 агентов — задаёт понимание рынка и стратегии.',example:{text:'Шаблон Sequoia Capital',url:'https://www.sequoiacap.com'} },
  fin:{   what:'Excel с P&L, cash flow, прогнозами 3–5 лет, unit-экономикой, burn rate и runway по месяцам.',how:'Детально на 12–18 мес. Три сценария: базовый, оптимистичный, консервативный. Формулы — не хард-код.',why:'Ключевой документ CFO — арифметика, реалистичность допущений.',example:{text:'Шаблон YC Financial Model',url:'https://www.ycombinator.com'} },
  mkt:{   what:'Расчёт объёма рынка: TAM (весь рынок), SAM (достижимый), SOM (реально занимаемая доля).',how:'Два метода: top-down и bottom-up. Указывайте источники данных.',why:'CMO+CCO верифицирует через CB Insights, Statista, Gartner. Без источников — красный флаг.',example:{text:'Airbnb TAM пример (bottom-up)',url:null} },
  tech:{  what:'Описание стека и архитектуры: frontend, backend, БД, инфраструктура.',how:'1–2 страницы. Стек, архитектурная схема, обоснование выборов, техдолг.',why:'CPO+CTO оценивает масштабируемость до 10×.',example:{text:'Свободная форма — 1 страница',url:null} },
  unit:{  what:'CAC, LTV, payback period, gross margin по сегментам и каналам.',how:'CAC = маркетинг / новые клиенты. LTV = ARPU × срок × margin.',why:'CFO: LTV/CAC > 3× норма, payback < 18 мес.',example:{text:'16 Startup Metrics — a16z',url:'https://a16z.com/16-metrics/'} },
  founders:{what:'CV каждого фаундера: образование, опыт, предыдущие стартапы, LinkedIn.',how:'Роль, зоны ответственности, достижения с цифрами, история проектов.',why:'CHRO верифицирует через LinkedIn, Crunchbase. При отсутствии трекшна — главный актив.',example:{text:'LinkedIn + резюме 1–2 страницы',url:null} },
  cap:{   what:'Распределение долей: основатели, инвесторы, ESOP с историей. Тип акций, вестинг.',how:'Таблица: акционер → тип → % → дата. Включите все SAFE и конвертируемые займы.',why:'CFO и CLO: dilution инвестора. Непрозрачный Cap Table — красный флаг.',example:{text:'Шаблон Carta Cap Table',url:'https://carta.com'} },
  val:{   what:'Обоснование pre-money valuation с методологией: revenue multiple, scorecard, DCF.',how:'Метод + базовые данные + расчёт. Добавьте comparable сделки из Crunchbase.',why:'Если нет — CFO рассчитает тремя методами. Обоснованная оценка ускоряет переговоры.',example:{text:'Свободная форма — 1 страница',url:null} },
  cred:{  what:'URL + логин/пароль тестового аккаунта для прямой оценки CPO+CTO.',how:'Отдельный тестовый аккаунт с ограниченными правами. Тестовые данные.',why:'Агент проходит онбординг, core flow, UX. Credentials уничтожаются после анализа.',example:{text:'Создайте demo@company.com специально',url:null} },
  video:{ what:'Запись экрана walkthrough ключевых функций — 5–15 минут с комментарием.',how:'Запишите через Loom. Покажите: регистрацию, core flow, момент "aha!".',why:'CPO+CTO: UX, функциональность, соответствие стадии.',example:{text:'Запись через loom.com (бесплатно)',url:'https://loom.com'} },
  rounds:{what:'Term sheet, SAFE-соглашения, конвертируемые займы от предыдущих инвесторов.',how:'Загрузите все документы. Если первый раунд — нажмите кнопку "1-й раунд".',why:'CFO и CLO оценивают существующие обязательства и dilution.',example:{text:'Шаблон YC SAFE',url:'https://www.ycombinator.com/documents/'} },
  ip:{    what:'Соглашения о передаче прав на IP от основателей и разработчиков.',how:'Каждый разработчик и основатель подписывает до начала работы.',why:'Без IP Assignment права на код — у физлиц. Критический риск.',example:{text:'Шаблон YC IP Assignment',url:'https://www.ycombinator.com/documents/'} },
  tm:{    what:'Свидетельства на ТЗ, документы на домен, перечень OSS с лицензиями.',how:'WHOIS, реестры (КазПатент, EUIPO), список open-source библиотек.',why:'GPL/AGPL в закрытом продукте = условие замены до закрытия раунда.',example:{text:'FOSSA или Snyk для OSS-аудита',url:null} },
  corp:{  what:'Устав, свидетельство о регистрации, SHA.',how:'Если не зарегистрированы — плановое распределение долей.',why:'CLO верифицирует через корпоративный реестр. Основа для сделки.',example:{text:'Официальные документы компании',url:null} },
  contracts:{what:'Трудовые договоры или договоры подряда с NDA.',how:'Шаблоны или обезличенные копии без ФИО — стандарт Stage 1 Data Room.',why:'Подтверждает легальность команды.',example:{text:'Шаблон обезличенного договора',url:null} },
  tos:{   what:'Условия использования и политика конфиденциальности (публичные документы).',how:'Опубликованы на сайте. Нужны версии для всех юрисдикций.',why:'Нарушения GDPR = регуляторный риск и штрафы.',example:{text:'Termly.io или iubenda',url:null} },
};

const SUBDOCS = [
  { id:'mkt',      labelRu:'Market Sizing (TAM/SAM/SOM)', labelEn:'Market Sizing (TAM/SAM/SOM)', hint:'Расчёт TAM/SAM/SOM с источниками данных. CMO+CCO верифицирует — без источников красный флаг.', hintEn:'TAM/SAM/SOM with data sources. No sources = red flag.', requiredFor:['seed','pre-seed'] },
  { id:'tech',     labelRu:'Technology Overview',          labelEn:'Technology Overview',          hint:'Стек и архитектура. CPO+CTO оценит масштабируемость.',                                           hintEn:'Tech stack and architecture. CPO+CTO will assess scalability.',                        requiredFor:['seed','pre-seed'] },
  { id:'unit',     labelRu:'Unit Economics',               labelEn:'Unit Economics',               hint:'CAC, LTV, payback, gross margin. CFO сравнит с бенчмарками.',                                    hintEn:'CAC, LTV, payback, gross margin. CFO benchmarks.',                                     requiredFor:['seed'], optionalFor:['pre-seed'] },
  { id:'founders', labelRu:'Профили основателей',          labelEn:'Founder Profiles',             hint:'CV каждого фаундера. CHRO верифицирует через LinkedIn.',                                          hintEn:'CV per founder. CHRO verifies via LinkedIn.',                                          requiredFor:['seed','pre-seed'] },
  { id:'cap',      labelRu:'Таблица капитализации (Cap Table)', labelEn:'Cap Table',              hint:'Доли: основатели, инвесторы, ESOP. CFO и CLO оценят dilution.',                                   hintEn:'Shares: founders, investors, ESOP. Dilution assessment.',                              requiredFor:['seed','pre-seed'] },
  { id:'val',      labelRu:'Оценка компании (Pre-money)',  labelEn:'Company Valuation (Pre-money)', hint:'Обоснование оценки с методологией. Если нет — CFO рассчитает.',                                 hintEn:'Valuation with methodology. Without — CFO calculates.',                                requiredFor:['seed'], optionalFor:['pre-seed'] },
];

const CAT3_DOCS = [
  { id:'ip',        labelRu:'IP Assignment Agreements',                 labelEn:'IP Assignment Agreements',         hint:'Передача прав на IP от основателей.',              hintEn:'IP transfer from founders.' },
  { id:'tm',        labelRu:'Товарные знаки, домен и Open Source',      labelEn:'Trademarks, Domain & Open Source', hint:'ТЗ, домен, список OSS с лицензиями.',              hintEn:'TM, domain, OSS list.' },
  { id:'corp',      labelRu:'Учредительные документы',                  labelEn:'Incorporation Documents',          hint:'Устав, свидетельство о регистрации, SHA.',         hintEn:'Articles, registration, SHA.' },
  { id:'contracts', labelRu:'Договоры с сотрудниками и подрядчиками',   labelEn:'Employee & Contractor Agreements', hint:'Обезличенные договоры с NDA.',                     hintEn:'Anonymized contracts with NDA.' },
  { id:'tos',       labelRu:'Terms of Service & Privacy Policy',        labelEn:'Terms of Service & Privacy Policy',hint:'Публичные документы. Нарушения = регуляторный риск.',hintEn:'Public docs. Violations = regulatory risk.' },
];

const STOP_FACTORS = [
  { id:'GATE_CHECK_FAIL',          label:'Gate Check',            desc:'Один из критериев допуска не пройден' },
  { id:'UNREADABLE_CRITICAL_DOCS', label:'Нечитаемые документы',  desc:'Критические документы Кат.1 не распознаются системой' },
];

const VALIDATORS = {
  company: (v,lang) => !v.trim()?(lang==='ru'?'Введите название':'Enter name'):v.trim().length<2?(lang==='ru'?'Слишком короткое':'Too short'):'',
  email:   (v,lang) => !v.trim()?(lang==='ru'?'Введите email':'Enter email'):!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?(lang==='ru'?'Некорректный email':'Invalid email'):'',
  desc:    (v,lang) => !v.trim()?(lang==='ru'?'Введите описание':'Enter description'):v.trim().length<30?`${lang==='ru'?'Минимум 30 символов':'Min 30 chars'} (${v.trim().length})`:'',
  amount:  (v,lang) => v&&!/^[\d\s,.']+$/.test(v)?(lang==='ru'?'Только цифры':'Numbers only'):'',
};

// ── Demo data ──────────────────────────────────────────────────────────────
const D = {
  company:"FastRoute", score:7.4, verdict:"CONDITIONAL",
  hero:"Сильная команда и растущий рынок ЦА — клиентская концентрация требует ковенанта",
  agents:{
    cmo:{name:"CMO+CCO",title:"Chief Marketing & Commercial Officer",w:17,score:7.1,str:["TAM $2.1B верифицирован — CAGR 18%","GTM с CAC-таргетами: direct $340, inbound $210"],fl:[{f:"Customer discovery — только 3 интервью",s:"moderate"}],cond:["20+ CustDev-интервью","Верифицировать CAC за 3 мес."]},
    clo:{name:"CLO",title:"Chief Legal Officer",w:10,score:6.8,str:["IP Assignment у всех основателей","Структура KZ LLC прозрачна"],fl:[{f:"Advisor Agreement на 8% отсутствует",s:"critical"},{f:"ToS не опубликован",s:"minor"}],cond:["Advisor Agreement до закрытия","Опубликовать ToS и Privacy Policy"]},
    cfo:{name:"CFO",title:"Chief Financial Officer",w:14,score:6.2,str:["LTV:CAC = 4.1 — выше медианы","Три сценария, арифметика сходится"],fl:[{f:"1 клиент = 43% выручки",s:"critical"},{f:"MoM 18% без истории",s:"moderate"}],cond:["P&L за 6 мес.","Сценарий MoM 8%"]},
    cpo:{name:"CPO+CTO",title:"Chief Product & Technology Officer",w:18,score:7.5,str:["Retention D30 = 61% > бенчмарка","Архитектура масштабируется до 10×"],fl:[{f:"CI/CD отсутствует",s:"minor"}],cond:["CI/CD за 60 дней"]},
    cro:{name:"CRO",title:"Chief Risk Officer",w:12,score:5.9,str:["Регуляторный риск минимален","Зависимости диверсифицированы"],fl:[{f:"Концентрация 43% — стоп без ковенанта",s:"critical"},{f:"Один cloud без failover",s:"moderate"}],cond:["Ковенант в Term Sheet"]},
    chro:{name:"CHRO",title:"Chief Human Resources Officer",w:22,score:8.1,str:["Серийные фаундеры — 12 лет в ЦА","Все роли покрыты, вестинг 4Y/1Y cliff"],fl:[{f:"CTO совмещает с другим проектом",s:"moderate"}],cond:["CTO full-time — milestone Транша 1"]},
  },
  summary:["FastRoute — B2B SaaS оптимизации логистики для рынка ЦА с подтверждённым PMF. Retention D30 = 61% при медиане B2B SaaS 42%.","Ключевые риски: критическая клиентская концентрация (43%) и отсутствие Advisor Agreement. Pre-money $5.2M выше расчётного диапазона $4.5–5.0M.","Рекомендация: инвестиция при 4 условиях — Advisor Agreement до закрытия, P&L за 6 мес., ковенант в Term Sheet, CTO full-time как milestone Транша 1."],
  q:["Как снизить зависимость от ключевого клиента с 43% до <20% за 12 мес.?","Реальная история MoM роста за 6 месяцев помесячно?","Условия перехода CTO на full-time?","Почему Advisor Agreement не оформлен?","Pipeline замены ключевого клиента?"],
};

const ORCH = {
  'почему':'Score 7.4 сдерживается CRO 5.9 — концентрация одного клиента (43%) без ковенанта. CHRO 8.1 и CPO+CTO 7.5 тянут вверх. При закрытии риска скор вырастет до 7.8–8.1.',
  'риск':'Два критических: (1) один клиент = 43% — уход = кассовый разрыв за 3–4 мес.; (2) Advisor Agreement не оформлен.',
  'условия':'До закрытия: Advisor Agreement + P&L за 6 мес. После: ковенант в Term Sheet. Milestone Транша 1: CTO full-time.',
  'оценк':'По трём методам CFO: $4.3M / $4.7M / $3.9M. Заявленная $5.2M выше. Переговорная позиция — $4.5–5.0M.',
  'default':'Уточните вопрос: по агенту (CFO, CRO...), условиям сделки, оценке или рискам.',
};

const ASSIST_RU = {
  'pre-seed':'На pre-seed обязательны: Pitch Deck + Market Sizing + Technology Overview + Профили основателей + Cap Table + Финансовая модель.',
  'seed':'На seed обязательны все документы Категории 1. Product Demo важен — credentials или видео-демо.',
  'трекш':'Нет Product Demo и раундов — сигнал отсутствия трекшна. Пройдите FAA интервью (7 вопросов) — повысит оценку CHRO.',
  'demo':'Product Demo — три варианта: (1) Credentials (URL+логин+пароль); (2) Видео-демо 5–15 мин через Loom; (3) Ссылка на публичный продукт.',
  'faa':'7 вопросов по 2 путям (есть/нет опыта). Скоринг по 5 осям: агентность, обучаемость, устойчивость, лидерство, специфичность.',
  'pitch':'Pitch Deck — 10–20 слайдов. Нажмите ⓘ рядом с любым субдокументом — объясню подробнее.',
  'default':'Нажмите ⓘ рядом с любым документом — объясню что загружать и зачем.',
};
const ASSIST_EN = {
  'pre-seed':'For pre-seed: Pitch Deck + Market Sizing + Tech Overview + Founder Profiles + Cap Table + Financial Model.',
  'seed':'For seed, all Category 1 docs are required. Product Demo is key — credentials or video walkthrough.',
  'traction':'No Demo and no rounds = traction signal. Take the FAA interview (7 questions) to boost CHRO score.',
  'demo':'Product Demo — 3 options: (1) Credentials (URL+login+password); (2) 5–15 min Loom video; (3) Public product link.',
  'faa':'7 questions in 2 paths. Scored on 5 axes: agency, learnability, resilience, leadership, specificity.',
  'pitch':'Pitch Deck — 10–20 slides. Click ⓘ next to any sub-doc for details.',
  'default':'Click ⓘ next to any document — I will explain what to upload and why.',
};

// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  bg:'#F8F7F4', surface:'#FFFFFF', border:'#E8E6E0', borderLight:'#F0EEE9',
  text:'#1A1714', textMuted:'#7A7470', textSubtle:'#A89F99',
  accent:'#1A4FD6', accentBg:'rgba(26,79,214,0.06)', accentBorder:'rgba(26,79,214,0.2)',
  green:'#0F7B3C', greenBg:'#EDFAF3', greenBorder:'#86EFAC',
  red:'#C72A1C', redBg:'#FEF2F2', redBorder:'#FCA5A5',
  amber:'#B35B00', amberBg:'#FFFBEB', amberBorder:'#FDE68A',
};

const C = {
  card:{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:'1.25rem', boxShadow:'0 1px 4px rgba(26,23,20,0.06)' },
  sm:  { background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:'.75rem 1rem' },
  inp: { width:'100%', padding:'9px 12px', fontSize:13, borderRadius:9, border:`1.5px solid ${T.border}`, background:'#FAFAF8', color:T.text, outline:'none', boxSizing:'border-box', fontFamily:'inherit', lineHeight:1.4 },
  label:{ fontSize:12, color:T.textMuted, marginBottom:4, fontWeight:500 },
  h2:{ fontSize:20, fontWeight:600, color:T.text, margin:0, letterSpacing:'-0.3px' },
  h3:{ fontSize:15, fontWeight:600, color:T.text, margin:0, letterSpacing:'-0.15px' },
  row:(g=8)=>({ display:'flex', alignItems:'center', gap:g }),
  tag:{ fontSize:11, padding:'3px 9px', borderRadius:100, background:'#F3F1EC', color:T.textMuted, fontWeight:500 },
  mut:{ fontSize:13, color:T.textMuted },
};

// ── Language strings ───────────────────────────────────────────────────────
const LANGS = {
  ru:{
    formTitle:'Заявка на рассмотрение', back:'← Назад', blockA:'Базовая информация', blockB:'Загрузка документов',
    founder:'Фаундер', addFounder:'Добавить фаундера', company:'Название компании *', activity:'Вид деятельности *',
    stage:'Стадия проекта *', email:'Email *', desc:'Описание проекта *', amount:'Запрашиваемые инвестиции',
    submit:'✓ Отправить на анализ — запустить 6 агентов параллельно', submitDisabled:'Заполните обязательные документы Категории 1',
    cat1:'Категория 1 — Обязательные', cat1sub:'Pitch Deck с субдокументами · Финансовая модель',
    cat2:'Product Demo', cat3:'Категория 3 — Юридический пакет', cat3note:'Условие закрытия сделки',
    upload:'Загрузить', replace:'Заменить', optional:'если есть', firstRound:'1-й раунд', firstRoundConfirmed:'✓ 1-й раунд',
    gateOk:'Gate Check пройден — все критерии', gateCheck:'Проверить Gate Check →',
    previewTitle:'Предпросмотр файла', savedAt:'Сохранено', restoredBanner:'Черновик восстановлен',
    restoredSub:'Данные восстановлены из автосохранения', dismiss:'Закрыть',
    filledOf:'Заполнено', fields:'полей', ofWord:'из',
    preSeedOption:'Pre-seed — идея / прототип', seedOption:'Seed — MVP + первые клиенты',
    adaptedFor:'Адаптировано под:', assistantTitle:'ИИ-ассистент', assistantSub:'Нажмите ⓘ у любого документа',
    askPlaceholder:'Задайте вопрос...', analysisTime:'Обычно занимает 5–10 минут',
    statusTitle:'Статус заявки', statusSub:'FastRoute · Seed · Logistics Tech',
    statusSteps:['Принято','Обрабатывается','Готово'],
    statusDesc:['Заявка получена и поставлена в очередь.','6 ИИ-агентов параллельно анализируют стартап.','Анализ завершён. Результаты доступны инвестору.'],
    viewReport:'Посмотреть отчёт', country:'Страна', name:'ФИО', role:'Роль',
    linkType:'Тип ссылки', linkUrl:'Ссылка / профиль', subdocsHeader:'Субдокументы к Pitch Deck',
    cat2seed:'Ожидается для Seed', cat2preseed:'Загружайте если есть',
    autosaveHint:'Автосохранение каждые 30 сек', saveNow:'Сохранить сейчас',
    projectSite:'Страница проекта', projectSiteHint:'сайт, App Store, GitHub — при наличии',
    stopFactors:'Стоп-факторы — устраните перед отправкой',
  },
  en:{
    formTitle:'Application for Review', back:'← Back', blockA:'Basic Information', blockB:'Document Upload',
    founder:'Founder', addFounder:'Add founder', company:'Company name *', activity:'Business type *',
    stage:'Project stage *', email:'Email *', desc:'Project description *', amount:'Investment requested',
    submit:'✓ Submit for analysis — launch 6 agents in parallel', submitDisabled:'Fill in mandatory Category 1 documents',
    cat1:'Category 1 — Mandatory', cat1sub:'Pitch Deck with sub-documents · Financial Model',
    cat2:'Product Demo', cat3:'Category 3 — Legal Package', cat3note:'Required for deal closing',
    upload:'Upload', replace:'Replace', optional:'if available', firstRound:'1st round', firstRoundConfirmed:'✓ 1st round',
    gateOk:'Gate Check passed — all criteria', gateCheck:'Run Gate Check →',
    previewTitle:'File Preview', savedAt:'Saved', restoredBanner:'Draft restored',
    restoredSub:'Data restored from autosave', dismiss:'Dismiss',
    filledOf:'Filled', fields:'fields', ofWord:'of',
    preSeedOption:'Pre-seed — idea / prototype', seedOption:'Seed — MVP + first clients',
    adaptedFor:'Adapted for:', assistantTitle:'AI Assistant', assistantSub:'Click ⓘ next to any document',
    askPlaceholder:'Ask a question...', analysisTime:'Usually takes 5–10 minutes',
    statusTitle:'Application Status', statusSub:'FastRoute · Seed · Logistics Tech',
    statusSteps:['Received','Processing','Complete'],
    statusDesc:['Application received and queued.','6 AI agents are analyzing your startup.','Analysis complete. Results available.'],
    viewReport:'View Report', country:'Country', name:'Full Name', role:'Role',
    linkType:'Link type', linkUrl:'Link / profile URL', subdocsHeader:'Pitch Deck sub-documents',
    cat2seed:'Expected for Seed', cat2preseed:'Upload if available',
    autosaveHint:'Autosave every 30 seconds', saveNow:'Save now',
    projectSite:'Project page', projectSiteHint:'website, App Store, GitHub — if available',
    stopFactors:'Stop factors — fix before submitting',
  }
};

// ── Autosave hook ──────────────────────────────────────────────────────────
function useAutosave(data, key='ventureiq_draft_v7') {
  const [lastSaved,setLS]=useState(null);
  const [restored,setRest]=useState(false);
  const loadDraft=useCallback(()=>{try{const r=sessionStorage.getItem(key);if(r){setRest(true);return JSON.parse(r);}}catch{}return null;},[key]);
  useEffect(()=>{const save=()=>{try{sessionStorage.setItem(key,JSON.stringify({...data,_t:Date.now()}));setLS(new Date());}catch{}};const iv=setInterval(save,30000);return()=>clearInterval(iv);},[data,key]);
  const saveNow=useCallback(()=>{try{sessionStorage.setItem(key,JSON.stringify({...data,_t:Date.now()}));setLS(new Date());}catch{}},[data,key]);
  const clearDraft=useCallback(()=>{sessionStorage.removeItem(key);setRest(false);},[key]);
  return{loadDraft,lastSaved,restored,saveNow,clearDraft};
}

// ── useIsMobile ────────────────────────────────────────────────────────────
function useIsMobile(bp=768){
  const [mob,setMob]=useState(()=>typeof window!=='undefined'&&window.innerWidth<bp);
  useEffect(()=>{const h=()=>setMob(window.innerWidth<bp);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[bp]);
  return mob;
}

// ── ValidatedInput ─────────────────────────────────────────────────────────
function ValidatedInput({style,value,onChange,validator,placeholder,disabled,multiline}){
  const [touched,setT]=useState(false);
  const err=touched&&validator?validator(value):'';
  const bc=touched?(err?T.red:T.green):T.border;
  const bg=touched?(err?'#FEF8F7':'#F6FDF9'):'#FAFAF8';
  const base={...C.inp,...style,border:`1.5px solid ${bc}`,background:bg};
  return(
    <div>
      {multiline?<textarea style={{...base,height:72,resize:'vertical',lineHeight:1.5}} value={value} onChange={onChange} onBlur={()=>setT(true)} placeholder={placeholder} disabled={disabled}/>
      :<input style={base} value={value} onChange={onChange} onBlur={()=>setT(true)} placeholder={placeholder} disabled={disabled}/>}
      {touched&&err&&<div style={{display:'flex',alignItems:'center',gap:4,marginTop:4}}><IXc sz={11}/><span style={{fontSize:11,color:T.red}}>{err}</span></div>}
    </div>
  );
}

// ── File Preview Modal ─────────────────────────────────────────────────────
function FilePreviewModal({file,onClose,lang}){
  const t=LANGS[lang];
  if(!file)return null;
  const ext=file.name.split('.').pop().toLowerCase();
  const isImg=['jpg','jpeg','png','gif','webp'].includes(ext);
  const isPDF=ext==='pdf';
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(26,23,20,0.55)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <div style={{background:T.surface,borderRadius:18,padding:'1.5rem',maxWidth:560,width:'92%',boxShadow:'0 32px 64px rgba(0,0,0,0.22)',border:`1px solid ${T.border}`}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <div style={C.row(8)}><IFile sz={16}/><span style={{fontSize:14,fontWeight:600,color:T.text}}>{t.previewTitle}</span></div>
          <button onClick={onClose} style={{background:'#F3F1EC',border:'none',cursor:'pointer',padding:'6px',borderRadius:8,display:'flex'}}><IX sz={14}/></button>
        </div>
        <div style={{background:'#F8F7F4',borderRadius:12,padding:'1rem',marginBottom:'1rem',border:`1px solid ${T.border}`,minHeight:120,display:'flex',alignItems:'center',justifyContent:'center'}}>
          {file.url&&isImg&&<img src={file.url} alt={file.name} style={{maxWidth:'100%',maxHeight:300,borderRadius:8,objectFit:'contain'}}/>}
          {file.url&&isPDF&&<iframe src={file.url} style={{width:'100%',height:300,border:'none',borderRadius:8}} title="PDF"/>}
          {!file.url&&<div style={{textAlign:'center',color:T.textMuted}}><IFile sz={36}/><div style={{marginTop:10,fontSize:13,fontWeight:500}}>{file.name}</div><div style={{fontSize:11,marginTop:4,color:T.textSubtle}}>{(file.size/1024).toFixed(0)} KB · {ext.toUpperCase()}</div></div>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'#F8F7F4',borderRadius:9,border:`1px solid ${T.borderLight}`}}>
          <IFile sz={13}/><span style={{fontSize:12,color:T.textMuted,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</span>
          <span style={{fontSize:11,color:T.textSubtle}}>{(file.size/1024).toFixed(0)} KB</span>
        </div>
      </div>
    </div>
  );
}

// ── FormProgressBar ────────────────────────────────────────────────────────
function FormProgressBar({filled,total,lang}){
  const t=LANGS[lang];
  const pct=Math.round((filled/total)*100);
  const color=pct===100?T.green:pct>=60?T.amber:T.accent;
  return(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:'12px 16px',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={C.row(6)}>
          <span style={{fontSize:12,color:T.textMuted}}>{t.filledOf}</span>
          <span style={{fontSize:13,fontWeight:700,color}}>{filled} {t.ofWord} {total}</span>
          <span style={{fontSize:12,color:T.textMuted}}>{t.fields}</span>
        </div>
        <span style={{fontSize:12,fontFamily:'monospace',fontWeight:700,color,background:color+'18',padding:'2px 8px',borderRadius:6}}>{pct}%</span>
      </div>
      <div style={{height:7,background:'#F0EEE9',borderRadius:4,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:4,transition:'width .5s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
    </div>
  );
}

// ── AutosaveBanner ─────────────────────────────────────────────────────────
function AutosaveBanner({restored,lastSaved,onDismiss,lang,onSaveNow}){
  const t=LANGS[lang];
  const [vis,setVis]=useState(true);
  if(!vis)return null;
  if(restored)return(
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:T.accentBg,borderRadius:10,border:`1px solid ${T.accentBorder}`}}>
      <ISave sz={14} col={T.accent}/>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.accent}}>{t.restoredBanner}</div><div style={{fontSize:11,color:T.accent,opacity:0.7}}>{t.restoredSub}</div></div>
      <button onClick={()=>{onDismiss();setVis(false);}} style={{fontSize:11,color:T.textMuted,background:'white',border:`1px solid ${T.border}`,borderRadius:7,padding:'4px 9px',cursor:'pointer',fontFamily:'inherit'}}>{t.dismiss}</button>
    </div>
  );
  if(lastSaved){
    const ts=lastSaved.toLocaleTimeString(lang==='ru'?'ru-RU':'en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    return(<div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:T.greenBg,borderRadius:10,border:`1px solid ${T.greenBorder}`}}><ISave sz={12} col={T.green}/><span style={{fontSize:11,color:T.green,fontWeight:500}}>{t.savedAt} {ts}</span></div>);
  }
  return(
    <div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'#F8F7F4',borderRadius:10,border:`1px solid ${T.border}`}}>
      <IClock sz={12}/><span style={{fontSize:11,color:T.textMuted}}>{t.autosaveHint}</span>
      <button onClick={onSaveNow} style={{marginLeft:'auto',fontSize:11,color:T.textMuted,background:'white',border:`1px solid ${T.border}`,borderRadius:6,padding:'3px 8px',cursor:'pointer',fontFamily:'inherit'}}>{t.saveNow}</button>
    </div>
  );
}

// ── LangToggle ────────────────────────────────────────────────────────────
function LangToggle({lang,setLang}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:3,background:'#F0EEE9',borderRadius:10,padding:3}}>
      {['ru','en'].map(l=>(
        <button key={l} onClick={()=>setLang(l)} style={{fontSize:12,padding:'5px 12px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'inherit',fontWeight:lang===l?700:500,background:lang===l?'#fff':'transparent',color:lang===l?T.text:T.textSubtle,boxShadow:lang===l?'0 1px 4px rgba(0,0,0,0.1)':'none',transition:'all .15s'}}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ── DocInfoCard — 4-column ─────────────────────────────────────────────────
function DocInfoCard({docId}){
  const info=DOC_INFO[docId];
  if(!info)return null;
  return(
    <div style={{background:'#f8faff',borderRadius:10,border:`1px solid ${T.accentBorder}`,padding:'12px',marginTop:6}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10}}>
        {[
          {label:'Что это?',text:info.what,color:T.accent},
          {label:'Как подготовить?',text:info.how,color:T.green},
          {label:'Зачем инвестору?',text:info.why,color:T.textMuted},
          {label:'Пример / шаблон',text:info.example?.text,url:info.example?.url,color:'#7c3aed'},
        ].map(col=>(
          <div key={col.label}>
            <div style={{fontSize:10,fontWeight:700,color:col.color,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>{col.label}</div>
            <div style={{fontSize:11,color:T.text,lineHeight:1.55}}>
              {col.url?<a href={col.url} target="_blank" rel="noreferrer" style={{color:'#7c3aed',textDecoration:'underline'}}>{col.text}</a>:col.text||<span style={{color:T.textSubtle}}>Свободная форма</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DropZone ───────────────────────────────────────────────────────────────
function DropZone({label,value,fileObj,docId,onUpload,onPreview,lang='ru'}){
  const [drag,setDrag]=useState(false);
  const [showInfo,setShowInfo]=useState(false);
  const t=LANGS[lang];
  const onDrop=useCallback(e=>{
    e.preventDefault();setDrag(false);
    const f=e.dataTransfer.files?.[0];
    if(f)onUpload(docId,f.name,f);
  },[docId,onUpload]);
  return(
    <div>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}
        style={{border:`2px dashed ${drag?T.accent:value?T.green:T.border}`,borderRadius:10,padding:'12px',textAlign:'center',transition:'all .15s',background:drag?T.accentBg:value?T.greenBg:'#FAFAF8'}}>
        {value?(
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <ICheck sz={14}/>
            <span style={{fontSize:13,color:T.green,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:180}}>{value}</span>
            {fileObj&&<button onClick={()=>onPreview(fileObj)} style={{background:'none',border:'none',cursor:'pointer',padding:3,display:'flex',flexShrink:0}}><IEye sz={13}/></button>}
            <label style={{fontSize:11,color:T.textMuted,padding:'3px 8px',border:`1px solid ${T.border}`,borderRadius:6,cursor:'pointer',background:'white',fontFamily:'inherit',whiteSpace:'nowrap',flexShrink:0}}>
              {t.replace}<input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onUpload(docId,f.name,f);}}/>
            </label>
          </div>
        ):(
          <label style={{cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
            <IUpload sz={20} col={drag?T.accent:T.textSubtle}/>
            <span style={{fontSize:12,color:T.textMuted}}><span style={{color:T.accent,fontWeight:600}}>{label}</span> — {lang==='ru'?'перетащите или нажмите':'drag or click'}</span>
            <input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onUpload(docId,f.name,f);}}/>
          </label>
        )}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
        <button onClick={()=>setShowInfo(!showInfo)} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:3,fontSize:11,color:showInfo?T.accent:T.textSubtle,fontFamily:'inherit'}}>
          <IInfo sz={11} col={showInfo?T.accent:T.textSubtle}/>{showInfo?(lang==='ru'?'Скрыть':'Hide'):(lang==='ru'?'Подробнее':'Details')}{showInfo?<IUp sz={10}/>:<IDown sz={10}/>}
        </button>
      </div>
      {showInfo&&<DocInfoCard docId={docId}/>}
    </div>
  );
}

// ── SlotRow ────────────────────────────────────────────────────────────────
function SlotRow({slot,value,fileObj,optional,onUpload,sub=false,firstRound,onFirstRound,onPreview,lang='ru'}){
  const [showInfo,setShowInfo]=useState(false);
  const t=LANGS[lang];
  const filled=Boolean(value)||firstRound;
  const label=lang==='ru'?slot.labelRu:slot.labelEn;
  const hint=lang==='ru'?slot.hint:(slot.hintEn||slot.hint);
  return(
    <div style={{borderTop:`1px solid ${T.borderLight}`,paddingLeft:sub?16:0}}>
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0'}}>
        {sub&&<div style={{width:10,height:1,background:T.border,flexShrink:0}}/>}
        <div style={{flexShrink:0}}>
          {filled?<ICheck sz={13}/>:optional?<span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:13,height:13,borderRadius:'50%',border:`1px solid ${T.border}`,fontSize:9,color:T.textSubtle}}>?</span>:<IXc sz={13}/>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={C.row(5)}>
            <span style={{fontSize:13,fontWeight:sub?400:500,color:T.text}}>{label}</span>
            {optional&&<span style={{fontSize:10,padding:'2px 6px',borderRadius:5,background:'#F3F1EC',color:T.textSubtle}}>{t.optional}</span>}
          </div>
          {value&&!firstRound&&<div style={{fontSize:11,color:T.textSubtle,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{value}</div>}
          {firstRound&&<div style={{fontSize:11,color:T.textMuted,marginTop:1}}>{lang==='ru'?'Первый раунд':'First round'}</div>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
          <button onClick={()=>setShowInfo(!showInfo)} style={{background:'none',border:'none',cursor:'pointer',padding:3,display:'flex',borderRadius:6}} title="ⓘ"><IInfo sz={13} col={showInfo?T.accent:T.textSubtle}/></button>
          {value&&fileObj&&<button onClick={()=>onPreview(fileObj)} style={{background:'none',border:'none',cursor:'pointer',padding:3,display:'flex',borderRadius:6}}><IEye sz={13}/></button>}
          {slot.id==='rounds'&&!value&&(
            <button onClick={onFirstRound} style={{fontSize:11,color:T.textMuted,padding:'3px 8px',border:`1px solid ${T.border}`,borderRadius:7,cursor:'pointer',background:firstRound?T.greenBg:'white',fontFamily:'inherit',whiteSpace:'nowrap',fontWeight:firstRound?600:400}}>
              {firstRound?t.firstRoundConfirmed:t.firstRound}
            </button>
          )}
          <label style={{fontSize:12,color:filled?T.textMuted:T.red,padding:'5px 10px',border:`1.5px solid ${filled?T.border:T.redBorder}`,borderRadius:8,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,background:filled?'#F8F7F4':T.redBg,fontWeight:500}}>
            {filled&&!firstRound?t.replace:t.upload}
            <input type="file" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onUpload(slot.id,f.name,f);}}/>
          </label>
        </div>
      </div>
      {showInfo&&<div style={{paddingBottom:6}}><DocInfoCard docId={slot.id}/><div style={{fontSize:12,color:T.textMuted,lineHeight:1.6,marginTop:6,padding:'8px 12px',background:'#F8F7F4',borderRadius:8}}>{hint}</div></div>}
    </div>
  );
}

// ── FounderBlock ───────────────────────────────────────────────────────────
function FounderBlock({founder,index,lang,onChange,onRemove}){
  const mob=useIsMobile();
  const t=LANGS[lang];
  const roles=lang==='ru'?ROLES_RU:ROLES_EN;
  const countries=lang==='ru'?COUNTRIES_RU:COUNTRIES_EN;
  const linkTypes=lang==='ru'?LINK_TYPES_RU:LINK_TYPES_EN;
  const linkPlaceholder=LINK_PLACEHOLDERS[founder.linkType]||'https://';
  return(
    <div style={{background:'#FAFAF8',borderRadius:11,padding:14,marginBottom:8,border:`1px solid ${T.borderLight}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={C.row(7)}>
          <div style={{width:26,height:26,borderRadius:'50%',background:T.accentBg,border:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}><IUser sz={13} col={T.accent}/></div>
          <span style={{fontSize:13,color:T.textMuted,fontWeight:600}}>{t.founder} {index+1}</span>
        </div>
        {index>0&&<button onClick={onRemove} style={{background:'none',border:'none',cursor:'pointer',padding:3,display:'flex',borderRadius:6}}><IX/></button>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:8,marginBottom:8}}>
        <div>
          <div style={C.label}>{t.name}</div>
          <ValidatedInput value={founder.name} onChange={e=>onChange({name:e.target.value})} validator={v=>!v.trim()?(lang==='ru'?'Введите имя':'Enter name'):''}/>
        </div>
        <div>
          <div style={C.label}>{t.country}</div>
          <select style={C.inp} value={founder.country} onChange={e=>onChange({country:e.target.value})}>
            {countries.map((c,i)=><option key={c} value={COUNTRIES_RU[i]}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:8,marginBottom:8}}>
        <div>
          <div style={C.label}>{t.role}</div>
          <select style={C.inp} value={founder.role||'CEO'} onChange={e=>onChange({role:e.target.value})}>
            {roles.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div style={{...C.label,display:'flex',alignItems:'center',gap:4}}><ILinkedIn sz={11}/>LinkedIn</div>
          <div style={{position:'relative'}}>
            <input style={{...C.inp,paddingLeft:30}} value={founder.linkedin||''} onChange={e=>onChange({linkedin:e.target.value})} placeholder="linkedin.com/in/username"/>
            <div style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><ILinkedIn sz={12}/></div>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'140px 1fr',gap:8}}>
        <div>
          <div style={C.label}>{t.linkType}</div>
          <select style={C.inp} value={founder.linkType||linkTypes[0]} onChange={e=>onChange({linkType:e.target.value})}>
            {linkTypes.map(lt=><option key={lt} value={lt}>{lt}</option>)}
          </select>
        </div>
        <div>
          <div style={{...C.label,display:'flex',alignItems:'center',gap:4}}><IGlobe sz={11}/>{t.linkUrl}</div>
          <div style={{position:'relative'}}>
            <input style={{...C.inp,paddingLeft:30}} value={founder.linkUrl||''} onChange={e=>onChange({linkUrl:e.target.value})} placeholder={linkPlaceholder}/>
            <div style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><IGlobe sz={12}/></div>
          </div>
        </div>
      </div>
      {(founder.linkedin||founder.linkUrl)&&(
        <div style={{marginTop:6,fontSize:11,color:T.textMuted,display:'flex',alignItems:'center',gap:4}}>
          <ICheck sz={10}/>{lang==='ru'?'Агент CHRO верифицирует профиль через этот адрес':'CHRO agent will verify the profile via this link'}
        </div>
      )}
    </div>
  );
}

// ── FAA Dialog ────────────────────────────────────────────────────────────
const FAA_Q = [
  {q:'Был ли у вас опыт запуска собственного стартапа или бизнеса?',key:'hasStartup',type:'yn'},
  {q:'(Есть опыт) Стартап генерировал реальную выручку?',key:'revenue',type:'yn',onlyIf:'yes'},
  {q:'(Есть опыт) Вы привлекали людей в команду без денег / с минимальной оплатой?',key:'recruit',type:'yn',onlyIf:'yes'},
  {q:'(Нет опыта) Есть академические достижения — олимпиады, топ выпускников?',key:'academic',type:'yn',onlyIf:'no'},
  {q:'(Нет опыта) Есть область, в которой вы стали экспертом самостоятельно?',key:'selfExpert',type:'yn',onlyIf:'no'},
  {q:'Расскажите о моменте, когда пришлось убедить людей без формальных полномочий. Что именно вы сделали?',key:'persuade',type:'text'},
  {q:'Что вы думали о себе или своей области год-два назад — и что теперь считаете неверным?',key:'learning',type:'text'},
];
function FAADialog({onClose,onComplete}){
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [textVal,setTV]=useState('');
  const cur=FAA_Q[step];
  const prog=Math.round((step/FAA_Q.length)*100);
  const advance=val=>{
    const nA={...answers,[cur.key]:val};setAnswers(nA);setTV('');
    let next=step+1;
    while(next<FAA_Q.length){const nq=FAA_Q[next];if(!nq.onlyIf||(nq.onlyIf==='yes'&&nA.hasStartup==='yes')||(nq.onlyIf==='no'&&nA.hasStartup==='no'))break;next++;}
    if(next>=FAA_Q.length)onComplete(nA);else setStep(next);
  };
  return(
    <div style={{background:'white',border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:'1rem',boxShadow:'0 4px 16px rgba(0,0,0,.08)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:600,color:T.accent}}>FAA · Интервью с фаундером</span>
        <div style={C.row(8)}><span style={{fontSize:11,color:T.textSubtle}}>{step+1}/{FAA_Q.length}</span><button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',padding:0}}><IX sz={13}/></button></div>
      </div>
      <div style={{height:4,background:'#F0EEE9',borderRadius:2,marginBottom:12}}>
        <div style={{height:'100%',width:`${prog}%`,background:T.accent,borderRadius:2,transition:'width .3s'}}/>
      </div>
      <p style={{fontSize:13,color:T.text,lineHeight:1.6,marginBottom:12}}>{cur?.q}</p>
      {cur?.type==='yn'?(
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>advance('yes')} style={{flex:1,padding:'9px',borderRadius:9,border:`1px solid ${T.accentBorder}`,background:T.accentBg,color:T.accent,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600}}>Да</button>
          <button onClick={()=>advance('no')}  style={{flex:1,padding:'9px',borderRadius:9,border:`1px solid ${T.border}`,background:'#F8F7F4',color:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:13}}>Нет</button>
        </div>
      ):(
        <div>
          <textarea value={textVal} onChange={e=>setTV(e.target.value)} placeholder="Развёрнутый ответ..." style={{...C.inp,height:76,resize:'vertical',lineHeight:1.5}}/>
          <button onClick={()=>advance(textVal)} disabled={textVal.trim().length<10}
            style={{marginTop:8,width:'100%',padding:'9px',borderRadius:9,border:'none',background:textVal.trim().length<10?'#F0EEE9':T.accent,color:textVal.trim().length<10?T.textSubtle:'#fff',cursor:textVal.trim().length<10?'default':'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600}}>
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Chat ───────────────────────────────────────────────────────────────────
function Chat({init,kb,quick=[],height=380,extraMsgs=[]}){
  const [msgs,setM]=useState([{r:'a',t:init}]);
  const [inp,setI]=useState('');
  const [loading,setL]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,loading]);
  useEffect(()=>{if(extraMsgs.length>0)setM(p=>[...p,...extraMsgs.map(t=>({r:'a',t}))]);},[extraMsgs.join('|')]);
  const send=t=>{
    const q=t||inp.trim();if(!q||loading)return;
    setI('');setL(true);setM(p=>[...p,{r:'u',t:q}]);
    const k=Object.keys(kb).find(k=>k!=='default'&&q.toLowerCase().includes(k));
    setTimeout(()=>{setM(p=>[...p,{r:'a',t:kb[k||'default']}]);setL(false);},650);
  };
  return(
    <div style={{display:'flex',flexDirection:'column',height}}>
      <div style={{flex:1,overflowY:'auto',padding:'.75rem',display:'flex',flexDirection:'column',gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.r==='u'?'flex-end':'flex-start'}}>
            <div style={{maxWidth:'92%',padding:'9px 13px',borderRadius:m.r==='u'?'14px 14px 3px 14px':'3px 14px 14px 14px',background:m.r==='u'?T.accentBg:'#F3F1EC',fontSize:13,lineHeight:1.65,color:m.r==='u'?T.accent:T.text,whiteSpace:'pre-wrap',border:m.r==='u'?`1px solid ${T.accentBorder}`:`1px solid ${T.borderLight}`}}>{m.t}</div>
          </div>
        ))}
        {loading&&<div style={{display:'flex',gap:5,padding:'9px 13px',background:'#F3F1EC',borderRadius:'3px 14px 14px 14px',width:'fit-content',border:`1px solid ${T.borderLight}`}}>{[0,1,2].map(i=><span key={i} style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:T.textSubtle,animation:`dp 1.4s ${i*.2}s infinite`}}/>)}</div>}
        <div ref={endRef}/>
      </div>
      {quick.length>0&&<div style={{padding:'0 .75rem .5rem',display:'flex',flexDirection:'column',gap:5}}>{quick.map(q=><button key={q} onClick={()=>send(q)} style={{textAlign:'left',padding:'6px 11px',fontSize:12,color:T.textMuted,background:'#F8F7F4',border:`1px solid ${T.border}`,borderRadius:9,cursor:'pointer',fontFamily:'inherit'}}>{q}</button>)}</div>}
      <div style={{padding:'.75rem',borderTop:`1px solid ${T.borderLight}`,display:'flex',gap:8}}>
        <input style={{...C.inp,flex:1}} placeholder="Задайте вопрос..." value={inp} onChange={e=>setI(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} disabled={loading}/>
        <button onClick={()=>send()} disabled={loading||!inp.trim()} style={{padding:'9px 13px',borderRadius:9,background:T.accentBg,border:`1px solid ${T.accentBorder}`,cursor:'pointer',display:'flex',alignItems:'center',opacity:(loading||!inp.trim())?0.45:1}}><ISend/></button>
      </div>
      <style>{`@keyframes dp{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
    </div>
  );
}

// ── Status Page ────────────────────────────────────────────────────────────
function StatusPage({go,lang='ru'}){
  const t=LANGS[lang];
  const [step,setStep]=useState(1);
  useEffect(()=>{const t1=setTimeout(()=>setStep(2),3500);return()=>clearTimeout(t1);},[]);
  const steps=t.statusSteps,descs=t.statusDesc;
  return(
    <div style={{maxWidth:520,margin:'0 auto',padding:'3.5rem 1.5rem',textAlign:'center',background:T.bg,minHeight:'100vh'}}>
      <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',background:'#F0EEE9',borderRadius:100,marginBottom:16}}>
        <div style={{width:6,height:6,borderRadius:'50%',background:T.accent}}/>
        <span style={{fontSize:11,letterSpacing:'.12em',color:T.textMuted,textTransform:'uppercase',fontWeight:600}}>VentureIQ</span>
      </div>
      <h2 style={{fontSize:26,fontWeight:700,color:T.text,margin:'0 0 .5rem',letterSpacing:'-0.5px'}}>{t.statusTitle}</h2>
      <p style={{fontSize:13,color:T.textMuted,marginBottom:'2.5rem'}}>{t.statusSub}</p>
      <div style={{position:'relative',marginBottom:'2.5rem',padding:'0 1rem'}}>
        <div style={{position:'absolute',top:20,left:'18%',right:'18%',height:2,background:T.border,zIndex:0,borderRadius:2}}/>
        <div style={{position:'absolute',top:20,left:'18%',height:2,width:`${(step/(steps.length-1))*64}%`,background:T.accent,zIndex:1,transition:'width 1s ease',borderRadius:2}}/>
        <div style={{display:'flex',justifyContent:'space-between',position:'relative',zIndex:2}}>
          {steps.map((s,i)=>{const done=i<step,active=i===step;return(
            <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,flex:1}}>
              <div style={{width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:done?T.green:active?T.accent:'#F0EEE9',border:`2px solid ${done?T.green:active?T.accent:T.border}`,transition:'all .5s',boxShadow:active?`0 0 0 5px ${T.accentBg}`:'none'}}>
                {done?<ICheck sz={16} col="#fff"/>:<span style={{fontSize:14,fontWeight:700,color:active?'#fff':T.textSubtle}}>{i+1}</span>}
              </div>
              <div style={{fontSize:12,fontWeight:active||done?600:400,color:done?T.green:active?T.accent:T.textSubtle}}>{s}</div>
            </div>
          );})}
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:'1.25rem',marginBottom:'1.5rem',textAlign:'left',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
        <div style={{fontSize:13,color:T.text,lineHeight:1.75}}>{descs[step]}</div>
        {step===1&&<div style={{display:'flex',alignItems:'center',gap:7,marginTop:12,padding:'9px 13px',background:T.accentBg,borderRadius:9,border:`1px solid ${T.accentBorder}`}}><IClock sz={13} col={T.accent}/><span style={{fontSize:12,color:T.accent,fontWeight:500}}>{t.analysisTime}</span></div>}
      </div>
      {step===2&&<button onClick={()=>go(SC.DASH)} style={{width:'100%',padding:13,borderRadius:11,background:T.greenBg,color:T.green,border:`1.5px solid ${T.greenBorder}`,cursor:'pointer',fontSize:14,fontWeight:600,fontFamily:'inherit'}}>{t.viewReport} →</button>}
      <button onClick={()=>go(SC.HOME)} style={{marginTop:12,background:'none',border:'none',fontSize:12,color:T.textSubtle,cursor:'pointer',fontFamily:'inherit'}}>← {lang==='ru'?'На главную':'Home'}</button>
    </div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────
function Home({go}){
  return(
    <div style={{minHeight:540,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2rem',padding:'3.5rem 1.5rem',background:T.bg}}>
      <div style={{textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 14px',background:'#F0EEE9',borderRadius:100,marginBottom:14,border:`1px solid ${T.border}`}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:T.accent}}/><span style={{fontSize:11,letterSpacing:'.12em',color:T.textMuted,textTransform:'uppercase',fontWeight:600}}>Activat VC</span>
        </div>
        <h1 style={{fontSize:46,fontWeight:800,color:T.text,margin:'0 0 .75rem',letterSpacing:'-1.5px',lineHeight:1.1}}>VentureIQ</h1>
        <p style={{fontSize:14,color:T.textMuted,maxWidth:400,lineHeight:1.75,margin:'0 auto'}}>Автоматизированный due diligence стартапов. 6 ИИ-агентов, Investment Score 1–10.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',width:'100%',maxWidth:540}}>
        {[
          {l:'Фаундерам',s:'Подать заявку — ИИ-ассистент поможет',sc:SC.FORM,col:T.accent,bg:T.accentBg,border:T.accentBorder},
          {l:'Инвесторам',s:'Демо-отчёт с чатом Orchestrator',sc:SC.DASH,col:T.green,bg:T.greenBg,border:T.greenBorder},
          {l:'Бухгалтерия',s:'Сделки к оплате · реестр платежей',sc:SC.ACCT,col:'#7c3aed',bg:'#F5F3FF',border:'#C4B5FD'},
          {l:'Шаблоны',s:'Договоры — 9 слотов (SAFE/Equity/Note)',sc:SC.TMPL,col:T.textMuted,bg:'#F3F1EC',border:T.border},
          {l:'Портфель',s:'Мониторинг KPI портфельных компаний',sc:SC.PORT,col:'#0891b2',bg:'#ECFEFF',border:'#A5F3FC'},
        ].map(x=>(
          <button key={x.sc} onClick={()=>go(x.sc)} style={{...C.card,cursor:'pointer',textAlign:'left',border:`1px solid ${T.border}`,transition:'box-shadow .2s,transform .15s'}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.1)';e.currentTarget.style.transform='translateY(-1px)';}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow=C.card.boxShadow;e.currentTarget.style.transform='none';}}>
            <div style={{width:38,height:38,borderRadius:10,background:x.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,border:`1px solid ${x.border}`}}><IArrow sz={17} col={x.col}/></div>
            <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:4}}>{x.l}</div>
            <p style={{fontSize:13,color:T.textMuted,lineHeight:1.5,marginBottom:12,margin:'0 0 12px'}}>{x.s}</p>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:13,color:x.col,fontWeight:600}}>Открыть <IArrow sz={13} col={x.col}/></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Form ───────────────────────────────────────────────────────────────────
function Form({go}){
  const [lang,setLang]=useState('ru');
  const t=LANGS[lang];
  const isMobile=useIsMobile();

  const [founders,setF]=useState([
    {name:'Алибек Жаксыбеков',country:'Казахстан',role:'CEO',linkedin:'linkedin.com/in/alibek',linkType:'LinkedIn',linkUrl:''},
    {name:'Дмитрий Нестеров',country:'Казахстан',role:'CTO',linkedin:'',linkType:'LinkedIn',linkUrl:''},
  ]);
  const [frm,setFrm]=useState({company:'FastRoute',activity:'Logistics Tech / Supply Chain',stage:'seed',email:'alibek@fastroute.kz',amount:'500 000',currency:'USD',desc:'B2B SaaS для оптимизации грузоперевозок в ЦА. Снижает стоимость логистики на 23%. MRR: $28,000.',projectSite:'fastroute.kz',siteType:'Сайт',publicProductUrl:''});
  const [gateErr,setGE]=useState('');
  const [gateOk,setGO]=useState(true);
  const [descMismatch,setDM]=useState(null);
  const [stopFlags,setSF]=useState([]);

  const [uploads,setU]=useState({pitch:'FastRoute_PitchDeck.pdf',mkt:'MarketSizing_CA_Logistics.pdf',tech:'TechOverview.pdf',unit:'UnitEconomics.xlsx',founders:'FounderProfiles.pdf',cap:'CapTable_2026.pdf',val:'',rounds:'',ip:'',tm:'',corp:'',contracts:'',tos:''});
  const [fileObjs,setFileObjs]=useState({});
  const [firstRound,setFR]=useState(false);
  const [finUpload,setFin]=useState('FastRoute_FinModel_v3.xlsx');
  const [finFileObj,setFinFileObj]=useState(null);
  const [credUrl,setCredUrl]=useState('');
  const [credLogin,setCredLogin]=useState('');
  const [credPass,setCredPass]=useState('');
  const [videoUpload,setVideo]=useState('');
  const [videoFileObj,setVideoFileObj]=useState(null);
  const credFilled=Boolean(credUrl&&credLogin&&credPass);
  const [previewFile,setPreviewFile]=useState(null);

  const [chatMsgs,setCM]=useState([{r:'a',t:"Привет! Помогаю заполнить заявку.\n\nДемо предзаполнено данными FastRoute (стадия Seed). Нажмите ⓘ рядом с любым документом — раскроется 4-колоночная карточка: что загрузить, как подготовить, зачем инвестору."}]);
  const [chatInp,setCI]=useState('');
  const [chatLoad,setCL]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [proactiveSent,setPS]=useState(false);
  const [showFAA,setShowFAA]=useState(false);
  const [faaScore,setFAAScore]=useState(null);
  const chatEndRef=useRef(null);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:'smooth'});},[chatMsgs,chatLoad,showFAA]);

  const stage=frm.stage;
  const isSeed=stage==='seed';
  const ASSIST=lang==='ru'?ASSIST_RU:ASSIST_EN;

  const formSnapshot={founders,frm,uploads,firstRound,finUpload,credUrl,credLogin,videoUpload};
  const {loadDraft,lastSaved,restored,saveNow,clearDraft}=useAutosave(formSnapshot);

  useEffect(()=>{
    const draft=loadDraft();
    if(draft&&draft.frm){setFrm(draft.frm);if(draft.founders)setF(draft.founders);if(draft.uploads)setU(draft.uploads);if(draft.firstRound!==undefined)setFR(draft.firstRound);if(draft.finUpload)setFin(draft.finUpload);if(draft.credUrl)setCredUrl(draft.credUrl);if(draft.credLogin)setCredLogin(draft.credLogin);if(draft.videoUpload)setVideo(draft.videoUpload);}
  },[]);

  useEffect(()=>{
    if(!proactiveSent&&uploads.founders&&!videoUpload&&!credFilled&&!firstRound&&!uploads.rounds){
      setTimeout(()=>{
        const msg=lang==='ru'?"Вижу профили основателей загружены, но нет Product Demo и документов о предыдущих раундах — сигнал отсутствия трекшна.\n\nРекомендую пройти FAA интервью (7 вопросов, ~5 мин) — агент CHRO учтёт фаундерский профиль и это повысит итоговый балл.":"Founder profiles uploaded, but no Product Demo or previous round documents — signals limited traction.\n\nTake the FAA interview (7 questions, ~5 min) — CHRO agent will factor in founder profile and boost the final score.";
        setCM(p=>[...p,{r:'a',t:msg}]);setPS(true);
      },1200);
    }
  },[uploads.founders,videoUpload,credFilled,firstRound,uploads.rounds]);

  useEffect(()=>{setDM(checkDescVsActivity(frm.desc,frm.activity,lang));},[frm.desc,frm.activity,lang]);

  const sendChat=text=>{
    const q=text||chatInp.trim();if(!q||chatLoad)return;
    setCI('');setCL(true);setCM(p=>[...p,{r:'u',t:q}]);
    const l=q.toLowerCase();
    const k=Object.keys(ASSIST).find(k=>k!=='default'&&l.includes(k));
    setTimeout(()=>{setCM(p=>[...p,{r:'a',t:ASSIST[k||'default']}]);setCL(false);},650);
  };

  const setUpload=(id,name,fileObj)=>{
    setU(p=>({...p,[id]:name}));
    if(fileObj){const url=URL.createObjectURL(fileObj);setFileObjs(p=>({...p,[id]:{name,size:fileObj.size,url}}));}
  };

  const isRequired=slot=>slot.requiredFor?.includes(stage);
  const isOptional=slot=>slot.optionalFor?.includes(stage)&&!slot.requiredFor?.includes(stage);
  const mandatorySubdocs=SUBDOCS.filter(s=>isRequired(s));
  const filledMandatory=mandatorySubdocs.filter(s=>uploads[s.id]).length;
  const pitchFilled=Boolean(uploads.pitch);
  const canSubmit=pitchFilled&&Boolean(finUpload)&&mandatorySubdocs.every(s=>uploads[s.id])&&descMismatch?.type!=='blocked'&&stopFlags.length===0;

  const checkGate=()=>{
    const hasCA=founders.some(f=>[...CA_RU,...CA_EN].includes(f.country));
    const stOk=['pre-seed','preseed','seed'].includes(frm.stage.toLowerCase().replace(/[\s-]/g,''));
    if(!stOk)return setGE(lang==='ru'?'Платформа принимает только pre-seed и seed.':'Platform accepts pre-seed and seed only.');
    if(!hasCA)return setGE(lang==='ru'?'Хотя бы 1 фаундер должен быть из ЦА.':'At least 1 founder must be from Central Asia.');
    if(!frm.company||!frm.desc||!frm.email||!frm.activity)return setGE(lang==='ru'?'Заполните все обязательные поля.':'Fill in all required fields.');
    const combined=(frm.desc+' '+frm.activity).toLowerCase();
    const found=FORBIDDEN_KW.find(kw=>combined.includes(kw));
    if(found)return setGE(lang==='ru'?`Индустрия не допускается: обнаружен признак deep-tech / crypto / gambling (слово: "${found}").`:`Industry not allowed: detected deep-tech / crypto / gambling (word: "${found}").`);
    setGE('');setGO(true);
  };

  const VALID_EXTS=['.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.txt','.csv','.jpg','.jpeg','.png'];
  const isReadable=name=>VALID_EXTS.some(ext=>name?.toLowerCase().endsWith(ext));
  const mandatoryUploads=[uploads.pitch,finUpload,...mandatorySubdocs.map(s=>uploads[s.id])].filter(Boolean);
  const allUnreadable=mandatoryUploads.length>0&&mandatoryUploads.every(n=>!isReadable(n));

  const runPreflight=()=>{
    const flags=[];
    if(!gateOk)flags.push('GATE_CHECK_FAIL');
    if(allUnreadable)flags.push('UNREADABLE_CRITICAL_DOCS');
    setSF(flags);
    if(flags.length===0){clearDraft();go(SC.PROC,{noTraction:!videoUpload&&!credFilled&&!firstRound&&!uploads.rounds,stage:frm.stage});}
    else setCM(p=>[...p,{r:'a',t:`⚠️ ${t.stopFactors}:\n${flags.map(id=>STOP_FACTORS.find(s=>s.id===id)?.label+' — '+STOP_FACTORS.find(s=>s.id===id)?.desc).join('\n')}`}]);
  };

  const faaComplete=answers=>{
    setShowFAA(false);
    let score=0;
    if(answers.hasStartup==='yes')score+=2;if(answers.revenue==='yes')score+=1.5;if(answers.recruit==='yes')score+=1;
    if(answers.academic==='yes')score+=1;if(answers.selfExpert==='yes')score+=1;
    if((answers.persuade||'').length>120)score+=1.5;if((answers.learning||'').length>100)score+=1;
    const verdict=score>=5?'high':score>=3?'medium':'low';
    setFAAScore(score);
    setCM(p=>[...p,{r:'a',t:`✓ Интервью FAA завершено!\n\nРезультат: ${verdict==='high'?'высокий потенциал фаундера':verdict==='medium'?'средний потенциал':'требует доработки'} (${score.toFixed(1)}/10).\n\nСигнал передан агенту CHRO — частично компенсирует отсутствие трекшна.`}]);
  };

  // Progress
  const TOTAL_FIELDS=5+founders.length*4;
  const filledFields=[frm.company.trim()?1:0,frm.activity?1:0,frm.stage?1:0,frm.email.trim()?1:0,frm.desc.trim()?1:0,...founders.flatMap(f=>[f.name.trim()?1:0,f.country?1:0,f.role?1:0,f.linkedin?.trim()?1:0])].reduce((a,b)=>a+b,0);
  const activities=lang==='ru'?ACTIVITIES_RU:ACTIVITIES_EN;

  // Chat messages shared between desktop & mobile
  const chatQuick=lang==='ru'?['Что важно для pre-seed?','Что такое FAA?','Как загрузить Demo?']:['What matters for pre-seed?','What is FAA?','How to upload Demo?'];
  const renderChatMsgs=()=>(
    <>
      {chatMsgs.map((m,i)=>(
        <div key={i} style={{display:'flex',justifyContent:m.r==='u'?'flex-end':'flex-start'}}>
          <div style={{maxWidth:'92%',padding:'9px 13px',borderRadius:m.r==='u'?'14px 14px 3px 14px':'3px 14px 14px 14px',background:m.r==='u'?T.accentBg:'#F3F1EC',fontSize:13,lineHeight:1.65,color:m.r==='u'?T.accent:T.text,whiteSpace:'pre-wrap',border:m.r==='u'?`1px solid ${T.accentBorder}`:`1px solid ${T.borderLight}`}}>{m.t}</div>
        </div>
      ))}
      {chatLoad&&<div style={{display:'flex',gap:5,padding:'9px 13px',background:'#F3F1EC',borderRadius:'3px 14px 14px 14px',width:'fit-content',border:`1px solid ${T.borderLight}`}}>{[0,1,2].map(i=><span key={i} style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:T.textSubtle,animation:`dp 1.4s ${i*.2}s infinite`}}/>)}</div>}
      {faaScore!==null&&<div style={{padding:'8px 12px',background:T.greenBg,borderRadius:8,border:`1px solid ${T.greenBorder}`,fontSize:12,color:T.green,fontWeight:500}}>✓ FAA завершён · Сигнал передан CHRO</div>}
      <div ref={chatEndRef}/>
    </>
  );
  const renderChatInput=(fontSize=13,paddingBottom='.75rem')=>(
    <div style={{padding:`.75rem .75rem ${paddingBottom}`,borderTop:`1px solid ${T.borderLight}`,display:'flex',gap:8,flexShrink:0}}>
      <input style={{...C.inp,flex:1,fontSize}} placeholder={t.askPlaceholder} value={chatInp} onChange={e=>setCI(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} disabled={chatLoad}/>
      <button onClick={()=>sendChat()} disabled={chatLoad||!chatInp.trim()} style={{padding:'9px 13px',borderRadius:9,background:T.accentBg,border:`1px solid ${T.accentBorder}`,cursor:'pointer',display:'flex',alignItems:'center',opacity:(chatLoad||!chatInp.trim())?0.45:1}}><ISend/></button>
    </div>
  );

  return(
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 300px',gap:'1rem',padding:isMobile?'.75rem .75rem 5rem':'1rem 1rem 2rem',maxWidth:1060,margin:'0 auto',background:T.bg,minHeight:'100vh'}}>
      {previewFile&&<FilePreviewModal file={previewFile} onClose={()=>setPreviewFile(null)} lang={lang}/>}

      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 0'}}>
          <div style={C.row(10)}>
            <button onClick={()=>go(SC.HOME)} style={{fontSize:12,color:T.textMuted,background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,padding:'6px 12px',cursor:'pointer',fontFamily:'inherit',fontWeight:500}}>{t.back}</button>
            <h2 style={C.h2}>{t.formTitle}</h2>
          </div>
          <LangToggle lang={lang} setLang={setLang}/>
        </div>

        <AutosaveBanner restored={restored} lastSaved={lastSaved} onDismiss={clearDraft} lang={lang} onSaveNow={saveNow}/>
        <FormProgressBar filled={filledFields} total={TOTAL_FIELDS} lang={lang}/>

        {/* ── Block A ── */}
        <div style={C.card}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:'1.25rem'}}>
            <div style={{width:26,height:26,borderRadius:'50%',background:T.accentBg,border:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:T.accent,flexShrink:0}}>A</div>
            <span style={C.h3}>{t.blockA}</span>
          </div>

          {founders.map((f,i)=>(
            <FounderBlock key={i} founder={f} index={i} lang={lang}
              onChange={patch=>setF(p=>p.map((x,j)=>j===i?{...x,...patch}:x))}
              onRemove={()=>setF(p=>p.filter((_,j)=>j!==i))}
            />
          ))}

          <button onClick={()=>setF(p=>[...p,{name:'',country:'Казахстан',role:'CEO',linkedin:'',linkType:'LinkedIn',linkUrl:''}])}
            style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:T.accent,background:T.accentBg,border:`1.5px dashed ${T.accentBorder}`,cursor:'pointer',padding:'8px 14px',marginBottom:'1.25rem',fontFamily:'inherit',borderRadius:10,fontWeight:600,width:'100%',justifyContent:'center'}}>
            <IPlus sz={13} col={T.accent}/> {t.addFounder}
          </button>

          <div style={{borderTop:`1px solid ${T.borderLight}`,margin:'0.75rem 0 1.25rem'}}/>

          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
            <div>
              <div style={C.label}>{t.company}</div>
              <ValidatedInput value={frm.company} onChange={e=>setFrm(p=>({...p,company:e.target.value}))} validator={v=>VALIDATORS.company(v,lang)}/>
            </div>
            <div>
              <div style={C.label}>{t.activity}</div>
              <select style={C.inp} value={frm.activity} onChange={e=>setFrm(p=>({...p,activity:e.target.value}))}>
                <option value="">{lang==='ru'?'Выбрать...':'Select...'}</option>
                {activities.map((a,i)=><option key={a} value={ACTIVITIES_RU[i]}>{a}</option>)}
              </select>
              {!frm.activity&&<div style={{display:'flex',alignItems:'center',gap:4,marginTop:4}}><IXc sz={11}/><span style={{fontSize:11,color:T.red}}>{lang==='ru'?'Выберите вид деятельности':'Select business type'}</span></div>}
            </div>
            <div>
              <div style={C.label}>{t.stage}</div>
              <select style={C.inp} value={frm.stage} onChange={e=>setFrm(p=>({...p,stage:e.target.value}))}>
                <option value="pre-seed">{t.preSeedOption}</option>
                <option value="seed">{t.seedOption}</option>
              </select>
            </div>
            <div>
              <div style={C.label}>{t.email}</div>
              <ValidatedInput value={frm.email} onChange={e=>setFrm(p=>({...p,email:e.target.value}))} validator={v=>VALIDATORS.email(v,lang)}/>
            </div>
            <div style={{gridColumn:'1/-1'}}>
              <div style={C.label}>{t.desc}</div>
              <ValidatedInput value={frm.desc} onChange={e=>setFrm(p=>({...p,desc:e.target.value}))} validator={v=>VALIDATORS.desc(v,lang)} multiline/>
              {descMismatch&&(
                <div style={{marginTop:8,padding:'11px 14px',background:T.amberBg,borderRadius:10,borderLeft:`3px solid ${T.amber}`}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                    <IWarn sz={14} col={T.amber}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:T.amber,fontWeight:600,marginBottom:4}}>{lang==='ru'?'⚠️ Описание не соответствует выбранному типу':'⚠️ Description doesn\'t match selected type'}</div>
                      <div style={{fontSize:12,color:T.amber,lineHeight:1.6}}>{descMismatch.msg}</div>
                      <div style={{display:'flex',gap:8,marginTop:10}}>
                        <button onClick={()=>setFrm(p=>({...p,activity:''}))} style={{fontSize:12,padding:'5px 12px',borderRadius:8,border:`1px solid ${T.amberBorder}`,background:'white',color:T.amber,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>
                          {lang==='ru'?'Выбрать другой тип':'Change business type'}
                        </button>
                        <span style={{fontSize:12,color:T.textSubtle,alignSelf:'center'}}>{lang==='ru'?'или уточните описание':'or refine description'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div style={C.label}>{t.projectSite} <span style={{color:T.textSubtle,fontWeight:400}}>({t.projectSiteHint})</span></div>
              <div style={{display:'flex',gap:6}}>
                <select style={{...C.inp,width:110,flexShrink:0}} value={frm.siteType} onChange={e=>setFrm(p=>({...p,siteType:e.target.value}))}>
                  {['Сайт','App Store','Google Play','GitHub','Instagram','Другое'].map(st=><option key={st}>{st}</option>)}
                </select>
                <input style={{...C.inp,flex:1}} placeholder="fastroute.kz" value={frm.projectSite} onChange={e=>setFrm(p=>({...p,projectSite:e.target.value}))}/>
              </div>
              {frm.projectSite&&<div style={{marginTop:4,fontSize:11,color:T.textMuted,display:'flex',alignItems:'center',gap:4}}><ICheck sz={10}/>{lang==='ru'?'CPO+CTO посетит сайт для прямой оценки продукта':'CPO+CTO will visit site for direct product evaluation'}</div>}
            </div>
            <div>
              <div style={C.label}>{t.amount}</div>
              <div style={{display:'flex',gap:6}}>
                <ValidatedInput style={{flex:1}} value={frm.amount} onChange={e=>setFrm(p=>({...p,amount:e.target.value}))} validator={v=>VALIDATORS.amount(v,lang)}/>
                <select style={{...C.inp,width:76}} value={frm.currency} onChange={e=>setFrm(p=>({...p,currency:e.target.value}))}><option>USD</option><option>EUR</option><option>KZT</option></select>
              </div>
            </div>
          </div>

          {gateErr&&<div style={{marginTop:14,padding:'11px 14px',background:T.redBg,borderRadius:10,borderLeft:`3px solid ${T.red}`,display:'flex',alignItems:'center',gap:8}}><IXc sz={14}/><span style={{fontSize:13,color:T.red}}>{gateErr}</span></div>}
          {gateOk&&!gateErr&&<div style={{marginTop:14,padding:'11px 14px',background:T.greenBg,borderRadius:10,borderLeft:`3px solid ${T.green}`,display:'flex',alignItems:'center',gap:8}}><ICheck sz={14}/><span style={{fontSize:13,color:T.green,fontWeight:600}}>{t.gateOk}</span></div>}
          {!gateOk&&!gateErr&&<button onClick={checkGate} style={{marginTop:14,width:'100%',padding:'10px',borderRadius:10,background:T.accentBg,color:T.accent,border:`1px solid ${T.accentBorder}`,cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>{t.gateCheck}</button>}
        </div>

        {/* ── Block B ── */}
        <div style={C.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
            <div style={C.row(9)}>
              <div style={{width:26,height:26,borderRadius:'50%',background:T.redBg,border:`1px solid ${T.redBorder}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:T.red,flexShrink:0}}>B</div>
              <span style={C.h3}>{t.blockB}</span>
            </div>
            <span style={{fontSize:12,color:T.textMuted}}>{t.adaptedFor} <span style={{fontWeight:700,color:T.text}}>{isSeed?'Seed':'Pre-seed'}</span></span>
          </div>

          {/* Cat 1 — Обязательные */}
          <div style={{border:`1.5px solid ${T.redBorder}`,borderRadius:12,padding:'0.875rem',marginBottom:12,background:'#FFFCFC'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
              <div>
                <span style={{fontSize:11,fontWeight:700,color:T.red,textTransform:'uppercase',letterSpacing:'.1em'}}>{t.cat1}</span>
                <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{t.cat1sub}</div>
              </div>
              <div style={C.row(7)}>
                <span style={{fontSize:12,fontFamily:'monospace',color:canSubmit?T.green:T.red,fontWeight:700}}>{(pitchFilled?1:0)+(finUpload?1:0)+filledMandatory}/{2+mandatorySubdocs.length}</span>
                <div style={{width:40,height:5,background:'#F3F1EC',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:`${((pitchFilled?1:0)+(finUpload?1:0)+filledMandatory)/(2+mandatorySubdocs.length)*100}%`,background:canSubmit?T.green:T.red,transition:'width .2s',borderRadius:3}}/></div>
              </div>
            </div>

            {/* Pitch Deck — DropZone */}
            <div style={{borderTop:`1px solid ${T.redBorder}20`,paddingTop:10,marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:6}}>Pitch Deck</div>
              <DropZone label="Pitch Deck" value={uploads.pitch} fileObj={fileObjs.pitch} docId="pitch" onUpload={setUpload} onPreview={setPreviewFile} lang={lang}/>
            </div>

            {/* Subdocuments */}
            <div style={{background:'#FFF8F8',borderRadius:8,border:`1px solid ${T.redBorder}40`,padding:'0 0.75rem',marginBottom:8}}>
              <div style={{fontSize:11,color:T.textSubtle,padding:'6px 0 4px',letterSpacing:'.08em',textTransform:'uppercase',fontWeight:600}}>{t.subdocsHeader}</div>
              {SUBDOCS.map(slot=>{
                const opt=isOptional(slot),req=isRequired(slot);
                if(!req&&!opt)return null;
                return <SlotRow key={slot.id} slot={slot} value={uploads[slot.id]} fileObj={fileObjs[slot.id]} optional={opt} onUpload={setUpload} onPreview={setPreviewFile} sub={true} lang={lang}/>;
              })}
            </div>

            {/* Financial Model — DropZone */}
            <div style={{borderTop:`1px solid ${T.redBorder}20`,paddingTop:10}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                <span style={{fontSize:12,fontWeight:600,color:T.text}}>{lang==='ru'?'Финансовая модель':'Financial Model'}</span>
                <span style={{fontSize:10,padding:'1px 6px',borderRadius:4,background:T.redBg,color:T.red}}>Excel</span>
              </div>
              <DropZone label={lang==='ru'?'Финансовая модель (.xlsx)':'Financial Model (.xlsx)'} value={finUpload} fileObj={finFileObj} docId="fin" onUpload={(_,name,f)=>{setFin(name);if(f)setFinFileObj({name,size:f.size,url:URL.createObjectURL(f)});}} onPreview={setPreviewFile} lang={lang}/>
            </div>
          </div>

          {/* Product Demo — 3 способа */}
          <div style={{border:`1.5px solid ${T.accentBorder}`,borderRadius:12,padding:'0.875rem',marginBottom:12,background:'#FAFBFF'}}>
            <div style={{marginBottom:'0.75rem'}}>
              <span style={{fontSize:11,fontWeight:700,color:T.accent,textTransform:'uppercase',letterSpacing:'.1em'}}>{t.cat2}</span>
              <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>
                {lang==='ru'?'Выберите один или несколько способов — чем больше доступа, тем точнее оценка CPO+CTO':'Choose one or more — more access means more accurate CPO+CTO assessment'}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:10,marginBottom:10}}>
              {/* Credentials */}
              <div style={{background:'#F8FAFF',borderRadius:10,border:`1.5px solid ${credFilled?T.greenBorder:T.accentBorder}`,padding:'0.875rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <IKey sz={13} col={T.accent}/>
                  <span style={{fontSize:12,fontWeight:600,color:T.accent}}>{lang==='ru'?'Доступ к продукту':'Product Access'}</span>
                  {isSeed&&<span style={{fontSize:10,padding:'1px 6px',borderRadius:4,background:T.accentBg,color:T.accent}}>{t.cat2seed}</span>}
                  {credFilled&&<ICheck sz={13}/>}
                </div>
                <div style={{display:'grid',gap:6}}>
                  <input style={C.inp} placeholder="URL продукта (https://...)" value={credUrl} onChange={e=>setCredUrl(e.target.value)}/>
                  <input style={C.inp} placeholder={lang==='ru'?'Логин / Email':'Login / Email'} value={credLogin} onChange={e=>setCredLogin(e.target.value)}/>
                  <input style={C.inp} type="password" placeholder={lang==='ru'?'Пароль':'Password'} value={credPass} onChange={e=>setCredPass(e.target.value)}/>
                </div>
                <div style={{marginTop:6,fontSize:11,color:T.textSubtle}}>{lang==='ru'?'Credentials уничтожаются после анализа':'Credentials are deleted after analysis'}</div>
              </div>

              {/* Video */}
              <div style={{background:'#F8FAFF',borderRadius:10,border:`1.5px solid ${videoUpload?T.greenBorder:T.accentBorder}`,padding:'0.875rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                  <IVideo sz={13} col={T.accent}/>
                  <span style={{fontSize:12,fontWeight:600,color:T.accent}}>{lang==='ru'?'Видео-демонстрация':'Video Walkthrough'}</span>
                  <span style={{fontSize:10,padding:'1px 6px',borderRadius:4,background:'#F3F1EC',color:T.textSubtle}}>5–15 мин</span>
                </div>
                <DropZone label={lang==='ru'?'Видео (mp4, mov, loom...)':'Video (mp4, mov, loom...)'} value={videoUpload} fileObj={videoFileObj} docId="video" onUpload={(_,name,f)=>{setVideo(name);if(f)setVideoFileObj({name,size:f.size,url:URL.createObjectURL(f)});}} onPreview={setPreviewFile} lang={lang}/>
              </div>
            </div>

            {/* Public product link */}
            <div style={{padding:'10px 14px',background:'#F8FAFF',borderRadius:10,border:`1.5px solid ${frm.publicProductUrl?T.greenBorder:T.accentBorder}`,marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:600,color:T.accent}}>{lang==='ru'?'Ссылка на публичный продукт':'Public Product URL'}</span>
                <span style={{fontSize:10,padding:'1px 6px',borderRadius:4,background:'#F3F1EC',color:T.textSubtle}}>{lang==='ru'?'без регистрации':'no login required'}</span>
              </div>
              <input style={C.inp} placeholder="https://app.yourproduct.kz" value={frm.publicProductUrl} onChange={e=>setFrm(p=>({...p,publicProductUrl:e.target.value}))}/>
              {frm.publicProductUrl&&<div style={{marginTop:6,fontSize:11,color:T.textMuted,display:'flex',alignItems:'center',gap:4}}><ICheck sz={10}/>{lang==='ru'?'CPO+CTO пройдёт публичную часть как анонимный пользователь (Режим C)':'CPO+CTO will explore public part as anonymous user (Mode C)'}</div>}
            </div>

            {/* Previous rounds */}
            <SlotRow slot={{id:'rounds',labelRu:'Документы предыдущих раундов',labelEn:'Previous Round Documents',hint:'Term sheet, SAFE, конвертируемые займы. Первый раунд — нажмите кнопку.',hintEn:'Term sheet, SAFE, convertible notes. First round — click button.'}}
              value={uploads.rounds} fileObj={fileObjs.rounds} optional={true} onUpload={setUpload} onPreview={setPreviewFile} firstRound={firstRound} onFirstRound={()=>setFR(v=>!v)} lang={lang}/>
          </div>

          {/* Cat 3 — Legal */}
          <div style={{border:`1.5px solid ${T.border}`,borderRadius:12,padding:'0.875rem',marginBottom:'1.25rem',background:'#FAFAF8'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
              <span style={{fontSize:11,fontWeight:700,color:T.textMuted,textTransform:'uppercase',letterSpacing:'.1em'}}>{t.cat3}</span>
              <span style={{fontSize:12,color:T.textMuted,fontWeight:500}}>{t.cat3note}</span>
            </div>
            {CAT3_DOCS.map(slot=>(
              <SlotRow key={slot.id} slot={slot} value={uploads[slot.id]} fileObj={fileObjs[slot.id]} optional={true} onUpload={setUpload} onPreview={setPreviewFile} lang={lang}/>
            ))}
          </div>

          {/* Stop factors */}
          {stopFlags.length>0&&(
            <div style={{marginBottom:14,padding:'12px 14px',background:T.redBg,borderRadius:10,border:`1px solid ${T.redBorder}`}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}><IStop sz={14}/><span style={{fontSize:13,fontWeight:600,color:T.red}}>{t.stopFactors}</span></div>
              {stopFlags.map(id=>{const sf=STOP_FACTORS.find(s=>s.id===id);return sf?<div key={id} style={{fontSize:12,color:T.red,paddingLeft:20,marginBottom:3}}>{sf.label} — {sf.desc}</div>:null;})}
            </div>
          )}

          {/* FAA offer in form */}
          {!faaScore&&(
            <div style={{marginBottom:14,border:`1px solid ${T.accentBorder}`,borderRadius:10,padding:'0.875rem',background:'#F8FAFF'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:600,color:T.accent}}>⚡ FAA — Интервью с фаундером</span>
                <span style={{fontSize:11,padding:'2px 8px',borderRadius:100,background:T.accentBg,color:T.accent}}>7 вопросов · ~5 мин</span>
              </div>
              <p style={{fontSize:12,color:T.textMuted,lineHeight:1.6,marginBottom:10}}>
                {lang==='ru'?'Пройдите краткое интервью — агент CHRO учтёт ваш фаундерский профиль. Особенно важно при отсутствии трекшна.':'Take a short interview — CHRO agent will factor in your founder profile. Especially important when traction is limited.'}
              </p>
              {!showFAA?(
                <button onClick={()=>setShowFAA(true)} style={{width:'100%',padding:'9px',borderRadius:9,background:T.accentBg,color:T.accent,border:`1px solid ${T.accentBorder}`,cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>{lang==='ru'?'Пройти FAA →':'Take FAA interview →'}</button>
              ):(
                <FAADialog onClose={()=>setShowFAA(false)} onComplete={faaComplete}/>
              )}
            </div>
          )}
          {faaScore!==null&&(
            <div style={{marginBottom:14,padding:'10px 14px',background:T.greenBg,borderRadius:10,border:`1px solid ${T.greenBorder}`,fontSize:13,color:T.green,fontWeight:600}}>
              ✓ FAA завершён · Результат: {faaScore>=5?'высокий потенциал':faaScore>=3?'средний потенциал':'требует работы'} · Передан агенту CHRO
            </div>
          )}

          <button onClick={runPreflight} disabled={!canSubmit||stopFlags.length>0}
            style={{width:'100%',padding:13,borderRadius:11,background:canSubmit&&stopFlags.length===0?T.greenBg:'#F8F7F4',color:canSubmit&&stopFlags.length===0?T.green:T.textSubtle,border:`1.5px solid ${canSubmit&&stopFlags.length===0?T.greenBorder:T.border}`,cursor:canSubmit&&stopFlags.length===0?'pointer':'not-allowed',fontSize:14,fontWeight:700,fontFamily:'inherit',transition:'all .15s'}}>
            {canSubmit?t.submit:t.submitDisabled}
          </button>
          <div style={{fontSize:11,color:T.textSubtle,textAlign:'center',marginTop:8}}>
            {lang==='ru'?`Анализ 5–15 минут · Email придёт на ${frm.email||'указанный адрес'}`:`Analysis 5–15 min · Email to ${frm.email||'provided address'}`}
          </div>
        </div>
      </div>

      {/* ── AI Assistant Desktop ── */}
      {!isMobile&&(
        <div style={{position:'sticky',top:'1rem',height:'fit-content'}}>
          <div style={{...C.card,padding:0,overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:9,padding:'.875rem 1rem',borderBottom:`1px solid ${T.borderLight}`,background:'#FAFAF8'}}>
              <div style={{width:30,height:30,borderRadius:9,background:T.accentBg,border:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IChat/></div>
              <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{t.assistantTitle}</div><div style={{fontSize:11,color:T.textSubtle}}>{t.assistantSub}</div></div>
            </div>
            {showFAA?(
              <div style={{padding:'.75rem'}}><FAADialog onClose={()=>setShowFAA(false)} onComplete={faaComplete}/></div>
            ):(
              <>
                <div style={{height:420,overflowY:'auto',padding:'.75rem',display:'flex',flexDirection:'column',gap:8}}>{renderChatMsgs()}</div>
                <div style={{padding:'0 .75rem .5rem',display:'flex',flexDirection:'column',gap:5}}>
                  {chatQuick.map(q=><button key={q} onClick={()=>sendChat(q)} style={{textAlign:'left',padding:'6px 11px',fontSize:12,color:T.textMuted,background:'#F8F7F4',border:`1px solid ${T.border}`,borderRadius:9,cursor:'pointer',fontFamily:'inherit'}}>{q}</button>)}
                </div>
                {renderChatInput()}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── AI Assistant Mobile floating ── */}
      {isMobile&&(
        <>
          <button onClick={()=>setChatOpen(true)} style={{position:'fixed',bottom:20,right:20,zIndex:1000,width:54,height:54,borderRadius:'50%',background:T.accent,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(26,79,214,0.45)'}}>
            <IChat sz={22} col="#fff"/>
            {chatMsgs.filter(m=>m.r==='a').length>1&&<div style={{position:'absolute',top:2,right:2,width:16,height:16,borderRadius:'50%',background:'#ef4444',border:'2px solid white',fontSize:9,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{chatMsgs.filter(m=>m.r==='a').length-1}</div>}
          </button>
          {chatOpen&&(
            <div style={{position:'fixed',inset:0,zIndex:2000,display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
              <div style={{position:'absolute',inset:0,background:'rgba(26,23,20,0.5)',backdropFilter:'blur(2px)'}} onClick={()=>setChatOpen(false)}/>
              <div style={{position:'relative',background:T.surface,borderRadius:'20px 20px 0 0',maxHeight:'82vh',display:'flex',flexDirection:'column',boxShadow:'0 -8px 40px rgba(0,0,0,0.18)'}}>
                <div style={{padding:'12px 16px 0',flexShrink:0}}>
                  <div style={{width:40,height:4,borderRadius:2,background:T.border,margin:'0 auto 14px'}}/>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:12,borderBottom:`1px solid ${T.borderLight}`}}>
                    <div style={C.row(9)}>
                      <div style={{width:30,height:30,borderRadius:9,background:T.accentBg,border:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}><IChat/></div>
                      <div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{t.assistantTitle}</div><div style={{fontSize:11,color:T.textSubtle}}>{t.assistantSub}</div></div>
                    </div>
                    <button onClick={()=>setChatOpen(false)} style={{background:'#F3F1EC',border:'none',borderRadius:8,padding:'6px 8px',cursor:'pointer',fontSize:13,color:T.textMuted,fontFamily:'inherit',fontWeight:600}}>✕</button>
                  </div>
                </div>
                <div style={{flex:1,overflowY:'auto',padding:'.75rem',display:'flex',flexDirection:'column',gap:8,minHeight:0}}>{renderChatMsgs()}</div>
                <div style={{padding:'0 .75rem .5rem',display:'flex',gap:6,flexWrap:'wrap',flexShrink:0}}>
                  {chatQuick.map(q=><button key={q} onClick={()=>sendChat(q)} style={{padding:'6px 11px',fontSize:12,color:T.textMuted,background:'#F8F7F4',border:`1px solid ${T.border}`,borderRadius:9,cursor:'pointer',fontFamily:'inherit'}}>{q}</button>)}
                </div>
                {renderChatInput(14,'max(.75rem, env(safe-area-inset-bottom))')}
              </div>
            </div>
          )}
        </>
      )}
      <style>{`@keyframes dp{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
    </div>
  );
}

// ── Processing ─────────────────────────────────────────────────────────────
function Proc({go,noTraction=false,stage='seed'}){
  const [prog,setP]=useState(Object.fromEntries(AIDS.map(k=>[k,0])));
  const [sv,setSV]=useState(0);
  const [logs,setL]=useState(['Запуск 6 агентов параллельно...']);
  const [done,setD]=useState(false);
  const [showFAA,setShowFAA]=useState(false);
  const [faaScore,setFAAScore]=useState(null);
  const logRef=useRef(null);
  const isPreSeedNoTraction=noTraction&&stage==='pre-seed';
  useEffect(()=>{logRef.current?.scrollTo({top:9999,behavior:'smooth'});},[logs]);
  useEffect(()=>{
    const spd={cmo:1.1,clo:.85,cfo:.95,cpo:1.25,cro:1.05,chro:1.2};
    const iv=setInterval(()=>{
      setP(p=>{const n={};let all=true;AIDS.forEach(k=>{n[k]=Math.min(100,p[k]+spd[k]*(Math.random()*1.5+.5));if(n[k]<100)all=false;});if(all){clearInterval(iv);setD(true);}return n;});
      setSV(s=>Math.min(7.4,s+.04));
    },65);
    [[900,'CMO+CCO: TAM $2.1B верифицирован — CAGR 18%'],[1800,'CHRO: FAA-сигнал учтён · профили фаундеров'],[2800,'CPO+CTO: Demo credentials — проход продукта'],[3600,'CFO→CRO: cross_query — клиент 43%!'],[4600,'CLO: IP Assignment ✓ · Advisor Agreement ✗'],[5400,'CRO: 2 critical · 2 moderate · 1 minor'],[6200,'CFO: LTV:CAC = 4.1× ✓'],[7500,'Orchestrator: агрегация Investment Score...']].forEach(([t,m])=>setTimeout(()=>setL(p=>[...p,m]),t));
    return()=>clearInterval(iv);
  },[]);
  useEffect(()=>{if(done)setTimeout(()=>go(SC.STATUS,{lang:'ru'}),1400);},[done]);
  return(
    <div style={{maxWidth:560,margin:'0 auto',padding:'2.5rem 1.5rem',background:T.bg,minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',background:'#F0EEE9',borderRadius:100,marginBottom:12,border:`1px solid ${T.border}`}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:T.accent,animation:'pulse 1.5s infinite'}}/>
          <span style={{fontSize:11,letterSpacing:'.12em',color:T.textMuted,textTransform:'uppercase',fontWeight:600}}>VentureIQ · Анализ</span>
        </div>
        <h2 style={{fontSize:20,fontWeight:700,color:T.text,margin:'0 0 4px'}}>FastRoute · Seed · Logistics Tech</h2>
        <p style={{fontSize:13,color:T.textMuted,marginTop:2}}>KZ · $500,000 USD</p>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:12,padding:'6px 14px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:100,boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
          <IClock sz={13}/><span style={{fontSize:12,color:T.textMuted,fontWeight:500}}>Обычно занимает 5–10 минут</span>
        </div>
      </div>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <div style={{fontSize:60,fontWeight:800,color:sv>=7?T.green:T.amber,lineHeight:1,fontFamily:'monospace',letterSpacing:'-2px'}}>{done?'7.4':sv.toFixed(1)}</div>
        <div style={{fontSize:12,color:T.textMuted,marginTop:4,fontWeight:500,letterSpacing:'.06em',textTransform:'uppercase'}}>Investment Score</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
        {AIDS.map(k=>{const a=D.agents[k];return(
          <div key={k} style={C.sm}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>{a.name}</span><span style={{fontSize:12,color:prog[k]>=100?T.green:T.textMuted,fontFamily:'monospace',fontWeight:600}}>{prog[k]>=100?a.score.toFixed(1):`${Math.round(prog[k])}%`}</span></div>
            <div style={{height:4,background:'#F0EEE9',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${prog[k]}%`,background:prog[k]>=100?T.green:T.accent,transition:'width .1s',borderRadius:2}}/></div>
          </div>
        );})}
      </div>
      <div ref={logRef} style={{...C.sm,maxHeight:175,overflowY:'auto'}}>
        <div style={{fontSize:10,color:T.textSubtle,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8,fontWeight:600}}>Cross-query log</div>
        {logs.map((l,i)=><div key={i} style={{fontSize:12,color:T.textMuted,padding:'4px 0',borderTop:i?`1px solid ${T.borderLight}`:'none',lineHeight:1.5}}><span style={{fontFamily:'monospace',color:T.textSubtle,marginRight:8}}>{String(i+1).padStart(2,'0')}</span>{l}</div>)}
      </div>
      {done&&<div style={{textAlign:'center',marginTop:16,padding:'12px 16px',background:T.greenBg,borderRadius:10,fontSize:13,color:T.green,fontWeight:600,border:`1px solid ${T.greenBorder}`}}>✓ Анализ завершён · Score 7.4 · CONDITIONAL → статус заявки...</div>}

      {/* FAA — предлагается при pre-seed без трекшна */}
      {isPreSeedNoTraction&&!faaScore&&(
        <div style={{marginTop:16,border:`1px solid ${T.accentBorder}`,borderRadius:10,padding:'1rem',background:'#F8FAFF'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:600,color:T.accent}}>⚡ Пока агенты анализируют проект</span>
            <span style={{fontSize:11,padding:'2px 8px',borderRadius:100,background:T.accentBg,color:T.accent}}>pre-seed · нет трекшна</span>
          </div>
          <p style={{fontSize:12,color:T.textMuted,lineHeight:1.6,marginBottom:10}}>Пройдите краткое интервью FAA (7 вопросов, ~5 мин) — агент CHRO учтёт ваш фаундерский профиль. Это частично компенсирует отсутствие трекшна.</p>
          {!showFAA?(
            <button onClick={()=>setShowFAA(true)} style={{width:'100%',padding:'9px',borderRadius:9,background:T.accent,color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>Пройти интервью FAA →</button>
          ):(
            <FAADialog onClose={()=>setShowFAA(false)} onComplete={a=>{setShowFAA(false);const cnt=Object.values(a).filter(v=>v==='yes').length;setFAAScore(cnt>=4?'high':cnt>=2?'medium':'low');}}/>
          )}
        </div>
      )}
      {faaScore&&<div style={{marginTop:12,padding:'10px 14px',background:T.greenBg,borderRadius:10,border:`1px solid ${T.greenBorder}`,fontSize:13,color:T.green,fontWeight:600}}>✓ FAA завершён · Результат: <strong>{faaScore==='high'?'высокий потенциал':faaScore==='medium'?'средний потенциал':'требует работы'}</strong> · Передан агенту CHRO</div>}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

// ── Agent Card ─────────────────────────────────────────────────────────────
function ACard({id}){
  const a=D.agents[id];const [open,setO]=useState(false);
  const sev={critical:T.red,moderate:T.amber,minor:T.textSubtle};
  return(
    <div style={{...C.card,boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setO(!open)}>
        <div style={C.row(10)}>
          <div style={{width:34,height:34,borderRadius:10,background:scBg(a.score),display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${sc(a.score)}30`}}><span style={{fontSize:12,fontWeight:700,color:sc(a.score)}}>{a.score.toFixed(1)}</span></div>
          <div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{a.name}</div><div style={{fontSize:11,color:T.textMuted}}>{a.title}</div></div>
        </div>
        <div style={C.row(10)}>
          <div style={{fontSize:24,fontWeight:800,color:sc(a.score),fontFamily:'monospace',letterSpacing:'-0.5px'}}>{a.score.toFixed(1)}</div>
          <div style={{fontSize:12,color:T.textSubtle}}>w:{a.w}%</div>
          {open?<IUp/>:<IDown/>}
        </div>
      </div>
      {open&&(
        <div style={{marginTop:'1rem',borderTop:`1px solid ${T.borderLight}`,paddingTop:'1rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            <div><div style={{fontSize:10,color:T.textSubtle,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:7,fontWeight:700}}>Сильные стороны</div>{a.str.map((s,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:6,marginBottom:6,fontSize:12}}><span style={{flexShrink:0,marginTop:2}}><ICheck sz={11}/></span><span style={{color:T.text,lineHeight:1.5}}>{s}</span></div>)}</div>
            <div><div style={{fontSize:10,color:T.textSubtle,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:7,fontWeight:700}}>Красные флаги</div>{a.fl.map((f,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:6,marginBottom:6,fontSize:12}}><span style={{flexShrink:0,marginTop:2}}><IWarn sz={11} col={sev[f.s]}/></span><span style={{color:T.text,lineHeight:1.5}}>{f.f}</span></div>)}</div>
          </div>
          {a.cond?.length>0&&<div style={{padding:12,background:'#F8F7F4',borderRadius:9,border:`1px solid ${T.borderLight}`}}><div style={{fontSize:10,color:T.textSubtle,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:7,fontWeight:700}}>Условия инвестирования</div>{a.cond.map((c,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:7,marginBottom:5,fontSize:12,color:T.text}}><div style={{width:18,height:18,borderRadius:'50%',border:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:T.textSubtle,flexShrink:0,fontWeight:600}}>{i+1}</div>{c}</div>)}</div>}
        </div>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dash({go}){
  const rd=AIDS.map(k=>({s:D.agents[k].name,v:D.agents[k].score}));
  const [decision,setDecision]=useState(null);
  const [revNote,setRevNote]=useState('');
  const [showModal,setModal]=useState(false);
  const [pendingDec,setPending]=useState(null);
  const confirmDecision=()=>{setDecision(pendingDec);setModal(false);};
  return(
    <div style={{display:'grid',gridTemplateColumns:'185px 1fr 285px',minHeight:640,background:T.surface}}>
      {/* Sidebar */}
      <div style={{borderRight:`1px solid ${T.borderLight}`,padding:'1rem'}}>
        <div style={{fontSize:10,color:T.textSubtle,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:12,fontWeight:700}}>Портфель</div>
        {[{n:'FastRoute',s:7.4,v:'CONDITIONAL',a:true},{n:'PayKZ',s:5.8,v:'PASS WITH FB',a:false},{n:'AgriSense',s:8.2,v:'INVEST',a:false}].map(p=>(
          <div key={p.n} style={{padding:'8px 10px',borderRadius:9,background:p.a?'#F8F7F4':'transparent',marginBottom:3,cursor:'pointer',border:p.a?`1px solid ${T.border}`:'1px solid transparent'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:13,fontWeight:p.a?700:500,color:T.text}}>{p.n}</span><span style={{fontFamily:'monospace',fontSize:12,color:sc(p.s),fontWeight:700}}>{p.s}</span></div>
            <span style={{fontSize:11,color:T.textSubtle,fontWeight:500}}>{p.v}</span>
          </div>
        ))}
        <div style={{borderTop:`1px solid ${T.borderLight}`,margin:'1rem 0'}}/>
        <button onClick={()=>go(SC.HOME)} style={{width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.border}`,background:'transparent',cursor:'pointer',color:T.textMuted,marginBottom:6,fontFamily:'inherit',fontWeight:500}}>← На главную</button>
        <button onClick={()=>go(SC.FORM)} style={{width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.accentBorder}`,background:T.accentBg,cursor:'pointer',color:T.accent,fontFamily:'inherit',fontWeight:600}}>+ Новая заявка</button>
        <div style={{borderTop:`1px solid ${T.borderLight}`,margin:'1rem 0'}}/>
        <button onClick={()=>go(SC.ACCT)} style={{width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.border}`,background:'transparent',cursor:'pointer',color:T.textMuted,marginBottom:6,fontFamily:'inherit'}}>💰 Бухгалтерия</button>
        <button onClick={()=>go(SC.TMPL)} style={{width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.border}`,background:'transparent',cursor:'pointer',color:T.textMuted,marginBottom:6,fontFamily:'inherit'}}>📋 Шаблоны</button>
        <button onClick={()=>go(SC.PORT)} style={{width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.border}`,background:'transparent',cursor:'pointer',color:T.textMuted,fontFamily:'inherit'}}>📊 Портфель</button>
      </div>

      {/* Main */}
      <div style={{padding:'1.25rem',overflowY:'auto',maxHeight:700}}>
        <div style={{...C.card,marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={C.row(8)}><h2 style={C.h2}>FastRoute</h2>{['Logistics Tech','Seed','KZ'].map(tg=><span key={tg} style={C.tag}>{tg}</span>)}</div>
              <p style={{fontSize:13,color:T.textMuted,marginTop:7,maxWidth:360,lineHeight:1.65}}>{D.hero}</p>
              <div style={{display:'flex',gap:8,marginTop:12}}><button style={{display:'flex',alignItems:'center',gap:5,fontSize:12,padding:'5px 11px',border:`1px solid ${T.border}`,borderRadius:8,background:'transparent',cursor:'pointer',color:T.textMuted,fontFamily:'inherit',fontWeight:500}}><IDl/>PDF</button></div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{fontSize:54,fontWeight:800,color:T.amber,lineHeight:1,fontFamily:'monospace',letterSpacing:'-2px'}}>7.4</div>
              <div style={{fontSize:12,color:T.textSubtle,marginBottom:9,fontWeight:500}}>/ 10 · Investment Score</div>
              <span style={{padding:'5px 14px',borderRadius:100,fontSize:12,fontWeight:600,background:T.accentBg,color:T.accent}}>CONDITIONAL</span>
            </div>
          </div>
        </div>

        <div style={{...C.card,marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><h3 style={C.h3}>Radar Chart</h3><div style={{display:'flex',flexWrap:'wrap',gap:'3px 12px'}}>{AIDS.map(k=><div key={k} style={C.row(5)}><span style={{fontFamily:'monospace',fontSize:12,color:sc(D.agents[k].score),fontWeight:700}}>{D.agents[k].score.toFixed(1)}</span><span style={{fontSize:11,color:T.textSubtle}}>{D.agents[k].name}</span></div>)}</div></div>
          <ResponsiveContainer width="100%" height={185}>
            <RadarChart data={rd} margin={{top:5,right:20,bottom:5,left:20}}>
              <PolarGrid stroke={T.borderLight}/><PolarAngleAxis dataKey="s" tick={{fill:T.textSubtle,fontSize:11}}/>
              <Radar dataKey="v" stroke={T.accent} fill={T.accent} fillOpacity={0.1} strokeWidth={1.5}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <h3 style={{fontSize:15,fontWeight:700,color:T.text,margin:'0 0 12px'}}>Карточки агентов <span style={{fontWeight:400,fontSize:12,color:T.textSubtle}}>(нажмите)</span></h3>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:'1rem'}}>{AIDS.map(id=><ACard key={id} id={id}/>)}</div>

        <div style={{...C.card,marginBottom:'1rem'}}><h3 style={{fontSize:15,fontWeight:700,color:T.text,margin:'0 0 12px'}}>Executive Summary</h3>{D.summary.map((p,i)=><p key={i} style={{fontSize:14,lineHeight:1.8,color:T.text,margin:i<D.summary.length-1?'0 0 12px':0}}>{p}</p>)}</div>
        <div style={{...C.card,marginBottom:'1rem'}}><h3 style={{fontSize:15,fontWeight:700,color:T.text,margin:'0 0 12px'}}>Interview Guide</h3>{D.q.map((q,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'9px 0',borderTop:i?`1px solid ${T.borderLight}`:'none'}}><div style={{width:22,height:22,borderRadius:'50%',background:'#F8F7F4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:T.textSubtle,flexShrink:0,border:`1px solid ${T.border}`}}>{i+1}</div><span style={{fontSize:13,color:T.text,lineHeight:1.6}}>{q}</span></div>)}</div>

        {/* Решение инвестора */}
        {!decision?(
          <div style={{...C.card,border:`1px solid ${T.border}`}}>
            <h3 style={{...C.h3,marginBottom:6}}>Решение инвестора</h3>
            <p style={{fontSize:13,color:T.textMuted,marginBottom:'0.75rem',lineHeight:1.6}}>После ознакомления с отчётом — зафиксируйте решение.</p>
            {D.score<6.0&&<div style={{padding:'8px 12px',background:T.amberBg,borderRadius:8,border:`1px solid ${T.amberBorder}`,fontSize:12,color:T.amber,marginBottom:'0.75rem'}}>⚠ Скор {D.score} — одобрение недоступно. Доступны: отказ или запрос доработок.</div>}
            <div style={{display:'grid',gridTemplateColumns:`${D.score>=6?'1fr ':''}1fr 1fr`,gap:10}}>
              {D.score>=6&&<button onClick={()=>{setPending('approve');setModal(true);}} style={{padding:'10px',borderRadius:9,background:T.greenBg,border:`1px solid ${T.greenBorder}`,color:T.green,cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>✓ Одобрить</button>}
              <button onClick={()=>{setPending('revision');setModal(true);}} style={{padding:'10px',borderRadius:9,background:T.amberBg,border:`1px solid ${T.amberBorder}`,color:T.amber,cursor:'pointer',fontSize:13,fontWeight:500,fontFamily:'inherit'}}>↺ Запросить доработки</button>
              <button onClick={()=>{setPending('reject');setModal(true);}} style={{padding:'10px',borderRadius:9,background:T.redBg,border:`1px solid ${T.redBorder}`,color:T.red,cursor:'pointer',fontSize:13,fontWeight:500,fontFamily:'inherit'}}>✗ Отказать</button>
            </div>
          </div>
        ):decision==='approve'?(
          <div style={{...C.card,background:T.greenBg,border:`1px solid ${T.greenBorder}`}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><ICheck sz={16} col={T.green}/><span style={{fontSize:14,fontWeight:700,color:T.green}}>Инвестиция одобрена — запущен GEN-pipeline</span></div>
            <div style={{fontSize:13,color:T.green,lineHeight:1.7}}>✓ Генерируется Term Sheet (CLO-GEN)<br/>✓ Составляется milestone-план (CFO-GEN)<br/>✓ Формируется план найма (CHRO-GEN)<br/>✓ Бухгалтер уведомлён</div>
            <button onClick={()=>go(SC.ACCT)} style={{marginTop:12,fontSize:12,padding:'6px 14px',border:`1px solid ${T.greenBorder}`,borderRadius:8,background:'#fff',color:T.green,cursor:'pointer',fontFamily:'inherit'}}>Перейти в кабинет бухгалтера →</button>
          </div>
        ):decision==='reject'?(
          <div style={{...C.card,background:T.redBg,border:`1px solid ${T.redBorder}`}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><IXc sz={16}/><span style={{fontSize:14,fontWeight:700,color:T.red}}>Отказ зафиксирован</span></div>
            <div style={{fontSize:13,color:T.red}}>Фаундер получит email с обратной связью.</div>
          </div>
        ):(
          <div style={{...C.card,background:T.amberBg,border:`1px solid ${T.amberBorder}`}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><IWarn sz={16} col={T.amber}/><span style={{fontSize:14,fontWeight:700,color:T.amber}}>Запрос доработок отправлен</span></div>
            <div style={{fontSize:13,color:T.amber}}>Фаундер получит email со ссылкой для ответа.</div>
          </div>
        )}

        {/* Modal */}
        {showModal&&pendingDec!=='approve'&&(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50}}>
            <div style={{...C.card,width:380,boxShadow:'0 12px 40px rgba(0,0,0,.2)'}}>
              <h3 style={{...C.h3,marginBottom:8}}>{pendingDec==='reject'?'Подтвердить отказ?':'Запросить доработки?'}</h3>
              <p style={{fontSize:13,color:T.textMuted,marginBottom:'0.75rem',lineHeight:1.6}}>{pendingDec==='reject'?'Фаундер получит email с обратной связью.':'Фаундер получит email с комментарием.'}</p>
              {pendingDec==='revision'&&<textarea style={{...C.inp,height:72,resize:'vertical',marginBottom:'1rem',fontSize:12,lineHeight:1.5}} placeholder="Комментарий фаундеру..." value={revNote} onChange={e=>setRevNote(e.target.value)}/>}
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button onClick={()=>setModal(false)} style={{padding:'8px 16px',borderRadius:8,border:`1px solid ${T.border}`,background:'transparent',cursor:'pointer',fontSize:13,fontFamily:'inherit',color:T.textMuted}}>Отмена</button>
                <button onClick={confirmDecision} style={{padding:'8px 20px',borderRadius:8,border:'none',background:pendingDec==='reject'?T.red:T.amber,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>
                  {pendingDec==='reject'?'Отказать':'Отправить'}
                </button>
              </div>
            </div>
          </div>
        )}
        {showModal&&pendingDec==='approve'&&<DealParamsModal onClose={()=>setModal(false)} onConfirm={confirmDecision} go={go}/>}
      </div>

      {/* Orchestrator chat */}
      <div style={{borderLeft:`1px solid ${T.borderLight}`,display:'flex',flexDirection:'column',maxHeight:700}}>
        <div style={{display:'flex',alignItems:'center',gap:9,padding:'.75rem 1rem',borderBottom:`1px solid ${T.borderLight}`,flexShrink:0,background:'#FAFAF8'}}>
          <div style={{width:30,height:30,borderRadius:9,background:T.accentBg,border:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IZap/></div>
          <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>Orchestrator</div><div style={{fontSize:11,color:T.textSubtle}}>Вопрос = диалог · Ревизия = пересчёт</div></div>
        </div>
        <div style={{flex:1,overflow:'hidden'}}>
          <Chat init={"Анализ FastRoute завершён.\n\nScore: 7.4 — CONDITIONAL.\n\nКлючевой риск: CRO 5.9 — концентрация 43%. Задайте вопрос."} kb={ORCH} quick={['Почему 7.4?','Главные риски?','Условия сделки?']} height={560}/>
        </div>
      </div>
    </div>
  );
}

// ── DealParamsModal ────────────────────────────────────────────────────────
const DEAL_MILESTONES=[
  {id:'m1',agent:'CFO-GEN',tranche:'Транш 1',text:'MRR достигает $35,000',verify:'P&L отчёт за месяц'},
  {id:'m2',agent:'CPO+CTO-GEN',tranche:'Транш 1',text:'CI/CD внедрён, деплой < 15 мин',verify:'Демо pipeline'},
  {id:'m3',agent:'CHRO-GEN',tranche:'Транш 1',text:'CTO переходит на full-time',verify:'Трудовой договор'},
  {id:'m4',agent:'CFO-GEN',tranche:'Транш 2',text:'LTV:CAC > 3.5×',verify:'Данные из CRM'},
  {id:'m5',agent:'CMO-GEN',tranche:'Транш 2',text:'CAC снижен до $280 (direct channel)',verify:'Отчёт по каналам'},
  {id:'m6',agent:'CHRO-GEN',tranche:'Транш 2',text:'Head of Sales нанят',verify:'Трудовой договор'},
];
const SHA_CONDITIONS=[
  {id:'s1',text:'Вестинг основателей: 4 года, 1 год cliff',priority:'mandatory',checked:true},
  {id:'s2',text:'Anti-dilution: broad-based weighted average',priority:'mandatory',checked:true},
  {id:'s3',text:'Drag-along / Tag-along',priority:'mandatory',checked:true},
  {id:'s4',text:'ROFR при продаже долей основателями',priority:'recommended',checked:true},
  {id:'s5',text:'Ежемесячный P&L — информационные права',priority:'mandatory',checked:true},
  {id:'s6',text:'ESOP пул 10%',priority:'recommended',checked:false},
];
function DealParamsModal({onClose,onConfirm,go}){
  const [tab,setTab]=useState(0);
  const [params,setParams]=useState({instrument:'safe',amount:'500 000',currency:'USD',equity:'10',preMoney:'4 500 000',jurisdiction:'МФЦА',language:'RU'});
  const [milestones,setMS]=useState(DEAL_MILESTONES.map(m=>({...m})));
  const [sha,setSHA]=useState(SHA_CONDITIONS.map(s=>({...s})));
  const tabs=['Параметры сделки','Транши и milestone','Условия SHA'];
  const tabCols=[T.accent,T.green,'#7c3aed'];
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50}}>
      <div style={{...C.card,width:640,maxHeight:'85vh',display:'flex',flexDirection:'column',boxShadow:'0 12px 40px rgba(0,0,0,.2)',padding:0,overflow:'hidden'}}>
        <div style={{padding:'1rem 1.25rem',borderBottom:`1px solid ${T.borderLight}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <div><div style={{fontSize:15,fontWeight:700,color:T.text}}>Параметры сделки — FastRoute</div><div style={{fontSize:12,color:T.textMuted,marginTop:2}}>Параметры сформированы агентами · Редактируйте перед запуском GEN-pipeline</div></div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',padding:4}}><IX/></button>
        </div>
        <div style={{display:'flex',borderBottom:`1px solid ${T.borderLight}`,flexShrink:0}}>
          {tabs.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{flex:1,padding:'10px 8px',fontSize:12,fontWeight:tab===i?700:400,color:tab===i?tabCols[i]:T.textMuted,background:'transparent',border:'none',borderBottom:`2px solid ${tab===i?tabCols[i]:'transparent'}`,cursor:'pointer',fontFamily:'inherit'}}>
              {['💰','📋','📜'][i]} {t}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'1rem 1.25rem'}}>
          {tab===0&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[{l:'Инструмент',k:'instrument',opts:['safe','equity','convertible_note'],labels:['SAFE','Equity','Convertible Note']},{l:'Юрисдикция',k:'jurisdiction',opts:['Delaware','МФЦА','РК'],labels:['Delaware','МФЦА','РК']},{l:'Язык документов',k:'language',opts:['RU','EN','Bilingual'],labels:['Русский','English','Bilingual']},{l:'Валюта',k:'currency',opts:['USD','EUR','KZT'],labels:['USD','EUR','KZT']}].map(f=>(
                <div key={f.k}><div style={C.label}>{f.l}</div><select style={C.inp} value={params[f.k]} onChange={e=>setParams(p=>({...p,[f.k]:e.target.value}))}>{f.opts.map((o,i)=><option key={o} value={o}>{f.labels[i]}</option>)}</select></div>
              ))}
              {[{l:'Сумма раунда',k:'amount'},{l:'Доля инвестора (%)',k:'equity'},{l:'Pre-money valuation',k:'preMoney',span:true}].map(f=>(
                <div key={f.k} style={f.span?{gridColumn:'1/-1'}:{}}><div style={C.label}>{f.l}</div><input style={C.inp} value={params[f.k]} onChange={e=>setParams(p=>({...p,[f.k]:e.target.value}))}/></div>
              ))}
              <div style={{gridColumn:'1/-1',padding:'10px 12px',background:T.amberBg,borderRadius:9,border:`1px solid ${T.amberBorder}`,fontSize:12,color:T.amber}}>
                ⚠ Язык «{params.language}» → {params.language==='EN'||params.language==='Bilingual'?'документы на английском':'документы на русском'}. Юрисдикция «{params.jurisdiction}» → {params.jurisdiction==='Delaware'||params.jurisdiction==='МФЦА'?'рекомендуется EN':'RU стандарт'}.
              </div>
            </div>
          )}
          {tab===1&&(
            <div>
              <div style={{fontSize:12,color:T.textMuted,marginBottom:12}}>Milestone сформированы агентами. Редактируйте текст и верификацию.</div>
              {['Транш 1 — $250,000','Транш 2 — $250,000'].map((tranche,ti)=>(
                <div key={ti} style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:8,padding:'6px 10px',background:'#F8F7F4',borderRadius:9,border:`1px solid ${T.border}`}}>{tranche}</div>
                  {milestones.filter(m=>m.tranche===`Транш ${ti+1}`).map(m=>(
                    <div key={m.id} style={{marginBottom:8,padding:'10px 12px',background:T.surface,borderRadius:9,border:`1px solid ${T.border}`}}>
                      <span style={{fontSize:10,padding:'1px 7px',borderRadius:4,background:T.accentBg,color:T.accent,marginBottom:6,display:'inline-block'}}>{m.agent}</span>
                      <input style={{...C.inp,marginBottom:6,fontSize:12}} value={m.text} onChange={e=>setMS(ms=>ms.map(x=>x.id===m.id?{...x,text:e.target.value}:x))}/>
                      <input style={{...C.inp,fontSize:11}} placeholder="Верификация..." value={m.verify} onChange={e=>setMS(ms=>ms.map(x=>x.id===m.id?{...x,verify:e.target.value}:x))}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {tab===2&&(
            <div>
              <div style={{fontSize:12,color:T.textMuted,marginBottom:12}}>Условия сформированы CLO-GEN. Обязательные нельзя снять.</div>
              {sha.map(s=>(
                <div key={s.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 0',borderTop:`1px solid ${T.borderLight}`}}>
                  <input type="checkbox" checked={s.checked} disabled={s.priority==='mandatory'} onChange={e=>setSHA(ss=>ss.map(x=>x.id===s.id?{...x,checked:e.target.checked}:x))} style={{marginTop:2,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:T.text}}>{s.text}</div>
                    <span style={{fontSize:10,padding:'1px 7px',borderRadius:4,background:s.priority==='mandatory'?T.redBg:T.accentBg,color:s.priority==='mandatory'?T.red:T.accent,marginTop:3,display:'inline-block'}}>{s.priority==='mandatory'?'Обязательно':'Рекомендуется'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{padding:'1rem 1.25rem',borderTop:`1px solid ${T.borderLight}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,background:'#F8F7F4'}}>
          <div style={{fontSize:12,color:T.textSubtle}}>После подтверждения запустится GEN-pipeline</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={onClose} style={{padding:'8px 16px',borderRadius:9,border:`1px solid ${T.border}`,background:'#fff',cursor:'pointer',fontSize:13,fontFamily:'inherit',color:T.textMuted}}>Отмена</button>
            <button onClick={onConfirm} style={{padding:'8px 20px',borderRadius:9,border:'none',background:T.green,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit'}}>Подтвердить и запустить GEN →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Accountant ─────────────────────────────────────────────────────────────
const DEALS=[
  {id:'D001',company:'AgriSense',verdict:'INVEST',amount:'$200,000',signed:'12.03.2026',due:'22.03.2026',status:'overdue',email:'cfo@agrisense.kz'},
  {id:'D002',company:'FastRoute',verdict:'CONDITIONAL',amount:'$500,000',signed:'20.03.2026',due:'03.04.2026',status:'pending',email:'alibek@fastroute.kz'},
  {id:'D003',company:'EduPilot',verdict:'INVEST',amount:'$150,000',signed:'25.03.2026',due:'08.04.2026',status:'pending',email:'ceo@edupilot.kz'},
  {id:'D004',company:'PayKZ',verdict:'CONDITIONAL',amount:'$300,000',signed:'15.02.2026',due:'01.03.2026',status:'paid',email:'cfo@paykz.kz'},
];
function Accountant({go}){
  const [docs,setDocs]=useState({});const [notes,setNotes]=useState({});
  const sCol=s=>s==='paid'?T.green:s==='overdue'?T.red:T.amber;
  const sLbl=s=>s==='paid'?'Оплачено':s==='overdue'?'Просрочено':'Ожидает оплаты';
  return(
    <div style={{maxWidth:820,margin:'0 auto',padding:'1.5rem',background:T.bg,minHeight:'100vh'}}>
      <div style={{...C.row(8),marginBottom:'1.25rem'}}>
        <button onClick={()=>go(SC.DASH)} style={{fontSize:12,color:T.textMuted,background:'none',border:`1px solid ${T.border}`,borderRadius:9,padding:'5px 10px',cursor:'pointer',fontFamily:'inherit'}}>← Дашборд</button>
        <div><h2 style={C.h2}>Кабинет бухгалтера</h2><div style={{fontSize:12,color:T.textSubtle,marginTop:2}}>Сделки к оплате · Загрузка платёжных документов</div></div>
        <div style={{marginLeft:'auto'}}><button style={{fontSize:12,padding:'6px 12px',border:`1px solid ${T.border}`,borderRadius:9,background:'transparent',cursor:'pointer',color:T.textMuted,fontFamily:'inherit'}}>Экспорт Excel</button></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:'1.25rem'}}>
        {[{l:'Всего',v:DEALS.length,col:T.textMuted},{l:'Ожидает',v:DEALS.filter(d=>d.status==='pending').length,col:T.amber},{l:'Просрочено',v:DEALS.filter(d=>d.status==='overdue').length,col:T.red},{l:'Оплачено',v:DEALS.filter(d=>d.status==='paid').length,col:T.green}].map(s=>(
          <div key={s.l} style={{...C.sm,textAlign:'center'}}><div style={{fontSize:24,fontWeight:700,color:s.col,fontFamily:'monospace'}}>{s.v}</div><div style={{fontSize:11,color:T.textSubtle,marginTop:2}}>{s.l}</div></div>
        ))}
      </div>
      <div style={{...C.card,padding:0,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',borderBottom:`1px solid ${T.borderLight}`,display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:14,fontWeight:600,color:T.text}}>Реестр сделок</span>
          <span style={{fontSize:12,color:T.textSubtle}}>По сроку оплаты</span>
        </div>
        {DEALS.map((d,i)=>(
          <div key={d.id} style={{padding:'14px 16px',borderTop:i?`1px solid ${T.borderLight}`:'none',display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'start'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:600,color:T.text}}>{d.company}</span>
                <span style={{fontSize:11,padding:'2px 8px',borderRadius:100,background:d.verdict==='INVEST'?T.greenBg:T.accentBg,color:d.verdict==='INVEST'?T.green:T.accent}}>{d.verdict}</span>
                <span style={{fontSize:11,padding:'2px 8px',borderRadius:100,background:d.status==='paid'?T.greenBg:d.status==='overdue'?T.redBg:T.amberBg,color:sCol(d.status),fontWeight:600}}>{sLbl(d.status)}</span>
              </div>
              <div style={{display:'flex',gap:16,fontSize:12,color:T.textMuted}}>
                <span>Сумма: <strong style={{color:T.text}}>{d.amount}</strong></span>
                <span>Подписано: {d.signed}</span>
                <span>Срок: <strong style={{color:d.status==='overdue'?T.red:T.text}}>{d.due}</strong></span>
              </div>
              {d.status!=='paid'&&(
                <div style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
                  {docs[d.id]?<div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:T.green}}><ICheck sz={12}/>{docs[d.id]}</div>:(
                    <label style={{fontSize:12,color:T.accent,padding:'4px 10px',border:`1px solid ${T.accentBorder}`,borderRadius:8,cursor:'pointer',background:T.accentBg,fontFamily:'inherit'}}>
                      Загрузить платёжку<input type="file" style={{display:'none'}} onChange={e=>{const n=e.target.files?.[0]?.name;if(n)setDocs(p=>({...p,[d.id]:n}));}}/>
                    </label>
                  )}
                  <input style={{...C.inp,fontSize:12,flex:1,maxWidth:200}} placeholder="Комментарий..." value={notes[d.id]||''} onChange={e=>setNotes(p=>({...p,[d.id]:e.target.value}))}/>
                </div>
              )}
              {d.status==='paid'&&<div style={{marginTop:6,fontSize:12,color:T.green,display:'flex',gap:4,alignItems:'center'}}><ICheck sz={11}/>Платёж подтверждён · Фаундер уведомлён</div>}
            </div>
            <div style={{textAlign:'right',fontSize:11,color:T.textSubtle}}><div>{d.email}</div><div style={{marginTop:4}}>{d.id}</div></div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12,padding:'12px 16px',background:T.amberBg,borderRadius:10,border:`1px solid ${T.amberBorder}`,fontSize:12,color:T.amber}}>
        💡 После загрузки платёжного документа фаундер автоматически получает email-уведомление.
      </div>
    </div>
  );
}

// ── Templates ──────────────────────────────────────────────────────────────
const TMPL_SLOTS=[
  {id:'eq_del',type:'Equity',juris:'Delaware',yc:null,status:'empty'},{id:'eq_aifc',type:'Equity',juris:'МФЦА',yc:null,status:'empty'},{id:'eq_kz',type:'Equity',juris:'РК',yc:null,status:'empty'},
  {id:'safe_del',type:'SAFE',juris:'Delaware',yc:'https://www.ycombinator.com/documents/',status:'yc'},{id:'safe_aifc',type:'SAFE',juris:'МФЦА',yc:null,status:'empty'},{id:'safe_kz',type:'SAFE',juris:'РК',yc:null,status:'empty'},
  {id:'note_del',type:'Convertible Note',juris:'Delaware',yc:'https://www.ycombinator.com/documents/',status:'yc'},{id:'note_aifc',type:'Convertible Note',juris:'МФЦА',yc:null,status:'empty'},{id:'note_kz',type:'Convertible Note',juris:'РК',yc:null,status:'empty'},
];
const TYPE_COL={'Equity':T.green,'SAFE':T.accent,'Convertible Note':'#7c3aed'};
const TYPE_BG ={'Equity':T.greenBg,'SAFE':T.accentBg,'Convertible Note':'#F5F3FF'};
function Templates({go}){
  const [slots,setSlots]=useState(TMPL_SLOTS.map(s=>({...s})));
  const upload=(id,name)=>setSlots(ss=>ss.map(s=>s.id===id?{...s,status:'uploaded',filename:name}:s));
  return(
    <div style={{maxWidth:860,margin:'0 auto',padding:'1.5rem',background:T.bg,minHeight:'100vh'}}>
      <div style={{...C.row(8),marginBottom:'1.5rem'}}>
        <button onClick={()=>go(SC.DASH)} style={{fontSize:12,color:T.textMuted,background:'none',border:`1px solid ${T.border}`,borderRadius:9,padding:'5px 10px',cursor:'pointer',fontFamily:'inherit'}}>← Дашборд</button>
        <div><h2 style={C.h2}>Шаблоны договоров</h2><div style={{fontSize:12,color:T.textSubtle,marginTop:2}}>CLO-GEN использует эти шаблоны при генерации документов сделки</div></div>
        <div style={{marginLeft:'auto'}}><span style={{fontSize:12,color:T.green,fontWeight:600}}>{slots.filter(s=>s.status!=='empty').length} / 9 заполнено</span></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {['Equity','SAFE','Convertible Note'].map(type=>(
          <div key={type}>
            <div style={{fontSize:11,fontWeight:700,color:TYPE_COL[type],textTransform:'uppercase',letterSpacing:'.1em',marginBottom:10,padding:'5px 12px',background:TYPE_BG[type],borderRadius:9,border:`1px solid ${TYPE_COL[type]}30`}}>{type}</div>
            {slots.filter(s=>s.type===type).map(slot=>(
              <div key={slot.id} style={{...C.sm,marginBottom:10,padding:'12px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:600,color:T.text}}>{slot.juris}</span>
                  <span style={{fontSize:10,padding:'2px 8px',borderRadius:100,background:slot.status==='yc'?T.accentBg:slot.status==='uploaded'?T.greenBg:'#F3F1EC',color:slot.status==='yc'?T.accent:slot.status==='uploaded'?T.green:T.textSubtle,border:`1px solid ${slot.status==='yc'?T.accentBorder:slot.status==='uploaded'?T.greenBorder:T.border}`}}>
                    {slot.status==='yc'?'YC ссылка':slot.status==='uploaded'?'Загружен':'Пусто'}
                  </span>
                </div>
                {slot.status==='yc'&&<div style={{marginBottom:8}}><a href={slot.yc} target="_blank" rel="noreferrer" style={{fontSize:11,color:T.accent,textDecoration:'none'}}>🔗 ycombinator.com/documents</a><div style={{fontSize:10,color:T.textSubtle,marginTop:2}}>Актуальная версия с сайта YC</div></div>}
                {slot.status==='uploaded'&&<div style={{fontSize:11,color:T.green,marginBottom:8}}>✓ {slot.filename}</div>}
                {slot.status==='empty'&&<div style={{fontSize:11,color:T.textSubtle,marginBottom:8}}>Требуется внешний юрист</div>}
                <label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,padding:'5px 10px',borderRadius:8,border:`1px solid ${T.border}`,background:'#F8F7F4',color:T.textMuted,cursor:'pointer',fontFamily:'inherit'}}>
                  {slot.status==='uploaded'?'Заменить':'Загрузить шаблон'}
                  <input type="file" accept=".docx,.pdf" style={{display:'none'}} onChange={e=>{const n=e.target.files?.[0]?.name;if(n)upload(slot.id,n);}}/>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{marginTop:14,padding:'12px 16px',background:T.amberBg,borderRadius:10,border:`1px solid ${T.amberBorder}`,fontSize:12,color:T.amber}}>
        💡 Пустые слоты не блокируют анализ, но CLO-GEN пометит requires_external_lawyer: true. YC-шаблоны для Delaware подтягиваются автоматически.
      </div>
    </div>
  );
}

// ── Portfolio ──────────────────────────────────────────────────────────────
const PORTFOLIO=[
  {id:'P001',company:'FastRoute',stage:'Seed',invested:'$500,000',tranche:'Транш 1 из 2',status:'yellow',alerts:['MRR $27.5k — план $30k (-8.3%)'],nextTranche:'Транш 2 — $250,000',nextStatus:'partial',lastReport:'04.04.2026',kpi:[{name:'MRR',target:'$30,000',actual:'$27,500',status:'at_risk'},{name:'Retention D30',target:'40%',actual:'38%',status:'on_track'},{name:'Burn rate',target:'< $45k',actual:'$41k',status:'on_track'}]},
  {id:'P002',company:'AgriSense',stage:'Seed',invested:'$200,000',tranche:'Транш 1 из 1',status:'green',alerts:[],nextTranche:'—',nextStatus:'completed',lastReport:'03.04.2026',kpi:[{name:'MRR',target:'$15,000',actual:'$17,200',status:'on_track'},{name:'D30 Retention',target:'35%',actual:'42%',status:'on_track'}]},
];
const SM_META={green:{label:'В норме',bg:T.greenBg,col:T.green,dot:'#16a34a'},yellow:{label:'Требует внимания',bg:T.amberBg,col:T.amber,dot:'#d97706'},red:{label:'Критично',bg:T.redBg,col:T.red,dot:'#dc2626'}};
function Portfolio({go}){
  const [selected,setSel]=useState('P001');
  const [transcriptName,setTN]=useState('');
  const [reportName,setRN]=useState('');
  const company=PORTFOLIO.find(p=>p.id===selected);
  const sm=SM_META[company.status];
  return(
    <div style={{maxWidth:900,margin:'0 auto',padding:'1.5rem',background:T.bg,minHeight:'100vh'}}>
      <div style={{...C.row(8),marginBottom:'1.5rem'}}>
        <button onClick={()=>go(SC.DASH)} style={{fontSize:12,color:T.textMuted,background:'none',border:`1px solid ${T.border}`,borderRadius:9,padding:'5px 10px',cursor:'pointer',fontFamily:'inherit'}}>← Дашборд</button>
        <h2 style={C.h2}>Портфель — мониторинг</h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'1rem'}}>
        <div>
          <div style={{fontSize:10,color:T.textSubtle,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:10,fontWeight:700}}>Портфельные компании</div>
          {PORTFOLIO.map(p=>{const s=SM_META[p.status];return(
            <div key={p.id} onClick={()=>setSel(p.id)} style={{padding:'10px 12px',borderRadius:10,background:selected===p.id?s.bg:'transparent',border:`1px solid ${selected===p.id?s.dot+'44':'transparent'}`,cursor:'pointer',marginBottom:6}}>
              <div style={C.row(6)}><span style={{width:8,height:8,borderRadius:'50%',background:s.dot,flexShrink:0}}/><span style={{fontSize:13,fontWeight:600,color:T.text}}>{p.company}</span></div>
              <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{p.stage} · {p.invested}</div>
              <div style={{fontSize:11,color:s.col,marginTop:2,fontWeight:500}}>{s.label}</div>
            </div>
          );})}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{...C.card,background:sm.bg,border:`1px solid ${sm.dot}44`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={C.row(8)}><h2 style={{...C.h2,margin:0}}>{company.company}</h2><span style={{fontSize:12,padding:'3px 10px',borderRadius:100,background:'white',color:sm.col,border:`1px solid ${sm.dot}44`,fontWeight:600}}>{sm.label}</span></div>
                <div style={{fontSize:12,color:T.textMuted,marginTop:4}}>{company.tranche} · Отчёт: {company.lastReport}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,color:T.textMuted}}>Следующий транш</div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{company.nextTranche}</div>
              </div>
            </div>
            {company.alerts.length>0&&<div style={{marginTop:10,padding:'8px 12px',background:'white',borderRadius:9,border:`1px solid ${sm.dot}44`}}>{company.alerts.map((a,i)=><div key={i} style={{fontSize:12,color:sm.col}}>⚠ {a}</div>)}</div>}
          </div>
          <div style={C.card}>
            <h3 style={{...C.h3,marginBottom:12}}>KPI этого месяца</h3>
            {company.kpi.map((k,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:8,padding:'9px 0',borderTop:i?`1px solid ${T.borderLight}`:'none',alignItems:'center'}}>
                <span style={{fontSize:13,color:T.text,fontWeight:500}}>{k.name}</span>
                <span style={{fontSize:12,color:T.textMuted}}>план: {k.target}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.text}}>факт: {k.actual}</span>
                <span style={{fontSize:11,padding:'2px 9px',borderRadius:100,background:k.status==='on_track'?T.greenBg:T.amberBg,color:k.status==='on_track'?T.green:T.amber,fontWeight:600}}>{k.status==='on_track'?'✓ В норме':'⚠ Риск'}</span>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={C.card}>
              <h3 style={{...C.h3,marginBottom:8,fontSize:14}}>📄 Ежемесячный отчёт</h3>
              <p style={{fontSize:12,color:T.textMuted,marginBottom:12,lineHeight:1.6}}>Загрузите — агенты CFO-GEN, CLO-GEN, CHRO-GEN проверят milestone.</p>
              {reportName&&<div style={{fontSize:12,color:T.green,marginBottom:8}}>✓ {reportName}</div>}
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,padding:'8px 12px',borderRadius:9,border:`1px solid ${T.accentBorder}`,background:T.accentBg,color:T.accent,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>
                {reportName?'Заменить отчёт':'Загрузить отчёт'}
                <input type="file" accept=".pdf,.docx,.xlsx" style={{display:'none'}} onChange={e=>{const n=e.target.files?.[0]?.name;if(n)setRN(n);}}/>
              </label>
            </div>
            <div style={C.card}>
              <h3 style={{...C.h3,marginBottom:8,fontSize:14}}>🎙 Транскрипт встречи</h3>
              <p style={{fontSize:12,color:T.textMuted,marginBottom:12,lineHeight:1.6}}>Загрузите — CMO-GEN сгенерирует LinkedIn-пост и внутреннее саммари.</p>
              {transcriptName&&<div style={{fontSize:12,color:T.green,marginBottom:8}}>✓ {transcriptName}</div>}
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,padding:'8px 12px',borderRadius:9,border:`1px solid ${T.border}`,background:'#F8F7F4',color:T.textMuted,cursor:'pointer',fontFamily:'inherit'}}>
                {transcriptName?'Заменить':'Загрузить транскрипт (.txt)'}
                <input type="file" accept=".txt,.pdf" style={{display:'none'}} onChange={e=>{const n=e.target.files?.[0]?.name;if(n)setTN(n);}}/>
              </label>
              {transcriptName&&<div style={{marginTop:8,padding:'8px 12px',background:T.greenBg,borderRadius:9,fontSize:11,color:T.green,fontWeight:500}}>✓ CMO-GEN генерирует LinkedIn-пост → фаундеру на согласование</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setS]=useState(SC.HOME);
  const [screenProps,setSP]=useState({});
  const navigate=(sc,props={})=>{setSP(props);setS(sc);};
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif',background:T.bg,minHeight:'100vh'}}>
      {screen===SC.HOME   &&<Home go={navigate}/>}
      {screen===SC.FORM   &&<Form go={navigate}/>}
      {screen===SC.PROC   &&<Proc go={navigate} noTraction={screenProps.noTraction} stage={screenProps.stage}/>}
      {screen===SC.STATUS &&<StatusPage go={navigate} lang={screenProps.lang||'ru'}/>}
      {screen===SC.DASH   &&<Dash go={navigate}/>}
      {screen===SC.ACCT   &&<Accountant go={navigate}/>}
      {screen===SC.TMPL   &&<Templates go={navigate}/>}
      {screen===SC.PORT   &&<Portfolio go={navigate}/>}
    </div>
  );
}