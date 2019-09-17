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
                id: Date.now(),
                type:'note',
            },
            cardCreatedHandler
        )

    });
}
if(document.querySelector('#edit-popup form')) {
    document.querySelector('#edit-popup form').addEventListener('submit', function(e) {
        e.preventDefault();
        let data = collectFormData(this);
        console.log(data);
        customFetch(`/api/notes/${data.id}`,
            'PUT',
            {
                ...data,
                type: 'note'
            }
        );
        hidePopup();
        document.querySelector('.card.card-details').style.backgroundColor = data.color;
        document.querySelector('.card-title').innerText = data.title;
        document.querySelector('.card-text').innerText = data.text;
        checkColor();
});
}
if(document.getElementById('single-note-page')) {
    checkColor();
    document.querySelector('[data-edit]').addEventListener('click', (e) => {
        editBtnHandler(e.target.closest('[data-edit]').dataset.edit)
    });

    document.querySelector('[data-delete]').addEventListener('click', (e) => {
        customFetch(
            `/api/notes/${+e.target.closest('[data-delete]').dataset.delete}`,
            'DELETE'
        );
        window.location = '/';
    })

}
function checkColor() {
    let cardDetails = document.querySelector('.card.card-details');
    if(cardDetails.style.backgroundColor===null||cardDetails.style.backgroundColor==='transparent' ){
        cardDetails.style.border = '1px solid #e5e5e5'
    }else{
        cardDetails.style.border = 'none'
    }

}
function editBtnHandler(id) {
    const popup = document.getElementById('edit-popup');
    const card = document.querySelector(`[data-id="${id}"]`);
    console.log('card',card);
    console.log('card.style.backgroundColor',card.style.backgroundColor);

    popup.querySelector('[name="title"]').value = card.querySelector('h5').innerText;
    popup.querySelector('[name="text"]').value = card.querySelector('p').innerText;
    popup.querySelector('[name="id"]').value = id;
    popup.querySelector('[name="color"]').value = card.style.backgroundColor;
    showPopup();
}
document.querySelector('#edit-popup').addEventListener('click', (e)=> {
        if(e.target.classList.contains('popup')) {
            hidePopup()
        }
    });

function showPopup() {
    const popup = document.getElementById('edit-popup');
    popup.style.display = 'block';
}
function hidePopup() {
    const popup = document.getElementById('edit-popup');
    popup.style.display = 'none';
}
async function customFetch(endpoint,method, body) {
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
        console.log(body);
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
