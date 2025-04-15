"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);

    const res = await fetch("/api/import", {
      method: "POST",
      body: JSON.stringify(json),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) alert("Import successful!");
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Upload & Import
      </button>
    </div>
  );
}
