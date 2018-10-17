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