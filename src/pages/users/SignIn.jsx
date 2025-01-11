import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import "bootstrap/dist/css/bootstrap.min.css";
import hero from "../../assets/images/signIn.png";
import logo from "../../assets/images/1.1.png";

const SignIn = () => {
  // Destructuring `setUser` and `setToken` from context to update user information and authentication token globally
    const { setUser, setToken } = useStateContext();

    // State to manage alert message and whether the alert should be displayed
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // References to input fields for email and password
  const emailRef = useRef();
  const passwordRef = useRef();

  // State to manage form validation errors
  const [formErrors, setFormErrors] = useState({
    Email: "",
    Password: "",
  });

  // Validation function for login form input fields
  const validate = (loginData) => {
    const errors = {};
    if (!loginData.Email) {
      errors.Email = "Email is required";
    } else if (!loginData.Email.includes("@")) {
      errors.Email = "Enter a valid Email address";
    }
    if (!loginData.Password) {
      errors.Password = "Password is required";
    }
    setFormErrors(errors);
    return errors;
  };

   // Function to handle form submission for login
  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      Email: emailRef.current.value,
      Password: passwordRef.current.value,
    };

    const validationErrors = validate(loginData);

    if (Object.keys(validationErrors).length === 0) {
      axiosClient
        .post("Users/login", loginData)
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
          navigate("/");
        })
        .catch(({ response }) => {
          if (response && response.status === 401) {
            setAlertMessage(response?.data.error || "Invalid Email or Password");
            setShowAlert(true);
          } else {
            setAlertMessage(response?.data.error || "An error occurred");
            setShowAlert(true);
          }
        });
    }
  };
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center sign-in-bg-color">
          <img src={hero} style={{ height: "auto", width: "100%" }} />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center text-white theme-bg-color">
          <div className=" bg-white rounded-card col-md-9 p-4 theme-text-color">
          <center><img src={logo} alt="Logo" style={{width:'300px',marginTop:'10px'}}/></center>
            <form  onSubmit={handleLogin}>
              <div class="form-group my-3">
                <label for="exampleInputEmail1" className="mb-2">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  ref={emailRef}
                />
                {formErrors.Email && <span className="error-text">{formErrors.Email}</span>}
              </div>
              <div class="form-group my-4">
                <label for="exampleInputPassword1" className="mb-2">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  ref={passwordRef}
                />
                 {formErrors.Password && <span className="error-text">{formErrors.Password}</span>}
              </div>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                />
                <label class="form-check-label form-btn-text mb-4" for="exampleCheck1">
                  Check me out
                </label>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                Sign In
              </button>
              {showAlert && <div className="mt-4 error-text text-center">{alertMessage}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
