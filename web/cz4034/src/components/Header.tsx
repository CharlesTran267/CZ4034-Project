import Link from 'next/link';

export default function Header() {
  return (
    <header className="navbar bg-base-300">
      <div className="navbar-start">
        <Link className="btn text-xl text-neutral" href="/">
          App Name
        </Link>
      </div>
    </header>
  );
}
