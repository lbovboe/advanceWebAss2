$(function () {
    // GET/READ
    $("#get-button").on("click", function () {
      $.ajax({
        url: "/ajaxData",
        contentType: "application/json",
        success: function (response) {
          console.log(response);
          // var arr = JSON.parse(response);
          // console.log(arr);
        },
      });
    });
  });
  