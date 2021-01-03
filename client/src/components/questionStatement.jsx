import React, { Component } from "react";

export class QuestionStatement extends Component {
  render() {
    return (
      <div style={styles.root}>
        <h1>{this.props.question}</h1>
      </div>
    );
  }
}

const styles = {
  root: {
    marginTop: "50px",
  },
};

export default QuestionStatement;
