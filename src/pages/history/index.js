import React, { useEffect, useState } from "react";
import "./style.css";

let History = () => {
  const [userData] = useState(JSON.parse(localStorage.getItem("pikadoUser")));
  const [currGameNum, setCurrGameNum] = useState(1);
  const [spots, setSpots] = useState([]);
  const [currStats, setCurrStats] = useState("game");

  const getCleanTime = (time) => {
    let date = new Date(time);
    let hrs = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let ampm = "am";

    if (hrs > 12) {
      hrs = hrs - 12;
      ampm = "pm";
    }

    if (hrs.toString().length < 2) hrs = `0${hrs}`;
    if (min.toString().length < 2) min = `0${min}`;
    if (sec.toString().length < 2) sec = `0${sec}`;

    return `${hrs}:${min}:${sec} ${ampm}`;
  };

  const getCleanDate = (time) => {
    let date = new Date(time);
    let mon = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    if (mon.toString().length < 2) mon = `0${mon}`;
    if (day.toString().length < 2) day = `0${day}`;

    return `${mon}/${day}/${year}`;
  };

  const msToTime = (duration) => {
    let milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  };

  const getSpots = (scores) => {
    let newSpots = [];
    for (let i = 0; i < scores.length; i++) {
      for (let j = 0; j < scores[i].length; j++) {
        let spot = scores[i][j].spot;
        newSpots.push(spot);
      }
    }
    return newSpots;
  };

  const getAllTimeData = () => {
    let data = {
      gamesPlayed: 0,
      dartsThrown: 0,
      scores: [],
      totalPointsScored: 0,
    };

    let userDataCopy = userData;

    let getDartsThrown = () => {
      let thrown = 0;
      for (let i = 0; i < userDataCopy.history.length; i++) {
        let currGame = userDataCopy.history[i];
        for (let j = 0; j < currGame.scores.length; j++) {
          thrown += currGame.scores[j].length;
        }
      }
      return thrown;
    };

    let getAllScores = () => {
      let scores = [];
      for (let i = 0; i < userDataCopy.history.length; i++) {
        let currGame = userDataCopy.history[i];
        for (let j = 0; j < currGame.scores.length; j++) {
          for (let k = 0; k < currGame.scores[j].length; k++) {
            scores.push(currGame.scores[j][k]);
          }
        }
      }
      return scores;
    };

    let getTotalScore = () => {
      let score = 0;
      for (let i = 0; i < userDataCopy.history.length; i++) {
        let currGame = userDataCopy.history[i];
        for (let j = 0; j < currGame.scores.length; j++) {
          for (let k = 0; k < currGame.scores[j].length; k++) {
            score += currGame.scores[j][k].score;
          }
        }
      }
      return score;
    };

    data.gamesPlayed = userDataCopy.history.length - 1;
    data.dartsThrown = getDartsThrown();
    data.scores = getAllScores();
    data.totalPointsScored = getTotalScore();

    return data;
  };

  useEffect(() => {
    setSpots(getSpots(userData?.history[currGameNum - 1]?.scores));
    // eslint-disable-next-line
  }, [currGameNum]);

  useEffect(() => {
    if (currStats === "all-time") {
      setSpots(getSpots([getAllTimeData().scores]));
    } else {
      setSpots(getSpots(userData?.history[currGameNum - 1]?.scores));
    }
    // eslint-disable-next-line
  }, [currStats]);

  return (
    <div className="stats">
      <h1>Stats</h1>
      <div className="stats-button">
        <button onClick={() => setCurrStats("all-time")}>All Time Stats</button>
        <button onClick={() => setCurrStats("game")}>Game Stats</button>
      </div>
      <div
        className="stats-section"
        style={{ display: currStats === "game" ? "block" : "none" }}
      >
        <h3>Game Stats</h3>
        <select onChange={(e) => setCurrGameNum(e.target.value)}>
          {userData?.history.map((g, i) => {
            if (i > userData.history.length - 2) return null;
            return (
              <option key={`game-number-${i + 1}`} value={g.gameNum}>
                Game {g.gameNum} ({getCleanDate(g.startTime)})
              </option>
            );
          })}
        </select>
        <div className="game-table">
          <div className="game-summary">
            <h3 style={{ width: "100%", margin: "4px" }}>Game Summary</h3>
            <div className="game-stat">
              <p>Number of Turns</p>
              <h5>{userData?.history?.[currGameNum - 1].scores.length}</h5>
            </div>
            <div className="game-stat">
              <p>Game Duration</p>
              <h5>
                {msToTime(
                  userData?.history?.[currGameNum - 1].endTime -
                    userData?.history?.[currGameNum - 1].startTime
                )}
              </h5>
            </div>
            <div className="game-stat">
              <p>Start Time</p>
              <h5>
                {`
                ${getCleanDate(userData?.history?.[currGameNum - 1].startTime)} 
                ${getCleanTime(userData?.history?.[currGameNum - 1].startTime)}
                `}
              </h5>
            </div>
            <div className="game-stat">
              <p>End Time</p>
              <h5>
                {`
                ${getCleanDate(userData?.history?.[currGameNum - 1].endTime)} 
                ${getCleanTime(userData?.history?.[currGameNum - 1].endTime)}
                `}
              </h5>
            </div>
          </div>
          <div className="turn-header">
            <div className="turn-title">
              <p>Turn #</p>
            </div>
            <div className="turn-scores">
              <div className="turn-score">
                <p className="dart-score">Score</p>
                <p>Board Spot</p>
                <p className="dart-time">Time</p>
              </div>
            </div>
          </div>
          {userData?.history?.[currGameNum - 1]?.scores.map((s, i) => {
            let mappedScores = s.map((e, j) => {
              let triple = e.spot.includes("Triple") ? "Triple" : "";
              let double = e.spot.includes("Double") ? "Double" : "";
              let single = e.spot.includes("Single") ? "Single" : "";
              return (
                <div
                  className="turn-score"
                  key={`turn-${i + 1}-score-${j + 1}`}
                >
                  <p className="dart-score">{e.score}</p>
                  <p className={`${triple} ${double} ${single}`}>{e.spot}</p>
                  <p className="dart-time">{getCleanTime(e.time)}</p>
                </div>
              );
            });
            let getTotalTurnScore = () => {
              let total = 0;
              for (let i = 0; i < s.length; i++) {
                s[i].score === "scratch"
                  ? (total = s[i].score)
                  : (total += s[i].score);
              }

              return total;
            };
            return (
              <div
                className="turn-row"
                key={`game-${currGameNum}-turn-${i + 1}`}
              >
                <div className="turn-title">
                  <h4>Turn {i + 1}</h4>
                  <h3
                    className={`${
                      getTotalTurnScore() > 80
                        ? "Triple"
                        : getTotalTurnScore() > 40
                        ? "Double"
                        : "Single"
                    }`}
                  >
                    {getTotalTurnScore()}
                  </h3>
                </div>
                <div className="turn-scores">{mappedScores}</div>
              </div>
            );
          }) || "You have not finished any games yet."}
        </div>
      </div>
      <div
        className="stats-section"
        style={{ display: currStats === "all-time" ? "block" : "none" }}
      >
        <h3>All Time Stats</h3>
        <div className="game-table">
          <div className="game-summary">
            <h3 style={{ width: "100%", margin: "4px" }}>Stats Summary</h3>
            <div className="game-stat">
              <p>Number of Games Played</p>
              <h5>{getAllTimeData().gamesPlayed}</h5>
            </div>
            <div className="game-stat">
              <p>Darts Thrown</p>
              <h5>{getAllTimeData().dartsThrown}</h5>
            </div>
            <div className="game-stat">
              <p>Total Points Scored</p>
              <h5>{getAllTimeData().totalPointsScored}</h5>
            </div>
            <div className="game-stat">
              <p>Average Darts per Game</p>
              <h5>
                {(
                  getAllTimeData().dartsThrown / getAllTimeData().gamesPlayed
                ).toFixed(2)}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <h3>Dart Spread</h3>
      <div className="game-dart-spread">
        <span
          className={`spot trip-20 ${
            spots.includes("Triple 20") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 20").length}
        ></span>
        <span
          className={`spot dub-20 ${
            spots.includes("Double 20") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 20").length}
        ></span>
        <span
          className={`spot sing-20 ${
            spots.includes("Single 20") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 20").length}
        ></span>
        <span
          className={`spot trip-19 ${
            spots.includes("Triple 19") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 19").length}
        ></span>
        <span
          className={`spot dub-19 ${
            spots.includes("Double 19") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 19").length}
        ></span>
        <span
          className={`spot sing-19 ${
            spots.includes("Single 19") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 19").length}
        ></span>
        <span
          className={`spot trip-18 ${
            spots.includes("Triple 18") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 18").length}
        ></span>
        <span
          className={`spot dub-18 ${
            spots.includes("Double 18") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 18").length}
        ></span>
        <span
          className={`spot sing-18 ${
            spots.includes("Single 18") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 18").length}
        ></span>
        <span
          className={`spot trip-17 ${
            spots.includes("Triple 17") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 17").length}
        ></span>
        <span
          className={`spot dub-17 ${
            spots.includes("Double 17") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 17").length}
        ></span>
        <span
          className={`spot sing-17 ${
            spots.includes("Single 17") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 17").length}
        ></span>
        <span
          className={`spot trip-16 ${
            spots.includes("Triple 16") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 16").length}
        ></span>
        <span
          className={`spot dub-16 ${
            spots.includes("Double 16") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 16").length}
        ></span>
        <span
          className={`spot sing-16 ${
            spots.includes("Single 16") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 16").length}
        ></span>
        <span
          className={`spot trip-15 ${
            spots.includes("Triple 15") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 15").length}
        ></span>
        <span
          className={`spot dub-15 ${
            spots.includes("Double 15") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 15").length}
        ></span>
        <span
          className={`spot sing-15 ${
            spots.includes("Single 15") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 15").length}
        ></span>
        <span
          className={`spot trip-14 ${
            spots.includes("Triple 14") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 14").length}
        ></span>
        <span
          className={`spot dub-14 ${
            spots.includes("Double 14") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 14").length}
        ></span>
        <span
          className={`spot sing-14 ${
            spots.includes("Single 14") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 14").length}
        ></span>
        <span
          className={`spot trip-13 ${
            spots.includes("Triple 13") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 13").length}
        ></span>
        <span
          className={`spot dub-13 ${
            spots.includes("Double 13") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 13").length}
        ></span>
        <span
          className={`spot sing-13 ${
            spots.includes("Single 13") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 13").length}
        ></span>
        <span
          className={`spot trip-12 ${
            spots.includes("Triple 12") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 12").length}
        ></span>
        <span
          className={`spot dub-12 ${
            spots.includes("Double 12") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 12").length}
        ></span>
        <span
          className={`spot sing-12 ${
            spots.includes("Single 12") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 12").length}
        ></span>
        <span
          className={`spot trip-11 ${
            spots.includes("Triple 11") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 11").length}
        ></span>
        <span
          className={`spot dub-11 ${
            spots.includes("Double 11") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 11").length}
        ></span>
        <span
          className={`spot sing-11 ${
            spots.includes("Single 11") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 11").length}
        ></span>
        <span
          className={`spot trip-10 ${
            spots.includes("Triple 10") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 10").length}
        ></span>
        <span
          className={`spot dub-10 ${
            spots.includes("Double 10") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 10").length}
        ></span>
        <span
          className={`spot sing-10 ${
            spots.includes("Single 10") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 10").length}
        ></span>
        <span
          className={`spot trip-9 ${
            spots.includes("Triple 9") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 9").length}
        ></span>
        <span
          className={`spot dub-9 ${
            spots.includes("Double 9") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 9").length}
        ></span>
        <span
          className={`spot sing-9 ${
            spots.includes("Single 9") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 9").length}
        ></span>
        <span
          className={`spot trip-8 ${
            spots.includes("Triple 8") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 8").length}
        ></span>
        <span
          className={`spot dub-8 ${
            spots.includes("Double 8") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 8").length}
        ></span>
        <span
          className={`spot sing-8 ${
            spots.includes("Single 8") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 8").length}
        ></span>
        <span
          className={`spot trip-7 ${
            spots.includes("Triple 7") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 7").length}
        ></span>
        <span
          className={`spot dub-7 ${
            spots.includes("Double 7") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 7").length}
        ></span>
        <span
          className={`spot sing-7 ${
            spots.includes("Single 7") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 7").length}
        ></span>
        <span
          className={`spot trip-6 ${
            spots.includes("Triple 6") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 6").length}
        ></span>
        <span
          className={`spot dub-6 ${
            spots.includes("Double 6") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 6").length}
        ></span>
        <span
          className={`spot sing-6 ${
            spots.includes("Single 6") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 6").length}
        ></span>
        <span
          className={`spot trip-5 ${
            spots.includes("Triple 5") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 5").length}
        ></span>
        <span
          className={`spot dub-5 ${
            spots.includes("Double 5") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 5").length}
        ></span>
        <span
          className={`spot sing-5 ${
            spots.includes("Single 5") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 5").length}
        ></span>
        <span
          className={`spot trip-4 ${
            spots.includes("Triple 4") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 4").length}
        ></span>
        <span
          className={`spot dub-4 ${
            spots.includes("Double 4") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 4").length}
        ></span>
        <span
          className={`spot sing-4 ${
            spots.includes("Single 4") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 4").length}
        ></span>
        <span
          className={`spot trip-3 ${
            spots.includes("Triple 3") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 3").length}
        ></span>
        <span
          className={`spot dub-3 ${
            spots.includes("Double 3") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 3").length}
        ></span>
        <span
          className={`spot sing-3 ${
            spots.includes("Single 3") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 3").length}
        ></span>
        <span
          className={`spot trip-2 ${
            spots.includes("Triple 2") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 2").length}
        ></span>
        <span
          className={`spot dub-2 ${
            spots.includes("Double 2") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 2").length}
        ></span>
        <span
          className={`spot sing-2 ${
            spots.includes("Single 2") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 2").length}
        ></span>
        <span
          className={`spot trip-1 ${
            spots.includes("Triple 1") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Triple 1").length}
        ></span>
        <span
          className={`spot dub-1 ${
            spots.includes("Double 1") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Double 1").length}
        ></span>
        <span
          className={`spot sing-1 ${
            spots.includes("Single 1") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Single 1").length}
        ></span>
        <span
          className={`spot bulls-eye-spread ${
            spots.includes("Bulls Eye") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Bulls Eye").length}
        ></span>
        <span
          className={`spot bull-spread ${
            spots.includes("Bull") ? "show" : "hide"
          }`}
          datadartoccurences={spots.filter((s) => s === "Bull").length}
        ></span>
      </div>
    </div>
  );
};

export default History;
