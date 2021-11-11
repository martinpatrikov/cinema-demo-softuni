import { showHome } from "./home.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";
import { showDetails } from "./details.js";
import { e } from "./dom.js";

const views = {
    homeLink: showHome,
    loginLink: showLogin,
    registerLink: showRegister
}

updateNav();

document.getElementById('logoutBtn').addEventListener('click', logout);
document.querySelector('nav').addEventListener('click', navClick);

showHome();

window.showDetails = showDetails;

export function updateNav(){
    const parsed = JSON.parse(sessionStorage.getItem('userData'));
    if (parsed !== null) {
        document.querySelector('#welcomeMsg').textContent = `Welcome, ${parsed.email}`;
        [...document.querySelectorAll('.user')].map(a => a.style.display = 'block');
        [...document.querySelectorAll('.guest')].map(a => a.style.display = 'none');
    } else {
        [...document.querySelectorAll('.guest')].map(a => a.style.display = 'block');
        [...document.querySelectorAll('.user')].map(a => a.style.display = 'none');
    }    
}

function navClick(ev) {
    const view = views[ev.target.id];
    if (typeof view == 'function') {
        ev.preventDefault();
        view();
    }
}

async function logout(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();

    const parsed = JSON.parse(sessionStorage.getItem('userData'));
    try{
        const res = await fetch('http://localhost:3030/users/logout', {
            method: 'get',
            headers: {
                'X-Authorization': parsed.token  
            }
        });

        if(res.ok != true){
            const err = await res.json();
            console.log(err)
            throw new Error(err.code + " " + err.message)
        }
        
        sessionStorage.removeItem('userData');
        updateNav();
        showLogin();
    }catch(error){
        alert(error.message)
    }
}