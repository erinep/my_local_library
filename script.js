function main(){

    index = 1;
    size = 50;
    pagenation(index, size);


    //setup pagenation buttons
    document.querySelector("#next").addEventListener('click', function() {

        if (index + size < window.myData.length){
            index = index + size;
            pagenation(index, size);
        }
    })

    document.querySelector("#prev").addEventListener("click", function() {

        if (index - size > 0) {
            index = index - size;
            pagenation(index, size);
        }

    })
    
}


function pagenation(i, size){

    i = i - 1;
    let stop = i + size;
    let pageCurrent = Math.ceil(i/ size) + 1
    let pageTotal = Math.ceil(window.myData.length / size)

    // clear article contents
    document.querySelector("article").innerHTML = "";

    for( ; i < stop ; ++i){
        if ( i < window.myData.length){
            let book = window.myData[i]
            appendBookCard(book);
        }
    }

    //load page number
    pageCount = document.querySelector("#index").innerHTML = pageCurrent+ "/"+pageTotal;
}

function appendBookCard(book){

    var titleEl = document.createElement("h2");
    titleEl.innerText = book.title;

    var coverEl = document.createElement("img");
    coverEl.src = book.covers_default;

    var content = document.createElement("div");
    content.className = "content"

    var text = document.createElement("div");
    text.className = "text"

    var file_nameEl = document.createElement("p");
    file_nameEl.innerText = book.file_name;

    var authorEl = document.createElement("p");
    authorEl.innerText = book.author;

    var descEl = document.createElement("p");
    descEl.innerText = book.summary;

    var pathEl = document.createElement("a")
    pathEl.href = "file:" + book.path 
    pathEl.innerHTML = "LINK"

    var container = document.createElement('div');
    container.className = 'container';
    container.appendChild(titleEl);

    content.appendChild(coverEl);
    text.appendChild(descEl);
    text.appendChild(file_nameEl);
    text.appendChild(authorEl);
    text.appendChild(pathEl); 
    content.appendChild(text)

    container.appendChild(content)
    document.querySelector("article").appendChild(container)
}


// JavaScript to dynamically create and mount a .container
document.addEventListener('DOMContentLoaded', main)