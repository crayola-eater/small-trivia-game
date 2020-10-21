/**
 * @file Functions for interacting with Trivia DB API.
 */

/**
 * Should return an object that contains an array of options
 * and the array index at which the correct option is.
 * @param {string} correctAnswer
 * @param {string[]} incorrectAnswers
 */
const createOptions = (correctAnswer, incorrectAnswers) => {
  const options = incorrectAnswers
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);

  const randomInsertionIndex = Math.round(Math.random() * options.length);
  options.splice(randomInsertionIndex, 0, correctAnswer);

  return {
    correctIndex: randomInsertionIndex,
    options,
  };
};

/**
 * Should return a promise that resolves to an array of
 * objects, where each object represents a question
 * (and its corresponding options).
 * @param {string} token
 * @param {string} difficulty
 * @param {number} amount
 */
const getTriviaQuestions = async (token, difficulty, amount) => {
  // Should return an array of objects
  // wherein each object represents a "question".
  if (!token) {
    throw new Error(`Invalid token = ${token}`);
  } else if (
    "number" !== typeof amount ||
    !(amount >= 1 && amount <= 50 && amount % 1 === 0)
  ) {
    throw new Error(`Invalid amount = ${amount}`);
  } else if (!/^(easy|medium|hard)$/.test(difficulty)) {
    throw new Error(`Invalid difficulty = ${difficulty}`);
  }

  const response = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&encode=url3986`
  );
  const data = await response.json();

  return data.results.map((result) => {
    return {
      category: decodeURIComponent(result.category),
      difficulty: decodeURIComponent(result.difficulty),
      question: decodeURIComponent(result.question),
      ...createOptions(
        decodeURIComponent(result.correct_answer),
        result.incorrect_answers.map(decodeURIComponent)
      ),
    };
  });
};

/**
 * Should return a promise that resolves to a string (representing
 * the API token).
 *
 * This function is not pure. It will attempt to persist/cache
 * the token to session storage (to minimise).
 */
const getTriviaApiToken = async () => {
  const SESSION_STORAGE_KEY = "triviaDbApiToken";

  const sessionStorageAvailable =
    window.sessionStorage &&
    "function" === typeof window.sessionStorage.getItem;

  if (sessionStorageAvailable) {
    const token = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (token && 64 === token.length) {
      return token;
    }
  }

  const response = await fetch(
    "https://opentdb.com/api_token.php?command=request"
  );
  const parsed = await response.json();

  if (sessionStorageAvailable) {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, parsed.token);
  }

  return parsed.token;
};

/**
 * Should return an asynchronous generator that generates a
 * sequence of questions that the call site can iterate over easily.
 * @param {object[]} gameSections
 */
const getTriviaQuestionsForGameSections = async function* (gameSections) {
  const apiToken = await getTriviaApiToken();
  let questionIndex = 0;

  // TODO: There is a (noticeable) delay between each section (as each section requires its own fetch request).
  // This can be fixed by requesting the next section before the current section has ended.
  // See and try: https://stackoverflow.com/a/41079925

  for (const section of gameSections) {
    const questions = await getTriviaQuestions(
      apiToken,
      section.difficulty,
      section.length
    );

    yield* questions.map((question, i) =>
      Object.assign(
        {
          index: ++questionIndex,
        },
        section.prizes[i],
        question
      )
    );
  }
};

export default getTriviaQuestionsForGameSections;
