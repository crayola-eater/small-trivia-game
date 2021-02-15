# Purpose
- A timed quiz application that fetches general trivia questions from a third-party API.
- Gameplay-wise, the aim is to maximise your "earnings" by answering as many questions correctly within the time available for each question.

![Trivia quiz application](/meta/game-recording.gif)

(This application is available to play in a browser [here](https://crayola-eater.github.io/small-trivia-game/).)

# How to run
- Install Node.js (if not already installed)
- Clone this repo
- Use something like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to serve the `index.html` file within the repo directory

# Tools used
- HTML
- CSS (no library/framework)
- JS (vanilla)
- Fetch API

# What I learned
- Writing an interactive web application in vanilla JS and managing common tasks such as:
  - Fetching data from a remote server
  - Updating the application's internal state, using the fetched resources
  - Updating the UI to reflect the changes in state.
- Using ES6 modules to separate an application into smaller, single-responsibility parts.
- When displaying (potentially untrusted) third-party text as part of an application, it's important to use `Node.textContent` (or any equivalent) which treats the content as ordinary text (as opposed to HTML) and reduces the risk of XSS.
- Learned about the **Fetch** browser API, which is a modern, promise-oriented alternative to XMLHttpRequest.
- Creating custom asynchronous generators to build a sequence of "trivia questions" on the fly. Said generator object can then be consumed with an `await for-of` loop.
- Promisifying DOM event listeners, which enables us to `await` some user action (e.g. button click) within the context of our application/game loop. This allowed me to write code that was simpler, more readable and easier to reason about.
- Using `Promise.any` to make certain outcomes/triggers mutually exclusive e.g. the user submitting an answer vs. the user running out of time on said question.
- Avoiding (inadvertent) memory leaks by ensuring all event listeners are removed/cleaned up once they're no longer needed.

# Things to add
- Swap the imperative UI update logic out for a more declarative approach like React or Vue (for example).
- Add animations and/or sounds for certain events (e.g. user answers a  question correctly, earnings increase, start of game, end of game, etc.).
- Using tools like SWC or Babel to transpile the JS, allowing the application to run correctly even in older browsers and JS engines.
- Using tools like Autoprefixer to add vendor prefixes within CSS rulesets and ensuring the application displays correctly in more browsers.
- Allow the user to configure aspects of the quiz. For example:
  - Time per question
  - Question difficulty
  - Question subject/topic
  - Number of questions

# Created
- Oct 2020