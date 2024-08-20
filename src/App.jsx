import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const App = () => {



  const getInitialState = () => {
    const savedData = sessionStorage.getItem('myArray');
    return savedData ? JSON.parse(savedData) : [];
  };
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketSID, setSocketSID] = useState("");
  const [allMessages, setAllMessages] = useState(getInitialState);
  const [roomToJoin, setRoomToJoin] = useState("");
  const socket = useMemo(() => io("https://socket-3-kpco.onrender.com"), []);
  useEffect(() => {
    sessionStorage.setItem('myArray', JSON.stringify(allMessages));
  }, [allMessages]);


  useEffect(() => {
    socket.on("connect", () => {
      setSocketSID(socket.id);
    });

    socket.on("room", (data) => {
      setAllMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const handleJoinRoomChange = (e) => {
    setRoomToJoin(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join", roomToJoin);
    setRoomToJoin("");
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h4" gutterBottom>
              Welcome to IndChat
            </Typography>
            <Typography variant="body2">
              Your Socket ID: {socketSID}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Join Room
            </Typography>
            <form onSubmit={handleJoinRoom}>
              <TextField
                label="Room Name"
                variant="outlined"
                value={roomToJoin}
                onChange={handleJoinRoomChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" type="submit">
                Join
              </Button>
            </form>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Chat
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Message"
                    variant="outlined"
                    value={message}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Room"
                    variant="outlined"
                    value={room}
                    onChange={handleRoomChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Messages
            </Typography>
            <List>
              {allMessages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={message} />
                </ListItem>
              ))}
            </List>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
