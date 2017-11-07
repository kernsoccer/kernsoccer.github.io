var keymapping = {
    12 : "Calculated!",
    13 : "Holy Cow!",
    14 : "Nice Save!",
    15 : "Sorry!"
}

function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}

var doEmote = function(player) {
    if(player.body.isEmoting || player.body.emoteKey == 0) return;

    player.body.isEmoting = true;
    var emote = "<div class='emote'><div class='bubble " + player.body.team + "'><span>" + keymapping[player.body.emoteKey] + "</span></div></div>";
    appendHtml(player.displayObject, emote); 

    setTimeout(function() {
        var foundEmote = player.displayObject.querySelector(".emote");
        player.displayObject.removeChild(foundEmote);
        player.body.isEmoting = false;
        player.body.emoteKey = 0;
    }, 2000)
}