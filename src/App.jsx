import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const OTP_CODE = '200026'
const READ_SECONDS = 5 * 60

const LETTER_PAGES = [
  {
    label: 'LEMBAR 01',
    highlight: 'Aku menghargai keberanian Mb Reza untuk jujur dan semua effort yang sudah Mb lakukan untuk menyampaikan itu.',
    paragraphs: [
      [{ text: 'Dear Mb Reza,', bold: true }],
      [{ text: 'Hallo Mb, gimana hari ini? Semoga Mb Reza selalu semangat menjalani hari ya.' }],
      [{ text: 'Oh iya Mb, sebenarnya aku udah cukup lama pengin nulis ini. Anggap aja ini sebagai balasan dari surat yang Mb Reza kasih ke aku waktu itu. Jujur aku sempat bingung harus menyampaikannya seperti apa, karena aku pengin jujur, tapi di sisi lain aku juga nggak mau apa yang aku sampaikan justru membuat Mb Reza merasa sedih atau nggak nyaman.' }],
      [{ text: 'Sebenarnya sekitar bulan Juli, aku sudah mulai merasa kalau mungkin Mb Reza punya rasa yang sedikit berbeda ke aku. Bulan Juli tuh jadi salah satu bulan yang menurutku paling seru dan banyak ceritanya selama aku di Kingkong. Bulan itu juga aku mulai merasa makin klop dan nyaman berteman sama kalian.' }],
      [{ text: 'Pas waktu itu aku sempat merasa ada sesuatu yang berbeda dari cara Mb Reza ke aku. Kayak di rumah Mb Wiwik itu pun aku juga udah merasa, Mb.' }],
      [{ text: 'Sampai akhirnya waktu Mb Reza mau resign dan tiba-tiba kasih surat itu ke aku.' }],
      [
        { text: 'Jujur, aku cukup ' },
        { text: 'SYOK', bold: true },
        { text: ' waktu bacanya. Aku benar-benar nggak menyangka. Tapi terlepas dari semuanya, aku tetap mau bilang terima kasih, Mb. Aku menghargai keberanian Mb Reza untuk jujur dan juga semua effort yang sudah Mb lakukan untuk menyampaikan itu.' }
      ],
      [{ text: 'Sebenere setelah Mb Reza resign, aku juga sudah sempat buat balasan untuk surat itu, tinggal deploy dan kirim aja. Tapi akhirnya aku urungkan karena aku masih takut salah menyampaikan dan malah membuat Mb Reza merasa nggak enak.' }],
      [{ text: 'Jadi mungkin baru sekarang aku berani menyampaikannya dengan lebih jelas.' }],
      [{ text: 'Maaf ya Mb, aku juga mau jujur tentang apa yang aku rasakan. Dari cukup lama, aku memang belum punya keinginan untuk menjalin hubungan ataupun punya rasa khusus ke seseorang. Untuk sekarang aku masih memegang komitmen itu dan ingin fokus dengan banyak hal yang ingin aku jalani dan kejar terlebih dahulu.' }]
    ]
  },
  {
    label: 'LEMBAR 02',
    highlight: 'Aku berharap hubungan kita bisa tetap seperti itu—BERTEMAN dengan nyaman, tanpa harus merasa ada jarak setelah ini.',
    paragraphs: [
      [{ text: 'Dari setelah Mb Reza resign sampai sekarang, entah aku yang salah menangkap atau nggak, aku merasa mungkin Mb Reza masih menyimpan rasa itu ke aku.' }],
      [{ text: 'Karena itu aku memilih untuk menyampaikan ini. Bukan karena aku nggak menghargai perasaan Mb Reza, justru karena aku menghargainya, aku nggak mau sikapku selama ini tanpa sengaja membuat Mb Reza berharap sesuatu yang sebenarnya belum bisa aku berikan.' }],
      [{ text: 'Kalau selama ini kita masih sering chat, bercanda, atau saling kirim sesuatu di TikTok, dari sisi aku itu karena aku memang nyaman menganggap Mb Reza sebagai teman. Aku senang kita masih bisa komunikasi seperti biasa.' }],
      [
        { text: 'Aku berharap hubungan kita bisa tetap seperti itu—' },
        { text: 'BERTEMAN', bold: true },
        { text: ' dengan nyaman, bebas cerita, bercanda, dan nggak perlu merasa ada jarak atau batasan karena kejadian ini.' }
      ],
      [{ text: 'Aku juga berharap Mb Reza nggak menganggap apa yang aku sampaikan ini sebagai sesuatu yang mengurangi nilai Mb Reza sedikit pun. Mb Reza tetap orang baik yang aku kenal. Hanya saja, untuk perasaan yang lebih dari teman, maaf ya Mb, aku belum bisa membalasnya dengan perasaan yang sama.' }],
      [{ text: 'Dan aku rasa perasaan seperti ini juga memang nggak bisa dipaksakan dari kedua sisi.' }],
      [{ text: 'Aku harap setelah membaca ini, Mb Reza bisa memahami. Nggak perlu merasa malu, canggung, atau merasa harus menjauh setelah ini. Aku tetap ingin kita berteman seperti biasanya.' }],
      [{ text: 'Aku juga akan tetap welcome kalau suatu saat Mb Reza mau cerita, tanya-tanya sesuatu, sekadar chat, atau kirim TikTok buat jaga api wkwk. Aku masih mau kok, Mb. Jadi jangan merasa karena aku ngomong seperti ini, semuanya harus berubah.' }],
      [{ text: 'Aku cuma ingin kita sama-sama tahu posisi masing-masing supaya ke depannya nggak ada harapan atau salah paham yang justru nantinya bisa membuat salah satu dari kita terluka.' }],
      [{ text: 'Dan untuk Mb Reza, tetap semangat ya. Fokus sama semua yang sedang Mb kejar sekarang. Masih banyak hal baik yang ada di depan—kerjaan, kuliah, mimpi-mimpi Mb Reza, dan semua hal yang ingin Mb capai.' }],
      [{ text: 'Terus kejar apa yang Mb Reza inginkan dan jangan berhenti berkembang menjadi versi terbaik dari diri Mb sendiri.' }],
      [{ text: 'Terakhir, terima kasih ya Mb.' }],
      [{ text: 'Terima kasih sudah pernah menyampaikan perasaan itu dengan jujur. Terima kasih juga untuk semua cerita, candaan, dan momen-momen selama kita kerja bareng.' }],
      [{ text: 'Maaf kalau balasan ini baru aku sampaikan sekarang, dan maaf kalau mungkin ada bagian dari tulisan ini yang tetap membuat Mb Reza sedikit sedih. Sama sekali nggak ada niat dari aku untuk menyakiti atau meremehkan apa yang Mb Reza rasakan.' }],
      [{ text: 'Aku cuma ingin jujur supaya kita sama-sama nyaman untuk melangkah ke depan.' }],
      [{ text: 'Semangat terus kerjanya, kuliahnya, dan semua yang sedang Mb Reza perjuangkan.' }],
      [{ text: 'Sorry for everything, and thank you for everything too, Mb Reza.', bold: true }]
    ]
  }
]

function pageLength(page) {
  return page.paragraphs.reduce((total, paragraph) => (
    total + paragraph.reduce((sum, run) => sum + run.text.length, 0) + 2
  ), 0)
}

function useTypingSound() {
  const audioRef = useRef(null)

  const unlock = () => {
    if (!audioRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) audioRef.current = new AudioCtx()
    }
    if (audioRef.current?.state === 'suspended') audioRef.current.resume()
  }

  const click = () => {
    const ctx = audioRef.current
    if (!ctx || ctx.state !== 'running') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(118 + Math.random() * 22, ctx.currentTime)
    gain.gain.setValueAtTime(0.012, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.026)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.03)
  }

  return { unlock, click }
}

export default function App() {
  const [screen, setScreen] = useState('loading')
  const [loading, setLoading] = useState(0)
  const [otpOpen, setOtpOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [typedCount, setTypedCount] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(READ_SECONDS)
  const [transitioning, setTransitioning] = useState(false)
  const [textSize, setTextSize] = useState(() => {
    const saved = Number(localStorage.getItem('letterTextSize'))
    return saved >= 14 && saved <= 20 ? saved : 16
  })
  const { unlock, click } = useTypingSound()

  const currentPage = LETTER_PAGES[pageIndex]
  const isLastPage = pageIndex === LETTER_PAGES.length - 1

  const changeTextSize = (nextSize) => {
    const safeSize = Math.min(20, Math.max(14, nextSize))
    setTextSize(safeSize)
    localStorage.setItem('letterTextSize', String(safeSize))
  }

  useEffect(() => {
    if (screen !== 'loading') return
    setLoading(0)
    const started = performance.now()
    const duration = 2700
    let frame

    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setLoading(Math.round(eased * 100))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setTimeout(() => setScreen('home'), 350)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [screen])

  useEffect(() => {
    if (screen !== 'letter') return

    setTypedCount(0)
    setTypingDone(false)
    setSecondsLeft(READ_SECONDS)
    const max = pageLength(currentPage)
    let count = 0

    const timer = setInterval(() => {
      count = Math.min(max, count + 2)
      setTypedCount(count)
      if (count % 8 === 0) click()
      if (count >= max) {
        clearInterval(timer)
        setTypingDone(true)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [screen, pageIndex])

  useEffect(() => {
    if (!typingDone || isLastPage || screen !== 'letter') return

    const timer = setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          clearInterval(timer)
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [typingDone, isLastPage, screen])

  useEffect(() => {
    if (!typingDone || isLastPage || secondsLeft !== 0 || transitioning) return
    goNextPage()
  }, [secondsLeft, typingDone, isLastPage, transitioning])

  const goNextPage = () => {
    if (isLastPage || transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setPageIndex((value) => value + 1)
      setTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 650)
  }

  const resetExperience = () => {
    setPageIndex(0)
    setTypedCount(0)
    setTypingDone(false)
    setSecondsLeft(READ_SECONDS)
    setOtpOpen(false)
    setOpening(false)
    setTransitioning(false)
    setScreen('loading')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUnlocked = () => {
    unlock()
    setOtpOpen(false)
    setOpening(true)
    setTimeout(() => {
      setOpening(false)
      setScreen('letter')
    }, 1550)
  }

  return (
    <main className="app-shell">
      <AmbientBackground />

      <AnimatePresence mode="wait">
        {screen === 'loading' && (
          <motion.section
            key="loading"
            className="screen loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.45 }}
          >
            <div className="loading-card">
              <div className="mini-brand"><span className="pulse-dot" /> PRIVATE LETTER</div>
              <div className="loading-copy">
                <span>Preparing something</span>
                <h1>Just for you.</h1>
                <p>Some words are better read slowly.</p>
              </div>

              <div className="loader-block">
                <div className="loader-track">
                  <motion.div className="loader-fill" animate={{ width: `${loading}%` }} />
                  <motion.div className="logo-runner" animate={{ left: `${loading}%` }} transition={{ duration: 0.05, ease: 'linear' }}>
                    <img src="/kingkong-logo.svg" alt="Kingkong" />
                  </motion.div>
                </div>
                <div className="loader-meta"><span>LOADING MESSAGE</span><strong>{String(loading).padStart(3, '0')}%</strong></div>
              </div>
            </div>
          </motion.section>
        )}

        {screen === 'home' && (
          <motion.section
            key="home"
            className="screen home-screen"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="home-content">
              <div className="home-brand"><img src="/kingkong-logo.svg" alt="" /><span>PRIVATE · 01</span></div>
              <div className="home-copy">
                <span className="eyebrow">A LETTER FOR YOU</span>
                <h1>There are words<br />I need to <em>say.</em></h1>
                <p>Buka saat kamu benar-benar punya waktu untuk membacanya dengan tenang.</p>
              </div>

              <Envelope opening={opening} onClick={() => !opening && setOtpOpen(true)} />

              <motion.button
                className="open-hint"
                onClick={() => !opening && setOtpOpen(true)}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <span>Tap untuk membuka</span><b>↗</b>
              </motion.button>
            </div>

            <AnimatePresence>
              {otpOpen && <OtpModal onClose={() => setOtpOpen(false)} onSuccess={handleUnlocked} />}
            </AnimatePresence>
          </motion.section>
        )}

        {screen === 'letter' && (
          <motion.section
            key="letter"
            className="letter-screen"
            style={{ '--letter-font-size': `${textSize}px` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Stars />

            <header className="letter-nav">
              <div className="nav-brand"><img src="/kingkong-logo.svg" alt="" /><span>PRIVATE LETTER</span></div>
              <div className="nav-tools">
                <div className="text-size-control" aria-label="Atur ukuran teks surat">
                  <button onClick={() => changeTextSize(textSize - 1)} disabled={textSize <= 14} aria-label="Perkecil teks">A−</button>
                  <button className="text-size-value" onClick={() => changeTextSize(16)} aria-label="Kembalikan ukuran teks ke normal">{textSize}</button>
                  <button onClick={() => changeTextSize(textSize + 1)} disabled={textSize >= 20} aria-label="Perbesar teks">A+</button>
                </div>
                <span className="nav-page">{String(pageIndex + 1).padStart(2, '0')} / {String(LETTER_PAGES.length).padStart(2, '0')}</span>
              </div>
            </header>

            <div className="letter-container">
              <AnimatePresence mode="wait">
                {!transitioning && (
                  <motion.div
                    key={pageIndex}
                    className="page-stack"
                    initial={{ opacity: 0, y: 28, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.985, filter: 'blur(7px)' }}
                    transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <motion.div
                      className="page-highlight"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <span>HIGHLIGHT · {currentPage.label}</span>
                      <p>{renderHighlight(currentPage.highlight)}</p>
                    </motion.div>

                    <article className="letter-paper">
                      <div className="paper-top">
                        <span>{currentPage.label}</span>
                        <span>PRIVATE · Y</span>
                      </div>

                      <TypedParagraphs page={currentPage} visibleChars={typedCount} />

                      <div className="paper-bottom">
                        <span>{typingDone ? 'READY TO READ' : 'WRITING...'}</span>
                        <span className={`typing-indicator ${typingDone ? 'done' : ''}`}><i /> {typingDone ? 'COMPLETE' : 'TYPING'}</span>
                      </div>
                    </article>

                    {typingDone && !isLastPage && (
                      <ReadTimer secondsLeft={secondsLeft} onContinue={goNextPage} />
                    )}

                    {typingDone && isLastPage && (
                      <motion.div
                        className="finish-card"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <span>END OF LETTER</span>
                        <h3>Terima kasih sudah membaca sampai akhir.</h3>
                        <p>Halaman ini akan tetap terbuka sampai kamu memilih untuk mengakhirinya.</p>
                        <button className="primary-btn" onClick={resetExperience}>Akhiri surat <b>↗</b></button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

function TypedParagraphs({ page, visibleChars }) {
  let remaining = visibleChars

  return (
    <div className="letter-content">
      {page.paragraphs.map((paragraph, paragraphIndex) => {
        const renderedRuns = []
        let hasVisibleText = false

        paragraph.forEach((run, runIndex) => {
          if (remaining <= 0) return
          const take = Math.min(run.text.length, remaining)
          if (take > 0) {
            const text = run.text.slice(0, take)
            renderedRuns.push(run.bold
              ? <strong key={runIndex}>{text}</strong>
              : <span key={runIndex}>{text}</span>)
            hasVisibleText = true
            remaining -= take
          }
        })

        if (!hasVisibleText) return null
        remaining = Math.max(0, remaining - 2)

        return <p key={paragraphIndex}>{renderedRuns}{remaining <= 0 && <span className="cursor" />}</p>
      })}
    </div>
  )
}

function renderHighlight(text) {
  const parts = text.split('BERTEMAN')
  if (parts.length === 1) return text
  return <>{parts[0]}<strong>BERTEMAN</strong>{parts[1]}</>
}

function ReadTimer({ secondsLeft, onContinue }) {
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = ((READ_SECONDS - secondsLeft) / READ_SECONDS) * 100

  return (
    <motion.div className="read-timer" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="timer-copy">
        <span>WAKTU MEMBACA</span>
        <h3>Ambil waktu 5 menit.</h3>
        <p>Setelah waktu habis, surat akan otomatis berpindah ke lembar berikutnya. Kalau sudah selesai lebih cepat, kamu bisa lanjut sekarang.</p>
      </div>

      <div className="timer-row">
        <div className="timer-clock">
          <strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>
          <span>TERSISA</span>
        </div>
        <button className="primary-btn compact" onClick={onContinue}>Lanjut sekarang <b>→</b></button>
      </div>
      <div className="timer-progress"><i style={{ width: `${progress}%` }} /></div>
    </motion.div>
  )
}

function Envelope({ onClick, opening }) {
  return (
    <motion.button
      className={`envelope ${opening ? 'is-opening' : ''}`}
      onClick={onClick}
      aria-label="Buka surat"
      whileTap={!opening ? { scale: 0.975 } : {}}
    >
      <div className="envelope-glow" />
      <div className="envelope-back" />
      <motion.div className="letter-preview" animate={opening ? { y: -125, scale: 1.03 } : { y: [0, -5, 0] }} transition={opening ? { duration: 0.85, delay: 0.25 } : { duration: 3, repeat: Infinity }}>
        <div className="preview-head"><img src="/kingkong-logo.svg" alt="" /><span>PRIVATE</span></div>
        <div className="preview-lines"><i /><i /><i /></div>
      </motion.div>
      <motion.div className="envelope-flap" animate={opening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }} transition={{ duration: 0.7 }} />
      <div className="envelope-front" />
      <motion.div className="seal" animate={opening ? { scale: 0, rotate: 25, opacity: 0 } : { scale: [1, 1.04, 1] }} transition={opening ? { duration: 0.35 } : { duration: 2.6, repeat: Infinity }}>K</motion.div>
    </motion.button>
  )
}

function OtpModal({ onClose, onSuccess }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const refs = useRef([])

  useEffect(() => refs.current[0]?.focus(), [])

  const submit = (values = digits) => {
    const code = values.join('')
    if (code.length !== 6) return
    if (code === OTP_CODE) onSuccess()
    else {
      setError(true)
      setDigits(['', '', '', '', '', ''])
      setTimeout(() => refs.current[0]?.focus(), 30)
      setTimeout(() => setError(false), 650)
    }
  }

  const change = (index, value) => {
    const clean = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = clean
    setDigits(next)
    if (clean && index < 5) refs.current[index + 1]?.focus()
    if (next.every(Boolean)) setTimeout(() => submit(next), 100)
  }

  const keyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus()
    if (event.key === 'Enter') submit()
  }

  const paste = (event) => {
    event.preventDefault()
    const numbers = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    const next = Array(6).fill('')
    numbers.forEach((value, index) => { next[index] = value })
    setDigits(next)
    refs.current[Math.min(numbers.length, 5)]?.focus()
    if (numbers.length === 6) setTimeout(() => submit(next), 100)
  }

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerDown={onClose}>
      <motion.div
        className={`otp-sheet ${error ? 'shake' : ''}`}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="otp-heading">
          <div className="otp-icon"><img src="/kingkong-logo.svg" alt="" /></div>
          <div><span>SECURITY CHECK</span><h2>Masukkan kode surat.</h2></div>
        </div>
        <p className="otp-help">Surat ini dilindungi dengan PIN 6 digit.</p>

        <div className="otp-inputs" onPaste={paste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => { refs.current[index] = element }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength="1"
              value={digit}
              onChange={(event) => change(index, event.target.value)}
              onKeyDown={(event) => keyDown(index, event)}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <div className={`otp-message ${error ? 'error' : ''}`}>{error ? 'Kode salah. Coba lagi ya.' : 'Protected · 6 digit access'}</div>
        <button className="primary-btn full" onClick={() => submit()}>Buka surat <b>↗</b></button>
        <button className="text-btn" onClick={onClose}>Kembali</button>
      </motion.div>
    </motion.div>
  )
}

function Stars() {
  const stars = useMemo(() => Array.from({ length: 26 }, (_, index) => ({
    id: index,
    left: `${(index * 41.7) % 100}%`,
    top: `${(index * 23.4) % 82}%`,
    delay: `${(index % 8) * 0.7}s`,
    duration: `${3 + (index % 4) * 0.8}s`,
    size: `${1 + (index % 2)}px`
  })), [])

  const meteors = useMemo(() => Array.from({ length: 4 }, (_, index) => ({
    id: index,
    left: `${18 + index * 23}%`,
    delay: `${index * 3.4}s`
  })), [])

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => <i key={star.id} className="star" style={{ left: star.left, top: star.top, animationDelay: star.delay, animationDuration: star.duration, width: star.size, height: star.size }} />)}
      {meteors.map((meteor) => <b key={meteor.id} className="meteor" style={{ left: meteor.left, animationDelay: meteor.delay }} />)}
    </div>
  )
}

function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="noise" />
    </div>
  )
}
