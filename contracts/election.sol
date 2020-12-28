pragma solidity ^0.7.0;
//SPDX-License-Identifier:UNLICENSED
contract Election {
    // Model a Candidate
    
    struct Candidate {
        uint id;
        uint partyId;
        string name;
        uint voteCount;
    }
    struct Constituency {
        uint id;
        string name;
        mapping(uint => Candidate) candidates;
        uint[] candidateKeys;
    }

    mapping(uint => Constituency) constituencies;
    uint[] constituencyKeys;
    mapping(uint => string) public parties;
    mapping(address => bytes32) public voterIds;
    mapping(address => bool) public hasVoted;
    mapping(address => uint) public voterConstituencyIndex;

    address public admin;
    uint public electionEndTime;

    constructor(uint _electionDuration){
        admin=msg.sender;
        electionEndTime=block.timestamp+_electionDuration;
    }

    // voted event
    event votedEvent(uint _candidateId,bytes32 _voterId);
    event addedConstituencyEvent(uint _id,string _name);
    event addedCandidateEvent(uint _id,uint _constituencyId,uint _partyId,string _name);
    event addedPartyEvent(uint _id,string _name);
    event addedVoterEvent(bytes32 _id);
    event publishVoteCnt(uint _constituencyId,uint _candidateId,uint _voteCount);
    

    function addConstituency(uint _id,string memory _name) public {
        require(msg.sender == admin);

        constituencies[_id].id=_id;
        constituencies[_id].name=_name;
        constituencyKeys.push(_id);
        emit addedConstituencyEvent( _id,_name);
    }
    function addCandidate(uint _constituencyId ,uint _id, uint _partyId, string memory _name) public
    {
        require(msg.sender == admin);
        constituencies[_constituencyId].candidates[_id].id=_id;
        constituencies[_constituencyId].candidates[_id].partyId=_partyId;
        constituencies[_constituencyId].candidates[_id].voteCount=0;
        constituencies[_constituencyId].candidates[_id].name=_name;
        constituencies[_constituencyId].candidateKeys.push(_id);
        emit addedCandidateEvent(_id,_constituencyId,_partyId,_name);
    }
    function addParty(uint _id , string calldata _name) public
    {
        require(msg.sender == admin);
        parties[_id]=_name;
        emit addedPartyEvent(_id,_name);
    }
    function createVoterId(address _address) private view returns(bytes32)
    {
        return sha256(abi.encodePacked(_address,block.timestamp));
    }
    function addVoter(address _address ,uint _constituencyId) public
    {
        require(msg.sender == admin);
        voterIds[_address] = createVoterId(_address);
        hasVoted[_address] = false;
        voterConstituencyIndex[_address] = _constituencyId;
        emit addedVoterEvent(voterIds[_address]);
    }
 
    function vote(uint256 _candidateId) public {
        require(voterIds[msg.sender]!=0,
        "Voter account address not registered");
        require(!hasVoted[msg.sender],
        "Vote already casted from this account");
        //require(
        //    block.timestamp <= electionEndTime,
        //    "Election has ended."
        //);

        hasVoted[msg.sender] = true;
        constituencies[voterConstituencyIndex[msg.sender]].candidates[_candidateId].voteCount++;
        
        emit votedEvent(_candidateId,voterIds[msg.sender]);
    }
    function publishResult() public{
        require(msg.sender == admin);

        for(uint i=0;i<constituencyKeys.length;i++)
        {
            for(uint j=0;j<constituencies[constituencyKeys[i]].candidateKeys.length;j++)
            {
                emit publishVoteCnt(constituencyKeys[i], constituencies[constituencyKeys[i]].candidates[constituencies[constituencyKeys[i]].candidateKeys[j]].id, constituencies[constituencyKeys[i]].candidates[constituencies[constituencyKeys[i]].candidateKeys[j]].voteCount);
            }
        }
    }
}
