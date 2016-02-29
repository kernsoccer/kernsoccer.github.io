#!/bin/bash
if (( $(ps -ef | grep -v grep | grep xboxdrv | wc -l) > 0 ))
then
service xboxdrv stop
fi

sudo xboxdrv  \
  --evdev /dev/input/by-id/usb-Sony_Computer_Entertainment_Wireless_Controller-event-joystick \
  --evdev-absmap ABS_X=x1,ABS_Y=y1,ABS_Z=x2,ABS_RZ=y2 \
  --axismap -Y1=Y1,-Y2=Y2 \
  --evdev-keymap BTN_B=a,BTN_C=b,BTN_X=y,BTN_A=x \
  --evdev-keymap BTN_Z=rb,BTN_Y=lb \
  --evdev-keymap BTN_TR2=start,BTN_TL2=back,BTN_MODE=guide \
  --evdev-keymap BTN_SELECT=tl \
  --buttonmap start=tl,back=guide \
  --silent &
XBOXPID1=$!


live-server

sudo kill $XBOXPID1
sudo wait $XBOXPID1

#sudo kill $XBOXPID2
#sudo wait $XBOXPID2
