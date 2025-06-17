import { PostDetail } from "@/hooks/usePostDetail";

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
  image_url?: string | null;
  user_id: string;
}

export interface FormValues {
  title: string;
  category: string;
  content: string;
}

// react-hook-form 관련 props 타입
import { Control, FieldErrors } from "react-hook-form";

export interface FormProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  categories: string[];
  categoryLoading: boolean;
}

export interface HeaderProps {
  onSearch: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

export interface SessionUser {
  id: string;
  email: string;
  password: string;
  nickname: string;
  role: "user" | "admin";
}

export interface PostDetailCardProps {
  post: PostDetail;
  sessionUser: SessionUser;
}
