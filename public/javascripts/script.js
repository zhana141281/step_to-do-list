const createNewInput = document.querySelector('.create-new-input');
if (createNewInput) {
    createNewInput.addEventListener('click', function () {
        let createdInput = document.createElement('div');
        let inner = `<div class="form-group">
                    <label>Новая заметка: </label>
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
        }
    });
}

if (document.querySelector('#create-list')) {
    document.querySelector('#create-list').addEventListener('submit', function (e) {
            e.preventDefault();
            taskCounter = 0;
            let data = collectFormData(this);

            customFetch('/api/lists',
                'POST',
                {
                    ...data,
                    id: Date.now(),
                    type: 'list'
                },
                window.location = '/'
            ).then(r => console.log(data));
        });
}
let taskCounter = 0;

function collectFormData(element){
    let itemArray = [];
    element.querySelectorAll('input[name^=task]').forEach(field=>{
        let itemData = {
            checkedStatus: false,
            dataCount: taskCounter++
        };
        itemData[field.name] = field.value;
        itemArray.push(itemData);
    });
    let data = {
        title: document.querySelector('input[name=title]').value,
        lists: itemArray,
        id: document.querySelector('[name=id]').value
    };
    return data;
}

function collectEditedData(element){
    let editedArray = [];
    element.querySelectorAll('input[name^=task]').forEach(field=>{
        let itemData = {
            checkedStatus: false,
            dataCount: taskCounter++
        };
        if (field.classList.contains('checked')){
            itemData.checkedStatus = true;
        }
        itemData[field.name] = field.value;
        fillingArray(editedArray,itemData);
    });
    let editedData = {
        title: document.querySelector('input[name=title]').value,
        lists: editedArray,
        id: document.querySelector('[name=id]').value
    };
    return editedData;
}

function fillingArray(arr,el){
    if (el.checkedStatus){
        arr.push(el)
    } else {
        arr.unshift(el)
    }
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
        callback
        // window.location = `/`
    } else {
        alert('Something goes wrong! =(')
    }
}
function addButtonsListener (editElement, deleteElement) {
    editElement.addEventListener('click', (e) => {
        editBtnHandler(e.target.dataset.edit)
        console.log(e.target.dataset.edit)
    });
    deleteElement.addEventListener('click', (e) => {
        customFetch(
            `/api/lists/${+e.target.dataset.delete}`,
            'DELETE'
        );
        window.location = '/'
    })
}

const editButton = document.querySelector('[data-edit]');
const deleteButton = document.querySelector('[data-delete]');
console.log(deleteButton);

if(document.getElementById('single-list-block') || document.getElementById('edit-block')) {
    addButtonsListener(editButton,deleteButton)
}


function editBtnHandler(id){
        let changeBlock = document.querySelector('#edit-block');
        console.log(changeBlock);
        let singleLIstBlock = document.querySelector('#single-list-block');
        changeBlock.style.display = 'block';
        singleLIstBlock.style.display = 'none';
        changeBlock.querySelector('[name="id"]').value = id;

        let inputList = document.querySelectorAll('.input');
        let taskCounterInput = inputList[inputList.length-1].dataset.count;


        document.querySelector('#edit-form').addEventListener('click',function (e) {
                if (e.target.classList.contains('delete-input')) {
                    e.target.closest('.row').remove();
                    console.log(e.target.closest('.row'));
                } else if (e.target.classList.contains('check-input')){
                   e.target.previousElementSibling.classList.toggle('checked');
                   console.log(e.target.previousElementSibling)
                } else if (e.target.classList.contains('new-input-for-edit')){
                    e.preventDefault();
                    let createdInput = document.createElement('div');
                    let inner = `<div class="form-group">
                    <div class="row">
                    <input class="form-control form-control-sm col-9 ml15 input" type="text" name="task" data-count="${taskCounterInput++}" required>
                    <button type="button" class="btn btn-outline-success col-1 check-input">V</button>
                    <button type="button" class="btn btn-outline-secondary col-1 delete-input">-</button>
                    </div>
                </div>`;
                    createdInput.innerHTML = inner;
                    let afterInputElement = document.querySelector('.after-input');
                    afterInputElement.before(createdInput);
                }
            });



        document.querySelector('#edit-list').addEventListener('submit',function (e) {
            e.preventDefault();
                    let data = collectEditedData(changeBlock);

                    console.log(data);

                    customFetch(`/api/lists/${data.id}`,
                        'PUT',
                        {
                            ...data,
                            type: 'list',
                        },
                        // window.location = `/lists/${data.id}`
                    );
            changeBlock.style.display = 'none';
            singleLIstBlock.style.display = 'block';
            singleLIstBlock.innerHTML = ` <div class="mt-3"></div>
        <a href="/" class="btn btn-outline-info mt-3 offset-md-3">
            <svg fill='#17a2b8' baseProfile="tiny" height="24px" id="Layer_1" version="1.2" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M12,9.059V6.5c0-0.256-0.098-0.512-0.293-0.708C11.512,5.597,11.256,5.5,11,5.5s-0.512,0.097-0.707,0.292L4,12l6.293,6.207  C10.488,18.402,10.744,18.5,11,18.5s0.512-0.098,0.707-0.293S12,17.755,12,17.5v-2.489c2.75,0.068,5.755,0.566,8,3.989v-1  C20,13.367,16.5,9.557,12,9.059z"/></svg>
        </a>
        <div class="col-md-4 offset-md-4 mt-5">
            <div class="list">
                <div class="list-body">
                    <h5 class="list-title mb-4 text-center">${data.title}</h5>
                        <div class="row list-container"></div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-outline-danger delete-button mt-3" data-delete="${data.id}">Удалить</button>
                    </div>
                </div>
            </div>
        </div>`;
            let listContainer = document.querySelector('.list-container');
            data.lists.forEach((el)=>{
                let listLine = document.createElement('p');
                listLine.className ='list-text col-11';
                listLine.innerText = el.task;
                if (el.checkedStatus){
                    listLine.classList.add('checked');
                    listContainer.append(listLine)
                } else {
                    listContainer.prepend(listLine);
                }
            });
            const newEditedButton = singleLIstBlock.querySelector('.edit-button');
            const newDeleteButton = singleLIstBlock.querySelector('.delete-button');

            addButtonsListener(newEditedButton, newDeleteButton);
        })
    }


// function checkButtonHandler (counter){
//     let input = document.querySelector(`input[data-count="${counter}"]`);
//     input.classList.add('input-checked');
// console.log(input)
// }
