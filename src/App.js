
import { useEffect, useRef, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';
import Modal from './components/Modal';
const cardImages = [
  {"src": "/img/CataphractiiFist.jpg", matched: false},
  {
    "src": "/img/Mark2Fist.jpg", matched: false
  },
  {
    "src": "/img/Mark3Fist.jpg", matched: false
  },
  {
    "src": "/img/Mark4Fist.jpg", matched: false
  },
  {
    "src": "/img/Mark6Fist.jpg", matched: false
  },
  {
    "src": "/img/TarTarosFist.jpg", matched: false
  }
]

function App() {

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const[score, setScore] = useState(0)
  const[choiceOne, setChoiceOne] = useState(null)
  const[choiceTwo, setChoiceTwo] = useState(null)
  const[disabled, setDisabled] = useState(false)
  const[timeLeft, setTimeLeft] = useState(30);
  const[gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef(null);

  //automatic music players 

  useEffect(() => {
    audioRef.current = new Audio('/music/Horus Heresy Legions Battle Theme.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  // shuffle cards
  const shuffleCards = ( ) => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(()=> Math.random() - 0.5)
      .map((card)=>({...card, id: Math.random() }))
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setTimeLeft(30)
    setScore(0)
    setShowModal(false)
    setGameOver(false)

    audioRef.current.play().catch(error => console.error("Error playing audio:", error));
  }

  //handle a choice
  const handleChoice = (card) =>{
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)

  }
  //select 2 cards to check for match 
  useEffect (() => {
    
    if(choiceOne && choiceTwo){
      setDisabled(true)
      if(choiceOne.src === choiceTwo.src){
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src){
              return {
               ...card,
                matched: true
              }
            }else{
              return card
            }
          })
        })
        setScore(prevScore => prevScore + 100);
        resetTurn()
      }else{
        setTimeout(() => resetTurn(), 1000)
      }
      
    }
  }, [choiceOne, choiceTwo])

  console.log(cards)

  // game over 

  useEffect(() => {
    if(cards.every(card => card.matched)){
      setGameOver(true)
    }
  }, [cards]);

  useEffect(() => {
    if (cards.every(card => card.matched)) {
      setGameOver(true);
    }
  }, [cards]);
  
  useEffect(() => {
    let timerID;
    if (timeLeft > 0 && !gameOver) {
      timerID = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 || gameOver) {
      setShowModal(true);
    }
    return () => clearTimeout(timerID);
  }, [timeLeft, gameOver]);
 

  // reset the game

    const resetTurn = () => {
      setChoiceOne(null)
      setChoiceTwo(null)
      setTurns(prevTurns => prevTurns + 1)
      setDisabled(false)
    }

    useEffect(() => {
      shuffleCards()
    }, [])


  return (
    <div className="App">
      
     <h1>Memory Training

     </h1>
     <p>Score: {score}</p> {/*Display the Score */}
     <p>time: {timeLeft} seconds </p>{/*Display the time */}
     <button onClick ={shuffleCards}>New Game</button>
     <div className="card-grid">
        {cards.map(card => (
          <SingleCard
           key={card.id} 
           card = {card}
           handleChoice = {handleChoice}
           flipped = {card === choiceOne || card === choiceTwo || card.matched}
           disabled={disabled}
           />
        ))}
     </div>
     <p>Turns: {turns}</p>
     {showModal && (
      <Modal>
        <h2>{gameOver ? 'You are Victorious!' : 'You have been defeated'}</h2>
        <button onClick={shuffleCards}>Back to the practice cages</button>
      </Modal>
    )}
    <p>I do not own the music credit goes to the creator</p>
    </div>
  );
}

export default App;
