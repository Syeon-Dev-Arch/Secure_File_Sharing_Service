import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DownloadCard from "../components/DownloadCard";

function Download() {
  const { shareId } = useParams();

  const [fileInfo, setFileInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFileInfo();
  }, []);

  const getFileInfo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/files/info/${shareId}`,
      );

      setFileInfo(res.data.file);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load file information.",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (password) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/files/download/${shareId}`,
        {
          inputpassword: password,
        },
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(res.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.originalName;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || "Download failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <DownloadCard fileInfo={fileInfo} downloadFile={downloadFile} />
      </div>
    </div>
  );
}

export default Download;
