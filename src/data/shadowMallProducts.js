export const shadowMallSlides = [
  { id: 1, badge: 'NEW', image: '/assets/ShadowMall/slide-1.jpg', title: 'Shadow Mall', subtitle: 'Official books from Shadow Era' },
  { id: 2, badge: 'HOT', image: '/assets/ShadowMall/slide-2.jpg', title: 'Khmer Novels', subtitle: 'Printed stories for your shelf' },
  { id: 3, badge: 'TOP', image: '/assets/ShadowMall/slide-3.jpg', title: 'Reader Picks', subtitle: 'Books selected for Shadow readers' },
  { id: 4, badge: 'NEW', image: '/assets/ShadowMall/slide-4.jpg', title: 'New Release', subtitle: 'Fresh books and upcoming titles' },
  { id: 5, badge: 'HOT', image: '/assets/ShadowMall/slide-5.jpg', title: 'Special Price', subtitle: 'Discount books when available' },
  { id: 6, badge: 'TOP', image: '/assets/ShadowMall/slide-6.jpg', title: 'Author Spotlight', subtitle: 'Featured authors and publishers' },
  { id: 7, badge: 'NEW', image: '/assets/ShadowMall/slide-7.jpg', title: 'Pre-order', subtitle: 'Reserve upcoming books early' },
]

export const shadowMallCategories = ['All', 'Khmer Novel', 'Romance', 'Discount', 'New Release', 'Pre-order']

export const shadowMallProducts = [
  {
    id: '1',
    title: 'គ្រោះព្រោះនិស្ស័យ',
    author: 'ពេជ្រ ជិន្នា',
    publisher: 'ពិភពសុបិន',
    cover: '/assets/ShadowMall/books/book-1.jpg',
    category: 'Khmer Novel',
    type: 'ប្រលោមលោកបែបខ្មែរ',
    genre: 'មនោសញ្ចេតនា',
    pages: '370 ទំព័រ',
    paperType: 'កាកអំពៅ',
    coverType: 'ក្របទន់បត់',
    condition: 'ថ្មី',
    originalPrice: 44000,
    salePrice: 36000,
    currency: 'KHR',
    badge: 'SALE',
    status: 'available',
    shortInfo: 'ប្រលោមលោកខ្មែរ បែបមនោសញ្ចេតនា កម្រាស់ 370 ទំព័រ ក្របទន់បត់ ក្រដាសកាកអំពៅ និងសៀវភៅថ្មី។',
    description: 'សៀវភៅនេះសម្រាប់អ្នកអានដែលចូលចិត្តប្រលោមលោកខ្មែរ បែបមនោសញ្ចេតនា មានព័ត៌មានពេញលេញសម្រាប់មើលមុនពេលកម្មង់។',
    fullDetails: [
      ['ប្រលោមលោកបែប', 'ខ្មែរ'],
      ['និពន្ធដោយ', 'ពេជ្រ ជិន្នា'],
      ['ចេញផ្សាយដោយ', 'ពិភពសុបិន'],
      ['ប្រភេទ', 'មនោសញ្ចេតនា'],
      ['កម្រាស់', '370 ទំព័រ'],
      ['ប្រភេទក្រដាស', 'កាកអំពៅ'],
      ['ក្រប', 'ក្របទន់បត់'],
      ['គុណភាព', 'ថ្មី'],
      ['តម្លៃដើម', '44,000៛'],
      ['តម្លៃលក់', '36,000៛'],
    ],
  },
]

export function formatMallPrice(value, currency = 'KHR') {
  const amount = Number(value || 0)

  if (currency === 'USD') return `$${amount.toFixed(2)}`

  return `${amount.toLocaleString('en-US')}៛`
}

export function getShadowMallProductById(productId) {
  return shadowMallProducts.find((product) => String(product.id) === String(productId)) || null
}
