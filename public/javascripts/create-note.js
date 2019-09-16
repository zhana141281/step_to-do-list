const colorPicker = document.querySelector('#color-picker');
const colorMenu = document.querySelector('#color-menu');
const noteBgInput = document.querySelector('.note-bg-color');
const colors = document.querySelectorAll('.color');


colorPicker.addEventListener('click', (e)=>{
    if(!colorMenu.classList.contains('active-menu')){
        colorMenu.classList.add('active-menu');
    }else{
        colorMenu.classList.remove('active-menu');
    }
});
document.body.addEventListener('click', (e)=>{
    if(!e.target.classList.contains('color-menu') && !e.target.classList.contains('color-picker')){
        colorMenu.classList.remove('active-menu');
    }
});
colors.forEach((el)=>{
    el.addEventListener('click',(e)=>{
        let bgColor = el.dataset.color;
        noteBgInput.dataset.color = bgColor;
        noteBgInput.value = bgColor;
        const pickedColor = document.querySelector('.picked-color');
        pickedColor.style.backgroundColor = bgColor;
    })
});
if(document.querySelector('#create-form')){
    document.querySelector('#create-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let data = collectFormData(this);
        customFetch('/api/notes',
            'POST',
            {
                ...data,
                id: Date.now()
            },
            cardCreatedHandler
        )

    });
}
async function customFetch(endpoint,method, body, callback) {
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await response.json();
    const answer = JSON.parse(json);
    console.log('answer',answer);
    if(answer.status){
        callback(body)
    }else{
        alert('Sorry, something went wrong... :(')
    }

}
function collectFormData(el) {
    let data = {};
    el.querySelectorAll('input, textarea').forEach(field=>{
        data[field.name] = field.value;
    });
    return data;
}
function cardCreatedHandler() {
    window.location = '/';
}