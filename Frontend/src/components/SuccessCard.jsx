import { useState } from "react";

function SuccessCard({ result, resetForm }) {
  const [copied, setCopied] = useState(false);

  const frontendLink = result.downloadingLink.replace(
    "http://localhost:4000",
    "http://localhost:5173",
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(frontendLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="mt-10 rounded-3xl border border-green-300 bg-green-50 p-6 md:p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-green-700">Upload Successful</h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-gray-500">File</p>
          <p className="font-semibold">{result.name}</p>
        </div>

        <div>
          <p className="text-gray-500">Share ID</p>
          <p>{result.shareId}</p>
        </div>

        <div>
          <p className="text-gray-500">Expires</p>
          <p>{new Date(result.expireDate).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-gray-500">Download Limit</p>
          <p>{result.maxDownload}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Download Link</p>

          <input
            readOnly
            value={frontendLink}
            className="w-full rounded-xl border bg-white p-3"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={copyLink}
          className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {copied ? "Copied ✓" : "Copy Link"}
        </button>

        <a
          href={frontendLink}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700"
        >
          Open Link
        </a>
      </div>

      <button
        onClick={resetForm}
        className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95"
      >
        Upload Another File
      </button>
    </div>
  );
}

export default SuccessCard;
