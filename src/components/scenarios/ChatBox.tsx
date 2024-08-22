// src/components/ScenarioForm.tsx

import React, { useEffect, useState } from "react";
import {
  IonInput,
  IonItem,
  IonButton,
  IonTextarea,
  IonCard,
  IonList,
  IonText,
} from "@ionic/react";
import { Scenario, answerQuestion } from "../../data/scenarios";
import { useHistory } from "react-router";
interface ScenarioFormProps {
  scenario: Scenario;
  setShowLoading: (show: boolean) => void;
}
const ChatBox: React.FC<ScenarioFormProps> = ({ scenario, setShowLoading }) => {
  const [question, setQuestion] = useState<string>(scenario.question_1 || "");
  const history = useHistory();
  const [updatedScenario, setScenario] = useState<Scenario>(scenario);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>(
    scenario.questions || []
  );
  const [answers, setAnswers] = useState<string[]>(scenario.answers || []);

  const handleAnswerChange = (answer: string, index: number) => {
    console.log("answer", answer);
    console.log("index", index);
    setQuestionNumber(index + 1);
    setCurrentAnswer(answer);
  };

  useEffect(() => {
    console.log("chat scenario", updatedScenario);
    console.log("chat question", updatedScenario.question_1);
    if (updatedScenario.question_1) {
      setQuestion(updatedScenario.question_1);
    }
    if (updatedScenario.questions) {
      console.log("setting questions", updatedScenario.questions);
      setQuestions(updatedScenario.questions);
    }
    if (updatedScenario.answers) {
      console.log("setting answers", updatedScenario.answers);
      setAnswers(updatedScenario.answers);
    }
  }, []);
  const handleSubmit = async () => {
    setShowLoading(true);
    const finalizing = questionNumber === 2;

    console.log("submitting finalizing", finalizing);
    console.log("submitting questionNumber", questionNumber);
    console.log("submitting currentAnswer", currentAnswer);
    const updatedScenario = await answerQuestion(
      scenario.id!,
      questionNumber,
      currentAnswer,
      finalizing
    );
    setShowLoading(false);
    console.log("updatedScenario", updatedScenario);
    setScenario(updatedScenario);
    if (finalizing) {
      console.log("pushing to results", updatedScenario);
      const boardId = updatedScenario.board?.id;
      history.push(`/boards/${boardId}`);
    } else {
      // setQuestionNumber(questionNumber + 1);
      // setCurrentAnswer("");
      window.location.reload();
    }
  };
  return (
    <div className="ion-padding">
      <div className="my-2 flex justify-center">
        <IonText className="mt-2 mr-3">
          <span className="font-bold">Name:</span> {scenario.name}
        </IonText>
      </div>
      <div className="my-2 flex justify-center">
        <IonText className="mt-2 mr-3">
          <span className="font-bold">Age Range: </span>
          {scenario.age_range}
        </IonText>
      </div>
      <div className="my-2 flex justify-center">
        <IonText className="mt-2 mr-3">
          {" "}
          <span className="font-bold">Description: </span>{" "}
          {scenario.initial_description}
        </IonText>
      </div>

      <div className="my-5 p-1">
        {scenario.questions && (
          <IonList class="mt-3 px-2 border shadow-md py-10" lines="none">
            {questions.map((q: any, i: number) => (
              <div key={i}>
                <IonItem className="mt-2 font-serif w-full" lines="none">
                  <IonText className="mt-2 mr-3 text-xs w-1/6 md:w-1/8 lg:w-1/12">
                    Question {i + 1}
                  </IonText>
                  <IonText
                    className="mt-2 mr-3 w-5/6 md:w-7/8 lg:w-11/12"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                  >
                    {q["question"]}
                  </IonText>
                </IonItem>
                {q["answer"] ? (
                  <IonItem className="mt-2 font-bold w-full" lines="none">
                    <IonText className="mt-2 mr-3 text-xs w-1/6 md:w-1/8 lg:w-1/12">
                      Your Answer
                    </IonText>
                    <IonText
                      className="mt-2 mr-3"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                    >
                      {q["answer"]}
                    </IonText>
                  </IonItem>
                ) : (
                  <IonItem className="mt-2 font-bold w-full p-4" lines="none">
                    <IonTextarea
                      className="m-3 pl-4"
                      value={currentAnswer}
                      onIonInput={(e) => handleAnswerChange(e.detail.value!, i)}
                      required
                      placeholder="  Type your answer here"
                    ></IonTextarea>
                  </IonItem>
                )}
              </div>
            ))}
          </IonList>
        )}
      </div>
      <div className="w-full flex justify-center">
        {answers.length > 2 ? (
          <IonButton
            fill="solid"
            className=""
            color="success"
            size="large"
            expand="block"
            onClick={handleSubmit}
          >
            Chat
          </IonButton>
        ) : (
          <IonButton
            fill="solid"
            className="hidden"
            color="success"
            size="large"
            expand="block"
            onClick={handleSubmit}
          ></IonButton>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
