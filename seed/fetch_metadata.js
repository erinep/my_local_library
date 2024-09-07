// Return the first search result from Openlibrary.org
// parameter: searchStr, depth - how many items to search for meta data
// Return Metadata Object with author_name, title, summary, and tags


const fs = require('fs');
const path = require('path');


async function fetchBookMeta (searchStr, depth) {


    let bookMeta = {};
    bookMeta.hasText = false;

    let searchUrl = `https://openlibrary.org/search.json?q=${searchStr}&limit=${depth}&fields=author_name,title,key`

    try {


        let searchResponse = await fetch(searchUrl)
        let searchData = await searchResponse.json()

        for (const book of searchData.docs){

            let i = 0;

            let metaUrl = `https://openlibrary.org/${book.key}.json`
            let bookKeyResponse = await fetch(metaUrl)
            let bookKeyFetch = await bookKeyResponse.json()

            // LOOP UNTIL META A SUMMARY IS FOUND
            if (bookKeyFetch.description?.value){

                bookMeta.hasText = true;
                bookMeta.authors = book.author_name;
                bookMeta.title = bookKeyFetch.title;
                bookMeta.covers_all = bookKeyFetch.covers;
                bookMeta.covers_default = `https://covers.openlibrary.org/b/id/${bookKeyFetch.covers[0]}-M.jpg`;
                bookMeta.summary = bookKeyFetch.description.value.replace(/[\r\n"]+/g, '');

                // clean tags
                bookMeta.tags = bookKeyFetch?.subjects?.map(tag => `'${tag.replace(/["']/g, '')}'`)
                break;
            }

            // LOAD INITAL META DATA ON FIRST LOOP
            if ( i === 0){
                bookMeta.authors = book.author_name;
                bookMeta.title = bookKeyFetch.title;
            }

            i++;
        }


    } catch (err) {
        console.log(err)
    }
 
    return bookMeta

}



module.exports = fetchBookMeta