let addToy = false;
let URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const newToyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch(`${URL}/toys`)
  .then(resp => resp.json())
  .then(data => {
    data.forEach(addCard);
    updateLikes();
  })

  newToyForm.addEventListener('submit', event => {
    event.preventDefault();

    fetch(`${URL}/toys`, {
      method: "POST", 
      headers: 
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": event.target.name.value,
        "image": event.target.image.value,
        "likes": 0
      })
    })
    .then(resp => resp.json())
    .then(addCard);
  });

  

  function addCard(data) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = data.id;
    card.innerHTML = `
      <h2>${data.name}</h2>
      <img src=${data.image} class="toy-avatar" />
      <p>${data.likes} Likes </p>
      <button class="like-btn">Like <3</button>
    `
    toyCollection.appendChild(card);
  }

  function updateLikes() {
    document.querySelectorAll('.like-btn').forEach(button => {
      button.addEventListener('click', event => {
        const id = event.target.parentNode.dataset.id;
        const newLikes = parseInt(event.target.parentNode.querySelector('p').textContent) + 1;

        fetch(`${URL}/toys/${id}`, {
          method: "PATCH",
          headers: 
          {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "likes": newLikes
          })
        })
        .then(res => res.json())
        .then(data => {
          event.target.previousElementSibling.textContent = `${newLikes} Likes`;
        })  
      })
    })

  }
});