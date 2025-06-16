import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// @review 테스트를 했으면 지우는편이 나아보이임 필요없는 파일을 제거해야 빌드속도가 빨라짐 해당처럼 쓸데없는 파일이 있는경우 빌드 속도 느려짐
export default function SupabaseTest() {
  const [status, setStatus] = useState("로딩 중...");

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("posts").select().limit(1);
      if (error) {
        setStatus(`연결 실패: ${error.message}`);
      } else {
        setStatus("Supabase 연결 성공!");
      }
    };

    testConnection();
  }, []);

  return <div>{status}</div>;
}
