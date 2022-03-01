    const ws = new WebSocket("ws://localhost:6969");
    const video = document.getElementById("playback");
    const guid = Math.random();
    let superUser = false;
    let playerState = {};

    function sendPlayerState()
    {
        setInterval(() =>
        {
            playerState =
            {
                'currentTime': video.currentTime,
                'isPaused': video.paused,
                'type': 'admin',
                'superUser': superUser,
                'guid': guid
            }
            ws.send(JSON.stringify(playerState));
        }, 1000);
    }

    ws.addEventListener("open", () =>
    {
        sendPlayerState();
        console.log("Connected.");
    });

    ws.addEventListener('message', msg =>
    {
        console.log(msg.data);

        if (msg.data == 'start')
        {
            video.play();
        }
        else
        {
            let packetBuffer = JSON.parse(msg.data);
            if (packetBuffer.guid != guid)
            {
                if (packetBuffer.superUser && !superUser)
                {
                    if (packetBuffer.isPaused && !video.paused)
                    {
                        video.pause();
                    }

                    if (!packetBuffer.isPaused && video.isPaused)
                    {
                        video.play();
                    }

                    if (Math.abs(packetBuffer.currentTime - video.currentTime) >= 1)
                    {
                        video.currentTime = packetBuffer.currentTime;
                        video.play();
                    }
                }
            }
        }
    });