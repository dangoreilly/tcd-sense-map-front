//Function for drawing mapModal with plaintext title, html content, and buttons array
// Button = {title:STRING, link:STRING, disabled:BOOL}

function openInfoModal(_title, _bodyhtml, buttons){
    // console.log("openInfoModel called");
    // console.log(_title);
    // console.log(_bodyhtml);
    // console.log(buttons);

    let mapModal = document.getElementById('mapModal')

    let modalTitle = mapModal.querySelector('.modal-title');
    let modalBody = mapModal.querySelector('.modal-body');
    let modalFoot = mapModal.querySelector('.modal-footer');

    modalTitle.textContent = _title;
    modalBody.innerHTML = _bodyhtml;

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

    var myModal = new bootstrap.Modal(document.getElementById('mapModal'))
    myModal.show(); 

}

function closeModal(_modal){
    
    var myModal = new bootstrap.Modal(document.getElementById(_modal))
    myModal.hide(); 

}