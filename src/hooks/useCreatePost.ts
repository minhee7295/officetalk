import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostFormInput } from '@/inteface/item.interface';

export default function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (postData: PostFormInput) => {
    setLoading(true);
    setError(null);

    const { title, content, category, image_url, userId } = postData;

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        category,
        image_url,
        user_id: userId,
        reg_dt: new Date().toISOString(),
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    return data;
  };

  return { createPost, loading, error };
}
