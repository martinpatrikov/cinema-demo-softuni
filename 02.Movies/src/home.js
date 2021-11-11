import { showCreate } from "./create.js";
import { showDetails } from "./details.js";
import { e, showView } from "./dom.js";

const section = document.getElementById('home-page');
const catalog = section.querySelector('.card-deck.d-flex.justify-content-center');


section.querySelector('#createLink').addEventListener('click', (ev) => {
    ev.preventDefault();
    showCreate();
})

catalog.addEventListener('click', (ev) => {
    ev.preventDefault();
    let target = ev.target;
    if(target.tagName == 'BUTTON'){
        target = target.parentNode;
    }
    if(target.tagName == 'A'){
        const id = target.dataset.id;
        showDetails(id);
    }
})

section.remove();

export function showHome(){
    showView(section);
    getMovies();
}

async function getMovies(){
    catalog.replaceChildren(e('p', {}, 'Loading...'))
    
    try{
        const res = await fetch('http://localhost:3030/data/movies');
        if(res.ok != true){
            const err = await res.json();
            throw new Error(err.message)
        }
        const data = await res.json();
        catalog.replaceChildren(...data.map(createMovieCard));
    }catch(error){
        throw new Error(error.message)
    }    
}

function createMovieCard(movie){
    
    const el = e('div', { className: 'card mb-4'});
    el.innerHTML = `<img class="card-img-top" src="${movie.img}" alt="Card image cap" width="400">
<div class="card-body">
<h4 class="card-title">${movie.title}</h4>
</div>
<div class="card-footer">
<a data-id=${movie._id} href="#/details/krPgQD6SWf39bM4x00co">
<button type="button" class="btn btn-info">Details</button>
</a>
</div>`

    return el;
}


window.getMovies = getMovies;