from pathlib import Path
import json

root = Path('/home/ubuntu/monogatari-redesign')

# Package metadata becomes a standalone game runtime while internal TypeScript APIs stay compatible.
p = root / 'package.json'
data = json.loads(p.read_text())
data['name'] = 'hal-anta-huna-engine'
data['description'] = 'محرك روايات تفاعلية عربي للعبة هل أنت هنا؟'
data.pop('author', None)
data.pop('repository', None)
data.pop('bugs', None)
data.pop('homepage', None)
data['main'] = './lib/hal-anta-huna.module.js'
data['module'] = './lib/hal-anta-huna.module.js'
data['css'] = 'dist/engine/core/hal-anta-huna.css'
data['exports']['.']['import'] = './lib/engine/core/hal-anta-huna.module.js'
data['exports']['.']['default'] = './lib/engine/core/hal-anta-huna.module.js'
data['exports']['./browser']['import'] = './dist/engine/core/hal-anta-huna.js'
data['exports']['./browser']['default'] = './dist/engine/core/hal-anta-huna.js'
p.write_text(json.dumps(data, ensure_ascii=False, indent='\t') + '\n')

# Standalone build artifact names; runtime symbols remain intact for compatibility.
b = root / 'build.ts'
s = b.read_text()
s = s.replace("naming: 'monogatari.module.js'", "naming: 'hal-anta-huna.module.js'")
s = s.replace("naming: 'monogatari.js'", "naming: 'hal-anta-huna.js'")
s = s.replace("naming: 'monogatari.css'", "naming: 'hal-anta-huna.css'")
b.write_text(s)

# User-facing app manifest.
m = root / 'dist/manifest.json'
manifest = json.loads(m.read_text())
manifest['short_name'] = 'هل أنت هنا؟'
manifest['name'] = 'هل أنت هنا؟ — رواية تفاعلية'
manifest['background_color'] = '#0d1018'
manifest['theme_color'] = '#b8894c'
m.write_text(json.dumps(manifest, ensure_ascii=False, indent='\t') + '\n')

# Standalone Arabic project README.
readme = '''# هل أنت هنا؟\n\n**هل أنت هنا؟** لعبة رواية تفاعلية عربية مستقلة للويب، مبنية على منطق تشغيل قصصي مفتوح المصدر معاد تقديمه بواجهة وهوية جديدة.\n\n## التجربة\n\nصُممت الواجهة للعربية أولًا باتجاه RTL، مع مظهر سينمائي داكن، ألوان ليلية ولمسات ذهبية، وقائمة متجاوبة مع الهاتف وسطح المكتب. تدعم اللعبة الحفظ والاسترجاع، سجل الحوار، التشغيل التلقائي، التخطي، التراجع، الوسائط المتعددة، الترجمة، والعمل دون اتصال عند تشغيلها عبر خادم ويب.\n\n## التطوير\n\nيتطلب المشروع Node.js وnpm، وتُستخدم Bun لبناء الحزم النهائية. بعد تثبيت الاعتماديات شغّل:\n\n```bash\nnpm install\nnpm run check\nnpm run lint\n```\n\nلبناء ملفات التوزيع النهائية استخدم `bun run build`.\n\n## الاختصارات\n\nيمكن استخدام `M` لتفعيل الوضع السينمائي وإخفاء عناصر القائمة السريعة، و`Escape` لتفعيل نمط التركيز عند اللعب بلوحة المفاتيح.\n\n## الترخيص\n\nتتضمن هذه النسخة ملف `LICENSE` وإشعار MIT الأصليين. التغييرات هنا تخص الهوية والواجهة وتجربة اللعبة، بينما بقي منطق التشغيل متوافقًا مع بنيته البرمجية. يجب الاحتفاظ بإشعارات حقوق النشر وشروط الترخيص عند إعادة التوزيع.\n'''
(root / 'README.md').write_text(readme)

branding = '''# هل أنت هنا؟ — نسخة اللعبة المستقلة\n\nهذه النسخة تقدم لعبة **هل أنت هنا؟** كتجربة عربية مستقلة. تم فصل الاسم والواجهة والبيانات التعريفية والوثائق الظاهرة عن هوية المشروع الأصلي، مع إبقاء منطق التشغيل، مكونات الرواية التفاعلية، ونقاط التوافق البرمجية اللازمة للمحرك.\n\n## ما تغير\n\nالواجهة عربية أولًا مع RTL تلقائي، وهوية سينمائية داكنة، وقائمة متجاوبة، ونمط سينمائي واختصارات وصول. كما أصبحت بيانات الحزمة وملف manifest وأسماء نواتج البناء تحمل هوية اللعبة الجديدة.\n\n## ما بقي\n\nبقيت أسماء الرموز الداخلية التي يعتمد عليها منطق التشغيل والتوافق البرمجي، مثل namespace المحرك وواجهاته، حتى لا تنكسر الألعاب والبرامج التي تستخدم هذه الوظائف. هذه الأسماء ليست علامة واجهة للمستخدم.\n\n## الترخيص\n\nلا يمكن إزالة ملف `LICENSE` أو إشعار MIT وحقوق المؤلف الأصلي من نسخة مشتقة. الاحتفاظ بها شرط لإعادة التوزيع القانوني، ولا يمنع تقديم اللعبة بواجهة وهوية مستقلة.\n'''
(root / 'BRANDING.md').write_text(branding)

# Replace the starter shell metadata and generated asset names; keep the root id
# because it is part of the runtime DOM contract.
html = root / 'dist/index.html'
h = html.read_text()
h = h.replace('<html lang="en"', '<html lang="ar" dir="rtl"')
h = h.replace('<title>Monogatari Visual Novel</title>', '<title>هل أنت هنا؟ — رواية تفاعلية</title>')
h = h.replace('<!-- Monogatari CSS Libraries -->', '<!-- هل أنت هنا؟ CSS -->')
h = h.replace('./engine/core/monogatari.css', './engine/core/hal-anta-huna.css')
h = h.replace('<!-- Monogatari JavaScript Libraries -->', '<!-- هل أنت هنا؟ JavaScript -->')
h = h.replace('./engine/core/monogatari.js', './engine/core/hal-anta-huna.js')
h = h.replace('JavaScript Disabled or not Supported.', 'تم تعطيل JavaScript أو أنه غير مدعوم.')
h = h.replace('To play this game, please enable JavaScript executing or use a different browser.', 'لتشغيل اللعبة، فعّل JavaScript أو استخدم متصفحًا آخر.')
html.write_text(h)

dist_package = root / 'dist/package.json'
dist_data = json.loads(dist_package.read_text())
dist_data['productName'] = 'هل أنت هنا؟'
dist_data['description'] = 'رواية تفاعلية عربية سينمائية'
dist_data['build']['appId'] = 'com.abdullahqatan.halantahuna'
dist_data['build']['linux']['synopsis'] = 'رواية تفاعلية عربية سينمائية'
dist_data['build']['linux']['description'] = 'هل أنت هنا؟ لعبة قصصية عربية مستقلة.'
dist_package.write_text(json.dumps(dist_data, ensure_ascii=False, indent='\t') + '\n')
