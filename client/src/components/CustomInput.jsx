import { Button, TextField } from "@material-ui/core";
import React from "react";

function CustomInput(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Button Clicked!");
    props.onSubmit();
  };

  return (
    <div style={styles.root}>
      {props.isDisabled && <h2>You have already answered the question</h2>}
      <TextField
        label="Your answer"
        onChange={props.handleChange("userAnswer")}
        disabled = {props.isDisabled}
      />
      <Button
        style={styles.button}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled = {props.isDisabled}
      >
        Submit
      </Button>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50px",
  },

  button: {
    marginTop: "50px",
  },
};

export default CustomInput;
