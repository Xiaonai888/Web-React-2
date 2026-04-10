import { Link } from 'react-router-dom'

function SubscriptionBookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="overflow-hidden rounded-2xl bg-[#efefef] shadow-sm">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      </div>

      <div className="pt-2.5">
        <h4 className="line-clamp-1 text-[12px] font-extrabold tracking-tight text-[#111] sm:text-[13px]">
          {book.title}
        </h4>
        <p className="mt-1 text-[10px] font-medium text-[#8d8d8d] sm:text-[11px]">
          {book.info}
        </p>
      </div>
    </Link>
  )
}

export default function SubscriptionsSection({
  title = 'Your Subscriptions',
  books = [],
  seeAllTo = '/subscriptions',
}) {
  if (!books.length) return null

  return (
    <section className="pt-7">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-extrabold tracking-tight text-[#111]">
          {title}
        </h3>

        <Link
          to={seeAllTo}
          className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#ff3b5c] transition hover:opacity-80"
        >
          See All
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-4 md:gap-y-0">
        {books.map((book) => (
          <SubscriptionBookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
