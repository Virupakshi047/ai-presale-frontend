"use client";

import { useState } from "react";
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

export default function EffortAndCost() {
  const { currentProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isViewing, setIsViewing] = useState(false);

  const handleView = async () => {
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

      // Fetch and process the Excel file
      const fileResponse = await fetch(data.effortEstimationUrl);
      const blob = await fileResponse.blob();
      const buffer = await blob.arrayBuffer();

      // Read the Excel file
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Create columns from the first row
      if (jsonData.length > 0) {
        const columnHelper = createColumnHelper<any>();
        const tableColumns = Object.keys(
          jsonData[0] as Record<string, any>
        ).map((key) => ({
          header: key,
          accessorKey: key,
        }));
        setColumns(tableColumns);
        setTableData(jsonData);
        setIsViewing(true);
      }
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
      // Fetch the estimation URL
      const response = await fetch(
        `http://localhost:8080/estimation/${currentProject._id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch estimation file");
      }

      const data: EstimationResponse = await response.json();

      // Create a temporary link to download the file
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

  const table = useReactTable({
    data: tableData,
    columns,
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200
                ${
                  isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              <span>{isLoading ? "Loading..." : "View Estimation"}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200
                ${
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

        {/* Excel Table View */}
        {isViewing && tableData.length > 0 && (
          <div className="mt-6 border rounded-lg overflow-x-auto">
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
        )}

        <div className="text-gray-600">
          <p>
            Download the detailed effort and cost estimation for your project.
            The Excel file includes:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Feature-wise effort breakdown</li>
            <li>Resource allocation details</li>
            <li>Timeline estimates</li>
            <li>Cost calculations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
