export const completedTabs = ['Hot', 'Romance', 'Fantasy', 'Action', 'Drama']

export const completedQuotes = {
  Hot: '🔥 The most-read completed stories right now.',
  Romance: '💕 Love stories with satisfying endings await you.',
  Fantasy: '🧙 Epic worlds fully explored and concluded.',
  Action: '⚔️ Thrilling adventures from start to finish.',
  Drama: '🎭 Emotional journeys that will stay with you.',
}

const createBook = (
  id,
  imageNumber,
  title,
  author,
  views,
  likes,
  episodes,
  rating,
  ratingCount,
  genres,
  description,
  freePreview = false
) => ({
  id,
  title,
  author,
  views,
  likes,
  episodes,
  rating,
  ratingCount,
  genres,
  description,
  freePreview,
  cover: `/assets/Must Read pic/Must Read ${imageNumber}.jpg`,
  link: `/story/${id}`,
})

export const completedData = {
  Hot: [
    createBook(501, 1, 'Name Book', 'Author Name', '210k', '2.4k', 'Ep 82', '4.9', '3.2k', ['Romance', 'Fantasy', 'Drama'], 'A breathtaking story of love and sacrifice that spans across kingdoms and centuries. Every page reveals a new layer of mystery.', true),
    createBook(502, 2, 'Name Book', 'Author Name', '196k', '2.1k', 'Ep 74', '4.8', '2.9k', ['Action', 'Adventure'], 'Two unlikely heroes must unite against an ancient darkness threatening to consume their world forever.'),
    createBook(503, 3, 'Name Book', 'Author Name', '182k', '1.9k', 'Ep 68', '4.8', '2.7k', ['Fantasy', 'Drama'], 'Magic, betrayal, and an unbreakable bond — this completed epic will leave you speechless.', true),
    createBook(504, 4, 'Name Book', 'Author Name', '170k', '1.7k', 'Ep 61', '4.7', '2.5k', ['Romance', 'Drama'], 'A slow-burn romance between rivals who discover they need each other more than they ever imagined.'),
    createBook(505, 5, 'Name Book', 'Author Name', '158k', '1.5k', 'Ep 55', '4.7', '2.3k', ['Action', 'Fantasy'], 'The fate of the realm rests on one warrior\'s shoulders in this stunning complete saga.'),
    createBook(506, 6, 'Name Book', 'Author Name', '145k', '1.3k', 'Ep 49', '4.6', '2.0k', ['Drama', 'Romance'], 'Family secrets, forbidden love, and second chances make this an unforgettable read.', true),
  ],
  Romance: [
    createBook(507, 1, 'Name Book', 'Author Name', '190k', '2.2k', 'Ep 78', '4.9', '3.0k', ['Romance', 'Drama'], 'A whirlwind romance between a cold CEO and a bright-eyed florist who changes his world completely.', true),
    createBook(508, 2, 'Name Book', 'Author Name', '175k', '2.0k', 'Ep 70', '4.8', '2.8k', ['Romance', 'Fantasy'], 'Destined soulmates torn apart by time must find each other again across different lifetimes.'),
    createBook(509, 3, 'Name Book', 'Author Name', '162k', '1.8k', 'Ep 64', '4.8', '2.6k', ['Romance', 'Comedy'], 'A hilarious enemies-to-lovers story that proves opposites really do attract in the most unexpected ways.', true),
    createBook(510, 4, 'Name Book', 'Author Name', '148k', '1.6k', 'Ep 58', '4.7', '2.4k', ['Romance'], 'Second chances and old flames — can two people rewrite the ending they never got?'),
    createBook(511, 5, 'Name Book', 'Author Name', '136k', '1.4k', 'Ep 52', '4.7', '2.2k', ['Romance', 'Drama'], 'A secret marriage arrangement turns into the greatest love story neither expected.'),
    createBook(512, 6, 'Name Book', 'Author Name', '124k', '1.2k', 'Ep 46', '4.6', '2.0k', ['Romance', 'Fantasy'], 'A princess and her sworn protector battle between duty and desire in this sweeping romance.', true),
  ],
  Fantasy: [
    createBook(513, 1, 'Name Book', 'Author Name', '205k', '2.3k', 'Ep 90', '4.9', '3.1k', ['Fantasy', 'Adventure'], 'A young mage discovers her true power just as the ancient dark god stirs from his thousand-year slumber.', true),
    createBook(514, 2, 'Name Book', 'Author Name', '188k', '2.1k', 'Ep 84', '4.8', '2.8k', ['Fantasy', 'Action'], 'Dragons, prophecies, and a reluctant hero — this complete fantasy epic is everything fans dreamed of.'),
    createBook(515, 3, 'Name Book', 'Author Name', '174k', '1.9k', 'Ep 76', '4.8', '2.7k', ['Fantasy', 'Drama'], 'The last surviving royal must reclaim her stolen throne from the shadows of a crumbling empire.', true),
    createBook(516, 4, 'Name Book', 'Author Name', '160k', '1.7k', 'Ep 68', '4.7', '2.5k', ['Fantasy', 'Romance'], 'An immortal fae and a mortal girl find themselves bound by a curse older than the stars.'),
    createBook(517, 5, 'Name Book', 'Author Name', '147k', '1.5k', 'Ep 62', '4.7', '2.3k', ['Fantasy'], 'Magic academies, deadly tournaments, and secrets that could shatter the world — fully completed!'),
    createBook(518, 6, 'Name Book', 'Author Name', '133k', '1.3k', 'Ep 54', '4.6', '2.1k', ['Fantasy', 'Mystery'], 'A detective in a city where magic is illegal uncovers a conspiracy that runs deeper than anyone imagined.', true),
  ],
  Action: [
    createBook(519, 1, 'Name Book', 'Author Name', '198k', '2.2k', 'Ep 86', '4.9', '3.0k', ['Action', 'Thriller'], 'An elite assassin goes rogue after discovering the organization he served has been lying to him all along.', true),
    createBook(520, 2, 'Name Book', 'Author Name', '183k', '2.0k', 'Ep 80', '4.8', '2.8k', ['Action', 'Adventure'], 'A team of unlikely warriors must cross enemy territory to prevent an all-out war from devastating their homeland.'),
    createBook(521, 3, 'Name Book', 'Author Name', '169k', '1.8k', 'Ep 72', '4.8', '2.6k', ['Action', 'Fantasy'], 'The strongest fighter in the land must face not just enemies outside but the darkness growing within him.', true),
    createBook(522, 4, 'Name Book', 'Author Name', '155k', '1.6k', 'Ep 66', '4.7', '2.4k', ['Action', 'Drama'], 'Betrayed and left for dead, one soldier rises from nothing to dismantle the empire that destroyed him.'),
    createBook(523, 5, 'Name Book', 'Author Name', '141k', '1.4k', 'Ep 58', '4.7', '2.2k', ['Action', 'Romance'], 'High-octane chase sequences and unexpected romance make this action thriller impossible to put down.'),
    createBook(524, 6, 'Name Book', 'Author Name', '127k', '1.2k', 'Ep 50', '4.6', '2.0k', ['Action'], 'Six warriors. One mission. Zero chances of failure — or so they thought.', true),
  ],
  Drama: [
    createBook(525, 1, 'Name Book', 'Author Name', '177k', '2.0k', 'Ep 74', '4.9', '2.9k', ['Drama', 'Family'], 'A family torn apart by a long-buried secret must find their way back to each other before it is too late.', true),
    createBook(526, 2, 'Name Book', 'Author Name', '163k', '1.8k', 'Ep 68', '4.8', '2.7k', ['Drama', 'Romance'], 'Two childhood friends reunite after ten years apart and must face feelings they never had courage to confess.'),
    createBook(527, 3, 'Name Book', 'Author Name', '149k', '1.6k', 'Ep 60', '4.8', '2.5k', ['Drama', 'Healing'], 'A grieving musician rediscovers the joy of life through the warmth of an unexpected community.', true),
    createBook(528, 4, 'Name Book', 'Author Name', '136k', '1.4k', 'Ep 54', '4.7', '2.3k', ['Drama'], 'When a truth that could destroy everything comes to light, one woman must choose between love and justice.'),
    createBook(529, 5, 'Name Book', 'Author Name', '122k', '1.2k', 'Ep 48', '4.7', '2.1k', ['Drama', 'Comedy'], 'Life, laughter, and loss — this heartwarming drama captures the full spectrum of human experience beautifully.'),
    createBook(530, 6, 'Name Book', 'Author Name', '109k', '1.0k', 'Ep 42', '4.6', '1.9k', ['Drama', 'Romance'], 'A letter written ten years too late sets off a chain of events that changes five lives forever.', true),
  ],
}

