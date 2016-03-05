var Sound = function () {
  var recorder;
  createjs.Sound.registerSound("snd/kick1.mp3", "kick1");
  createjs.Sound.registerSound("snd/kick2.mp3", "kick2");
  createjs.Sound.registerSound("snd/kick3.mp3", "kick3");
  createjs.Sound.registerSound("snd/kick4.mp3", "kick4");
  createjs.Sound.registerSound("snd/cheer1.mp3", "cheer1");
  createjs.Sound.registerSound("snd/end1.mp3", "end1");
  createjs.Sound.registerSound("snd/start1.mp3", "start1");
  createjs.Sound.registerSound("snd/start2.mp3", "start2");
  createjs.Sound.registerSound("snd/start3.mp3", "start3");

  function play(snd, noRecord) {
    if (recorder !== undefined && noRecord === undefined) {
        recorder.recordSound(snd);
    }
    createjs.Sound.play(snd);
  }

  function setRecorder(newRecorder) {
    recorder = newRecorder;
  }

  function playKick() {
    play(Matter.Common.choose(["kick1","kick2","kick3","kick4"]));
  }

  function playCheer() {
    play("cheer1", true);
  }

  function playStart() {
    play(Matter.Common.choose(["start1","start2","start3"]), true);
  }

  function playEnd() {
    play("end1");
  }

  return {
    play: play,
    playKick: playKick,
    playCheer: playCheer,
    playStart: playStart,
    playEnd: playEnd,
    setRecorder: setRecorder
  };
}
