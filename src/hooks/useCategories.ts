import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('posts').select('category');

      if (!error && data) {
        const itemCategory = Array.from(new Set(data.map(item => item.category)));
        setCategories(itemCategory);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return { categories, loading };
}
