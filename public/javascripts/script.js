// Đổi màu form 
$('#chooseFile').bind('change', function () {
  var filename = $("#chooseFile").val();
  if (/^\s*$/.test(filename)) {
    // Đổi sang màu vàng khi chưa chọn file 
    changeToYellow();
  } else {
    // Đổi sang màu xanh khi đã chọn fìle
    changeToGreen();
  }
});

// function đổi form upload sang màu xanh
function changeToGreen() {
  $(".file-upload").addClass('active');
  $(".upload-btn").addClass('active');
  $(".transform-color").addClass('active');
  $("#findcode").addClass('active');
  $("#findpass").addClass('active');
  $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
}

// function đổi form upload sang màu vàng
function changeToYellow() {
  $(".file-upload").removeClass('active');
  $(".upload-btn").removeClass('active');
  $("#findcode").removeClass('active');
  $("#findpass").removeClass('active');
  $(".transform-color").removeClass('active');
  $("#noFile").text("No file chosen...");
}

// Send ajax upload 
function sendAjaxUpload() {
  let inputFile = $('#chooseFile');
  // Bắt lỗi input rỗng 
  if (inputFile.get(0).files.length === 0) {
    alert("ec");
  } else {
    // Hiển thị preloader
    $('#preloadModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    let form = $('form#uploadform');
    let formData = new FormData(form[0]);
    $.ajax({
      type: "POST",
      url: form.attr("action"),
      data: formData,
      success: function (data) {
        $('#preloadModal').modal('hide');
        $('#resultModal').modal('show');
        $('img#iconSuccess').css("display", "block");
        // Ngưng icon success nhấp nháy
        setTimeout(() => {
          $('img#iconSuccess').attr("src", "images/success-icon-0.png");
        }, 1200);
        // Hiển thị code trả về
        $('#codeResult').html(data.code);
        // Đổi màu form, reset form
        $('form#uploadform')[0].reset();
        changeToYellow();
      },
      error: function (params) {
        $('#preloadModal').modal('hide');
      },
      cache: false,
      contentType: false,
      processData: false
    });
  }
}

// Ajax for Upload
$('form#uploadform').submit((e) => {
  e.preventDefault();
  sendAjaxUpload();
});


//AJAX for find
$('form#findform').submit((e) => {
  e.preventDefault();
  let data = {};
  data.code = $('input#findcode-find').val();
  data.pass = $('input#pass-find').val();
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: $('form#findform').attr("action"),
    data: JSON.stringify(data),
    success: function (data) {
      $('#resultModal').modal('show');

    },
    cache: false,
    processData: false
  });
});


$('#hideModalUpload').click(() => {
  $('img#iconSuccess').attr("src", "images/success-icon.gif");
});