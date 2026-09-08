import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageHelp', {
  "en": {
    "back": "Back",
    "authorPage": "Author Page",
    "authorPageNotFound": "Author Page not found",
    "failedLoadAuthorPage": "Failed to load Author Page",
    "alreadyReported": "You already submitted a report for this Page.",
    "failedSubmitReport": "Failed to submit report",
    "reportSubmitted": "Your report was submitted to Shadow for review.",
    "failedBlockAuthorPage": "Failed to block Author Page",
    "reviewReport": "Review report",
    "helpPage": "Help Page",
    "loading": "Loading...",
    "whySupport": "Why do you think {{name}} needs support?",
    "supportPrivacy": "{{name}} won’t be notified about this. Choose the option that best describes what is happening.",
    "reportPrivacy": "Your report will be sent to Shadow Admin for review. The Author Page won’t be told who submitted it.",
    "submitting": "Submitting...",
    "submitReport": "Submit report",
    "thanks": "Thanks for letting us know",
    "otherSteps": "Other steps you can take",
    "blockedName": "{{name}} blocked",
    "blockName": "Block {{name}}",
    "blockHelp": "You won’t be able to see or contact each other.",
    "submittedReview": "Submitted to Shadow for Review",
    "sentToAdmin": "{t('authorPageHelp.sentToAdmin')}",
    "done": "Done",
    "selfHarmLabel": "Suicide or self-injury",
    "selfHarmDesc": "The Page may show signs of suicide, self-harm, or immediate danger.",
    "selfHarm1": "Talking about suicide or wanting to die",
    "selfHarm2": "Showing or encouraging self-injury",
    "selfHarm3": "Immediate danger or serious threat",
    "harassmentLabel": "Harassment",
    "harassmentDesc": "The Page may be bullying, threatening, or repeatedly targeting someone.",
    "harassment1": "Bullying or repeated harassment",
    "harassment2": "Threatening another person",
    "harassment3": "Sharing private information to harm someone",
    "hackedLabel": "Hacked",
    "hackedDesc": "The Page may have been taken over or changed without the owner’s permission.",
    "hacked1": "The Page appears to be hacked",
    "hacked2": "The Page identity or information suddenly changed",
    "hacked3": "Someone may have taken control of the Page",
    "impersonationLabel": "Pretending to be someone else",
    "impersonationDesc": "The Page may be impersonating another person, author, or organization.",
    "impersonation1": "Pretending to be another author",
    "impersonation2": "Using another person’s identity",
    "impersonation3": "Pretending to be an official Page",
    "scamLabel": "Scam or fraud",
    "scamDesc": "The Page may be using misleading offers, suspicious links, or fraud.",
    "scam1": "Suspicious link or payment request",
    "scam2": "Fake promotion, prize, or offer",
    "scam3": "Fraud or misleading business activity",
    "hateLabel": "Hate or abusive content",
    "hateDesc": "The Page may contain hateful or discriminatory attacks.",
    "hate1": "Hate speech or discrimination",
    "hate2": "Abusive attacks based on identity",
    "hate3": "Content encouraging hatred toward a group"
  },
  "km": {
    "back": "ត្រឡប់ក្រោយ",
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "authorPageNotFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "failedLoadAuthorPage": "មិនអាចផ្ទុកទំព័រអ្នកនិពន្ធបានទេ",
    "alreadyReported": "អ្នកបានដាក់របាយការណ៍សម្រាប់ទំព័រនេះរួចហើយ។",
    "failedSubmitReport": "មិនអាចដាក់របាយការណ៍បានទេ",
    "reportSubmitted": "របាយការណ៍របស់អ្នកត្រូវបានផ្ញើទៅ Shadow ដើម្បីពិនិត្យ។",
    "failedBlockAuthorPage": "មិនអាចទប់ស្កាត់ទំព័រអ្នកនិពន្ធបានទេ",
    "reviewReport": "ពិនិត្យរបាយការណ៍",
    "helpPage": "ជំនួយទំព័រ",
    "loading": "កំពុងផ្ទុក...",
    "whySupport": "ហេតុអ្វីអ្នកគិតថា {{name}} ត្រូវការជំនួយ?",
    "supportPrivacy": "{{name}} នឹងមិនត្រូវបានជូនដំណឹងអំពីរឿងនេះទេ។ ជ្រើសជម្រើសដែលពិពណ៌នាស្ថានភាពបានត្រឹមត្រូវបំផុត។",
    "reportPrivacy": "របាយការណ៍របស់អ្នកនឹងត្រូវផ្ញើទៅ Shadow Admin ដើម្បីពិនិត្យ។ ទំព័រអ្នកនិពន្ធនឹងមិនដឹងថានរណាជាអ្នកដាក់របាយការណ៍ទេ។",
    "submitting": "កំពុងផ្ញើ...",
    "submitReport": "ដាក់របាយការណ៍",
    "thanks": "អរគុណដែលបានប្រាប់យើង",
    "otherSteps": "ជំហានផ្សេងទៀតដែលអ្នកអាចធ្វើបាន",
    "blockedName": "បានទប់ស្កាត់ {{name}}",
    "blockName": "ទប់ស្កាត់ {{name}}",
    "blockHelp": "អ្នកទាំងពីរនឹងមិនអាចមើលឃើញ ឬទាក់ទងគ្នាបានទេ។",
    "submittedReview": "បានផ្ញើទៅ Shadow ដើម្បីពិនិត្យ",
    "sentToAdmin": "របាយការណ៍របស់អ្នកត្រូវបានផ្ញើទៅ Admin ហើយ។",
    "done": "រួចរាល់",
    "selfHarmLabel": "ការធ្វើអត្តឃាត ឬធ្វើបាបខ្លួនឯង",
    "selfHarmDesc": "ទំព័រនេះអាចបង្ហាញសញ្ញានៃការធ្វើអត្តឃាត ការធ្វើបាបខ្លួនឯង ឬគ្រោះថ្នាក់បន្ទាន់។",
    "selfHarm1": "និយាយអំពីការធ្វើអត្តឃាត ឬចង់ស្លាប់",
    "selfHarm2": "បង្ហាញ ឬលើកទឹកចិត្តឱ្យធ្វើបាបខ្លួនឯង",
    "selfHarm3": "គ្រោះថ្នាក់បន្ទាន់ ឬការគំរាមធ្ងន់ធ្ងរ",
    "harassmentLabel": "ការរំខាន",
    "harassmentDesc": "ទំព័រនេះអាចកំពុងបៀតបៀន គំរាមកំហែង ឬកំណត់គោលដៅលើនរណាម្នាក់ជាបន្តបន្ទាប់។",
    "harassment1": "ការបៀតបៀន ឬរំខានជាបន្តបន្ទាប់",
    "harassment2": "គំរាមកំហែងអ្នកដទៃ",
    "harassment3": "ចែករំលែកព័ត៌មានឯកជនដើម្បីធ្វើបាបនរណាម្នាក់",
    "hackedLabel": "ត្រូវបាន Hack",
    "hackedDesc": "ទំព័រនេះអាចត្រូវបានគេគ្រប់គ្រង ឬផ្លាស់ប្តូរដោយគ្មានការអនុញ្ញាតពីម្ចាស់។",
    "hacked1": "ទំព័រនេះហាក់ដូចជាត្រូវបាន Hack",
    "hacked2": "អត្តសញ្ញាណ ឬព័ត៌មានទំព័រផ្លាស់ប្តូរភ្លាមៗ",
    "hacked3": "នរណាម្នាក់អាចបានគ្រប់គ្រងទំព័រនេះ",
    "impersonationLabel": "ក្លែងធ្វើជាអ្នកផ្សេង",
    "impersonationDesc": "ទំព័រនេះអាចកំពុងក្លែងធ្វើជាមនុស្ស អ្នកនិពន្ធ ឬអង្គការផ្សេង។",
    "impersonation1": "ក្លែងធ្វើជាអ្នកនិពន្ធផ្សេង",
    "impersonation2": "ប្រើអត្តសញ្ញាណរបស់អ្នកដទៃ",
    "impersonation3": "ក្លែងធ្វើជាទំព័រផ្លូវការ",
    "scamLabel": "បោកប្រាស់ ឬឆបោក",
    "scamDesc": "ទំព័រនេះអាចកំពុងប្រើការផ្តល់ជូនបំភាន់ តំណគួរឱ្យសង្ស័យ ឬការឆបោក។",
    "scam1": "តំណគួរឱ្យសង្ស័យ ឬសំណើទូទាត់",
    "scam2": "ប្រូម៉ូសិន រង្វាន់ ឬការផ្តល់ជូនក្លែងក្លាយ",
    "scam3": "ការឆបោក ឬសកម្មភាពអាជីវកម្មបំភាន់",
    "hateLabel": "ខ្លឹមសារស្អប់ខ្ពើម ឬបំពាន",
    "hateDesc": "ទំព័រនេះអាចមានការវាយប្រហារដោយការស្អប់ខ្ពើម ឬការរើសអើង។",
    "hate1": "ពាក្យសម្ដីស្អប់ខ្ពើម ឬការរើសអើង",
    "hate2": "ការវាយប្រហារបំពានផ្អែកលើអត្តសញ្ញាណ",
    "hate3": "ខ្លឹមសារដែលលើកទឹកចិត្តឱ្យស្អប់ក្រុមណាមួយ"
  },
  "zh": {
    "back": "返回",
    "authorPage": "作者主页",
    "authorPageNotFound": "未找到作者主页",
    "failedLoadAuthorPage": "无法加载作者主页",
    "alreadyReported": "你已经提交过此主页的举报。",
    "failedSubmitReport": "无法提交举报",
    "reportSubmitted": "你的举报已发送给 Shadow 审核。",
    "failedBlockAuthorPage": "无法屏蔽作者主页",
    "reviewReport": "审核举报",
    "helpPage": "主页帮助",
    "loading": "加载中...",
    "whySupport": "你为什么认为 {{name}} 需要帮助？",
    "supportPrivacy": "{{name}} 不会收到此操作的通知。请选择最符合当前情况的选项。",
    "reportPrivacy": "你的举报将发送给 Shadow 管理员审核。作者主页不会知道举报人是谁。",
    "submitting": "提交中...",
    "submitReport": "提交举报",
    "thanks": "感谢你的反馈",
    "otherSteps": "你还可以采取其他措施",
    "blockedName": "已屏蔽 {{name}}",
    "blockName": "屏蔽 {{name}}",
    "blockHelp": "你们将无法看到或联系彼此。",
    "submittedReview": "已提交给 Shadow 审核",
    "sentToAdmin": "你的举报已发送给管理员。",
    "done": "完成",
    "selfHarmLabel": "自杀或自伤",
    "selfHarmDesc": "该主页可能出现自杀、自伤或迫在眉睫的危险迹象。",
    "selfHarm1": "谈论自杀或想要死亡",
    "selfHarm2": "展示或鼓励自伤",
    "selfHarm3": "迫在眉睫的危险或严重威胁",
    "harassmentLabel": "骚扰",
    "harassmentDesc": "该主页可能在欺凌、威胁或持续针对某人。",
    "harassment1": "欺凌或持续骚扰",
    "harassment2": "威胁他人",
    "harassment3": "分享隐私信息以伤害他人",
    "hackedLabel": "账号被盗",
    "hackedDesc": "该主页可能在未经所有者许可的情况下被接管或更改。",
    "hacked1": "该主页似乎已被盗用",
    "hacked2": "主页身份或信息突然改变",
    "hacked3": "可能有人控制了该主页",
    "impersonationLabel": "冒充他人",
    "impersonationDesc": "该主页可能在冒充其他个人、作者或组织。",
    "impersonation1": "冒充其他作者",
    "impersonation2": "使用他人的身份",
    "impersonation3": "冒充官方主页",
    "scamLabel": "诈骗或欺诈",
    "scamDesc": "该主页可能在使用误导性优惠、可疑链接或欺诈手段。",
    "scam1": "可疑链接或付款请求",
    "scam2": "虚假促销、奖品或优惠",
    "scam3": "欺诈或误导性商业活动",
    "hateLabel": "仇恨或辱骂内容",
    "hateDesc": "该主页可能包含仇恨或歧视性攻击。",
    "hate1": "仇恨言论或歧视",
    "hate2": "基于身份的辱骂攻击",
    "hate3": "鼓动对某群体仇恨的内容"
  },
  "ja": {
    "back": "戻る",
    "authorPage": "著者ページ",
    "authorPageNotFound": "著者ページが見つかりません",
    "failedLoadAuthorPage": "著者ページを読み込めませんでした",
    "alreadyReported": "このページについてはすでに報告済みです。",
    "failedSubmitReport": "報告を送信できませんでした",
    "reportSubmitted": "報告は確認のため Shadow に送信されました。",
    "failedBlockAuthorPage": "著者ページをブロックできませんでした",
    "reviewReport": "報告内容を確認",
    "helpPage": "ページのヘルプ",
    "loading": "読み込み中...",
    "whySupport": "{{name}} にサポートが必要だと思う理由は何ですか？",
    "supportPrivacy": "{{name}} にはこの操作は通知されません。状況に最も当てはまる項目を選んでください。",
    "reportPrivacy": "報告は Shadow 管理者に送信されます。著者ページには報告者は通知されません。",
    "submitting": "送信中...",
    "submitReport": "報告を送信",
    "thanks": "お知らせいただきありがとうございます",
    "otherSteps": "ほかにできること",
    "blockedName": "{{name}} をブロックしました",
    "blockName": "{{name}} をブロック",
    "blockHelp": "お互いを表示したり連絡したりできなくなります。",
    "submittedReview": "Shadow の確認に送信済み",
    "sentToAdmin": "報告は管理者に送信されました。",
    "done": "完了",
    "selfHarmLabel": "自殺または自傷",
    "selfHarmDesc": "このページには自殺、自傷、または差し迫った危険の兆候がある可能性があります。",
    "selfHarm1": "自殺や死にたい気持ちについて話している",
    "selfHarm2": "自傷を示したり勧めたりしている",
    "selfHarm3": "差し迫った危険または深刻な脅威",
    "harassmentLabel": "嫌がらせ",
    "harassmentDesc": "このページは誰かをいじめたり、脅したり、繰り返し標的にしている可能性があります。",
    "harassment1": "いじめや繰り返しの嫌がらせ",
    "harassment2": "他人を脅している",
    "harassment3": "誰かを傷つけるために個人情報を共有している",
    "hackedLabel": "乗っ取り",
    "hackedDesc": "このページは所有者の許可なく乗っ取られたり変更された可能性があります。",
    "hacked1": "ページが乗っ取られたように見える",
    "hacked2": "ページの身元や情報が突然変わった",
    "hacked3": "誰かがページを操作している可能性がある",
    "impersonationLabel": "他人になりすましている",
    "impersonationDesc": "このページは別の人物、著者、組織になりすましている可能性があります。",
    "impersonation1": "別の著者になりすましている",
    "impersonation2": "他人の身元を使用している",
    "impersonation3": "公式ページになりすましている",
    "scamLabel": "詐欺または不正",
    "scamDesc": "このページは誤解を招く提案、不審なリンク、詐欺を使用している可能性があります。",
    "scam1": "不審なリンクや支払い要求",
    "scam2": "偽のプロモーション、賞品、提案",
    "scam3": "詐欺または誤解を招くビジネス活動",
    "hateLabel": "ヘイトまたは侮辱的な内容",
    "hateDesc": "このページには憎悪や差別的な攻撃が含まれている可能性があります。",
    "hate1": "ヘイトスピーチまたは差別",
    "hate2": "身元に基づく侮辱的な攻撃",
    "hate3": "特定の集団への憎悪を助長する内容"
  },
  "ko": {
    "back": "뒤로",
    "authorPage": "작가 페이지",
    "authorPageNotFound": "작가 페이지를 찾을 수 없습니다",
    "failedLoadAuthorPage": "작가 페이지를 불러오지 못했습니다",
    "alreadyReported": "이 페이지는 이미 신고했습니다.",
    "failedSubmitReport": "신고를 제출하지 못했습니다",
    "reportSubmitted": "신고가 검토를 위해 Shadow에 전송되었습니다.",
    "failedBlockAuthorPage": "작가 페이지를 차단하지 못했습니다",
    "reviewReport": "신고 검토",
    "helpPage": "페이지 도움말",
    "loading": "불러오는 중...",
    "whySupport": "{{name}}에게 도움이 필요하다고 생각하는 이유는 무엇인가요?",
    "supportPrivacy": "{{name}}에게는 이 내용이 알림으로 전달되지 않습니다. 상황을 가장 잘 설명하는 항목을 선택하세요.",
    "reportPrivacy": "신고는 Shadow 관리자에게 검토용으로 전송됩니다. 작가 페이지에는 신고자가 누구인지 알려지지 않습니다.",
    "submitting": "제출 중...",
    "submitReport": "신고 제출",
    "thanks": "알려주셔서 감사합니다",
    "otherSteps": "추가로 할 수 있는 조치",
    "blockedName": "{{name}} 차단됨",
    "blockName": "{{name}} 차단",
    "blockHelp": "서로 보거나 연락할 수 없게 됩니다.",
    "submittedReview": "Shadow 검토에 제출됨",
    "sentToAdmin": "신고가 관리자에게 전송되었습니다.",
    "done": "완료",
    "selfHarmLabel": "자살 또는 자해",
    "selfHarmDesc": "이 페이지에 자살, 자해 또는 즉각적인 위험의 징후가 있을 수 있습니다.",
    "selfHarm1": "자살 또는 죽고 싶다는 말을 함",
    "selfHarm2": "자해를 보여주거나 조장함",
    "selfHarm3": "즉각적인 위험 또는 심각한 위협",
    "harassmentLabel": "괴롭힘",
    "harassmentDesc": "이 페이지가 누군가를 괴롭히거나 위협하거나 반복적으로 표적으로 삼고 있을 수 있습니다.",
    "harassment1": "괴롭힘 또는 반복적인 괴롭힘",
    "harassment2": "다른 사람을 위협함",
    "harassment3": "누군가를 해치기 위해 개인정보를 공유함",
    "hackedLabel": "해킹됨",
    "hackedDesc": "이 페이지가 소유자의 허락 없이 탈취되거나 변경되었을 수 있습니다.",
    "hacked1": "페이지가 해킹된 것으로 보임",
    "hacked2": "페이지의 신원 또는 정보가 갑자기 변경됨",
    "hacked3": "누군가가 페이지를 장악했을 수 있음",
    "impersonationLabel": "다른 사람 사칭",
    "impersonationDesc": "이 페이지가 다른 사람, 작가 또는 조직을 사칭하고 있을 수 있습니다.",
    "impersonation1": "다른 작가를 사칭함",
    "impersonation2": "다른 사람의 신원을 사용함",
    "impersonation3": "공식 페이지를 사칭함",
    "scamLabel": "사기 또는 부정행위",
    "scamDesc": "이 페이지가 오해를 부르는 제안, 의심스러운 링크 또는 사기를 사용하고 있을 수 있습니다.",
    "scam1": "의심스러운 링크 또는 결제 요청",
    "scam2": "가짜 프로모션, 경품 또는 제안",
    "scam3": "사기 또는 오해를 부르는 비즈니스 활동",
    "hateLabel": "혐오 또는 모욕적인 콘텐츠",
    "hateDesc": "이 페이지에 혐오적이거나 차별적인 공격이 포함되어 있을 수 있습니다.",
    "hate1": "혐오 발언 또는 차별",
    "hate2": "정체성을 기반으로 한 모욕적 공격",
    "hate3": "특정 집단에 대한 혐오를 조장하는 콘텐츠"
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HELP_GROUPS = [
  {
    id: 'self_harm',
    labelKey: 'selfHarmLabel',
    descriptionKey: 'selfHarmDesc',
    detailKeys: {
      'Talking about suicide or wanting to die': 'selfHarm1',
      'Showing or encouraging self-injury': 'selfHarm2',
      'Immediate danger or serious threat': 'selfHarm3',
    },
    label: 'Suicide or self-injury',
    icon: 'fa-solid fa-heart-pulse',
    reasonCode: 'violence_or_threat',
    description: 'The Page may show signs of suicide, self-harm, or immediate danger.',
    details: [
      'Talking about suicide or wanting to die',
      'Showing or encouraging self-injury',
      'Immediate danger or serious threat',
    ],
  },
  {
    id: 'harassment',
    labelKey: 'harassmentLabel',
    descriptionKey: 'harassmentDesc',
    detailKeys: {
      'Bullying or repeated harassment': 'harassment1',
      'Threatening another person': 'harassment2',
      'Sharing private information to harm someone': 'harassment3',
    },
    label: 'Harassment',
    icon: 'fa-solid fa-user-shield',
    reasonCode: 'harassment_or_bullying',
    description: 'The Page may be bullying, threatening, or repeatedly targeting someone.',
    details: [
      'Bullying or repeated harassment',
      'Threatening another person',
      'Sharing private information to harm someone',
    ],
  },
  {
    id: 'hacked',
    labelKey: 'hackedLabel',
    descriptionKey: 'hackedDesc',
    detailKeys: {
      'The Page appears to be hacked': 'hacked1',
      'The Page identity or information suddenly changed': 'hacked2',
      'Someone may have taken control of the Page': 'hacked3',
    },
    label: 'Hacked',
    icon: 'fa-solid fa-user-lock',
    reasonCode: 'other',
    description: 'The Page may have been taken over or changed without the owner’s permission.',
    details: [
      'The Page appears to be hacked',
      'The Page identity or information suddenly changed',
      'Someone may have taken control of the Page',
    ],
  },
  {
    id: 'impersonation',
    labelKey: 'impersonationLabel',
    descriptionKey: 'impersonationDesc',
    detailKeys: {
      'Pretending to be another author': 'impersonation1',
      'Using another person’s identity': 'impersonation2',
      'Pretending to be an official Page': 'impersonation3',
    },
    label: 'Pretending to be someone else',
    icon: 'fa-solid fa-user-secret',
    reasonCode: 'impersonation',
    description: 'The Page may be impersonating another person, author, or organization.',
    details: [
      'Pretending to be another author',
      'Using another person’s identity',
      'Pretending to be an official Page',
    ],
  },
  {
    id: 'scam',
    labelKey: 'scamLabel',
    descriptionKey: 'scamDesc',
    detailKeys: {
      'Suspicious link or payment request': 'scam1',
      'Fake promotion, prize, or offer': 'scam2',
      'Fraud or misleading business activity': 'scam3',
    },
    label: 'Scam or fraud',
    icon: 'fa-solid fa-link',
    reasonCode: 'spam_or_scam',
    description: 'The Page may be using misleading offers, suspicious links, or fraud.',
    details: [
      'Suspicious link or payment request',
      'Fake promotion, prize, or offer',
      'Fraud or misleading business activity',
    ],
  },
  {
    id: 'hate',
    labelKey: 'hateLabel',
    descriptionKey: 'hateDesc',
    detailKeys: {
      'Hate speech or discrimination': 'hate1',
      'Abusive attacks based on identity': 'hate2',
      'Content encouraging hatred toward a group': 'hate3',
    },
    label: 'Hate or abusive content',
    icon: 'fa-solid fa-ban',
    reasonCode: 'hate_speech',
    description: 'The Page may contain hateful or discriminatory attacks.',
    details: [
      'Hate speech or discrimination',
      'Abusive attacks based on identity',
      'Content encouraging hatred toward a group',
    ],
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function PageHeader({ title, onBack, backLabel }) {
  return (
    <header className="relative z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
      <div className="mx-auto flex min-h-[66px] w-full max-w-[720px] items-center px-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
          aria-label={backLabel}
        >
          <i className="fa-solid fa-chevron-left text-[20px]" />
        </button>
        <div className="min-w-0 flex-1 px-1">
          <h1 className="truncate text-[17px] font-bold text-[var(--shadow-text-primary)]">{title}</h1>
        </div>
      </div>
    </header>
  )
}

function SheetHeader({ title }) {
  return (
    <>
      <div className="mx-auto h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)]" />
      <div className="relative mt-1 flex h-12 items-center justify-center px-14">
        <h2 className="truncate text-[18px] font-bold text-[var(--shadow-text-primary)]">{title}</h2>
      </div>
    </>
  )
}

export default function AuthorPageHelpPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()
  const [dragY, setDragY] = useState(0)
  const dragStartYRef = useRef(null)
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [step, setStep] = useState('reason')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedDetail, setSelectedDetail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [blocked, setBlocked] = useState(false)
  const [blocking, setBlocking] = useState(false)

  const pageName = page?.page_name || page?.name || t('authorPageHelp.authorPage')
  const pageId = page?.id || ''
  const selectedGroup = useMemo(
    () => HELP_GROUPS.find((item) => item.id === selectedGroupId) || null,
    [selectedGroupId]
  )

  useEffect(() => {
    if (!pageUsername) {
      setError(t('authorPageHelp.authorPageNotFound'))
      setLoading(false)
      return undefined
    }

    let ignore = false
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setError('')
        const token = getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('authorPageHelp.authorPageNotFound'))
        }

        if (!ignore) {
          setPage(data.author_page || data.author || data.page || null)
        }
      } catch (loadError) {
        if (!ignore && loadError?.name !== 'AbortError') {
          setError(loadError.message || t('authorPageHelp.failedLoadAuthorPage'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [pageUsername])

  function chooseGroup(groupId) {
    setSelectedGroupId(groupId)
    setSelectedDetail('')
    setStep('detail')
  }

  function chooseDetail(detail) {
    setSelectedDetail(detail)
    setStep('review')
  }

  function goBack() {
    if (step === 'detail') {
      setStep('reason')
      setSelectedGroupId('')
      return
    }

    if (step === 'review') {
      setStep('detail')
      setSelectedDetail('')
      return
    }

    navigate(-1)
  }

  async function submitReport() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', {
        state: { returnTo: `/author/page/${pageUsername}/help` },
      })
      return
    }

    if (!pageId || !selectedGroup || !selectedDetail || submitting) return

    try {
      setSubmitting(true)
      setSubmitMessage('')

      const reasonText = `${selectedGroup.label}: ${selectedDetail}`
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_type: 'author_page',
          target_id: pageId,
          target_url: `${window.location.origin}/author/page/${pageUsername}`,
          reason_code: selectedGroup.reasonCode,
          reason_text: reasonText,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 409 && data.code === 'REPORT_ALREADY_OPEN') {
        setSubmitMessage(data.message || t('authorPageHelp.alreadyReported'))
        setStep('success')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('authorPageHelp.failedSubmitReport'))
      }

      setSubmitMessage(data.message || t('authorPageHelp.reportSubmitted'))
      setStep('success')
    } catch (submitError) {
      setSubmitMessage(submitError.message || t('authorPageHelp.failedSubmitReport'))
    } finally {
      setSubmitting(false)
    }
  }

  async function blockPage() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', {
        state: { returnTo: `/author/page/${pageUsername}/help` },
      })
      return
    }

    if (blocking || blocked) return

    try {
      setBlocking(true)
      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/block`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('authorPageHelp.failedBlockAuthorPage'))
      }

      setBlocked(true)
    } catch (blockError) {
      setSubmitMessage(blockError.message || t('authorPageHelp.failedBlockAuthorPage'))
    } finally {
      setBlocking(false)
    }
  }

  function closeHelpSheet() {
  navigate(-1)
}

function handleDragStart(event) {
  dragStartYRef.current = event.clientY
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function handleDragMove(event) {
  if (dragStartYRef.current === null) return
  setDragY(Math.max(0, event.clientY - dragStartYRef.current))
}

function handleDragEnd(event) {
  if (dragStartYRef.current === null) return

  const distance = Math.max(0, event.clientY - dragStartYRef.current)
  dragStartYRef.current = null

  if (distance >= 70) {
    closeHelpSheet()
    return
  }

  setDragY(0)
}

  const headerTitle = step === 'review' ? t('authorPageHelp.reviewReport') : t('authorPageHelp.helpPage')
  const headerBack =
    step === 'success'
      ? () => navigate(`/author/page/${pageUsername}`)
      : goBack

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)]">
      <PageHeader title={loading ? t('authorPageHelp.loading') : pageName} onBack={headerBack} backLabel={t('authorPageHelp.back')} />

      <div
  className="fixed inset-0 z-30 bg-black/40"
  onClick={closeHelpSheet}
>
  <section
    className="absolute bottom-0 left-0 right-0 top-[66px] mx-auto w-full max-w-[720px] overflow-y-auto rounded-t-[20px] bg-[var(--shadow-bg-soft)] px-4 pb-6"
    style={{
      transform: `translateY(${dragY}px)`,
      transition: dragStartYRef.current === null ? 'transform 180ms ease-out' : 'none',
    }}
    onClick={(event) => event.stopPropagation()}
  >
    <div
      className="touch-none select-none pt-3"
      style={{ touchAction: 'none' }}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
    >
      <SheetHeader title={headerTitle} />
    </div>

    <main>
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--shadow-border-strong)] border-t-[var(--shadow-text-primary)]" />
          </div>
        ) : error ? (
          <div className="px-4 py-16 text-center">
            <i className="fa-solid fa-circle-exclamation text-[30px] text-[var(--shadow-text-tertiary)]" />
            <p className="mt-3 text-[14px] font-normal text-[var(--shadow-text-secondary)]">{error}</p>
          </div>
        ) : step === 'reason' ? (
          <div className="pt-5">
            <h2 className="text-[22px] font-bold leading-7 text-[var(--shadow-text-primary)]">
              {t('authorPageHelp.whySupport', { name: pageName })}
            </h2>
            <p className="mt-2 text-[14px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {t('authorPageHelp.supportPrivacy', { name: pageName })}
            </p>

            <div className="mt-5 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-surface)]">
              {HELP_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => chooseGroup(group.id)}
                  className="flex min-h-[64px] w-full items-center gap-3 px-4 text-left active:bg-[var(--shadow-bg-soft)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
                    <i className={`${group.icon} text-[18px]`} />
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-normal text-[var(--shadow-text-primary)]">
                    {t(`authorPageHelp.${group.labelKey}`)}
                  </span>
                  <i className="fa-solid fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)]" />
                </button>
              ))}
            </div>
          </div>
        ) : step === 'detail' ? (
          <div className="pt-5">
            <h2 className="text-[22px] font-bold leading-7 text-[var(--shadow-text-primary)]">
              {selectedGroup ? t(`authorPageHelp.${selectedGroup.labelKey}`) : ''}
            </h2>
            <p className="mt-2 text-[14px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {selectedGroup ? t(`authorPageHelp.${selectedGroup.descriptionKey}`) : ''}
            </p>

            <div className="mt-5 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-surface)]">
              {(selectedGroup?.details || []).map((detail) => (
                <button
                  key={t(`authorPageHelp.${selectedGroup?.detailKeys?.[detail]}`)}
                  type="button"
                  onClick={() => chooseDetail(detail)}
                  className="flex min-h-[66px] w-full items-center gap-3 px-4 text-left active:bg-[var(--shadow-bg-soft)]"
                >
                  <span className="min-w-0 flex-1 text-[15px] font-normal leading-5 text-[var(--shadow-text-primary)]">
                    {t(`authorPageHelp.${selectedGroup?.detailKeys?.[detail]}`)}
                  </span>
                  <i className="fa-solid fa-chevron-right text-[15px] text-[var(--shadow-text-secondary)]" />
                </button>
              ))}
            </div>
          </div>
        ) : step === 'review' ? (
          <div className="pt-5">
            <div className="rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                  <i className={`${selectedGroup?.icon || 'fa-regular fa-flag'} text-[18px]`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[16px] font-bold text-[var(--shadow-text-primary)]">{pageName}</div>
                  <div className="mt-0.5 text-[12px] font-normal text-[var(--shadow-text-secondary)]">{t('authorPageHelp.authorPage')}</div>
                </div>
              </div>

              <div className="mt-5 rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-4">
                <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">{selectedGroup ? t(`authorPageHelp.${selectedGroup.labelKey}`) : ''}</div>
                <div className="mt-1 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                  {selectedDetail}
                </div>
              </div>
            </div>

            {submitMessage ? (
              <div className="mt-4 rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[13px] font-normal leading-5 text-[var(--shadow-text-primary)]">
                {submitMessage}
              </div>
            ) : null}

            <p className="mt-4 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {t('authorPageHelp.reportPrivacy')}
            </p>

            <button
              type="button"
              onClick={submitReport}
              disabled={submitting}
              className="mt-5 h-12 w-full rounded-[12px] bg-[var(--shadow-text-primary)] text-[15px] font-bold text-[var(--shadow-bg-surface)] disabled:opacity-60"
            >
              {submitting ? t('authorPageHelp.submitting') : t('authorPageHelp.submitReport')}
            </button>
          </div>
        ) : (
          <div className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2e9d4d] text-white">
                <i className="fa-solid fa-check text-[24px]" />
              </div>
              <h2 className="mt-5 text-[22px] font-bold text-[var(--shadow-text-primary)]">{t('authorPageHelp.thanks')}</h2>
              <p className="mx-auto mt-2 max-w-[430px] text-[14px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
                {submitMessage || t('authorPageHelp.reportSubmitted')}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-[18px] font-bold text-[var(--shadow-text-primary)]">{t('authorPageHelp.otherSteps')}</h3>

              <button
                type="button"
                onClick={blockPage}
                disabled={blocking || blocked}
                className="mt-3 flex min-h-[66px] w-full items-center gap-3 rounded-[12px] bg-[var(--shadow-bg-surface)] px-4 text-left disabled:opacity-60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
                  <i className="fa-solid fa-user-slash text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[var(--shadow-text-primary)]">
                    {blocked ? t('authorPageHelp.blockedName', { name: pageName }) : t('authorPageHelp.blockName', { name: pageName })}
                  </span>
                  <span className="mt-0.5 block text-[12px] font-normal text-[var(--shadow-text-secondary)]">
                    {t('authorPageHelp.blockHelp')}
                  </span>
                </span>
              </button>

              <div className="mt-2 flex min-h-[66px] items-center gap-3 rounded-[12px] bg-[var(--shadow-bg-surface)] px-4 opacity-60">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
                  <i className="fa-solid fa-check text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[var(--shadow-text-primary)]">
                    {t('authorPageHelp.submittedReview')}
                  </span>
                  <span className="mt-0.5 block text-[12px] font-normal text-[var(--shadow-text-secondary)]">
                    {t('authorPageHelp.sentToAdmin')}
                  </span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/author/page/${pageUsername}`)}
              className="mt-8 h-12 w-full rounded-[12px] bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(139,92,246,0.28)]"
            >
              {t('authorPageHelp.done')}
            </button>
          </div>
        )}
      </main>
    </section>
  </div>
</div>
  )
}
