import React, { useEffect, useRef, useState } from "react";
import "./App.css";

/**
 * MindEqual — Gender & Mental Health awareness site
 * -------------------------------------------------
 * Central issue: how gender shapes mental health risk, diagnosis and
 * help-seeking (women over-diagnosed with depression/anxiety and under-served
 * after violence; men under-diagnosed, more stigmatised, and far more likely
 * to die by suicide).
 *
 * Drop this file + App.css into your React app (e.g. replace src/App.jsx and
 * src/App.css, or import <MindEqual /> from wherever you want it rendered).
 * No extra npm packages required — motion, glassmorphism and the light/dark
 * switch are all done with plain CSS + a couple of small hooks below.
 */

// ---------------------------------------------------------------------------
// Content — every figure below is paraphrased from a public source; see the
// References section at the bottom of the page for links.
// ---------------------------------------------------------------------------

const COMPARISONS = {
  depression: {
    title: "Depression prevalence",
    year: "2023",
    population: "Adults · global",
    measure: "Estimated share of adults",
    unit: "%",
    source: "WHO, citing GBD 2023",
    url: "https://www.who.int/news-room/fact-sheets/detail/depression",
    note: "Estimated share of adults; this difference does not establish its cause.",
    values: [
      { label: "Women", value: 6.2, color: "coral" },
      { label: "Men", value: 4.1, color: "teal" },
    ],
  },
  suicide: {
    title: "Suicide mortality rate",
    year: "2021",
    population: "Global · age-standardized",
    measure: "Deaths per 100,000 people",
    unit: "",
    source: "WHO, Suicide worldwide in 2021",
    url: "https://www.who.int/publications/i/item/9789240110069",
    note: "Suicide has many interacting causes; sex alone does not explain this difference.",
    values: [
      { label: "Men", value: 12.6, color: "teal" },
      { label: "Women", value: 5.4, color: "coral" },
    ],
  },
};

const LAWS = [
  {
    year: "2018",
    title: "Republic Act No. 11036 — Philippine Mental Health Act",
    body:
      "Declares mental health a basic right of every Filipino, funds community-based care in all 17 regions, and directs programs to be gender-sensitive rather than one-size-fits-all.",
    link: "https://www.officialgazette.gov.ph/2018/06/20/republic-act-no-11036/",
    linkLabel: "Official Gazette — RA 11036",
  },
  {
    year: "2013–2030",
    title: "WHO Comprehensive Mental Health Action Plan",
    body:
      "The global framework that asks member states, the Philippines included, to track mental health outcomes by sex and age so gender gaps in care can actually be measured and closed.",
    link: "https://www.who.int/publications/i/item/9789240031029",
    linkLabel: "WHO — Mental Health Action Plan",
  },
  {
    year: "2019",
    title: "Republic Act No. 11313 — Safe Spaces Act",
    body:
      "Criminalises gender-based sexual harassment in public, online and at work in the Philippines — recognising harassment as a driver of the anxiety and trauma many women report.",
    link: "https://www.officialgazette.gov.ph/2019/04/17/republic-act-no-11313/",
    linkLabel: "Official Gazette — RA 11313",
  },
  {
    year: "2030",
    title: "UN Sustainable Development Goal 3.4",
    body:
      "The global target to cut premature death from non-communicable causes and promote mental health — with suicide-rate reduction tracked separately for men and women.",
    link: "https://www.who.int/data/gho/data/themes/mental-health",
    linkLabel: "WHO — mental health data & SDG 3.4",
  },
];

const MYTHS = [
  {
    myth: "Men just don't get depressed as often as women.",
    fact:
      "Men are diagnosed less, not affected less. Depression in men often shows up as irritability, anger or risk-taking rather than sadness, so it's frequently missed — and stigma keeps many from ever describing it out loud.",
  },
  {
    myth: "Talking about suicide risk makes it more likely to happen.",
    fact:
      "Asking someone directly whether they're thinking about suicide does not plant the idea — it's consistently linked with people feeling relieved and more willing to accept help.",
  },
  {
    myth: "Gender-based violence is a safety issue, not a mental health one.",
    fact:
      "Women who've experienced intimate partner or sexual violence face a sharply higher risk of depression, anxiety and PTSD, so survivor support has to include mental health care, not just legal protection.",
  },
  {
    myth: "Non-binary and trans people's struggles are 'just a phase' or attention-seeking.",
    fact:
      "Elevated anxiety and depression rates in trans and non-binary people track closely with experiences of discrimination and rejection — the distress is a response to a hostile environment, not an inherent trait.",
  },
];

const EDUCATIONAL_STEREOTYPES = [
  {
    stereotype: "Men should never cry.",
    response:
      "Crying is a normal human emotional response. People of any gender deserve to express their feelings.",
  },
  {
    stereotype: "Women are always too emotional.",
    response:
      "Emotional experiences vary between individuals. Gender stereotypes should not be used to dismiss someone's feelings.",
  },
  {
    stereotype: "Asking for help means you are weak.",
    response:
      "Seeking support can be a constructive way to care for your well-being.",
  },
  {
    stereotype: "Mental health problems only affect certain genders.",
    response:
      "Mental health challenges can affect people of every gender.",
  },
  {
    stereotype: "LGBTQIA+ people are mentally unhealthy because of their identity.",
    response:
      "A person's gender identity or sexual orientation should not be treated as a mental illness. Discrimination and rejection can create additional stress.",
  },
];

const QUIZ_QUESTIONS = [
  {
    statement: "Men should always hide their emotions to appear strong.",
    answer: "Myth",
    explanation:
      "Everyone experiences emotions. Expressing feelings and seeking support are signs of self-awareness, not weakness.",
  },
  {
    statement: "Only women experience mental health problems.",
    answer: "Myth",
    explanation:
      "Mental health challenges can affect people of any gender. Gender can shape how distress is experienced, recognised and supported.",
  },
  {
    statement: "Discrimination and social rejection can affect a person's mental well-being.",
    answer: "Fact",
    explanation:
      "Discrimination, bullying and rejection can contribute to emotional distress and other mental health difficulties.",
  },
  {
    statement: "Asking someone about suicide puts the idea in their head.",
    answer: "Myth",
    explanation:
      "A calm, direct question can help someone feel seen and make it easier for them to talk about getting support.",
  },
  {
    statement: "Depression can look different from person to person.",
    answer: "Fact",
    explanation:
      "Some people feel sadness, while others may experience anger, exhaustion, numbness or changes in sleep and appetite.",
  },
  {
    statement: "A person must have a diagnosis before they deserve mental health support.",
    answer: "Myth",
    explanation:
      "Everyone deserves care and someone to talk to, whether or not they have a diagnosis or know exactly what they are feeling.",
  },
  {
    statement: "Gender stereotypes can make it harder for people to ask for help.",
    answer: "Fact",
    explanation:
      "Messages about being tough, self-sacrificing or quiet can discourage people from naming distress and reaching out.",
  },
  {
    statement: "Mental health concerns are a personal failure.",
    answer: "Myth",
    explanation:
      "Mental health is shaped by many factors, including biology, relationships, life events and social conditions. Needing support is human.",
  },
  {
    statement: "Listening without judgment can be a meaningful way to support someone.",
    answer: "Fact",
    explanation:
      "Being present, listening carefully and helping someone connect with trusted support can make a real difference.",
  },
  {
    statement: "People from every gender identity should be able to access respectful mental health care.",
    answer: "Fact",
    explanation:
      "Care should respect each person's identity and needs. Equality in mental health starts with being heard and treated with dignity.",
  },
];

const HOTLINES = [
  { name: "NCMH Crisis Hotline (24/7)", number: "1553", tel: "1553" },
  { name: "NCMH — Globe/TM", number: "0917 899 8727", tel: "+639178998727" },
  { name: "NCMH — Smart/TNT", number: "0919 057 1553", tel: "+639190571553" },
  { name: "Hopeline PH", number: "0917 558 4673", tel: "+639175584673" },
  { name: "National emergency", number: "911", tel: "911" },
];

const REFERENCES = [
  { label: "WHO — Depressive disorder: global estimates based on GBD 2023", url: "https://www.who.int/news-room/fact-sheets/detail/depression" },
  { label: "WHO — Suicide worldwide in 2021: Global Health Estimates", url: "https://www.who.int/publications/i/item/9789240110069" },
  { label: "WHO — Depression (fact sheet)", url: "https://www.who.int/news-room/fact-sheets/detail/depression" },
  { label: "WHO — World Mental Health Today, 2025", url: "https://www.who.int/teams/mental-health-and-substance-use/data-research/world-mental-health-today" },
  { label: "WHO Comprehensive Mental Health Action Plan 2013–2030", url: "https://www.who.int/publications/i/item/9789240031029" },
  { label: "Republic Act No. 11036 — Philippine Mental Health Act (Official Gazette)", url: "https://www.officialgazette.gov.ph/2018/06/20/republic-act-no-11036/" },
  { label: "Republic Act No. 11313 — Safe Spaces Act (Official Gazette)", url: "https://www.officialgazette.gov.ph/2019/04/17/republic-act-no-11313/" },
  { label: "Philippine Department of Health — Mental Health Program", url: "https://doh.gov.ph/national-mental-health-program" },
  { label: "Aves, J.A. — Evolution and Efficiency of Mental Health Laws in the Philippines, 2024", url: "https://legalresearchph.com/2024/07/13/evolution-and-efficiency-of-mental-health-laws-in-the-philippines/" },
];

const NAV_ITEMS = [
  ["#top", "Overview", "01"],
  ["#issue", "The issue", "02"],
  ["#quiz", "Myth or Fact?", "03"],
  ["#stats", "By the numbers", "04"],
  ["#laws", "Laws & policy", "05"],
  ["#help", "Get help", "06"],
  ["#pledge", "Take action", "07"],
];

// ---------------------------------------------------------------------------
// Small hooks
// ---------------------------------------------------------------------------

/** Adds .is-visible to an element the first time it scrolls into view. */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ---------------------------------------------------------------------------
// Section components
// ---------------------------------------------------------------------------

function Navbar({ theme, onToggleTheme, activeSection, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="navbar-inner glass">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-loop loop-violet" />
            <span className="brand-mark-loop loop-teal" />
            <span className="brand-mark-core">=</span>
          </span>
          MindEqual
        </a>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {NAV_ITEMS.slice(1).map(([href, label]) => (
            <a className={activeSection === href.slice(1) ? "active" : ""} key={href} href={href} onClick={() => { onNavigate(href.slice(1)); setOpen(false); }}>
              {label}
            </a>
          ))}
        </nav>
        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle light and dark mode"
            title="Toggle theme"
          >
            <span className={`toggle-track ${theme}`}>
              <span className="toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</span>
            </span>
          </button>
          <button
            className="hamburger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

function SideNav({ activeSection, onNavigate }) {
  return (
    <aside className="side-nav" aria-label="Page sections">
      <div className="side-nav-inner">
        <p className="side-nav-label">Explore</p>
        <nav>
          {NAV_ITEMS.map(([href, label, number]) => (
            <a className={activeSection === href.slice(1) ? "active" : ""} key={href} href={href} onClick={() => onNavigate(href.slice(1))}>
              <span className="side-nav-number">{number}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="side-nav-note">
          <span className="side-nav-status" />
          <span>Care is for everyone</span>
        </div>
      </div>
    </aside>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-photo" aria-hidden="true" />
      <div className="hero-motion" aria-hidden="true">
        <span className="motion-ring ring-one" />
        <span className="motion-ring ring-two" />
        <span className="sparkle sparkle-one" />
        <span className="sparkle sparkle-two" />
        <span className="sparkle sparkle-three" />
        <span className="sparkle sparkle-four" />
        <span className="sparkle sparkle-five" />
        <span className="sparkle sparkle-six" />
        <span className="sparkle sparkle-seven" />
        <span className="sparkle sparkle-eight" />
      </div>
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />
      <div className="blob blob-c" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="kicker">Gender &amp; mental health</p>
          <h1>
            Care shouldn't depend on
            <br />
            what gender you were assigned.
          </h1>
          <p className="hero-sub">
            Women are diagnosed with depression and anxiety far more than men —
            and men die by suicide at more than twice the rate. Neither gap is
            biology alone. Both come from stigma, unequal violence, and care
            that wasn't built with everyone in mind.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#stats">
              See the evidence
            </a>
            <a className="btn btn-ghost" href="#help">
              Find help now
            </a>
          </div>
        </div>
        <div className="hero-card glass">
          <p className="hero-card-eyebrow">Right now, worldwide</p>
          <p className="hero-card-figure">1 in 8</p>
          <p className="hero-card-caption">people live with a mental health condition</p>
          <div className="hero-card-split">
            <div>
              <span className="dot dot-a" /> 581.5M women affected
            </div>
            <div>
              <span className="dot dot-b" /> 513.9M men affected
            </div>
          </div>
          <p className="hero-card-source">Source: WHO, World Mental Health Today, 2025</p>
        </div>
      </div>
    </section>
  );
}

function BackToTop() {
  return (
    <a className="back-to-top" href="#top" aria-label="Back to homepage" title="Back to homepage">
      <span aria-hidden="true">←</span>
    </a>
  );
}

function Issue() {
  const ref = useReveal();
  return (
    <section id="issue" className="section">
      <BackToTop />
      <div ref={ref} className="reveal issue-grid">
        <div>
          <h2>Two genders, two very different gaps</h2>
          <p>
            Depression and anxiety are diagnosed in women roughly one and a
            half times as often as in men — partly because women are more
            likely to seek help, and partly because untreated trauma from
            gender-based violence lands disproportionately on them.
          </p>
          <p>
            Men are undertreated in almost the opposite way: taught early to
            hide distress, their depression often reads as anger, exhaustion
            or reckless behaviour instead of sadness. It goes unnamed, and
            unnamed pain doesn't get referred to care — it shows up later as
            one of the starkest gaps in public health: men die by suicide at
            more than twice the rate of women, in nearly every country on
            earth.
          </p>
          <p>
            Closing either gap means designing mental health support around
            how gender actually shapes symptoms, stigma and access — not
            around a single default patient.
          </p>
        </div>
        <div className="issue-card glass">
          <h3>Who this leaves out</h3>
          <ul>
            <li>Men discouraged from naming what they feel</li>
            <li>Survivors of gender-based violence carrying untreated trauma</li>
            <li>Trans and non-binary people facing care that misgenders them</li>
            <li>Mothers with postpartum depression dismissed as "just tired"</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const ref = useReveal();
  const [topic, setTopic] = useState("all");
  const comparisons = topic === "all"
    ? Object.entries(COMPARISONS)
    : [[topic, COMPARISONS[topic]]];

  return (
    <section id="stats" className="section section-tint">
      <BackToTop />
      <div ref={ref} className="reveal">
        <p className="kicker">Feature 04 · Evidence at a glance</p>
        <h2 className="section-heading">Mental health by the numbers</h2>
        <p className="section-sub stats-intro">
          Global estimates from 2021–2023. Each chart uses its own scale; these patterns do not show that sex alone causes an outcome.
        </p>
        <div className="dashboard-toolbar">
          <span className="dashboard-scope">Worldwide · sex-disaggregated data</span>
          <label className="comparison-filter">
            <span>Show</span>
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="all">Both charts</option>
              <option value="depression">Depression</option>
              <option value="suicide">Suicide mortality</option>
            </select>
          </label>
        </div>
        <div className={`comparison-grid ${topic === "all" ? "" : "comparison-grid-single"}`}>
          {comparisons.map(([key, comparison]) => {
            const maxValue = Math.max(...comparison.values.map(({ value }) => value));
            return (
              <article className="comparison-panel glass" key={key}>
                <div className="comparison-heading">
                  <div>
                    <h3>{comparison.title}</h3>
                    <p className="comparison-meta">{comparison.population} · {comparison.year}</p>
                  </div>
                  <span className="chart-info" title={comparison.note} aria-label={comparison.note}>i</span>
                </div>
                <p className="comparison-measure">{comparison.measure}</p>
                <div className="comparison-chart" role="img" aria-label={`${comparison.title}, ${comparison.year}: ${comparison.values.map(({ label, value }) => `${label} ${value}${comparison.unit}`).join(", ")}`}>
                  {comparison.values.map((item) => (
                    <div className="chart-row" key={item.label}>
                      <div className="chart-label"><span>{item.label}</span><strong>{item.value}{comparison.unit}</strong></div>
                      <div className="chart-track" aria-hidden="true">
                        <span className={`chart-bar chart-bar-${item.color}`} style={{ width: `${(item.value / maxValue) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <a className="source-button" href={comparison.url} target="_blank" rel="noreferrer">{comparison.source} ↗</a>
              </article>
            );
          })}
        </div>
        <div className="dashboard-highlight glass">
          <div className="highlight-total">
            <strong>727,000</strong>
            <span>suicide deaths worldwide · 2021</span>
          </div>
          <div className="highlight-share">
            <div className="share-label"><strong>73%</strong><span>in low- and middle-income countries</span></div>
            <div className="share-track" role="img" aria-label="73 percent of global suicides occurred in low- and middle-income countries in 2021">
              <span />
            </div>
          </div>
          <a className="source-button" href="https://www.who.int/publications/i/item/9789240110069" target="_blank" rel="noreferrer">WHO source ↗</a>
        </div>
      </div>
    </section>
  );
}

function Quiz() {
  const ref = useReveal();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const question = QUIZ_QUESTIONS[questionIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question?.answer;

  function handleAnswer(answer) {
    if (answered) return;
    setSelectedAnswer(answer);
    if (answer === question.answer) setScore((currentScore) => currentScore + 1);
  }

  function handleNext() {
    if (questionIndex === QUIZ_QUESTIONS.length - 1) {
      setComplete(true);
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setComplete(false);
  }

  function getLearningMessage() {
    if (score <= 3) return "Keep exploring the website to learn more and challenge the stereotypes around mental health.";
    if (score <= 7) return "Good progress. Keep questioning assumptions and sharing what you learn about equality.";
    return "Great work. Keep sharing awareness and supporting mental health equality in your community.";
  }

  return (
    <section id="quiz" className="section quiz-section">
      <BackToTop />
      <div ref={ref} className="reveal">
        <div className="quiz-heading-row">
          <div>
            <p className="kicker">Feature 03 · Learn by doing</p>
            <h2 className="section-heading">Myth or Fact?</h2>
            <p className="section-sub">
              Challenge harmful stereotypes about gender and mental health. Choose an answer to see the explanation.
            </p>
          </div>
          <div className="quiz-score-badge" aria-live="polite">
            <span>Score</span>
            <strong>{score}<small>/{QUIZ_QUESTIONS.length}</small></strong>
          </div>
        </div>

        <div className="quiz-panel glass">
          {complete ? (
            <div className="quiz-result" aria-live="polite">
              <p className="quiz-result-label">Quiz complete</p>
              <p className="quiz-result-score">{score}<span> / {QUIZ_QUESTIONS.length}</span></p>
              <h3>{getLearningMessage()}</h3>
              <p>Every question is an invitation to keep learning, listen with care and make support more accessible to everyone.</p>
              <button className="btn btn-primary" type="button" onClick={restartQuiz}>Restart quiz ↻</button>
            </div>
          ) : (
            <>
              <div className="quiz-progress-row">
                <span>Question {questionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>{Math.round(((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}% explored</span>
              </div>
              <div className="quiz-progress" aria-label={`Question ${questionIndex + 1} of ${QUIZ_QUESTIONS.length}`}>
                <span style={{ width: `${((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
              <h3 className="quiz-question">{question.statement}</h3>
              <div className="quiz-options" role="group" aria-label="Answer choices">
                {["Myth", "Fact"].map((answer) => (
                  <button
                    className={`quiz-option ${selectedAnswer === answer ? (isCorrect ? "correct" : "incorrect") : ""}`}
                    type="button"
                    key={answer}
                    onClick={() => handleAnswer(answer)}
                    disabled={answered}
                  >
                    <span className="quiz-option-letter">{answer === "Myth" ? "A" : "B"}</span>
                    <span>{answer}</span>
                    {selectedAnswer === answer && <span className="quiz-option-mark" aria-hidden="true">{isCorrect ? "✓" : "×"}</span>}
                  </button>
                ))}
              </div>
              {answered && (
                <div className={`quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`} role="status">
                  <strong>{isCorrect ? "That's right." : `The answer is ${question.answer}.`}</strong>
                  <p>{question.explanation}</p>
                  <button className="btn btn-ghost quiz-next" type="button" onClick={handleNext}>
                    {questionIndex === QUIZ_QUESTIONS.length - 1 ? "See my result" : "Next question"} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="quiz-myths">
          <h3 className="quiz-myths-heading">Explore more myths &amp; facts</h3>
          <p className="section-sub">Tap a card to flip it and reveal a perspective worth sharing.</p>
          <div className="myths-grid">
            {MYTHS.map((m) => (
              <FlipCard key={m.myth} item={m} />
            ))}
          </div>
          <button
            className="see-more-button"
            type="button"
            onClick={() => setShowMore((isShown) => !isShown)}
            aria-expanded={showMore}
            aria-controls="stereotype-learning"
          >
            <span>{showMore ? "Show less" : "See more"}</span>
            <span className="see-more-arrow" aria-hidden="true">{showMore ? "↑" : "↓"}</span>
          </button>
          {showMore && (
            <div className="additional-myths" id="stereotype-learning">
              <p className="quiz-result-label">Five more to explore</p>
              <div className="myths-grid">
                {EDUCATIONAL_STEREOTYPES.map((item) => (
                  <FlipCard
                    key={item.stereotype}
                    item={{ myth: item.stereotype, fact: item.response }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Laws() {
  const ref = useReveal();
  return (
    <section id="laws" className="section">
      <BackToTop />
      <div ref={ref} className="reveal">
        <h2 className="section-heading">Laws &amp; policy</h2>
        <p className="section-sub">
          What's already on the books, from Manila to Geneva.
        </p>
        <div className="timeline">
          {LAWS.map((law) => (
            <div key={law.title} className="timeline-item">
              <div className="timeline-year">{law.year}</div>
              <div className="timeline-card glass">
                <h3>{law.title}</h3>
                <p>{law.body}</p>
                <a href={law.link} target="_blank" rel="noreferrer">
                  {law.linkLabel} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ item }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      className={`flip-card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      aria-label="Flip to reveal the fact"
    >
      <div className="flip-inner">
        <div className="flip-face flip-front glass">
          <p className="flip-label">Myth</p>
          <p>&ldquo;{item.myth}&rdquo;</p>
          <span className="flip-hint">Tap to reveal the fact</span>
        </div>
        <div className="flip-face flip-back glass">
          <p className="flip-label">Fact</p>
          <p>&ldquo;{item.fact}&rdquo;</p>
        </div>
      </div>
    </button>
  );
}

function Help() {
  const ref = useReveal();
  return (
    <section id="help" className="section">
      <BackToTop />
      <div ref={ref} className="reveal">
        <h2 className="section-heading">Get help now</h2>
        <p className="section-sub">
          Free and confidential, anywhere in the Philippines. If someone is in
          immediate danger, call 911.
        </p>
        <div className="hotline-grid">
          {HOTLINES.map((h) => (
            <a key={h.name} className="hotline-card glass" href={`tel:${h.tel}`}>
              <span className="hotline-name">{h.name}</span>
              <span className="hotline-number">{h.number}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pledge() {
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", pledge: false });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.pledge) return;
    setStatus("sending");
    try {
      // Wire this up to your Laravel API, e.g.:
      // await fetch("/api/pledges", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      await new Promise((r) => setTimeout(r, 600));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="pledge" className="section section-tint">
      <BackToTop />
      <div ref={ref} className="reveal pledge-grid">
        <div>
          <h2>Take the pledge</h2>
          <p>
            Add your name to commit to checking in on the people around you —
            regardless of their gender — and to challenge stigma when you see
            it.
          </p>
        </div>
        <form className="pledge-card glass" onSubmit={handleSubmit}>
          {status === "done" ? (
            <p className="pledge-thanks">Thank you for adding your name.</p>
          ) : (
            <>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Juan Dela Cruz"
                required
              />
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.pledge}
                  onChange={(e) => setForm({ ...form, pledge: e.target.checked })}
                />
                I pledge to listen without judgment and speak up against
                stigma.
              </label>
              <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Sign the pledge"}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-loop loop-violet" />
              <span className="brand-mark-loop loop-teal" />
              <span className="brand-mark-core">=</span>
            </span>
            MindEqual
          </p>
          <p className="footer-tag">
            A student project on gender and mental health equity.
          </p>
        </div>
        <div>
          <h4>References</h4>
          <ul className="references">
            {REFERENCES.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="footer-copy">
        Built for awareness, not diagnosis. If you or someone you know is in
        crisis, call the NCMH Crisis Hotline at 1553.
      </p>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("mindequal-theme") || "light";
  });
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mindequal-theme", theme);
  }, [theme]);

  useEffect(() => {
    const sections = NAV_ITEMS.map(([href]) => document.querySelector(href)).filter(Boolean);
    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.3;
      const current = sections.reduce((active, section) => {
        return section.offsetTop <= marker ? section : active;
      }, sections[0]);
      if (current) setActiveSection(current.id);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <div className="app">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <SideNav activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="page-content">
        <Hero />
        <Issue />
        <Quiz />
        <Stats />
        <Laws />
        <Help />
        <Pledge />
      </main>
      <Footer />
    </div>
  );
}
