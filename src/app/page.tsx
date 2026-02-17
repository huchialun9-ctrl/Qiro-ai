import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Combine, Brain, MousePointer2 } from 'lucide-react';
import styles from './landing.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Image src="/logo.jpg" alt="Qiroai Logo" width={40} height={40} className={styles.logoImage} />
          <span>Qiroai</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className={styles.navCta} style={{ background: 'transparent', border: '1px solid #e0e0e0', color: '#333' }}>
            Log In
          </Link>
          <Link href="/signup" className={styles.navCta}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.floatingShape} ${styles.shape1}`}>
          <Zap size={64} color="#ffd02f" fill="#ffd02f" style={{ opacity: 0.5 }} />
        </div>
        <div className={`${styles.floatingShape} ${styles.shape2}`}>
          <Brain size={80} color="#e6c0ff" fill="#e6c0ff" style={{ opacity: 0.4 }} />
        </div>

        <h1 className={styles.heroHeadline}>
          Where Ideas Flow,<br />
          and AI Grows Them.
        </h1>
        <p className={styles.heroSub}>
          An infinite canvas for creative collaboration. Drag, drop, and let our
          AI Agents connecting the dots for you in real-time.
        </p>

        <Link href="/signup" className={styles.mainCta}>
          Start Collaborating Free <ArrowRight size={20} />
        </Link>

        {/* Dynamic Background Demo/Visual could go here, for now using abstract shapes above */}
      </section>

      {/* Feature Grid */}
      <section className={styles.features}>

        {/* Card 1: Infinite Canvas */}
        <div className={styles.featureCard}>
          <div className={`${styles.cardIcon} ${styles.iconYellow}`}>
            <MousePointer2 size={32} />
          </div>
          <h3 className={styles.cardTitle}>Infinite Canvas</h3>
          <p className={styles.cardDesc}>
            A boundless space for your thoughts. Pan, zoom, and organize ideas
            without limits. Just like a physical whiteboard, but smarter.
          </p>
          <div className={styles.fakeUi}>
            <div className={`${styles.fakeNode} ${styles.uiDrag}`} />
            <div className={styles.fakeNode} />
          </div>
        </div>

        {/* Card 2: AI Agents */}
        <div className={styles.featureCard}>
          <div className={`${styles.cardIcon} ${styles.iconPink}`}>
            <Brain size={32} />
          </div>
          <h3 className={styles.cardTitle}>Active AI Agents</h3>
          <p className={styles.cardDesc}>
            Meet your new teammates: The Explorer, The Critic, and The Executor.
            They live on the canvas and react to your ideas instantly.
          </p>
        </div>

        {/* Card 3: Resonance Heatmap */}
        <div className={styles.featureCard}>
          <div className={`${styles.cardIcon} ${styles.iconBlue}`}>
            <Combine size={32} />
          </div>
          <h3 className={styles.cardTitle}>Resonance Heatmap</h3>
          <p className={styles.cardDesc}>
            Our system identifies "hotspots" of potential innovation. Drag your nodes
            there to unlock hidden insights and bridge gaps.
          </p>
        </div>

      </section>
    </main>
  );
}
