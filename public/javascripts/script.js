const createNewInput = document.querySelector('.create-new-input');
if (createNewInput) {
    createNewInput.addEventListener('click', function () {
        let createdInput = document.createElement('div');
        let inner = `<div class="form-group">
                    <label>Дело:</label>
                    <div class="row">
                    <input class="form-control form-control-sm col-10 ml15 input" type="text" name="task" required>
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
            taskCounter = 0;
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
let taskCounter = 0;

function collectFormData(element){
    let itemArray = [];
    element.querySelectorAll('input[name^=task]').forEach(field=>{
        let itemData = {
            checkedStatus: false,
            dataCount: taskCounter++,
        };
        itemData[field.name] = field.value;
        itemArray.push(itemData);
        console.log(itemData);
    });
    let data = {
        title: document.querySelector('input[name=title]').value,
        lists: itemArray,
        id: document.querySelector('[name=id]').value
    };
    console.log(data);
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
        console.log(body)
        // window.location = '/';
    } else {
        alert('Something goes wrong! =(')
    }
}

function listCreatedHandler () {
    window.location = '/'
}


if(document.getElementById('single-list-block')) {

    document.querySelector('[data-edit]').addEventListener('click', (e) => {
        editBtnHandler(e.target.dataset.edit)
        console.log(e.target.dataset.edit);
        console.log(e.target);
    });

    document.querySelector('[data-delete]').addEventListener('click', (e) => {
        customFetch(
            `/api/lists/${+e.target.dataset.delete}`,
            'DELETE'
        );
        window.location = '/'
    })

}


function editBtnHandler(id){
        let changeBlock = document.querySelector('#edit-block');
        console.log(changeBlock);
        let singleLIstBlock = document.querySelector('.list');
        changeBlock.style.display = 'block';
        singleLIstBlock.style.display = 'none';
        let inputList = document.querySelectorAll('.input');
        let taskCounterOfNewInput = inputList[inputList.length-1].dataset.count;
        changeBlock.querySelector('[name="id"]').value = id;
        console.log(id);


        document.querySelector('#edit-form').addEventListener('click',function (e) {
                if (e.target.classList.contains('delete-input')) {
                    e.target.closest('.row').remove();
                    console.log(e.target.closest('.row'));
                } else if (e.target.classList.contains('new-input-for-edit')){
                    e.preventDefault();
                    let createdInput = document.createElement('div');
                    let inner = `<div class="form-group">
                    <div class="row">
                    <input class="form-control form-control-sm col-10 ml15 input" type="text" name="task" data-count="${taskCounterOfNewInput++}" required>
                    <button type="button" class="btn btn-light col-1 delete-input">-</button>
                    </div>
                </div>`;
                    createdInput.innerHTML = inner;
                    let afterInputElement = document.querySelector('.after-input');
                    afterInputElement.before(createdInput);
                }
            });

        document.querySelector('.change-btn').addEventListener('submit',function (e) {
            e.preventDefault();
                    let container = document.getElementById('single-list-block');
                    let data = collectFormData(container);
                    console.log(data);
                    customFetch(`/api/lists/${data.id}`,
                        'PUT',
                        {
                            ...data,
                            type: 'list'
                        },
                        console.log("Успешный запрос" + data)
                    );
        })
    }


