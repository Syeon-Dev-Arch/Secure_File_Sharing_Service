import { useState } from "react";

function DownloadCard({ fileInfo, downloadFile }) {
  const [password, setPassword] = useState("");

  return (
    <div className="w-full rounded-3xl bg-white p-6 md:p-8 shadow-xl text-black">
      <h1 className="text-3xl font-bold">Download File</h1>

      <div className="mt-8 space-y-4">
        <div>
          <p className="text-gray-500">File</p>
          <p className="font-semibold text-lg">{fileInfo.originalName}</p>
        </div>

        <div>
          <p className="text-gray-500">Expires</p>
          <p>{new Date(fileInfo.expireAt).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-gray-500">Downloads Left</p>
          <p>{fileInfo.maxDownloadCount - fileInfo.downloadCount}</p>
        </div>
      </div>

      {fileInfo.passwordProtected && (
        <div className="mt-8">
          <label className="block mb-2 font-medium">Password</label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>
      )}

      <button
        onClick={() => downloadFile(password)}
        className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700"
      >
        Download File
      </button>
    </div>
  );
}

export default DownloadCard;
