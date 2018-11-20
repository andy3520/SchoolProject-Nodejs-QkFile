// Đổi màu form
$('#chooseFile').bind('change', () => {
  const filename = $('#chooseFile').val();
  if (/^\s*$/.test(filename)) {
    // Đổi sang màu vàng khi chưa chọn file
    changeToYellow();
  } else {
    // Đổi sang màu xanh khi đã chọn fìle
    changeToGreen(filename);
  }
});

// function đổi form upload sang màu xanh
function changeToGreen(filename) {
  $('.file-upload').addClass('active');
  $('.upload-btn').addClass('active');
  $('.transform-color').addClass('active');
  $('#findcode').addClass('active');
  $('#findpass').addClass('active');
  $('#noFile').text(filename.replace('C:\\fakepath\\', ''));
}

// function đổi form upload sang màu vàng
function changeToYellow() {
  $('.file-upload').removeClass('active');
  $('.upload-btn').removeClass('active');
  $('#findcode').removeClass('active');
  $('#findpass').removeClass('active');
  $('.transform-color').removeClass('active');
  $('#noFile').text('No file chosen...');
}

// Send ajax upload
function sendAjaxUpload() {
  const inputFile = $('#chooseFile');
  // Bắt lỗi input rỗng
  if (inputFile.get(0).files.length === 0) {
    $('#errorModal').modal('show');
    $('#errorMessage').html('Vui lòng chọn file');
  } else {
    // Hiển thị preloader
    $('#preloadModal').modal({
      backdrop: 'static',
      keyboard: false,
    });
    const formData = new FormData($('form#uploadform')[0]);
    $.ajax({
      type: 'POST',
      url: $('form#uploadform').attr('action'),
      data: formData,
      success: (data) => {
        $('#preloadModal').modal('hide');
        $('#resultModal').modal('show');
        $('img#iconSuccess').css('display', 'block');
        // Ngưng icon success nhấp nháy
        setTimeout(() => {
          $('img#iconSuccess').attr('src', 'images/success-icon-0.png');
        }, 1200);
        // Hiển thị code trả về
        $('#codeResult').html(data.code);
        // Đổi màu form, reset form
        $('form#uploadform')[0].reset();
        changeToYellow();
      },
      // Bắt lỗi các vs các status code
      error: (data) => {
        $('#preloadModal').modal('hide');
        $('#errorModal').modal('show');
        let mess = $.parseJSON(data.responseText);
        $('#errorMessage').html(`${data.status} - ${mess.err}`);
      },
      cache: false,
      contentType: false,
      processData: false,
    });
  }
}

$('#hideModalUpload').click(() => {
  $('#codeResult').html('');
  $('img#iconSuccess').attr('src', 'images/success-icon.gif');
});


// Ajax for Upload
$('form#uploadform').submit((e) => {
  e.preventDefault();
  sendAjaxUpload();
});


// AJAX tìm file
$('form#findform').submit((e) => {
  e.preventDefault();
  let code = $('input#findcode-find');
  let pass = $('input#pass-find');
  // Bắt lỗi input code rỗng
  if (code.val().length === 0) {
    $('#errorModal').modal('show');
    $('#errorMessage').html('Vui lòng nhập mã tìm kiếm');
  } else {
    $('#preloadModal').modal({
      backdrop: 'static',
      keyboard: false,
    });
    const data = {};
    data.code = code.val();
    data.pass = pass.val();
    if (data.pass === "" || data.pass === undefined) {
      data.pass = " ";
    }
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: $('form#findform').attr('action'),
      data: JSON.stringify(data),
      success: (data) => {
        $('#preloadModal').modal('hide');
        $('#resultModal').modal('show');
        $('#modal-dialog').addClass('des-download');
        $('img#iconSuccess').css('display', 'block');
        // Ngưng icon success nhấp nháy
        setTimeout(() => {
          $('img#iconSuccess').attr('src', 'images/success-icon-0.png');
        }, 1200);
        let displayData = data.data;
        let sizeByte = Number(displayData.fileSize);
        let sizeKB = sizeByte / 1024;
        let displaySize = Math.round(sizeKB) < 1000 ? Math.round(sizeKB) + "KB" : Math.round(sizeKB / 1024) + "MB";
        $('#codeResult').html(
          "CODE"
          + `<h3>${displayData.code}</h3>`
          + "FILENAME (click &darr; to download)"
          + `<h3><a style='text-decoration: underline; color:#78B345;' target='_blank' href='/download/${displayData.fileName}'>${displayData.fileName}</a></h3>`
          + "SIZE"
          + `<h3>${displaySize}</h3>`
          + "TYPE"
          + `<h3>${displayData.fileType}</h3>`
        );
      }
      ,
      error: (data) => {
        $('#preloadModal').modal('hide');
        $('#errorModal').modal('show');
        let mess = $.parseJSON(data.responseText);
        $('#errorMessage').html(
          `${data.status} - ${mess.err}`
        );
      },
      cache: false,
      processData: false,
    });
  }
});


// Fix lỗi bootstrap modal làm bể layout
$(document.body).on('hide.bs.modal,hidden.bs.modal', function () {
  $('body').css('padding-right', '0');
  $('#modal-dialog').removeClass('des-download');
});