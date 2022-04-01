//Function for drawing mapModal with plaintext title, html content, and button objects
// Button = {title:STRING, link:STRING, disabled:BOOL}

function openInfoModal(_title, _bodyhtml, buttons){
    console.log("openInfoModel called");
    let mapModal = document.getElementById('mapModal')

    let modalTitle = mapModal.querySelector('.modal-title');
    let modalBody = mapModal.querySelector('#modal-body');
    let modalFoot = mapModal.querySelector('#modal-footer');

    modalTitle.textContent = _title;
    modalBody.SetHTML(_bodyhtml);

    let _tempHtml = "";

    buttons.forEach(btn => {

        if(btn.disabled){ 
            _tempHtml += `<button type="button" class="btn btn-primary" disabled>${btn.text}</button>`;
        }
        else{
            _tempHtml += `<a class="btn btn-primary" href="${btn.link}" role="button">${btn.text}</a>`;
        }

    });

    modalFoot.innerHTML = _tempHtml;

    mapModal.show(); 

}