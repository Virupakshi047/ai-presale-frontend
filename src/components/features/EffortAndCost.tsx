"use client";

import { useState, useMemo } from "react";
import { useProject } from "@/context/ProjectContext";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  Eye,
  RefreshCw,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

// Define types outside component
interface EstimationResponse {
  message: string;
  effortEstimationUrl: string;
}

interface ExcelData {
  [key: string]: string | number;
}

interface ExcelSheet {
  sheetName: string;
  data: ExcelData[];
  columns: any[]; // We'll keep this any since it's from TanStack Table
}

export default function EffortAndCost() {
  const { currentProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheets, setSheets] = useState<ExcelSheet[]>([]);
  const [activeSheetName, setActiveSheetName] = useState("");
  const [isViewing, setIsViewing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Type-safe column helper
  const columnHelper = createColumnHelper<ExcelData>();

  const buttonText = isViewing
    ? isLoading
      ? "Loading..."
      : "Hide Estimation"
    : isLoading
    ? "Loading..."
    : "View Estimation";

  const processExcelData = (workbook: XLSX.WorkBook): ExcelSheet[] => {
    return workbook.SheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelData[];

      const columns =
        jsonData.length > 0
          ? Object.keys(jsonData[0]).map((key) =>
              columnHelper.accessor(key, { header: key })
            )
          : [];

      return {
        sheetName,
        data: jsonData,
        columns,
      };
    }).filter((sheet) => sheet.data.length > 0);
  };

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/estimation/${currentProject._id}`,
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
      const processedSheets = processExcelData(workbook);

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/estimation/${currentProject._id}`,
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

  const handleRegenerate = async () => {
    if (!currentProject?._id) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/estimation/regenerate/${currentProject._id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate estimation");
      }

      // Refresh the view after regeneration
      await handleView();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to regenerate estimation"
      );
      console.error("Error regenerating estimation:", err);
    } finally {
      setIsRegenerating(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 p-3 sm:p-5">
        Effort and Cost Estimation
      </h2>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Button Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={handleView}
              disabled={isLoading}
              className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 w-full sm:w-auto ${
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
              <span>{buttonText}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 w-full sm:w-auto ${
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
              <span className="whitespace-nowrap">
                {isLoading ? "Downloading..." : "Download Estimation"}
              </span>
            </button>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating || isLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200 cursor-pointer w-full sm:w-auto ${
              isRegenerating || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
            />
            <span>{isRegenerating ? "Regenerating..." : "Re-Generate"}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg mt-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Sheet Tabs and Table */}
        {isViewing && sheets.length > 0 && (
          <div className="mt-6">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
              {sheets.map((sheet) => (
                <button
                  key={sheet.sheetName}
                  onClick={() => setActiveSheetName(sheet.sheetName)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeSheetName === sheet.sheetName
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {sheet.sheetName}
                </button>
              ))}
            </div>

            <div className="border rounded-lg overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                          className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500"
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

        {/* Description */}
        <div className="text-gray-600 mt-6 text-sm sm:text-base">
          <p>
            Download or view the detailed effort and cost estimation for your
            project. The Excel file contains multiple sheets including:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Effort Estimation - Feature-wise effort breakdown</li>
            <li>Cost Summary - Detailed cost calculations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
