import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('premiumHelpSheet', {
  en: {
    aboutPremium: 'About Premium',
    intro: 'Important information about membership, payment, duration, benefits, and rewards.',
    close: 'Close Premium information',
    gotIt: 'Got it',
    s1Title: '1. Membership Period',
    s1i1: 'Your Premium membership begins after your payment is confirmed successfully.',
    s1i2: 'The membership duration depends on the 1, 3, or 12 month plan you select.',
    s1i3: 'Your benefits remain active until the end of your Premium period.',
    s1i4: 'Premium applies only to the account used to complete the purchase.',
    s1i5: 'Membership time cannot be transferred to another account.',
    s2Title: '2. Premium Benefits',
    s2i1: 'Premium benefits may include early access, profile badges, Diamond rewards, Premium-only content, selected discounts, and special promotions.',
    s2i2: 'Some benefits may vary depending on the selected plan, story, event, promotion, or availability.',
    s2i3: 'Not every benefit applies to every story, episode, product, or event.',
    s3Title: '3. Payment Confirmation',
    s3i1: 'The exact amount is shown before you continue to the payment page.',
    s3i2: 'Premium activates only after the payment is confirmed.',
    s3i3: 'Failed, cancelled, expired, or incomplete payments do not activate Premium.',
    s3i4: 'Additional review may be required if the payment cannot be matched automatically.',
    s3i5: 'Completed payments are subject to the applicable refund and payment provider rules.',
    s4Title: '4. Extending Premium',
    s4i1: 'Premium does not renew automatically in the current payment flow.',
    s4i2: 'To continue Premium, you can purchase another 1, 3, or 12 month plan.',
    s4i3: 'If your Premium is still active, the newly purchased period is added after your current expiration date.',
    s4i4: 'You will see the payment amount and plan again before confirming another purchase.',
    s5Title: '5. When Premium Expires',
    s5i1: 'Premium benefits stop when your active Premium period ends.',
    s5i2: 'Your account then continues as a normal Free Reader account unless you purchase another Premium plan.',
    s5i3: 'Diamonds already added to your Wallet are not removed when Premium expires.',
    s5i4: 'No new Premium payment is charged unless you choose to purchase another plan.',
    s6Title: '6. Diamonds and Rewards',
    s6i1: 'The Diamond amount shown with your selected plan is added after payment confirmation.',
    s6i2: 'Premium Check-in can reward 1 Diamond per day when you claim the daily Check-in.',
    s6i3: 'Bonus Diamonds cannot be exchanged for cash.',
    s6i4: 'Promotional Diamond amounts may change during special campaigns.',
    s6i5: 'Claimed rewards remain subject to Shadow Wallet and Diamond policies.',
    s7Title: '7. Benefit Availability',
    s7i1: 'Premium benefits may not apply to every story, episode, product, or event.',
    s7i2: 'Early-access periods may differ between stories.',
    s7i3: 'Discounts may apply only to eligible purchases.',
    s7i4: 'Premium-only content may become unavailable after your membership expires.',
    s7i5: 'New benefits may be added, adjusted, or removed when necessary.',
    s8Title: '8. Important Notes',
    s8i1: 'Premium starts after successful payment confirmation unless otherwise stated.',
    s8i2: 'There is no free trial unless a trial is clearly shown before purchase.',
    s8i3: 'Premium membership cannot be transferred, shared, or resold.',
    s8i4: 'Users must follow Shadow Terms of Service while using Premium features.',
    s8i5: 'Misuse, fraud, or payment disputes may result in membership suspension.',
    s8i6: 'Refund eligibility is determined by the applicable refund policy and payment provider rules.',
    s8i7: 'Prices and plan details are always shown before purchase confirmation.',
  },
  km: {
    aboutPremium: 'អំពី Premium',
    intro: 'ព័ត៌មានសំខាន់អំពីសមាជិកភាព ការទូទាត់ រយៈពេល អត្ថប្រយោជន៍ និងរង្វាន់។',
    close: 'បិទព័ត៌មាន Premium',
    gotIt: 'យល់ហើយ',
    s1Title: '1. រយៈពេលសមាជិកភាព',
    s1i1: 'សមាជិកភាព Premium របស់អ្នកចាប់ផ្តើម បន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់ថាជោគជ័យ។',
    s1i2: 'រយៈពេលសមាជិកភាពអាស្រ័យលើគម្រោង 1 ខែ 3 ខែ ឬ 12 ខែដែលអ្នកជ្រើសរើស។',
    s1i3: 'អត្ថប្រយោជន៍របស់អ្នកនៅតែសកម្មរហូតដល់រយៈពេល Premium បញ្ចប់។',
    s1i4: 'Premium អនុវត្តតែលើគណនីដែលបានប្រើសម្រាប់ការទិញប៉ុណ្ណោះ។',
    s1i5: 'រយៈពេលសមាជិកភាពមិនអាចផ្ទេរទៅគណនីផ្សេងបានទេ។',
    s2Title: '2. អត្ថប្រយោជន៍ Premium',
    s2i1: 'អត្ថប្រយោជន៍ Premium អាចរួមមានការចូលអានមុន Badge ប្រវត្តិរូប រង្វាន់ Diamond មាតិកាសម្រាប់ Premium ការបញ្ចុះតម្លៃ និងប្រូម៉ូសិនពិសេស។',
    s2i2: 'អត្ថប្រយោជន៍ខ្លះអាចខុសគ្នាតាមគម្រោង រឿង Event ប្រូម៉ូសិន ឬភាពអាចប្រើបាន។',
    s2i3: 'មិនមែនអត្ថប្រយោជន៍ទាំងអស់អនុវត្តលើគ្រប់រឿង ភាគ ផលិតផល ឬ Event ទាំងអស់ទេ។',
    s3Title: '3. ការបញ្ជាក់ការទូទាត់',
    s3i1: 'ចំនួនទឹកប្រាក់ត្រឹមត្រូវនឹងបង្ហាញមុនអ្នកបន្តទៅទំព័របង់ប្រាក់។',
    s3i2: 'Premium នឹងសកម្មតែបន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់ប៉ុណ្ណោះ។',
    s3i3: 'ការទូទាត់ដែលបរាជ័យ ត្រូវបានបោះបង់ ផុតកំណត់ ឬមិនទាន់បញ្ចប់ នឹងមិនបើក Premium ទេ។',
    s3i4: 'អាចត្រូវការការពិនិត្យបន្ថែម បើប្រព័ន្ធមិនអាចផ្គូផ្គងការទូទាត់ដោយស្វ័យប្រវត្តិ។',
    s3i5: 'ការទូទាត់ដែលបានបញ្ចប់ស្ថិតក្រោមគោលការណ៍ Refund និងច្បាប់អ្នកផ្តល់សេវាទូទាត់។',
    s4Title: '4. ការបន្ថែមរយៈពេល Premium',
    s4i1: 'Premium មិនបន្តស្វ័យប្រវត្តិក្នុងប្រព័ន្ធទូទាត់បច្ចុប្បន្នទេ។',
    s4i2: 'ដើម្បីបន្ត Premium អ្នកអាចទិញគម្រោង 1 ខែ 3 ខែ ឬ 12 ខែម្តងទៀត។',
    s4i3: 'បើ Premium របស់អ្នកនៅសកម្ម រយៈពេលដែលទិញថ្មីនឹងបន្ថែមបន្តពីថ្ងៃផុតកំណត់បច្ចុប្បន្ន។',
    s4i4: 'តម្លៃ និងគម្រោងនឹងបង្ហាញម្តងទៀត មុនអ្នកបញ្ជាក់ការទិញថ្មី។',
    s5Title: '5. ពេល Premium ផុតកំណត់',
    s5i1: 'អត្ថប្រយោជន៍ Premium នឹងឈប់នៅពេលរយៈពេល Premium សកម្មរបស់អ្នកបញ្ចប់។',
    s5i2: 'គណនីរបស់អ្នកនឹងបន្តជា Free Reader ធម្មតា លុះត្រាតែអ្នកទិញ Premium ថ្មី។',
    s5i3: 'Diamonds ដែលបានបញ្ចូលក្នុង Wallet រួច មិនត្រូវដកចេញនៅពេល Premium ផុតកំណត់ទេ។',
    s5i4: 'មិនមានការគិតថ្លៃ Premium ថ្មីទេ លុះត្រាតែអ្នកជ្រើសទិញគម្រោងម្តងទៀត។',
    s6Title: '6. Diamond និងរង្វាន់',
    s6i1: 'ចំនួន Diamond ដែលបង្ហាញជាមួយគម្រោងដែលអ្នកជ្រើស នឹងត្រូវបញ្ចូលបន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់។',
    s6i2: 'Premium Check-in អាចទទួលបាន 1 Diamond ក្នុងមួយថ្ងៃ នៅពេលអ្នក Claim Daily Check-in។',
    s6i3: 'Bonus Diamond មិនអាចប្ដូរជាសាច់ប្រាក់បានទេ។',
    s6i4: 'ចំនួន Diamond ប្រូម៉ូសិនអាចផ្លាស់ប្តូរនៅពេលមានយុទ្ធនាការពិសេស។',
    s6i5: 'រង្វាន់ដែលបាន Claim នៅតែស្ថិតក្រោមគោលការណ៍ Shadow Wallet និង Diamond។',
    s7Title: '7. ភាពអាចប្រើបាននៃអត្ថប្រយោជន៍',
    s7i1: 'អត្ថប្រយោជន៍ Premium អាចមិនអនុវត្តលើគ្រប់រឿង ភាគ ផលិតផល ឬ Event ទាំងអស់ទេ។',
    s7i2: 'រយៈពេលចូលមើលមុនអាចខុសគ្នាតាមរឿង។',
    s7i3: 'ការបញ្ចុះតម្លៃអាចអនុវត្តតែលើការទិញដែលមានសិទ្ធិ។',
    s7i4: 'មាតិកាសម្រាប់ Premium អាចលែងអាចប្រើបាន បន្ទាប់ពីសមាជិកភាពផុតកំណត់។',
    s7i5: 'អត្ថប្រយោជន៍ថ្មីអាចត្រូវបានបន្ថែម កែសម្រួល ឬដកចេញនៅពេលចាំបាច់។',
    s8Title: '8. ចំណាំសំខាន់',
    s8i1: 'Premium ចាប់ផ្តើមបន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់ថាជោគជ័យ លុះត្រាតែមានការបញ្ជាក់ផ្សេង។',
    s8i2: 'មិនមាន Free Trial ទេ លុះត្រាតែ Trial ត្រូវបានបង្ហាញច្បាស់មុនការទិញ។',
    s8i3: 'សមាជិកភាព Premium មិនអាចផ្ទេរ ចែករំលែក ឬលក់បន្តបានទេ។',
    s8i4: 'អ្នកប្រើត្រូវគោរព Shadow Terms of Service ខណៈប្រើមុខងារ Premium។',
    s8i5: 'ការប្រើប្រាស់ខុស ការក្លែងបន្លំ ឬវិវាទការទូទាត់ អាចបណ្ដាលឱ្យផ្អាកសមាជិកភាព។',
    s8i6: 'សិទ្ធិទទួល Refund អាស្រ័យលើគោលការណ៍ Refund និងច្បាប់របស់អ្នកផ្តល់សេវាទូទាត់។',
    s8i7: 'តម្លៃ និងព័ត៌មានគម្រោងតែងតែបង្ហាញមុនការបញ្ជាក់ការទិញ។',
  },
  zh: {
    aboutPremium: '关于 Premium',
    intro: '关于会员、付款、期限、权益和奖励的重要信息。',
    close: '关闭 Premium 信息',
    gotIt: '知道了',
    s1Title: '1. 会员期限',
    s1i1: '付款确认成功后，Premium 会员资格开始生效。',
    s1i2: '会员期限取决于您选择的 1、3 或 12 个月方案。',
    s1i3: '您的权益将持续有效至 Premium 期限结束。',
    s1i4: 'Premium 仅适用于完成购买时使用的账户。',
    s1i5: '会员时间不能转移到其他账户。',
    s2Title: '2. Premium 权益',
    s2i1: 'Premium 权益可能包括抢先阅读、个人资料徽章、Diamond 奖励、Premium 专属内容、指定折扣和特别促销。',
    s2i2: '部分权益可能因方案、故事、活动、促销或可用性而异。',
    s2i3: '并非所有权益都适用于每个故事、章节、商品或活动。',
    s3Title: '3. 付款确认',
    s3i1: '继续到付款页面前会显示准确的付款金额。',
    s3i2: '只有付款确认后 Premium 才会激活。',
    s3i3: '失败、取消、过期或未完成的付款不会激活 Premium。',
    s3i4: '如果付款无法自动匹配，可能需要额外审核。',
    s3i5: '已完成的付款受适用的退款政策和支付服务商规则约束。',
    s4Title: '4. 延长 Premium',
    s4i1: '当前付款流程不会自动续订 Premium。',
    s4i2: '如需继续使用 Premium，可再次购买 1、3 或 12 个月方案。',
    s4i3: '如果 Premium 仍有效，新购买的期限会从当前到期日之后继续增加。',
    s4i4: '再次购买前会重新显示方案和付款金额。',
    s5Title: '5. Premium 到期后',
    s5i1: 'Premium 有效期结束后，Premium 权益将停止。',
    s5i2: '除非再次购买 Premium，否则账户会继续作为普通 Free Reader 使用。',
    s5i3: 'Premium 到期后，已加入 Wallet 的 Diamonds 不会被移除。',
    s5i4: '只有您主动再次购买方案时才会产生新的 Premium 付款。',
    s6Title: '6. Diamonds 与奖励',
    s6i1: '付款确认后，将添加所选方案显示的 Diamond 数量。',
    s6i2: 'Premium 每日签到领取时可获得每天 1 Diamond。',
    s6i3: '奖励 Diamonds 不能兑换现金。',
    s6i4: '特别活动期间，促销 Diamond 数量可能会变化。',
    s6i5: '已领取的奖励仍受 Shadow Wallet 和 Diamond 政策约束。',
    s7Title: '7. 权益可用性',
    s7i1: 'Premium 权益可能不适用于每个故事、章节、商品或活动。',
    s7i2: '不同故事的抢先阅读期限可能不同。',
    s7i3: '折扣可能只适用于符合条件的购买。',
    s7i4: '会员到期后，Premium 专属内容可能无法继续使用。',
    s7i5: '必要时可能新增、调整或移除权益。',
    s8Title: '8. 重要说明',
    s8i1: '除非另有说明，付款确认成功后 Premium 开始生效。',
    s8i2: '除非购买前明确显示试用，否则不提供免费试用。',
    s8i3: 'Premium 会员不能转让、共享或转售。',
    s8i4: '使用 Premium 功能时，用户必须遵守 Shadow 服务条款。',
    s8i5: '滥用、欺诈或付款争议可能导致会员资格暂停。',
    s8i6: '退款资格由适用的退款政策和支付服务商规则决定。',
    s8i7: '价格和方案详情始终会在确认购买前显示。',
  },
  ja: {
    aboutPremium: 'Premium について',
    intro: '会員期間、支払い、期間、特典、報酬に関する重要な情報です。',
    close: 'Premium 情報を閉じる',
    gotIt: 'わかりました',
    s1Title: '1. 会員期間',
    s1i1: '支払いが確認されると Premium 会員が開始されます。',
    s1i2: '会員期間は選択した 1、3、12 か月プランによって異なります。',
    s1i3: '特典は Premium 期間が終了するまで有効です。',
    s1i4: 'Premium は購入に使用したアカウントにのみ適用されます。',
    s1i5: '会員期間を別のアカウントへ移すことはできません。',
    s2Title: '2. Premium 特典',
    s2i1: 'Premium 特典には、先行アクセス、プロフィールバッジ、Diamond 報酬、Premium 限定コンテンツ、対象割引、特別プロモーションなどが含まれる場合があります。',
    s2i2: '一部の特典はプラン、ストーリー、イベント、プロモーション、利用状況によって異なる場合があります。',
    s2i3: 'すべての特典がすべてのストーリー、エピソード、商品、イベントに適用されるわけではありません。',
    s3Title: '3. 支払い確認',
    s3i1: '支払いページへ進む前に正確な金額が表示されます。',
    s3i2: 'Premium は支払いが確認された後にのみ有効になります。',
    s3i3: '失敗、キャンセル、期限切れ、未完了の支払いでは Premium は有効になりません。',
    s3i4: '支払いを自動照合できない場合は追加確認が必要になることがあります。',
    s3i5: '完了した支払いには適用される返金ポリシーと決済事業者の規則が適用されます。',
    s4Title: '4. Premium の延長',
    s4i1: '現在の支払いフローでは Premium は自動更新されません。',
    s4i2: 'Premium を継続するには、1、3、12 か月プランを再度購入できます。',
    s4i3: 'Premium がまだ有効な場合、新しく購入した期間は現在の有効期限の後に追加されます。',
    s4i4: '再購入前にプランと支払い金額が再表示されます。',
    s5Title: '5. Premium の期限切れ',
    s5i1: 'Premium 期間が終了すると Premium 特典は停止します。',
    s5i2: '再度 Premium を購入しない限り、アカウントは通常の Free Reader として継続します。',
    s5i3: 'Premium の期限が切れても Wallet に追加済みの Diamonds は削除されません。',
    s5i4: '新しい Premium 料金は、別のプランを購入した場合にのみ発生します。',
    s6Title: '6. Diamonds と報酬',
    s6i1: '支払い確認後、選択したプランに表示された Diamond 数が追加されます。',
    s6i2: 'Premium の Daily Check-in を受け取ると、1日 1 Diamond を獲得できます。',
    s6i3: 'ボーナス Diamonds は現金に交換できません。',
    s6i4: '特別キャンペーン中はプロモーション Diamond 数が変更される場合があります。',
    s6i5: '受け取った報酬には Shadow Wallet および Diamond ポリシーが適用されます。',
    s7Title: '7. 特典の利用可能性',
    s7i1: 'Premium 特典はすべてのストーリー、エピソード、商品、イベントに適用されるとは限りません。',
    s7i2: '先行アクセス期間はストーリーによって異なる場合があります。',
    s7i3: '割引は対象となる購入にのみ適用される場合があります。',
    s7i4: '会員期限終了後、Premium 限定コンテンツが利用できなくなる場合があります。',
    s7i5: '必要に応じて新しい特典の追加、調整、削除が行われる場合があります。',
    s8Title: '8. 重要事項',
    s8i1: '別途記載がない限り、支払い確認後に Premium が開始されます。',
    s8i2: '購入前に明示されていない限り、無料トライアルはありません。',
    s8i3: 'Premium 会員は譲渡、共有、転売できません。',
    s8i4: 'Premium 機能を利用する際は Shadow 利用規約に従う必要があります。',
    s8i5: '不正利用、詐欺、支払いに関する紛争により会員資格が停止される場合があります。',
    s8i6: '返金対象かどうかは適用される返金ポリシーおよび決済事業者の規則により決定されます。',
    s8i7: '価格とプラン詳細は購入確認前に必ず表示されます。',
  },
  ko: {
    aboutPremium: 'Premium 안내',
    intro: '멤버십, 결제, 기간, 혜택 및 보상에 관한 중요한 정보입니다.',
    close: 'Premium 정보 닫기',
    gotIt: '확인',
    s1Title: '1. 멤버십 기간',
    s1i1: '결제가 확인되면 Premium 멤버십이 시작됩니다.',
    s1i2: '멤버십 기간은 선택한 1개월, 3개월 또는 12개월 플랜에 따라 달라집니다.',
    s1i3: '혜택은 Premium 기간이 끝날 때까지 유지됩니다.',
    s1i4: 'Premium은 구매에 사용한 계정에만 적용됩니다.',
    s1i5: '멤버십 기간은 다른 계정으로 이전할 수 없습니다.',
    s2Title: '2. Premium 혜택',
    s2i1: 'Premium 혜택에는 선공개 이용, 프로필 배지, Diamond 보상, Premium 전용 콘텐츠, 일부 할인 및 특별 프로모션이 포함될 수 있습니다.',
    s2i2: '일부 혜택은 플랜, 스토리, 이벤트, 프로모션 또는 이용 가능 여부에 따라 달라질 수 있습니다.',
    s2i3: '모든 혜택이 모든 스토리, 에피소드, 상품 또는 이벤트에 적용되는 것은 아닙니다.',
    s3Title: '3. 결제 확인',
    s3i1: '결제 페이지로 이동하기 전에 정확한 결제 금액이 표시됩니다.',
    s3i2: 'Premium은 결제가 확인된 후에만 활성화됩니다.',
    s3i3: '실패, 취소, 만료 또는 미완료 결제는 Premium을 활성화하지 않습니다.',
    s3i4: '결제를 자동으로 매칭할 수 없는 경우 추가 검토가 필요할 수 있습니다.',
    s3i5: '완료된 결제에는 적용 가능한 환불 정책과 결제 제공업체 규칙이 적용됩니다.',
    s4Title: '4. Premium 연장',
    s4i1: '현재 결제 흐름에서는 Premium이 자동 갱신되지 않습니다.',
    s4i2: 'Premium을 계속하려면 1개월, 3개월 또는 12개월 플랜을 다시 구매할 수 있습니다.',
    s4i3: 'Premium이 아직 활성 상태라면 새로 구매한 기간은 현재 만료일 뒤에 추가됩니다.',
    s4i4: '다시 구매하기 전에 플랜과 결제 금액이 다시 표시됩니다.',
    s5Title: '5. Premium 만료',
    s5i1: 'Premium 기간이 끝나면 Premium 혜택이 중지됩니다.',
    s5i2: 'Premium을 다시 구매하지 않으면 계정은 일반 Free Reader로 계속 사용할 수 있습니다.',
    s5i3: 'Premium이 만료되어도 Wallet에 이미 추가된 Diamonds는 제거되지 않습니다.',
    s5i4: '다른 플랜을 직접 구매할 때만 새로운 Premium 결제가 발생합니다.',
    s6Title: '6. Diamonds 및 보상',
    s6i1: '결제가 확인되면 선택한 플랜에 표시된 Diamond 수량이 추가됩니다.',
    s6i2: 'Premium Daily Check-in을 Claim하면 하루 1 Diamond를 받을 수 있습니다.',
    s6i3: '보너스 Diamonds는 현금으로 교환할 수 없습니다.',
    s6i4: '특별 캠페인 중 프로모션 Diamond 수량이 변경될 수 있습니다.',
    s6i5: '수령한 보상에는 Shadow Wallet 및 Diamond 정책이 계속 적용됩니다.',
    s7Title: '7. 혜택 이용 가능 여부',
    s7i1: 'Premium 혜택은 모든 스토리, 에피소드, 상품 또는 이벤트에 적용되지 않을 수 있습니다.',
    s7i2: '선공개 기간은 스토리마다 다를 수 있습니다.',
    s7i3: '할인은 해당되는 구매에만 적용될 수 있습니다.',
    s7i4: '멤버십이 만료되면 Premium 전용 콘텐츠를 이용할 수 없게 될 수 있습니다.',
    s7i5: '필요한 경우 새로운 혜택이 추가, 조정 또는 제거될 수 있습니다.',
    s8Title: '8. 중요 안내',
    s8i1: '별도 안내가 없는 한 결제 확인 후 Premium이 시작됩니다.',
    s8i2: '구매 전에 명확히 표시되지 않는 한 무료 체험은 제공되지 않습니다.',
    s8i3: 'Premium 멤버십은 양도, 공유 또는 재판매할 수 없습니다.',
    s8i4: 'Premium 기능을 이용할 때는 Shadow 서비스 약관을 준수해야 합니다.',
    s8i5: '오용, 사기 또는 결제 분쟁으로 인해 멤버십이 정지될 수 있습니다.',
    s8i6: '환불 가능 여부는 적용되는 환불 정책과 결제 제공업체 규칙에 따라 결정됩니다.',
    s8i7: '가격과 플랜 세부 정보는 구매 확인 전에 항상 표시됩니다.',
  },
})

const HELP_SECTIONS = [
  { title: 's1Title', items: ['s1i1', 's1i2', 's1i3', 's1i4', 's1i5'] },
  { title: 's2Title', items: ['s2i1', 's2i2', 's2i3'] },
  { title: 's3Title', items: ['s3i1', 's3i2', 's3i3', 's3i4', 's3i5'] },
  { title: 's4Title', items: ['s4i1', 's4i2', 's4i3', 's4i4'] },
  { title: 's5Title', items: ['s5i1', 's5i2', 's5i3', 's5i4'] },
  { title: 's6Title', items: ['s6i1', 's6i2', 's6i3', 's6i4', 's6i5'] },
  { title: 's7Title', items: ['s7i1', 's7i2', 's7i3', 's7i4', 's7i5'] },
  { title: 's8Title', items: ['s8i1', 's8i2', 's8i3', 's8i4', 's8i5', 's8i6', 's8i7'] },
]

export default function PremiumHelpSheet({ open, onClose }) {
  const { t } = useDisplayTranslation()
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  useEffect(() => {
    if (!open) return undefined

    setDragOffset(0)
    setDragging(false)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const handleDragStart = (event) => {
    if (!event.isPrimary) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    draggingRef.current = true
    setDragging(true)
    startYRef.current = event.clientY
    currentYRef.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = (event) => {
    if (!draggingRef.current) return

    currentYRef.current = event.clientY
    setDragOffset(
      Math.max(0, currentYRef.current - startYRef.current)
    )
  }

  const handleDragEnd = () => {
    if (!draggingRef.current) return

    const distance = Math.max(
      0,
      currentYRef.current - startYRef.current
    )

    draggingRef.current = false
    setDragging(false)

    if (distance > 70) {
      onClose()
      return
    }

    setDragOffset(0)
  }

  return (
    <div
      className="fixed inset-0 z-[200000] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-help-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        aria-label={t('premiumHelpSheet.close')}
      />

      <section
        className="relative flex h-[calc(100dvh-12px)] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-elevated)] shadow-[0_-18px_50px_rgba(0,0,0,0.28)]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <header
          role="presentation"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onLostPointerCapture={handleDragEnd}
          className="shrink-0 cursor-grab touch-none border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-5 pb-4 pt-3 active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--shadow-text-tertiary)]" />

          <h2
            id="premium-help-title"
            className="text-[20px] font-bold text-[var(--shadow-text-primary)]"
          >
            {t('premiumHelpSheet.aboutPremium')}
          </h2>

          <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('premiumHelpSheet.intro')}
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
          <div className="divide-y divide-[var(--shadow-border)]">
            {HELP_SECTIONS.map((section) => (
              <section key={section.title} className="py-5">
                <h3 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">
                  {t(`premiumHelpSheet.${section.title}`)}
                </h3>

                <ul className="mt-3 space-y-2.5">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13px] leading-6 text-[var(--shadow-text-secondary)]"
                    >
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb000]" />
                      <span>{t(`premiumHelpSheet.${item}`)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffad0a] text-[15px] font-bold text-[#282828] active:scale-[0.99]"
          >
            {t('premiumHelpSheet.gotIt')}
          </button>
        </div>
      </section>
    </div>
  )
}
