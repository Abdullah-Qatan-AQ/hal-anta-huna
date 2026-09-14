const $ = (s) => document.querySelector(s);
const state = { scene: 0, tension: 0, evidence: [], flags: {}, visited: new Set(), stream: null };
const scenes = [
  { chapter: 1, name: 'الوصول', tag: '03:17 · الطابق الثالث', symbol: '01', text: 'تصل إلى المبنى الذي تركته أمك منذ سبع سنوات. لا توجد كهرباء في الحي، لكن نافذة الطابق الثالث تومض كأن أحدًا ما زال يعيش هنا. في جيبك مفتاح صدئ وتسجيل صوتي بعنوان: «لا تشغّله».', choices: [
    { label: 'تشغّل التسجيل رغم التحذير', delta: 12, flag: 'recording', next: 1, evidence: ['تسجيل مجهول: «إذا سمعت الطرق ثلاث مرات، لا تجب.»'] },
    { label: 'تدخل بالمفتاح وتخفي الهاتف', delta: 4, flag: 'quiet', next: 1, evidence: ['مفتاح الطابق الثالث: عليه خدش بشكل عين.'] }
  ]},
  { chapter: 1, name: 'الباب 307', tag: '03:24 · الممر الغربي', symbol: '02', text: 'الممر أطول مما تتذكر. عند الباب 307، تجد آثار ماء تمتد من الداخل إلى قدميك. ثم يأتي الطرق: مرة… مرتين… ثلاثًا. من خلف الباب، يقول صوت يشبه صوتك: «اختر الاسم الذي نسيته».', puzzle: true, choices: [
    { label: 'تقول: نور', delta: 18, flag: 'nameNoor', next: 2, evidence: ['صوت خلف الباب نطق اسم «نور» قبل أن تفعل.'] },
    { label: 'تقول: مريم', delta: 8, flag: 'nameMariam', next: 2, evidence: ['الطلاء يتشقق عند نطق اسم مريم.'] },
    { label: 'لا تجيب وتعدّ الطرقات', delta: 24, flag: 'silent', next: 2, evidence: ['الطرق الرابع جاء من خلفك، لا من الباب.'] }
  ]},
  { chapter: 2, name: 'الغرفة البيضاء', tag: '03:31 · غرفة التصوير', symbol: '03', text: 'تفتح الباب. الغرفة بيضاء بالكامل، إلا من صور معلقة بلا وجوه. في الوسط جهاز عرض يعيد مشهدًا لك وأنت تدخل الغرفة… قبل سبع دقائق من وصولك. على الطاولة ثلاثة أزرار: عين، أذن، وفم.', choices: [
    { label: 'تضغط العين: شاهد ما لم تره', delta: 14, flag: 'eye', next: 3, evidence: ['الصورة تعرض ظلك واقفًا في مكان آخر.'] },
    { label: 'تضغط الأذن: اسمع الحقيقة', delta: 20, flag: 'ear', next: 3, evidence: ['همسة مسجلة: «النسخة التي أمامك ليست الأولى».'] },
    { label: 'تضغط الفم: اسأل الغرفة', delta: 28, flag: 'mouth', next: 3, evidence: ['الغرفة أجابت بصوتك: «أنت من فتح الباب».'] }
  ]},
  { chapter: 2, name: 'النسخة الثانية', tag: '03:38 · نهاية الممر', symbol: '04', text: 'تظهر فتاة عند آخر الممر. لا تتحرك، لكن انعكاسها في زجاج النافذة يقترب. ترفع يدها وتشير إلى الكاميرا. تظهر على شاشتك جملة واحدة: «صوّرني كي أتذكر شكلي».', choices: [
    { label: 'تفتح الكاميرا وتلتقط الصورة', delta: 8, flag: 'camera', next: 4, evidence: ['الصورة الملتقطة تُظهر شخصًا واقفًا خلفك.'] },
    { label: 'تغلق عينيك وتصف ما تسمعه', delta: 16, flag: 'listen', next: 4, evidence: ['ثلاثة أنفاس: اثنتان منك، وواحدة من الهاتف.'] }
  ]},
  { chapter: 3, name: 'الاختيار الأخير', tag: '03:47 · غرفة المراقبة', symbol: '05', text: 'في غرفة المراقبة تجد شاشتين: الأولى تعرض المبنى فارغًا، والثانية تعرضك وأنت تقرأ هذه الكلمات. خلف الشاشة، مفتاح الخروج. فوقه ملاحظة: «لا تنقذني. تذكّرني فقط».', choices: [
    { label: 'تأخذ المفتاح وتخرج وحدك', delta: 6, flag: 'escape', next: 5 },
    { label: 'تكسر الشاشة وتبحث عن صاحبة الصوت', delta: 22, flag: 'search', next: 6 },
    { label: 'تترك المفتاح وتبقى حتى النهاية', delta: 35, flag: 'stay', next: 7 }
  ]}
];
const endings = {
  5: ['الخروج', 'تفتح باب الشارع. الهواء بارد، والهاتف صامت للمرة الأولى. حين تلتفت، ترى نافذة الطابق الثالث مطفأة. لكن في جيبك مفتاحًا جديدًا لا تعرفه.', 'نجوت… أم نُقلت إلى بداية أخرى؟'],
  6: ['الوجه الآخر', 'تكسر الشاشة، فلا تجد خلفها إلا مرآة. انعكاسك يبتسم قبل أن تبتسم أنت. في الزجاج، تظهر نور للحظة وتقول: «شكرًا لأنك تذكرتني».', 'الحقيقة ليست دائمًا بابًا للخروج.'],
  7: ['المقيم', 'تضع المفتاح على الأرض وتجلس. يتوقف المبنى عن التنفس. عند 03:51، يرن هاتفك برسالة من رقمك أنت: «وصلت أخيرًا». ثم تُغلق الأبواب كلها.', 'بعض القصص لا تنتهي… بل تجد قارئًا جديدًا.']
};
const chapterNav = $('#chapterNav');
function save() { localStorage.setItem('corridor-save', JSON.stringify({ scene: state.scene, tension: state.tension, evidence: state.evidence, flags: state.flags })); }
function load() { try { const s = JSON.parse(localStorage.getItem('corridor-save')); if (s) Object.assign(state, s); } catch {} }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2400); }
function renderNav() { chapterNav.innerHTML = [1,2,3].map((n) => `<button class="chapter-link ${n === scenes[state.scene]?.chapter ? 'active' : ''}" data-chapter="${n}"><span>0${n}</span>${['الوصول','النسخة الثانية','المخرج'][n-1]}</button>`).join(''); }
function showScene() {
  const s = scenes[state.scene]; if (!s) return finish(5);
  $('#chapterNo').textContent = `0${s.chapter}`; $('#chapterName').textContent = s.name; $('#sceneTag').textContent = s.tag; $('#sceneSymbol').textContent = s.symbol;
  $('#progressBar').style.width = `${Math.min(100, ((state.scene + 1) / scenes.length) * 100)}%`; $('#tensionTag').textContent = `التوتر ${Math.min(99, state.tension)}%`;
  $('#storyText').textContent = s.text; $('#evidenceCount').textContent = state.evidence.length;
  $('#evidenceRow').innerHTML = state.evidence.slice(-3).map((e) => `<span>✦ ${e}</span>`).join('');
  $('#choices').innerHTML = s.choices.map((c, i) => `<button class="choice" data-choice="${i}"><span>0${i+1}</span>${c.label}<b>↗</b></button>`).join('');
  document.querySelectorAll('.choice').forEach((b) => b.onclick = () => choose(Number(b.dataset.choice)));
  renderNav(); save();
}
function choose(i) { const s = scenes[state.scene], c = s.choices[i]; state.tension += c.delta; state.flags[c.flag] = true; if (c.evidence) state.evidence.push(c.evidence[0]); state.scene = c.next; if (c.flag === 'camera') openCamera(); else showScene(); }
function begin() { $('#start').classList.add('hidden'); $('#ending').classList.add('hidden'); $('#story').classList.remove('hidden'); showScene(); }
function finish(code) { $('#story').classList.add('hidden'); $('#ending').classList.remove('hidden'); const e = endings[code] || endings[5]; $('#endingCode').textContent = `// 0${code - 4}`; $('#endingTitle').textContent = e[0]; $('#endingText').innerHTML = `${e[1]}<br><br><em>${e[2]}</em>`; $('#endingStats').innerHTML = `<span>الأدلة <b>${state.evidence.length}</b></span><span>التوتر <b>${state.tension}%</b></span><span>الفصل <b>03</b></span>`; localStorage.removeItem('corridor-save'); }
function speak(text) { if (!('speechSynthesis' in window)) return toast('القراءة الصوتية غير مدعومة في هذا المتصفح'); speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ar-SA'; u.rate = .9; speechSynthesis.speak(u); toast('بدأت قراءة المشهد'); }
async function openCamera() { $('#cameraModal').classList.remove('hidden'); const video = $('#cameraVideo'); try { state.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); video.srcObject = state.stream; $('#cameraHint').textContent = 'ابحث عن شيء يتحرك في الخلفية…'; } catch { $('#cameraHint').textContent = 'لم نتمكن من الوصول للكاميرا. يمكنك متابعة القصة دونها.'; } }
function closeCamera() { if (state.stream) state.stream.getTracks().forEach((t) => t.stop()); state.stream = null; $('#cameraVideo').srcObject = null; $('#cameraModal').classList.add('hidden'); }
$('#startBtn').onclick = begin; $('#continueBtn').onclick = () => { load(); begin(); }; $('#restartBtn').onclick = () => { Object.assign(state, { scene: 0, tension: 0, evidence: [], flags: {} }); begin(); };
$('#readBtn').onclick = () => speak(scenes[state.scene]?.text || 'أطياف الممر، رواية رعب تفاعلية.'); $('#speakScene').onclick = () => speak($('#storyText').textContent);
$('#openNotebook').onclick = () => { $('#notebook').classList.remove('hidden'); $('#notebookList').innerHTML = state.evidence.length ? state.evidence.map((e, i) => `<div class="note"><b>0${i+1}</b>${e}</div>`).join('') : '<p class="muted">لا توجد أدلة بعد. كل اختيار قد يكشف شيئًا.</p>'; };
$('#cameraBtn').onclick = openCamera; $('#stopCamera').onclick = closeCamera; $('#captureBtn').onclick = () => { toast('تم حفظ الصورة… هل ظهر شيء خلفك؟'); state.evidence.push('لقطة كاميرا: الظل لا يطابق اتجاه الضوء.'); state.tension += 5; closeCamera(); showScene(); };
document.querySelectorAll('[data-close]').forEach((b) => b.onclick = () => { if (b.dataset.close === 'cameraModal') closeCamera(); else $(`#${b.dataset.close}`).classList.add('hidden'); });
chapterNav.onclick = (e) => { const b = e.target.closest('[data-chapter]'); if (!b) return; const target = Number(b.dataset.chapter); const idx = scenes.findIndex((s) => s.chapter === target); if (idx <= state.scene) { state.scene = idx; showScene(); } else toast('أكمل الفصل الحالي أولًا'); };
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCamera(); $('#notebook').classList.add('hidden'); } });
