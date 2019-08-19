import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { additionalFields, fieldToDescription, fieldToPrompt } from "../../Utilities/Fields";

const AdditionalForm = (props) => {
    if (additionalFields.length === 0) {
        return null
    }
    const formProps = (field) => {
        return {
            className: "formControl",
            readOnly: props.readOnly,
            plaintext: props.plaintext,
            onChange: (event) => { props.handleInput(event, field) },
            placeholder: props.driver[field] ? props.driverUpdate[field] : "(Optional) " + fieldToPrompt[field]
        }
    }
    return (
        <React.Fragment>
            <h2 className="formHeader">Addtional Information:</h2>
            <div className="formWrapper">
                <Form className="formObject">
                    {additionalFields.map((field, i) => {
                        return (
                            <Form.Group as={Row} className="formGroup" key={i}>
                                <Form.Label className="formLabel" column sm="2"> {fieldToDescription[field]} </Form.Label>
                                <Col sm="10">
                                    <Form.Control {...formProps(field)} />
                                </Col>
                            </Form.Group>
                        )
                    })}
                </Form>
            </div>

        </React.Fragment>
    )
}

export default AdditionalForm;
