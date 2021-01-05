import React, { Component } from "react";
/* import SimpleStorageContract from "./contracts/SimpleStorage.json"; */
import getWeb3 from "./getWeb3";
import SurveyContract from "./contracts/Survey.json";
import "./App.css";
import QuestionStatement from "./components/questionStatement";
import CustomAppBar from "./components/CustomAppBar";
import CustomInput from "./components/CustomInput";

class App extends Component {
  state = {
    question: "",
    web3: null,
    accounts: null,
    contract: null,
    userAddress: "",
    userAnswer: "",
    userHasAnsweredTheQuestion: false,
    userIsOwner : false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SurveyContract.networks[networkId];
      console.log("Deployed network " + deployedNetwork)
      const instance = new web3.eth.Contract(
        SurveyContract.abi,
        deployedNetwork  && deployedNetwork.address 
      );
      console.log(accounts);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleChange = (input) => (e) => {
    this.setState({
      [input]: e.target.value,
    });
  };

  buttonClick = async () => {
    console.log(this.state.userAnswer);
    const answer_submit_response = await this.state.contract.methods
      .answerQuestion(this.state.userAnswer)
      .send({ from: this.state.accounts[0] });
    console.log(answer_submit_response);
  };

  runExample = async () => {
    try {
      const getAnswerResponse = await this.state.contract.methods
        .getAnswer()
        .call();
      console.log(getAnswerResponse.toString());
      this.setState({
        userAnswer: getAnswerResponse.toString(),
      });
    } catch (error) {
      console.error(error);
    }
    const { accounts, contract } = this.state;

    const userIsOwnerResponse = await contract.methods.isOwner().call()
    console.log(`isOwner : ${userIsOwnerResponse}`)
    // Stores a given value, 5 by default.
    console.log("Creating question...");
    var questionS = "What is your name?";
    const question_create_transaction = await contract.methods
      .setQuestion(questionS)
      .send({ from: this.state.accounts[0] });
    console.log(question_create_transaction);
    console.log("Getting question...");
    const result = await contract.methods.survey_question().call();
    console.log(result.toString());
    const hasAnsweredTheQuestionResponse = await contract.methods
      .hasAnsweredTheQuestion()
      .call();
    console.log(hasAnsweredTheQuestionResponse);

    // Update state with the result.
    this.setState({
      question: result.toString(),
      userHasAnsweredTheQuestion: hasAnsweredTheQuestionResponse,
      userIsOwner : userIsOwnerResponse
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <CustomAppBar accounts={this.state.accounts} />
        <QuestionStatement question={this.state.question} />
        <CustomInput
          handleChange={this.handleChange}
          onSubmit={this.buttonClick}
          isDisabled = {this.state.userHasAnsweredTheQuestion}
          ownerRequest = {this.state.userIsOwner}
        />
        {!this.state.userIsOwner && <h2>Your Answer : {this.state.userAnswer}</h2>}
      </div>
    );
  }
}

export default App;
