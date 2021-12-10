// IIFE function to avoid accidentally accessing the global state
let pokemonRepository = (function () {

  // empty array of pokemon, obtained from pokemon api
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // returns all values in the pokemon array
  function getAll() {
    return pokemonList;
  }

  //ensures pokemon is an object
  function add(pokemon) {
    if (typeof pokemon === 'object') {
      return pokemonList.push(pokemon);
    } else {
      document.write('not a pokemon')
    };
  }

  // adds a new pokemon
  function addListItem(pokemon) {
  
    // creates <ul>
    let list = document.querySelector('.pokemon-list');
      
    // creates <li>
    let listItem = document.createElement('li');

    // creates <button>
    let button = document.createElement('button');

    // adds class to list item
    listItem.classList.add('list-item', 'group-list-item');
  
    // adds class to button
    button.classList.add('pokemon-button', 'btn', 'btn-primary');

    // adds text to button
    button.innerText = pokemon.name;

    //establishes hierarchy of list elements
    listItem.appendChild(button);
    list.appendChild(listItem);

    // activates showDetails upon clicking button
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }

      // outputs requested details from api for specific pokemon
      function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {  
          showModal(pokemon);
        }) 
      }; 

// add loading functionality

  // obtains data from pokemon api to add names to array
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  };

  // obtains data from pokemon api to add details to array
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.name = details.name;
      item.imgURL = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      // item.types = details.types; add later
      // item.abilities = details.abilities; add later
    }).catch(function (e) {
      console.error(e);
    })
  };

  // MODAL

  let modalContainer = document.querySelector('#modal-container');

  // shows modal only if button is clicked
  function showModal(pokemon) {

    // clears all existing modal content
    modalContainer.innerHTML = '';

    // adds modal
    let modal = document.createElement('div');
    modal.classList.add('modal');

    // closes modal with close button
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    let titleElement = document.createElement('h1');
    titleElement.innerText = `
    Hi, I\'m ${pokemon.name}!
    `
    ;

    let contentElement = document.createElement('p');
    const html = `
    <img src=${pokemon.imgURL}>
    <br>
    <h4>Height: ${pokemon.height} m</h4>
    <h4>Weight: ${pokemon.weight} kg</h4>
    `
    // add types and abilities here later
    contentElement.innerHTML = html;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

    function hideModal() {
      modalContainer.classList.remove('is-visible');
    }

  

  // close modal with esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  // close modal by clicking outside it
  modalContainer.addEventListener('click', (e) => {

    // targets only area OUTSIDE the modal
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  }); 

  // functions that can access the IIFE
  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  };
}) ();

// loop used to list all Pokemon on webpage

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon)
  });
});
// THIRD TRY WITH BOOTSTRAP YAAAYYY
