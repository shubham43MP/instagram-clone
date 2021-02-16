import React, { useState } from "react";
import firebase from "firebase";
import { Button } from "@material-ui/core";

import { db, storage } from "../../firebase";
import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
	const [image, setImage] = useState(null);
	const [caption, setCaption] = useState("");
	const [progress, setProgress] = useState(0);

	const handleChange = (event) => {
		if (event.target.value) setImage(event.target.files[0]);
	};

	const handleUpload = () => {
		const upload = storage.ref(`images/${image.name}`).put(image);
		upload.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption,
							postImageURL: url,
							username: username,
						});
						setProgress(0);
						setCaption("");
						setImage(null);
					});
			}
		);
	};
	return (
		<div className="imageupload">
			<progress className="imageupload__progress" value={progress} max="100" />
			<input
				type="text"
				placeholder="Caption the Post"
				onChange={(event) => setCaption(event.target.value)}
				value={caption}
			/>
			<input type="file" onChange={handleChange} />
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
};

export default ImageUpload;
