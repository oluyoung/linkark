import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

interface UseSelectRowsProps {
  selectAllFlagged: boolean;
  setSelectAll: Dispatch<SetStateAction<boolean>>;
}

function arrayIncludesObjectWithId<T>(array: T[], id: string) {
  return array.find(item => (item as T & { id: string }).id === id) !== undefined;
}

export function useSelectRows<T>({}: UseSelectRowsProps) {
  const [clickedRows, setClickedRows] = useState<T[]>([]);
  const [selectAllFlagged, setSelectAll] = useState(false);

  const addRowToSelected = (row: T) => {
    if (selectAllFlagged) {
      const newClickedRows = clickedRows.filter(item => (item as T & { id: string }).id !== (row as T & { id: string }).id);
      setClickedRows(newClickedRows);
    } else {
      setClickedRows([...clickedRows, row]);
    }
  };

  const removeRowToSelected = (row: T) => {
    if (selectAllFlagged) {
      setClickedRows([...clickedRows, row]);
    } else {
      const newClickedRows = clickedRows.filter(item => (item as T & { id: string }).id !== (row as T & { id: string }).id);
      setClickedRows(newClickedRows);
    }
  };

  const toggleSelectAll = useCallback((value?: boolean) => {
    if (value && typeof value === 'boolean') {
      setSelectAll(value);
      return;
    }
    setSelectAll(!selectAllFlagged);
  }, [selectAllFlagged]);

  const isRowSelected = useCallback((rowId: string) => {
    return selectAllFlagged ? !arrayIncludesObjectWithId<T>(clickedRows, rowId) : arrayIncludesObjectWithId<T>(clickedRows, rowId);
  }, [clickedRows, selectAllFlagged]);

  return useMemo(() => ({
    clickedRows,
    isRowSelected,
    selectAllFlagged,
    toggleSelectAll,
    addRowToSelected,
    removeRowToSelected
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [clickedRows, selectAllFlagged]);
}
