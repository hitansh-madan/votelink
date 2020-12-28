var electionName = null;
var db = firebase.firestore();
var electionDoc;
var contractAdd;

function connect() {
    var name = $("#electionName").val();
    console.log("name");
    electionName = name.replace(/\s/g, '');
    db.collection("elections").doc(electionName).set({
        name: name,
        ongoing: true
    }).then(function() {
        electionDoc = db.collection("elections").doc(electionName);
        $("#connect").addClass("hidden");
        App.init();
    });
}

function addConstituencyF(id, name) {

    electionDoc.collection("constituencies").doc(id.toString()).set({
        id: id,
        name: name,
        winnerId: null
    }).then(() => console.log("FBaddedConstituency"));
}

function addCandidateF(cnstId, id, partyId, name) {
    electionDoc.collection("constituencies").doc(cnstId.toString()).collection("candidates").doc(id.toString()).set({
        constituencyId: cnstId,
        id: id,
        partyId: partyId,
        name: name,
        voteCount: 0
    }).then(() => console.log("FBaddedCandidate"));
}

function addPartyF(id, name) {
    electionDoc.set({
        parties: {
            [id]: name,
        }
    }, { merge: true }).then(() => console.log("FBaddedParty"));
}

function addContractAddress(address) {
    electionDoc.set({
        address: address,
    }, { merge: true }).then(() => console.log("added contract address"));
}