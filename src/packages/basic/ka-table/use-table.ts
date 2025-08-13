import { ref } from "vue";
import type { IObject, ITableInstance } from "./types";

function useTable() {
  const tableRef = ref<ITableInstance>();

  // 搜索
  function handleQueryClick(queryParams: IObject) {
    tableRef.value?.fetchPageData(queryParams, true);
  }

  // 重置
  function handleResetClick(queryParams: IObject) {
    tableRef.value?.fetchPageData(queryParams, true);
  }

  // 刷新
  function handleRefreshClick() {
    tableRef.value?.handleRefresh();
  }

  // 获取选中数据
  function getSelectionData() {
    return tableRef.value?.getSelectionData() || [];
  }

  return {
    tableRef,
    handleQueryClick,
    handleResetClick,
    handleRefreshClick,
    getSelectionData,
  };
}

export default useTable;
