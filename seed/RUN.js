// run this script to launch the book seed flow

const fs = require('fs');
const path = require('path');


const findLocalBooks = require("./find_myBooks.js");
const fetchBookMeta = require("./fetch_metadata.js")

const myBooks = require("./books_initial.data.bak");
const myBooksMeta = require("./books_meta_v1.data.bak");


function RUN_fetchbooks(){
    const rootDir = 'F:\\backup\\audiobooks\\Trash'; 
    findLocalBooks(rootDir)
}

async function RUN_fetchmeta(start, inc){

    const file_metadata_dest = "./seed/books_meta.data"
    fs.writeFileSync(file_metadata_dest, "window.myData = [\n");

    for (let i = start ; i < start + inc ; ++i){

        if(myBooks.length <= i ) break; // bounds check

        let str = myBooks[i].file_name + " " + myBooks[i].author;
        console.log("SEARCH STRING: ", str)
        let meta = await fetchBookMeta(str, 10)
        
        // WRITE BOOK DATA TO FILE
        fs.appendFileSync(file_metadata_dest, `\
        {
            "title": "${meta.title}",
            "file_name": "${myBooks[i].file_name}",
            "author": "${myBooks[i].author}",
            "summary": "${meta.summary}",
            "covers_all": "${meta.covers_all}",
            "covers_default": "${meta.covers_default}",
            "tags": [${meta.tags}], 
            "path": "${myBooks[i].path}"
        },\n`, 
        'utf-8')
    }

    fs.appendFileSync(file2, ']');

}


function RUN_sortbooks(){

    const file_defined = "./seed/mbooks_WITH_DATA.data"
    const file_undefined = "./seed/mbooks_NO_DATA.data"

    fs.writeFileSync(file_defined, "window.myData = [\n");
    fs.writeFileSync(file_undefined, "window.myData = [\n");

    for (let book of myBooksMeta){

        const condition = book.summary !== 'undefined'

        if (condition) {
            fs.appendFileSync(file_defined, JSON.stringify(book)+",\n")
        }
        else {
            fs.appendFileSync(file_undefined, JSON.stringify(book)+",\n")
        }
    }

    fs.appendFileSync(file_defined, "]");
    fs.appendFileSync(file_undefined, "]");
}


RUN_sortbooks()
//RUN_fetchmeta(0,300);
