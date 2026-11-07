import { create } from 'zustand';

import type { PostDraft } from '@/types/post';

interface PostDraftState {
  draft: PostDraft | null;
  setDraft: (draft: PostDraft) => void;
  clearDraft: () => void;
}

export const usePostDraftStore = create<PostDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
