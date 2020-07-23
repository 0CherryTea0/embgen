function msgcount() {
    document.getElementById('msg_counter').innerHTML = document.getElementById('message').value.length + '/2000';
}
function autcount() {
    document.getElementById('aut_counter').innerHTML = document.getElementById('author').value.length + '/256';
}
function ttlcount() {
    document.getElementById('ttl_counter').innerHTML = document.getElementById('title').value.length + '/256';
}
function dsccount() {
    document.getElementById('dsc_counter').innerHTML = document.getElementById('description').value.length + '/2048';
}
function ftrcount() {
    document.getElementById('ftr_counter').innerHTML = document.getElementById('footer').value.length + '/256';
}
function enemb() {
    let elements = document.getElementsByClassName('emb_input');
    for(let element in elements) {
        if(document.getElementById('enable_embed').checked) elements[element].disabled = false;
        else elements[element].disabled = true;
    }
}
function addfield() {
    let ol = document.getElementById('fields');
    let li = document.createElement('li');
    li.id = ol.childNodes.length + 1;
    let name = document.createElement('input');
    let value = document.createElement('textarea');
    let inline = document.createElement('input');
    let inlt = document.createElement('span');
    let remove = document.createElement('button');
    let br = document.createElement('br');
    inlt.innerHTML = 'На линии';
    name.type = 'text';
    name.className = 'name';
    name.placeholder = 'Название';
    name.maxLength = 256;
    value.style.height = 100;
    value.maxLength = 1024;
    value.placeholder = 'Текст';
    value.className = 'value';
    inline.type = 'checkbox';
    inline.style.width = 23;
    inline.style.height = 23;
    inline.className = 'inline';
    remove.innerHTML = 'x';
    remove.style.width = 40;
    remove.style.height = 40;
    remove.style.backgroundColor = 'red';
    remove.style.fontSize = '2em';
    remove.style.borderRadius = '7px';
    remove.style.color = 'white';
    remove.style.display = 'block';
    remove.style.marginLeft = '20px';
    remove.style.marginTop = '10px';
    remove.addEventListener('click', () => {
        remove.parentElement.remove();
        document.getElementById('addbut').disabled = false;
    })
    li.appendChild(name);
    li.appendChild(value);
    li.appendChild(inline);
    li.appendChild(inlt);
    li.appendChild(br);
    li.appendChild(remove);
    li.appendChild(br);
    ol.appendChild(li);

    if(ol.childNodes.length >= 25) document.getElementById('addbut').disabled = true;
}
function send() {
    document.getElementById('send').disabled = true;
    let states = ['Отправка', 'Отправка.', 'Отправка..', 'Отправка...'];
    let i = 0;
    document.getElementById('state').innerHTML = states[i];
    int = setInterval(() => {
        document.getElementById('state').innerHTML = states[i];
        i++;
        if(i >= 4) i = 0;
    }, 200)
    let embed = {};
    embed.embed = {};
    embed.webhook = document.getElementById('webhook').value;
    embed.message = document.getElementById('message').value;
    embed.embed.enabled = document.getElementById('enable_embed').checked;
    embed.embed.color = document.getElementById('color').value;
    embed.embed.author = {
        image: document.getElementById('author_imgurl').value,
        link: document.getElementById('author_link').value,
        text: document.getElementById('author').value
    }
    embed.embed.url = document.getElementById('title_link').value;;
    embed.embed.title = document.getElementById('title').value;;
    embed.embed.description = document.getElementById('description').value;
    embed.embed.fields = [];
    if(!document.getElementsByClassName('name').length <= 0) {
        for(let i in document.getElementsByClassName('name')) {
            if(!embed.embed.fields[i]) embed.embed.fields[i] = {};
            embed.embed.fields[i].name = document.getElementsByClassName('name')[i].value;
        }
        for(let i in document.getElementsByClassName('value')) {
            if(!embed.embed.fields[i]) embed.embed.fields[i] = {};
            embed.embed.fields[i].value = document.getElementsByClassName('value')[i].value;
        }
        for(let i in document.getElementsByClassName('inline')) {
            if(!embed.embed.fields[i]) embed.embed.fields[i] = {};
            embed.embed.fields[i].inline = document.getElementsByClassName('inline')[i].checked;
        }
    }
    embed.embed.thumbnail = document.getElementById('thumbnail_url').value;
    embed.embed.image = document.getElementById('image_url').value;
    embed.embed.footer = {
        image: document.getElementById('footer_imgurl').value,
        text: document.getElementById('footer').value
    }
    embed.embed.timestamp = document.getElementById('date').value + ' ' + document.getElementById('time').value;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/send', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(embed));
    xhr.onload = () => {
        clearInterval(int);
        if(xhr.status == 200) document.getElementById('state').innerHTML = '<font color = green>Отправлено!</font>';
        else {
            document.getElementById('state').innerHTML = `<font color = red>${xhr.response}</font>`;
        }
        document.getElementById('send').disabled = false;
    }
}