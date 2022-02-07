import React, { useEffect, useState } from "react";
import "./style.css";

let History = () => {
  const [userData] = useState(JSON.parse(localStorage.getItem("pikadoUser")));
  const [currGameNum, setCurrGameNum] = useState(1);
  const [spots, setSpots] = useState([]);

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

  const getSpots = () => {
    let newSpots = [];
    for (
      let i = 0;
      i < userData?.history[currGameNum - 1]?.scores.length;
      i++
    ) {
      for (
        let j = 0;
        j < userData?.history[currGameNum - 1]?.scores[i].length;
        j++
      ) {
        let spot = userData?.history[currGameNum - 1]?.scores[i][j].spot;
        !newSpots.includes(spot) && newSpots.push(spot);
      }
    }
    return newSpots;
  };

  useEffect(() => {
    setSpots(getSpots());
    // eslint-disable-next-line
  }, [currGameNum]);

  return (
    <div className="stats">
      <h1>Stats</h1>
      <div className="stats-section">
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
      <br></br>
      <h3>Dart Spread</h3>
      <div className="game-dart-spread">
        <span
          className={`spot trip-20 ${
            spots.includes("Triple 20") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-20 ${
            spots.includes("Double 20") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-20 ${
            spots.includes("Single 20") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-19 ${
            spots.includes("Double 19") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-19 ${
            spots.includes("Double 19") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-19 ${
            spots.includes("Double 19") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-18 ${
            spots.includes("Double 18") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-18 ${
            spots.includes("Double 18") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-18 ${
            spots.includes("Double 18") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-17 ${
            spots.includes("Double 17") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-17 ${
            spots.includes("Double 17") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-17 ${
            spots.includes("Double 17") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-16 ${
            spots.includes("Double 16") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-16 ${
            spots.includes("Double 16") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-16 ${
            spots.includes("Double 16") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-15 ${
            spots.includes("Double 15") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-15 ${
            spots.includes("Double 15") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-15 ${
            spots.includes("Double 15") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-14 ${
            spots.includes("Double 14") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-14 ${
            spots.includes("Double 14") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-14 ${
            spots.includes("Double 14") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-13 ${
            spots.includes("Double 13") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-13 ${
            spots.includes("Double 13") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-13 ${
            spots.includes("Double 13") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-12 ${
            spots.includes("Double 12") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-12 ${
            spots.includes("Double 12") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-12 ${
            spots.includes("Double 12") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-11 ${
            spots.includes("Double 11") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-11 ${
            spots.includes("Double 11") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-11 ${
            spots.includes("Double 11") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-10 ${
            spots.includes("Double 10") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-10 ${
            spots.includes("Double 10") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-10 ${
            spots.includes("Double 10") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-9 ${
            spots.includes("Double 9") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-9 ${
            spots.includes("Double 9") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-9 ${
            spots.includes("Double 9") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-8 ${
            spots.includes("Double 8") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-8 ${
            spots.includes("Double 8") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-8 ${
            spots.includes("Double 8") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-7 ${
            spots.includes("Double 7") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-7 ${
            spots.includes("Double 7") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-7 ${
            spots.includes("Double 7") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-6 ${
            spots.includes("Double 6") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-6 ${
            spots.includes("Double 6") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-6 ${
            spots.includes("Double 6") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-5 ${
            spots.includes("Double 5") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-5 ${
            spots.includes("Double 5") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-5 ${
            spots.includes("Double 5") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-4 ${
            spots.includes("Double 4") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-4 ${
            spots.includes("Double 4") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-4 ${
            spots.includes("Double 4") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-3 ${
            spots.includes("Double 3") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-3 ${
            spots.includes("Double 3") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-3 ${
            spots.includes("Double 3") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-2 ${
            spots.includes("Double 2") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-2 ${
            spots.includes("Double 2") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-2 ${
            spots.includes("Double 2") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot trip-1 ${
            spots.includes("Double 1") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot dub-1 ${
            spots.includes("Double 1") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot sing-1 ${
            spots.includes("Double 1") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot bulls-eye-spread ${
            spots.includes("Bulls Eye") ? "show" : "hide"
          }`}
        ></span>
        <span
          className={`spot bull-spread ${
            spots.includes("Bull") ? "show" : "hide"
          }`}
        ></span>
      </div>
    </div>
  );
};

export default History;
