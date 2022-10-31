const { Server } = require("socket.io");

const io = new Server(3002, { perMessageDeflate: false, cors: { origin: ["http://localhost:3000"] }, });
let time = 20;

let names = [];
let timerOn = false;
//kello
const timerFunction = () => {
    if (!timerOn) {
        const timer = setInterval(() => {
            timerOn = true;
            let min = Math.floor(time / 60);
            let sec = time % 60;

            sec = sec < 10 ? "0" + sec : sec;
            time--;

            io.sockets.emit('timerCount', { min: min, sec: sec });


            if (min == 0 && sec == 0) {




                var pickWinner = Math.floor(Math.random() * names.length);



                io.sockets.emit("winner", { data: names[pickWinner] });

                clearInterval(timer);
                names = []
                timerOn = false;
                time = 20;
                io.sockets.emit("players", { players: names });

            }

        }, 1000);
    }
}

io.on("connection", (socket) => {
    //näyttää pelaajat sivustolle
    io.sockets.emit("players", { players: names });

    socket.on("joinRoom", (name) => {
        //jos nimi on listassa ei lisätä uudelleen
        if (names.includes(name)) {
            

        } else {
            if (time > 2) {
                names.push(name);
            }

        }
        //näyttää pelaajat sivustolle
        io.sockets.emit("players", { players: names });

        
        //jos osallistujia on enemmän kuin 2 niin aloita peli
        
        if (names.length ==2) {
            timerFunction();

        }
    });
    
});