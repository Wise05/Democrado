// Credit https://medium.com/@hamzamakh/typewriter-effect-in-react-a103a4f385c9, by Hamza Makhkhas
import useTypewriter from "./useTypewriter"

const Typewriter = ({ text, speed }) => {
  const displayText = useTypewriter(text, speed);

  return <p>{displayText}</p>;
};

export default Typewriter;
