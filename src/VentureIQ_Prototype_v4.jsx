import { useState, useRef, useEffect, useCallback } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

// ── Icons ──────────────────────────────────────────────────────────────────
const ICheck  = ({sz=14,col="#16a34a"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IWarn   = ({sz=14,col="#d97706"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IXc     = ({sz=14,col="#dc2626"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const ISend   = ({sz=14,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IDown   = ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
const IUp     = ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>;
const IArrow  = ({sz=14,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IZap    = ({sz=14,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IChat   = ({sz=14,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IDl     = ({sz=12,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IInfo   = ({sz=13,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const IFile   = ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IPlus   = ({sz=13,col="#1d4ed8"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IX      = ({sz=13}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IGlobe  = ({sz=14,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const ISave   = ({sz=13,col="#16a34a"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IClock  = ({sz=13,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IEye    = ({sz=13,col="#6b7280"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const ILinkedIn = ({sz=13}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="#0077b5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const IUser   = ({sz=13,col="#9ca3af"}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;


// ── Constants ──────────────────────────────────────────────────────────────
const SC = { HOME:'home', FORM:'form', PROC:'proc', DASH:'dash', STATUS:'status' };
const sc   = s => s>=7?'#16a34a':s>=5?'#d97706':'#dc2626';
const scBg = s => s>=7?'#f0fdf4':s>=5?'#fffbeb':'#fef2f2';
const AIDS = ['cmo','clo','cfo','cpo','cro','chro'];

const ACTIVITIES_RU = [
  'SaaS / B2B-платформа','Маркетплейс','Мобильное приложение',
  'Fintech / Payments','Edtech','Logistics Tech / Supply Chain',
  'HR Tech / Recruitment','Legal Tech','E-commerce / Retail Tech',
  'PropTech','Agritech','Mediatech / Content',
  'Adtech / Marketing Tech','CRM / ERP','Analytics / BI',
  'Dev Tools / API','Cybersecurity (без R&D)','IoT Platform (без R&D)',
];

const ACTIVITIES_EN = [
  'SaaS / B2B Platform','Marketplace','Mobile App',
  'Fintech / Payments','Edtech','Logistics Tech / Supply Chain',
  'HR Tech / Recruitment','Legal Tech','E-commerce / Retail Tech',
  'PropTech','Agritech','Mediatech / Content',
  'Adtech / Marketing Tech','CRM / ERP','Analytics / BI',
  'Dev Tools / API','Cybersecurity (no R&D)','IoT Platform (no R&D)',
];

const COUNTRIES_RU = ['Казахстан','Узбекистан','Кыргызстан','Таджикистан','Туркменистан','Россия','США','Другая'];
const COUNTRIES_EN = ['Kazakhstan','Uzbekistan','Kyrgyzstan','Tajikistan','Turkmenistan','Russia','USA','Other'];
const CA_RU = ['Казахстан','Узбекистан','Кыргызстан','Таджикистан','Туркменистан'];
const CA_EN = ['Kazakhstan','Uzbekistan','Kyrgyzstan','Tajikistan','Turkmenistan'];

const ROLES_RU = ['CEO','CTO','CPO','CMO','CFO','COO','CSO','Другая'];
const ROLES_EN = ['CEO','CTO','CPO','CMO','CFO','COO','CSO','Other'];

const LINK_TYPES_RU = ['LinkedIn','Сайт','Instagram','Telegram','Twitter/X','Другое'];
const LINK_TYPES_EN = ['LinkedIn','Website','Instagram','Telegram','Twitter/X','Other'];

const LINK_PLACEHOLDERS = {
  'LinkedIn': 'linkedin.com/in/username',
  'Сайт': 'example.com',
  'Website': 'example.com',
  'Instagram': 'instagram.com/username',
  'Telegram': 't.me/username',
  'Twitter/X': 'twitter.com/username',
  'Другое': 'https://',
  'Other': 'https://',
};

const SUBDOCS = [
  { id:'mkt',   labelRu:'Market Sizing (TAM/SAM/SOM)', labelEn:'Market Sizing (TAM/SAM/SOM)',  hint:'Расчёт TAM/SAM/SOM с источниками данных. CMO+CCO верифицирует рыночные заявления — без источников это красный флаг.',  hintEn:'TAM/SAM/SOM calculation with data sources. CMO+CCO verifies market claims — no sources is a red flag.', requiredFor:['seed','pre-seed'] },
  { id:'tech',  labelRu:'Technology Overview', labelEn:'Technology Overview',          hint:'Описание технологического стека и архитектуры. CPO+CTO оценит обоснованность выбора и масштабируемость.', hintEn:'Tech stack and architecture description. CPO+CTO will assess choices and scalability.', requiredFor:['seed','pre-seed'] },
  { id:'unit',  labelRu:'Unit Economics', labelEn:'Unit Economics',                hint:'CAC, LTV, payback period, gross margin. CFO сравнит с отраслевыми бенчмарками.', hintEn:'CAC, LTV, payback period, gross margin. CFO will benchmark against industry.', requiredFor:['seed'], optionalFor:['pre-seed'] },
  { id:'founders',labelRu:'Профили основателей', labelEn:'Founder Profiles',        hint:'CV/резюме каждого фаундера: образование, опыт, предыдущие проекты. CHRO верифицирует через LinkedIn.', hintEn:'CV/resume for each founder: education, experience, prior projects. CHRO verifies via LinkedIn.', requiredFor:['seed','pre-seed'] },
  { id:'cap',   labelRu:'Таблица капитализации (Cap Table)', labelEn:'Cap Table',   hint:'Распределение долей: основатели, инвесторы, ESOP — с историей изменений.', hintEn:'Share distribution: founders, investors, ESOP — with change history.', requiredFor:['seed','pre-seed'] },
  { id:'val',   labelRu:'Оценка компании (Pre-money)', labelEn:'Company Valuation (Pre-money)', hint:'Обоснование оценки с методологией. Если нет — CFO рассчитает тремя методами.', hintEn:'Valuation justification with methodology. Without it — CFO will calculate via 3 methods.', requiredFor:['seed'], optionalFor:['pre-seed'] },
];

const CAT2_DOCS = [
  { id:'demo', labelRu:'Product Demo', labelEn:'Product Demo', hint:'Demo credentials, видео 5–15 мин или ссылка. CPO+CTO пройдёт продукт изнутри.', hintEn:'Demo credentials, 5–15 min walkthrough or link. CPO+CTO will go through the product.', requiredFor:['seed'], optionalFor:['pre-seed'] },
  { id:'rounds', labelRu:'Документы предыдущих раундов', labelEn:'Previous Round Documents', hint:'Term sheet, SAFE, конвертируемые займы. Первый раунд — так и отметьте.', hintEn:'Term sheet, SAFE, convertible notes. First round — mark it as such.', optionalFor:['seed','pre-seed'] },
];

const CAT3_DOCS = [
  { id:'ip',       labelRu:'IP Assignment Agreements', labelEn:'IP Assignment Agreements', hint:'Соглашения о передаче прав на IP от основателей и разработчиков.', hintEn:'IP transfer agreements from founders and developers.' },
  { id:'tm',       labelRu:'Товарные знаки, домен и Open Source', labelEn:'Trademarks, Domain & Open Source', hint:'Свидетельства на ТЗ, документы на домен, перечень OSS с лицензиями.', hintEn:'Trademark certificates, domain docs, OSS list with licenses.' },
  { id:'corp',     labelRu:'Учредительные документы', labelEn:'Incorporation Documents', hint:'Устав, свидетельство о регистрации, SHA.', hintEn:'Articles of incorporation, registration certificate, SHA.' },
  { id:'contracts',labelRu:'Договоры с сотрудниками и подрядчиками', labelEn:'Employee & Contractor Agreements', hint:'Шаблоны или обезличенные договоры с NDA.', hintEn:'Templates or anonymized contracts with NDA.' },
  { id:'tos',      labelRu:'Terms of Service & Privacy Policy', labelEn:'Terms of Service & Privacy Policy', hint:'Публичные документы на сайте. Нарушения законодательства о данных = регуляторный риск.', hintEn:'Public docs on your site. Data law violations = regulatory risk.' },
];

const VALIDATORS = {
  company: (v, lang) => !v.trim() ? (lang==='ru'?'Введите название компании':'Enter company name') : v.trim().length < 2 ? (lang==='ru'?'Слишком короткое':'Too short') : '',
  email:   (v, lang) => !v.trim() ? (lang==='ru'?'Введите email':'Enter email') : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? (lang==='ru'?'Некорректный email':'Invalid email') : '',
  desc:    (v, lang) => !v.trim() ? (lang==='ru'?'Введите описание':'Enter description') : v.trim().length < 30 ? `${lang==='ru'?'Минимум 30 символов':'Min 30 chars'} (${v.trim().length})` : '',
  activity:(v, lang) => !v ? (lang==='ru'?'Выберите вид деятельности':'Select business type') : '',
  amount:  (v, lang) => v && !/^[\d\s,.']+$/.test(v) ? (lang==='ru'?'Только цифры':'Numbers only') : '',
};

// ── Activity ↔ Description match ───────────────────────────────────────────
const ACTIVITY_RULES = [
  { key:'SaaS / B2B-платформа',          kw:['saas','b2b','подписк','платформ','mrr','arr','api','лицензи','subscription'],         invested:true },
  { key:'Маркетплейс',                   kw:['маркетплейс','marketplace','продав','покупател','транзакц','комисси','листинг'],       invested:true },
  { key:'Мобильное приложение',          kw:['мобил','приложен','app','ios','android','пользовател','dau','mau'],                   invested:true },
  { key:'Fintech / Payments',            kw:['fintech','финтех','платёж','payment','транзакц','банк','кошелёк','эквайр'],           invested:true },
  { key:'Edtech',                        kw:['edtech','образован','обучен','курс','студент','учащ','школ','learning'],               invested:true },
  { key:'Logistics Tech / Supply Chain', kw:['логистик','доставк','груз','склад','маршрут','перевозк','tms','wms'],                 invested:true },
  { key:'HR Tech / Recruitment',         kw:['hr','рекрутинг','найм','сотрудник','персонал','кандидат','recruitment'],              invested:true },
  { key:'Legal Tech',                    kw:['юридич','legal','договор','право','документ','нотариус','compliance'],                invested:true },
  { key:'E-commerce / Retail Tech',      kw:['ecommerce','e-commerce','интернет-магазин','ритейл','розниц','товар','корзин'],       invested:true },
  { key:'PropTech',                      kw:['недвижим','proptech','аренд','жильё','ипотек','объект','риелтор'],                    invested:true },
  { key:'Agritech',                      kw:['агро','сельск','agri','ферм','урожай','посев','животновод'],                          invested:true },
  { key:'Mediatech / Content',           kw:['медиа','контент','media','видео','подкаст','стриминг','creator'],                    invested:true },
  { key:'Adtech / Marketing Tech',       kw:['реклам','adtech','маркетинг','таргетинг','attribution'],                             invested:true },
  { key:'CRM / ERP',                     kw:['crm','erp','автоматизац','бизнес-процес','pipeline','воронк'],                       invested:true },
  { key:'Analytics / BI',               kw:['аналитик','bi','dashboard','данные','data','отчёт','метрик','insight'],               invested:true },
  { key:'Dev Tools / API',              kw:['dev','api','разработчик','инструмент','sdk','cli','developer'],                        invested:true },
  { key:'Cybersecurity (без R&D)',       kw:['безопасност','cyber','угроз','защит','уязвимост','пентест','soc'],                   invested:true },
  { key:'IoT Platform (без R&D)',        kw:['iot','устройств','датчик','sensor','умный','smart'],                                  invested:true },
];

function checkDescVsActivity(desc, activityRu, lang) {
  if (!desc || desc.trim().length < 20 || !activityRu) return null;
  const rule = ACTIVITY_RULES.find(r => r.key === activityRu);
  if (!rule) return null;
  if (!rule.invested) return {
    type: 'blocked',
    msg: lang === 'ru'
      ? `Activat VC не инвестирует в «${activityRu}». Выберите другой вид деятельности.`
      : `Activat VC does not invest in "${activityRu}". Please choose a different business type.`,
  };
  const d = desc.toLowerCase();
  const matched = rule.kw.filter(k => d.includes(k));
  if (matched.length === 0) return {
    type: 'mismatch',
    msg: lang === 'ru'
      ? `Описание не соответствует типу «${activityRu}». Упомяните ключевые аспекты бизнеса (например: ${rule.kw.slice(0,3).join(', ')}) — или выберите другой вид деятельности.`
      : `Description doesn't match type "${activityRu}". Mention what you build (e.g. ${rule.kw.slice(0,3).join(', ')}) — or select a different business type.`,
  };
  return null;
}


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
  summary:["FastRoute — B2B SaaS оптимизации логистики для рынка ЦА с подтверждённым PMF. Retention D30 = 61% при медиане B2B SaaS 42% — продукт нужен рынку.","Ключевые риски: критическая клиентская концентрация (43%) и отсутствие Advisor Agreement. Pre-money $5.2M выше расчётного диапазона $4.5–5.0M.","Рекомендация: инвестиция при 4 условиях — Advisor Agreement до закрытия, P&L за 6 мес., ковенант по концентрации в Term Sheet, CTO full-time как milestone Транша 1."],
  q:["Как снизить зависимость от ключевого клиента с 43% до <20% за 12 мес.?","Реальная история MoM роста за 6 месяцев помесячно?","Условия перехода CTO на full-time?","Почему Advisor Agreement не оформлен?","Pipeline замены ключевого клиента?"],
};

const ORCH = {
  'почему':'Score 7.4 сдерживается CRO 5.9 — концентрация одного клиента (43%) без ковенанта. CHRO 8.1 и CPO+CTO 7.5 тянут вверх. При закрытии риска скор вырастет до 7.8–8.1.',
  'риск':'Два критических: (1) один клиент = 43% — уход = кассовый разрыв за 3–4 мес.; (2) Advisor Agreement не оформлен. Оба — обязательные условия сделки.',
  'условия':'До закрытия: Advisor Agreement + P&L за 6 мес. После: ковенант по концентрации в Term Sheet. Milestone Транша 1: CTO full-time.',
  'оценк':'По трём методам CFO: $4.3M / $4.7M / $3.9M. Заявленная $5.2M выше. Переговорная позиция — $4.5–5.0M.',
  'default':'Уточните вопрос: по агенту (CFO, CRO...), условиям сделки, оценке или рискам.',
};

const ASSIST_RU = {
  'pre-seed':'На pre-seed обязательны: Pitch Deck + Market Sizing + Technology Overview + Профили основателей + Cap Table + Финансовая модель. Unit Economics и Оценка компании — загружайте если есть.',
  'seed':'На seed обязательны все документы Категории 1. Product Demo важен — CPO+CTO проходит продукт изнутри.',
  'трекш':'Рекомендую: свяжитесь с инвестором для интервью с фаундерами до финального анализа — это повысит оценку CHRO и CRO.',
  'pitch':'Pitch Deck — 10–20 слайдов. К нему нужны субдокументы: Market Sizing, Tech Overview, Unit Economics, Профили, Cap Table, Оценка.',
  'default':'Заполните форму максимально полно. Нажмите ⓘ рядом с любым документом — объясню что загружать.',
};

const ASSIST_EN = {
  'pre-seed':'For pre-seed you need: Pitch Deck + Market Sizing + Technology Overview + Founder Profiles + Cap Table + Financial Model. Unit Economics and Valuation — upload if available.',
  'seed':'For seed, all Category 1 documents are required. Product Demo is important — CPO+CTO goes through the product.',
  'traction':'I recommend: contact the investor for a founder interview before final analysis — this significantly improves CHRO and CRO scores.',
  'pitch':'Pitch Deck — 10–20 slides. Attach sub-documents: Market Sizing, Tech Overview, Unit Economics, Profiles, Cap Table, Valuation.',
  'default':'Fill the form as completely as possible. Click ⓘ next to any document — I will explain what to upload.',
};

// ── Design System ──────────────────────────────────────────────────────────
const T = {
  // Palette
  bg: '#F8F7F4',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E8E6E0',
  borderLight: '#F0EEE9',
  text: '#1A1714',
  textMuted: '#7A7470',
  textSubtle: '#A89F99',
  accent: '#1A4FD6',
  accentBg: 'rgba(26,79,214,0.06)',
  accentBorder: 'rgba(26,79,214,0.2)',
  green: '#0F7B3C',
  greenBg: '#EDFAF3',
  greenBorder: '#86EFAC',
  red: '#C72A1C',
  redBg: '#FEF2F2',
  redBorder: '#FCA5A5',
  amber: '#B35B00',
  amberBg: '#FFFBEB',
  amberBorder: '#FDE68A',
};

const C = {
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    padding: '1.25rem',
    boxShadow: '0 1px 4px rgba(26,23,20,0.06), 0 0 0 0.5px rgba(26,23,20,0.04)',
  },
  sm: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: '.75rem 1rem',
  },
  inp: {
    width: '100%',
    padding: '9px 12px',
    fontSize: 13,
    borderRadius: 9,
    border: `1.5px solid ${T.border}`,
    background: '#FAFAF8',
    color: T.text,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color .15s, box-shadow .15s',
    lineHeight: 1.4,
  },
  label: { fontSize: 12, color: T.textMuted, marginBottom: 4, fontWeight: 500, letterSpacing: '0.01em' },
  h2: { fontSize: 20, fontWeight: 600, color: T.text, margin: 0, letterSpacing: '-0.3px' },
  h3: { fontSize: 15, fontWeight: 600, color: T.text, margin: 0, letterSpacing: '-0.15px' },
  row: (g=8) => ({ display: 'flex', alignItems: 'center', gap: g }),
  tag: { fontSize: 11, padding: '3px 9px', borderRadius: 100, background: '#F3F1EC', color: T.textMuted, fontWeight: 500 },
  badge: (col, bg) => ({ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: bg, color: col, fontWeight: 600 }),
};

// ── Language strings ───────────────────────────────────────────────────────
const LANGS = {
  ru: {
    formTitle: 'Заявка на рассмотрение',
    back: '← Назад',
    blockA: 'Базовая информация',
    blockB: 'Загрузка документов',
    founder: 'Фаундер',
    addFounder: 'Добавить фаундера',
    company: 'Название компании *',
    activity: 'Вид деятельности *',
    stage: 'Стадия проекта *',
    email: 'Email *',
    desc: 'Описание проекта *',
    amount: 'Запрашиваемые инвестиции',
    submit: '✓ Отправить на анализ — запустить 6 агентов параллельно',
    submitDisabled: 'Заполните обязательные документы Категории 1',
    cat1: 'Категория 1 — Обязательные',
    cat1sub: 'Pitch Deck с субдокументами · Финансовая модель',
    cat2: 'Категория 2 — Дополнительные',
    cat3: 'Категория 3 — Юридический пакет',
    cat3note: 'Условие закрытия сделки',
    upload: 'Загрузить',
    replace: 'Заменить',
    optional: 'если есть',
    firstRound: '1-й раунд',
    firstRoundConfirmed: '✓ 1-й раунд',
    gateOk: 'Gate Check пройден',
    gateCheck: 'Проверить Gate Check →',
    previewTitle: 'Предпросмотр файла',
    savedAt: 'Сохранено',
    restoredBanner: 'Черновик восстановлен',
    restoredSub: 'Данные восстановлены из автосохранения',
    dismiss: 'Закрыть',
    filledOf: 'Заполнено',
    fields: 'полей',
    preSeedOption: 'Pre-seed — идея / прототип',
    seedOption: 'Seed — MVP + первые клиенты',
    adaptedFor: 'Адаптировано под:',
    assistantTitle: 'ИИ-ассистент',
    assistantSub: 'Нажмите ⓘ у любого документа',
    askPlaceholder: 'Задайте вопрос...',
    analysisTime: 'Обычно занимает 5–10 минут',
    statusTitle: 'Статус заявки',
    statusSub: 'FastRoute · Seed · Logistics Tech',
    statusSteps: ['Принято','Обрабатывается','Готово'],
    statusDesc: ['Заявка получена и поставлена в очередь.','6 ИИ-агентов параллельно анализируют стартап.','Анализ завершён. Результаты доступны инвестору.'],
    viewReport: 'Посмотреть отчёт',
    country: 'Страна',
    name: 'ФИО',
    role: 'Роль',
    linkType: 'Тип ссылки',
    linkUrl: 'Ссылка / профиль',
    subdocsHeader: 'Субдокументы к Pitch Deck',
    cat2seed: 'Product Demo обязателен',
    cat2preseed: 'Загружайте если есть',
    autosaveHint: 'Автосохранение каждые 30 сек',
    saveNow: 'Сохранить сейчас',
    ofWord: 'из',
  },
  en: {
    formTitle: 'Application for Review',
    back: '← Back',
    blockA: 'Basic Information',
    blockB: 'Document Upload',
    founder: 'Founder',
    addFounder: 'Add founder',
    company: 'Company name *',
    activity: 'Business type *',
    stage: 'Project stage *',
    email: 'Email *',
    desc: 'Project description *',
    amount: 'Investment requested',
    submit: '✓ Submit for analysis — launch 6 agents in parallel',
    submitDisabled: 'Fill in mandatory Category 1 documents',
    cat1: 'Category 1 — Mandatory',
    cat1sub: 'Pitch Deck with sub-documents · Financial Model',
    cat2: 'Category 2 — Additional',
    cat3: 'Category 3 — Legal Package',
    cat3note: 'Required for deal closing',
    upload: 'Upload',
    replace: 'Replace',
    optional: 'if available',
    firstRound: '1st round',
    firstRoundConfirmed: '✓ 1st round',
    gateOk: 'Gate Check passed',
    gateCheck: 'Run Gate Check →',
    previewTitle: 'File Preview',
    savedAt: 'Saved',
    restoredBanner: 'Draft restored',
    restoredSub: 'Data restored from autosave',
    dismiss: 'Dismiss',
    filledOf: 'Filled',
    fields: 'fields',
    preSeedOption: 'Pre-seed — idea / prototype',
    seedOption: 'Seed — MVP + first clients',
    adaptedFor: 'Adapted for:',
    assistantTitle: 'AI Assistant',
    assistantSub: 'Click ⓘ next to any document',
    askPlaceholder: 'Ask a question...',
    analysisTime: 'Usually takes 5–10 minutes',
    statusTitle: 'Application Status',
    statusSub: 'FastRoute · Seed · Logistics Tech',
    statusSteps: ['Received','Processing','Complete'],
    statusDesc: ['Application received and queued for analysis.','6 AI agents are analyzing your startup in parallel.','Analysis complete. Results available to the investor.'],
    viewReport: 'View Report',
    country: 'Country',
    name: 'Full Name',
    role: 'Role',
    linkType: 'Link type',
    linkUrl: 'Link / profile URL',
    subdocsHeader: 'Pitch Deck sub-documents',
    cat2seed: 'Product Demo required',
    cat2preseed: 'Upload if available',
    autosaveHint: 'Autosave every 30 seconds',
    saveNow: 'Save now',
    ofWord: 'of',
  }
};

// ── Autosave hook ──────────────────────────────────────────────────────────
function useAutosave(data, key = 'ventureiq_form_draft') {
  const [lastSaved, setLastSaved] = useState(null);
  const [restored, setRestored] = useState(false);
  const loadDraft = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) { setRestored(true); return JSON.parse(raw); }
    } catch {}
    return null;
  }, [key]);
  useEffect(() => {
    const save = () => {
      try { sessionStorage.setItem(key, JSON.stringify({ ...data, _savedAt: Date.now() })); setLastSaved(new Date()); } catch {}
    };
    const iv = setInterval(save, 30000);
    return () => clearInterval(iv);
  }, [data, key]);
  const saveNow = useCallback(() => {
    try { sessionStorage.setItem(key, JSON.stringify({ ...data, _savedAt: Date.now() })); setLastSaved(new Date()); } catch {}
  }, [data, key]);
  const clearDraft = useCallback(() => { sessionStorage.removeItem(key); setRestored(false); }, [key]);
  return { loadDraft, lastSaved, restored, saveNow, clearDraft };
}

// ── useIsMobile hook ───────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [mob, setMob] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mob;
}


// ── ValidatedInput ─────────────────────────────────────────────────────────
function ValidatedInput({ style, value, onChange, validator, placeholder, disabled, multiline, rows }) {
  const [touched, setTouched] = useState(false);
  const err = touched && validator ? validator(value) : '';
  const borderColor = touched ? (err ? T.red : T.green) : T.border;
  const bgColor = touched ? (err ? '#FEF8F7' : '#F6FDF9') : '#FAFAF8';
  const baseStyle = { ...C.inp, ...style, border: `1.5px solid ${borderColor}`, background: bgColor };
  return (
    <div style={{ position: 'relative' }}>
      {multiline
        ? <textarea style={{ ...baseStyle, height: 72, resize: 'vertical', lineHeight: 1.5 }} value={value} onChange={onChange} onBlur={() => setTouched(true)} placeholder={placeholder} disabled={disabled} />
        : <input style={baseStyle} value={value} onChange={onChange} onBlur={() => setTouched(true)} placeholder={placeholder} disabled={disabled} />
      }
      {touched && err && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <IXc sz={11} />
          <span style={{ fontSize: 11, color: T.red }}>{err}</span>
        </div>
      )}
    </div>
  );
}

// ── File Preview Modal ─────────────────────────────────────────────────────
function FilePreviewModal({ file, onClose, lang }) {
  const t = LANGS[lang];
  if (!file) return null;
  const ext = file.name.split('.').pop().toLowerCase();
  const isImage = ['jpg','jpeg','png','gif','webp'].includes(ext);
  const isPDF = ext === 'pdf';
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,23,20,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: T.surface, borderRadius: 18, padding: '1.5rem', maxWidth: 560, width: '92%', boxShadow: '0 32px 64px rgba(0,0,0,0.22)', border: `1px solid ${T.border}` }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={C.row(8)}><IFile sz={16} /><span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t.previewTitle}</span></div>
          <button onClick={onClose} style={{ background: '#F3F1EC', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 8, display: 'flex' }}><IX sz={14} /></button>
        </div>
        <div style={{ background: '#F8F7F4', borderRadius: 12, padding: '1rem', marginBottom: '1rem', border: `1px solid ${T.border}`, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {file.url && isImage && <img src={file.url} alt={file.name} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain' }} />}
          {file.url && isPDF && <iframe src={file.url} style={{ width: '100%', height: 300, border: 'none', borderRadius: 8 }} title="PDF Preview" />}
          {!file.url && <div style={{ textAlign: 'center', color: T.textMuted }}><IFile sz={36} /><div style={{ marginTop: 10, fontSize: 13, fontWeight: 500 }}>{file.name}</div><div style={{ fontSize: 11, marginTop: 4, color: T.textSubtle }}>{(file.size/1024).toFixed(0)} KB · {ext.toUpperCase()}</div></div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#F8F7F4', borderRadius: 9, border: `1px solid ${T.borderLight}` }}>
          <IFile sz={13} />
          <span style={{ fontSize: 12, color: T.textMuted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
          <span style={{ fontSize: 11, color: T.textSubtle, flexShrink: 0 }}>{(file.size/1024).toFixed(0)} KB</span>
        </div>
      </div>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────
function FormProgressBar({ filled, total, lang }) {
  const t = LANGS[lang];
  const pct = Math.round((filled / total) * 100);
  const color = pct === 100 ? T.green : pct >= 60 ? T.amber : T.accent;
  const trackColor = pct === 100 ? '#EDFAF3' : pct >= 60 ? '#FFFBEB' : T.accentBg;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={C.row(6)}>
          <span style={{ fontSize: 12, color: T.textMuted }}>{t.filledOf}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{filled} {t.ofWord} {total}</span>
          <span style={{ fontSize: 12, color: T.textMuted }}>{t.fields}</span>
        </div>
        <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color, background: trackColor, padding: '2px 8px', borderRadius: 6 }}>{pct}%</span>
      </div>
      <div style={{ height: 7, background: '#F0EEE9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  );
}

// ── Autosave Banner ────────────────────────────────────────────────────────
function AutosaveBanner({ restored, lastSaved, onDismiss, lang, onSaveNow }) {
  const t = LANGS[lang];
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  if (restored) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: T.accentBg, borderRadius: 10, border: `1px solid ${T.accentBorder}` }}>
      <ISave sz={14} col={T.accent} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{t.restoredBanner}</div>
        <div style={{ fontSize: 11, color: T.accent, opacity: 0.7 }}>{t.restoredSub}</div>
      </div>
      <button onClick={() => { onDismiss(); setVisible(false); }} style={{ fontSize: 11, color: T.textMuted, background: 'white', border: `1px solid ${T.border}`, borderRadius: 7, padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit' }}>{t.dismiss}</button>
    </div>
  );
  if (lastSaved) {
    const timeStr = lastSaved.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: T.greenBg, borderRadius: 10, border: `1px solid ${T.greenBorder}` }}>
        <ISave sz={12} col={T.green} />
        <span style={{ fontSize: 11, color: T.green, fontWeight: 500 }}>{t.savedAt} {timeStr}</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#F8F7F4', borderRadius: 10, border: `1px solid ${T.border}` }}>
      <IClock sz={12} />
      <span style={{ fontSize: 11, color: T.textMuted }}>{t.autosaveHint}</span>
      <button onClick={onSaveNow} style={{ marginLeft: 'auto', fontSize: 11, color: T.textMuted, background: 'white', border: `1px solid ${T.border}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>{t.saveNow}</button>
    </div>
  );
}

// ── Chat ───────────────────────────────────────────────────────────────────
function Chat({ init, kb, quick = [], height = 380, extraMsgs = [] }) {
  const [msgs, setM] = useState([{ r: 'a', t: init }]);
  const [inp, setI] = useState('');
  const [loading, setL] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);
  useEffect(() => { if (extraMsgs.length > 0) setM(p => [...p, ...extraMsgs.map(t => ({ r: 'a', t }))]); }, [extraMsgs.join('|')]);
  const send = t => {
    const q = t || inp.trim(); if (!q || loading) return;
    setI(''); setL(true);
    setM(p => [...p, { r: 'u', t: q }]);
    const k = Object.keys(kb).find(k => k !== 'default' && q.toLowerCase().includes(k));
    setTimeout(() => { setM(p => [...p, { r: 'a', t: kb[k || 'default'] }]); setL(false); }, 650);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '.75rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.r === 'u' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '92%', padding: '9px 13px', borderRadius: m.r === 'u' ? '14px 14px 3px 14px' : '3px 14px 14px 14px', background: m.r === 'u' ? T.accentBg : '#F3F1EC', fontSize: 13, lineHeight: 1.65, color: m.r === 'u' ? T.accent : T.text, whiteSpace: 'pre-wrap', border: m.r === 'u' ? `1px solid ${T.accentBorder}` : `1px solid ${T.borderLight}` }}>{m.t}</div>
          </div>
        ))}
        {loading && <div style={{ display: 'flex', gap: 5, padding: '9px 13px', background: '#F3F1EC', borderRadius: '3px 14px 14px 14px', width: 'fit-content', border: `1px solid ${T.borderLight}` }}>{[0,1,2].map(i => <span key={i} style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: T.textSubtle, animation: `dp 1.4s ${i*.2}s infinite` }} />)}</div>}
        <div ref={endRef} />
      </div>
      {quick.length > 0 && <div style={{ padding: '0 .75rem .5rem', display: 'flex', flexDirection: 'column', gap: 5 }}>{quick.map(q => <button key={q} onClick={() => send(q)} style={{ textAlign: 'left', padding: '6px 11px', fontSize: 12, color: T.textMuted, background: '#F8F7F4', border: `1px solid ${T.border}`, borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .12s' }}>{q}</button>)}</div>}
      <div style={{ padding: '.75rem', borderTop: `1px solid ${T.borderLight}`, display: 'flex', gap: 8 }}>
        <input style={{ ...C.inp, flex: 1 }} placeholder="Задайте вопрос..." value={inp} onChange={e => setI(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} disabled={loading} />
        <button onClick={() => send()} disabled={loading || !inp.trim()} style={{ padding: '9px 13px', borderRadius: 9, background: T.accentBg, border: `1px solid ${T.accentBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: (loading || !inp.trim()) ? 0.45 : 1, transition: 'opacity .15s' }}><ISend /></button>
      </div>
      <style>{`@keyframes dp{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
    </div>
  );
}

// ── SlotRow ────────────────────────────────────────────────────────────────
function SlotRow({ slot, value, fileObj, optional, onUpload, onInfo, sub = false, firstRound, onFirstRound, onPreview, lang = 'ru' }) {
  const t = LANGS[lang];
  const filled = Boolean(value) || firstRound;
  const label = lang === 'ru' ? slot.labelRu : slot.labelEn;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: `1px solid ${sub ? T.borderLight : T.borderLight}`, paddingLeft: sub ? 16 : 0 }}>
      {sub && <div style={{ width: 10, height: 1, background: T.border, flexShrink: 0 }} />}
      <div style={{ flexShrink: 0 }}>
        {filled ? <ICheck sz={13} /> : optional ? <span style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:13,height:13,borderRadius:'50%',border:`1px solid ${T.border}`,fontSize:9,color:T.textSubtle }}>?</span> : <IXc sz={13} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={C.row(5)}>
          <span style={{ fontSize: 13, fontWeight: sub ? 400 : 500, color: T.text }}>{label}</span>
          {optional && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: '#F3F1EC', color: T.textSubtle }}>{t.optional}</span>}
        </div>
        {value && !firstRound && <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>}
        {firstRound && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{lang === 'ru' ? 'Первый раунд' : 'First round'}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <button onClick={() => onInfo(slot)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6, color: T.textSubtle }} title="ⓘ"><IInfo /></button>
        {value && fileObj && <button onClick={() => onPreview(fileObj)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6 }} title={lang === 'ru' ? 'Превью' : 'Preview'}><IEye /></button>}
        {slot.id === 'rounds' && !value && (
          <button onClick={onFirstRound} style={{ fontSize: 11, color: T.textMuted, padding: '3px 8px', border: `1px solid ${T.border}`, borderRadius: 7, cursor: 'pointer', background: firstRound ? T.greenBg : 'white', fontFamily: 'inherit', whiteSpace: 'nowrap', fontWeight: firstRound ? 600 : 400 }}>
            {firstRound ? t.firstRoundConfirmed : t.firstRound}
          </button>
        )}
        <label style={{ fontSize: 12, color: filled ? T.textMuted : T.red, padding: '5px 10px', border: `1.5px solid ${filled ? T.border : T.redBorder}`, borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, background: filled ? '#F8F7F4' : T.redBg, fontWeight: 500, transition: 'all .15s' }}>
          {filled && !firstRound ? t.replace : t.upload}
          <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(slot.id, f.name, f); }} />
        </label>
      </div>
    </div>
  );
}

// ── Lang Toggle ───────────────────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#F0EEE9', borderRadius: 10, padding: 3 }}>
      {['ru', 'en'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: lang === l ? 700 : 500, background: lang === l ? '#fff' : 'transparent', color: lang === l ? T.text : T.textSubtle, boxShadow: lang === l ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all .15s', letterSpacing: '0.03em' }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ── Status Page ────────────────────────────────────────────────────────────
function StatusPage({ go, lang = 'ru' }) {
  const t = LANGS[lang];
  const [step, setStep] = useState(1);
  useEffect(() => { const t1 = setTimeout(() => setStep(2), 3500); return () => clearTimeout(t1); }, []);
  const steps = t.statusSteps;
  const descs = t.statusDesc;
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '3.5rem 1.5rem', textAlign: 'center', background: T.bg, minHeight: '100vh' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#F0EEE9', borderRadius: 100, marginBottom: 16 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent }} />
        <span style={{ fontSize: 11, letterSpacing: '.12em', color: T.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>VentureIQ</span>
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: '0 0 .5rem', letterSpacing: '-0.5px' }}>{t.statusTitle}</h2>
      <p style={{ fontSize: 13, color: T.textMuted, marginBottom: '2.5rem' }}>{t.statusSub}</p>

      <div style={{ position: 'relative', marginBottom: '2.5rem', padding: '0 1rem' }}>
        <div style={{ position: 'absolute', top: 20, left: '18%', right: '18%', height: 2, background: T.border, zIndex: 0, borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: 20, left: '18%', height: 2, width: `${(step / (steps.length-1)) * 64}%`, background: T.accent, zIndex: 1, transition: 'width 1s cubic-bezier(.4,0,.2,1)', borderRadius: 2 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          {steps.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? T.green : active ? T.accent : '#F0EEE9', border: `2px solid ${done ? T.green : active ? T.accent : T.border}`, transition: 'all .5s ease', boxShadow: active ? `0 0 0 5px ${T.accentBg}` : 'none' }}>
                  {done ? <ICheck sz={16} col="#fff" /> : <span style={{ fontSize: 14, fontWeight: 700, color: active ? '#fff' : T.textSubtle }}>{i+1}</span>}
                </div>
                <div style={{ fontSize: 12, fontWeight: active||done ? 600 : 400, color: done ? T.green : active ? T.accent : T.textSubtle }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.75 }}>{descs[step]}</div>
        {step === 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, padding: '9px 13px', background: T.accentBg, borderRadius: 9, border: `1px solid ${T.accentBorder}` }}>
            <IClock sz={13} col={T.accent} />
            <span style={{ fontSize: 12, color: T.accent, fontWeight: 500 }}>{t.analysisTime}</span>
          </div>
        )}
      </div>

      {step === 2 && (
        <button onClick={() => go(SC.DASH)} style={{ width: '100%', padding: 13, borderRadius: 11, background: T.greenBg, color: T.green, border: `1.5px solid ${T.greenBorder}`, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s' }}>
          {t.viewReport} →
        </button>
      )}
      <button onClick={() => go(SC.HOME)} style={{ marginTop: 12, background: 'none', border: 'none', fontSize: 12, color: T.textSubtle, cursor: 'pointer', fontFamily: 'inherit' }}>
        ← {lang === 'ru' ? 'На главную' : 'Home'}
      </button>
    </div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────
function Home({ go }) {
  const mob = useIsMobile();
  return (
    <div style={{ minHeight: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '3.5rem 1.5rem', background: T.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', background: '#F0EEE9', borderRadius: 100, marginBottom: 14, border: `1px solid ${T.border}` }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent }} />
          <span style={{ fontSize: 11, letterSpacing: '.12em', color: T.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Activat VC</span>
        </div>
        <h1 style={{ fontSize: 46, fontWeight: 800, color: T.text, margin: '0 0 .75rem', letterSpacing: '-1.5px', lineHeight: 1.1 }}>VentureIQ</h1>
        <p style={{ fontSize: 14, color: T.textMuted, maxWidth: 400, lineHeight: 1.75, margin: '0 auto' }}>Автоматизированный due diligence стартапов. 6 ИИ-агентов, Investment Score 1–10.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: '1rem', width: '100%', maxWidth: 540 }}>
        {[
          { l: 'Фаундерам', s: 'Подать заявку — ИИ-ассистент поможет', sc: SC.FORM, col: T.accent, bg: T.accentBg, border: T.accentBorder },
          { l: 'Инвесторам', s: 'Демо-отчёт с чатом Orchestrator', sc: SC.DASH, col: T.green, bg: T.greenBg, border: T.greenBorder },
          { l: 'Статус заявки', s: 'Отслеживайте ход рассмотрения', sc: SC.STATUS, col: '#7c3aed', bg: '#F5F3FF', border: '#C4B5FD' },
        ].map(x => (
          <button key={x.sc} onClick={() => go(x.sc)} style={{ ...C.card, cursor: 'pointer', textAlign: 'left', border: `1px solid ${T.border}`, gridColumn: x.sc === SC.STATUS ? '1 / -1' : 'auto', transition: 'box-shadow .2s, transform .15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = C.card.boxShadow; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: x.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: `1px solid ${x.border}` }}><IArrow sz={17} col={x.col} /></div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{x.l}</div>
            <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5, marginBottom: 12, margin: '0 0 12px' }}>{x.s}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: x.col, fontWeight: 600 }}>Открыть <IArrow sz={13} col={x.col} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Founder Block ──────────────────────────────────────────────────────────
function FounderBlock({ founder, index, lang, onChange, onRemove }) {
  const mob = useIsMobile();
  const t = LANGS[lang];
  const roles = lang === 'ru' ? ROLES_RU : ROLES_EN;
  const countries = lang === 'ru' ? COUNTRIES_RU : COUNTRIES_EN;
  const countriesOrig = COUNTRIES_RU; // for state storage
  const linkTypes = lang === 'ru' ? LINK_TYPES_RU : LINK_TYPES_EN;
  const linkPlaceholder = LINK_PLACEHOLDERS[founder.linkType] || 'https://';

  return (
    <div style={{ background: '#FAFAF8', borderRadius: 11, padding: 14, marginBottom: 8, border: `1px solid ${T.borderLight}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: T.accentBg, border: `1px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IUser sz={13} col={T.accent} />
          </div>
          <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 600 }}>{t.founder} {index + 1}</span>
        </div>
        {index > 0 && <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6 }}><IX /></button>}
      </div>

      {/* Row 1: Name + Country */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={C.label}>{t.name}</div>
          <ValidatedInput
            value={founder.name}
            onChange={e => onChange({ name: e.target.value })}
            validator={v => !v.trim() ? (lang==='ru'?'Введите имя':'Enter name') : ''}
          />
        </div>
        <div>
          <div style={C.label}>{t.country}</div>
          <select style={C.inp} value={founder.country} onChange={e => onChange({ country: e.target.value })}>
            {countries.map((c, i) => <option key={c} value={countriesOrig[i]}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2: Role + LinkedIn URL */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={C.label}>{t.role}</div>
          <select style={C.inp} value={founder.role || 'CEO'} onChange={e => onChange({ role: e.target.value })}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div style={{ ...C.label, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ILinkedIn sz={11} />
            LinkedIn
          </div>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...C.inp, paddingLeft: 30 }}
              value={founder.linkedin || ''}
              onChange={e => onChange({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
            />
            <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <ILinkedIn sz={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Link type + URL */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '140px 1fr', gap: 8 }}>
        <div>
          <div style={C.label}>{t.linkType}</div>
          <select style={C.inp} value={founder.linkType || linkTypes[0]} onChange={e => onChange({ linkType: e.target.value })}>
            {linkTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
          </select>
        </div>
        <div>
          <div style={{ ...C.label, display: 'flex', alignItems: 'center', gap: 4 }}>
            <IGlobe sz={11} />
            {t.linkUrl}
          </div>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...C.inp, paddingLeft: 30 }}
              value={founder.linkUrl || ''}
              onChange={e => onChange({ linkUrl: e.target.value })}
              placeholder={linkPlaceholder}
            />
            <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <IGlobe sz={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form ───────────────────────────────────────────────────────────────────
function Form({ go }) {
  const [lang, setLang] = useState('ru');
  const t = LANGS[lang];

  const [founders, setF] = useState([
    { name: 'Алибек Жаксыбеков', country: 'Казахстан', role: 'CEO', linkedin: 'linkedin.com/in/alibek', linkType: 'LinkedIn', linkUrl: '' },
    { name: 'Дмитрий Нестеров', country: 'Казахстан', role: 'CTO', linkedin: '', linkType: 'LinkedIn', linkUrl: '' },
  ]);
  const [frm, setFrm] = useState({ company: 'FastRoute', activity: 'Logistics Tech / Supply Chain', stage: 'seed', email: 'alibek@fastroute.kz', amount: '500 000', currency: 'USD', desc: 'B2B SaaS для оптимизации грузоперевозок в ЦА. Снижает стоимость логистики на 23%. MRR: $28,000.' });
  const [gateErr, setGE] = useState('');
  const [gateOk, setGO] = useState(true);
  const [descMismatch, setDM] = useState(null);
  const [uploads, setU] = useState({ pitch: 'FastRoute_PitchDeck.pdf', mkt: 'MarketSizing_CA_Logistics.pdf', tech: 'TechOverview.pdf', unit: 'UnitEconomics.xlsx', founders: 'FounderProfiles.pdf', cap: 'CapTable_2026.pdf', val: '', demo: 'demo@fastroute.kz / Demo1234', rounds: '', ip: '', tm: '', corp: '', contracts: '', tos: '' });
  const [fileObjs, setFileObjs] = useState({});
  const [firstRound, setFR] = useState(false);
  const [finUpload, setFin] = useState('FastRoute_FinModel_v3.xlsx');
  const [finFileObj, setFinFileObj] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [chatMsgs, setCM] = useState([{ r: 'a', t: lang === 'ru' ? "Привет! Помогаю заполнить заявку.\n\nДемо предзаполнено данными FastRoute (стадия Seed). Нажмите ⓘ рядом с любым документом — объясню что загружать и зачем." : "Hi! I'm here to help fill in your application.\n\nThe demo is pre-filled with FastRoute (Seed stage) data. Click ⓘ next to any document for guidance." }]);
  const [chatInp, setCI] = useState('');
  const [chatLoad, setCL] = useState(false);
  const [proactiveSent, setPS] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const isMobile = useIsMobile();
  const chatEndRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMsgs, chatLoad]);

  const stage = frm.stage;
  const isSeed = stage === 'seed';
  const ASSIST = lang === 'ru' ? ASSIST_RU : ASSIST_EN;

  const formSnapshot = { founders, frm, uploads, firstRound, finUpload };
  const { loadDraft, lastSaved, restored, saveNow, clearDraft } = useAutosave(formSnapshot, 'ventureiq_draft_v5');

  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.frm) {
      setFrm(draft.frm);
      if (draft.founders) setF(draft.founders);
      if (draft.uploads) setU(draft.uploads);
      if (draft.firstRound !== undefined) setFR(draft.firstRound);
      if (draft.finUpload) setFin(draft.finUpload);
    }
  }, []);

  useEffect(() => {
    if (!proactiveSent && uploads.founders && !uploads.demo && !uploads.rounds && !firstRound) {
      setTimeout(() => {
        const msg = lang === 'ru'
          ? "Я вижу что профили основателей загружены, но нет Product Demo и документов о предыдущих раундах. Это сигнал отсутствия трекшна.\n\nРекомендую: свяжитесь с инвестором для проведения интервью до финального анализа — это повысит оценку CHRO и CRO."
          : "I see founder profiles are uploaded, but there's no Product Demo or previous round documents. This signals limited traction.\n\nRecommendation: reach out for a founder interview before final analysis — it significantly improves CHRO and CRO scores.";
        setCM(p => [...p, { r: 'a', t: msg }]);
        setPS(true);
      }, 1200);
    }
  }, [uploads.founders, uploads.demo, uploads.rounds, firstRound]);

  // Desc ↔ Activity mismatch check
  useEffect(() => {
    setDM(checkDescVsActivity(frm.desc, frm.activity, lang));
  }, [frm.desc, frm.activity, lang]);

  const sendChat = text => {
    const q = text || chatInp.trim(); if (!q || chatLoad) return;
    setCI(''); setCL(true);
    setCM(p => [...p, { r: 'u', t: q }]);
    const l = q.toLowerCase();
    const k = Object.keys(ASSIST).find(k => k !== 'default' && l.includes(k));
    setTimeout(() => { setCM(p => [...p, { r: 'a', t: ASSIST[k || 'default'] }]); setCL(false); }, 650);
  };

  const infoClick = slot => {
    const label = lang === 'ru' ? slot.labelRu : slot.labelEn;
    const hint = lang === 'ru' ? slot.hint : (slot.hintEn || slot.hint);
    setCM(p => [...p, { r: 'u', t: `${lang === 'ru' ? 'Что такое' : 'What is'} "${label}"?` }, { r: 'a', t: hint }]);
  };

  const setUpload = (id, name, fileObj) => {
    setU(p => ({ ...p, [id]: name }));
    if (fileObj) {
      const url = URL.createObjectURL(fileObj);
      setFileObjs(p => ({ ...p, [id]: { name, size: fileObj.size, url, file: fileObj } }));
    }
  };

  const isRequired = slot => slot.requiredFor?.includes(stage);
  const isOptional = slot => slot.optionalFor?.includes(stage) && !slot.requiredFor?.includes(stage);
  const mandatorySubdocs = SUBDOCS.filter(s => isRequired(s));
  const filledMandatory = mandatorySubdocs.filter(s => uploads[s.id]).length;
  const pitchFilled = Boolean(uploads.pitch);
  const canSubmit = pitchFilled && Boolean(finUpload) && mandatorySubdocs.every(s => uploads[s.id]) && descMismatch?.type !== 'blocked';

  const CA = lang === 'ru' ? CA_RU : CA_EN;
  const checkGate = () => {
    const hasCA = founders.some(f => [...CA_RU, ...CA_EN].includes(f.country));
    const stOk = ['pre-seed','preseed','seed'].includes(frm.stage.toLowerCase().replace(/[\s-]/g,''));
    if (!stOk) return setGE(lang === 'ru' ? 'Платформа принимает только pre-seed и seed.' : 'Platform accepts pre-seed and seed only.');
    if (!hasCA) return setGE(lang === 'ru' ? 'Хотя бы 1 фаундер должен быть из ЦА.' : 'At least 1 founder must be from Central Asia.');
    if (!frm.company || !frm.desc || !frm.email || !frm.activity) return setGE(lang === 'ru' ? 'Заполните все обязательные поля.' : 'Fill in all required fields.');
    setGE(''); setGO(true);
  };

  // Progress
  const TOTAL_FIELDS = 5 + founders.length * 4; // name,country,role,linkedin per founder + company,activity,stage,email,desc
  const filledFields = [
    frm.company.trim() ? 1 : 0,
    frm.activity ? 1 : 0,
    frm.stage ? 1 : 0,
    frm.email.trim() ? 1 : 0,
    frm.desc.trim() ? 1 : 0,
    ...founders.flatMap(f => [f.name.trim()?1:0, f.country?1:0, f.role?1:0, f.linkedin?.trim()?1:0]),
  ].reduce((a,b)=>a+b,0);

  const activities = lang === 'ru' ? ACTIVITIES_RU : ACTIVITIES_EN;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: '1rem', padding: isMobile ? '.75rem .75rem 5rem' : '1rem 1rem 2rem', maxWidth: 1060, margin: '0 auto', background: T.bg, minHeight: '100vh' }}>
      {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} lang={lang} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <div style={C.row(10)}>
            <button onClick={() => go(SC.HOME)} style={{ fontSize: 12, color: T.textMuted, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, transition: 'all .15s' }}>{t.back}</button>
            <div>
              <h2 style={C.h2}>{t.formTitle}</h2>
            </div>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        <AutosaveBanner restored={restored} lastSaved={lastSaved} onDismiss={clearDraft} lang={lang} onSaveNow={saveNow} />
        <FormProgressBar filled={filledFields} total={TOTAL_FIELDS} lang={lang} />

        {/* ── Block A ── */}
        <div style={C.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '1.25rem' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: T.accentBg, border: `1px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: T.accent, flexShrink: 0 }}>A</div>
            <span style={C.h3}>{t.blockA}</span>
          </div>

          {founders.map((f, i) => (
            <FounderBlock
              key={i}
              founder={f}
              index={i}
              lang={lang}
              onChange={patch => setF(p => p.map((x, j) => j === i ? { ...x, ...patch } : x))}
              onRemove={() => setF(p => p.filter((_, j) => j !== i))}
            />
          ))}

          <button onClick={() => setF(p => [...p, { name: '', country: 'Казахстан', role: 'CEO', linkedin: '', linkType: lang === 'ru' ? 'LinkedIn' : 'LinkedIn', linkUrl: '' }])}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.accent, background: T.accentBg, border: `1.5px dashed ${T.accentBorder}`, cursor: 'pointer', padding: '8px 14px', marginBottom: '1.25rem', fontFamily: 'inherit', borderRadius: 10, fontWeight: 600, width: '100%', justifyContent: 'center', transition: 'all .15s' }}>
            <IPlus sz={13} col={T.accent} /> {t.addFounder}
          </button>

          <div style={{ borderTop: `1px solid ${T.borderLight}`, margin: '0.75rem 0 1.25rem' }} />

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            <div>
              <div style={C.label}>{t.company}</div>
              <ValidatedInput value={frm.company} onChange={e => setFrm(p => ({ ...p, company: e.target.value }))} validator={v => VALIDATORS.company(v, lang)} />
            </div>
            <div>
              <div style={C.label}>{t.activity}</div>
              <select style={C.inp} value={frm.activity} onChange={e => setFrm(p => ({ ...p, activity: e.target.value }))}>
                <option value="">{lang === 'ru' ? 'Выбрать...' : 'Select...'}</option>
                {activities.map((a, i) => <option key={a} value={ACTIVITIES_RU[i]}>{a}</option>)}
              </select>
              {!frm.activity && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><IXc sz={11} /><span style={{ fontSize: 11, color: T.red }}>{VALIDATORS.activity('', lang)}</span></div>}
            </div>
            <div>
              <div style={C.label}>{t.stage}</div>
              <select style={C.inp} value={frm.stage} onChange={e => setFrm(p => ({ ...p, stage: e.target.value }))}>
                <option value="pre-seed">{t.preSeedOption}</option>
                <option value="seed">{t.seedOption}</option>
              </select>
            </div>
            <div>
              <div style={C.label}>{t.email}</div>
              <ValidatedInput value={frm.email} onChange={e => setFrm(p => ({ ...p, email: e.target.value }))} validator={v => VALIDATORS.email(v, lang)} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={C.label}>{t.desc}</div>
              <ValidatedInput value={frm.desc} onChange={e => setFrm(p => ({ ...p, desc: e.target.value }))} validator={v => VALIDATORS.desc(v, lang)} multiline />
              {/* Desc ↔ Activity mismatch banner */}
              {descMismatch && (
                <div style={{ marginTop: 8, padding: '11px 14px', background: descMismatch.type === 'blocked' ? T.redBg : T.amberBg, borderRadius: 10, borderLeft: `3px solid ${descMismatch.type === 'blocked' ? T.red : T.amber}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    {descMismatch.type === 'blocked' ? <IXc sz={14} col={T.red} /> : <IWarn sz={14} col={T.amber} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: descMismatch.type === 'blocked' ? T.red : T.amber, fontWeight: 600, marginBottom: 6 }}>
                        {descMismatch.type === 'blocked'
                          ? (lang === 'ru' ? '🚫 Вид деятельности вне фокуса инвестирования' : '🚫 Business type outside investment scope')
                          : (lang === 'ru' ? '⚠️ Описание не соответствует выбранному типу' : '⚠️ Description doesnt match selected type')}
                      </div>
                      <div style={{ fontSize: 12, color: descMismatch.type === 'blocked' ? T.red : T.amber, lineHeight: 1.6 }}>{descMismatch.msg}</div>
                      {descMismatch.type === 'mismatch' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button
                            onClick={() => setFrm(p => ({ ...p, activity: '' }))}
                            style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: `1px solid ${T.amberBorder}`, background: 'white', color: T.amber, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            {lang === 'ru' ? 'Выбрать другой тип' : 'Change business type'}
                          </button>
                          <span style={{ fontSize: 12, color: T.textSubtle, alignSelf: 'center' }}>{lang === 'ru' ? 'или уточните описание выше' : 'or refine description above'}</span>
                        </div>
                      )}
                      {descMismatch.type === 'blocked' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button
                            onClick={() => setFrm(p => ({ ...p, activity: '' }))}
                            style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: `1px solid ${T.redBorder}`, background: 'white', color: T.red, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            {lang === 'ru' ? 'Сменить вид деятельности' : 'Change business type'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div style={C.label}>{t.amount}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <ValidatedInput style={{ flex: 1 }} value={frm.amount} onChange={e => setFrm(p => ({ ...p, amount: e.target.value }))} validator={v => VALIDATORS.amount(v, lang)} />
                <select style={{ ...C.inp, width: 76 }} value={frm.currency} onChange={e => setFrm(p => ({ ...p, currency: e.target.value }))}><option>USD</option><option>EUR</option><option>KZT</option></select>
              </div>
            </div>
          </div>

          {gateErr && (
            <div style={{ marginTop: 14, padding: '11px 14px', background: T.redBg, borderRadius: 10, borderLeft: `3px solid ${T.red}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IXc sz={14} /><span style={{ fontSize: 13, color: T.red }}>{gateErr}</span>
            </div>
          )}
          {gateOk && !gateErr && (
            <div style={{ marginTop: 14, padding: '11px 14px', background: T.greenBg, borderRadius: 10, borderLeft: `3px solid ${T.green}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ICheck sz={14} /><span style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>{t.gateOk}</span>
            </div>
          )}
          {!gateOk && !gateErr && (
            <button onClick={checkGate} style={{ marginTop: 14, width: '100%', padding: '10px', borderRadius: 10, background: T.accentBg, color: T.accent, border: `1px solid ${T.accentBorder}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>{t.gateCheck}</button>
          )}
        </div>

        {/* ── Block B ── */}
        <div style={C.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={C.row(9)}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: T.redBg, border: `1px solid ${T.redBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: T.red, flexShrink: 0 }}>B</div>
              <span style={C.h3}>{t.blockB}</span>
            </div>
            <span style={{ fontSize: 12, color: T.textMuted }}>{t.adaptedFor} <span style={{ fontWeight: 700, color: T.text }}>{isSeed ? 'Seed' : 'Pre-seed'}</span></span>
          </div>

          {/* Cat 1 */}
          <div style={{ border: `1.5px solid ${T.redBorder}`, borderRadius: 12, padding: '0.875rem', marginBottom: 12, background: '#FFFCFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.red, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t.cat1}</span>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{t.cat1sub}</div>
              </div>
              <div style={C.row(7)}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: canSubmit ? T.green : T.red, fontWeight: 700 }}>
                  {(pitchFilled?1:0) + (finUpload?1:0) + filledMandatory}/{2 + mandatorySubdocs.length}
                </span>
                <div style={{ width: 40, height: 5, background: '#F3F1EC', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height:'100%', width:`${((pitchFilled?1:0)+(finUpload?1:0)+filledMandatory)/(2+mandatorySubdocs.length)*100}%`, background: canSubmit ? T.green : T.red, transition: 'width .2s', borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {/* Pitch Deck */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderTop: `1px solid ${T.redBorder}20` }}>
              <div style={{ flexShrink: 0 }}>{uploads.pitch ? <ICheck sz={13} /> : <IXc sz={13} />}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Pitch Deck</span>
                {uploads.pitch && <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 1 }}>{uploads.pitch}</div>}
              </div>
              <div style={C.row(5)}>
                <button onClick={() => infoClick({ labelRu: 'Pitch Deck', labelEn: 'Pitch Deck', hint: 'Презентация 10–20 слайдов: проблема → решение → рынок → бизнес-модель → команда → финансы. Все 6 агентов начинают с него.', hintEn: 'Presentation 10–20 slides: problem → solution → market → business model → team → finances. All 6 agents start with it.' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6 }}><IInfo /></button>
                {uploads.pitch && fileObjs.pitch && <button onClick={() => setPreviewFile(fileObjs.pitch)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6 }}><IEye /></button>}
                <label style={{ fontSize: 12, color: uploads.pitch ? T.textMuted : T.red, padding: '5px 10px', border: `1.5px solid ${uploads.pitch ? T.border : T.redBorder}`, borderRadius: 8, cursor: 'pointer', background: uploads.pitch ? '#F8F7F4' : T.redBg, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {uploads.pitch ? t.replace : t.upload}
                  <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setUpload('pitch', f.name, f); }} />
                </label>
              </div>
            </div>

            {/* Subdocuments */}
            <div style={{ background: '#FFF8F8', borderRadius: 8, border: `1px solid ${T.redBorder}40`, padding: '0 0.75rem', marginTop: 6 }}>
              <div style={{ fontSize: 11, color: T.textSubtle, padding: '6px 0 4px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>{t.subdocsHeader}</div>
              {SUBDOCS.map(slot => {
                const opt = isOptional(slot), req = isRequired(slot);
                if (!req && !opt) return null;
                return <SlotRow key={slot.id} slot={slot} value={uploads[slot.id]} fileObj={fileObjs[slot.id]} optional={opt} onUpload={setUpload} onInfo={infoClick} sub={true} onPreview={f => setPreviewFile(f)} lang={lang} />;
              })}
            </div>

            {/* Financial Model */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderTop: `1px solid ${T.redBorder}20`, marginTop: 4 }}>
              <div style={{ flexShrink: 0 }}>{finUpload ? <ICheck sz={13} /> : <IXc sz={13} />}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{lang === 'ru' ? 'Финансовая модель' : 'Financial Model'}</span>
                {finUpload && <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 1 }}>{finUpload}</div>}
              </div>
              <div style={C.row(5)}>
                <button onClick={() => infoClick({ labelRu: 'Финансовая модель', labelEn: 'Financial Model', hint: 'Excel с P&L, cash flow, прогнозами 3–5 лет, unit-экономикой. Агент CFO проверит арифметику.', hintEn: 'Excel with P&L, cash flow, 3–5 year projections, unit economics. CFO agent will verify the math.' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6 }}><IInfo /></button>
                {finUpload && finFileObj && <button onClick={() => setPreviewFile(finFileObj)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', borderRadius: 6 }}><IEye /></button>}
                <label style={{ fontSize: 12, color: finUpload ? T.textMuted : T.red, padding: '5px 10px', border: `1.5px solid ${finUpload ? T.border : T.redBorder}`, borderRadius: 8, cursor: 'pointer', background: finUpload ? '#F8F7F4' : T.redBg, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {finUpload ? t.replace : t.upload}
                  <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setFin(f.name); setFinFileObj({ name: f.name, size: f.size, url: URL.createObjectURL(f) }); }}} />
                </label>
              </div>
            </div>
          </div>

          {/* Cat 2 */}
          <div style={{ border: `1.5px solid ${T.amberBorder}`, borderRadius: 12, padding: '0.875rem', marginBottom: 12, background: '#FFFEF8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.amber, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t.cat2}</span>
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{isSeed ? t.cat2seed : t.cat2preseed}</span>
            </div>
            {CAT2_DOCS.map(slot => {
              const opt = isOptional(slot) || !slot.requiredFor?.includes(stage);
              return <SlotRow key={slot.id} slot={slot} value={uploads[slot.id]} fileObj={fileObjs[slot.id]} optional={opt} onUpload={setUpload} onInfo={infoClick} onPreview={f => setPreviewFile(f)} firstRound={slot.id === 'rounds' ? firstRound : false} onFirstRound={() => setFR(v => !v)} lang={lang} />;
            })}
          </div>

          {/* Cat 3 */}
          <div style={{ border: `1.5px solid ${T.accentBorder}`, borderRadius: 12, padding: '0.875rem', marginBottom: '1.25rem', background: '#FAFBFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t.cat3}</span>
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{t.cat3note}</span>
            </div>
            {CAT3_DOCS.map(slot => (
              <SlotRow key={slot.id} slot={slot} value={uploads[slot.id]} fileObj={fileObjs[slot.id]} optional={true} onUpload={setUpload} onInfo={infoClick} onPreview={f => setPreviewFile(f)} lang={lang} />
            ))}
          </div>

          <button
            onClick={() => { if (canSubmit) { clearDraft(); go(SC.PROC); } }}
            disabled={!canSubmit}
            style={{ width: '100%', padding: 13, borderRadius: 11, background: canSubmit ? T.greenBg : '#F8F7F4', color: canSubmit ? T.green : T.textSubtle, border: `1.5px solid ${canSubmit ? T.greenBorder : T.border}`, cursor: canSubmit ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', transition: 'all .15s', letterSpacing: '-0.1px' }}
          >
            {canSubmit ? t.submit : t.submitDisabled}
          </button>
        </div>
      </div>

      {/* ── AI Assistant — desktop sidebar / mobile floating ── */}
      {!isMobile && (
        <div style={{ position: 'sticky', top: '1rem', height: 'fit-content' }}>
          <div style={{ ...C.card, padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '.875rem 1rem', borderBottom: `1px solid ${T.borderLight}`, background: '#FAFAF8' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: T.accentBg, border: `1px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IChat /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{t.assistantTitle}</div>
                <div style={{ fontSize: 11, color: T.textSubtle }}>{t.assistantSub}</div>
              </div>
            </div>
            <div style={{ height: 460, overflowY: 'auto', padding: '.75rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chatMsgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.r === 'u' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '92%', padding: '9px 13px', borderRadius: m.r === 'u' ? '14px 14px 3px 14px' : '3px 14px 14px 14px', background: m.r === 'u' ? T.accentBg : '#F3F1EC', fontSize: 13, lineHeight: 1.65, color: m.r === 'u' ? T.accent : T.text, whiteSpace: 'pre-wrap', border: m.r === 'u' ? `1px solid ${T.accentBorder}` : `1px solid ${T.borderLight}` }}>{m.t}</div>
                </div>
              ))}
              {chatLoad && <div style={{ display: 'flex', gap: 5, padding: '9px 13px', background: '#F3F1EC', borderRadius: '3px 14px 14px 14px', width: 'fit-content', border: `1px solid ${T.borderLight}` }}>{[0,1,2].map(i => <span key={i} style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: T.textSubtle, animation: `dp 1.4s ${i*.2}s infinite` }} />)}</div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: '0 .75rem .5rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {(lang === 'ru' ? ['Что важно для pre-seed?', 'Что такое трекшн?'] : ['What matters for pre-seed?', 'What is traction?']).map(q =>
                <button key={q} onClick={() => sendChat(q)} style={{ textAlign: 'left', padding: '6px 11px', fontSize: 12, color: T.textMuted, background: '#F8F7F4', border: `1px solid ${T.border}`, borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>{q}</button>
              )}
            </div>
            <div style={{ padding: '.75rem', borderTop: `1px solid ${T.borderLight}`, display: 'flex', gap: 8 }}>
              <input style={{ ...C.inp, flex: 1, fontSize: 13 }} placeholder={t.askPlaceholder} value={chatInp} onChange={e => setCI(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} disabled={chatLoad} />
              <button onClick={() => sendChat()} disabled={chatLoad || !chatInp.trim()} style={{ padding: '9px 13px', borderRadius: 9, background: T.accentBg, border: `1px solid ${T.accentBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: (chatLoad || !chatInp.trim()) ? 0.45 : 1, transition: 'opacity .15s' }}><ISend /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile: floating chat button + bottom sheet ── */}
      {isMobile && (
        <>
          {/* Floating button */}
          <button
            onClick={() => setChatOpen(true)}
            style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, width: 54, height: 54, borderRadius: '50%', background: T.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(26,79,214,0.45)', transition: 'transform .15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <IChat sz={22} col="#fff" />
            {chatMsgs.filter(m => m.r === 'a').length > 1 && (
              <div style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', border: '2px solid white', fontSize: 9, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {chatMsgs.filter(m => m.r === 'a').length - 1}
              </div>
            )}
          </button>

          {/* Bottom sheet overlay */}
          {chatOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {/* Backdrop */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.5)', backdropFilter: 'blur(2px)' }} onClick={() => setChatOpen(false)} />
              {/* Sheet */}
              <div style={{ position: 'relative', background: T.surface, borderRadius: '20px 20px 0 0', maxHeight: '82vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
                {/* Handle + header */}
                <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
                  <div style={{ width: 40, height: 4, borderRadius: 2, background: T.border, margin: '0 auto 14px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${T.borderLight}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: T.accentBg, border: `1px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IChat /></div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{t.assistantTitle}</div>
                        <div style={{ fontSize: 11, color: T.textSubtle }}>{t.assistantSub}</div>
                      </div>
                    </div>
                    <button onClick={() => setChatOpen(false)} style={{ background: '#F3F1EC', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', fontSize: 13, color: T.textMuted, fontFamily: 'inherit', fontWeight: 600 }}>✕</button>
                  </div>
                </div>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '.75rem', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
                  {chatMsgs.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.r === 'u' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '88%', padding: '9px 13px', borderRadius: m.r === 'u' ? '14px 14px 3px 14px' : '3px 14px 14px 14px', background: m.r === 'u' ? T.accentBg : '#F3F1EC', fontSize: 13, lineHeight: 1.65, color: m.r === 'u' ? T.accent : T.text, whiteSpace: 'pre-wrap', border: m.r === 'u' ? `1px solid ${T.accentBorder}` : `1px solid ${T.borderLight}` }}>{m.t}</div>
                    </div>
                  ))}
                  {chatLoad && <div style={{ display: 'flex', gap: 5, padding: '9px 13px', background: '#F3F1EC', borderRadius: '3px 14px 14px 14px', width: 'fit-content' }}>{[0,1,2].map(i => <span key={i} style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: T.textSubtle, animation: `dp 1.4s ${i*.2}s infinite` }} />)}</div>}
                  <div ref={chatEndRef} />
                </div>
                {/* Quick questions */}
                <div style={{ padding: '0 .75rem .5rem', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
                  {(lang === 'ru' ? ['Что важно для pre-seed?', 'Что такое трекшн?'] : ['What matters for pre-seed?', 'What is traction?']).map(q =>
                    <button key={q} onClick={() => sendChat(q)} style={{ padding: '6px 11px', fontSize: 12, color: T.textMuted, background: '#F8F7F4', border: `1px solid ${T.border}`, borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>{q}</button>
                  )}
                </div>
                {/* Input */}
                <div style={{ padding: '.75rem', borderTop: `1px solid ${T.borderLight}`, display: 'flex', gap: 8, flexShrink: 0, paddingBottom: 'max(.75rem, env(safe-area-inset-bottom))' }}>
                  <input style={{ ...C.inp, flex: 1, fontSize: 14 }} placeholder={t.askPlaceholder} value={chatInp} onChange={e => setCI(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} disabled={chatLoad} />
                  <button onClick={() => sendChat()} disabled={chatLoad || !chatInp.trim()} style={{ padding: '9px 13px', borderRadius: 9, background: T.accentBg, border: `1px solid ${T.accentBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: (chatLoad || !chatInp.trim()) ? 0.45 : 1 }}><ISend /></button>
                </div>
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
function Proc({ go }) {
  const [prog, setP] = useState(Object.fromEntries(AIDS.map(k => [k, 0])));
  const [sv, setSV] = useState(0);
  const [logs, setL] = useState(['Запуск 6 агентов параллельно...']);
  const [done, setD] = useState(false);
  const logRef = useRef(null);
  useEffect(() => { logRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }); }, [logs]);
  useEffect(() => {
    const spd = { cmo:1.1,clo:.85,cfo:.95,cpo:1.25,cro:1.05,chro:1.2 };
    const iv = setInterval(() => {
      setP(p => { const n={}; let all=true; AIDS.forEach(k => { n[k]=Math.min(100,p[k]+spd[k]*(Math.random()*1.5+.5)); if(n[k]<100) all=false; }); if(all) { clearInterval(iv); setD(true); } return n; });
      setSV(s => Math.min(7.4, s+.04));
    }, 65);
    [[900,'CMO+CCO: TAM $2.1B верифицирован — CAGR 18%'],[1800,'CHRO: профили фаундеров — 12 лет опыта'],[2800,'CPO+CTO: Retention D30 = 61% > бенчмарка'],[3600,'CFO→CRO: cross_query — клиент 43%!'],[4600,'CLO: IP Assignment ✓ · Advisor Agreement ✗'],[5400,'CRO: 2 critical · 2 moderate · 1 minor'],[6200,'CFO: LTV:CAC = 4.1× ✓'],[7500,'Orchestrator: агрегация Investment Score...']].forEach(([t,m]) => setTimeout(() => setL(p => [...p,m]), t));
    return () => clearInterval(iv);
  }, []);
  useEffect(() => { if (done) setTimeout(() => go(SC.STATUS), 1400); }, [done]);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2.5rem 1.5rem', background: T.bg, minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#F0EEE9', borderRadius: 100, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 11, letterSpacing: '.12em', color: T.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>VentureIQ · Анализ</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: '0 0 4px', letterSpacing: '-0.3px' }}>FastRoute · Seed · Logistics Tech</h2>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>KZ · $500,000 USD</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '6px 14px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <IClock sz={13} />
          <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>Обычно занимает 5–10 минут</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: sv>=7?T.green:T.amber, lineHeight: 1, fontFamily: 'monospace', letterSpacing: '-2px' }}>{done ? '7.4' : sv.toFixed(1)}</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase' }}>Investment Score</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {AIDS.map(k => { const a = D.agents[k]; return (
          <div key={k} style={C.sm}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.name}</span>
              <span style={{ fontSize: 12, color: prog[k]>=100 ? T.green : T.textMuted, fontFamily: 'monospace', fontWeight: 600 }}>{prog[k]>=100 ? a.score.toFixed(1) : `${Math.round(prog[k])}%`}</span>
            </div>
            <div style={{ height: 4, background: '#F0EEE9', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${prog[k]}%`, background: prog[k]>=100?T.green:T.accent, transition: 'width .1s', borderRadius: 2 }} />
            </div>
          </div>
        ); })}
      </div>
      <div ref={logRef} style={{ ...C.sm, maxHeight: 175, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8, fontWeight: 600 }}>Cross-query log</div>
        {logs.map((l, i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: '4px 0', borderTop: i ? `1px solid ${T.borderLight}` : 'none', lineHeight: 1.5 }}><span style={{ fontFamily: 'monospace', color: T.textSubtle, marginRight: 8 }}>{String(i+1).padStart(2,'0')}</span>{l}</div>)}
      </div>
      {done && <div style={{ textAlign: 'center', marginTop: 16, padding: '12px 16px', background: T.greenBg, borderRadius: 10, fontSize: 13, color: T.green, fontWeight: 600, border: `1px solid ${T.greenBorder}` }}>✓ Анализ завершён · Score 7.4 · CONDITIONAL → переход к статусу...</div>}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

// ── Agent Card ─────────────────────────────────────────────────────────────
function ACard({ id }) {
  const a = D.agents[id];
  const [open, setO] = useState(false);
  const sev = { critical: T.red, moderate: T.amber, minor: T.textSubtle };
  return (
    <div style={{ ...C.card, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow .15s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setO(!open)}>
        <div style={C.row(10)}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: scBg(a.score), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${sc(a.score)}30` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: sc(a.score) }}>{a.score.toFixed(1)}</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{a.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{a.title}</div>
          </div>
        </div>
        <div style={C.row(10)}>
          <div style={{ fontSize: 24, fontWeight: 800, color: sc(a.score), fontFamily: 'monospace', letterSpacing: '-0.5px' }}>{a.score.toFixed(1)}</div>
          <div style={{ fontSize: 12, color: T.textSubtle }}>w:{a.w}%</div>
          {open ? <IUp /> : <IDown />}
        </div>
      </div>
      {open && (
        <div style={{ marginTop: '1rem', borderTop: `1px solid ${T.borderLight}`, paddingTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 7, fontWeight: 700 }}>Сильные стороны</div>
              {a.str.map((s,i) => <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:6,marginBottom:6,fontSize:12 }}><span style={{ flexShrink:0,marginTop:2 }}><ICheck sz={11} /></span><span style={{ color:T.text,lineHeight:1.5 }}>{s}</span></div>)}
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 7, fontWeight: 700 }}>Красные флаги</div>
              {a.fl.map((f,i) => <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:6,marginBottom:6,fontSize:12 }}><span style={{ flexShrink:0,marginTop:2 }}><IWarn sz={11} col={sev[f.s]} /></span><span style={{ color:T.text,lineHeight:1.5 }}>{f.f}</span></div>)}
            </div>
          </div>
          {a.cond?.length > 0 && (
            <div style={{ padding: 12, background: '#F8F7F4', borderRadius: 9, border: `1px solid ${T.borderLight}` }}>
              <div style={{ fontSize: 10, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 7, fontWeight: 700 }}>Условия инвестирования</div>
              {a.cond.map((c,i) => <div key={i} style={{ display:'flex',alignItems:'center',gap:7,marginBottom:5,fontSize:12,color:T.text }}><div style={{ width:18,height:18,borderRadius:'50%',border:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:T.textSubtle,flexShrink:0,fontWeight:600 }}>{i+1}</div>{c}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dash({ go }) {
  const rd = AIDS.map(k => ({ s: D.agents[k].name, v: D.agents[k].score }));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '185px 1fr 285px', minHeight: 640, background: T.surface }}>
      {/* Sidebar */}
      <div style={{ borderRight: `1px solid ${T.borderLight}`, padding: '1rem' }}>
        <div style={{ fontSize: 10, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12, fontWeight: 700 }}>Портфель</div>
        {[{ n:'FastRoute',s:7.4,v:'CONDITIONAL',a:true },{ n:'PayKZ',s:5.8,v:'PASS WITH FB',a:false },{ n:'AgriSense',s:8.2,v:'INVEST',a:false }].map(p => (
          <div key={p.n} style={{ padding: '8px 10px', borderRadius: 9, background: p.a ? '#F8F7F4' : 'transparent', marginBottom: 3, cursor: 'pointer', border: p.a ? `1px solid ${T.border}` : '1px solid transparent', transition: 'all .15s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: p.a ? 700 : 500, color: T.text }}>{p.n}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: sc(p.s), fontWeight: 700 }}>{p.s}</span>
            </div>
            <span style={{ fontSize: 11, color: T.textSubtle, fontWeight: 500 }}>{p.v}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${T.borderLight}`, margin: '1rem 0' }} />
        <button onClick={() => go(SC.HOME)} style={{ width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.border}`,background:'transparent',cursor:'pointer',color:T.textMuted,marginBottom:6,fontFamily:'inherit',fontWeight:500 }}>← На главную</button>
        <button onClick={() => go(SC.FORM)} style={{ width:'100%',fontSize:12,padding:'7px',borderRadius:9,border:`1px solid ${T.accentBorder}`,background:T.accentBg,cursor:'pointer',color:T.accent,fontFamily:'inherit',fontWeight:600 }}>+ Новая заявка</button>
      </div>

      {/* Main */}
      <div style={{ padding: '1.25rem', overflowY: 'auto', maxHeight: 700 }}>
        <div style={{ ...C.card, marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={C.row(8)}><h2 style={C.h2}>FastRoute</h2>{['Logistics Tech','Seed','KZ'].map(tg => <span key={tg} style={C.tag}>{tg}</span>)}</div>
              <p style={{ fontSize: 13, color: T.textMuted, marginTop: 7, maxWidth: 360, lineHeight: 1.65 }}>{D.hero}</p>
              <div style={{ display:'flex',gap:8,marginTop:12 }}><button style={{ display:'flex',alignItems:'center',gap:5,fontSize:12,padding:'5px 11px',border:`1px solid ${T.border}`,borderRadius:8,background:'transparent',cursor:'pointer',color:T.textMuted,fontFamily:'inherit',fontWeight:500 }}><IDl />PDF</button></div>
            </div>
            <div style={{ textAlign:'right',flexShrink:0 }}>
              <div style={{ fontSize: 54, fontWeight: 800, color: T.amber, lineHeight: 1, fontFamily: 'monospace', letterSpacing: '-2px' }}>7.4</div>
              <div style={{ fontSize: 12, color: T.textSubtle, marginBottom: 9, fontWeight: 500 }}>/ 10 · Investment Score</div>
              <span style={C.badge(T.accent, T.accentBg)}>CONDITIONAL</span>
            </div>
          </div>
        </div>

        <div style={{ ...C.card, marginBottom: '1rem' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
            <h3 style={C.h3}>Radar Chart</h3>
            <div style={{ display:'flex',flexWrap:'wrap',gap:'3px 12px' }}>{AIDS.map(k => <div key={k} style={C.row(5)}><span style={{ fontFamily:'monospace',fontSize:12,color:sc(D.agents[k].score),fontWeight:700 }}>{D.agents[k].score.toFixed(1)}</span><span style={{ fontSize:11,color:T.textSubtle }}>{D.agents[k].name}</span></div>)}</div>
          </div>
          <ResponsiveContainer width="100%" height={185}>
            <RadarChart data={rd} margin={{ top:5,right:20,bottom:5,left:20 }}>
              <PolarGrid stroke={T.borderLight} />
              <PolarAngleAxis dataKey="s" tick={{ fill: T.textSubtle, fontSize: 11 }} />
              <Radar dataKey="v" stroke={T.accent} fill={T.accent} fillOpacity={0.1} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: '0 0 12px', letterSpacing: '-0.15px' }}>Карточки агентов <span style={{ fontWeight: 400, fontSize: 12, color: T.textSubtle }}>(нажмите)</span></h3>
        <div style={{ display:'flex',flexDirection:'column',gap:8,marginBottom:'1rem' }}>{AIDS.map(id => <ACard key={id} id={id} />)}</div>

        <div style={{ ...C.card, marginBottom:'1rem' }}>
          <h3 style={{ fontSize:15,fontWeight:700,color:T.text,margin:'0 0 12px' }}>Executive Summary</h3>
          {D.summary.map((p,i) => <p key={i} style={{ fontSize:14,lineHeight:1.8,color:T.text,margin:i<D.summary.length-1?'0 0 12px':0 }}>{p}</p>)}
        </div>

        <div style={C.card}>
          <h3 style={{ fontSize:15,fontWeight:700,color:T.text,margin:'0 0 12px' }}>Interview Guide</h3>
          {D.q.map((q,i) => <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:9,padding:'9px 0',borderTop:i?`1px solid ${T.borderLight}`:'none' }}>
            <div style={{ width:22,height:22,borderRadius:'50%',background:'#F8F7F4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:T.textSubtle,flexShrink:0,border:`1px solid ${T.border}` }}>{i+1}</div>
            <span style={{ fontSize:13,color:T.text,lineHeight:1.6 }}>{q}</span>
          </div>)}
        </div>
      </div>

      {/* Orchestrator chat */}
      <div style={{ borderLeft:`1px solid ${T.borderLight}`,display:'flex',flexDirection:'column',maxHeight:700 }}>
        <div style={{ display:'flex',alignItems:'center',gap:9,padding:'.75rem 1rem',borderBottom:`1px solid ${T.borderLight}`,flexShrink:0,background:'#FAFAF8' }}>
          <div style={{ width:30,height:30,borderRadius:9,background:T.accentBg,border:`1px solid ${T.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><IZap /></div>
          <div><div style={{ fontSize:13,fontWeight:700,color:T.text }}>Orchestrator</div><div style={{ fontSize:11,color:T.textSubtle }}>Вопрос = диалог · Ревизия = пересчёт</div></div>
        </div>
        <div style={{ flex:1,overflow:'hidden' }}>
          <Chat init={"Анализ FastRoute завершён.\n\nScore: 7.4 — CONDITIONAL.\n\nКлючевой риск: CRO 5.9 — концентрация 43%. Задайте вопрос."} kb={ORCH} quick={['Почему 7.4?','Главные риски?','Условия сделки?']} height={560} />
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setS] = useState(SC.HOME);
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif', background: T.bg, minHeight: '100vh' }}>
      {screen === SC.HOME   && <Home go={setS} />}
      {screen === SC.FORM   && <Form go={setS} />}
      {screen === SC.PROC   && <Proc go={setS} />}
      {screen === SC.STATUS && <StatusPage go={setS} lang="ru" />}
      {screen === SC.DASH   && <Dash go={setS} />}
    </div>
  );
}