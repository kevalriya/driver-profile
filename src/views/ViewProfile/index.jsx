import React, { Component } from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import Loading from "../../components/Loading";
import { deleteCookie } from "../../Utilities/Cookie";
import EditProfile from "../EditProfile";
import Error from "../../components/Error";
import { getDriver, createDriver, updateDriver } from "../../Utilities/Api/api";
import {
  fieldToFeedback,
  fieldInputToValue,
  isValidDriverObject,
  requiredFields,
  additionalFields
} from "../../Utilities/Fields";

Modal.setAppElement("#root");

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignUp: false,
      email: undefined,
      driverUpdate: undefined,
      driver: undefined,
      isLoading: true,
      error: undefined,
      isEditing: false,
      picture: [],
      modal: {},
      notification: {}
    };
    getDriver(this.receiveDriver, this.handleError);
  }

  logoutDriver = async () => {
    deleteCookie("token", "portlmedia.com");
    window.location.href =
      "https://dev-2nvx8dom.auth0.com/v2/logout?returnTo=https%3A%2F%2Fportlmedia.com";
  };

  redirectToOrigin = () => {
    window.location.href = "https://portlmedia.com/";
  };

  setModal = (open, title, msg, prompt, onClick) => {
    const modal = open ? { ...this.state.modal } : {};
    modal.isOpen = open;
    if (title) modal.title = title;
    if (msg) {
      if (Array.isArray(msg)) modal.text = msg;
      else modal.text = [msg];
    }
    if (prompt && onClick) modal.buttonPrompt = prompt;
    if (onClick) modal.onClick = onClick;
    this.setState({ modal: modal });
  };

  createModal = () => {
    return (
      <Modal
        isOpen={this.state.modal.isOpen}
        onRequestClose={() => this.setModal(false)}
        shouldFocusAfterRender={true}
        className="alertModal"
        overlayClassName="alertModalOverlay"
      >
        <button
          onClick={() => this.setModal(false)}
          className="modalCloseButton"
        >
          &times;
        </button>
        <h1 className="alertModalTitle">{this.state.modal.title}</h1>
        {this.state.modal.text &&
          this.state.modal.text.map((msg, i) => {
            return (
              <p key={i} className="alertModalText">
                {msg}
              </p>
            );
          })}
        {this.state.modal.buttonPrompt && (
          <Button
            onClick={this.state.modal.onClick}
            className="optionalModalButton"
          >
            {this.state.modal.buttonPrompt}
          </Button>
        )}
      </Modal>
    );
  };

  setNotification = (open, title, msg, error, timeout = 5) => {
    console.log("opening notification");
    this.setState({ notification: { isOpen: false } }, () => {
      const notification = open ? { ...this.state.notification } : {};
      notification.isOpen = open;
      if (title) notification.title = title;
      if (msg) notification.text = msg;
      if (error) notification.isError = true;
      this.setState({ notification: notification });
      // causing too many timeouts, need to handle more carefully
      // if (timeout) {
      //     setTimeout(() => { this.setState({ notification: { isOpen: false } }) }, timeout * 1000)
      // }
    });
  };

  createNotification = () => {
    let modalClass = "notificationModal green";
    let titleClass = "notificationModalTitle green";
    let textClass = "notificationModalText green";
    let msg = String(this.state.notification.text);
    if (msg && typeof msg === "object") {
      msg = Object.entries(msg);
    }
    if (this.state.notification.isError) {
      modalClass = "notificationModal red";
      titleClass = "notificationModalTitle red";
      textClass = "notificationModalText red";
      console.log("error notif:", this.state.notification);
      if (!msg) {
        msg =
          "Something went wrong, try again in a few minutes or contact us for further support";
      }
    } else {
      console.log("sucess notif:", this.state.notification);
    }
    return (
      <Modal
        isOpen={this.state.notification.isOpen}
        onRequestClose={() => this.setNotification(false)}
        shouldCloseOnOverlayClick={false}
        shouldFocusAfterRender={false}
        className={modalClass}
        overlayClassName="notificationModalOverlay"
        onClick={() => this.setNotification(false)}
      >
        <button
          onClick={() => this.setNotification(false)}
          className="notificationCloseButton"
        >
          &times;
        </button>
        <h1 className={titleClass}>{this.state.notification.title}</h1>
        <p className={textClass}>{msg}</p>
      </Modal>
    );
  };

  notifyError = error => {
    let msg = error;
    if (!msg) msg = "Something went wrong, try again in a few minutes";
    this.setNotification(true, "An Error Occurred", msg, true);
    this.setState({
      isLoading: false
    });
  };

  handleError = error => {
    console.log("Error:", error);
    this.setState({
      error: error,
      isLoading: false
    });
  };

  receiveDriver = async response => {
    console.log("received driver");
    const driver = await response.json();
    driver.profile = driver.profile + "#" + new Date().getTime();
    console.log(driver);
    localStorage.setItem("email", driver.email);
    if (response.status === 200) {
      this.setState({
        email: driver.email,
        isSignUp: !isValidDriverObject(driver),
        driver: driver,
        isLoading: false
      });
    } else {
      console.log("This email is not associated with this access token");
      this.handleError(
        "You are not signed in. Please sign in to visit this page."
      );
    }
  };

  handleImageUploadError = (error, msg) => {
    console.log("There was an error uploading image:", error);
    const title = "There was an error uploading your image";
    this.setNotification(true, title, msg, true);
    return false;
  };

  handleFormSubmission = async (driverUpdate, picture, ref) => {
    const driver = { ...driverUpdate };
    driver.email = this.state.email;
    console.log("driver on form submission:", driver);
    const invalidFields = [];
    if (this.state.isSignUp && !isValidDriverObject(driver)) {
      console.log("missing field(s):", driver);
      this.alertInvalidInput("Please fill out all required fields to sign up");
      return false;
    } else {
      console.log("all require fields filled");
      requiredFields.concat(additionalFields).forEach(field => {
        if (field === "email" || typeof driver[field] !== "string") {
          return;
        }
        const sanitizedInput = this.validateEdit(driver[field], field);
        if (!sanitizedInput.isValid) {
          invalidFields.push(field);
        } else {
          console.log("valid value:", sanitizedInput);
          driver[field] = sanitizedInput.isValid;
        }
      });
    }

    const invalidRequiredFields = invalidFields
      .map(field => {
        let f;
        if (requiredFields.includes(field)) {
          f = field;
        } else if (!driver[field]) {
          f = undefined;
        } else {
          f = field;
        }

        if (this.state.driver[field]) driver[field] = this.state.driver[field];
        return f;
      })
      .filter(f => f);

    if (invalidRequiredFields.length === 0) {
      this.setState({ driver: driver }, () => {
        this.refreshDriverInfo(driver, picture, ref);
      });
      return true;
    } else {
      const msg = invalidRequiredFields.map(f => {
        return " - " + fieldToFeedback[f];
      });
      this.setModal(true, "Invalid Edits:", msg);
      return false;
    }
  };

  refreshDriverInfo = async (driver, picture, ref) => {
    console.log("pics:", picture.length);
    if (this.state.isSignUp) {
      driver.profile = driver.profile + "#" + Date.now();
      await createDriver(driver, this.handleCreateResponse, ref, console.log);
      this.setState({ isSignUp: false });
    } else {
      const profile = picture[picture.length - 1];
      updateDriver(
        driver,
        profile,
        this.handleUpdateResponse,
        this.notifyError
      );
    }
  };

  alertInvalidInput = reason => {
    const title = "Invalid form submission:";
    this.setState({ isLoading: false }, () => {
      this.setNotification(true, title, reason, true);
    });
  };

  validateEdit = (string, field) => {
    let sanitizedInput = {
      isValid: false,
      field: field
    };
    sanitizedInput.isValid = fieldInputToValue(field, string);
    return sanitizedInput;
  };

  handleCreateResponse = async res => {
    const response = await res.json();
    console.log("server response:", response);
    if (res.status === 200) {
      this.setNotification(
        true,
        "Success!",
        "Your Account Was Created!",
        false
      );
    } else {
      this.setState({ error: response.msg, isLoading: false });
    }
  };

  handleUpdateResponse = async res => {
    const response = await res.json();
    console.log("update response:", res);
    if (res.status === 200) {
      this.setNotification(
        true,
        "Success",
        "Your changes have been saved!",
        false
      );
    } else if (res.status === 400) {
      this.setNotification(
        true,
        "Error",
        "There was an error with authenticating your account",
        true
      );
      this.setState({ isLoading: false });
    } else if (res.status === 403) {
      this.setState({
        error: "This access token doesn't allow modification to this user",
        isLoading: false
      });
    } else {
      this.setState({
        error: "Error: " + JSON.stringify(response),
        isLoading: false
      });
    }
  };

  render = () => {
    const editProps = {
      email: this.state.email,
      driver: this.state.driver,
      handleFormSubmission: this.handleFormSubmission,
      setModal: this.setModal,
      setNotification: this.setNotification,
      isSignUp: this.state.isSignUp,
      askForPassword: false,
      askForEmail: false,
      redirectToOrigin: this.redirectToOrigin,
      logoutDriver: this.logoutDriver
    };

    console.log(this.state.isSignUp);

    if (this.state.error) {
      return <Error err={this.state.error} />;
    } else if (this.state.isLoading) {
      return <Loading />;
    } else {
      return (
        <React.Fragment>
          <EditProfile {...editProps} />
          {this.createModal()}
          {this.createNotification()}
        </React.Fragment>
      );
    }
  };
}

export default Profile;
