import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";

function Upload() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-5xl font-bold">Upload File</h1>

          <p className="mt-3 text-zinc-400">
            Securely upload your file with encryption, expiry date, password
            protection and download limits.
          </p>

          <div className="mt-12">
            <UploadForm />
          </div>
        </div>
      </main>
    </>
  );
}

export default Upload;
