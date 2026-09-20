const textByLanguage = {
  en: {
    offline: 'This device reports no internet connection. Check Wi-Fi or mobile data, then try again.',
    server: 'Shadow returned a server error (HTTP {status}). This is a Shadow service problem. Our team needs to resolve it; please try again later.',
    unauthorized: 'Shadow could not verify your login (HTTP 401). Sign in again. If the error continues, contact Shadow Support.',
    forbidden: 'Shadow denied this request (HTTP 403). The exact access restriction has not been confirmed. Contact Shadow Support; do not create another account.',
    missing: 'Shadow could not find this episode (HTTP 404). Open it from its story page. If it is still missing, contact Shadow Support.',
    limited: 'Shadow is temporarily limiting requests (HTTP 429). Wait a moment before trying again.',
    cache: 'Shadow could not read saved reading data on this device. Close and reopen Shadow, then retry. Your account is not identified as the cause.',
    unknown: 'The request to Shadow failed, but the cause is not yet confirmed. This does not establish a problem with your internet, account, or age. Please report the code below to Shadow Support.',
    code: 'Error code',
  },
  km: {
    offline: 'ឧបករណ៍នេះរាយការណ៍ថាមិនមានអ៊ីនធឺណិត។ សូមពិនិត្យ Wi-Fi ឬទិន្នន័យទូរសព្ទ ហើយសាកល្បងម្តងទៀត។',
    server: 'ម៉ាស៊ីនមេ Shadow បានឆ្លើយតបដោយកំហុស (HTTP {status})។ នេះជាបញ្ហាសេវាកម្ម Shadow ដែលក្រុមការងារយើងត្រូវដោះស្រាយ។ សូមសាកល្បងពេលក្រោយ។',
    unauthorized: 'Shadow មិនអាចផ្ទៀងផ្ទាត់ការចូលគណនីបាន (HTTP 401)។ សូមចូលគណនីម្ដងទៀត។ បើបញ្ហានៅបន្ត សូមទាក់ទងក្រុមជំនួយ Shadow។',
    forbidden: 'Shadow បានបដិសេធសំណើនេះ (HTTP 403) ប៉ុន្តែមិនទាន់បញ្ជាក់មូលហេតុនៃការកំណត់សិទ្ធិទេ។ សូមទាក់ទងក្រុមជំនួយ Shadow។ មិនចាំបាច់បង្កើតគណនីថ្មីទេ។',
    missing: 'Shadow រកមិនឃើញភាគរឿងនេះ (HTTP 404)។ សូមបើកវាពីទំព័ររឿង។ បើនៅតែរកមិនឃើញ សូមទាក់ទងក្រុមជំនួយ Shadow។',
    limited: 'Shadow កំពុងកំណត់ចំនួនសំណើជាបណ្ដោះអាសន្ន (HTTP 429)។ សូមរង់ចាំបន្តិច រួចព្យាយាមម្ដងទៀត។',
    cache: 'Shadow មិនអាចអានទិន្នន័យអានរឿងដែលបានរក្សាទុកលើឧបករណ៍នេះបានទេ។ សូមបិទ ហើយបើក Shadow ឡើងវិញ។ មិនមានភស្តុតាងថាបណ្តាលពីគណនីរបស់អ្នកទេ។',
    unknown: 'សំណើទៅ Shadow បានបរាជ័យ ប៉ុន្តែមិនទាន់អាចបញ្ជាក់មូលហេតុបានទេ។ មិនមានភស្តុតាងថាបណ្តាលពីអ៊ីនធឺណិត គណនី ឬអាយុរបស់អ្នកទេ។ សូមផ្ញើលេខកូដខាងក្រោមទៅក្រុមជំនួយ Shadow។',
    code: 'លេខកូដកំហុស',
  },
  zh: {
    offline: '设备报告没有互联网连接。请检查 Wi-Fi 或移动网络，然后重试。',
    server: 'Shadow 服务器返回错误（HTTP {status}）。这是 Shadow 服务问题，需要由我们的团队处理。请稍后重试。',
    unauthorized: 'Shadow 无法验证您的登录状态（HTTP 401）。请重新登录。如果问题持续，请联系 Shadow 客服。',
    forbidden: 'Shadow 拒绝了此请求（HTTP 403），但尚未确认具体的访问限制。请联系 Shadow 客服，无需创建新账户。',
    missing: 'Shadow 找不到该章节（HTTP 404）。请从故事页面打开；如仍无法找到，请联系 Shadow 客服。',
    limited: 'Shadow 暂时限制请求（HTTP 429）。请稍等片刻再试。',
    cache: 'Shadow 无法读取此设备上保存的阅读数据。请关闭并重新打开 Shadow。暂无证据表明是您的账户造成的。',
    unknown: '向 Shadow 发送的请求失败，但原因尚未确定。不能据此认定是您的网络、账户或年龄问题。请将下方错误代码发送给 Shadow 客服。',
    code: '错误代码',
  },
  ja: {
    offline: '端末がインターネット未接続と報告しています。Wi-Fi またはモバイル通信を確認し、再試行してください。',
    server: 'Shadow のサーバーがエラーを返しました（HTTP {status}）。Shadow 側で対応すべきサービスの問題です。しばらくしてから再試行してください。',
    unauthorized: 'Shadow でログイン状態を確認できませんでした（HTTP 401）。再度ログインしてください。続く場合はサポートに連絡してください。',
    forbidden: 'Shadow がリクエストを拒否しました（HTTP 403）。具体的なアクセス制限の理由は未確認です。新しいアカウントを作らず、サポートに連絡してください。',
    missing: 'Shadow でこのエピソードが見つかりません（HTTP 404）。作品ページから開いてください。見つからなければサポートに連絡してください。',
    limited: 'Shadow が一時的にリクエストを制限しています（HTTP 429）。少し待って再試行してください。',
    cache: 'この端末に保存された読書データを Shadow が読み込めませんでした。Shadow を閉じて開き直してください。アカウントが原因と確認されたわけではありません。',
    unknown: 'Shadow へのリクエストに失敗しましたが、原因は未特定です。通信環境、アカウント、年齢が原因とは断定できません。下記のコードをサポートにお知らせください。',
    code: 'エラーコード',
  },
  ko: {
    offline: '기기가 인터넷에 연결되어 있지 않다고 보고합니다. Wi-Fi 또는 모바일 데이터를 확인한 뒤 다시 시도하세요.',
    server: 'Shadow 서버에서 오류가 발생했습니다(HTTP {status}). Shadow 측에서 해결해야 할 서비스 문제입니다. 잠시 후 다시 시도하세요.',
    unauthorized: 'Shadow가 로그인 상태를 확인하지 못했습니다(HTTP 401). 다시 로그인하세요. 문제가 계속되면 고객지원에 문의하세요.',
    forbidden: 'Shadow가 요청을 거부했습니다(HTTP 403). 구체적인 접근 제한 이유는 아직 확인되지 않았습니다. 새 계정을 만들지 말고 고객지원에 문의하세요.',
    missing: 'Shadow에서 이 에피소드를 찾을 수 없습니다(HTTP 404). 작품 페이지에서 열어 보세요. 계속 없으면 고객지원에 문의하세요.',
    limited: 'Shadow가 일시적으로 요청을 제한하고 있습니다(HTTP 429). 잠시 기다렸다가 다시 시도하세요.',
    cache: 'Shadow가 이 기기에 저장된 읽기 데이터를 불러오지 못했습니다. 앱을 닫았다가 다시 여세요. 계정이 원인이라고 확인된 것은 아닙니다.',
    unknown: 'Shadow로 보낸 요청이 실패했으나 원인은 확인되지 않았습니다. 인터넷, 계정 또는 나이 문제로 단정할 수 없습니다. 아래 오류 코드를 고객지원에 전달해 주세요.',
    code: '오류 코드',
  },
  th: {
    offline: 'อุปกรณ์รายงานว่าไม่ได้เชื่อมต่ออินเทอร์เน็ต โปรดตรวจสอบ Wi-Fi หรือข้อมูลมือถือแล้วลองอีกครั้ง',
    server: 'เซิร์ฟเวอร์ Shadow ตอบกลับด้วยข้อผิดพลาด (HTTP {status}) นี่เป็นปัญหาของบริการ Shadow ที่ทีมงานต้องแก้ไข โปรดลองใหม่ภายหลัง',
    unauthorized: 'Shadow ไม่สามารถยืนยันการเข้าสู่ระบบได้ (HTTP 401) โปรดเข้าสู่ระบบอีกครั้ง หากยังมีปัญหาให้ติดต่อฝ่ายสนับสนุน',
    forbidden: 'Shadow ปฏิเสธคำขอ (HTTP 403) แต่ยังไม่ยืนยันสาเหตุของข้อจำกัดการเข้าถึง โปรดติดต่อฝ่ายสนับสนุนโดยไม่ต้องสร้างบัญชีใหม่',
    missing: 'Shadow ไม่พบตอนนี้ (HTTP 404) โปรดเปิดจากหน้าของเรื่อง หากยังไม่พบให้ติดต่อฝ่ายสนับสนุน',
    limited: 'Shadow จำกัดจำนวนคำขอชั่วคราว (HTTP 429) โปรดรอสักครู่แล้วลองอีกครั้ง',
    cache: 'Shadow ไม่สามารถอ่านข้อมูลการอ่านที่บันทึกไว้บนอุปกรณ์นี้ โปรดปิดแล้วเปิด Shadow ใหม่ ยังไม่มีหลักฐานว่าบัญชีของคุณเป็นสาเหตุ',
    unknown: 'คำขอไปยัง Shadow ล้มเหลว แต่ยังไม่ทราบสาเหตุ ไม่อาจสรุปว่าเป็นปัญหาอินเทอร์เน็ต บัญชี หรืออายุของคุณ โปรดแจ้งรหัสด้านล่างแก่ฝ่ายสนับสนุน',
    code: 'รหัสข้อผิดพลาด',
  },
}

export function describeReaderLoadFailure(error, language = 'en') {
  const languageId = String(language).toLowerCase().split('-')[0]
  const copy = textByLanguage[languageId] || textByLanguage.en
  const status = Number(error?.status) || 0
  const backendCode = String(error?.code || '')
  const genericNetworkFailure = /^(?:load failed|failed to fetch|network request failed)$/i.test(String(error?.message || '').trim())
  let type = 'unknown'
  let code = 'SHADOW-REQUEST-UNKNOWN'
  if (backendCode === 'CACHE_READ_FAILED') {
    type = 'cache'
    code = 'SHADOW-CACHE-READ'
  } else if (backendCode === 'NETWORK_UNAVAILABLE' || genericNetworkFailure) {
    code = 'SHADOW-NETWORK-UNDETERMINED'
  } else if (status >= 500 && status <= 599) {
    type = 'server'
    code = `SHADOW-HTTP-${status}`
  } else if (status === 401) {
    type = 'unauthorized'
    code = 'SHADOW-HTTP-401'
  } else if (status === 403) {
    type = 'forbidden'
    code = 'SHADOW-HTTP-403'
  } else if (status === 404) {
    type = 'missing'
    code = 'SHADOW-HTTP-404'
  } else if (status === 429) {
    type = 'limited'
    code = 'SHADOW-HTTP-429'
  } else if (!status && typeof navigator !== 'undefined' && navigator.onLine === false) {
    type = 'offline'
    code = 'SHADOW-DEVICE-OFFLINE'
  }
  const description = copy[type].replace('{status}', String(status))
  return `${description} ${copy.code}: ${code}`
}
