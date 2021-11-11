import { updateNav } from "./app.js";
import { showView } from "./dom.js";
import { showHome } from "./home.js";

const section = document.getElementById('form-login');

const form = section.querySelector('form');
form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const data = [...formData.entries()].reduce((a, [k,v]) => Object.assign(a, {[k]: v}), {});
    try{
        if(Object.values(data).some(x => x == '')){
            throw new Error('All fields are required')
        }
        const res = await fetch('http://localhost:3030/users/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(res.ok != true){
            const err = await res.json();
            throw new Error(err.message)
        }

        const dataRes = await res.json();
        const userData = {
            email: dataRes.email,
            id: dataRes._id,
            token: dataRes.accessToken
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        ev.target.reset();
        updateNav();
        showHome();
    }catch(err){
        alert(err.message)
    }
});

section.remove();

export function showLogin(){
    showView(section)   
}