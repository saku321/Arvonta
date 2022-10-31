import { useEffect, useState } from "react";
import './App.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { io } from "socket.io-client";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
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
          <div id="menuDiv">
              <Navbar bg="dark" variant="dark">
                  <Container>
                  <Navbar.Brand href="#home">Koti</Navbar.Brand>
                  <Nav className="me-auto">
                      <Nav.Link href="#home">Portfolio</Nav.Link>
                      <Nav.Link href="https://github.com/saku321/Arvonta" target="_blank">Github</Nav.Link>
                      </Nav>
                  </Container>
      </Navbar>
        </div>
          {alertStatus && (
              <Alert id="alertMsg" variant="primary" >Arvonnan voittaja: {winnerTxt}</Alert>
          )}

          <div id="playerList">
              <p>Osallistujat</p>
              <ul>

                  {players.map((player,index) =>
                      <li key={index}>{player} </li>
                  )}
              </ul>

          </div>
          <div id="centerDiv">

              <h1>Osallistu arvontaan</h1>
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
              
            
            </div>
        

    </div>
  );
}

export default App;
