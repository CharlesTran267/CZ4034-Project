export default function Footer() {
    return (
      <footer className="bottom-0 left-0 right-0 bg-base-300 py-2 text-center text-sm">
        &copy; {process.env.NEXT_PUBLIC_APP_NAME} 2024
      </footer>
    );
  }
  