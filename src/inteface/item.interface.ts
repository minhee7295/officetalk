export interface IPostData {
  id: string;
  title: string;
  category: string;
  content: string;
  reg_dt: string;
  like_count?: number;
  comment_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  reg_dt: string;
  users?: {
    nickname: string;
  };
}

export interface PostFormInput {
  title: string;
  content: string;
  category: string;
  image_url?: string;
  userId: string;
}

export interface HeaderProps {
  onSearch: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

export interface SessionUser {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'admin';
}
