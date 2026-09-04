import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const OTP_CODE = "200026";
const MUSIC_SRC = "/music.mp3";

const LETTER_PAGES = [
  {
    label: "LEMBAR 01",
    highlight: "Lorem ipsum dolor sit amet",
    paragraphs: [
      [{ text: "Lorem I,", bold: true }],
      [
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volatile velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        },
      ],
      [
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volatile velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        },
      ],
    ],
  },
];

function pageLength(page) {
  return page.paragraphs.reduce(
    (total, paragraph) =>
      total + paragraph.reduce((sum, run) => sum + run.text.length, 0) + 2,
    0,
  );
}

function useTypingSound() {
  const audioRef = useRef(null);

  const unlock = () => {
    if (!audioRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;

      if (AudioCtx) {
        audioRef.current = new AudioCtx();
      }
    }

    if (audioRef.current?.state === "suspended") {
      audioRef.current.resume();
    }
  };

  const click = () => {
    const ctx = audioRef.current;

    if (!ctx || ctx.state !== "running") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(118 + Math.random() * 22, ctx.currentTime);

    gain.gain.setValueAtTime(0.012, ctx.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.026);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  };

  return {
    unlock,
    click,
  };
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [loading, setLoading] = useState(0);
  const [otpOpen, setOtpOpen] = useState(false);
  const [opening, setOpening] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  // Untuk menampilkan gambar prank
  const [showImage, setShowImage] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const musicRef = useRef(null);
  const isMutedRef = useRef(false);

  const [textSize, setTextSize] = useState(() => {
    const saved = Number(localStorage.getItem("letterTextSize"));

    return saved >= 14 && saved <= 20 ? saved : 16;
  });

  const { unlock, click } = useTypingSound();

  const currentPage = LETTER_PAGES[pageIndex];

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // LOADING SCREEN

  useEffect(() => {
    if (screen !== "loading") return;

    setLoading(0);

    const started = performance.now();
    const duration = 2700;

    let frame;

    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);

      const eased = 1 - Math.pow(1 - progress, 3);

      setLoading(Math.round(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setScreen("home");
        }, 350);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [screen]);

  // EFEK MENGETIK SURAT

  useEffect(() => {
    if (screen !== "letter") return;

    setTypedCount(0);
    setTypingDone(false);
    setShowImage(false);

    const max = pageLength(currentPage);

    let count = 0;

    const timer = setInterval(() => {
      count = Math.min(max, count + 2);

      setTypedCount(count);

      if (!isMutedRef.current && count % 8 === 0) {
        click();
      }

      if (count >= max) {
        clearInterval(timer);

        setTypingDone(true);

        // Tunggu sebentar
        // lalu munculkan gambar full screen

        setTimeout(() => {
          setShowImage(true);
        }, 700);
      }
    }, 16);

    return () => {
      clearInterval(timer);
    };
  }, [screen, pageIndex]);

  const changeTextSize = (nextSize) => {
    const safeSize = Math.min(20, Math.max(14, nextSize));

    setTextSize(safeSize);

    localStorage.setItem("letterTextSize", String(safeSize));
  };

  // MULAI MUSIK

  const startMusic = async () => {
    const music = musicRef.current;

    if (!music) return;

    music.volume = 0.22;
    music.muted = isMutedRef.current;

    try {
      await music.play();
    } catch (error) {
      console.log("Autoplay musik belum diizinkan browser:", error);
    }
  };

  // BERHENTIKAN MUSIK

  const stopMusic = () => {
    const music = musicRef.current;

    if (!music) return;

    music.pause();
    music.currentTime = 0;
  };

  // KEMBALI KE HALAMAN AWAL

  const resetExperience = () => {
    stopMusic();

    setPageIndex(0);
    setTypedCount(0);
    setTypingDone(false);
    setShowImage(false);

    setOtpOpen(false);
    setOpening(false);

    // Langsung kembali ke halaman awal
    setScreen("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUnlocked = () => {
    unlock();

    startMusic();

    setOtpOpen(false);

    setOpening(true);

    setTimeout(() => {
      setOpening(false);

      setScreen("letter");
    }, 1550);
  };

  const toggleMute = () => {
    setIsMuted((previous) => {
      const nextMuted = !previous;

      isMutedRef.current = nextMuted;

      if (musicRef.current) {
        musicRef.current.muted = nextMuted;
      }

      return nextMuted;
    });
  };

  return (
    <main className="app-shell">
      {/* MUSIC */}

      <audio ref={musicRef} src={MUSIC_SRC} loop preload="auto" playsInline />

      <AmbientBackground />

      <AnimatePresence mode="wait">
        {/* ================= LOADING ================= */}

        {screen === "loading" && (
          <motion.section
            key="loading"
            className="screen loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: "blur(10px)",
            }}
            transition={{
              duration: 0.45,
            }}>
            <div className="loading-card">
              <div className="mini-brand">
                <span className="pulse-dot" />
                PRIVATE LETTER
              </div>

              <div className="loading-copy">
                <span>Preparing something</span>

                <h1>Just for you.</h1>

                <p>Some words are better read slowly.</p>
              </div>

              <div className="loader-block">
                <div className="loader-track">
                  <motion.div
                    className="loader-fill"
                    animate={{
                      width: `${loading}%`,
                    }}
                  />

                  <motion.div
                    className="logo-runner"
                    animate={{
                      left: `${loading}%`,
                    }}
                    transition={{
                      duration: 0.05,
                      ease: "linear",
                    }}>
                    <img src="/kingkong-logo.svg" alt="Kingkong" />
                  </motion.div>
                </div>

                <div className="loader-meta">
                  <span>LOADING MESSAGE</span>

                  <strong>{String(loading).padStart(3, "0")}%</strong>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= HOME ================= */}

        {screen === "home" && (
          <motion.section
            key="home"
            className="screen home-screen"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.55,
            }}>
            <div className="home-content">
              <div className="home-brand">
                <img src="/kingkong-logo.svg" alt="" />

                <span>PRIVATE · 01</span>
              </div>

              <div className="home-copy">
                <span className="eyebrow">A LETTER FOR YOU</span>

                <h1>
                  There are words
                  <br />I need to <em>say.</em>
                </h1>

                <p>
                  Buka saat kamu benar-benar punya waktu untuk membacanya dengan
                  tenang.
                </p>
              </div>

              <Envelope
                opening={opening}
                onClick={() => {
                  if (!opening) {
                    setOtpOpen(true);
                  }
                }}
              />

              <motion.button
                className="open-hint"
                onClick={() => {
                  if (!opening) {
                    setOtpOpen(true);
                  }
                }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                }}>
                <span>Tap untuk membuka</span>

                <b>↗</b>
              </motion.button>
            </div>

            <AnimatePresence>
              {otpOpen && (
                <OtpModal
                  onClose={() => {
                    setOtpOpen(false);
                  }}
                  onSuccess={handleUnlocked}
                />
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* ================= LETTER ================= */}

        {screen === "letter" && (
          <motion.section
            key="letter"
            className="letter-screen"
            style={{
              "--letter-font-size": `${textSize}px`,
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}>
            <Stars />

            {/* NAVIGATION */}

            <header className="letter-nav">
              <div className="nav-brand">
                <img src="/kingkong-logo.svg" alt="" />

                <span>PRIVATE LETTER</span>
              </div>

              <div className="nav-tools">
                <div
                  className="text-size-control"
                  aria-label="Atur ukuran teks surat">
                  <button
                    onClick={() => {
                      changeTextSize(textSize - 1);
                    }}
                    disabled={textSize <= 14}>
                    A−
                  </button>

                  <button
                    className="text-size-value"
                    onClick={() => {
                      changeTextSize(16);
                    }}>
                    {textSize}
                  </button>

                  <button
                    onClick={() => {
                      changeTextSize(textSize + 1);
                    }}
                    disabled={textSize >= 20}>
                    A+
                  </button>
                </div>

                {/* SOUND BUTTON */}

                <motion.button
                  type="button"
                  onClick={toggleMute}
                  whileTap={{
                    scale: 0.9,
                  }}
                  aria-label={isMuted ? "Hidupkan suara" : "Matikan suara"}
                  title={isMuted ? "Sound Off" : "Sound On"}
                  style={{
                    width: 38,
                    height: 38,
                    flex: "0 0 38px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.10)",
                    background: "rgba(255,255,255,.055)",
                    color: "#fff",
                    padding: 0,
                    cursor: "pointer",
                  }}>
                  <SoundIcon muted={isMuted} />
                </motion.button>

                <span className="nav-page">01 / 01</span>
              </div>
            </header>

            <div className="letter-container">
              <motion.div
                className="page-stack"
                initial={{
                  opacity: 0,
                  y: 28,
                  scale: 0.985,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.2, 0.8, 0.2, 1],
                }}>
                {/* HIGHLIGHT */}

                <motion.div
                  className="page-highlight"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.25,
                  }}>
                  <span>HIGHLIGHT · {currentPage.label}</span>

                  <p>{currentPage.highlight}</p>
                </motion.div>

                {/* SURAT */}

                <article className="letter-paper">
                  <div className="paper-top">
                    <span>{currentPage.label}</span>

                    <span>PRIVATE · Y</span>
                  </div>

                  <TypedParagraphs
                    page={currentPage}
                    visibleChars={typedCount}
                  />

                  <div className="paper-bottom">
                    <span>{typingDone ? "MESSAGE READY" : "WRITING..."}</span>

                    <span
                      className={`typing-indicator ${
                        typingDone ? "done" : ""
                      }`}>
                      <i /> {typingDone ? "COMPLETE" : "TYPING"}
                    </span>
                  </div>
                </article>
              </motion.div>
            </div>

            {/* ================= GAMBAR FULL SCREEN ================= */}

            <AnimatePresence>
              {showImage && (
                <motion.div
                  className="surprise-fullscreen"
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  onClick={resetExperience}>
                  <img src="public/gambar.jpg" alt="Surat" />

                  <motion.div
                    className="surprise-hint"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 1,
                      duration: 0.5,
                    }}>
                    Klik di mana saja untuk kembali
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ===============================
   TYPING PARAGRAPHS
================================ */

function TypedParagraphs({ page, visibleChars }) {
  let remaining = visibleChars;

  return (
    <div className="letter-content">
      {page.paragraphs.map((paragraph, paragraphIndex) => {
        const renderedRuns = [];

        let hasVisibleText = false;

        paragraph.forEach((run, runIndex) => {
          if (remaining <= 0) return;

          const take = Math.min(run.text.length, remaining);

          if (take > 0) {
            const text = run.text.slice(0, take);

            renderedRuns.push(
              run.bold ? (
                <strong key={runIndex}>{text}</strong>
              ) : (
                <span key={runIndex}>{text}</span>
              ),
            );

            hasVisibleText = true;

            remaining -= take;
          }
        });

        if (!hasVisibleText) {
          return null;
        }

        remaining = Math.max(0, remaining - 2);

        return (
          <p key={paragraphIndex}>
            {renderedRuns}

            {remaining <= 0 && <span className="cursor" />}
          </p>
        );
      })}
    </div>
  );
}

/* ===============================
   ENVELOPE
================================ */

function Envelope({ onClick, opening }) {
  return (
    <motion.button
      className={`envelope ${opening ? "is-opening" : ""}`}
      onClick={onClick}
      aria-label="Buka surat"
      whileTap={
        !opening
          ? {
              scale: 0.975,
            }
          : {}
      }>
      <div className="envelope-glow" />

      <div className="envelope-back" />

      <motion.div
        className="letter-preview"
        animate={
          opening
            ? {
                y: -125,
                scale: 1.03,
              }
            : {
                y: [0, -5, 0],
              }
        }
        transition={
          opening
            ? {
                duration: 0.85,
                delay: 0.25,
              }
            : {
                duration: 3,
                repeat: Infinity,
              }
        }>
        <div className="preview-head">
          <img src="/kingkong-logo.svg" alt="" />

          <span>PRIVATE</span>
        </div>

        <div className="preview-lines">
          <i />

          <i />

          <i />
        </div>
      </motion.div>

      <motion.div
        className="envelope-flap"
        animate={
          opening
            ? {
                rotateX: 180,
                zIndex: 0,
              }
            : {
                rotateX: 0,
              }
        }
        transition={{
          duration: 0.7,
        }}
      />

      <div className="envelope-front" />

      <motion.div
        className="seal"
        animate={
          opening
            ? {
                scale: 0,
                rotate: 25,
                opacity: 0,
              }
            : {
                scale: [1, 1.04, 1],
              }
        }
        transition={
          opening
            ? {
                duration: 0.35,
              }
            : {
                duration: 2.6,
                repeat: Infinity,
              }
        }>
        K
      </motion.div>
    </motion.button>
  );
}

/* ===============================
   OTP MODAL
================================ */

function OtpModal({ onClose, onSuccess }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);

  const [error, setError] = useState(false);

  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const submit = (values = digits) => {
    const code = values.join("");

    if (code.length !== 6) return;

    if (code === OTP_CODE) {
      onSuccess();
    } else {
      setError(true);

      setDigits(["", "", "", "", "", ""]);

      setTimeout(() => {
        refs.current[0]?.focus();
      }, 30);

      setTimeout(() => {
        setError(false);
      }, 650);
    }
  };

  const change = (index, value) => {
    const clean = value.replace(/\D/g, "").slice(-1);

    const next = [...digits];

    next[index] = clean;

    setDigits(next);

    if (clean && index < 5) {
      refs.current[index + 1]?.focus();
    }

    if (next.every(Boolean)) {
      submit(next);
    }
  };

  const keyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === "Enter") {
      submit();
    }
  };

  const paste = (event) => {
    event.preventDefault();

    const numbers = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    const next = Array(6).fill("");

    numbers.forEach((value, index) => {
      next[index] = value;
    });

    setDigits(next);

    refs.current[Math.min(numbers.length, 5)]?.focus();

    if (numbers.length === 6) {
      submit(next);
    }
  };

  return (
    <motion.div
      className="modal-backdrop"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onPointerDown={onClose}>
      <motion.div
        className={`otp-sheet ${error ? "shake" : ""}`}
        initial={{
          y: "100%",
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: "100%",
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 26,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}>
        <div className="sheet-handle" />

        <div className="otp-heading">
          <div className="otp-icon">
            <img src="/kingkong-logo.svg" alt="" />
          </div>

          <div>
            <span>SECURITY CHECK</span>

            <h2>Masukkan kode surat.</h2>
          </div>
        </div>

        <p className="otp-help">Surat ini dilindungi dengan PIN 6 digit.</p>

        <div className="otp-inputs" onPaste={paste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                refs.current[index] = element;
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength="1"
              value={digit}
              onChange={(event) => {
                change(index, event.target.value);
              }}
              onKeyDown={(event) => {
                keyDown(index, event);
              }}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <div className={`otp-message ${error ? "error" : ""}`}>
          {error ? "Kode salah. Coba lagi ya." : "Protected · 6 digit access"}
        </div>

        <button
          className="primary-btn full"
          onClick={() => {
            submit();
          }}>
          Buka surat <b>↗</b>
        </button>

        <button className="text-btn" onClick={onClose}>
          Kembali
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ===============================
   SOUND ICON
================================ */

function SoundIcon({ muted }) {
  return muted ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true">
      <path
        d="M11 5 6.5 9H3v6h3.5L11 19V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m16 9 5 5M21 9l-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true">
      <path
        d="M11 5 6.5 9H3v6h3.5L11 19V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ===============================
   STARS
================================ */

function Stars() {
  const stars = useMemo(
    () =>
      Array.from(
        {
          length: 26,
        },
        (_, index) => ({
          id: index,

          left: `${(index * 41.7) % 100}%`,

          top: `${(index * 23.4) % 82}%`,

          delay: `${(index % 8) * 0.7}s`,

          duration: `${3 + (index % 4) * 0.8}s`,

          size: `${1 + (index % 2)}px`,
        }),
      ),
    [],
  );

  const meteors = useMemo(
    () =>
      Array.from(
        {
          length: 4,
        },
        (_, index) => ({
          id: index,

          left: `${18 + index * 23}%`,

          delay: `${index * 3.4}s`,
        }),
      ),
    [],
  );

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => (
        <i
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
            width: star.size,
            height: star.size,
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <b
          key={meteor.id}
          className="meteor"
          style={{
            left: meteor.left,
            animationDelay: meteor.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ===============================
   AMBIENT BACKGROUND
================================ */

function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />

      <div className="ambient-orb orb-one" />

      <div className="ambient-orb orb-two" />

      <div className="noise" />
    </div>
  );
}
