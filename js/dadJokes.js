// Function(s) for interacting with dad jokes API.

export default async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });
  return await response.json();
};
