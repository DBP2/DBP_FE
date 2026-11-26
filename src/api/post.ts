import type { CreatePostRequest, CreatePostResponse } from '@/types/post';

let lastId = 0;

export function createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
  void request;

  lastId = Math.max(Date.now(), lastId + 1);

  return Promise.resolve({
    id: String(lastId),
  });
}
