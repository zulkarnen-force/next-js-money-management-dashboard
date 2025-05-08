"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const  excelDateToJSDate = (serial: number): string =>  {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; // 86400 seconds in a day
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    const minutes = Math.floor(total_seconds / 60) % 60;
    const hours = Math.floor(total_seconds / 3600);

    date_info.setHours(hours);
    date_info.setMinutes(minutes);
    date_info.setSeconds(seconds);

    return date_info.toISOString(); // or format as you like
}
  const handleUpload = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    // Fix the "Period" column
    const fixedJson = json.map((row) => {
      const fixedRow = { ...row };
      if (typeof fixedRow.Period === "number") {
        fixedRow.Period = excelDateToJSDate(fixedRow.Period);
      }
      return fixedRow;
    });

    const res = await fetch("/api/import", {
      method: "POST",
      body: JSON.stringify(fixedJson),
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
