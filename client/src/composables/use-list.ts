import { watch, ref, Ref } from "@vue/composition-api";
import { QueryOptions } from '@/types';

export default function useList<T>(
  loadFunction: (opts: QueryOptions) => Promise<T[]>,
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

    loading.value = true;

    try {
      const result = await loadFunction(opts);
      if (result.length > 0) {
        items.value.push(...result);
        options.offset += options.limit;
      }
      if (result.length < options.limit) hasMoreItems.value = false;
    } catch (err) {
      loading.value = false;
      throw err;
    }

    loading.value = false;
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