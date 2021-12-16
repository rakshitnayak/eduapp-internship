import React, { useEffect, useState } from "react";
import { getPublicQuestions } from "../../hooks/useQuestionDB";
import Loader from "../containers/Loader";
import QuestionModal from "../questions/QuestionModal";

function MyAnswers({ LOGGEDINUSER }) {
  const [loading, setLoading] = useState(true);
  const [allAnswers, setAllAnswers] = useState([]);
  const [modalQID, setModalQID] = useState("");

  const fetchAnswers = async () => {
    let questions = await getPublicQuestions();
    let answers = [];

    questions.forEach((question) => {
      question.answers.forEach((element) => {
        if (element.userId === LOGGEDINUSER.UID) {
          let answer = {
            question: question.question,
            QID: question.QID,
            postedBy: question.postedBy,
            userId: question.userId,
            category: question.category,
            subject: question.subject,
            answer: element.content,
            id: element.id,
            createdAt: question.createdAt,
          };
          answers = [...answers, answer];
        }
      });
    });

    setAllAnswers(answers);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchAnswers();
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  }, []);

  //open the modal to read an article
  const openQuestionModal = (QID) => {
    setModalQID(QID);
  };
  //close the modal
  const closeQuestionModal = () => {
    setModalQID("");
  };

  return (
    <React.Fragment>
      <h2>My Answers</h2>
      {loading ? (
        <Loader height={30} />
      ) : allAnswers.length ? (
        allAnswers.map((element) => (
          <div
            key={element.QID}
            className="text-warning my-3 p-2 shadow-lg bg-dark rounded d-md-flex align-items-start"
          >
            <div className="d-block mb-2 mb-md-0">
              <p className="lead">{element.question}</p>
              <p className="border-left border-warning text-white pl-2">
                {element.answer}
              </p>
              <button
                className="btn btn-sm btn-outline-success"
                data-target="#modal-question-read"
                data-toggle="modal"
                onClick={() => openQuestionModal(element.QID)}
              >
                Read Answers<i className="fas fa-book-open ml-1"></i>
              </button>
            </div>
            <div className="text-muted ml-auto">
              <h6 className="text-muted">Category: {element.category} </h6>
              <h6 className="text-muted">Subject: {element.subject}</h6>
              <p style={{ fontSize: "0.8rem" }}>
                <i className="far fa-clock"></i>{" "}
                {element.createdAt &&
                  new Date(element.createdAt.toMillis()).toDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">You haven't posted any answers...</p>
      )}

      {/* Modal for reading question and answers */}
      <QuestionModal
        QID={modalQID}
        closeModal={closeQuestionModal}
        LOGGEDINUSER={LOGGEDINUSER}
      />
    </React.Fragment>
  );
}

export default MyAnswers;
