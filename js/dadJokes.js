/**
 * @file Functions for interacting with dad jokes API.
 *
 */

/**
 * Should return a joke from the Dad Jokes API.
 */
export default async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });
  return await response.json();
};
