const token = "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";
let searchForm = document.querySelector("#searchForm");
let header = document.querySelector("header");
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
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderProfile(data);
      //   name,twitter_username,login,location,html_url,company,blog,bio,avatar_url,followers,following (for Use-details)
      //   name,html_url,description,topics[],language,visibility,forks,stargazers_count (for Repos)
    })
    .catch((error) => console.error("Error:", error));
});
const renderProfile = (data) => {
  document.querySelector("#profileInfo")?.remove();
  header.insertAdjacentHTML(
    "afterend",
    `
  <div id="profileInfo">
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
