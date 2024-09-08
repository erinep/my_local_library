// Control the seed flow with a controller Object. Includes the following methods:
//   RUN_fetchbooks(rootDir)
//   RUN_fetchmeta(bookArray, start_index, size_of_fetch)
//   RUN_sortbooks(bookMetaArray)

const fs = require('fs');
const path = require('path');

// IMPORT LOCAL FUNCTIONS
const findLocalBooks = require("./find_myBooks.js");
const fetchBookMeta = require("./fetch_metadata.js")


module.exports = new class {

    constructor(){
        this.rootDir = 'F:\\backup\\audiobooks\\Trash'; 
    }

    RUN_findbooks(){
        return new Promise( (res, rej)  =>  {
            try{
                findLocalBooks(this.rootDir);
                res();
            } catch (err) {
                rej(err);
            }
        });
    }

    async RUN_fetchmeta(myBooks, start, inc){

        const file_metadata_dest = "./seed/books_meta.data"


        // local function. Do not use elsewhere
        function write_BookMeta(file, myBook, meta) {
            // append book object to the end of 'file'
        
                // WRITE BOOK DATA TO FILE
                fs.appendFileSync(file, `\
                {
                    "hasText": ${meta.hasText},
                    "title": "${meta.title}",
                    "file_name": "${myBook.file_name}",
                    "author": "${myBook.author}",
                    "summary": "${meta.summary}",
                    "covers_all": "${meta.covers_all}",
                    "covers_default": "${meta.covers_default}",
                    "tags": [${meta.tags}], 
                    "path": "${myBook.path}"
                },\n`, 
                    'utf-8')
        }

        return new Promise( async (res, rej) => {
            // OPEN FILE FOR WRITING
            fs.writeFileSync(file_metadata_dest, "module.exports = [\n");

            const debug_file = "./DEBUG.data"
            fs.writeFileSync(debug_file, "")

            // write books in range to file_metadata_dest file
            for (let i = start ; i < start + inc ; ++i){

                if(myBooks.length <= i ) break; // bounds check

                // BUILD SEARCH STRING. Remove numbers, quotation marks, keywords
                let str = myBooks[i].file_name +"+"+ myBooks[i].author;
                str = str.replace(/(.mp4|.m4b|.aac|book|Book)/g, "");
                str = str.replace(/[\d" ]+/g, "+");
                str = str.replace(/\[(.*?)\]/g, ""); // remove character between [square brackets]
                str = str.replace(/\((.*?)\)/g, ""); // remove character between (round brackets)


                
                let meta = await fetchBookMeta(str, 10)
                if (!meta.hasText){
                    // let link = `https://openlibrary.org/search.json?q=${str}&fields=title,key`;
                    // console.log (link)
                    // fs.appendFileSync(debug_file, `${link}\n`)

                    // fetch(link).then( (res) => res.json())
                    // .then( data => {
                    //     for (let doc of data.docs){
                    //         let sub_link = `https://openlibrary.org/${doc.key}.json`;
                    //         fs.appendFileSync(debug_file, `    ${sub_link}\n`)
                    //     }
                    // })
                        
                    process.stdout.write(`author: ${myBooks[i].author}, book: ${myBooks[i].file_name}, q: ${str} .... ${meta.hasText}\n`)
                }

                write_BookMeta(file_metadata_dest, myBooks[i], meta)
            }
            fs.appendFileSync(file_metadata_dest, ']');

            res();
        })
    }


    RUN_sortbooks(myBooksMeta){

        const file_defined = "./seed/mbooks_WITH_DATA.data"
        const file_undefined = "./seed/mbooks_NO_DATA.data"

        fs.writeFileSync(file_defined, "window.myData = [\n");
        fs.writeFileSync(file_undefined, "window.myData = [\n");

        for (let book of myBooksMeta){

            if (book.hasText) {
                fs.appendFileSync(file_defined, JSON.stringify(book)+",\n")
            }
            else {
                fs.appendFileSync(file_undefined, JSON.stringify(book)+",\n")
            }
        }

        fs.appendFileSync(file_defined, "]");
        fs.appendFileSync(file_undefined, "]");
    }

}() // immediately invoke the class