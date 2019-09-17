const createNewInputButton = document.querySelector('.create-new-input');
if (createNewInputButton) {
    createNewInputButton.addEventListener('click', function () {
        let createdInput = document.createElement('div');
        let inner = `<div class="form-group">
                    <label>Дело:</label>
                    <div class="row">
                    <input class="form-control form-control-sm col-10 ml15" type="text" required>
                    <button type="button" class="btn btn-light col-1 delete-input">-</button>
                    </div>
                </div>`;
        createdInput.innerHTML = inner;
        let afterInputElement = document.querySelector('.after-input');
        afterInputElement.before(createdInput);
    });
}

const createdListForm = document.getElementById('create-list');
if(createdListForm) {
    createdListForm.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-input')) {
            e.target.closest('.form-group').remove();
            console.log(e.target.closest('.form-group'));
        }
    });
}

if (document.querySelector('#create-list')) {
    document.querySelector('#create-list').addEventListener('submit', function (e) {
            e.preventDefault();
            console.log(e.target);
            let data = collectFormData(this);
            customFetch('/api/lists',
                'POST',
                {
                    ...data,
                    id: Date.now(),
                    type: 'list'
                },
                listCreatedHandler
            ).then(r => console.log(data));
        });
}

function collectFormData(element){
    let data = {};
    element.querySelectorAll('input').forEach(field=>{
        data[field.name] = field.value
    });
    return data;
}

async function customFetch(endpoint, method, body, callback) {
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const json = await response.json();
    const answer = JSON.parse(json);

    // console.log(answer, body);

    if(answer.status) {
        window.location = '/';
    } else {
        alert('Something goes wrong! =(')
    }
}

function listCreatedHandler () {
    window.location = '/'
}




