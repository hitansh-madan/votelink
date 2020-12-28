App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,

    init: function() {

        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            console.log("metamask");

            return App.initContract();

        } else {

        }
    },

    initWeb3: function() {

        url = $("#connectForm #url").val();
        App.web3Provider = new Web3.providers.HttpProvider(url);
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {
        $.getJSON("Election.json", function(election) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.Election = TruffleContract(election);
            // Connect provider to interact with contract
            App.contracts.Election.setProvider(App.web3Provider);

            App.listenForEvents();

            return App.render();
        });
    },

    // Listen for events emitted from the contract
    listenForEvents: function() {
        App.contracts.Election.deployed().then(function(instance) {
            // Restart Chrome if you are unable to receive this event
            // This is a known issue with Metamask
            // https://github.com/MetaMask/metamask-extension/issues/2393
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                displayEvent(event);

                console.log(event);
            });

            instance.addedConstituencyEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log(event);
                displayEvent(event);

            });

            instance.addedCandidateEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log(event);
                displayEvent(event);

            });

            instance.addedPartyEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log(event);
                displayEvent(event);
            });

            instance.addedVoterEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log(event);
                displayEvent(event);

            });

            instance.publishVoteCnt({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log(event);
                displayEvent(event);

            });
        });
    },

    render: function() {

        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                console.log(App.account);
            }
        });
        App.contracts.Election.deployed().then((instance) => addContractAddress(instance.address));
        $("#connect").addClass("hidden");
        $("#election").removeClass("hidden");
        console.log("flag2");
    },

    addConstituency: function() {
        var id = parseInt($("#ConstituencyId").val());
        var name = $("#ConstituencyName").val();
        console.log(id);
        console.log(name);
        addConstituencyF(id, name);
        App.contracts.Election.deployed().then(function(instance) {
            //addConstituencyF(id, name);
            return instance.addConstituency(id, name);
        }).catch((err) => console.log(err));
    },

    addCandidate: function() {
        var cnstId = parseInt($("#CndtConstituencyId").val());
        var cndtId = parseInt($("#CandidateId").val());
        var partyId = parseInt($("#CndtPartyId").val());
        var name = $("#CandidateName").val();
        console.log(cnstId);
        console.log(cndtId);
        console.log(partyId);
        console.log(name);
        addCandidateF(cnstId, cndtId, partyId, name);

        App.contracts.Election.deployed().then(function(instance) {
            addCandidateF(cnstId, cndtId, partyId, name);
            return instance.addCandidate(cnstId, cndtId, partyId, name);
        }).catch((err) => console.log(err));
    },

    addParty: function() {
        var id = parseInt($("#PartyId").val());
        var name = $("#PartyName").val();
        console.log(id);
        console.log(name);
        addPartyF(id, name);

        App.contracts.Election.deployed().then(function(instance) {
            addPartyF(id, name);
            return instance.addParty(id, name);
        }).catch((err) => console.log(err));
    },

    addVoter: function() {
        var id = parseInt($("#VoterConstituencyId").val());
        var voterAdd = $("#VoterAddress").val();
        console.log(id);
        console.log(voterAdd);

        App.contracts.Election.deployed().then(function(instance) {
            return instance.addParty(voterAdd, id);
        }).catch((err) => console.log(err));
    },
    publishResult: function() {
        App.contracts.Election.deployed().then(function(instance) {
            return instance.publishResult();
        }).catch((err) => console.log(err));
    }
};

$(document).ready(function() {
    if (electionName == null) {
        $("#connect").removeClass("hidden");
    }
});