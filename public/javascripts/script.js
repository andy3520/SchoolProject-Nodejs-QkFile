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
        let displaySize = "" ;
        if (sizeByte > 1000) {
          let sizeKB = sizeByte / 1000;
          displaySize = Math.round(sizeKB) < 1000 ? Math.round(sizeKB) + "KB" : Math.round(sizeKB / 1000) + "MB";
        } else {
         displaySize = sizeByte + "Bytes"; 
        }
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

$('#forgetpass').click(() => {
  $('#forgetModal').modal('show');
});

$('form#forgetForm').submit((e) => {
  e.preventDefault();
  let emailRequest = $('input#emailForget');
  var patt = new RegExp("^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");
  if (!(emailRequest.val().length === 0) && patt.test($('#emailForget').val())) {
    $('#forgetModal').modal('hide');
    $('#preloadModal').modal({
      backdrop: 'static',
      keyboard: false,
    });
    const data = {};
    data.email = emailRequest.val();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: $('form#forgetForm').attr('action'),
      data: JSON.stringify(data),
      success: (data) => {
        $('#preloadModal').modal('hide');
        $('form#forgetForm').trigger("reset");
        $('#confirmModal').modal('show');
        $('input#emailConfirm').val(data.email);
      },
      error: (data) => {
        $('#preloadModal').modal('hide');
        $('#forgetModal').modal('hide');
        $('form#forgetForm').trigger("reset");
        $('#errorModal').modal('show');
        
        let mess = $.parseJSON(data.responseText);
        $('#errorMessage').html(
          `${data.status} - ${mess.message}`
        );
      },
      cache: false,
      processData: false,
    });
  }
});

$('form#confirmForm').submit((e) => {
  e.preventDefault();
  let emailConfirm = $('input#emailConfirm');
  let code = $('input#codeConfirm');
  let password = $('input#newPassword');
  let patPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
  let patEmail = new RegExp("^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");
  if (!(password.val().length === 0) && !(code.val().length === 0) && !(emailConfirm.val().length === 0) && patEmail.test(emailConfirm.val()) && patPass.test(password.val())) {
    $('#confirmModal').modal('hide');
    $('#preloadModal').modal({
      backdrop: 'static',
      keyboard: false,
    });
    const data = {};
    data.email = emailConfirm.val();
    data.code = code.val();
    data.pass = password.val();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: $('form#confirmForm').attr('action'),
      data: JSON.stringify(data),
      success: (data) => {
        $('#preloadModal').modal('hide');
        $('form#confirmForm').trigger("reset");
        $('#resultModal').modal('show');
        $('img#iconSuccess').css('display', 'block');
        // Ngưng icon success nhấp nháy
        setTimeout(() => {
          $('img#iconSuccess').attr('src', 'images/success-icon-0.png');
        }, 1200);
        // Hiển thị code trả về
        $('#codeResult').html(JSON.stringify(data));
      },
      error: (data) => {
        $('#preloadModal').modal('hide');
        $('form#confirmForm').trigger("reset");
        $('#errorModal').modal('show');
        // let mess = $.parseJSON(data.responseText);
        // $('#errorMessage').html(
        //   `${data.status} - ${mess.message}`
        // );
        $('#errorMessage').html(
          JSON.stringify(data.err)
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