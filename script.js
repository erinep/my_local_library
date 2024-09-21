function main(){

    index = 1;
    size = 18;
    viewType = "card"
    pagenation(index, size, viewType);

    // TABLE VIEW LOGIC. toggle view type base on isTableView checkbox
    document.querySelector("#isTableView").addEventListener('click', (e) => {
        viewType = e.currentTarget.checked? "table": "card";
        console.log(viewType)
        pagenation(index, size, viewType);

    })


    //setup pagenation buttons
    document.querySelector("#next").addEventListener('click', function() {

        if (index + size < window.myData.length){
            index = index + size;
            pagenation(index, size, viewType);
        }
    })

    document.querySelector("#prev").addEventListener("click", function() {

        if (index - size > 0) {
            index = index - size;
            pagenation(index, size, viewType);
        }
    })

}


function pagenation(i, size, viewType){

    i = i - 1;
    let stop = i + size;
    let pageCurrent = Math.ceil(i/ size) + 1
    let pageTotal = Math.ceil(window.myData.length / size)

    if (viewType === "table"){
        // alert("TABLE VIEW NOT IMPLEMENTED")
        buildTable(i,stop);
    } else {
        buildCards(i,stop);
    }

    //load page number
    pageCount = document.querySelector("#index").innerHTML = pageCurrent+ "/"+pageTotal;
}


function buildTable(i, stop){

    let article = document.querySelector("article"); 
    article.innerHTML = "";
    var table = document.createElement("table")
    table.innerHTML = "<tr><th>Title</th><th>Author</th><th>Description</th></tr>"

    for (; i < stop ; ++i){
        if (i < window.myData.length){
            let book = window.myData[i];
            row = createRow(book);
            table.append(row)
        }
    }


    article.appendChild(table);
}

function createRow(book){
    row = document.createElement("tr")
    row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.summary}</td>`
    return row;
}



function buildCards(i, stop){

    // clear article contents
    document.querySelector("article").innerHTML = "";

    for( ; i < stop ; ++i){
        if ( i < window.myData.length){
            let book = window.myData[i]
            appendBookCard(book);
        }
    }
}

function appendBookCard(book){

    var titleEl = document.createElement("h2");
    titleEl.innerText = book.title;
    titleEl.className = "title"

    var coverEl = document.createElement("img");
    coverEl.src = book.covers_default;
    coverEl.className = "cover"

    var content = document.createElement("div");
    content.className = "content"

    var text = document.createElement("div");
    text.className = "text"

    var file_nameEl = document.createElement("p");
    file_nameEl.innerText = book.file_name;
    file_nameEl.style.wordBreak = "break-word";

    var authorEl = document.createElement("p");
    authorEl.innerText = book.author;

    var descEl = document.createElement("p");
    descEl.innerText = book.summary;
    descEl.className = "about"

    var pathEl = document.createElement("a")
    pathEl.href = "file:" + book.path 
    pathEl.innerText = "LINK"

    var showMoreEl = document.createElement("a");
    showMoreEl.addEventListener("click", () => {
        openInfo(book);
    })
    showMoreEl.innerText = "Read More..."

    var container = document.createElement('div');
    container.className = 'container';
    container.appendChild(titleEl);

    var metaEl = document.createElement("div");
    metaEl.className = "meta"

    content.appendChild(coverEl);
    metaEl.appendChild(file_nameEl);
    metaEl.appendChild(authorEl);
    metaEl.appendChild(pathEl); 

    text.appendChild(metaEl);
    text.appendChild(descEl);
    text.appendChild(showMoreEl);
    content.appendChild(text);

    container.appendChild(content)
    document.querySelector("article").appendChild(container)
}



function openInfo(book){
    let infoDiv = document.createElement("div");
    infoDiv.id = "info";

    let exit = document.createElement("a");
    exit.style.position =  "fixed";
    exit.style.right = "4%";
    exit.style.top = "2%";
    exit.style.fontSize = "3em";

    exit.innerText = "x"
    exit.addEventListener("click", () => {
        document.querySelector("#info").remove();
    })

    title = document.createElement("h1");
    title.innerText = book.title;
    title.id = "infoTitle"

    fullSummary = document.createElement("p");
    fullSummary.innerText = book.summary
    fullSummary.id = "fullSummary"

    infoDiv.appendChild(exit);
    infoDiv.appendChild(title);
    infoDiv.appendChild(fullSummary);

    document.querySelector("body").appendChild(infoDiv);
}

// JavaScript to dynamically create and mount a .container
document.addEventListener('DOMContentLoaded', main)