let Conf = {
    dataFormRequired: [
        'album_name',
        'album_author',
        'album_year',
        'album_duration',
        'purchase_date',
        'price',
        'number_rum',
        'number_rack',
        'number_shelf',
        'file'
    ],

    messageRequired: 'Пожалуйста, заполните это поле',
    messageLoad: 'Идет загрузка...',
    messageConfirm: 'Вы действительно хотите удалить альбом',
    messageError: 'Ошибка:',
    messageGetList: 'Записей не найдено',
    titleEdit: 'Редактировать альбом',
    titleAdd: 'Добавить новый альбом',

    dataList: [],
    filters: {}

}

document.addEventListener('DOMContentLoaded', () => {
    getdataList();
})

document.querySelector('#select_author').addEventListener('change', function(){
    Conf.filters.author = this.value;
    getdataList();
});
document.querySelector('#year_sort').addEventListener('change', function(){
    Conf.filters.year = this.value;
    getdataList();
});

function getAuthors() {
    if ( Conf.dataList.length === 0 ) return;
    let select = document.querySelector('#select_author');
    select.innerHTML = `
    <option disabled selected>По автору</option>
    <option value="">Все</option>
    `;

    let authors = Conf.dataList.map( row => row.album_author );
    let unique = [...new Set(authors)]; 
    unique.forEach( name => {
        select.innerHTML += `<option value="${name}">${name}</option>`;
    } )

}

function showAlbum(id) {
let album_desc = document.querySelector('#album_desc');
let rowArr;
    Conf.dataList.forEach( item => {
        if (item.id == id ) rowArr = item;
    });
album_desc.innerHTML = `
    <div class='animat-section'>
        <img src="img/${rowArr.file}" alt="${rowArr.album_name}"/>
        <ul>
            <li><strong>Название альбома:</strong> ${rowArr.album_name}</li>
            <li><strong>Название артиста: </strong>${rowArr.album_author}</li>
            <li><strong>Год выпуска:</strong> ${rowArr.album_year}</li>
            <li><strong>Длительность альбома:</strong> ${rowArr.album_duration} минут</li>
            <li><strong>Дата покупки:</strong> ${rowArr.purchase_date}</li>
            <li><strong>Стоимость покупки:</strong> ${rowArr.price}</li>
            <li><strong>Код хранилища:</strong> ${rowArr.number_rum}:${rowArr.number_rack}:${rowArr.number_shelf}</li>
        <ul>
    </div>
`;
}

document.getElementById('exampleModal').addEventListener('hidden.bs.modal', function () {
    document.querySelector('#exampleModal form').id = "add_new";
    document.querySelector('#type_f').value = 'add';
    let nameId = document.querySelector('input[name="id"]');
    if (nameId) nameId.remove();
    document.querySelector('#add_new').classList.remove('hidden');
    document.querySelector('.message-block').innerHTML = '';
    document.querySelector('#exampleModalLabel').textContent = Conf.titleAdd;
    document.querySelector('#exampleModal form').reset();
})

document.querySelector('#exampleModal form').addEventListener('submit', sendForm);


async function sendForm(e) {
        e.preventDefault();
        let frm = document.querySelector('#exampleModal form');
        let inpts = document.querySelectorAll('.empty_field');
        inpts.forEach( inpt => inpt.remove());
        for(let item=0; item < Conf.dataFormRequired.length; item++) {
            // обложка не обязательно к заполнению
            if (Conf.dataFormRequired[item] === 'file') continue;
            const element = document.querySelector("input[name='"+Conf.dataFormRequired[item]+"']");
            if (element.value.length == 0) {
                let small = document.createElement('small');
                small.classList.add('empty_field');
                small.textContent = Conf.messageRequired;
                element.parentNode.appendChild(small);
                return false;
            }
        }
        let data = new FormData(frm);
        let response = await fetch('./php/add.php', {
          method: 'POST',
          body: data
        });
        let result = await response.text();
        frm.classList.add('hidden');
        document.querySelector('.message-block').innerHTML = result;
        getdataList();
       
}

function getdataList() {
let container = document.querySelector("#collections");
// container.textContent = Conf.messageLoad;
let author = Conf.filters.author;
let year_sort = Conf.filters.year;
const data = JSON.stringify({author, year_sort});
fetch('./php/getList.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      }, 
    body: data
})
      .then( data => data.json() )
      .then( result => {
        Conf.dataList = result;
        //console.log(Conf.dataList);
        container.innerHTML = getList();
        if (!author)
            getAuthors();
      } )
      .catch( error => {
          console.log(error)
      } )
}

function getList(arr) {
    if ( Conf.dataList.length === 0 )
        return Conf.messageGetList;
    let dataArr = [];
    if (arr) 
        dataArr = arr;
    else dataArr = Conf.dataList;
    document.querySelector('#album_desc').innerHTML = '';
    let template = "";
    dataArr.forEach( item => {
        template += `
        <div class="p-2 bd-highlight">
        <div class="fl_block">
            <div class="item_block">
                <img src="img/${item.file}" alt="${item.album_name}" onclick="showAlbum(${item.id})">
            </div>
            <div class="item_block">
                <span class="s-title" onclick="showAlbum(${item.id})">${item.album_name}, ${item.album_year} г.</span>
            </div>
            <div class="item_block">
                <div class="but-panel">
                    <svg data-role="update" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="updateAlbum(${item.id})" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil svg-update" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
                        <path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
                    </svg>
                    <svg data-role="delete" onclick="deleteAlbum(${item.id})" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash svg-delete" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                </div>
            </div>
        </div>
        
    </div>
        `;
    } )
    return template;
}

async function deleteAlbum(id) {
    if (confirm(`${Conf.messageConfirm} #${id}`)) {
        const data = { id };
        try {
          const response = await fetch('./php/remove.php', {
            method: 'POST',
            body: JSON.stringify(data), 
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.error(Conf.messageError, error);
        }  
        getdataList();
    }
}

async function updateAlbum(id) {
    let form = document.querySelector('#exampleModal form');
    form.id = "form_edit";
    document.querySelector('#exampleModalLabel').textContent = Conf.titleEdit;
    document.querySelector('#type_f').value = 'edit';
    let inputId = document.createElement('input');
    inputId.setAttribute('type', 'hidden');
    inputId.setAttribute('name', 'id');
    inputId.setAttribute('value', id);
    form.appendChild(inputId);
    let rowArr;
    Conf.dataList.forEach( item => {
        if (item.id == id ) rowArr = item;
    })
    Conf.dataFormRequired.forEach(field => {
        if (field !== 'file')
            document.querySelector('#'+field).value = rowArr[field];
    })
}
