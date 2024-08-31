import { useState, useEffect } from "react";
import {
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInUserWithEmailAndPassword,
  auth,
} from "../../utils/firebase/firebase.util";
import FormInput from "../form-input/form-input.component";
import "./sign-in-form.styles.scss";
import Button from "../button/button.component";
import { onAuthStateChanged } from "firebase/auth";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await signInUserWithEmailAndPassword(email, password);
      console.log(response);
      resetFormFields();
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        alert("Incorrect email or password");
      } else {
        console.error(err);
      }
    }
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log(user);
      if (user) {
        await createUserDocumentFromAuth(user);
      }
    });
  }, []);

  return (
    <div className="sign-in-container">
      <h2>Already have an account?</h2>
      <span>Sigin with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="text"
          required
          onChange={handleChange}
          name="email"
          value={email}
        ></FormInput>
        <FormInput
          label="Password"
          type="text"
          required
          onChange={handleChange}
          name="password"
          value={password}
        ></FormInput>
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>
            Google Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
