$.validator.addMethod(
  "regex",
  function(value, element, regexp) {
    let re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
  },
  ""
);
$(document).ready(() => {
  $('#signupform').validate({
    rules: {
      email: {
        required: true,
        regex: "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"
      },
      username: {
        required: true,
        regex: "^[a-zA-Z0-9]{5,}$"
      },
      phone: {
        required: true,
        regex: "^0[0-9]{9,10}$"
      },
      name: {
        required: true,
        regex: "^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\\s]{5,}$"
      },
      gender: 'required',
      address: {
        required: true,
        regex: "^[a-zA-Z0-9àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\\s]{15,}$",
      },
      birthday: 'required',
      password: {
        required: true,
        regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$",
      },
      confirmpass: {
        required: true,
        equalTo: '#password',
      },
    },
    messages: {
      email: {
        required: 'Vui lòng nhập email',
        regex: 'Vui lòng nhập email hợp lệ',
      },
      username: {
        required: 'Vui lòng nhập username',
        regex: 'Username hợp lệ có ít nhất 5 kí tự chữ hoặc số'
      },
      name: {
        required: 'Vui lòng nhập tên',
        regex: 'Tên hợp lệ có ít nhất 5 kí tự chữ, không chứa số và kí tự đặc biệt'
      },
      phone: {
        required: 'Vui lòng nhập số điện thoại',
        regex: 'Vui lòng nhập sđt hợp lệ'
      },
      gender: 'Vui lòng chọn giới tính',
      address: {
        required: 'Vui lòng nhập địa chỉ',
        regex: 'Địa chỉ ít nhất 15 kí tự và không có kí tự đặc biệt'
      },
      birthday: 'Vui lòng chọn ngày sinh',
      password: {
        required: 'Vui lòng nhập mật khẩu',
        regex: 'Mật khẩu có ít nhất 8 kí tự bao gồm in hoa, in thường và số',
      },
      confirmpass: {
        required: 'Vui lòng nhập lại mật khẩu',
        equalTo: 'Mật khẩu nhập lại không trùng',
      },
    },
  });
});
