import {
  Box, List, ListItem, ListItemText, TextField, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>유저 정보</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>닉네임:</strong> {selectedUser.nickname}</p>
              <p><strong>이메일:</strong> {selectedUser.email}</p>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
