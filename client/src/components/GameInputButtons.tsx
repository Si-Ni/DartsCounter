import { GameInputButtonsProps } from "../global/types";

function GameInputButtons(props: GameInputButtonsProps) {
  const formatNumberToString = (number: number): string => {
    if (number === 50) return "Bull";
    return `${number}`;
  };

  return (
    <>
      {props.values.map((number) => (
        <button
          key={number}
          className="button is-primary m-1 is-size-5"
          onClick={() => props.cbHandleButtonClicked(number)}
          style={{ width: `${props.btnSize}px` }}
        >
          {formatNumberToString(number)}
        </button>
      ))}
      {props.showMissButton && (
        <button
          key={"Miss"}
          className="button is-danger m-1 is-size-5"
          onClick={() => props.cbHandleButtonClicked(0)}
          style={{ width: `${props.btnSize}px` }}
        >
          Miss
        </button>
      )}
    </>
  );
}
export default GameInputButtons;
