import GameInputButtons from "../../buttons/GameInputButtons/GameInputButtons.tsx";
import GameMultiplierButtons from "../../buttons/GmeMultiplierButtons/GameMultiplierButtons.tsx";
import PlayerScoreCardCricket from "../../playerScoreCards/PlayerScoreCardCricket/PlayerScoreCardCricket.tsx";
import { CricketGameViewProps } from "./CricketGameView";

function CricketGameView(props: CricketGameViewProps) {
  return (
    <>
      <div className="is-centered">
        <p className="is-size-3 mb-3" style={{ textAlign: "center" }}>
          Round: {props.currentRound}
        </p>
      </div>
      <div className="columns is-centered playerCardsContainerCricket">
        {props.players.map((player) => (
          <PlayerScoreCardCricket
            key={player}
            playerName={player}
            isStartingPlayer={props.players[props.startingPlayerIndex] === player}
            isCurrentPlayer={props.players[props.currentPlayerIndex] === player}
            score={props.playerStats[player].score}
            cricketStats={props.playerStats[player].cricketStats}
            sets={props.playerTotalGameStats[player].sets}
            legs={props.playerTotalGameStats[player].legs}
          />
        ))}
      </div>
      <div className="columns is-centered">
        <div className="column">
          <div className="box">
            {
              <GameInputButtons
                values={[...Array(6).keys()].map((num) => 20 - num).concat(25)}
                cbHandleButtonClicked={props.cbHandleScoreBtnClicked}
                showMissButton={true}
                btnSize={60}
              />
            }
          </div>
        </div>
      </div>
      <div className="columns is-centered">
        <GameMultiplierButtons
          multiplier={props.multiplier}
          cbHandleMultiplierClicked={props.cbHandleMultiplierClicked}
        />
      </div>
    </>
  );
}

export default CricketGameView;
