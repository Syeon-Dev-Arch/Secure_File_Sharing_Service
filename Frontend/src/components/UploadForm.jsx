import { useState } from "react";
import axios from "axios";
import SuccessCard from "./SuccessCard";

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [expiry, setExpiry] = useState("24h");
  const [maxDownload, setMaxDownload] = useState(1);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("expire", expiry);
      formData.append("maxDownloadCount", maxDownload);
      formData.append("password", password);
      console.log(formData);
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/files/upload",
        formData,
      );
      console.log(response);

      setResult(response.data.fileData);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setExpiry("24h");
    setMaxDownload(1);
    setPassword("");
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white p-6 md:p-8 text-black shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Secure File Sharing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Choose File</label>

          <input
            type="file"
            onChange={handleFile}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Expiry</label>

          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="1h">1 Hour</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Max Downloads</label>

          <input
            type="number"
            min={1}
            value={maxDownload}
            onChange={(e) => setMaxDownload(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Password (Optional)</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {selectedFile && (
          <div className="rounded-xl bg-gray-100 p-4">
            <p className="font-semibold">Selected File</p>

            <p>{selectedFile.name}</p>

            <p className="text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-4 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Securely"}
        </button>
      </form>

      {/* SUCCESS */}

      {result && <SuccessCard result={result} resetForm={resetForm} />}

      {/* ERROR */}
      {error && (
        <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

export default UploadForm;
