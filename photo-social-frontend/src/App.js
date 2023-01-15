import './App.css';
import Post from './components/Post'
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import { Button, Input } from '@mui/material';
import { auth } from './firebase'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: '',
    padding: '10px',
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)
  const [open, setOpen] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [openSignIn, setOpenSignIn] = useState(false)

  const [posts, setPosts] = useState([
    {
      username: "TWD",
      caption: "🔥Build a Messaging app with MERN Stack🔥",
      imageUrl: "https://www.techlifediary.com/wp-content/uploads/2020/06/react-js.png"
    },
    {
      username: "nabendu82",
      caption: "Such a beautiful world",
      imageUrl: "https://quotefancy.com/media/wallpaper/3840x2160/126631-Charles-Dickens-Quote-And-a-beautiful-world-you-live-in-when-it-is.jpg"
    }
  ])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser) {
        console.log(authUser)
        setUser(authUser)
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, username])
  
  const signUp = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => authUser.user.updateProfile({ displayName: username }))
    .catch(error => alert(error.message))
    setOpen(false)
  }

  const signIn = e => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message))
    setOpenSignIn(false)
  }

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="logo192.png" alt="Header" />
            </center>
            <Input placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
            <Input placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)}/>
            <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="logo192.png" alt="Header" />
            </center>
            <Input placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
            <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage" src="logo192.png" alt="Header" />
      </div>
      {user ? <Button onClick={() => auth.signOut()}>Logout</Button> : (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      {posts.map(post => (
        <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
      ))}
    </div>
  );
}

export default App;
