function changeToGreen(e) {
  $(".file-upload").addClass("active"), $(".upload-btn").addClass("active"), $(".transform-color").addClass("active"), $("#findcode").addClass("active"), $("#findpass").addClass("active"), $("#noFile").text(e.replace("C:\\fakepath\\", ""))
}

function changeToYellow() {
  $(".file-upload").removeClass("active"), $(".upload-btn").removeClass("active"), $("#findcode").removeClass("active"), $("#findpass").removeClass("active"), $(".transform-color").removeClass("active"), $("#noFile").text("No file chosen...")
}

let passFile = !0;

function sendAjaxUpload() {
  if (passFile)
    if (0 === $("#chooseFile").get(0).files.length) $("#errorModal").modal("show"), $("#errorMessage").html("Vui lòng chọn file");
    else {
      $("#preloadModal").modal({
        backdrop: "static",
        keyboard: !1
      });
      const e = new FormData($("form#uploadform")[0]);
      $.ajax({
        type: "POST",
        url: $("form#uploadform").attr("action"),
        data: e,
        success: e => {
          $("#preloadModal").modal("hide"), $("#resultModal").modal("show"), $("img#iconSuccess").css("display", "block"), setTimeout(() => {
            $("img#iconSuccess").attr("src", "images/success-icon-0.png")
          }, 1200), $("#codeResult").html(e.code), $("form#uploadform")[0].reset(), changeToYellow()
        },
        error: e => {
          $("#preloadModal").modal("hide"), $("#errorModal").modal("show");
          let o = $.parseJSON(e.responseText);
          $("#errorMessage").html(`${e.status} - ${o.err}`)
        },
        cache: !1,
        contentType: !1,
        processData: !1
      })
    } else $("#errorModal").modal("show"), $("#errorMessage").html("411 - File lớn hơn mức quy định là 20 MB, vui lòng đăng nhập để tăng dung lượng giới hạn lên 50MB")
}

var uploadField = document.getElementById("chooseFile");
null !== uploadField && (uploadField.onchange = function () {
  const e = $("#chooseFile").val();
  /^\s*$/.test(e) ? changeToYellow() : changeToGreen(e), this.files[0].size > 2e7 ? (this.value = "", passFile = !1) : passFile = !0
}), $("#hideModalUpload").click(() => {
  $("#codeResult").html(""), $("img#iconSuccess").attr("src", "images/success-icon.gif")
}), $("form#uploadform").submit(e => {
  e.preventDefault(), sendAjaxUpload()
}), $("form#findform").submit(e => {
  e.preventDefault();
  let o = $("input#findcode-find"),
    a = $("input#pass-find");
  if (0 === o.val().length) $("#errorModal").modal("show"), $("#errorMessage").html("Vui lòng nhập mã tìm kiếm");
  else {
    $("#preloadModal").modal({
      backdrop: "static",
      keyboard: !1
    });
    const e = {};
    e.code = o.val(), e.pass = a.val(), "" !== e.pass && void 0 !== e.pass || (e.pass = " "), $.ajax({
      type: "POST",
      contentType: "application/json",
      url: $("form#findform").attr("action"),
      data: JSON.stringify(e),
      success: e => {
        $("#preloadModal").modal("hide"), $("#resultModal").modal("show"), $("#modal-dialog").addClass("des-download"), $("img#iconSuccess").css("display", "block"), setTimeout(() => {
          $("img#iconSuccess").attr("src", "images/success-icon-0.png")
        }, 1200);
        let o = e.data,
          a = Number(o.fileSize),
          s = "";
        if (a > 1e3) {
          let e = a / 1e3;
          s = Math.round(e) < 1e3 ? Math.round(e) + "KB" : Math.round(e / 1e3) + "MB"
        } else s = a + "Bytes";
        $("#codeResult").html("CODE" + `<h3>${o.code}</h3>` + "FILENAME (click &darr; to download)" + `<h3><a style='text-decoration: underline; color:#78B345;' target='_blank' href='/download/${o.fileName}'>${o.fileName}</a></h3>` + "SIZE" + `<h3>${s}</h3>` + "TYPE" + `<h3>${o.fileType}</h3>`)
      },
      error: e => {
        $("#preloadModal").modal("hide"), $("#errorModal").modal("show");
        let o = $.parseJSON(e.responseText);
        $("#errorMessage").html(`${e.status} - ${o.err}`)
      },
      cache: !1,
      processData: !1
    })
  }
}), $("#forgetpass").click(() => {
  $("#forgetModal").modal("show")
}), $("form#forgetForm").submit(e => {
  e.preventDefault();
  let o = $("input#emailForget");
  var a = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
  if (0 !== o.val().length && a.test($("#emailForget").val())) {
    $("#forgetModal").modal("hide"), $("#preloadModal").modal({
      backdrop: "static",
      keyboard: !1
    });
    const e = {};
    e.email = o.val(), $.ajax({
      type: "POST",
      contentType: "application/json",
      url: $("form#forgetForm").attr("action"),
      data: JSON.stringify(e),
      success: e => {
        $("#preloadModal").modal("hide"), $("form#forgetForm").trigger("reset"), $("#confirmModal").modal("show"), $("input#emailConfirm").val(e.email)
      },
      error: e => {
        $("#preloadModal").modal("hide"), $("#forgetModal").modal("hide"), $("form#forgetForm").trigger("reset"), $("#errorModal").modal("show");
        let o = $.parseJSON(e.responseText);
        $("#errorMessage").html(`${e.status} - ${o.message}`)
      },
      cache: !1,
      processData: !1
    })
  }
}), $("form#confirmForm").submit(e => {
  e.preventDefault();
  let o = $("input#emailConfirm"),
    a = $("input#codeConfirm"),
    s = $("input#newPassword"),
    l = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"),
    t = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
  if (0 !== s.val().length && 0 !== a.val().length && 0 !== o.val().length && t.test(o.val()) && l.test(s.val())) {
    $("#confirmModal").modal("hide"), $("#preloadModal").modal({
      backdrop: "static",
      keyboard: !1
    });
    const e = {};
    e.email = o.val(), e.code = a.val(), e.pass = s.val(), $.ajax({
      type: "POST",
      contentType: "application/json",
      url: $("form#confirmForm").attr("action"),
      data: JSON.stringify(e),
      success: e => {
        $("#preloadModal").modal("hide"), $("form#confirmForm").trigger("reset"), $("#resultModal").modal("show"), $("img#iconSuccess").css("display", "block"), setTimeout(() => {
          $("img#iconSuccess").attr("src", "images/success-icon-0.png")
        }, 1200), $("#codeResult").html(e.message)
      },
      error: e => {
        $("#preloadModal").modal("hide"), $("#confirmModal").modal("show");
        let o = $.parseJSON(e.responseText);
        $("#errorConfirm").html(`${e.status} - ${o.message}`)
      },
      cache: !1,
      processData: !1
    })
  }
}), $(document.body).on("hide.bs.modal,hidden.bs.modal", function () {
  $("body").css("padding-right", "0"), $("#modal-dialog").removeClass("des-download")
});