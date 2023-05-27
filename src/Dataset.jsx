import React, { useState, useEffect } from "react";
import {
  useTable,
  usePagination,
  useExpanded,
  useGroupBy,
  useSortBy,
} from "react-table";

const Dataset = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  useEffect(() => {
    // Defining table columns
    const columns = [
      { Header: "S.N", accessor: "id" },
      { Header: "Recipe Name", accessor: "name" },
      {
        Header: "Image",
        accessor: "image",
        Cell: (props) => (
          <img src={props.row.original.image} alt="Food" width="40px" />
        ),
      },
      { Header: "Price", accessor: "price", editable: true },
      { Header: "Category", accessor: "category" },
    ];

    setColumns(columns);

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json"
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h3>Click on the Column to Filter</h3>
      </div>
      <table {...getTableProps()} className="table table-hover table-bordered">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : "🔽"}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Dataset;
