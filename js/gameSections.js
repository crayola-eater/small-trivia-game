/**
 * Should return an object which returns a "game section", which will dictate how
 * the game progresses. Questions will (later/somewhere else) be fetched according
 * to these sections.
 * @param {{difficulty: string, durationInSeconds: number, prizes: number[]}} options
 */
const createGameSection = ({ difficulty, durationInSeconds, prizes }) => {
  return Object.freeze({
    difficulty,
    durationInSeconds,
    length: prizes.length,
    prizes: prizes.map((prize) =>
      Object.freeze({
        prize,
        difficulty,
        durationInSeconds,
      })
    ),
  });
};

/**
 * Should return an "easy" game section
 * (easy questions and lower prizes).
 */
const easy = createGameSection({
  difficulty: "easy",
  durationInSeconds: 3,
  prizes: [100, 150, 200, 250, 300],
});

/**
 * Should return a "medium" game section
 * (medium questions and medium prizes).
 */
const medium = createGameSection({
  difficulty: "medium",
  durationInSeconds: 4,
  prizes: [500, 550, 600, 650, 700],
});

/**
 * Should return a "hard" game section
 * (hard questions and large prizes).
 */
const hard = createGameSection({
  difficulty: "hard",
  durationInSeconds: 5,
  prizes: [1000, 1100, 1200, 1300, 1400],
});

/**
 * Should export an array of game sections.
 */
export default Object.freeze([easy, medium, hard]);
