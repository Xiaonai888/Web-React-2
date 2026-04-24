export const completedTabs = ['Recent', 'Popular', 'Highlight']

export const completedQuotes = {
  Recent: 'Freshly completed stories ready to binge.',
  Popular: 'Most-read completed stories right now.',
  Highlight: 'Selected completed stories worth discovering.',
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
  cover: `/assets/Completed/Completed ${imageNumber}.jpg`,
  link: `/story/${id}`,
})

export const completedData = {
  Recent: [
    createBook(501, 1, 'Book name', 'Author name', '100k', '1000', 'Ep 17', '4.5', '887', ['Romance', 'Comedy', 'Fantasy', 'Action'], 'Ika is the only survivor of a genocide of humans by demons summoned from another universe and sent to wipe out life on his planet through a portal.', true),
    createBook(502, 2, 'Book name', 'Author name', '96k', '950', 'Ep 21', '4.6', '801', ['Romance', 'Drama', 'Fantasy'], 'A completed emotional story filled with mystery, love, and a final ending readers can enjoy without waiting.'),
    createBook(503, 3, 'Book name', 'Author name', '91k', '900', 'Ep 19', '4.4', '776', ['Action', 'Fantasy', 'Drama'], 'A finished adventure where every battle leads closer to the truth hidden behind the main character’s past.', true),
    createBook(504, 4, 'Book name', 'Author name', '88k', '870', 'Ep 24', '4.5', '742', ['Romance', 'Comedy'], 'A light but touching completed romance about two people who never expected to become each other’s home.'),
    createBook(505, 5, 'Book name', 'Author name', '84k', '830', 'Ep 22', '4.3', '690', ['Fantasy', 'Mystery'], 'A magical world, a dangerous secret, and one final choice that changes the fate of everyone.'),
    createBook(506, 6, 'Book name', 'Author name', '79k', '790', 'Ep 18', '4.4', '655', ['Drama', 'Romance'], 'A quiet completed story about family, regret, love, and the courage to move forward after pain.', true),
    createBook(507, 7, 'Book name', 'Author name', '74k', '720', 'Ep 20', '4.2', '612', ['Action', 'Adventure'], 'A fast-paced completed series with brave characters, dangerous missions, and a clean final arc.'),
    createBook(508, 8, 'Book name', 'Author name', '70k', '690', 'Ep 16', '4.3', '588', ['Romance', 'Slice of Life'], 'A soft completed romance built around small moments, missed chances, and honest feelings.'),
    createBook(509, 9, 'Book name', 'Author name', '66k', '650', 'Ep 15', '4.2', '540', ['Drama', 'Healing'], 'A slow emotional story about healing after loss and learning how to live again.', true),
  ],

  Popular: [
    createBook(510, 10, 'Book name', 'Author name', '320k', '4.8k', 'Ep 88', '4.9', '3.2k', ['Romance', 'Drama', 'Popular'], 'One of the most-read completed stories with strong characters, emotional tension, and a satisfying ending.', true),
    createBook(511, 11, 'Book name', 'Author name', '296k', '4.4k', 'Ep 76', '4.8', '2.9k', ['Fantasy', 'Adventure'], 'A popular completed fantasy story with a large world, powerful conflict, and a memorable final chapter.'),
    createBook(512, 12, 'Book name', 'Author name', '274k', '4.1k', 'Ep 72', '4.8', '2.7k', ['Action', 'Thriller'], 'A completed action story with high stakes, fast turns, and strong reader momentum.', true),
    createBook(513, 13, 'Book name', 'Author name', '250k', '3.8k', 'Ep 69', '4.7', '2.4k', ['Romance', 'Fantasy'], 'A reader-favorite completed romance fantasy with destiny, sacrifice, and emotional tension.'),
    createBook(514, 14, 'Book name', 'Author name', '232k', '3.5k', 'Ep 65', '4.7', '2.2k', ['Drama', 'Family'], 'A popular completed drama about secrets, regret, and the cost of choosing love too late.'),
    createBook(515, 15, 'Book name', 'Author name', '218k', '3.2k', 'Ep 61', '4.6', '2.0k', ['Fantasy', 'Action'], 'A completed fantasy action title that keeps readers moving from the first arc to the last.', true),
    createBook(516, 16, 'Book name', 'Author name', '204k', '3.0k', 'Ep 58', '4.6', '1.9k', ['Romance', 'Comedy'], 'A popular completed love story with playful tension, sweet moments, and a clean ending.'),
    createBook(517, 17, 'Book name', 'Author name', '190k', '2.7k', 'Ep 54', '4.5', '1.7k', ['Mystery', 'Drama'], 'A completed mystery drama with a steady build and a final twist that gives closure.'),
    createBook(518, 18, 'Book name', 'Author name', '176k', '2.5k', 'Ep 52', '4.5', '1.6k', ['Action', 'Adventure'], 'A strong completed adventure story with loyal readers and a satisfying final mission.', true),
  ],

  Highlight: [
    createBook(519, 19, 'Book name', 'Author name', '88k', '1.4k', 'Ep 47', '4.8', '980', ['Highlight', 'Romance', 'Drama'], 'A selected completed story with quiet emotional strength and a memorable ending.', true),
    createBook(520, 20, 'Book name', 'Author name', '83k', '1.3k', 'Ep 45', '4.7', '930', ['Fantasy', 'Highlight'], 'A highlighted fantasy title for readers who enjoy complete worlds and finished journeys.'),
    createBook(521, 21, 'Book name', 'Author name', '79k', '1.2k', 'Ep 43', '4.7', '890', ['Action', 'Drama'], 'A completed story selected for its strong emotional conflict and sharp action scenes.', true),
    createBook(522, 22, 'Book name', 'Author name', '74k', '1.1k', 'Ep 41', '4.6', '850', ['Romance', 'Slice of Life'], 'A soft highlighted romance with a calm mood, honest feelings, and a complete ending.'),
    createBook(523, 23, 'Book name', 'Author name', '70k', '1.0k', 'Ep 39', '4.6', '801', ['Mystery', 'Fantasy'], 'A hidden-gem completed story with mystery, atmosphere, and a final reveal worth reading.'),
    createBook(524, 24, 'Book name', 'Author name', '66k', '960', 'Ep 37', '4.5', '770', ['Drama', 'Healing'], 'A highlighted completed drama about rebuilding life after everything falls apart.', true),
    createBook(525, 25, 'Book name', 'Author name', '62k', '900', 'Ep 35', '4.5', '730', ['Romance', 'Fantasy'], 'A completed romance fantasy with soft tension, beautiful moments, and emotional closure.'),
    createBook(526, 26, 'Book name', 'Author name', '58k', '850', 'Ep 34', '4.4', '690', ['Action', 'Adventure'], 'A selected completed adventure with strong pacing and a full story arc from start to finish.'),
    createBook(527, 27, 'Book name', 'Author name', '54k', '790', 'Ep 32', '4.4', '650', ['Drama', 'Highlight'], 'A quiet hidden-gem completed story for readers who enjoy emotional endings and mature pacing.', true),
  ],
}
