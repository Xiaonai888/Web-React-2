const EN = {
  review: 'Review', translate: 'AI Translate', wordCount: 'Word Count', readAloud: 'Read Aloud', aiReadAloud: 'AI Read Aloud',
  spellCheck: 'Spell Check', insertComment: 'Insert Comment', showComments: 'Show Comments', trackChanges: 'Track Changes',
  showRevisions: 'Show Revisions', showMarkup: 'Show Markup', changeUserName: 'Change User Name',
  back: 'Back', save: 'Save', stop: 'Stop reading', words: 'Words', characters: 'Characters', paragraphs: 'Paragraphs', sentences: 'Sentences',
  reviewName: 'Reviewer name', noChanges: 'No tracked revisions in this chapter.', noText: 'There is no text to read.',
  notAvailable: 'AI translation needs a connected translation service.', speechUnavailable: 'Read Aloud is unavailable on this device.',
  localVoice: 'Using your device voice.', selectText: 'Select text first or use the whole chapter.',
  added: 'Saved on this device.', changes: 'Tracked changes', commentMarks: 'Comment marks',
  previous: 'Previous', next: 'Next', typeInsert: 'Inserted', typeDelete: 'Deleted',
}

const KM = {
  review: 'ពិនិត្យ', translate: 'AI បកប្រែ', wordCount: 'រាប់ពាក្យ', readAloud: 'អានជាសំឡេង', aiReadAloud: 'AI អានជាសំឡេង',
  spellCheck: 'ពិនិត្យអក្ខរាវិរុទ្ធ', insertComment: 'បញ្ចូលមតិ', showComments: 'បង្ហាញមតិ', trackChanges: 'តាមដានការកែប្រែ',
  showRevisions: 'មើលការកែប្រែ', showMarkup: 'បង្ហាញសញ្ញាកែប្រែ', changeUserName: 'ប្តូរឈ្មោះអ្នកកែ',
  back: 'ត្រឡប់', save: 'រក្សាទុក', stop: 'បញ្ឈប់ការអាន', words: 'ពាក្យ', characters: 'តួអក្សរ', paragraphs: 'កថាខណ្ឌ', sentences: 'ប្រយោគ',
  reviewName: 'ឈ្មោះអ្នកពិនិត្យ', noChanges: 'មិនមានការកែប្រែដែលបានកត់ត្រាទេ។', noText: 'គ្មានអត្ថបទសម្រាប់អាន។',
  notAvailable: 'AI បកប្រែត្រូវការភ្ជាប់សេវាបកប្រែជាមុន។', speechUnavailable: 'ឧបករណ៍នេះមិនគាំទ្រការអានជាសំឡេងទេ។',
  localVoice: 'កំពុងប្រើសំឡេងពីឧបករណ៍។', selectText: 'ជ្រើសអត្ថបទ ឬប្រើអត្ថបទទាំងមូល។',
  added: 'រក្សាទុកនៅលើឧបករណ៍រួច។', changes: 'ការកែប្រែ', commentMarks: 'សញ្ញាមតិ',
  previous: 'មុន', next: 'បន្ទាប់', typeInsert: 'បញ្ចូល', typeDelete: 'លុប',
}

const ZH = { review: '审阅', translate: 'AI 翻译', wordCount: '字数统计', readAloud: '朗读', aiReadAloud: 'AI 朗读', spellCheck: '拼写检查', insertComment: '插入批注', showComments: '显示批注', trackChanges: '修订模式', showRevisions: '查看修订', showMarkup: '显示标记', changeUserName: '更改用户名', back: '返回', save: '保存', stop: '停止朗读', words: '词数', characters: '字符', paragraphs: '段落', sentences: '句子', reviewName: '审阅者姓名', noChanges: '此章节暂无修订。', noText: '没有可朗读的文字。', notAvailable: 'AI 翻译需要连接翻译服务。', speechUnavailable: '此设备不支持朗读。', localVoice: '正在使用设备语音。', selectText: '请先选择文字或使用整章。', added: '已保存到此设备。', changes: '修订', commentMarks: '批注标记', previous: '上一个', next: '下一个', typeInsert: '插入', typeDelete: '删除' }
const KO = { review: '검토', translate: 'AI 번역', wordCount: '단어 수', readAloud: '소리 내어 읽기', aiReadAloud: 'AI 읽어주기', spellCheck: '맞춤법 검사', insertComment: '댓글 삽입', showComments: '댓글 표시', trackChanges: '변경 내용 추적', showRevisions: '수정 내역 보기', showMarkup: '표시 내용 보기', changeUserName: '사용자 이름 변경', back: '뒤로', save: '저장', stop: '읽기 중지', words: '단어', characters: '문자', paragraphs: '문단', sentences: '문장', reviewName: '검토자 이름', noChanges: '이 장에는 추적된 수정이 없습니다.', noText: '읽을 텍스트가 없습니다.', notAvailable: 'AI 번역 서비스 연결이 필요합니다.', speechUnavailable: '이 기기는 음성 읽기를 지원하지 않습니다.', localVoice: '기기 음성을 사용합니다.', selectText: '텍스트를 선택하거나 전체 장을 사용하세요.', added: '기기에 저장했습니다.', changes: '수정 내역', commentMarks: '댓글 표시', previous: '이전', next: '다음', typeInsert: '삽입', typeDelete: '삭제' }
const JA = { review: '校閲', translate: 'AI 翻訳', wordCount: '文字数', readAloud: '読み上げ', aiReadAloud: 'AI 読み上げ', spellCheck: 'スペルチェック', insertComment: 'コメントを挿入', showComments: 'コメントを表示', trackChanges: '変更履歴の記録', showRevisions: '変更履歴を表示', showMarkup: '変更履歴の表示', changeUserName: 'ユーザー名を変更', back: '戻る', save: '保存', stop: '読み上げ停止', words: '単語', characters: '文字', paragraphs: '段落', sentences: '文', reviewName: '校閲者名', noChanges: 'この章に変更履歴はありません。', noText: '読み上げるテキストがありません。', notAvailable: 'AI 翻訳には翻訳サービスの接続が必要です。', speechUnavailable: 'この端末では読み上げできません。', localVoice: '端末の音声を使用中です。', selectText: 'テキストを選択するか章全体を使用してください。', added: '端末に保存しました。', changes: '変更履歴', commentMarks: 'コメント位置', previous: '前へ', next: '次へ', typeInsert: '挿入', typeDelete: '削除' }

const LABELS = Object.freeze({ en: EN, km: KM, zh: ZH, ko: KO, ja: JA })

export function getShadowDocsReviewLanguage(language) {
  const code = String(language || 'en').toLowerCase().split('-')[0]
  return { ...EN, ...(LABELS[code] || {}) }
}

export function getShadowDocsReviewSpeechLocale(language) {
  return ({ en: 'en-US', km: 'km-KH', zh: 'zh-CN', ko: 'ko-KR', ja: 'ja-JP' })[String(language || 'en').toLowerCase().split('-')[0]] || 'en-US'
}
