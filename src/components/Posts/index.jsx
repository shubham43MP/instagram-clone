import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

import { db } from "../../firebase";
import "./Post.css";

const Post = ({ postImageURL, username, caption, postId, user }) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");

	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}
		return () => {
			unsubscribe();
		};
	}, [postId]);

	const postComment = (event) => {
		event.preventDefault();
		db.collection("posts").doc(postId).collection("comments").add({
			comment,
			username: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
		setComments("");
	};
	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt={username[0].toUpperCase()}
					src="sss"
				/>
				<h3> {username} </h3>
			</div>
			<img className="post__image" src={postImageURL} alt="userpost" />
			<h4 className="post__text">
				<strong>{username}</strong> {caption}
			</h4>
			{
				<div className="post_comments">
					{comments &&
						comments.map((comment) => (
							<p>
								<b>{comment.username}</b> {comment.comment}
							</p>
						))}
				</div>
			}
			{user && (
				<form className="post__commentBox">
					<input
						className="post__input"
						placeholder="Add a comment.."
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						disabled={!comment}
						className="post__button"
						type="submit"
						onClick={postComment}
					>
						Post
					</button>
				</form>
			)}
		</div>
	);
};

export default Post;
