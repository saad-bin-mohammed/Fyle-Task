// const token = "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";
const token = "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";
let searchForm = document.querySelector("#searchForm");
let header = document.querySelector("header");
let repositories = [];

const numbersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//name,twitter_username,login,location,html_url,company,blog,bio,avatar_url,followers,following (for User-details)
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  let userName = formData.get("username");
  console.log("username", formData.get("username"));
  fetch(`https://api.github.com/users/${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const rateLimitRemaining = response.headers.get("X-RateLimit-Remaining");
      const rateLimitReset = response.headers.get("X-RateLimit-Reset");
      console.log("Remaining requests:", rateLimitRemaining);
      console.log("Reset timestamp:", rateLimitReset);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      renderProfile(data);
    })
    .catch((error) => console.error("Error:", error));
  fetch(`https://api.github.com/users/${userName}/repos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // renderRepos(data);
      repositories = data;
      renderRepos(repositories.slice(0, 10));
    })
    .catch((error) => console.error("Error:", error));
});
const renderProfile = (data) => {
  document.querySelector("#profile")?.remove();
  header.insertAdjacentHTML(
    "afterend",
    `
  <div id="profile">
      <img src=${data.avatar_url} alt="" srcset="">
      <p>${data.name}</p>
      <p>${data.login}</p>
      <p>bio ${data.bio}</p>
      <p>twitter_username ${data.twitter_username}</p>
      <p>location ${data.location}</p>
      <p>html_url ${data.html_url}</p>
      <p>company ${data.company}</p>
      <p>followers ${data.followers}</p>
      <p>following ${data.following}</p>
     
  </div>
    `
  );
};
const renderButtons = () => {
  return numbersArray
    .map(
      (number) =>
        `<button class="page" data-button=${number}  ${
          number + 0 > repositories.length ? "disabled" : ""
        }>${number + 1}</button>`
    )
    .join("");
};
//name,html_url,description,topics[],language,visibility,forks,stargazers_count (for Repos)
const renderRepos = (data) => {
  document.querySelector(".reposContainer")?.remove();
  document.querySelector("#profile").insertAdjacentHTML(
    "afterend",
    `
    <div class="reposContainer">
    <div class="pages">
    ${renderButtons()}
    </div>
    ${data.map(
      (data) =>
        `

  <div class="repo">
        <p>${data.name}</p>
        <p>${data.description}</p>
        <p>language ${data.language}</p>
        <p>topics ${data.topics?.map(
          (topic) => `
        <p>topic ${topic}</p>`
        )}</p>
        <p>visibility ${data.visibility}</p>
        <p>forks ${data.forks}</p>
        <p>stargazers_count ${data.stargazers_count}</p>
  </div>
        `
    )}
    </div>
    `
  );
  addEventListeners();
};
const addEventListeners = () => {
  const buttons = document.querySelectorAll(".page");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      let buttonValue = Number(
        button.dataset.button + (button.dataset.button != "0" ? 0 : "")
      );
      console.log(`Button ${buttonValue} clicked`);
      if (buttonValue < repositories.length) {
        renderRepos(
          repositories.slice(
            buttonValue,
            repositories.length > buttonValue + 10
              ? buttonValue + 10
              : repositories.length
          )
        );
      }
    });
  });
};
