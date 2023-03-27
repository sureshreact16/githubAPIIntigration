import { useState, useEffect, memo } from "react";
import DynamicTable from "./DynamicTable";

const headers = [
  "Conversation",
  "Conversation Date",
  "Last comment",
  "Commented By",
  "Open since",
  "Actions",
];

function ConversationsTable({ data }) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const generateTableData = () => {
      const uniqueNumbers = new Set();
      const newData = [];

      for (let i = data.length - 1; i >= 0; i--) {
        if (!uniqueNumbers.has(data[i].original_position)) {
          uniqueNumbers.add(data[i].original_position);
          newData.push(data[i]);
        }
      }

      setTableData(newData);
    };

    generateTableData();
  }, [data]);

  return (
    <div>
      <DynamicTable tableData={tableData} headers={headers} />
    </div>
  );
}

export default memo(ConversationsTable, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
