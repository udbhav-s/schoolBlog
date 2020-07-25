import { watch, ref, Ref } from "@vue/composition-api";
import { QueryOptions, ApiResponse } from '@/types';

export default function useList<T>(
  loadFunction: (opts: QueryOptions) => Promise<ApiResponse<T[]>>,
  limit: number = 20,
  queryOptions?: Ref<Partial<QueryOptions>>
) {
  const items = ref<T[]>([]);
  const hasMoreItems = ref<boolean>(true);
  const loading = ref<boolean>(false);
  const options = {
    limit,
    offset: 0
  };;

  const loadItems = async (reset?: boolean) => {
    if (reset) {
      items.value = [];
      options.offset = 0;
      hasMoreItems.value = true;
    }

    const opts = {
      ...queryOptions?.value,
      ...options
    };

    // if (props.userId) opts.userId = props.userId;
    // if (props.drafts) opts.published = false;

    loading.value = true;
    const result = await loadFunction(opts);
    loading.value = false;
    if (!("success" in result)) throw result.message;

    if (result.data.length > 0) {
      items.value.push(...result.data);
      options.offset += options.limit;
    }
    if (result.data.length < options.limit) hasMoreItems.value = false;
  };

  if (queryOptions && queryOptions.value) {
    watch(queryOptions, () => {
      loadItems(true);
    });
  }

  return {
    items,
    hasMoreItems,
    loading,
    loadItems
  }
}