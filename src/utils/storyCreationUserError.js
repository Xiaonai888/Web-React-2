import { getDisplayLanguageId } from './displayLanguage'

const MESSAGES = {
  km: {
    STORAGE_FULL: 'ទំហំសម្រាប់រក្សាទុករូបក្នុងឧបករណ៍នេះមិនគ្រប់គ្រាន់ទេ។ សូមបង្កើនទំហំទំនេរ ហើយសាកម្ដងទៀត។ កុំទាន់លុបព័ត៌មានរបស់ Shadow ព្រោះអាចបាត់រឿងព្រាង។',
    IMAGE_SAVE_FAILED: 'មិនអាចរក្សាទុករូបក្នុងឧបករណ៍នេះបានទេ។ អាចដោយសារទំហំផ្ទុកមិនគ្រប់ ឬកម្មវិធីរុករកមានបញ្ហា។ សូមពិនិត្យទំហំទំនេរ ហើយសាកជ្រើសរូបម្ដងទៀត។',
    STORAGE_BLOCKED: 'កម្មវិធីរុករកនេះមិនអនុញ្ញាតឱ្យរក្សាទុករូបបណ្ដោះអាសន្នទេ។ សូមបើក Shadow ក្នុង Chrome ឬកម្មវិធីរុករកធម្មតា ហើយសាកម្ដងទៀត។',
    STORAGE_INTERRUPTED: 'ការរក្សាទុករូបត្រូវបានរំខាន។ សូមបិទផ្ទាំង Shadow ផ្សេងៗ ហើយសាកម្ដងទៀត។ កុំទាន់លុបរឿងព្រាង។',
    IMAGE_TOO_LARGE: 'រូបភាពមានទំហំធំពេកសម្រាប់រក្សាទុក ឬបង្ហោះ។ សូមបន្ថយទំហំរូប ហើយសាកម្ដងទៀត។',
    IMAGE_UNREADABLE: 'មិនអាចបើក ឬអានរូបនេះបានទេ។ សូមសាករូប JPG ឬ PNG ផ្សេង។',
    NETWORK_FAILED: 'មិនអាចបញ្ជូនរូប ឬរឿងទៅអនឡាញបានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយសាកម្ដងទៀត។ កុំទាន់លុបរឿងព្រាង។',
    LOGIN_REQUIRED: 'ការចូលគណនីត្រូវការបញ្ជាក់ម្ដងទៀត។ សូមចូលគណនីដដែល ហើយពិនិត្យរឿងព្រាងមុនសាកបង្កើតរឿងឡើងវិញ។',
    SERVER_UNAVAILABLE: 'ប្រព័ន្ធអនឡាញកំពុងមានបញ្ហាបណ្ដោះអាសន្ន។ សូមពិនិត្យរឿងក្នុងគណនីជាមុន ហើយសាកម្ដងទៀតនៅពេលក្រោយ។',
    crop: 'មិនអាចរៀបចំរូបភាពបានទេ។ សូមសាករូបផ្សេង។',
    local: 'មិនអាចរក្សាទុករូប ឬរឿងព្រាងក្នុងឧបករណ៍នេះបានទេ។ សូមពិនិត្យទំហំទំនេរ និងសាកម្ដងទៀត។',
    queue: 'មិនអាចរក្សារូបសម្រាប់បង្ហោះពេលក្រោយបានទេ។ សូមពិនិត្យទំហំផ្ទុក និងសាកម្ដងទៀត។',
    upload: 'មិនអាចបញ្ជូនរូបទៅអនឡាញបានទេ។ សូមពិនិត្យអ៊ីនធឺណិត និងសាកម្ដងទៀត។',
    create: 'មិនអាចបញ្ចប់ការបង្កើតរឿងបានទេ។ សូមពិនិត្យថារឿងនេះមានក្នុងគណនីរួចហើយឬនៅ មុនសាកម្ដងទៀត។',
  },
  en: {
    STORAGE_FULL: 'There is not enough space to save images on this device. Free up some space and try again. Do not clear Shadow site data, as this could delete drafts.',
    IMAGE_SAVE_FAILED: 'This device could not save your image. Storage may be full, or the browser may have a problem. Check free space and try selecting the image again.',
    STORAGE_BLOCKED: 'This browser is not allowing temporary image storage. Open Shadow directly in Chrome or your regular browser and try again.',
    STORAGE_INTERRUPTED: 'Saving the image was interrupted. Close other Shadow tabs and try again. Do not delete your draft.',
    IMAGE_TOO_LARGE: 'The selected images are too large to save or upload. Use smaller images and try again.',
    IMAGE_UNREADABLE: 'This image cannot be opened or read. Try a different JPG or PNG image.',
    NETWORK_FAILED: 'Your image or story could not be sent online. Check your internet connection and try again. Do not delete your draft.',
    LOGIN_REQUIRED: 'Please sign in again to the same account. Check your draft before trying to create the story again.',
    SERVER_UNAVAILABLE: 'The online service is temporarily unavailable. Check your stories before trying again later.',
    crop: 'The image could not be prepared. Try a different image.',
    local: 'Your image or draft could not be saved on this device. Check free space and try again.',
    queue: 'Your image could not be saved for uploading later. Check device storage and try again.',
    upload: 'Your image could not be sent online. Check your connection and try again.',
    create: 'Your story could not be created. Check whether it already appears in your account before trying again.',
  },
  zh: {
    STORAGE_FULL: '设备没有足够空间保存图片。请释放一些空间后重试。暂时不要清除 Shadow 网站数据，以免丢失草稿。',
    IMAGE_SAVE_FAILED: '设备无法保存这张图片，可能是存储空间不足或浏览器出现问题。请检查剩余空间，再次选择图片。',
    STORAGE_BLOCKED: '浏览器不允许暂存图片。请直接在 Chrome 或常用浏览器中打开 Shadow 后重试。',
    STORAGE_INTERRUPTED: '保存图片时被中断。请关闭其他 Shadow 标签页后重试，先不要删除草稿。',
    IMAGE_TOO_LARGE: '图片过大，无法保存或上传。请缩小图片后重试。',
    IMAGE_UNREADABLE: '无法打开或读取这张图片。请换一张 JPG 或 PNG 图片。',
    NETWORK_FAILED: '无法将图片或作品发送到网上。请检查网络后重试，不要删除草稿。',
    LOGIN_REQUIRED: '请重新登录原账号，确认草稿后再尝试创建作品。',
    SERVER_UNAVAILABLE: '线上服务暂时不可用。请先确认作品是否已创建，稍后再试。',
    crop: '无法处理图片，请更换图片。',
    local: '无法在设备中保存图片或草稿。请检查剩余空间后重试。',
    queue: '无法保存待上传的图片。请检查设备存储空间后重试。',
    upload: '无法上传图片。请检查网络连接后重试。',
    create: '无法完成作品创建。请先检查账号中是否已有该作品。',
  },
  ja: {
    STORAGE_FULL: '端末に画像を保存する空き容量が不足しています。容量を確保して再試行してください。下書きが消える可能性があるため Shadow のサイトデータは削除しないでください。',
    IMAGE_SAVE_FAILED: 'この端末に画像を保存できませんでした。容量不足、またはブラウザーの問題が考えられます。空き容量を確認して画像を選び直してください。',
    STORAGE_BLOCKED: 'ブラウザーが画像の一時保存を許可していません。Chrome または通常のブラウザーで Shadow を開いて再試行してください。',
    STORAGE_INTERRUPTED: '画像の保存が中断されました。他の Shadow タブを閉じて再試行してください。下書きは削除しないでください。',
    IMAGE_TOO_LARGE: '画像のサイズが大きすぎます。画像を小さくして再試行してください。',
    IMAGE_UNREADABLE: '画像を開くことができません。別の JPG または PNG 画像をお試しください。',
    NETWORK_FAILED: '画像や作品をオンラインに送信できませんでした。通信を確認して再試行してください。下書きは削除しないでください。',
    LOGIN_REQUIRED: '同じアカウントに再ログインし、下書きを確認してから作品の作成を再試行してください。',
    SERVER_UNAVAILABLE: 'オンラインサービスが一時的に利用できません。作品が作成済みでないか確認してから、後ほどお試しください。',
    crop: '画像を処理できませんでした。別の画像をお試しください。',
    local: 'この端末に画像や下書きを保存できませんでした。空き容量を確認して再試行してください。',
    queue: '後でアップロードする画像を保存できませんでした。端末の空き容量を確認してください。',
    upload: '画像をオンラインに送信できませんでした。通信を確認して再試行してください。',
    create: '作品の作成を完了できませんでした。再試行する前にアカウント内の作品を確認してください。',
  },
  ko: {
    STORAGE_FULL: '기기에 이미지를 저장할 공간이 부족합니다. 공간을 확보한 뒤 다시 시도해 주세요. 초안이 삭제될 수 있으므로 Shadow 사이트 데이터는 지우지 마세요.',
    IMAGE_SAVE_FAILED: '이 기기에 이미지를 저장할 수 없습니다. 저장 공간이 부족하거나 브라우저에 문제가 있을 수 있습니다. 남은 공간을 확인하고 이미지를 다시 선택해 주세요.',
    STORAGE_BLOCKED: '브라우저가 임시 이미지 저장을 허용하지 않습니다. Chrome 또는 일반 브라우저에서 Shadow를 직접 열어 다시 시도해 주세요.',
    STORAGE_INTERRUPTED: '이미지 저장이 중단되었습니다. 다른 Shadow 탭을 닫고 다시 시도해 주세요. 초안은 삭제하지 마세요.',
    IMAGE_TOO_LARGE: '이미지 크기가 너무 커서 저장하거나 업로드할 수 없습니다. 크기를 줄여 다시 시도해 주세요.',
    IMAGE_UNREADABLE: '이 이미지를 열거나 읽을 수 없습니다. 다른 JPG 또는 PNG 이미지를 사용해 주세요.',
    NETWORK_FAILED: '이미지나 작품을 온라인으로 전송하지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요. 초안은 삭제하지 마세요.',
    LOGIN_REQUIRED: '같은 계정으로 다시 로그인하고 초안을 확인한 뒤 작품 만들기를 다시 시도해 주세요.',
    SERVER_UNAVAILABLE: '온라인 서비스에 일시적인 문제가 있습니다. 작품이 이미 만들어졌는지 확인하고 나중에 다시 시도해 주세요.',
    crop: '이미지를 준비할 수 없습니다. 다른 이미지를 사용해 주세요.',
    local: '이 기기에 이미지나 초안을 저장할 수 없습니다. 저장 공간을 확인하고 다시 시도해 주세요.',
    queue: '나중에 업로드할 이미지를 저장할 수 없습니다. 저장 공간을 확인하고 다시 시도해 주세요.',
    upload: '이미지를 온라인으로 전송하지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.',
    create: '작품 만들기를 완료하지 못했습니다. 다시 시도하기 전에 이미 작품이 있는지 확인해 주세요.',
  },
}

const RULES = [
  ['STORAGE_FULL', /QuotaExceededError|not enough (?:device|local) storage|insufficient (?:local |device )?storage|storage quota|out of (?:disk )?space|disk full/i],
  ['IMAGE_SAVE_FAILED', /InvalidBlob|failed to write blobs|DataCloneError/i],
  ['IMAGE_TOO_LARGE', /exceed(?:s|ed)? (?:the )?(?:5|60)\s*MB|too (?:large|big)|file size limit|maximum file size/i],
  ['IMAGE_UNREADABLE', /image[_ -](?:decode|source|blob|file|retry)|could not (?:read|decode|open).*image|invalid (?:story |local )?image|unsupported story image|HEIC_CONVERSION_FAILED|CANVAS_EXPORT_FAILED/i],
  ['STORAGE_BLOCKED', /SecurityError|NotAllowedError|private browsing|indexeddb.*(?:disabled|denied)|storage.*(?:disabled|denied|not allowed)/i],
  ['STORAGE_INTERRUPTED', /InvalidStateError|TransactionInactiveError|AbortError|local (?:story media|media storage).*fail|storage transaction failed|database (?:connection |is )?clos/i],
  ['NETWORK_FAILED', /failed to fetch|network error|offline|internet connection|connection timed? ?out|timed? ?out/i],
  ['LOGIN_REQUIRED', /unauthorized|sign in to the correct account|please sign in|token expired|HTTP 401/i],
  ['SERVER_UNAVAILABLE', /HTTP 50[0-9]|server (?:temporarily )?unavailable|bad gateway|service unavailable/i],
]

export function getStoryCreationUserError(error, stage = 'local') {
  const language = getDisplayLanguageId()
  const messages = MESSAGES[language] || MESSAGES.en
  const source = [error?.name, error?.code, error?.message || String(error || '')].filter(Boolean).join(' ').slice(0, 1200)
  const matched = RULES.find(([, pattern]) => pattern.test(source))
  const code = matched?.[0] || 'UNKNOWN'
  const phase = ['crop', 'local', 'queue', 'upload', 'create'].includes(stage) ? stage : 'local'
  return {
    code: code === 'UNKNOWN' ? `${phase.toUpperCase()}_FAILED` : code,
    message: messages[code] || messages[phase],
  }
}
