import defaultGameSections from "./gameSections.js";
import getTriviaQuestionsForGameSections from "./trivia.js";
import getDadJoke from "./dadJokes.js";

/**
 * Should return a promise that automatically resolves after some duration.
 * The promise's resolved value will be an object that indicates that the
 * user did not answer.
 * @param {number} duration
 */
const userRanOutOfTime = (duration = 3e3) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ answered: false });
    }, duration);
  });
};

/**
 * Should return a promise that resolves when a user clicks
 * a button.
 *
 * The promise's resolved value will be an object that
 * indicates that the user answered and what their time was.
 *
 * To avoid adding/removing event listeners for each
 * button, event delegation is used. Hence, the event listener is only
 * attached to the parent/ancestor (and removed upon button click).
 * @param {HTMLElement} el
 */
const userAnsweredTheQuestion = (el) => {
  return new Promise((resolve) => {
    el.addEventListener("click", function choiceHandler(e) {
      if (e.target.tagName === "BUTTON") {
        el.removeEventListener("click", choiceHandler);
        resolve({
          answered: true,
          optionIndex: +e.target.dataset.optionIndex,
        });
      }
    });
  });
};

/**
 * Should return a HTML element which itself contains a button
 * for each option in the question.
 * @param {{options: [...]}} question
 */
const createOptionsFromQuestion = (question) => {
  const container = document.createElement("div");

  question.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.dataset.optionIndex = i;
    button.textContent = option;
    container.appendChild(button);
  });

  return container;
};

/**
 * Small function to introduce a non-blocking delay (where appropriate).
 * @param {number} ms
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Should run the game once.
 */
const runGameOnce = async () => {
  const m = {
    questionNumber: document.querySelector("#question-number"),
    question: document.querySelector("#question"),
    options: document.querySelector("#options-container"),
    score: document.querySelector("#score"),
    $state: {
      score: 0,
    },
  };

  const questions = getTriviaQuestionsForGameSections(defaultGameSections);

  for await (const question of questions) {
    m.options.innerHTML = "";
    m.questionNumber.textContent = `Question #${question.index} for £${question.prize}`;
    m.question.textContent = question.question;
    m.score.textContent = `£${m.$state.score}`;

    const optionsContainer = createOptionsFromQuestion(question);
    m.options.appendChild(optionsContainer);

    const correctOption = m.options.querySelector(
      `button:nth-of-type(${question.correctIndex + 1})`
    );

    // Wait for any of the following to happen (whichever happens first)
    //  • user runs out of time
    //  • user answers the question (irrespective of whether correct or incorrect).
    const outcome = await Promise.any([
      userRanOutOfTime(question.durationInSeconds * 1e3),
      userAnsweredTheQuestion(optionsContainer),
    ]);

    if (outcome.answered) {
      const selectedOption = m.options.querySelector(
        `button:nth-of-type(${outcome.optionIndex + 1})`
      );
      selectedOption.classList.add("option-selected");
      await sleep(1e3);
    }

    // TODO: try to replace the below with CSS3 animations + keyframes
    // or at least put in a for loop/separate function.
    correctOption.classList.add("option-correct");
    await sleep(250);
    correctOption.classList.remove("option-correct");
    await sleep(250);
    correctOption.classList.add("option-correct");
    await sleep(250);
    correctOption.classList.remove("option-correct");
    await sleep(250);
    correctOption.classList.add("option-correct");
    await sleep(500);

    if (outcome.optionIndex === question.correctIndex) {
      m.$state.score += question.prize;
      m.score.textContent = `£${m.$state.score}`;
    }
  }
};

/**
 * Should continue running the game until the player wishes to stop.
 */
const gameLoop = async () => {
  const els = {
    endScreen: document.querySelector("#end-screen"),
    playAgain: document.querySelector("#play-again"),
    neverAgain: document.querySelector("#never-again"),
    dadJoke: document.querySelector("#dad-joke"),
  };

  while (true) {
    await runGameOnce();
    const [{ joke: dadJoke }] = await Promise.all([getDadJoke(), sleep(1e3)]);

    els.dadJoke.textContent = `"${dadJoke}"`;
    els.endScreen.style.display = "";

    const shouldStopPlaying = await new Promise((resolve) => {
      // Event listeners are added in a loop. Seems important to remove existing listeners.
      // Otherwise performance might degrade (as event listeners accumulate) if we choose
      // to continue playing?
      // The "once" option below should automatically remove the event listener after
      // the callback has been invoked once.
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

      els.playAgain.addEventListener("click", () => resolve(false), {
        once: true,
      });
      els.neverAgain.addEventListener("click", () => resolve(true), {
        once: true,
      });
    });

    els.endScreen.style.display = "none";

    if (shouldStopPlaying) {
      break;
    }
  }
};

gameLoop();
