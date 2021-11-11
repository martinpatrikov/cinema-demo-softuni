import { showView } from "./dom.js";
import { showHome } from "./home.js";


const section = document.getElementById('form-sign-up');

const form = section.querySelector('form');
form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const data = [...formData.entries()].reduce((a, [k,v]) => Object.assign(a, {[k]: v}), {});
    try{
        if(Object.values(data).some(x => x == '')){
            throw new Error('All fields are required');
        }
        if(data.password != data.repeatPassword){
            throw new Error('Repass should match the password!');
        }
        const res = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: data.email, password: data.password})
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
        showHome();
    }catch(err){
        alert(err.message)
    }
});
section.remove();

export function showRegister(){
    showView(section)   
}