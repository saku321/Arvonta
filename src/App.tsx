import { useEffect, useState } from "react";
import './App.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { io } from "socket.io-client";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
const socket = io("http://localhost:3002");
function App() {


    const [user, setUser] = useState("user32");
    const [alertStatus, setAlertStatus] = useState(false);
    const [timer, setTimer] = useState("0:00");
    const [players, setPlayers] = useState([]);
    const [winnerTxt, setWinnerTxt] = useState("");

    useEffect(() => {
        socket.on("connect", ()=> {
            console.log("connected");
        });
        socket.on("timerCount", (data) =>{
            setTimer(`${data.min}:${data.sec}`);
        });
        socket.on("winner", (data) => {
            setWinnerTxt(data.data);
            setAlertStatus(true);
            setTimeout(() => {
                setAlertStatus(false);
            },5000);
        });
        socket.on("players", (data) => {
            setPlayers(data.players);
        });
    });
    const joinGame = () => {
        
        const currentUser = user.slice(0, 5).toString();
        socket.emit("joinRoom", currentUser);
    }
    
  return (
      <div className="App">
          {alertStatus && (
              <Alert variant="primary" style={{ textAlign: "center", fontSize: "25px" }}>Arvonnan voittaja: {winnerTxt}</Alert>
          )}
          <div id="centerDiv">

              <h1>Arvonta</h1>
              <h2>{timer}</h2>
              <InputGroup className="mb-3">
                  <InputGroup.Text id="inputGroup-sizing-default">
                      Nimi
                  </InputGroup.Text>

              
              <Form.Control className="nameInput"
                  aria-label="Default"
                      aria-describedby="inputGroup-sizing-default" onChange={(val: any) => setUser(val.target.value)}
                  /></InputGroup>
             <br></br>
              <Button variant="success" id="joinBtn" onClick={joinGame}>Osallistu arvontaan</Button>
              
              <div id="playerList">
                  <p>Osallistujat</p>
                  <ul>

                  {players.map((player) =>
                      <li>{player} </li> 
                  ) }
                  </ul>

              </div>
            </div>


    </div>
  );
}

export default App;
