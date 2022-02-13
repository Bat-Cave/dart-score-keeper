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
  let [currTurnPointsObj, setCurrTurnPointsObj] = useState([]);
  let [modalMessage, setModalMessage] = useState("OOPS! You scratched!");
  let [modalButtonMessage, setModalButtonMessage] = useState("Testing");
  let [modalAction, setModalAction] = useState("");
  let [showModal, setShowModal] = useState(false);
  let [showSignUpModal, setShowSignUpModal] = useState(false);
  let [userName, setUserName] = useState("");
  // let [failure] = useState(
  //   new Audio("https://www.myinstants.com/media/sounds/failure_O7HQcB1.mp3")
  // );
  // let [success] = useState(
  //   new Audio(
  //     "https://www.myinstants.com/media/sounds/gta-san-andreas-_RZMwPB0.mp3"
  //   )
  // );
  const jsConfetti = new JSConfetti();

  const handleScoreUpdate = (amount, spot) => {
    if (currTurnPoints + amount < 0) {
      setCurrTurnPointsObj((c) => {
        return [...c, { score: "scratch", spot: "scratch", time: Date.now() }];
      });
      return;
    }
    setCurrTurnPoints((curr) => {
      setPrevTurnPoints(curr);
      return curr + amount;
    });

    setCurrTurnPointsObj((c) => {
      return [...c, { score: amount, spot: spot, time: Date.now() }];
    });
  };

  const handleFinishTurn = () => {
    if (currTurnPoints > 0) {
      if (currGamePoints - currTurnPoints < 0) {
        handleScratch();
      } else {
        setCurrGamePoints((curr) => {
          setPrevGamePoints(curr);
          return curr - currTurnPoints;
        });
        setCurrTurnPoints(0);
        updateCurrGameScores(currTurnPointsObj);
        setCurrTurnPointsObj([]);
      }
    }
  };

  const handleResetGame = () => {
    setCurrGamePoints(301);
    let currUserData = JSON.parse(localStorage.getItem("pikadoUser"));
    currUserData.history[currUserData.history.length - 1].endTime = Date.now();
    let currGame = {
      gameNum: currUserData.history.length + 1,
      scores: currTurnPointsObj,
      startTime: Date.now(),
      endTime: "",
    };
    currUserData.history.push(currGame);

    localStorage.setItem("pikadoUser", JSON.stringify(currUserData));

    console.log(currUserData);
  };

  const handleResetTurn = () => {
    setCurrTurnPoints(0);
    setCurrTurnPointsObj([]);
  };

  const handleScratch = () => {
    // failure.play();
    setModalMessage("<h3>OOPS! You Scratched!</h3>");
    setModalButtonMessage("Close");
    setShowModal(true);
    jsConfetti.addConfetti({
      emojis: ["💩"],
      emojiSize: 120,
      confettiNumber: 20,
    });
    setCurrTurnPoints(0);
    updateCurrGameScores([
      { score: "scratch", spot: "scratch", time: Date.now() },
    ]);
    setCurrTurnPointsObj([]);
  };

  const getUserInfo = () => JSON.parse(localStorage.getItem("pikadoUser"));
  const setUserInfo = (user) => {
    if (user) {
      localStorage.setItem("pikadoUser", JSON.stringify(user));
    } else {
      localStorage.setItem(
        "pikadoUser",
        JSON.stringify({
          name: userName,
          history: [
            {
              gameNum: 1,
              scores: [],
              startTime: Date.now(),
              endTime: "",
            },
          ],
        })
      );
    }
  };

  const updateCurrGameScores = (scores) => {
    console.log("Updateing User Scores");
    let user = getUserInfo();
    user.history[user.history.length - 1].scores.push(scores);
    setUserInfo(user);
  };

  useEffect(() => {
    if (currGamePoints === 0) {
      // success.play();
      setModalMessage("<h3>YAY! You won!</h3>");
      setModalButtonMessage("Play Again");
      setShowModal(true);
      handleResetGame();
      jsConfetti.addConfetti({
        emojis: ["🌈", "💎", "💥", "✨", "💫", "💣"],
        emojiSize: 50,
        confettiNumber: 80,
      });
    }
    // eslint-disable-next-line
  }, [currGamePoints]);

  useEffect(() => {
    let user = getUserInfo();
    if (!user) {
      setShowSignUpModal(true);
    } else {
      setUserName(user.name);
    }
  }, []);

  return (
    <div className="home">
      <img src={dartboard} className="dartboard" alt="dartboard" />
      <div className="header">
        <div className="button-wrapper">
          <div className="button-title">
            <h4>Game {getUserInfo()?.history.length}</h4>
            <h4>Welcome Back, {userName}</h4>
          </div>
          <div className="button-group">
            <p>Game</p>
            <div className="button-title">
              <h2>
                <CountUp
                  start={prevGamePoints}
                  end={currGamePoints}
                  useEasing
                  duration={1.5}
                />
              </h2>
              <div className="buttons">
                <button
                  className="reset"
                  onClick={() => {
                    if (currGamePoints < 301) {
                      setModalMessage(
                        "<h3>Are you sure you want to reset?</h3>"
                      );
                      setModalButtonMessage("Reset Game");
                      setModalAction("reset");
                      setShowModal(true);
                    }
                  }}
                  disabled={currGamePoints === 301}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="button-group">
            <p>Turn</p>
            <div className="button-title">
              <h2>
                <CountUp
                  start={prevTurnPoints}
                  end={currTurnPoints}
                  useEasing
                  duration={1.5}
                />
              </h2>
              <div className="buttons">
                <button className="end" onClick={() => handleFinishTurn()}>
                  End
                </button>
                <button className="scratch" onClick={() => handleScratch()}>
                  Scratch
                </button>
                <button
                  className="reset"
                  onClick={() => handleResetTurn()}
                  disabled={currTurnPoints === 0}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="points-table">
        <div className="points-column">
          <div className="points-option">
            <button
              className="red bull"
              onClick={() => handleScoreUpdate(50, "Bulls Eye")}
            >
              Bull's Eye
            </button>
            <button
              className="green bull"
              onClick={() => handleScoreUpdate(25, "Bull")}
            >
              Bull
            </button>
          </div>
          <div className="points-option">
            <p>20</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(60, "Triple 20")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(40, "Double 20")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(20, "Single 20")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>19</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(57, "Triple 19")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(38, "Double 19")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(19, "Single 19")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>18</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(54, "Triple 18")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(36, "Double 18")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(18, "Single 18")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>17</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(51, "Triple 17")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(34, "Double 17")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(17, "Single 17")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>16</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(48, "Triple 16")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(32, "Double 16")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(16, "Single 16")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>15</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(45, "Triple 15")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(30, "Double 15")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(15, "Single 15")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>14</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(42, "Triple 14")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(28, "Double 14")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(14, "Single 14")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>13</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(39, "Triple 13")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(26, "Double 13")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(13, "Single 13")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>12</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(36, "Triple 12")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(24, "Double 12")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(12, "Single 12")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>11</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(33, "Triple 11")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(22, "Double 11")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(11, "Single 11")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>10</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(30, "Triple 10")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(20, "Double 10")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(10, "Single 10")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>9</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(27, "Triple 9")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(18, "Double 9")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(9, "Single 9")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>8</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(24, "Triple 8")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(16, "Double 8")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(8, "Single 8")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>7</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(21, "Triple 7")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(14, "Double 7")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(7, "Single 7")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>6</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(18, "Triple 6")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(12, "Double 6")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(6, "Single 6")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>5</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(15, "Triple 5")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(10, "Double 5")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(5, "Single 5")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>4</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(12, "Triple 4")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(8, "Double 4")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(4, "Single 4")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>3</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(9, "Triple 3")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(6, "Double 3")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(3, "Single 3")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>2</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(8, "Triple 2")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(4, "Double 2")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(2, "Single 2")}
            >
              Single
            </button>
          </div>
          <div className="points-option">
            <p>1</p>
            <button
              className="red"
              onClick={() => handleScoreUpdate(3, "Triple 1")}
            >
              Triple
            </button>
            <button
              className="green"
              onClick={() => handleScoreUpdate(2, "Double 1")}
            >
              Double
            </button>
            <button
              className="grey"
              onClick={() => handleScoreUpdate(1, "Single 1")}
            >
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
              if (modalAction === "reset") {
                handleResetGame();
                setModalAction("");
              }
              setShowModal(false);
            }}
          >
            {modalButtonMessage}
          </button>
        </div>
      </div>
      <div className={`modal ${showSignUpModal ? "visible" : "hidden"}`}>
        <div className="modal-content">
          <h3>Hey Bud.</h3>
          <h4>
            Looks like this is your first time using this app. What is your
            name?
          </h4>
          <input type="text" onInput={(e) => setUserName(e.target.value)} />
          <button
            className="modal-action"
            onClick={() => {
              setUserInfo();
              setShowSignUpModal(false);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
