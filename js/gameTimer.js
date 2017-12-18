var GameTimer = function () {
    var timeRemaining;
    var timeLimit = true;

    function setTime(time) {
        timeRemaining = time * 1000;
        timeLimit = timeRemaining != 0;
    }

    function getSeconds() {
        return Math.floor(Math.abs(timeRemaining / 1000) % 60);
    }

    function getMinutes() {
        return Math.floor(Math.abs(timeRemaining / (60 * 1000)));
    }

    function isOvertime() {
        return timeLimit && timeRemaining < 0;
    }

    function update(deltaTime) {
        timeRemaining -= deltaTime;
    }

    return {
        setTime: setTime,
        getMinutes: getMinutes,
        getSeconds: getSeconds,
        isOvertime: isOvertime,
        update: update
    }
};