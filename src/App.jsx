import { useEffect, useMemo, useState } from 'react'
import './App.css'

const movies = [
  {
    id: 'afterlight',
    title: 'Afterlight',
    genre: 'Sci-Fi',
    year: 2026,
    rating: '8.7',
    duration: '2h 08m',
    poster:
      'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=700&q=85',
    description:
      'In a city that never sees the sun, a signal from beyond the stars gives one young engineer a reason to look up.',
    label: 'NOW SHOWING',
  },
  {
    id: 'the-last-signal',
    title: 'The Last Signal',
    genre: 'Thriller',
    year: 2026,
    rating: '8.3',
    duration: '1h 54m',
    poster:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85',
    description:
      'A remote radio operator hears a voice that should not exist—and has one night to discover who is calling.',
    label: 'NEW RELEASE',
  },
  {
    id: 'velvet-sky',
    title: 'Velvet Sky',
    genre: 'Drama',
    year: 2025,
    rating: '8.1',
    duration: '2h 01m',
    poster:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=85',
    description:
      'Two strangers meet on the last train home and find their lives changing before the night is over.',
    label: 'CRITICS’ PICK',
  },
  {
    id: 'wild-country',
    title: 'Wild Country',
    genre: 'Adventure',
    year: 2026,
    rating: '7.9',
    duration: '2h 16m',
    poster:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=85',
    description:
      'A cartographer and a runaway set out across the wilderness to find a place neither can call home.',
    label: 'NOW SHOWING',
  },
  {
    id: 'red-echo',
    title: 'Red Echo',
    genre: 'Thriller',
    year: 2025,
    rating: '7.8',
    duration: '1h 48m',
    poster:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=85',
    description:
      'After returning to her childhood home, a sound designer uncovers a mystery hidden in its walls.',
    label: 'LIMITED RUN',
  },
  {
    id: 'little-comets',
    title: 'Little Comets',
    genre: 'Drama',
    year: 2026,
    rating: '8.5',
    duration: '1h 42m',
    poster:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=700&q=85',
    description:
      'A brother and sister build a tiny planetarium and discover a universe of their own.',
    label: 'COMING SOON',
  },
]

const genres = ['All films', 'Sci-Fi', 'Thriller', 'Drama', 'Adventure']
const showtimes = ['12:30 PM', '3:45 PM', '6:15 PM', '9:00 PM']

function readSavedArray(key) {
  try {
    const savedValue = window.localStorage.getItem(key)
    const parsedValue = savedValue ? JSON.parse(savedValue) : []
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error)
    return []
  }
}

function MovieCard({ movie, isFavorite, onFavorite, onDetails, onBook }) {
  return (
    <article className="movie-card">
      <button
        className="poster-button"
        type="button"
        onClick={() => onDetails(movie)}
        aria-label={`View details for ${movie.title}`}
      >
        <img className="movie-poster" src={movie.poster} alt={`${movie.title} poster`} />
        <span className="poster-label">{movie.label}</span>
        <span className="poster-view">View film</span>
      </button>
      <div className="movie-card-info">
        <div className="movie-title-line">
          <div>
            <h3>{movie.title}</h3>
            <p>{movie.genre} <span aria-hidden="true">·</span> {movie.duration}</p>
          </div>
          <span className="movie-rating" aria-label={`Rating ${movie.rating} out of 10`}>
            <span aria-hidden="true">★</span> {movie.rating}
          </span>
        </div>
        <div className="movie-card-actions">
          <button className="text-button" type="button" onClick={() => onDetails(movie)}>
            Details
          </button>
          <button
            className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
            type="button"
            onClick={() => onFavorite(movie.id)}
            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${movie.title} ${isFavorite ? 'from' : 'to'} favorites`}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '♥ Saved' : '♡ Save'}
          </button>
          <button className="card-book-button" type="button" onClick={() => onBook(movie)}>
            Tickets
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All films')
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState(() => readSavedArray('frame-favorites'))
  const [bookings, setBookings] = useState(() => readSavedArray('frame-bookings'))
  const [activeMovie, setActiveMovie] = useState(null)
  const [bookingMovie, setBookingMovie] = useState(null)
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10))
  const [bookingTime, setBookingTime] = useState(showtimes[2])
  const [ticketCount, setTicketCount] = useState('2')
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem('frame-favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Could not save favorites to local storage.', error)
    }
  }, [favorites])

  useEffect(() => {
    try {
      window.localStorage.setItem('frame-bookings', JSON.stringify(bookings))
    } catch (error) {
      console.error('Could not save bookings to local storage.', error)
    }
  }, [bookings])

  const featuredMovie = movies[0]
  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(normalizedSearch) ||
        movie.genre.toLowerCase().includes(normalizedSearch)
      const matchesGenre = selectedGenre === 'All films' || movie.genre === selectedGenre
      const matchesFavorites = !showFavorites || favorites.includes(movie.id)

      return matchesSearch && matchesGenre && matchesFavorites
    })
  }, [favorites, searchText, selectedGenre, showFavorites])

  function toggleFavorite(movieId) {
    setFavorites((savedFavorites) =>
      savedFavorites.includes(movieId)
        ? savedFavorites.filter((id) => id !== movieId)
        : [...savedFavorites, movieId],
    )
  }

  function openBooking(movie) {
    setBookingMovie(movie)
    setBookingMessage('')
  }

  function confirmBooking(event) {
    event.preventDefault()

    const newBooking = {
      id: `${Date.now()}`,
      movieTitle: bookingMovie.title,
      date: bookingDate,
      time: bookingTime,
      tickets: Number(ticketCount),
    }

    setBookings((savedBookings) => [...savedBookings, newBooking])
    setBookingMessage(
      `${ticketCount} ${Number(ticketCount) === 1 ? 'ticket' : 'tickets'} reserved for ${bookingMovie.title}.`,
    )
    setBookingMovie(null)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="FRAME home">
          FRAME<span className="wordmark-period">.</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#films">Now showing</a>
          <a href="#experience">Our experience</a>
        </nav>
        <button
          className={`header-favorites${showFavorites ? ' active' : ''}`}
          type="button"
          onClick={() => {
            setShowFavorites((showing) => !showing)
            document.getElementById('films')?.scrollIntoView({ behavior: 'smooth' })
          }}
          aria-pressed={showFavorites}
        >
          <span aria-hidden="true">♡</span> My list
          {favorites.length > 0 && <span className="favorite-count">{favorites.length}</span>}
        </button>
      </header>

      <main id="home">
        <section className="featured">
          <div className="featured-image" role="img" aria-label="Star-filled night sky" />
          <div className="featured-shade" />
          <div className="featured-content">
            <p className="eyebrow"><span /> THE FRAME PREMIERE</p>
            <h1>Stories that<br />stay with you.</h1>
            <p className="featured-copy">
              Discover {featuredMovie.title}, a breathtaking new story made for the big screen.
            </p>
            <div className="featured-meta">
              <span>{featuredMovie.genre}</span><span>{featuredMovie.duration}</span>
              <span className="featured-rating">★ {featuredMovie.rating}</span>
            </div>
            <div className="featured-actions">
              <button className="primary-button" type="button" onClick={() => openBooking(featuredMovie)}>
                Book your seats <span aria-hidden="true">↗</span>
              </button>
              <button className="ghost-button" type="button" onClick={() => setActiveMovie(featuredMovie)}>
                Explore film
              </button>
            </div>
          </div>
          <div className="featured-caption">
            <span>01 — FEATURED FILM</span><span>THE ART OF THE BIG SCREEN</span>
          </div>
        </section>

        <section className="films-section" id="films">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-eyebrow">YOUR NEXT GREAT STORY</p>
              <h2>Now showing<span className="wordmark-period">.</span></h2>
            </div>
            <label className="search-box">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search films"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                aria-label="Search films"
              />
              <kbd>⌘ K</kbd>
            </label>
          </div>

          <div className="film-filters" aria-label="Filter films">
            {genres.map((genre) => (
              <button
                className={`filter-button${selectedGenre === genre ? ' selected' : ''}`}
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                aria-pressed={selectedGenre === genre}
              >
                {genre}
              </button>
            ))}
            <span className="film-count">{filteredMovies.length} films</span>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={favorites.includes(movie.id)}
                  onFavorite={toggleFavorite}
                  onDetails={setActiveMovie}
                  onBook={openBooking}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>{showFavorites ? 'Your list is waiting.' : 'No films found.'}</h3>
              <p>
                {showFavorites
                  ? 'Save a film with the heart button and it will appear here.'
                  : 'Try a different title or choose another genre.'}
              </p>
              {showFavorites && (
                <button className="text-button" type="button" onClick={() => setShowFavorites(false)}>
                  Browse all films
                </button>
              )}
            </div>
          )}
        </section>

        <section className="experience-section" id="experience">
          <div className="experience-mark" aria-hidden="true">F<span>.</span></div>
          <div>
            <p className="eyebrow section-eyebrow">MORE THAN A MOVIE</p>
            <h2>Make a night<br />of it.</h2>
          </div>
          <p className="experience-copy">
            Thoughtful details, the perfect picture, and sound that pulls you in. Welcome to
            cinema as it should be.
          </p>
          <a href="#films" className="experience-link">Find your next film <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">FRAME<span className="wordmark-period">.</span></a>
        <span>MADE FOR THE LOVE OF FILM</span>
        <span>© 2026 FRAME CINEMA</span>
      </footer>

      {activeMovie && (
        <div className="modal-backdrop" onClick={() => setActiveMovie(null)}>
          <section
            className="movie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="movie-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setActiveMovie(null)} aria-label="Close film details">
              ×
            </button>
            <img className="modal-poster" src={activeMovie.poster} alt="" />
            <div className="modal-content">
              <p className="eyebrow section-eyebrow">{activeMovie.label}</p>
              <h2 id="movie-modal-title">{activeMovie.title}</h2>
              <p className="modal-meta">{activeMovie.year} <span>·</span> {activeMovie.genre} <span>·</span> {activeMovie.duration} <span>·</span> ★ {activeMovie.rating}</p>
              <p className="modal-description">{activeMovie.description}</p>
              <button className="primary-button" type="button" onClick={() => {
                const movieToBook = activeMovie
                setActiveMovie(null)
                openBooking(movieToBook)
              }}>
                Book tickets <span aria-hidden="true">↗</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {bookingMovie && (
        <div className="modal-backdrop" onClick={() => setBookingMovie(null)}>
          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setBookingMovie(null)} aria-label="Close booking">
              ×
            </button>
            <p className="eyebrow section-eyebrow">YOUR FRAME EVENING</p>
            <h2 id="booking-modal-title">Book tickets<span className="wordmark-period">.</span></h2>
            <p className="booking-film-title">{bookingMovie.title} <span>· {bookingMovie.duration}</span></p>
            <form className="booking-form" onSubmit={confirmBooking}>
              <label>
                Date
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => setBookingDate(event.target.value)}
                  required
                />
              </label>
              <label>
                Showtime
                <select value={bookingTime} onChange={(event) => setBookingTime(event.target.value)}>
                  {showtimes.map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
              <label>
                Tickets
                <select value={ticketCount} onChange={(event) => setTicketCount(event.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>{count} {count === 1 ? 'ticket' : 'tickets'}</option>
                  ))}
                </select>
              </label>
              <button className="primary-button booking-submit" type="submit">
                Confirm reservation <span aria-hidden="true">↗</span>
              </button>
              <p className="booking-note">Demo reservation — no payment is taken.</p>
            </form>
          </section>
        </div>
      )}

      {bookingMessage && (
        <div className="toast-message" role="status">
          <span aria-hidden="true">✓</span> {bookingMessage}
          <button type="button" onClick={() => setBookingMessage('')} aria-label="Dismiss confirmation">×</button>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {bookings.length > 0 ? `${bookings.length} reservation${bookings.length === 1 ? '' : 's'} saved.` : ''}
      </span>
    </div>
  )
}

export default App
