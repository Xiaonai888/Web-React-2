import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('bookOrderChatNotices', {
  en: { title: 'Book order updates', open: 'Book order notifications', close: 'Close', payment_verified: 'Book payment verified', book_shipped: 'Book shipped', reader_received: 'Reader confirmed receipt', owner_released: 'Owner released payment', refunded: 'Book order refunded', empty: 'No book order updates.', loading: 'Loading updates…', retry: 'Retry', more: 'Load 10 more', refresh: 'Refresh', read: 'Read', unread: 'New', viewOrder: 'View order', error: 'Could not load book order updates', count: 'new updates', saving: 'Saving…' },
  km: { title: 'ដំណឹងការបញ្ជាទិញសៀវភៅ', open: 'បើកមើលដំណឹងសៀវភៅ', close: 'បិទ', payment_verified: 'ការទូទាត់សៀវភៅបានបញ្ជាក់', book_shipped: 'សៀវភៅបានផ្ញើចេញ', reader_received: 'អ្នកអានបានបញ្ជាក់ទទួលសៀវភៅ', owner_released: 'Owner បានអនុម័តដោះលែងប្រាក់', refunded: 'បានសងប្រាក់ការបញ្ជាទិញវិញ', empty: 'មិនទាន់មានដំណឹងសៀវភៅ។', loading: 'កំពុងផ្ទុកដំណឹង…', retry: 'ព្យាយាមម្ដងទៀត', more: 'ផ្ទុក ១០ ទៀត', refresh: 'ផ្ទុកឡើងវិញ', read: 'បានអាន', unread: 'ថ្មី', viewOrder: 'មើលការបញ្ជាទិញ', error: 'មិនអាចផ្ទុកដំណឹងបានទេ', count: 'ដំណឹងថ្មី', saving: 'កំពុងរក្សាទុក…' },
  zh: { title: '图书订单通知', open: '查看图书订单通知', close: '关闭', payment_verified: '图书付款已核实', book_shipped: '图书已发货', reader_received: '读者已确认收货', owner_released: '管理员已批准释放款项', refunded: '图书订单已退款', empty: '暂无图书订单通知。', loading: '正在加载…', retry: '重试', more: '再加载10条', refresh: '刷新', read: '已读', unread: '新', viewOrder: '查看订单', error: '无法加载订单通知', count: '条新通知', saving: '保存中…' },
  ja: { title: '書籍注文のお知らせ', open: '書籍注文通知を開く', close: '閉じる', payment_verified: '書籍代金の支払いを確認', book_shipped: '書籍を発送しました', reader_received: '読者が受取を確認', owner_released: '管理者が支払いを承認', refunded: '書籍注文を返金しました', empty: '新しいお知らせはありません。', loading: '読み込み中…', retry: '再試行', more: 'さらに10件を表示', refresh: '更新', read: '既読', unread: '新着', viewOrder: '注文を見る', error: '通知を読み込めません', count: '件の新着', saving: '保存中…' },
  ko: { title: '도서 주문 알림', open: '도서 주문 알림 열기', close: '닫기', payment_verified: '도서 결제 확인됨', book_shipped: '도서 배송 시작', reader_received: '독자 수령 확인', owner_released: '관리자가 대금 지급 승인', refunded: '도서 주문 환불됨', empty: '새로운 도서 주문 알림이 없습니다.', loading: '알림 불러오는 중…', retry: '다시 시도', more: '10개 더 보기', refresh: '새로고침', read: '읽음', unread: '새 알림', viewOrder: '주문 보기', error: '도서 알림을 불러오지 못했습니다', count: '개 새 알림', saving: '저장 중…' },
})

export function useBookOrderChatNoticeText() {
  const { t } = useDisplayTranslation()
  return (key) => t(`bookOrderChatNotices.${key}`)
}

export function bookOrderNoticeLocale() {
  const language = getDisplayLanguageId()
  return ({ km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' })[language] || 'en-US'
}
