import React from "react";
import { connect } from "react-redux";
import * as R from "ramda";

import { Modal, ModalBody } from "@webapp/components/modal";
import Icon from "@webapp/components/icon";

import { resetPassword, resetPasswordFormReset } from "./../actions";

class ForgotPasswordFormModal extends React.Component {
  componentDidMount() {
    this.props.resetPasswordFormReset();
  }

  render() {
    const { onClose, resetPassword, error, message } = this.props;
    let messages = [];

    if (typeof message == "string") {
      messages = message.split("\n");
    }

    return (
      <Modal isOpen="true">
        <ModalBody>
          {messages.length > 0 ? (
            <div className="alert-confirmation-message">
              {messages.map((item, i) => (
                <span key={i}>
                  {item}
                  <br />
                </span>
              ))}
            </div>
          ) : (
            <div
              className="login__box"
              style={{ border: 0, boxShadow: "none" }}
            >
              <div className="login__top">
                <h3>
                  Enter your email and submit the form.
                  <br />
                  Your will receive the instructions via email
                </h3>

                <div className="login__form">
                  <input type="text" ref="email" placeholder="Email" />
                </div>

                {error ? (
                  <div className="alert-error">
                    <div className="alert-icon">
                      <Icon name="alert" />
                    </div>
                    <div className="alert-message">
                      {error.split("\n").map((item, i) => (
                        <span key={i}>
                          {item}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="login__buttons">
                  <button className="btn" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      resetPassword(this.refs.email.value);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  error: R.path(["login", "localLogin", "resetPassword", "error"], state),
  message: R.path(["login", "localLogin", "resetPassword", "message"], state)
});

export default connect(mapStateToProps, {
  resetPassword,
  resetPasswordFormReset
})(ForgotPasswordFormModal);
