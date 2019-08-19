import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ImageUploader from "react-images-upload"
import Loading from "../../components/Loading";
import withAnalytics from "../../compositions/Analytics/withAnalytics"
import MainForm from "../../components/MainForm";
import AdditionalForm from "../../components/AdditionalForm";
import Header from "../../components/Header";
import { requiredFields, additionalFields, fieldValueToString } from "../../Utilities/Fields";

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
            driver: props.driver,
            redirectToOrigin: props.redirectToOrigin,
            logoutDriver: props.logoutDriver,
            isSignUp: props.isSignUp,
            isLoading: true,
            handleFormSubmission: props.handleFormSubmission,
            picture: [],
            setModal: props.setModal,
            setNotification: props.setNotification,
            isEditing: true,
        }
        this.ref = props.driver.referrer
        this.changes = false
        console.log(this.ref);
    }

    componentDidMount = () => {
        this.initDriverUpdate()
    }

    initDriverUpdate = () => {
        const driverUpdate = {}
        requiredFields.forEach((field) => {
            driverUpdate[field] = this.state.isSignUp ? "" : fieldValueToString(field, this.state.driver[field])
        })
        additionalFields.forEach((field) => {
            driverUpdate[field] = this.state.driver[field] ? fieldValueToString(field, this.state.driver[field]) : ""
        })
        console.log("inited driver:", driverUpdate)
        this.setState({ driverUpdate: driverUpdate, isLoading: false })
    }

    editingButtons = () => {
        return (
            <div className="editingButtons">
                <Button className="submissionButton" onClick={this.handleSubmit}> Save Your Changes </Button>
                <Button className="submissionButton" onClick={() => this.stopEditing(this.changes)} > Cancel </Button>
            </div>
        )
    }

    notEditingButton = () => {
        return (
            <React.Fragment>
                <Button className="submissionButton" onClick={this.startEditing} > Edit Your Profile </Button>
                <Button className="submissionButton" onClick={this.handleDone} > I'm Done Signing Up </Button>
            </React.Fragment>
        )
    }

    handleSubmit = async () => {
        const valid = await this.state.handleFormSubmission(this.state.driverUpdate, this.state.picture, this.ref)
        if (valid) {
            this.stopEditing()
            this.setState({ isSignUp: false })
        }
    }

    handleDone = () => {
        const title = "Thanks for Signing Up";
        const msg = "We will contact you soon, for now we will send you back to our website";
        const prompt = "Got It, Send Me Back"
        this.state.setModal(true, title, msg, prompt, this.state.redirectToOrigin)
    }

    handleInput = (event, field) => {
        const input = event.target.value
        const driver = { ...this.state.driverUpdate }
        driver[field] = input
        this.changes = true
        this.setState({ driverUpdate: driver })
    }

    onDrop = (picture) => {
        try {
            const picLength = picture.length - 1
            picture[picLength].url = URL.createObjectURL(picture[picLength])
            console.log("picture:", picture)
            this.setState({
                picture: [picture[picLength] ? picture[picLength] : undefined],
            })    
        } catch (err) {
            console.log("Error occurred in handling picture:", err)
            this.props.setNotification(true, "Error", "An error occurred in handling your image", true)
        }
    }

    startEditing = () => {
        this.setState({ isEditing: true })
    }

    stopEditing = (reset = false) => {
        if (reset) {
            this.changes = false
            document.location.reload()
            this.stopEditing()
        } else {
            this.changes = false
            const driver = { ...this.state.driverUpdate }
            if (this.state.picture.length > 0) {
                driver.profile = this.state.picture[this.state.picture.length - 1].url + '#' + new Date().getTime()
            }
            this.setState({
                driverUpdate: reset ? this.state.driver : driver,
                isEditing: false,
            })
        }
    }

    render = () => {
        const additionalFormProps = {
            readOnly: !this.state.isEditing,
            email: this.state.email,
            driver: this.state.driver,
            driverUpdate: this.state.driverUpdate,
            handleInput: this.handleInput,
        }

        const mainFormProps = {
            readOnly: !this.state.isEditing,
            email: this.state.email,
            driver: { ...this.state.driverUpdate },
            handleInput: this.handleInput,
            isSignUp: this.state.isSignUp,
        }

        const ImageUploaderProps = {
            withIcon: false,
            singleImage: true,
            buttonText: "Choose a new profile picture",
            onChange: this.onDrop,
            imgExtension: ['.jpg', '.gif', '.png', '.gif', '.jpeg', '.bmp'],
            label: "Max file size: 5mb, Accepts .jpg, .png, .gif",
            maxFileSize: 5000000,
            className: "imgUploader"
        }

        const picLength = this.state.picture.length - 1
        const uploadStyles = window.innerWidth > 325 ? { width: 300 } : { width: '75vw' }

        if (this.state.isLoading) return <Loading />
        return (
            <React.Fragment>
                <Header title={this.state.isSignUp ? "Sign Up" : "Your Profile"} redirectToOrigin={this.state.redirectToOrigin} />
                <div className="profileBackground">
                    <img
                        id="target"
                        src={picLength >= 0 && this.state.picture[picLength] ? this.state.picture[picLength].url : this.state.driver.profile + '#' + new Date().getTime()}
                        alt={"Your profile"}
                        className="profilePic"
                    />
                    {this.state.isEditing && <ImageUploader {...ImageUploaderProps} style={uploadStyles} />}
                </div>
                {!this.state.isEditing && this.notEditingButton()}
                {this.state.isEditing && picLength >= 0 && this.editingButtons()}
                <MainForm {...mainFormProps} />
                <AdditionalForm {...additionalFormProps} />
                {this.state.isEditing && this.editingButtons()}
                {!this.state.isEditing && <Button className="submissionButton" onClick={this.state.logoutDriver}> Logout </Button>}
            </React.Fragment>
        )
    }
}

export default withAnalytics(EditProfile)