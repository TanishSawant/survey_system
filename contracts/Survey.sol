pragma solidity >=0.4.22 <0.7.0;

contract Survey{
    string public survey_question;
    uint256 public _totalPeopleSubmitted;
    bool public paused;
    address public owner;
    bool _q;
    
    mapping (address => string) public answerBook;
    mapping (address => bool) public usersAnswered;
    
    
    constructor() public{
        owner = msg.sender;
        paused = false;
        _q = false;
    }
    
    modifier onlyOwner(){
        require(msg.sender == owner, "You are not owner");
        _;
    }
    
    modifier questionExists() {
        require(_q == true, "No question available.");
        _;
    }

    modifier withoutPaused() {
        require(paused == false, "Contract is paused");
        _;
    }
    
    function changeContractState(bool ch) public onlyOwner{
        paused = ch;
    }
    
    function setQuestion(string memory _question) public onlyOwner{
        survey_question = _question;
        _q = true;
    }
    
    modifier hasNotAnswered() {
        require(usersAnswered[msg.sender] == false, "User has already answered the question!");
        _;
    }
    
    modifier hasAnswered() {
        require(usersAnswered[msg.sender] == true, "User has not answered the question");
        _;
    }

    function getAnswer() public view hasAnswered returns(string memory) {
        return answerBook[msg.sender];
    }
    
    function updateAnswer(string memory _response) public questionExists hasAnswered{
        answerBook[msg.sender] = _response;
    }
    
    function removeAnswer() public questionExists hasAnswered{
        answerBook[msg.sender] = "";
        usersAnswered[msg.sender] = false;
    }
    
    function hasAnsweredTheQuestion() public view returns(bool) {
        if(usersAnswered[msg.sender] == true){
            return true;
        }
        return false;
    }
    
    function answerQuestion(string memory _response) public questionExists hasNotAnswered{
        answerBook[msg.sender] = _response;
        usersAnswered[msg.sender] = true;
        _totalPeopleSubmitted += 1;
    }
    
    function destroy(address payable ender) public onlyOwner{
        selfdestruct(ender);
    }
}