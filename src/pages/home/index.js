import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import JSConfetti from "js-confetti";
import dartboard from "../../images/dartboard.png";
import "./style.css";

let Home = () => {
  // let [currGameNum, setCurrGameNum] = useState(1);
  // let [scores, setScores] = useState([]);
  let [currGamePoints, setCurrGamePoints] = useState(301);
  let [prevGamePoints, setPrevGamePoints] = useState(301);
  let [currTurnPoints, setCurrTurnPoints] = useState(0);
  let [prevTurnPoints, setPrevTurnPoints] = useState(0);
  let [modalMessage, setModalMessage] = useState("OOPS! You scratched!");
  let [modalAction, setModalAction] = useState("scratch");
  let [modalButtonMessage, setModalButtonMessage] = useState("Testing");
  let [showModal, setShowModal] = useState(false);
  let [failure] = useState(
    new Audio("https://www.myinstants.com/media/sounds/failure_O7HQcB1.mp3")
  );
  let [success] = useState(
    new Audio(
      "https://www.myinstants.com/media/sounds/gta-san-andreas-_RZMwPB0.mp3"
    )
  );
  const jsConfetti = new JSConfetti();

  const handleScoreUpdate = (amount) => {
    if (currTurnPoints + amount < 0) return;
    setCurrTurnPoints((curr) => {
      setPrevTurnPoints(curr);
      return curr + amount;
    });
  };

  const handleFinishTurn = () => {
    if (currGamePoints - currTurnPoints < 0) {
      handleScratch();
    } else {
      setCurrGamePoints((curr) => {
        setPrevGamePoints(curr);
        return curr - currTurnPoints;
      });
      setCurrTurnPoints(0);
    }
  };

  const handleResetGame = () => {
    setCurrGamePoints(301);
  };

  const handleResetTurn = () => {
    setCurrTurnPoints(0);
  };

  const handleScratch = () => {
    failure.play();
    setModalMessage("<h3>OOPS! You Scratched!</h3>");
    setModalButtonMessage("Close");
    setModalAction("scratch");
    setShowModal(true);
    jsConfetti.addConfetti({
      emojis: ["💩"],
      emojiSize: 120,
      confettiNumber: 40,
    });
  };

  useEffect(() => {
    if (currGamePoints === 0) {
      success.play();
      setModalMessage("<h3>YAY! You won!</h3>");
      setModalButtonMessage("Play Again");
      setModalAction("win");
      setShowModal(true);
      jsConfetti.addConfetti({
        emojis: ["🌈", "💎", "💥", "✨", "💫", "💣"],
        emojiSize: 50,
        confettiNumber: 80,
      });
    }
    // eslint-disable-next-line
  }, [currGamePoints]);

  // useEffect(() => {
  //   let user = localStorage.getItem("pikadoUser");
  //   console.log(user);
  //   if (!user) {
  //     localStorage.setItem(
  //       "pikadoUser",
  //       JSON.stringify({
  //         history: [
  //           {
  //             gameNum: 1,
  //             scores: [],
  //             outcome: "",
  //           },
  //         ],
  //       })
  //     );
  //   } else {
  //   }
  // }, []);

  return (
    <div className="home">
      <img src={dartboard} className="dartboard" alt="dartboard" />
      <div className="header">
        <div className="button-wrapper">
          <div>
            <p>Game</p>
            <h2>
              <CountUp
                start={prevGamePoints}
                end={currGamePoints}
                useEasing
                duration={1.5}
              />
            </h2>
            <button
              className="reset"
              onClick={() => handleResetGame()}
              disabled={currGamePoints === 301}
            >
              Reset
            </button>
          </div>
          <div>
            <p>Turn</p>
            <h2>
              <CountUp
                start={prevTurnPoints}
                end={currTurnPoints}
                useEasing
                duration={1.5}
              />
            </h2>
            <button
              className="reset"
              onClick={() => handleResetTurn()}
              disabled={currTurnPoints === 0}
            >
              Reset
            </button>
            <button className="scratch" onClick={() => handleScratch()}>
              Scratch
            </button>
            <button className="end" onClick={() => handleFinishTurn()}>
              End
            </button>
          </div>
        </div>
      </div>
      <div className="points-table">
        <div className="points-column">
          <div className="points-option">
            <button className="red bull" onClick={() => handleScoreUpdate(50)}>
              Bull's Eye
            </button>
            <button
              className="green bull"
              onClick={() => handleScoreUpdate(25)}
            >
              Bull
            </button>
          </div>
          <div className="points-option">
            <p>20</p>
            <button className="red" onClick={() => handleScoreUpdate(60)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(40)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(20)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>19</p>
            <button className="red" onClick={() => handleScoreUpdate(57)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(38)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(19)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>18</p>
            <button className="red" onClick={() => handleScoreUpdate(54)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(36)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(18)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>17</p>
            <button className="red" onClick={() => handleScoreUpdate(51)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(34)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(17)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>16</p>
            <button className="red" onClick={() => handleScoreUpdate(48)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(32)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(16)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>15</p>
            <button className="red" onClick={() => handleScoreUpdate(45)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(30)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(15)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>14</p>
            <button className="red" onClick={() => handleScoreUpdate(42)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(28)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(14)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>13</p>
            <button className="red" onClick={() => handleScoreUpdate(39)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(26)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(13)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>12</p>
            <button className="red" onClick={() => handleScoreUpdate(36)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(24)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(12)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>11</p>
            <button className="red" onClick={() => handleScoreUpdate(33)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(22)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(11)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>10</p>
            <button className="red" onClick={() => handleScoreUpdate(30)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(20)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(10)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>9</p>
            <button className="red" onClick={() => handleScoreUpdate(27)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(18)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(9)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>8</p>
            <button className="red" onClick={() => handleScoreUpdate(24)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(16)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(8)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>7</p>
            <button className="red" onClick={() => handleScoreUpdate(21)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(14)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(7)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>6</p>
            <button className="red" onClick={() => handleScoreUpdate(18)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(12)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(6)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>5</p>
            <button className="red" onClick={() => handleScoreUpdate(15)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(10)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(5)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>4</p>
            <button className="red" onClick={() => handleScoreUpdate(12)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(8)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(4)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>3</p>
            <button className="red" onClick={() => handleScoreUpdate(9)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(6)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(3)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>2</p>
            <button className="red" onClick={() => handleScoreUpdate(8)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(4)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(2)}>
              Single
            </button>
          </div>
          <div className="points-option">
            <p>1</p>
            <button className="red" onClick={() => handleScoreUpdate(3)}>
              Triple
            </button>
            <button className="green" onClick={() => handleScoreUpdate(2)}>
              Double
            </button>
            <button className="grey" onClick={() => handleScoreUpdate(1)}>
              Single
            </button>
          </div>
        </div>
      </div>
      <div className={`modal ${showModal ? "visible" : "hidden"}`}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowModal(false)}>
            Close
          </button>
          <div dangerouslySetInnerHTML={{ __html: modalMessage }}></div>
          <button
            className="modal-action"
            onClick={() => {
              modalAction === "scratch"
                ? setCurrTurnPoints(0)
                : setCurrGamePoints(301);
              setShowModal(false);
              failure.pause();
              success.pause();
            }}
          >
            {modalButtonMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
