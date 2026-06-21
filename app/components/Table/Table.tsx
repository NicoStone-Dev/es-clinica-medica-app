import { useState } from "react";
import { ArrowRight } from "@mui/icons-material";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

function Table<T extends { id: number } | { uuid: string }>({
  data,
  columns,
  onRowClick,
}: {
  data: T[];
  columns: Column<T>[];
  onSelectionChange?: (ids: (number | string)[]) => void;
  onRowClick?: (row: T) => void;
}) {
  const [selected, setSelected] = useState<(number | string)[]>([]);

  const rowKey = (row: T): number | string => ("id" in row ? row.id : row.uuid);

  return (
    <div className="w-full overflow-hidden rounded-[10px] border border-surface">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-blue-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border-b border-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-blue-gray-500"
              >
                {col.label}
              </th>
            ))}
            <th className="w-10 border-b border-surface py-3 px-3 text-center"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => {
            const key = rowKey(row);
            const isSelected = selected.includes(key);
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={[
                  "border-b border-surface transition-colors duration-100",
                  i % 2 === 0 ? "bg-surface-variant" : "bg-white",
                  isSelected ? "bg-blue-gray-100" : "",
                  onRowClick ? "cursor-pointer hover:bg-blue-50" : "",
                ].join(" ")}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-[16px] font-semibold text-blue-gray-600"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </td>
                ))}
                <td className=" flex justify-center items-center px-4 py-10">
                  <button className="flex items-center justify-center bg-primary gap-[10px] rounded-[10px] px-3 py-3 text-surface font-medium tracking-wide transition-colors duration-150 hover:opacity-70 cursor-pointer">
                    Selectionar
                    <ArrowRight />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
