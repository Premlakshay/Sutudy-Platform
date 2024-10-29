"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const Question = ({
  question,
  index,
  selectedAnswer,
  handleSelect,
  isCorrect,
  showExplanation,
}: {
  question: any;
  index: number;
  selectedAnswer: string;
  handleSelect: (index: number, option: string) => void;
  isCorrect: (opt: string) => boolean;
  showExplanation: boolean;
}) => {
  const options = ["option1", "option2", "option3", "option4"];
  return (
    <div className="m-4 p-3 shadow-lg dark:shadow-teal-200 pb-10">
      <Label className="ml-3 mt-3">
        Q.{index + 1} &nbsp;&nbsp;{question.question}
      </Label>
      {options.map((opt, idx) => (
        <div className="flex justify-between ml-4 mt-3 w-full mb-4" key={opt}>
          <label
            className={`flex justify-between pl-2 items-center w-full me-3 cursor-pointer ${
              selectedAnswer === opt
                ? question[opt] === question.correct
                  ? "bg-green-400"
                  : "bg-red-400"
                : selectedAnswer && isCorrect(opt)
                ? "bg-green-400"
                : ""
            }`}
            onClick={() => handleSelect(index, opt)}
          >
            <div>
              <span className="text-red-500 me-2">{String.fromCharCode(65 + idx)}.</span>
              &nbsp;&nbsp;&nbsp;&nbsp;{question[opt]}
            </div>
            <Input
              type="radio"
              name={`question-${index}`}
              checked={selectedAnswer === opt}
              className="me-8 w-5"
              onChange={() => handleSelect(index, opt)}
            />
          </label>
        </div>
      ))}
      {showExplanation && (
        <Label className="ml-4 mt-3 pb-16 sm:pb-36 text-blue-500 font-bold text-lg">{question.explanation}</Label>
      )}
    </div>
  );
};
export default function McqView({ mcq }: { mcq: any[] }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [showExplanation, setShowExplanation] = useState<any>({});
  useEffect(() => {
    if(mcq && mcq.length > 0) {
      setQuestions(mcq);
    }
  }, [mcq]);
  const handleSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev: any) => ({
      ...prev,
      [questionIndex]: option,
    }));
    setShowExplanation((prev: any) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };
  return (
    <>
      <div className="flex flex-col h-screen">
  <div className="flex-grow w-full overflow-hidden"> 
    <div className="w-full h-full"> 
      <ScrollArea className="h-full w-full rounded-md overflow-y-auto"> 
        <div className="mt-4 mb-28">
          {questions.length > 0 ? (
            <>
              {questions.map((q, index) => (
                <Question
                  key={index}
                  question={q}
                  index={index}
                  selectedAnswer={selectedAnswers[index]}
                  handleSelect={handleSelect}
                  isCorrect={(opt) => q[opt] === q.correct}
                  showExplanation={showExplanation[index]}
                />
              ))}
            </>
          ) : (
            <p className="text-center mt-4">No questions available.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  </div>
  </div>
    </>
  );
}
