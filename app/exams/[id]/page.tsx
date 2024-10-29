"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NavBar from "@/app/_components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
const fetchQuestions = async (cId: string) => {
  const response = await fetch("/api/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cId }),
  });
  const data = await response.json();
  return data.questions ? data.questions[0] : null;
};
const Question = ({
  question,
  index,
  selectedAnswer,
  handleSelect,
  isCorrect,
  showExplanation,
  disabled,
}: {
  question: any;
  index: number;
  selectedAnswer: string;
  handleSelect: (index: number, option: string) => void;
  isCorrect: (opt: string) => boolean;
  showExplanation: boolean;
  disabled: boolean;
}) => {
  const options = ["option1", "option2", "option3", "option4"];
  return (
    <div className="m-4 p-3 shadow-lg dark:shadow-teal-200">
      <Label className="ml-3 mt-3">
        Q.{index + 1} &nbsp;&nbsp;{question.question}
      </Label>
      {options.map((opt, idx) => (
        <div className="flex justify-between ml-4 mt-3 w-full" key={opt}>
          <label
            className={`flex justify-between items-center w-full cursor-pointer ${
              selectedAnswer === opt
                ? question[opt] === question.correct
                  ? "bg-green-400"
                  : "bg-red-400"
                : selectedAnswer && isCorrect(opt)
                ? "bg-green-400"
                : ""
            } ${disabled ? "cursor-not-allowed" : ""}`}
            onClick={() => !disabled && handleSelect(index, opt)}
          >
            <div>
              <span className="text-red-500 me-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;{question[opt]}
            </div>
            <Input
              type="radio"
              name={`question-${index}`}
              checked={selectedAnswer === opt}
              className="me-8 w-5"
              onChange={() => !disabled && handleSelect(index, opt)}
              disabled={disabled}
            />
          </label>
        </div>
      ))}
      {showExplanation && (
        <Label className="ml-4 mt-3 text-blue-500">
          {question.explanation}
        </Label>
      )}
    </div>
  );
};

export default function Home({ params }: { params: { id: string } }) {
  const cId = params.id;
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [passing, setPassing] = useState<number>();
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState<any>({});
  const [disabledQuestions, setDisabledQuestions] = useState<any>({});
  const uploadResult = async() => {
    const response = await fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({tMarks: questions.length, cId: cId, oMarks: correctAnswers}),
      });
      const data = await response.json();
      toast(data.message);
      // if(data.flag == 0){
      //   setTimeout(()=>{
      //     toast("Redirecting To Home Page");
      //     router.push('/');
      //   }, 2000)
      // }else{
      //   setTimeout(()=>{
      //     toast("Redirecting To Dashboard");
      //     router.push('/dashboard');
      //   }, 2000)
      // }
  }
  useEffect(() => {
    const loadQuestions = async () => {
      const questionData = await fetchQuestions(cId);
      if (questionData) {
        setQuestions(questionData.questions);
        setPassing(parseInt(questionData.passMarks));
      } else {
        toast("Currently no exam for this course.");
        router.push("/");
      }
      setIsLoading(false);
    };
    loadQuestions();
  }, [cId, router]);
  const handleSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev: any) => ({
      ...prev,
      [questionIndex]: option,
    }));
    if (questions[questionIndex][option] === questions[questionIndex].correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setShowExplanation((prev: any) => ({
      ...prev,
      [questionIndex]: true,
    }));
    setDisabledQuestions((prev: any) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };
  const isCorrect = (opt: string) => {
    return questions.some((q) => q[opt] === q.correct);
  };
  const allQuestionsAnswered =
    questions.length > 0 &&
    Object.keys(selectedAnswers).length === questions.length;
  return (
    <>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex flex-grow w-screen overflow-hidden">
          <div className="w-full h-full">
            <ScrollArea className="h-full w-full rounded-md overflow-y-hidden">
              <div className="mt-4">
                {isLoading ? (
                  <div className="grid place-items-center mx-auto mt-10">
                    {[...Array(7)].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-4 mt-3"
                      >
                        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px] bg-gray-400" />
                          <Skeleton className="h-4 w-[200px] bg-gray-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
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
                            disabled={!!disabledQuestions[index]}
                          />
                        ))}
                        {allQuestionsAnswered && (
                          <div className="flex justify-center m-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" onClick={()=>{if(correctAnswers >= passing){uploadResult();}}}>Submit</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Your Exam Overview</DialogTitle>
                                  <DialogDescription>
                                     Passing Mraks: {passing}, You Obtained {correctAnswers} / {questions.length}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                   { correctAnswers >= passing ? (<><p class='text-green-500'>Pass</p></>): (<><p class='text-red-500'>Failed</p></>)}
                                  </div>
                                </div>
                              <DialogFooter>You can close the tab and go to Dashboard to view activity</DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center mt-4">
                        No questions available.
                      </p>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
