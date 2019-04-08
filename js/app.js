$(document).ready(function () {
    get();

    var tBody = $("#tBody");

    function ajaxCall(bookId, type, data) {
        return $.ajax({
            url: "http://localhost:8080/books/" + bookId,
            type: type,
            dataType: "json",
            data: data,
            contentType: "application/json"
        })
    }

    function get() {
        ajaxCall("", "GET", "").done(function (result) {
            tBody.html("");
            for (var i = 0; i < result.length; i++) {
                var book = result[i];
                var tr = $("<tr>").addClass("bookRecord");
                var button = $("<button id='removeBtn'>").attr("data-method", "DELETE").html("Delete");

                $("<td>").text(book.id).attr("id", "bookId").appendTo(tr);
                $("<td>").text(book.title).attr("id", "title").attr("data-method", "GET").appendTo(tr);
                $("<td>").text(book.author).appendTo(tr);
                button.appendTo(tr);
                tr.appendTo(tBody);
                $("<td colspan = 3>").appendTo(tBody).hide();
            }
        });
    }

    tBody.on("click", "#title", function () {
        var bookDescription = $(this).parent().next().toggle();
        var bookId = $(this).siblings("#bookId").html();
        var ajaxType = $(this).data("method");
        ajaxCall(bookId, ajaxType, "").done(function (result) {
            bookDescription.html("isbn: " + result.isbn + "; publisher: " + result.publisher + "; type: " + result.type);
        })
    });

    $("#formAdd").on("submit", function (event) {
        event.preventDefault();

        var id = $("#formId").val();
        var isbn = $("#formIsbn").val();
        var title = $("#formTitle").val();
        var author = $("#formAuthor").val();
        var publisher = $("#formPublisher").val();
        var type = $("#formType").val();
        var ajaxType = $("#submitBtn").data("method");

        var book = {id: id, isbn: isbn, title: title, author: author, publisher: publisher, type: type};
        var bookString = JSON.stringify(book);

        ajaxCall("", ajaxType, bookString).done(function () {
            get();
        });
    });

    tBody.on("click", "#removeBtn", function () {
        var bookId = $(this).siblings("#bookId").html();
        var ajaxType = $("#removeBtn").data("method");

        ajaxCall(bookId, ajaxType, "").done(function(){
            get();
        })
    });
});