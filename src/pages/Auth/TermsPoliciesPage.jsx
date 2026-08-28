import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('termsPoliciesPage', {
  en: {
    goBack: 'Go back',
    title: 'Terms and Policies',
    effectiveDate: 'Effective Date:',
    welcome: 'Welcome to Shadowera',
    intro: 'By accessing or using our platform, you ("User", "Author", or "Reader") agree to follow these Terms of Service. Please read them carefully.',
    section1Title: '1. User Accounts',
    section1Item1: 'You must register and create an account to publish or engage with content.',
    section1Item2: 'You are responsible for keeping your account information secure.',
    section1Item3: 'If you believe your account has been compromised, please contact us immediately.',
    section2Title: '2. User Conduct',
    section2Item1: 'You agree to behave respectfully and responsibly. You must not:',
    section2Item2: 'Post or create obscene, offensive, or violent content.',
    section2Item3: 'Use rude, defamatory, or insulting language toward other users.',
    section2Item4: 'Engage in harassment, threats, or hateful behavior.',
    section2Item5: 'Violate any applicable laws.',
    section3Title: '3. Content Ownership',
    section3Item1: 'You must only upload or publish original content that you created.',
    section3Item2: "Plagiarism, copying someone else's work without permission, is strictly prohibited.",
    section3Item3: 'If plagiarism or copyright violation is found, we reserve the right to remove the content and suspend or permanently ban your account.',
    section4Title: '4. Fraud and Misuse',
    section4Item1: 'Fraudulent activity, including but not limited to impersonating others, providing false information, or manipulating data, is forbidden.',
    section4Item2: 'Any violation will result in immediate termination of your account.',
    section5Title: '5. Intellectual Property',
    section5Item1: 'We reserve the right to remove or edit content that violates our policies without prior notice.',
    section5Item2: 'Decisions made by our moderation team are final.',
    section6Title: '6. Content Moderation',
    section6Item1: 'We reserve the right to remove or edit content that violates our policies without prior notice.',
    section6Item2: 'Decisions made by our moderation team are final.',
    section7Title: '7. Account Termination',
    section7Item1: 'We may suspend or terminate your account if you violate these Terms, without prior notice.',
    section8Title: '8. Disclaimer',
    section8Item1: 'We are not responsible for any damages, losses, or misunderstandings caused by user content.',
    section8Item2: 'Use our platform at your own risk.',
    section9Title: '9. Changes to the Terms',
    section9Item1: 'We may update these Terms from time to time.',
    section9Item2: 'Continued use of the platform after changes means you accept the updated Terms.',
    section10Title: '10. Contact Us',
    contactIntro: 'If you have any questions or concerns about these Terms, please contact us at:',
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'លក្ខខណ្ឌ និងគោលការណ៍',
    effectiveDate: 'កាលបរិច្ឆេទចូលជាធរមាន៖',
    welcome: 'ស្វាគមន៍មកកាន់ Shadowera',
    intro: 'តាមរយៈការចូលប្រើ ឬប្រើប្រាស់ Platform របស់យើង អ្នក ("អ្នកប្រើ", "អ្នកនិពន្ធ" ឬ "អ្នកអាន") យល់ព្រមគោរពតាមលក្ខខណ្ឌសេវាកម្មទាំងនេះ។ សូមអានដោយយកចិត្តទុកដាក់។',
    section1Title: '1. គណនីអ្នកប្រើ',
    section1Item1: 'អ្នកត្រូវចុះឈ្មោះ និងបង្កើតគណនី ដើម្បីបង្ហោះ ឬចូលរួមជាមួយមាតិកា។',
    section1Item2: 'អ្នកមានទំនួលខុសត្រូវក្នុងការរក្សាព័ត៌មានគណនីរបស់អ្នកឱ្យមានសុវត្ថិភាព។',
    section1Item3: 'ប្រសិនបើអ្នកជឿថាគណនីរបស់អ្នកត្រូវបានលួចចូល សូមទាក់ទងមកយើងភ្លាមៗ។',
    section2Title: '2. អាកប្បកិរិយាអ្នកប្រើ',
    section2Item1: 'អ្នកយល់ព្រមប្រព្រឹត្តដោយគោរព និងមានទំនួលខុសត្រូវ។ អ្នកមិនត្រូវ៖',
    section2Item2: 'បង្ហោះ ឬបង្កើតមាតិកាអាសអាភាស ប្រមាថ ឬហិង្សា។',
    section2Item3: 'ប្រើភាសាឈ្លើយ បរិហារកេរ្តិ៍ ឬប្រមាថទៅកាន់អ្នកប្រើផ្សេងទៀត។',
    section2Item4: 'ធ្វើការរំខាន គំរាមកំហែង ឬបង្ហាញអាកប្បកិរិយាស្អប់ខ្ពើម។',
    section2Item5: 'បំពានច្បាប់ណាមួយដែលអនុវត្ត។',
    section3Title: '3. កម្មសិទ្ធិមាតិកា',
    section3Item1: 'អ្នកត្រូវ Upload ឬបង្ហោះតែមាតិកាដើមដែលអ្នកបានបង្កើតដោយខ្លួនឯងប៉ុណ្ណោះ។',
    section3Item2: 'ការលួចចម្លង ឬចម្លងស្នាដៃរបស់អ្នកដទៃដោយគ្មានការអនុញ្ញាត ត្រូវបានហាមឃាត់យ៉ាងតឹងរ៉ឹង។',
    section3Item3: 'ប្រសិនបើរកឃើញការលួចចម្លង ឬការបំពានសិទ្ធិអ្នកនិពន្ធ យើងរក្សាសិទ្ធិក្នុងការលុបមាតិកា និងផ្អាក ឬបិទគណនីរបស់អ្នកជាអចិន្ត្រៃយ៍។',
    section4Title: '4. ការក្លែងបន្លំ និងការប្រើប្រាស់ខុស',
    section4Item1: 'សកម្មភាពក្លែងបន្លំ រួមទាំងការក្លែងខ្លួនជាអ្នកដទៃ ការផ្តល់ព័ត៌មានមិនពិត ឬការកែច្នៃទិន្នន័យ ត្រូវបានហាមឃាត់។',
    section4Item2: 'ការបំពានណាមួយនឹងនាំឱ្យគណនីរបស់អ្នកត្រូវបានបិទភ្លាមៗ។',
    section5Title: '5. កម្មសិទ្ធិបញ្ញា',
    section5Item1: 'យើងរក្សាសិទ្ធិក្នុងការលុប ឬកែសម្រួលមាតិកាដែលបំពានគោលការណ៍របស់យើង ដោយមិនចាំបាច់ជូនដំណឹងជាមុន។',
    section5Item2: 'ការសម្រេចចិត្តរបស់ក្រុមត្រួតពិនិត្យរបស់យើងគឺជាការសម្រេចចុងក្រោយ។',
    section6Title: '6. ការត្រួតពិនិត្យមាតិកា',
    section6Item1: 'យើងរក្សាសិទ្ធិក្នុងការលុប ឬកែសម្រួលមាតិកាដែលបំពានគោលការណ៍របស់យើង ដោយមិនចាំបាច់ជូនដំណឹងជាមុន។',
    section6Item2: 'ការសម្រេចចិត្តរបស់ក្រុមត្រួតពិនិត្យរបស់យើងគឺជាការសម្រេចចុងក្រោយ។',
    section7Title: '7. ការបិទគណនី',
    section7Item1: 'យើងអាចផ្អាក ឬបិទគណនីរបស់អ្នក ប្រសិនបើអ្នកបំពានលក្ខខណ្ឌទាំងនេះ ដោយមិនចាំបាច់ជូនដំណឹងជាមុន។',
    section8Title: '8. ការបដិសេធការទទួលខុសត្រូវ',
    section8Item1: 'យើងមិនទទួលខុសត្រូវចំពោះការខូចខាត ការបាត់បង់ ឬការយល់ច្រឡំណាមួយដែលបណ្តាលមកពីមាតិការបស់អ្នកប្រើទេ។',
    section8Item2: 'ប្រើប្រាស់ Platform របស់យើងដោយទទួលខុសត្រូវលើហានិភ័យដោយខ្លួនឯង។',
    section9Title: '9. ការផ្លាស់ប្តូរលក្ខខណ្ឌ',
    section9Item1: 'យើងអាចធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះពីពេលមួយទៅពេលមួយ។',
    section9Item2: 'ការបន្តប្រើប្រាស់ Platform បន្ទាប់ពីមានការផ្លាស់ប្តូរ មានន័យថាអ្នកទទួលយកលក្ខខណ្ឌដែលបានធ្វើបច្ចុប្បន្នភាព។',
    section10Title: '10. ទាក់ទងមកយើង',
    contactIntro: 'ប្រសិនបើអ្នកមានសំណួរ ឬកង្វល់អំពីលក្ខខណ្ឌទាំងនេះ សូមទាក់ទងមកយើងតាម៖',
  },
  zh: {
    goBack: '返回',
    title: '条款与政策',
    effectiveDate: '生效日期：',
    welcome: '欢迎来到 Shadowera',
    intro: '访问或使用我们的平台，即表示你（“用户”、“作者”或“读者”）同意遵守这些服务条款。请仔细阅读。',
    section1Title: '1. 用户账号',
    section1Item1: '你必须注册并创建账号，才能发布内容或与内容互动。',
    section1Item2: '你有责任确保账号信息安全。',
    section1Item3: '如果你认为账号已被盗用，请立即联系我们。',
    section2Title: '2. 用户行为',
    section2Item1: '你同意以尊重且负责任的方式使用平台。你不得：',
    section2Item2: '发布或创作淫秽、冒犯性或暴力内容。',
    section2Item3: '对其他用户使用粗鲁、诽谤或侮辱性语言。',
    section2Item4: '进行骚扰、威胁或仇恨行为。',
    section2Item5: '违反任何适用法律。',
    section3Title: '3. 内容所有权',
    section3Item1: '你只能上传或发布由你本人创作的原创内容。',
    section3Item2: '严禁抄袭或未经许可复制他人的作品。',
    section3Item3: '如果发现抄袭或侵犯版权，我们保留删除内容以及暂停或永久封禁账号的权利。',
    section4Title: '4. 欺诈与滥用',
    section4Item1: '禁止任何欺诈行为，包括但不限于冒充他人、提供虚假信息或操纵数据。',
    section4Item2: '任何违规行为都将导致账号立即被终止。',
    section5Title: '5. 知识产权',
    section5Item1: '我们保留在不事先通知的情况下删除或编辑违反政策内容的权利。',
    section5Item2: '我们的审核团队作出的决定为最终决定。',
    section6Title: '6. 内容审核',
    section6Item1: '我们保留在不事先通知的情况下删除或编辑违反政策内容的权利。',
    section6Item2: '我们的审核团队作出的决定为最终决定。',
    section7Title: '7. 账号终止',
    section7Item1: '如果你违反这些条款，我们可以在不事先通知的情况下暂停或终止你的账号。',
    section8Title: '8. 免责声明',
    section8Item1: '对于因用户内容造成的任何损害、损失或误解，我们不承担责任。',
    section8Item2: '使用本平台的风险由你自行承担。',
    section9Title: '9. 条款变更',
    section9Item1: '我们可能会不时更新这些条款。',
    section9Item2: '条款变更后继续使用平台，即表示你接受更新后的条款。',
    section10Title: '10. 联系我们',
    contactIntro: '如果你对这些条款有任何问题或疑虑，请通过以下方式联系我们：',
  },
  ja: {
    goBack: '戻る',
    title: '利用規約とポリシー',
    effectiveDate: '発効日：',
    welcome: 'Shadowera へようこそ',
    intro: '当プラットフォームにアクセスまたは利用することで、あなた（「ユーザー」「作者」または「読者」）は本利用規約に従うことに同意したものとみなされます。よくお読みください。',
    section1Title: '1. ユーザーアカウント',
    section1Item1: 'コンテンツを投稿または利用するには、登録してアカウントを作成する必要があります。',
    section1Item2: 'アカウント情報を安全に管理する責任はユーザーにあります。',
    section1Item3: 'アカウントが不正利用されたと思われる場合は、直ちにご連絡ください。',
    section2Title: '2. ユーザーの行動',
    section2Item1: '敬意と責任を持って行動することに同意するものとします。以下の行為は禁止されています：',
    section2Item2: 'わいせつ、攻撃的、または暴力的なコンテンツを投稿または作成すること。',
    section2Item3: '他のユーザーに対して無礼、名誉毀損、または侮辱的な言葉を使用すること。',
    section2Item4: '嫌がらせ、脅迫、または憎悪に基づく行為を行うこと。',
    section2Item5: '適用される法律に違反すること。',
    section3Title: '3. コンテンツの所有権',
    section3Item1: '自分で作成したオリジナルコンテンツのみをアップロードまたは公開してください。',
    section3Item2: '盗作、または許可なく他人の作品をコピーすることは固く禁止されています。',
    section3Item3: '盗作または著作権侵害が確認された場合、当社はコンテンツを削除し、アカウントを停止または永久に禁止する権利を有します。',
    section4Title: '4. 不正行為と悪用',
    section4Item1: '他人へのなりすまし、虚偽情報の提供、データ操作などを含む不正行為は禁止されています。',
    section4Item2: '違反が確認された場合、アカウントは直ちに終了されます。',
    section5Title: '5. 知的財産',
    section5Item1: '当社は、ポリシーに違反するコンテンツを事前通知なく削除または編集する権利を有します。',
    section5Item2: 'モデレーションチームの決定は最終的なものです。',
    section6Title: '6. コンテンツモデレーション',
    section6Item1: '当社は、ポリシーに違反するコンテンツを事前通知なく削除または編集する権利を有します。',
    section6Item2: 'モデレーションチームの決定は最終的なものです。',
    section7Title: '7. アカウントの停止・終了',
    section7Item1: '本規約に違反した場合、事前通知なくアカウントを停止または終了することがあります。',
    section8Title: '8. 免責事項',
    section8Item1: 'ユーザーコンテンツによって生じた損害、損失、または誤解について、当社は責任を負いません。',
    section8Item2: '本プラットフォームは自己責任でご利用ください。',
    section9Title: '9. 規約の変更',
    section9Item1: '当社は本規約を随時更新する場合があります。',
    section9Item2: '変更後もプラットフォームを継続して利用した場合、更新された規約に同意したものとみなされます。',
    section10Title: '10. お問い合わせ',
    contactIntro: '本規約についてご質問や懸念がある場合は、以下までお問い合わせください：',
  },
  ko: {
    goBack: '뒤로 가기',
    title: '이용약관 및 정책',
    effectiveDate: '시행일:',
    welcome: 'Shadowera에 오신 것을 환영합니다',
    intro: '플랫폼에 접속하거나 이용함으로써 귀하(“사용자”, “작가” 또는 “독자”)는 본 서비스 약관을 준수하는 데 동의합니다. 주의 깊게 읽어 주세요.',
    section1Title: '1. 사용자 계정',
    section1Item1: '콘텐츠를 게시하거나 이용하려면 가입하고 계정을 만들어야 합니다.',
    section1Item2: '계정 정보를 안전하게 보호할 책임은 사용자에게 있습니다.',
    section1Item3: '계정이 침해되었다고 생각되면 즉시 문의해 주세요.',
    section2Title: '2. 사용자 행동',
    section2Item1: '존중하고 책임감 있게 행동하는 데 동의합니다. 다음 행위는 금지됩니다:',
    section2Item2: '음란하거나 불쾌감을 주거나 폭력적인 콘텐츠를 게시 또는 제작하는 행위.',
    section2Item3: '다른 사용자에게 무례하거나 명예를 훼손하거나 모욕적인 언어를 사용하는 행위.',
    section2Item4: '괴롭힘, 위협 또는 혐오 행동을 하는 행위.',
    section2Item5: '적용되는 법률을 위반하는 행위.',
    section3Title: '3. 콘텐츠 소유권',
    section3Item1: '직접 만든 원본 콘텐츠만 업로드하거나 게시해야 합니다.',
    section3Item2: '표절 또는 허가 없이 다른 사람의 작품을 복사하는 행위는 엄격히 금지됩니다.',
    section3Item3: '표절 또는 저작권 위반이 확인되면 당사는 콘텐츠를 삭제하고 계정을 정지하거나 영구적으로 차단할 권리를 보유합니다.',
    section4Title: '4. 사기 및 오용',
    section4Item1: '다른 사람을 사칭하거나 허위 정보를 제공하거나 데이터를 조작하는 행위 등을 포함한 사기 행위는 금지됩니다.',
    section4Item2: '위반 시 계정이 즉시 종료됩니다.',
    section5Title: '5. 지적 재산권',
    section5Item1: '당사는 정책을 위반한 콘텐츠를 사전 통지 없이 삭제하거나 수정할 권리를 보유합니다.',
    section5Item2: '운영 검토팀의 결정은 최종적입니다.',
    section6Title: '6. 콘텐츠 검토',
    section6Item1: '당사는 정책을 위반한 콘텐츠를 사전 통지 없이 삭제하거나 수정할 권리를 보유합니다.',
    section6Item2: '운영 검토팀의 결정은 최종적입니다.',
    section7Title: '7. 계정 종료',
    section7Item1: '본 약관을 위반하는 경우 사전 통지 없이 계정을 정지하거나 종료할 수 있습니다.',
    section8Title: '8. 면책 조항',
    section8Item1: '사용자 콘텐츠로 인해 발생한 손해, 손실 또는 오해에 대해 당사는 책임을 지지 않습니다.',
    section8Item2: '플랫폼 이용에 따른 위험은 사용자 본인이 부담합니다.',
    section9Title: '9. 약관 변경',
    section9Item1: '당사는 본 약관을 수시로 업데이트할 수 있습니다.',
    section9Item2: '변경 후에도 플랫폼을 계속 이용하면 업데이트된 약관에 동의한 것으로 간주됩니다.',
    section10Title: '10. 문의하기',
    contactIntro: '본 약관에 대한 질문이나 우려 사항이 있는 경우 다음으로 문의해 주세요:',
  },
})

const sections = [
  {
    title: 'section1Title',
    items: ['section1Item1', 'section1Item2', 'section1Item3'],
  },
  {
    title: 'section2Title',
    items: [
      'section2Item1',
      'section2Item2',
      'section2Item3',
      'section2Item4',
      'section2Item5',
    ],
  },
  {
    title: 'section3Title',
    items: ['section3Item1', 'section3Item2', 'section3Item3'],
  },
  {
    title: 'section4Title',
    items: ['section4Item1', 'section4Item2'],
  },
  {
    title: 'section5Title',
    items: ['section5Item1', 'section5Item2'],
  },
  {
    title: 'section6Title',
    items: ['section6Item1', 'section6Item2'],
  },
  {
    title: 'section7Title',
    items: ['section7Item1'],
  },
  {
    title: 'section8Title',
    items: ['section8Item1', 'section8Item2'],
  },
  {
    title: 'section9Title',
    items: ['section9Item1', 'section9Item2'],
  },
]

export default function TermsPoliciesPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <div
      className="app-page min-h-screen overflow-x-hidden bg-white pb-10 text-[#141414] dark:bg-[var(--shadow-bg-page)] dark:text-[var(--shadow-text-primary)]"
      style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
    >
      <header className="sticky top-0 z-50 bg-[#ff2b2b] px-4 py-3 text-white shadow-sm sm:py-4">
        <div className="relative mx-auto flex max-w-3xl items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-95"
            aria-label={t('termsPoliciesPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[13px]" />
          </button>

          <h1 className="px-12 text-center text-[15px] font-[700] tracking-tight sm:text-[22px]">
            <span className="mr-2">📜</span>
            {t('termsPoliciesPage.title')}
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-10">
        <article className="w-full max-w-full break-words text-[13px] leading-6 sm:text-[18px] sm:leading-8">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-5 sm:mb-5 sm:gap-x-5 sm:text-[18px] sm:leading-7">
            <span className="font-[700]">
              {t('termsPoliciesPage.effectiveDate')}
            </span>
            <span className="font-[400]">21/12/2025</span>
          </div>

          <h2 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[20px]">
            {t('termsPoliciesPage.welcome')}
          </h2>

          <p className="mb-5 font-[400] sm:mb-7">
            {t('termsPoliciesPage.intro')}
          </p>

          {sections.map((section) => (
            <section
              key={section.title}
              className="mb-6 sm:mb-7"
            >
              <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">
                {t(`termsPoliciesPage.${section.title}`)}
              </h3>
              <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
                {section.items.map((item) => (
                  <li key={item}>
                    {t(`termsPoliciesPage.${item}`)}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">
              {t('termsPoliciesPage.section10Title')}
            </h3>
            <p className="mb-2 font-[400]">
              {t('termsPoliciesPage.contactIntro')}
            </p>
            <ul className="list-disc space-y-1 pl-5 font-[400] sm:pl-7">
              <li>[alphacentauri12226@gmail.com]</li>
              <li>Facebook Page [ របស់អាល់ផាសេនតាវី ]</li>
              <li>Telegram [ @Hei_xxing ]</li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
}
