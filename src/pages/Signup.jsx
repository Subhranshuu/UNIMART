import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase.config"; // Ensure correct imports
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed
import "../styles/signup.css";
import "../styles/login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, file } = formData;

    if (!username || !email || !password || !file) {
      alert("Please fill out all fields and upload a profile picture.");
      return;
    }

    setLoading(true);
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          setLoading(false);
          toast.error("File upload failed. Please try again.");
        },
        async () => {
          // Get image URL and update user profile
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { displayName: username, photoURL: downloadURL });

          // Save user details to Firestore
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: username,
            email,
            photoURL: downloadURL,
          });

          setLoading(false);
          toast.success("Account created successfully!");
          navigate("/login"); // Redirect to login page after successful signup
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Helmet title="Signup">
      <section>
        <Container>
          <Row className="justify-content-center">
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold text-primary">Creating account...</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Sign Up</h3>
                <Form className="auth__form" onSubmit={handleSubmit}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      required
                    />
                  </FormGroup>

                  <button type="submit" className="buy__btn" disabled={loading}>
                    {loading ? "Signing up..." : "Create an account"}
                  </button>

                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
