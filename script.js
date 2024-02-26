const apiUrl = {
  memeAPI: "https://meme-api.com/gimme/wholesomememes",
  quoteAPI: "https://api.quotable.io/random",
  jokeAPI:
    "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single",
  riddleAPI: "https://riddles-api.vercel.app/random",
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to fetch data from ${url} `);
    }
    const data = await response.json();
    hideLoader();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function meme() {
  const meme = document.querySelector("#meme-btn");
  fetchData(apiUrl.memeAPI).then((data) => {
    const memeImages = createImage("img", "src", "id", "memeImg", data.url);
    memeImages.classList.add("meme-image");
    clearAll();
    meme.appendChild(memeImages);
  });
}

function quote() {
  const quotes = document.querySelector("#quote-btn");
  fetchData(apiUrl.quoteAPI).then((data) => {
    const quotesText = createElement("p", "id", "quoteContent", data.content);
    const authorText = createElement(
      "p",
      "id",
      "quoteAuthor",
      `- ${data.author}`
    );
    addStyle(authorText);
    clearAll();
    quotes.appendChild(quotesText);
    quotes.appendChild(authorText);
  });
}

function joke() {
  const joke = document.querySelector("#joke-btn");
  fetchData(apiUrl.jokeAPI).then((data) => {
    const jokeText = createElement("p", "id", "jokeText", data.joke);
    clearAll();
    joke.appendChild(jokeText);
  });
}

function riddle() {
  const riddle = document.querySelector("#riddle-btn");

  fetchData(apiUrl.riddleAPI).then((data) => {
    const questionText = createElement("p", "id", "question", data.riddle);
    const answerText = createElement("p", "id", "answer", data.answer);
    addStyle(answerText);
    clearAll();
    answerText.hidden = true;
    riddle.appendChild(questionText);
    riddle.appendChild(answerText);
  });
}

function reveal() {
  const question = document.querySelector("#question");
  const answer = document.querySelector("#answer");

  const riddleModal = {
    titleA: "Uh-oh! Riddle's Out",
    titleB: "Missing Riddle",
    textA: "The riddle's secret is out – the answer has been revealed.",
    textB: "No riddle to solve here, the mystery is missing in action.",
    img: "img/riddle-error.png",
  };

  if (question && answer.hidden) {
    answer.hidden = false;
  } else if (question && answer) {
    showModal(riddleModal.titleA, riddleModal.textA, riddleModal.img);
  } else {
    showModal(riddleModal.titleB, riddleModal.textB, riddleModal.img);
  }
}

function toTweet() {
  const memeImg = document.getElementById("memeImg");
  const jokeText = document.getElementById("jokeText");
  const quoteText = document.getElementById("quoteContent");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const riddleText = document.querySelector("#question");
  let tweet = "";

  if (memeImg) {
    tweet = memeImg.src;
  } else if (jokeText) {
    tweet = jokeText.textContent;
  } else if (quoteText && quoteAuthor) {
    tweet = `${quoteText.textContent}\n ${quoteAuthor.textContent}`;
  } else if (riddleText) {
    tweet = riddleText.textContent;
  } else {
    const twitterModal = {
      title: "Content Unavailable",
      text: "Unable to post tweet. Please select content to be included in your tweet before proceeding.",
      img: "img/errorTwitter.png",
    };
    showModal(twitterModal.title, twitterModal.text, twitterModal.img);
    return;
  }

  const encodedImg = memeImg ? encodeURIComponent(tweet) : "";
  const encodedText = memeImg
    ? "Check out this meme \n"
    : encodeURIComponent(tweet);
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedImg}`;
  window.open(twitterShareUrl, "_blank");
}

//Helper Function
function hideLoader() {
  const loader = document.querySelector(".loader");
  loader.classList.add("hidden");
}

function showModal(title, text, img) {
  const modalTitle = document.querySelector(".modal-title");
  const modalText = document.querySelector(".modal-text");
  const modalImg = document.querySelector(".modal-img");
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalImg.setAttribute("src", img);

  const modal = document.querySelector(".main-modal");
  modal.classList.toggle("hidden");
}

function clearScreen() {
  const loader = document.querySelector(".loader");
  loader.classList.remove("hidden");
  clearAll();
}

function clearAll() {
  const contents = ["#meme-btn", "#joke-btn", "#quote-btn", "#riddle-btn"];
  contents.forEach((content) => {
    const selected = document.querySelector(content);
    selected.innerHTML = "";
  });
}

function addStyle(element) {
  element.style.fontStyle = "italic";
  element.style.fontWeight = "bold";
  element.style.color = "#c04b3b";
}

function createElement(tag, attribute, name, value) {
  const element = document.createElement(tag);
  element.setAttribute(attribute, name);
  element.textContent = value;
  return element;
}

function createImage(tag, mainAttr, attribute, name, value) {
  const image = document.createElement(tag);
  image.setAttribute(attribute, name);
  image.setAttribute(mainAttr, value);
  return image;
}
