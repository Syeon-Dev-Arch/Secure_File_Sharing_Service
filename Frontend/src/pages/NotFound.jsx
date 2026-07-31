function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 md:py-5">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-3 text-gray-600">Page Not Found</p>

      <a href="/" className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white">
        Go Home
      </a>
    </div>
  );
}

export default NotFound;
