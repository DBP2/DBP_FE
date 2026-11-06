import type { CreatePostRequest, CreatePostResponse } from '@/types/post';

export function createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
  void request;
  return Promise.resolve({ id: crypto.randomUUID() });
}
