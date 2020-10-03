// Should export an array of objects, where each object represents a "section" of the game
// which will dictate how the game progresses.
// Questions will (later/somewhere else) be fetched according to these sections.

const createGameSection = ({ difficulty, durationInSeconds, prizes }) => {
  return Object.freeze({
    difficulty,
    durationInSeconds,
    length: prizes.length,
    prizes: prizes.map((prize) =>
      Object.freeze({
        prize,
        difficulty: "easy",
        durationInSeconds,
      })
    ),
  });
};

const easy = createGameSection({
  difficulty: "easy",
  durationInSeconds: 3,
  prizes: [100, 150, 200, 250, 300],
});

const medium = createGameSection({
  difficulty: "medium",
  durationInSeconds: 4,
  prizes: [500, 550, 600, 650, 700],
});

const hard = createGameSection({
  difficulty: "hard",
  durationInSeconds: 5,
  prizes: [1000, 1100, 1200, 1300, 1400],
});

export default Object.freeze([easy, medium, hard]);
