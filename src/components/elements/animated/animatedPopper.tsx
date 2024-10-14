import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
const ConfettiComponent = ({ confirmModalPopUp }: any) => {
  const { width, height } = useWindowSize();
  return (
    <Confetti
      width={width}
      height={height}
      run={confirmModalPopUp}
      numberOfPieces={500}
      gravity={0.5}
      initialVelocityY={20}
      recycle={false}
    />
  );
};

export default ConfettiComponent;
