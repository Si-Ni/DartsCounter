import { useEffect, useState } from "react";
import PlayerMenu from "../components/PlayerMenu";
import { Gamemode, OnlineMultiplayerMenuProps } from "../global/types";
import { useNavigate, useParams } from "react-router-dom";
import SettingsMenu from "./SettingsMenu";

function OnlineMultiplayerMenu(props: OnlineMultiplayerMenuProps) {
  const navigate = useNavigate();
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  const { code } = useParams();

  useEffect(() => {
    code && props.socket.emit("joinLobby", code);
  }, [code]);

  const handleNext = () => {
    if (props.players.length > 1) setShowSettingsMenu(true);
  };

  useEffect(() => {
    props.socket.emit("joinedSuccessfully", props.lobbyCode);

    const handleSetPlayerList = (players: string[]) => {
      props.setPlayers(players);
    };

    const handleGamemodeSelected = (gamemode: Gamemode) => {
      props.setSelectedGamemode(gamemode);
    };

    props.socket.on("updatePlayersList", handleSetPlayerList);

    props.socket.on("leaderSelectedGamemode", handleGamemodeSelected);

    return () => {
      props.socket.off("updatePlayersList", handleSetPlayerList);
      props.socket.off("leaderSelectedGamemode", handleGamemodeSelected);
    };
  }, [props.socket, props.setPlayers]);

  return (
    <>
      {showSettingsMenu ? (
        <SettingsMenu
          selectedGamemode={props.selectedGamemode}
          setSelectedGamemode={props.setSelectedGamemode}
          setsToWin={props.setsToWin}
          setSetsToWin={props.setSetsToWin}
          legsForSet={props.legsForSet}
          setLegsForSet={props.setLegsForSet}
          cbBackBtnClicked={() => setShowSettingsMenu(false)}
          cbNextBtnClicked={props.cbNextBtnClicked}
        />
      ) : (
        <div className="hero is-justify-content-center is-align-items-center is-fullheight">
          <div className="hero-body">
            <div className="container box">
              <PlayerMenu players={props.players} setPlayers={props.setPlayers} isEditable={false} />
              <div className="buttons is-centered mt-5">
                <button
                  className="button is-danger m-1"
                  onClick={() => {
                    props.socket.emit("leaveLobby");
                    navigate("/multiplayer");
                  }}
                >
                  Back
                </button>
                {props.isLobbyLeader && (
                  <button className="button is-primary m-1" onClick={handleNext} disabled={props.players.length <= 1}>
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OnlineMultiplayerMenu;
