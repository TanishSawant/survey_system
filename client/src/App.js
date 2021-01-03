import React, { Component } from "react";
/* import SimpleStorageContract from "./contracts/SimpleStorage.json"; */
import getWeb3 from "./getWeb3";
import SurveyContract from "./contracts/Survey.json"
import "./App.css";
import QuestionStatement from "./components/questionStatement";
import { AppBar } from "@material-ui/core";

class App extends Component {
  state = { question: "", web3: null, accounts: null, contract: null, userAddress: ""};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SurveyContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SurveyContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log(accounts)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
/*     await contract.methods.set(5).send({ from: accounts[0] }); */
    console.log("Getting question...")
    const result = await contract.methods.survey_question().call();
    console.log(result.toString());
    // Update state with the result.
    this.setState({ question : result.toString() });
  };

  onChange = input = e => {
    this.setState({
      userAddress : e.target.value,
    });
  }

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state.userAddress)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <AppBar title="Survey" />        
        <QuestionStatement question = {this.state.question}/>
        
      </div>
    );
  }
}

export default App;
