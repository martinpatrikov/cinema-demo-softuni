import { showView } from "./dom.js";
import { showHome } from "./home.js";


const section = document.getElementById('add-movie');

const form = section.querySelector('form');
form.addEventListener('submit', async (ev) => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    ev.preventDefault();
    const formData = new FormData(form);
    const data = [...formData.entries()].reduce((a, [k,v]) => Object.assign(a, {[k]: v}), {});
    try{
        if(Object.values(data).some(x => x == '')){
            throw new Error('All fields are required')
        }
        const res = await fetch('http://localhost:3030/data/movies', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify(data)
        });
        if(res.ok != true){
            const err = await res.json();
            throw new Error(err.message)
        }
        const dataRes = await res.json();

        ev.target.reset();
        showHome();
    }catch(err){
        alert(err.message)
    }
});

section.remove();


export function showCreate(){
    showView(section)   
}