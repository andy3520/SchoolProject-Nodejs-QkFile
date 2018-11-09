// Upload start
$('#chooseFile').bind('change', function () {
  var filename = $("#chooseFile").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $(".upload-btn").removeClass('active');
    $("#findcode").removeClass('active');
    $("#findpass").removeClass('active');
    $(".transform-color").removeClass('active');
    $("#noFile").text("No file chosen...");
  }
  else {
    $(".file-upload").addClass('active');
    $(".upload-btn").addClass('active');
    $(".transform-color").addClass('active');
    $("#findcode").addClass('active');
    $("#findpass").addClass('active');
    $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
  }
});

//Upload end

// Ajax for Upload
$('form#uploadform').submit((e)=>{
  e.preventDefault();
  let formData = new FormData($('form#uploadform')[0]);
  $.ajax({
    type: "POST",
    url: $('form#uploadform').attr("action"),
    data: formData,
    success: function (data) {
      $('#preloadModal').modal('hide');
      $('#resultModal').modal('show');
      if (data.flag){
        $('img#iconSuccress').css("display", "block");
        setTimeout(()=>{
          $('img#iconSuccress').attr("src","images/success-icon-0.png");
        },1200);
        $('#codeResult').html(data.code);
        $('form#uploadform')[0].reset();
        $(".file-upload").removeClass('active');
        $(".upload-btn").removeClass('active');
        $("#findcode").removeClass('active');
        $("#findpass").removeClass('active');
        $(".transform-color").removeClass('active');
        $("#noFile").text("No file chosen...");
      }
    },
    cache: false,
    contentType: false,
    processData: false
  });
});

$('#hideModalUpload').click(() => {
  $('img#iconSuccress').attr("src","images/success-icon.gif");
});

$('input#uploadAjax').click(()=>{
  $('#preloadModal').modal('show');
});
// end Ajax Upload