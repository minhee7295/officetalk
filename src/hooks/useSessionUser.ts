import { useEffect, useState } from 'react';

export default function useSessionUser() {
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const user = sessionStorage.getItem('session-user');
    if (user) setSessionUser(JSON.parse(user));
  }, []);

  return sessionUser;
}
