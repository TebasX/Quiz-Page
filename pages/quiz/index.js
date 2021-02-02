import React from 'react';
import db from '../../db.json';
import Widget from '../../src/components/Widget'
import QuizLogo from '../../src/components/QuizLogo'
import QuizBackground from '../../src/components/QuizBackground'
import QuizContainer from '../../src/components/QuizContainer';
import AlternativesForm from '../../src/components/AlternativesForm';
import Button from '../../src/components/button';
import BackLinkArrow from '../../src/components/BackLinkArrow'

function ResultWidget({ results }){
  return (
      <Widget>
        <Widget.Header>
          Carregando...
        </Widget.Header>

        <Widget.Content>
         <p>
           Você acertou 
           {' '}
           {results.reduce((somatorioAtual, resultAtual) => {
             const isAcerto = resultAtual === true
             if (isAcerto) {
               return somatorioAtual + 1;
             }
             return somatorioAtual
            }, 0)}
            {' '}
            perguntas</p> 
         <ul>
           {results.map((result, index) => (
           <li key={`result__${result}`}>
             {index+1}
             {' '} 
             Resultado: 
             {result === true 
              ? 'Acertou' 
              : 'Errou'}
           </li>
           ))}
         </ul>
        </Widget.Content>
      </Widget>
    );
  }

function LoadingWidget(){
  return (
      <Widget>
        <Widget.Header>
          Carregando...
        </Widget.Header>

        <Widget.Content>
          [Desafio do loading]
        </Widget.Content>
      </Widget>
    );
  }

  function QuestionWidget({
    questions, 
    totalQuestions,
    questionIndex,
    onSubmit,
    addResult,

   }) {
     const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
     const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
     const questionId =`question__${questionIndex}`;
     const isCorrect = selectedAlternative === questions.answer;
     const hasAlternativeSelected = selectedAlternative !== undefined; 
    return (
      <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
         {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}  
        </h3>
      </Widget.Header>

      <img 
        alt="Descrição"
        style={{
          width: '100%',
          heigth: '150px',
          objectFit: 'cover',
        }}
        src={questions.image}
        />
        <Widget.Content>
          <h2> 
            {questions.title}
          </h2>
          <p>
              {questions.description}
          </p>

          <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 3 * 1000);
          }}
        >
          {questions.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId =`alternative__${alternativeIndex}`; 
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{display: 'none'}}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>

            )
          })}
{/* 
          <pre>
          {JSON.stringify(questions, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Você acertou!!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou...</p>}
          </AlternativesForm>
        </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
}

export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults]= React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const questions = db.questions[questionIndex]

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1*1000);
}, []);

function handleSubmitQuiz(){
  const nextQuestion = questionIndex + 1;
  if (nextQuestion < totalQuestions) {
    setCurrentQuestion(questionIndex + 1);
  } else{
    setScreenState(screenStates.RESULT);
  }
}

  return (
        <QuizBackground backgroundImage={db.bg}>
          <QuizContainer>
            <QuizLogo />
             
          {screenState === screenStates.QUIZ && (
            <QuestionWidget 
              questions={questions}
              questionIndex ={questionIndex}
              totalQuestions={totalQuestions}
              onSubmit={handleSubmitQuiz}
              addResult={addResult}
            />
            )}

            {screenState === screenStates.LOADING && <LoadingWidget />}

            {screenState === screenStates.RESULT && <ResultWidget results={results}/>}
          </QuizContainer>
        </QuizBackground>
  )}
