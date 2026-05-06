export interface BuildVote {
  build_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  build_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentWithAuthor extends Comment {
  profiles: {
    display_name: string;
    battletag: string | null;
  };
}
