import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InstagramEmbed from "react-instagram-embed";

import Post from "./components/Posts";
import ImageUpload from "./components/ImageUpload";
import { db, auth } from "./firebase";
import "./App.css";

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
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

const App = () => {
	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [modalStyle] = useState(getModalStyle());
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [openSignIn, setOpenSignIn] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((userauth) => {
			if (userauth) setUser(userauth)
			else setUser(null);
		});
		return () => unsubscribe();
	}, [user, username]);

	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						post: doc.data(),
					}))
				);
			});
	}, []);

	const signIn = (event) => {
		event.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));
		setOpenSignIn(false);
	};

	const signUp = async (event) => {
		event.preventDefault();
		try {
			const userauth = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			userauth.user.updateProfile({ displayName: username });
		} catch (error) {
			alert(error.message);
		}
		setOpen(false);
	};

	return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign up
						</Button>
					</form>
				</div>
			</Modal>
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign in
						</Button>
					</form>
				</div>
			</Modal>
			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app__logincontainer">
						<Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
						<Button onClick={() => setOpen(true)}>Sign up</Button>
					</div>
				)}
			</div>
			<div className="app__posts">
				<div className="app_postsLeft">
					{posts.map(({ id, post }) => (
						<Post
							key={id}
							user={user}
							postId={id}
							username={post.username}
							postImageURL={post.postImageURL}
							caption={post.caption}
						/>
					))}
				</div>
				<div className="app__postsRight">
					<InstagramEmbed
						url="https://instagr.am/p/Zw9o4/"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>
			<div className="app__footer">
				{user?.displayName ? (
					<ImageUpload username={user.displayName} />
				) : (
					<h4>Please Login to Upload Images</h4>
				)}
			</div>
		</div>
	);
};

export default App;
