import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '@/api/post';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { CreatePostRequest } from '@/types/post';

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreatePostRequest) => createPost(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
    },
  });
}
