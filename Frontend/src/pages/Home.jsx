import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <section className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20 text-black">
          {/* Centered container for the header block */}
          <div className="flex flex-col items-center">
            {/* Inner box matches heading width and right-aligns subtext */}
            <div className="flex flex-col items-end">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Secure File Sharing
              </h1>

              <p className="text-xs md:text-sm text-slate-600 mt-2 font-medium">
                AES-256-GCM • Password Protection • Expiry • Download Limits
              </p>
            </div>
          </div>

          <div className="mt-20">
            <UploadForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
