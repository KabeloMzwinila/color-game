import { useMemo, useState } from 'react';

type Mode = 'home' | 'colors' | 'categories' | 'objects';

type ColorOption = {
  name: string;
  value: string;
};

type ObjectOption = {
  emoji: string;
  color: string;
};

const COLORS: ColorOption[] = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Brown', value: '#a16207' },
];

const CATEGORIES: string[] = [
  'Fruits',
  'Vegetables',
  'Animals',
  'Toys',
  'Cars',
  'Things at Home',
  'Things Outside',
];

const OBJECTS: ObjectOption[] = [
  { emoji: '🍓', color: 'Red' },
  { emoji: '🚒', color: 'Red' },
  { emoji: '🥒', color: 'Green' },
  { emoji: '🐸', color: 'Green' },
  { emoji: '💧', color: 'Blue' },
  { emoji: '🫐', color: 'Blue' },
  { emoji: '🍌', color: 'Yellow' },
  { emoji: '☀️', color: 'Yellow' },
  { emoji: '🎃', color: 'Orange' },
  { emoji: '🥕', color: 'Orange' },
];

function speakLabel(label: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(label);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

function pickRandom<T>(items: T[], avoid?: T): T | undefined {
  if (items.length === 0) return undefined;
  if (items.length === 1) return items[0];

  let choice = items[Math.floor(Math.random() * items.length)];
  while (avoid !== undefined && choice === avoid) {
    choice = items[Math.floor(Math.random() * items.length)];
  }

  return choice;
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    background: '#f8fafc',
    color: '#0f172a',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 28,
    background: 'white',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
  },
  inner: { padding: 20 },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 16, fontWeight: 700 },
  homeIcon: {
    width: 40,
    height: 40,
    borderRadius: '999px',
    border: 'none',
    background: '#e2e8f0',
    fontSize: 18,
  },
  bigPanel: {
    minHeight: '50vh',
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  badge: {
    background: 'rgba(255,255,255,0.9)',
    padding: '14px 18px',
    borderRadius: 999,
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
  },
  colorText: { fontSize: 42, fontWeight: 900, letterSpacing: 0.5 },
  subText: { fontSize: 18, fontWeight: 600, marginTop: 6 },
  emoji: { fontSize: 88, lineHeight: 1 },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 10,
    marginTop: 16,
  },
  twoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginTop: 16,
  },
  button: {
    height: 64,
    borderRadius: 18,
    border: 'none',
    fontSize: 18,
    fontWeight: 700,
  },
  primary: { background: '#0f172a', color: 'white' },
  secondary: {
    background: 'white',
    color: '#0f172a',
    border: '2px solid #cbd5e1',
  },
  homeTop: { textAlign: 'center', paddingTop: 10, paddingBottom: 8 },
  homeIconBig: {
    width: 56,
    height: 56,
    borderRadius: '999px',
    background: '#0f172a',
    color: 'white',
    display: 'grid',
    placeItems: 'center',
    fontSize: 28,
    margin: '0 auto 12px',
  },
  homeTitle: { fontSize: 34, fontWeight: 900, margin: 0 },
  homeSubtitle: { margin: '6px 0 0', color: '#64748b' },
  hint: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
} as const;

export default function ColorGamePrototype() {
  const [mode, setMode] = useState<Mode>('home');
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [currentObject, setCurrentObject] = useState(OBJECTS[0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);

  const title = useMemo(() => {
    if (mode === 'colors') return 'Colors';
    if (mode === 'categories') return 'Categories';
    if (mode === 'objects') return 'Guess the Color';
    return 'Color Game';
  }, [mode]);

  const nextPrompt = () => {
    if (mode === 'objects') {
      const nextObj = pickRandom(OBJECTS, currentObject) ?? currentObject;
      setCurrentObject(nextObj);
      setShowAnswer(false);
    } else {
      const nextColor = pickRandom(COLORS, currentColor) ?? currentColor;
      const nextCategory = pickRandom(CATEGORIES, currentCategory) ?? currentCategory;
      setCurrentColor(nextColor);
      setCurrentCategory(nextCategory);

      if (mode === 'colors') {
        speakLabel(nextColor.name);
      }
    }

    setAnimateKey((key) => key + 1);
  };

  const startColors = () => {
    const nextColor = pickRandom(COLORS) ?? COLORS[0];

    setMode('colors');
    setShowAnswer(false);
    setCurrentColor(nextColor);
    setAnimateKey((key) => key + 1);
    speakLabel(nextColor.name);
  };

  const startCategories = () => {
    setMode('categories');
    setShowAnswer(false);
    setCurrentColor(pickRandom(COLORS) ?? COLORS[0]);
    setCurrentCategory(pickRandom(CATEGORIES) ?? CATEGORIES[0]);
    setAnimateKey((key) => key + 1);
  };

  const startObjects = () => {
    setMode('objects');
    setShowAnswer(false);
    setCurrentObject(pickRandom(OBJECTS) ?? OBJECTS[0]);
    setAnimateKey((key) => key + 1);
  };

  const revealObjectAnswer = () => {
    if (mode !== 'objects') return;
    setShowAnswer(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.inner}>
          {mode === 'home' ? (
            <>
              <div style={styles.homeTop}>
                <div style={styles.homeIconBig}>✨</div>
                <h1 style={styles.homeTitle}>Color Game</h1>
                <p style={styles.homeSubtitle}>Tap a mode and play.</p>
              </div>

              <div style={styles.buttonGrid}>
                <button style={{ ...styles.button, ...styles.primary }} onClick={startColors}>
                  Colors
                </button>
                <button style={{ ...styles.button, ...styles.secondary }} onClick={startCategories}>
                  Categories
                </button>
                <button style={{ ...styles.button, ...styles.secondary }} onClick={startObjects}>
                  Guess the Color
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.header}>
                <button style={styles.homeIcon} onClick={() => setMode('home')}>
                  🏠
                </button>
                <div style={styles.title}>{title}</div>
                <div style={{ width: 40 }} />
              </div>

              <div
                key={animateKey}
                style={{
                  ...styles.bigPanel,
                  background: mode === 'objects' ? '#ffffff' : currentColor.value,
                }}
                onClick={mode === 'objects' ? revealObjectAnswer : undefined}
                role={mode === 'objects' ? 'button' : undefined}
                aria-label={mode === 'objects' ? 'Reveal answer' : undefined}
              >
                {mode === 'objects' ? (
                  !showAnswer ? (
                    <div>
                      <div style={styles.emoji}>{currentObject.emoji}</div>
                      <div style={styles.hint}>Tap to see the color</div>
                    </div>
                  ) : (
                    <div style={styles.badge}>
                      <div style={styles.colorText}>{currentObject.color.toUpperCase()}</div>
                    </div>
                  )
                ) : (
                  <div style={styles.badge}>
                    <div style={styles.colorText}>{currentColor.name.toUpperCase()}</div>
                    {mode === 'categories' ? <div style={styles.subText}>+ {currentCategory}</div> : null}
                  </div>
                )}
              </div>

              <div style={styles.twoGrid}>
                <button style={{ ...styles.button, ...styles.primary }} onClick={nextPrompt}>
                  Next
                </button>
                <button style={{ ...styles.button, ...styles.secondary }} onClick={() => setMode('home')}>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
