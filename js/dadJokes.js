/**
 * @file Functions(s) for interacting with dad jokes API.
 *
 */

/**
 * Should return a joke from the Dad Jokes API.
 */
export const getDadJoke = async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });
  return await response.json();
};
