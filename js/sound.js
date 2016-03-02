var Sound = function () {
  createjs.Sound.registerSound("snd/kick1.mp3", "kick1");
  createjs.Sound.registerSound("snd/kick2.mp3", "kick2");
  createjs.Sound.registerSound("snd/kick3.mp3", "kick3");
  createjs.Sound.registerSound("snd/kick4.mp3", "kick4");
  createjs.Sound.registerSound("snd/cheer1.mp3", "cheer1");

  function playKick() {
    createjs.Sound.play(Matter.Common.choose(["kick1","kick2","kick3","kick4"]));
  }

  function playCheer() {
    createjs.Sound.play("cheer1");
  }

  return {
    playKick: playKick,
    playCheer: playCheer
  };
}
