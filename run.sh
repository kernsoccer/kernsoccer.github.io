if (( $(ps -ef | grep -v grep | grep xboxdrv | wc -l) > 0 ))
then
sudo service xboxdrv stop
fi
sudo xboxdrv --config /usr/share/doc/xboxdrv/examples/playstation4.xboxdrv --silent &
XBOXPID1=$!
sudo xboxdrv --silent &
XBOXPID2=$!

live-server

sudo kill $XBOXPID1
sudo kill $XBOXPID2
sudo wait $XBOXPID1
sudo wait $XBOXPID2
