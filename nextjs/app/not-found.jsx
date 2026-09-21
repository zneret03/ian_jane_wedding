import Link from 'next/link';

export const metadata = { title: 'Page not found — Jane & Ian' };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <div>
        <p className="eyebrow">Jane &amp; Ian</p>
        <h1 className="serif" style={{ marginTop: 16, fontSize: 'clamp(30px, 5vw, 48px)' }}>
          This page does not exist
        </h1>
        <p style={{ marginTop: 18, color: 'var(--rust)', fontSize: 15 }}>
          Everything lives on one page.
        </p>
        <Link href="/" className="btn btn--dark" style={{ marginTop: 28 }}>
          Back to the invitation
        </Link>
      </div>
    </main>
  );
}
