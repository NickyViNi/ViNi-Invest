import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { isImageValid } from "../../helpers/imageCheck";
import Loading from "../Loading";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileImageUrl && !isImageValid(profileImageUrl.name)) {

      return setErrors({ profileImageUrl: "Only .png, .jpg, .jpeg, .gif are allowed" });
    }

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    if (profileImageUrl) setImageIsUploading(true);

    const formData = new FormData();

    formData.append("first_name", firstName)
    formData.append("last_name", lastName)
    formData.append("email", email)
    formData.append("username", username)
    formData.append("password", password)

    if (profileImageUrl) formData.append("profile_image_url", profileImageUrl);

    console.log(formData, "sddddssssssaaaasddddd", firstName, lastName, email, username, profileImageUrl)

    const serverResponse = await dispatch(thunkSignup(formData));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const inputInvalid = () => {
    return (
      !firstName.length ||
      !lastName.length ||
      !email.length ||
      username.length < 4 ||
      password.length < 6 ||
      errors.profileImageUrl
    );
  }

  return (
    <>
      {errors.server && <p className='modal-errors'>{errors.server}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="sign-up">Sign Up</h2>
        <label>First Name</label>
        <input
          type="text"
          spellCheck={false}
          placeholder="Required"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        {errors.first_name && <p className="modal-errors">{errors.first_name}</p>}
        <label>Last Name</label>
        <input
          type="text"
          spellCheck={false}
          placeholder="Required"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        {errors.last_name && <p className="modal-errors">{errors.last_name}</p>}
        <label>Email</label>
        <input
          type="text"
          spellCheck={false}
          placeholder="user@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="modal-errors">{errors.email}</p>}
        <label>Username</label>
        <input
          type="text"
          spellCheck={false}
          placeholder="At least 4 characters"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="modal-errors">{errors.username}</p>}
        <label>Password</label>
        <input
          type="password"
          spellCheck={false}
          placeholder="At least 6 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="modal-errors">{errors.password}</p>}
        <label>Confirm Password</label>
        <input
          type="password"
          spellCheck={false}
          placeholder="At least 6 characters"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && <p className="modal-errors">{errors.confirmPassword}</p>}
        <label>Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const size = e.target.files[0].size;
            if (size > 10 ** 6) return setErrors({ profileImageUrl: "File size must be less than 10MB." });
            setProfileImageUrl(e.target.files[0]);
            setErrors({ profileImageUrl: "" });
          }}
        />
        {errors.profileImageUrl && <p className="modal-errors">{errors.profileImageUrl}</p>}
        {imageIsUploading && <Loading />}
        <button
          type="submit"
          className={`btn-submit ${inputInvalid() ? 'disabled' : ''}`}
          disabled={inputInvalid()}
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
