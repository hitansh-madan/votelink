function displayEvent(evnt) {
    $("#electionEvents").append("<div class=\"border-2 p-4 m-2 bg-purple-100 rounded-2xl\">" + evnt.toString() + "</div>");
}

function displayVoteCountEvent(evnt) {
    $("#voteCountEvents").append("<div class=\"border-2 p-4 m-2 bg-purple-100 rounded-2xl\">" + evnt + "</div>");
}