// run this script to launch the book seed flow

const controller = require("./controller");



async function RUN(){
    await controller.RUN_findbooks();

    let books = require("./books_initial.data")
    await controller.RUN_fetchmeta(books, 0, 210);

    let metadata = require("./books_meta.data");
    controller.RUN_sortbooks(metadata);
}


RUN();