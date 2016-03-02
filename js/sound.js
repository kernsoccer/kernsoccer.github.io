var Sound = function () {
  createjs.Sound.registerSound("snd/kick1.mp3", "kick1");
  createjs.Sound.registerSound("snd/kick2.mp3", "kick2");
  createjs.Sound.registerSound("snd/kick3.mp3", "kick3");
  createjs.Sound.registerSound("snd/kick4.mp3", "kick4");
  createjs.Sound.registerSound("snd/cheer1.mp3", "cheer1");
  createjs.Sound.registerSound("snd/end1.mp3", "end1");
  createjs.Sound.registerSound("snd/start1.mp3", "start1");
  createjs.Sound.registerSound("snd/start2.mp3", "start2");
  createjs.Sound.registerSound("snd/start3.mp3", "start3");

  function playKick() {
    createjs.Sound.play(Matter.Common.choose(["kick1","kick2","kick3","kick4"]));
  }

  function playCheer() {
    createjs.Sound.play("cheer1");
  }

  function playStart() {
    createjs.Sound.play(Matter.Common.choose(["start1","start2","start3"]));
  }

  function playEnd() {
    createjs.Sound.play("end1");
  }

  return {
    playKick: playKick,
    playCheer: playCheer,
    playStart: playStart,
    playEnd: playEnd
  };
}
