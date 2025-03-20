"use client";

import { useState, useMemo } from "react";
import { useProject } from "@/context/ProjectContext";
import { Download, FileSpreadsheet, Loader2, Eye } from "lucide-react";
import * as XLSX from "xlsx";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

interface EstimationResponse {
  message: string;
  effortEstimationUrl: string;
}

interface ExcelSheet {
  sheetName: string;
  data: any[];
  columns: any[];
}

export default function EffortAndCost() {
  const { currentProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheets, setSheets] = useState<ExcelSheet[]>([]);
  const [activeSheetName, setActiveSheetName] = useState("");
  const [isViewing, setIsViewing] = useState(false);

  const buttonText = isViewing
    ? isLoading
      ? "Loading..."
      : "Hide Estimation"
    : isLoading
    ? "Loading..."
    : "View Estimation";

  const handleView = async () => {
    if (isViewing) {
      setIsViewing(false);
      return;
    }

    if (!currentProject?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/estimation/${currentProject._id}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch estimation file");
      }

      const data: EstimationResponse = await response.json();
      const fileResponse = await fetch(data.effortEstimationUrl);
      const blob = await fileResponse.blob();
      const buffer = await blob.arrayBuffer();

      const workbook = XLSX.read(buffer, { type: "array" });
      const columnHelper = createColumnHelper<any>();

      const processedSheets = workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const columns =
          jsonData.length > 0
            ? Object.keys(jsonData[0] as Record<string, any>).map((key) =>
                columnHelper.accessor(key, { header: key })
              )
            : [];

        return {
          sheetName,
          data: jsonData,
          columns,
        };
      }).filter((sheet) => sheet.data.length > 0); // Filter out empty sheets

      if (processedSheets.length === 0) {
        throw new Error("No data found in the estimation file");
      }

      setSheets(processedSheets);
      setActiveSheetName(processedSheets[0].sheetName);
      setIsViewing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to view file");
      console.error("Error viewing estimation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!currentProject?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/estimation/${currentProject._id}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch estimation file");
      }

      const data: EstimationResponse = await response.json();

      const link = document.createElement("a");
      link.href = data.effortEstimationUrl;
      link.target = "_blank";
      link.download = `effort_estimation_${currentProject._id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file");
      console.error("Error downloading estimation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeSheet = useMemo(
    () => sheets.find((sheet) => sheet.sheetName === activeSheetName),
    [sheets, activeSheetName]
  );

  const table = useReactTable({
    data: activeSheet?.data || [],
    columns: activeSheet?.columns || [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Effort and Cost Estimation
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleView}
              disabled={isLoading}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                isViewing
                  ? "bg-gray-600 hover:bg-gray-700"
                  : isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Eye className={`w-5 h-5 ${isViewing ? "opacity-50" : ""}`} />
              )}
              <span >{buttonText}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <FileSpreadsheet className="w-5 h-5" />
                  <Download className="w-5 h-5" />
                </>
              )}
              <span>
                {isLoading ? "Downloading..." : "Download Estimation"}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg mt-4">
            {error}
          </div>
        )}

        {isViewing && sheets.length > 0 && (
          <div className="mt-6">
            <div className="flex border-b border-gray-200 mb-4">
              {sheets.map((sheet) => (
                <button
                  key={sheet.sheetName}
                  onClick={() => setActiveSheetName(sheet.sheetName)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSheetName === sheet.sheetName
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {sheet.sheetName}
                </button>
              ))}
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-gray-600 mt-6">
          <p>
            Download or view the detailed effort and cost estimation for your
            project. The Excel file contains multiple sheets including:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Effort Estimation - Feature-wise effort breakdown</li>
            <li>Cost Estimation - Detailed cost calculations</li>
            <li>Resource Allocation - Team member assignments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
