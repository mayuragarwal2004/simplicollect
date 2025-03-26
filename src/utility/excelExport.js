const highlightTableHeadingRow = (row) => {
  row.eachCell({ includeEmpty: false }, (cell) => {
    cell.border = {
      top: { style: "medium" },
      left: { style: "thin" },
      bottom: { style: "medium" },
      right: { style: "thin" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9D9D9" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
};

const highlightTableDataRow = (row) => {
  row.eachCell((cell, colNumber) => {
    // Default thin border for all sides
    let border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // If it's the first cell, make the RIGHT border medium
    if (colNumber === 1) {
      border.right = { style: "medium" };
    }

    cell.border = border;
  });
};

module.exports = {
  highlightTableHeadingRow,
  highlightTableDataRow,
};
