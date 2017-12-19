window.iframe = window.iframe || {};

window.iframe = new function ()
{
    var that = this;

    that.generate = function (el, url)
    {
        frame = document.createElement('iframe');
        frame.id = 'kernsoccer';
        frame.style.width =  "100%";
        frame.style.height = "100%";
        frame.style.border = "none";
        frame.style.position = "absolute";
        frame.style.top = "0px";
        frame.style.left = "0px";
        frame.style.zIndex = 99999;
        el.appendChild(frame);
        frame.src = url;
    }

    that.remove = function ()
    {
        var iframe = document.getElementById('kernsoccer');
        if (iframe != null)
        {
            iframe.parentElement.removeChild(iframe);
        }
    }
}

var mapping = {
    start: {
        type: "button",
        buttons: [9],
        toggle: true
    },
    return: {
        type: "button",
        buttons: [8],
        toggle: true
    }
};

var ctrlMgr = ControllerManager();
for (var i=0; i < ctrlMgr.controllers.length; i++) {
    ctrlMgr.controllers[i].setMapping(mapping);
}

function updateIFrame() {
    ctrlMgr.update();
    var connected = false;
    for (var i=0; i < ctrlMgr.controllers.length; i++) {
        if (ctrlMgr.controllers[i].isConnected()) {
            connected = true;
        }
        if (ctrlMgr.controllers[i].get("return")) {
            window.iframe.remove();    
            requestAnimationFrame(update);
            return;
        }
    }
    if (!connected) {
        window.iframe.remove();
        requestAnimationFrame(update);
        return;
    }
    requestAnimationFrame(updateIFrame);
}

function update() {
    ctrlMgr.update();
    for (var i=0; i < ctrlMgr.controllers.length; i++) {
        if (ctrlMgr.controllers[i].get("start")) {
            window.iframe.generate(window.document.body, '//kernsoccer.github.io?start');
            requestAnimationFrame(updateIFrame);
            return;
        }
    }
    requestAnimationFrame(update);
}

requestAnimationFrame(update);

