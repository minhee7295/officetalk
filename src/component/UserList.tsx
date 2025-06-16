import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

interface UserInfo {
  id: string;
  nickname: string;
  email: string;
}

// @review 사용자를 다불러오면 사용성은? 페이징처리 없음 list처럼 url 쿼리로 페이지네이션을 구현하는게 좋음
export default function UserList() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // @review 전체 사용자 가져오면 성능적 문제가 있을 수 있음
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, nickname, email");

      if (!error && data) setUsers(data);
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="닉네임 검색"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <List>
        {filtered.map((user) => (
          <ListItem
            component="div"
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setOpen(true);
            }}
          >
            <ListItemText primary={user.nickname} secondary={user.email} />
          </ListItem>
        ))}
      </List>

      {/* @review 컴포넌트 분리하는게 좋음 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>유저 정보</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>닉네임:</strong> {selectedUser.nickname}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser.email}
              </p>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={() => router.push("/list")}
      >
        뒤로가기
      </Button>
    </Box>
  );
}
