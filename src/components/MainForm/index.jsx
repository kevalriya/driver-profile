import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { requiredFields, fieldToDescription, fieldToPrompt, fieldValueToString } from "../../Utilities/Fields";

const formProps = (props, field) => {
    let type = "text"
    let placeholder = props.isSignUp ? fieldToPrompt[field] : fieldValueToString(field, props.driver[field])

    if (field === "email") {
        type = "username";
        placeholder = props.email
    }

    else if (field === "password") {
        type = "password"
    }

    const propObject = {
        className: "formControl",
        readOnly: field === "email" ? true : props.readOnly,
        plaintext: field === "email" ? true : props.plaintext,
        onChange: (event) => props.handleInput(event, field),
        type: type,
        placeholder: placeholder
    }

    return propObject;
}

const MainForm = (props) => {
    const fields = [...requiredFields]
    if (props.askForPassword) {
        fields.splice(2, 0, "password")
    }
    return (
        <React.Fragment>
            <h2 className="formHeader">{props.isSignUp ? "Required Fields:" : "About You:"}</h2>
            <div className="formWrapper">
                <Form className="formObject">
                    {fields.map((field, i) => {
                        return (
                            <Form.Group as={Row} className="formGroup" key={i}>
                                <Form.Label className="formLabel" column sm="2"> {fieldToDescription[field]} </Form.Label>
                                <Col sm="10">
                                    <Form.Control {...formProps(props, field)} />
                                </Col>
                            </Form.Group>
                        )
                    })}
                </Form>
            </div>

        </React.Fragment>
    )
}

export default MainForm;
