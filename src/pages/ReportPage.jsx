import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('reportPage', {
  en: {
    reportStory: 'Report this story',
    story: 'Story',
    storySubtitle: 'Choose the reason that best describes the problem with this story.',
    reportComment: 'Report this comment',
    comment: 'Comment',
    commentSubtitle: 'Tell us what is wrong with this comment.',
    reportAuthorPage: 'Report this Author Page',
    authorPage: 'Author Page',
    authorPageSubtitle: 'Choose the reason that best describes the problem with this page.',
    reportAuthorPost: 'Report this Author Post',
    authorPost: 'Author Post',
    reportReaderPost: 'Report this Reader Post',
    readerPost: 'Reader Post',
    postSubtitle: 'Choose the reason that best describes the problem with this post.',
    reportPhoto: 'Report this photo',
    photo: 'Photo',
    photoSubtitle: 'Choose the reason that best describes the problem with this photo.',
    sexualLabel: 'Sexual or inappropriate content',
    sexualDescription: 'Sexual, explicit, or other inappropriate content.',
    violenceLabel: 'Violence, threats, or harmful content',
    violenceDescription: 'Graphic violence, threats, self-harm, or dangerous content.',
    hateLabel: 'Hate or discriminatory content',
    hateDescription: 'Attacks based on identity, religion, nationality, gender, or race.',
    copyrightLabel: 'Copyright or stolen content',
    copyrightDescription: 'Copied or protected content used without permission.',
    spamLabel: 'Spam, scam, or suspicious content',
    spamDescription: 'Fraud, misleading promotion, suspicious links, or unsafe content.',
    otherLabel: 'Private information or something else',
    otherDescription: 'Personal information or another issue not listed above.',
    harassmentLabel: 'Harassment or bullying',
    harassmentDescription: 'Targeted insults, humiliation, intimidation, or repeated abuse.',
    falseInfoLabel: 'False or dangerous information',
    falseInfoDescription: 'Misleading claims that may confuse or harm other people.',
    impersonationLabel: 'Impersonation',
    impersonationDescription: 'Falsely represents another person, author, page, or organization.',
    selectReason: 'Please select a report reason.',
    explainFive: 'Please explain the problem in at least 5 characters.',
    detailsTooLong: 'Report details cannot exceed 1,000 characters.',
    alreadyReported: 'You already reported this content. Our team will review it.',
    submitFailed: 'Failed to submit report.',
    submitted: 'Report submitted. Thank you for helping keep Shadow safe.',
    invalidReport: 'Invalid report',
    invalidReportBody: 'The report type or reported content ID is invalid.',
    goBack: 'Go Back',
    reportReceived: 'Report received',
    anonymousNotice: 'The author or commenter will not be told who submitted this report.',
    done: 'Done',
    reportedType: 'Reported {{type}}',
    whyReporting: 'Why are you reporting this?',
    selectOne: 'Select one reason. Shadow will review the reported content.',
    tellUsMore: 'Tell us more',
    required: '(required)',
    optional: '(optional)',
    explainPlaceholder: 'Please explain what happened...',
    detailsPlaceholder: 'Add any details that may help us review this report...',
    confidential: 'Your report is confidential.',
    identityHidden: 'The reported person will not see your identity.',
    submitting: 'Submitting...',
    submitReport: 'Submit Report',
    ariaGoBack: 'Go back',
  },
  km: {
    reportStory: 'រាយការណ៍រឿងនេះ',
    story: 'រឿង',
    storySubtitle: 'ជ្រើសរើសមូលហេតុដែលពិពណ៌នាបញ្ហារបស់រឿងនេះបានត្រឹមត្រូវបំផុត។',
    reportComment: 'រាយការណ៍មតិយោបល់នេះ',
    comment: 'មតិយោបល់',
    commentSubtitle: 'ប្រាប់យើងថាមានបញ្ហាអ្វីជាមួយមតិយោបល់នេះ។',
    reportAuthorPage: 'រាយការណ៍ Author Page នេះ',
    authorPage: 'Author Page',
    authorPageSubtitle: 'ជ្រើសរើសមូលហេតុដែលពិពណ៌នាបញ្ហារបស់ Page នេះបានត្រឹមត្រូវបំផុត។',
    reportAuthorPost: 'រាយការណ៍ Author Post នេះ',
    authorPost: 'Author Post',
    reportReaderPost: 'រាយការណ៍ Reader Post នេះ',
    readerPost: 'Reader Post',
    postSubtitle: 'ជ្រើសរើសមូលហេតុដែលពិពណ៌នាបញ្ហារបស់ Post នេះបានត្រឹមត្រូវបំផុត។',
    reportPhoto: 'រាយការណ៍រូបភាពនេះ',
    photo: 'រូបភាព',
    photoSubtitle: 'ជ្រើសរើសមូលហេតុដែលពិពណ៌នាបញ្ហារបស់រូបភាពនេះបានត្រឹមត្រូវបំផុត។',
    sexualLabel: 'ខ្លឹមសារផ្លូវភេទ ឬមិនសមរម្យ',
    sexualDescription: 'ខ្លឹមសារផ្លូវភេទ ច្បាស់លាស់ ឬខ្លឹមសារមិនសមរម្យផ្សេងទៀត។',
    violenceLabel: 'អំពើហិង្សា ការគំរាមកំហែង ឬខ្លឹមសារបង្កគ្រោះថ្នាក់',
    violenceDescription: 'អំពើហិង្សាខ្លាំង ការគំរាមកំហែង ការធ្វើបាបខ្លួនឯង ឬខ្លឹមសារគ្រោះថ្នាក់។',
    hateLabel: 'ការស្អប់ខ្ពើម ឬរើសអើង',
    hateDescription: 'ការវាយប្រហារផ្អែកលើអត្តសញ្ញាណ សាសនា សញ្ជាតិ ភេទ ឬពូជសាសន៍។',
    copyrightLabel: 'រំលោភសិទ្ធិអ្នកនិពន្ធ ឬលួចខ្លឹមសារ',
    copyrightDescription: 'ចម្លង ឬប្រើខ្លឹមសារដែលមានការការពារដោយគ្មានការអនុញ្ញាត។',
    spamLabel: 'Spam, scam ឬខ្លឹមសារគួរឱ្យសង្ស័យ',
    spamDescription: 'ការបោកប្រាស់ ការផ្សព្វផ្សាយបំភាន់ តំណគួរឱ្យសង្ស័យ ឬខ្លឹមសារមិនសុវត្ថិភាព។',
    otherLabel: 'ព័ត៌មានឯកជន ឬបញ្ហាផ្សេងទៀត',
    otherDescription: 'ព័ត៌មានផ្ទាល់ខ្លួន ឬបញ្ហាផ្សេងដែលមិនមានក្នុងបញ្ជីខាងលើ។',
    harassmentLabel: 'ការរំខាន ឬធ្វើបាប',
    harassmentDescription: 'ការប្រមាថ ការបន្ទាបបន្ថោក ការគំរាមកំហែង ឬការធ្វើបាបជាបន្តបន្ទាប់។',
    falseInfoLabel: 'ព័ត៌មានមិនពិត ឬគ្រោះថ្នាក់',
    falseInfoDescription: 'ព័ត៌មានបំភាន់ដែលអាចធ្វើឱ្យអ្នកផ្សេងច្រឡំ ឬរងគ្រោះ។',
    impersonationLabel: 'ក្លែងបន្លំអត្តសញ្ញាណ',
    impersonationDescription: 'ក្លែងធ្វើជាបុគ្គល អ្នកនិពន្ធ Page ឬអង្គការផ្សេង។',
    selectReason: 'សូមជ្រើសរើសមូលហេតុសម្រាប់ការរាយការណ៍។',
    explainFive: 'សូមពន្យល់បញ្ហាយ៉ាងតិច 5 តួអក្សរ។',
    detailsTooLong: 'ព័ត៌មានរាយការណ៍មិនអាចលើស 1,000 តួអក្សរ។',
    alreadyReported: 'អ្នកបានរាយការណ៍ខ្លឹមសារនេះរួចហើយ។ ក្រុមការងាររបស់យើងនឹងពិនិត្យវា។',
    submitFailed: 'មិនអាចផ្ញើការរាយការណ៍បានទេ។',
    submitted: 'បានផ្ញើការរាយការណ៍។ អរគុណដែលជួយរក្សា Shadow ឱ្យមានសុវត្ថិភាព។',
    invalidReport: 'ការរាយការណ៍មិនត្រឹមត្រូវ',
    invalidReportBody: 'ប្រភេទការរាយការណ៍ ឬ ID ខ្លឹមសារដែលបានរាយការណ៍មិនត្រឹមត្រូវ។',
    goBack: 'ត្រឡប់ក្រោយ',
    reportReceived: 'បានទទួលការរាយការណ៍',
    anonymousNotice: 'អ្នកនិពន្ធ ឬអ្នកបញ្ចេញមតិ នឹងមិនដឹងថានរណាជាអ្នកផ្ញើការរាយការណ៍នេះទេ។',
    done: 'រួចរាល់',
    reportedType: '{{type}} ដែលបានរាយការណ៍',
    whyReporting: 'ហេតុអ្វីអ្នករាយការណ៍ខ្លឹមសារនេះ?',
    selectOne: 'ជ្រើសរើសមូលហេតុមួយ។ Shadow នឹងពិនិត្យខ្លឹមសារដែលបានរាយការណ៍។',
    tellUsMore: 'ប្រាប់យើងបន្ថែម',
    required: '(តម្រូវ)',
    optional: '(មិនតម្រូវ)',
    explainPlaceholder: 'សូមពន្យល់ថាមានអ្វីកើតឡើង...',
    detailsPlaceholder: 'បន្ថែមព័ត៌មានដែលអាចជួយយើងពិនិត្យការរាយការណ៍នេះ...',
    confidential: 'ការរាយការណ៍របស់អ្នកគឺសម្ងាត់។',
    identityHidden: 'បុគ្គលដែលត្រូវបានរាយការណ៍នឹងមិនឃើញអត្តសញ្ញាណរបស់អ្នកទេ។',
    submitting: 'កំពុងផ្ញើ...',
    submitReport: 'ផ្ញើការរាយការណ៍',
    ariaGoBack: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    reportStory: '举报此故事',
    story: '故事',
    storySubtitle: '请选择最能描述此故事问题的原因。',
    reportComment: '举报此评论',
    comment: '评论',
    commentSubtitle: '请告诉我们这条评论有什么问题。',
    reportAuthorPage: '举报此 Author Page',
    authorPage: 'Author Page',
    authorPageSubtitle: '请选择最能描述此页面问题的原因。',
    reportAuthorPost: '举报此 Author Post',
    authorPost: 'Author Post',
    reportReaderPost: '举报此 Reader Post',
    readerPost: 'Reader Post',
    postSubtitle: '请选择最能描述此帖问题的原因。',
    reportPhoto: '举报此照片',
    photo: '照片',
    photoSubtitle: '请选择最能描述此照片问题的原因。',
    sexualLabel: '色情或不当内容',
    sexualDescription: '色情、露骨或其他不当内容。',
    violenceLabel: '暴力、威胁或有害内容',
    violenceDescription: '血腥暴力、威胁、自残或危险内容。',
    hateLabel: '仇恨或歧视内容',
    hateDescription: '基于身份、宗教、国籍、性别或种族的攻击。',
    copyrightLabel: '版权侵权或盗用内容',
    copyrightDescription: '未经许可复制或使用受保护内容。',
    spamLabel: '垃圾信息、诈骗或可疑内容',
    spamDescription: '欺诈、误导推广、可疑链接或不安全内容。',
    otherLabel: '私人信息或其他问题',
    otherDescription: '个人信息或以上未列出的其他问题。',
    harassmentLabel: '骚扰或欺凌',
    harassmentDescription: '针对性的侮辱、羞辱、恐吓或反复骚扰。',
    falseInfoLabel: '虚假或危险信息',
    falseInfoDescription: '可能误导或伤害他人的错误信息。',
    impersonationLabel: '冒充他人',
    impersonationDescription: '虚假冒充其他个人、作者、页面或组织。',
    selectReason: '请选择举报原因。',
    explainFive: '请至少用 5 个字符说明问题。',
    detailsTooLong: '举报详情不能超过 1,000 个字符。',
    alreadyReported: '你已经举报过此内容。我们的团队会进行审核。',
    submitFailed: '提交举报失败。',
    submitted: '举报已提交。感谢你帮助维护 Shadow 的安全。',
    invalidReport: '无效举报',
    invalidReportBody: '举报类型或被举报内容 ID 无效。',
    goBack: '返回',
    reportReceived: '已收到举报',
    anonymousNotice: '作者或评论者不会知道是谁提交了此举报。',
    done: '完成',
    reportedType: '被举报的{{type}}',
    whyReporting: '你为什么举报此内容？',
    selectOne: '请选择一个原因。Shadow 将审核被举报的内容。',
    tellUsMore: '告诉我们更多信息',
    required: '（必填）',
    optional: '（选填）',
    explainPlaceholder: '请说明发生了什么...',
    detailsPlaceholder: '添加任何可能帮助我们审核此举报的信息...',
    confidential: '你的举报是保密的。',
    identityHidden: '被举报者不会看到你的身份。',
    submitting: '提交中...',
    submitReport: '提交举报',
    ariaGoBack: '返回',
  },
  ja: {
    reportStory: 'このストーリーを報告',
    story: 'ストーリー',
    storySubtitle: 'このストーリーの問題を最もよく表す理由を選んでください。',
    reportComment: 'このコメントを報告',
    comment: 'コメント',
    commentSubtitle: 'このコメントの問題点を教えてください。',
    reportAuthorPage: 'この Author Page を報告',
    authorPage: 'Author Page',
    authorPageSubtitle: 'このページの問題を最もよく表す理由を選んでください。',
    reportAuthorPost: 'この Author Post を報告',
    authorPost: 'Author Post',
    reportReaderPost: 'この Reader Post を報告',
    readerPost: 'Reader Post',
    postSubtitle: 'この投稿の問題を最もよく表す理由を選んでください。',
    reportPhoto: 'この写真を報告',
    photo: '写真',
    photoSubtitle: 'この写真の問題を最もよく表す理由を選んでください。',
    sexualLabel: '性的または不適切なコンテンツ',
    sexualDescription: '性的、露骨、またはその他の不適切なコンテンツ。',
    violenceLabel: '暴力、脅迫、または有害なコンテンツ',
    violenceDescription: '生々しい暴力、脅迫、自傷、または危険なコンテンツ。',
    hateLabel: 'ヘイトまたは差別的コンテンツ',
    hateDescription: 'アイデンティティ、宗教、国籍、性別、人種に基づく攻撃。',
    copyrightLabel: '著作権侵害または盗用コンテンツ',
    copyrightDescription: '許可なくコピーまたは使用された保護対象コンテンツ。',
    spamLabel: 'スパム、詐欺、または不審なコンテンツ',
    spamDescription: '詐欺、誤解を招く宣伝、不審なリンク、または危険なコンテンツ。',
    otherLabel: '個人情報またはその他の問題',
    otherDescription: '個人情報または上記にないその他の問題。',
    harassmentLabel: '嫌がらせまたはいじめ',
    harassmentDescription: '標的を定めた侮辱、屈辱、威圧、または繰り返される嫌がらせ。',
    falseInfoLabel: '虚偽または危険な情報',
    falseInfoDescription: '他の人を混乱させたり害したりする可能性のある誤解を招く主張。',
    impersonationLabel: 'なりすまし',
    impersonationDescription: '他の人物、作者、ページ、組織を偽って表現しています。',
    selectReason: '報告理由を選択してください。',
    explainFive: '問題を5文字以上で説明してください。',
    detailsTooLong: '報告の詳細は1,000文字以内にしてください。',
    alreadyReported: 'このコンテンツはすでに報告済みです。チームが確認します。',
    submitFailed: '報告を送信できませんでした。',
    submitted: '報告を送信しました。Shadow の安全維持にご協力いただきありがとうございます。',
    invalidReport: '無効な報告',
    invalidReportBody: '報告タイプまたは報告対象コンテンツ ID が無効です。',
    goBack: '戻る',
    reportReceived: '報告を受け付けました',
    anonymousNotice: '作者またはコメント投稿者には、誰が報告したかは通知されません。',
    done: '完了',
    reportedType: '報告対象の{{type}}',
    whyReporting: 'なぜこのコンテンツを報告しますか？',
    selectOne: '理由を1つ選んでください。Shadow が報告されたコンテンツを確認します。',
    tellUsMore: '詳しく教えてください',
    required: '（必須）',
    optional: '（任意）',
    explainPlaceholder: '何が起きたか説明してください...',
    detailsPlaceholder: 'この報告の確認に役立つ詳細を追加してください...',
    confidential: 'あなたの報告は機密扱いです。',
    identityHidden: '報告された相手にあなたの身元は表示されません。',
    submitting: '送信中...',
    submitReport: '報告を送信',
    ariaGoBack: '戻る',
  },
  ko: {
    reportStory: '이 스토리 신고',
    story: '스토리',
    storySubtitle: '이 스토리의 문제를 가장 잘 설명하는 이유를 선택하세요.',
    reportComment: '이 댓글 신고',
    comment: '댓글',
    commentSubtitle: '이 댓글의 문제점을 알려주세요.',
    reportAuthorPage: '이 Author Page 신고',
    authorPage: 'Author Page',
    authorPageSubtitle: '이 페이지의 문제를 가장 잘 설명하는 이유를 선택하세요.',
    reportAuthorPost: '이 Author Post 신고',
    authorPost: 'Author Post',
    reportReaderPost: '이 Reader Post 신고',
    readerPost: 'Reader Post',
    postSubtitle: '이 게시물의 문제를 가장 잘 설명하는 이유를 선택하세요.',
    reportPhoto: '이 사진 신고',
    photo: '사진',
    photoSubtitle: '이 사진의 문제를 가장 잘 설명하는 이유를 선택하세요.',
    sexualLabel: '성적이거나 부적절한 콘텐츠',
    sexualDescription: '성적, 노골적 또는 기타 부적절한 콘텐츠입니다.',
    violenceLabel: '폭력, 위협 또는 유해한 콘텐츠',
    violenceDescription: '노골적인 폭력, 위협, 자해 또는 위험한 콘텐츠입니다.',
    hateLabel: '혐오 또는 차별 콘텐츠',
    hateDescription: '정체성, 종교, 국적, 성별 또는 인종을 기반으로 한 공격입니다.',
    copyrightLabel: '저작권 침해 또는 도용 콘텐츠',
    copyrightDescription: '허가 없이 복사하거나 사용한 보호 콘텐츠입니다.',
    spamLabel: '스팸, 사기 또는 의심스러운 콘텐츠',
    spamDescription: '사기, 오해를 유도하는 홍보, 의심스러운 링크 또는 안전하지 않은 콘텐츠입니다.',
    otherLabel: '개인정보 또는 기타 문제',
    otherDescription: '개인정보 또는 위에 나열되지 않은 다른 문제입니다.',
    harassmentLabel: '괴롭힘 또는 따돌림',
    harassmentDescription: '표적 모욕, 굴욕, 위협 또는 반복적인 괴롭힘입니다.',
    falseInfoLabel: '허위 또는 위험한 정보',
    falseInfoDescription: '다른 사람을 혼란시키거나 해칠 수 있는 오해의 소지가 있는 주장입니다.',
    impersonationLabel: '사칭',
    impersonationDescription: '다른 사람, 작가, 페이지 또는 조직을 허위로 사칭합니다.',
    selectReason: '신고 사유를 선택하세요.',
    explainFive: '문제를 5자 이상으로 설명하세요.',
    detailsTooLong: '신고 상세 내용은 1,000자를 초과할 수 없습니다.',
    alreadyReported: '이미 이 콘텐츠를 신고했습니다. 담당 팀이 검토합니다.',
    submitFailed: '신고를 제출하지 못했습니다.',
    submitted: '신고가 제출되었습니다. Shadow를 안전하게 유지하는 데 도움을 주셔서 감사합니다.',
    invalidReport: '잘못된 신고',
    invalidReportBody: '신고 유형 또는 신고된 콘텐츠 ID가 올바르지 않습니다.',
    goBack: '뒤로 가기',
    reportReceived: '신고가 접수되었습니다',
    anonymousNotice: '작가나 댓글 작성자에게 신고자 정보는 알려지지 않습니다.',
    done: '완료',
    reportedType: '신고된 {{type}}',
    whyReporting: '이 콘텐츠를 신고하는 이유는 무엇인가요?',
    selectOne: '사유 하나를 선택하세요. Shadow가 신고된 콘텐츠를 검토합니다.',
    tellUsMore: '자세히 알려주세요',
    required: '(필수)',
    optional: '(선택)',
    explainPlaceholder: '무슨 일이 있었는지 설명하세요...',
    detailsPlaceholder: '신고 검토에 도움이 될 추가 정보를 입력하세요...',
    confidential: '신고 내용은 비공개로 처리됩니다.',
    identityHidden: '신고된 사람은 신고자의 신원을 볼 수 없습니다.',
    submitting: '제출 중...',
    submitReport: '신고 제출',
    ariaGoBack: '뒤로 가기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REPORT_CONFIG = {
  story: {
    title: 'Report this story',
    typeLabel: 'Story',
    subtitle: 'Choose the reason that best describes the problem with this story.',
    options: [
      {
        value: 'sexual_or_inappropriate',
        label: 'Sexual or inappropriate content',
        description: 'Explicit sexual content or mature content without a warning.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'violence_or_threat',
        label: 'Graphic violence or threats',
        description: 'Extreme violence, threats, self-harm, or dangerous content.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        value: 'hate_speech',
        label: 'Hate or abusive content',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'copyright_or_stolen_content',
        label: 'Copyright or stolen story',
        description: 'Copied story, translation, cover, or other protected work.',
        icon: 'fa-regular fa-copyright',
      },
      {
        value: 'spam_or_scam',
        label: 'Spam or scam',
        description: 'Misleading promotion, suspicious links, or fraudulent content.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'other',
        label: 'Something else',
        description: 'A different problem that is not listed above.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },

  comment: {
    title: 'Report this comment',
    typeLabel: 'Comment',
    subtitle: 'Tell us what is wrong with this comment.',
    options: [
      {
        value: 'harassment_or_bullying',
        label: 'Harassment or bullying',
        description: 'Targeted insults, humiliation, intimidation, or repeated abuse.',
        icon: 'fa-solid fa-user-shield',
      },
      {
        value: 'hate_speech',
        label: 'Hate speech or discrimination',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'violence_or_threat',
        label: 'Threats or encouraging harm',
        description: 'Threats, encouragement of violence, self-harm, or suicide.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        value: 'sexual_or_inappropriate',
        label: 'Sexual or inappropriate comment',
        description: 'Sexual harassment, explicit language, or inappropriate content.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'spam_or_scam',
        label: 'Spam, scam, or suspicious link',
        description: 'Repeated promotion, fraud, or a potentially unsafe link.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'false_information',
        label: 'False or dangerous information',
        description: 'Misleading claims that may confuse or harm other readers.',
        icon: 'fa-solid fa-circle-exclamation',
      },
      {
        value: 'other',
        label: 'Private information or something else',
        description: 'Personal information or another issue. Please explain below.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },

  author_page: {
    title: 'Report this Author Page',
    typeLabel: 'Author Page',
    subtitle: 'Choose the reason that best describes the problem with this page.',
    options: [
      {
        value: 'impersonation',
        label: 'Pretending to be someone else',
        description: 'Fake author identity, fake official page, or impersonation.',
        icon: 'fa-solid fa-user-secret',
      },
      {
        value: 'spam_or_scam',
        label: 'Scam or fraudulent page',
        description: 'Fraud, suspicious offers, unsafe links, or misleading promotions.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'sexual_or_inappropriate',
        label: 'Inappropriate profile or biography',
        description: 'Sexual, explicit, or otherwise inappropriate profile content.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'harassment_or_bullying',
        label: 'Harassment or bullying',
        description: 'This page targets, intimidates, or repeatedly attacks someone.',
        icon: 'fa-solid fa-user-shield',
      },
      {
        value: 'hate_speech',
        label: 'Hate speech or discrimination',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'copyright_or_stolen_content',
        label: 'Stolen name, logo, or profile image',
        description: 'Uses another person’s identity or protected work without permission.',
        icon: 'fa-regular fa-copyright',
      },
      {
        value: 'false_information',
        label: 'Misleading or false page',
        description: 'The page name, identity, description, or claims are misleading.',
        icon: 'fa-solid fa-circle-exclamation',
      },
      {
        value: 'other',
        label: 'Something else',
        description: 'A different problem that is not listed above.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },

  author_post: {
    title: 'Report this Author Post',
    typeLabel: 'Author Post',
    subtitle: 'Choose the reason that best describes the problem with this post.',
    options: [
      {
        value: 'spam_or_scam',
        label: 'Spam, scam, or suspicious link',
        description: 'Repeated promotion, fraud, or a potentially unsafe link.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'harassment_or_bullying',
        label: 'Harassment or bullying',
        description: 'Targeted insults, humiliation, intimidation, or repeated abuse.',
        icon: 'fa-solid fa-user-shield',
      },
      {
        value: 'hate_speech',
        label: 'Hate speech or discrimination',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'sexual_or_inappropriate',
        label: 'Sexual or inappropriate content',
        description: 'Explicit text, images, sexual harassment, or inappropriate content.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'violence_or_threat',
        label: 'Violence, threats, or self-harm',
        description: 'Graphic violence, threats, dangerous acts, or encouragement of harm.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        value: 'false_information',
        label: 'False or dangerous information',
        description: 'Misleading information that may confuse or harm other readers.',
        icon: 'fa-solid fa-circle-exclamation',
      },
      {
        value: 'copyright_or_stolen_content',
        label: 'Copyright or stolen content',
        description: 'Copied text, images, artwork, or other protected content.',
        icon: 'fa-regular fa-copyright',
      },
      {
        value: 'impersonation',
        label: 'Impersonation',
        description: 'The post falsely represents another person, author, or organization.',
        icon: 'fa-solid fa-user-secret',
      },
      {
        value: 'other',
        label: 'Private information or something else',
        description: 'Personal information or another issue. Please explain below.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },
}

REPORT_CONFIG.reader_post = {
  ...REPORT_CONFIG.author_post,
  title: 'Report this Reader Post',
  typeLabel: 'Reader Post',
}

const PHOTO_REPORT_CONFIG = {
  title: 'Report this photo',
  typeLabel: 'Photo',
  subtitle: 'Choose the reason that best describes the problem with this photo.',
  options: [
    {
      value: 'sexual_or_inappropriate',
      label: 'Sexual or inappropriate photo',
      description: 'Nudity, explicit sexual content, or other inappropriate imagery.',
      icon: 'fa-solid fa-venus-mars',
    },
    {
      value: 'violence_or_threat',
      label: 'Graphic violence or harmful content',
      description: 'Graphic violence, self-harm, threats, or dangerous imagery.',
      icon: 'fa-solid fa-triangle-exclamation',
    },
    {
      value: 'harassment_or_bullying',
      label: 'Harassment or bullying',
      description: 'This photo is being used to humiliate, threaten, or target someone.',
      icon: 'fa-solid fa-user-shield',
    },
    {
      value: 'hate_speech',
      label: 'Hate or discriminatory content',
      description: 'Hateful imagery targeting identity, religion, nationality, gender, or race.',
      icon: 'fa-solid fa-ban',
    },
    {
      value: 'copyright_or_stolen_content',
      label: 'Copyright or stolen image',
      description: 'Artwork, photography, or another protected image used without permission.',
      icon: 'fa-regular fa-copyright',
    },
    {
      value: 'spam_or_scam',
      label: 'Spam, scam, or misleading image',
      description: 'Suspicious promotion, fraud, misleading advertising, or scam content.',
      icon: 'fa-solid fa-link',
    },
    {
      value: 'other',
      label: 'Private information or something else',
      description: 'Personal information or another problem with this photo.',
      icon: 'fa-solid fa-ellipsis',
    },
  ],
}

const CONFIG_TRANSLATION_KEYS = {
  story: {
    title: 'reportStory',
    type: 'story',
    subtitle: 'storySubtitle',
  },
  comment: {
    title: 'reportComment',
    type: 'comment',
    subtitle: 'commentSubtitle',
  },
  author_page: {
    title: 'reportAuthorPage',
    type: 'authorPage',
    subtitle: 'authorPageSubtitle',
  },
  author_post: {
    title: 'reportAuthorPost',
    type: 'authorPost',
    subtitle: 'postSubtitle',
  },
  reader_post: {
    title: 'reportReaderPost',
    type: 'readerPost',
    subtitle: 'postSubtitle',
  },
  photo: {
    title: 'reportPhoto',
    type: 'photo',
    subtitle: 'photoSubtitle',
  },
}

const REASON_TRANSLATION_KEYS = {
  sexual_or_inappropriate: ['sexualLabel', 'sexualDescription'],
  violence_or_threat: ['violenceLabel', 'violenceDescription'],
  hate_speech: ['hateLabel', 'hateDescription'],
  copyright_or_stolen_content: ['copyrightLabel', 'copyrightDescription'],
  spam_or_scam: ['spamLabel', 'spamDescription'],
  other: ['otherLabel', 'otherDescription'],
  harassment_or_bullying: ['harassmentLabel', 'harassmentDescription'],
  false_information: ['falseInfoLabel', 'falseInfoDescription'],
  impersonation: ['impersonationLabel', 'impersonationDescription'],
}

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '').trim()
  )
}

function getDisplayConfig(config, reportType, isPhotoReport, t) {
  const key = isPhotoReport ? 'photo' : reportType
  const translationKeys = CONFIG_TRANSLATION_KEYS[key]

  if (!translationKeys) {
    return config
  }

  return {
    ...config,
    title: t(`reportPage.${translationKeys.title}`),
    typeLabel: t(`reportPage.${translationKeys.type}`),
    subtitle: t(`reportPage.${translationKeys.subtitle}`),
  }
}

function getDisplayReason(option, t) {
  const keys = REASON_TRANSLATION_KEYS[option.value]

  if (!keys) {
    return option
  }

  return {
    ...option,
    label: t(`reportPage.${keys[0]}`),
    description: t(`reportPage.${keys[1]}`),
  }
}

export default function ReportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reportType = '', targetId = '' } = useParams()
  const { t } = useDisplayTranslation()

  const isPhotoReport =
    ['author_post', 'reader_post'].includes(reportType) &&
    location.state?.reportContext === 'photo'

  const config = isPhotoReport
    ? PHOTO_REPORT_CONFIG
    : REPORT_CONFIG[reportType] || null
  const displayConfig = config
    ? getDisplayConfig(config, reportType, isPhotoReport, t)
    : null
  const targetTitle = String(location.state?.targetTitle || '').trim()
  const sourceUrl = String(
    location.state?.sourceUrl ||
      document.referrer ||
      `${window.location.origin}/`
  ).trim()
  const returnTo = String(location.state?.returnTo || '').trim()

  const [reasonCode, setReasonCode] = useState(
    String(location.state?.draftReasonCode || '')
  )
  const [reasonText, setReasonText] = useState(
    String(location.state?.draftReasonText || '')
  )
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    navigate(-1)
  }

  const handleLogin = () => {
    navigate('/login', {
      state: {
        returnTo: `${location.pathname}${location.search}`,
        returnState: {
          ...location.state,
          draftReasonCode: reasonCode,
          draftReasonText: reasonText,
        },
      },
    })
  }

  const handleSubmit = async () => {
    if (!config || !isUuid(targetId) || submitting || success) return

    const token = getReaderToken()

    if (!token) {
      handleLogin()
      return
    }

    if (!reasonCode) {
      setMessage(t('reportPage.selectReason'))
      return
    }

    if (reasonCode === 'other' && reasonText.trim().length < 5) {
      setMessage(t('reportPage.explainFive'))
      return
    }

    if (reasonText.trim().length > 1000) {
      setMessage(t('reportPage.detailsTooLong'))
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_type: reportType,
          target_id: targetId,
          target_url: sourceUrl,
          reason_code: reasonCode,
          reason_text: reasonText.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (
        response.status === 409 &&
        data.code === 'REPORT_ALREADY_OPEN'
      ) {
        setSuccess(true)
        setMessage(
          data.message ||
            t('reportPage.alreadyReported')
        )
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('reportPage.submitFailed'))
      }

      setSuccess(true)
      setMessage(
        data.message ||
          t('reportPage.submitted')
      )
    } catch (error) {
      setMessage(error.message || t('reportPage.submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!config || !isUuid(targetId)) {
    return (
      <main className="app-page min-h-screen px-4 py-8">
        <section className="mx-auto max-w-[620px] rounded-[26px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] dark:ring-white/10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#d9363e] dark:bg-red-500/10 dark:text-red-300">
            <i className="fa-solid fa-triangle-exclamation text-[20px]" />
          </div>
          <h1 className="mt-4 text-[20px] font-bold text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {t('reportPage.invalidReport')}
          </h1>
          <p className="mt-2 text-[13px] font-medium leading-6 text-[#667085] dark:text-[var(--shadow-text-secondary)]">
            {t('reportPage.invalidReportBody')}
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-5 h-11 rounded-full bg-[#111827] px-6 text-[13px] font-bold text-white dark:bg-[#7c3aed]"
          >
            {t('reportPage.goBack')}
          </button>
        </section>
      </main>
    )
  }

  if (success) {
    return (
      <main className="app-page min-h-screen px-4 py-8">
        <section className="mx-auto max-w-[620px] rounded-[28px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] dark:ring-white/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eafaf1] text-[#0f9f62] dark:bg-emerald-500/10 dark:text-emerald-300">
            <i className="fa-solid fa-check text-[24px]" />
          </div>

          <h1 className="mt-5 text-[22px] font-bold text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {t('reportPage.reportReceived')}
          </h1>

          <p className="mx-auto mt-2 max-w-[430px] text-[13px] font-medium leading-6 text-[#667085] dark:text-[var(--shadow-text-secondary)]">
            {message}
          </p>

          <div className="mt-5 rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[12px] font-semibold leading-5 text-[#667085] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
            {t('reportPage.anonymousNotice')}
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="mt-6 h-12 w-full rounded-full bg-[#111827] text-[14px] font-bold text-white active:scale-[0.99] dark:bg-[#7c3aed]"
          >
            {t('reportPage.done')}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-page min-h-screen pb-6 text-[#171a21] dark:text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[#e8e7e3] bg-white/95 backdrop-blur dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="relative mx-auto flex h-[58px] max-w-[680px] items-center justify-center px-14">
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-[#242830] transition active:bg-[#f1f1ef] dark:text-[var(--shadow-text-primary)] dark:active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('reportPage.ariaGoBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[17px] font-bold text-[#171a21] dark:text-[var(--shadow-text-primary)]">
            {displayConfig.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[680px] px-4 pt-5">
        <section className="rounded-[18px] border border-[#e4e3df] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(24,28,36,0.045)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#fff1f5] text-[#ff3b5f] dark:bg-[#ff3b5f]/10">
              <i className="fa-regular fa-flag text-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.65px] text-[#8a8f98] dark:text-[var(--shadow-text-tertiary)]">
                {displayConfig.typeLabel}
              </div>

              <h2 className="mt-1 line-clamp-2 text-[15px] font-bold leading-6 text-[#171a21] dark:text-[var(--shadow-text-primary)]">
                {targetTitle ||
                  t('reportPage.reportedType', {
                    type: displayConfig.typeLabel,
                  })}
              </h2>

              <p className="mt-1 text-[12px] font-medium leading-5 text-[#767c86] dark:text-[var(--shadow-text-secondary)]">
                {displayConfig.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1f5] text-[11px] font-bold text-[#ff3b5f] dark:bg-[#ff3b5f]/10">
              1
            </span>

            <div className="min-w-0">
              <h3 className="text-[15.5px] font-bold leading-6 text-[#171a21] dark:text-[var(--shadow-text-primary)]">
                {t('reportPage.whyReporting')}
              </h3>

              <p className="mt-0.5 text-[11.5px] font-medium leading-5 text-[#858a93] dark:text-[var(--shadow-text-secondary)]">
                {t('reportPage.selectOne')}
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e1e2e4] bg-white shadow-[0_8px_24px_rgba(24,28,36,0.035)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:shadow-none">
            {config.options.map((option, index) => {
              const selected = option.value === reasonCode
              const isLast = index === config.options.length - 1
              const displayOption = getDisplayReason(option, t)

              return (
                <div
                  key={option.value}
                  className={`px-2 py-1 ${
                    isLast ? '' : 'border-b border-[#ececea] dark:border-[var(--shadow-border)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setReasonCode(option.value)
                      setMessage('')
                    }}
                    className={`group flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition ${
                      selected
                        ? 'bg-[#fff1f5] ring-1 ring-inset ring-[#ff3b5f]/35 dark:bg-[#ff3b5f]/10'
                        : 'bg-white hover:bg-[#fff8fa] dark:bg-[var(--shadow-bg-surface)] dark:hover:bg-[var(--shadow-bg-hover)]'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                        selected
                          ? 'bg-white text-[#ff3b5f] shadow-sm dark:bg-[var(--shadow-bg-elevated)]'
                          : 'bg-[#f3f4f6] text-[#98a2b3] group-hover:bg-[#fff1f5] group-hover:text-[#ff3b5f] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-tertiary)] dark:group-hover:bg-[#ff3b5f]/10 dark:group-hover:text-[#ff6b87]'
                      }`}
                    >
                      <i className={`${option.icon} text-[14px]`} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold leading-5 text-[#171a21] dark:text-[var(--shadow-text-primary)]">
                        {displayOption.label}
                      </span>

                      <span className="mt-0.5 block text-[11.5px] font-medium leading-[18px] text-[#7d838d] dark:text-[var(--shadow-text-secondary)]">
                        {displayOption.description}
                      </span>
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                        selected
                          ? 'border-[#ff3b5f] bg-white dark:bg-[var(--shadow-bg-elevated)]'
                          : 'border-[#cfd4dc] bg-white group-hover:border-[#ff9bb0] dark:border-[var(--shadow-border-strong)] dark:bg-[var(--shadow-bg-elevated)]'
                      }`}
                      aria-hidden="true"
                    >
                      {selected ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#c95f5b]" />
                      ) : null}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f1ef] text-[11px] font-bold text-[#5f646d] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
              2
            </span>

            <label
              htmlFor="shadow-report-details"
              className="text-[14.5px] font-bold text-[#171a21] dark:text-[var(--shadow-text-primary)]"
            >
              {t('reportPage.tellUsMore')}
              <span className="ml-1 text-[12px] font-semibold text-[#92969d] dark:text-[var(--shadow-text-tertiary)]">
                {reasonCode === 'other'
                  ? t('reportPage.required')
                  : t('reportPage.optional')}
              </span>
            </label>
          </div>

          <div className="mt-3 rounded-[18px] border border-[#e1e2e4] bg-white p-3 shadow-[0_8px_24px_rgba(24,28,36,0.03)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:shadow-none">
            <textarea
              id="shadow-report-details"
              value={reasonText}
              maxLength={1000}
              onChange={(event) => {
                setReasonText(event.target.value)
                setMessage('')
              }}
              placeholder={
                reasonCode === 'other'
                  ? t('reportPage.explainPlaceholder')
                  : t('reportPage.detailsPlaceholder')
              }
              className="min-h-[112px] w-full resize-none rounded-[13px] border border-[#dfe1e4] bg-[#fbfbfa] px-3.5 py-3 text-[13px] font-medium leading-6 text-[#171a21] outline-none transition placeholder:text-[#a0a4ab] focus:border-[#ff3b5f] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,59,95,0.10)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:border-[#ff5c79] dark:focus:bg-[var(--shadow-input-bg)]"
            />

            <div className="mt-1 text-right text-[10.5px] font-semibold text-[#9b9fa6] dark:text-[var(--shadow-text-tertiary)]">
              {reasonText.length}/1000
            </div>
          </div>
        </section>

        {message ? (
          <div className="mt-4 rounded-[14px] border border-[#f1c5c2] bg-[#fff1f0] px-4 py-3 text-[12px] font-bold leading-5 text-[#b84f4b] dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        <div className="mt-4 flex items-start gap-3 rounded-[15px] border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#fff3d6] text-[#b7791f] dark:bg-amber-500/10 dark:text-amber-300">
            <i className="fa-solid fa-lock text-[12px]" />
          </span>

          <div className="min-w-0">
            <div className="text-[11.5px] font-bold leading-5 text-[#374151] dark:text-[var(--shadow-text-primary)]">
              {t('reportPage.confidential')}
            </div>

            <div className="text-[11px] font-medium leading-5 text-[#6b7280] dark:text-[var(--shadow-text-secondary)]">
              {t('reportPage.identityHidden')}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 -mx-4 mt-4 border-t border-[#eceae6] bg-[#faf9f7]/95 px-4 pb-3 pt-3 backdrop-blur dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-page)]/95">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !reasonCode}
            className="h-12 w-full rounded-[14px] bg-[#ff3b5f] text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(255,59,95,0.22)] transition hover:bg-[#e93254] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#c9c9c6] disabled:text-white disabled:shadow-none dark:disabled:bg-[var(--shadow-bg-elevated)] dark:disabled:text-[var(--shadow-text-disabled)]"
          >
            {submitting
              ? t('reportPage.submitting')
              : t('reportPage.submitReport')}
          </button>
        </div>
      </div>
    </main>
  )
}
