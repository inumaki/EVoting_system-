// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Election {
    

    // creating candidata data structure
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }





constructor () public
{

add_Candidate("Aryan");
add_Candidate("Sajal");

}


//storing candidates information
mapping(uint=>Candidate) public Candidates;
uint public Count;

function add_Candidate(string memory _name) private {
Count++;
Candidates[Count]= Candidate(Count,_name,0);

    
}
//########################### for voters #######################

    // Store accounts that have voted
    mapping(address => bool) public voters;

//--------------------------------------------

    // Event is an inheritable member of a contract.
    // An event is emitted, it stores the arguments passed in transaction logs. 
    //These logs are stored on blockchain and are accessible using address of the contract till the contract is present on the blockchain.
    event votedEvent (
        uint indexed _candidateId
    );

//----------------------------------

    function vote (uint _candidateId) public 
    {
        // require that they haven't voted before
        require(!voters[msg.sender]);  //to handle edge cases

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <=Count); //to handle edge cases

        // record that voter has voted
        voters[msg.sender] = true; //if above conditions are true then this will run.

        // update candidate vote Count
        Candidates[_candidateId].voteCount ++; //updating number of votes given

        // trigger voted event
       emit votedEvent(_candidateId); //saving logs
    }
}
