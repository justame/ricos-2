export const getCellNeighbors = (tableMap, tableStart, cellPos) => {
  const cellRelativePos = cellPos - tableStart;
  const cellIndex = tableMap.map.indexOf(cellRelativePos);
  const left = cellIndex % tableMap.width !== 0 && tableMap.map[cellIndex - 1];
  const right = cellIndex + (1 % tableMap.width) !== 0 && tableMap.map[cellIndex + 1];
  const top = cellIndex >= tableMap.width && tableMap.map[cellIndex - tableMap.width];
  const bottom =
    cellIndex < tableMap.height * tableMap.width - tableMap.width &&
    tableMap.map[cellIndex + tableMap.width];
  return { left, right, top, bottom };
};
