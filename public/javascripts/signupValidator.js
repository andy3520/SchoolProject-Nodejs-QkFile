$(document).ready(() => {
  $('#signupform').validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      username: 'required',
      phone: 'required',
      name: 'required',
      gender: 'required',
      address: {
        required: true,
        minlength: 2,
      },
      birthday: 'required',
      password: {
        required: true,
        minlength: 6,
      },
      confirmpass: {
        required: true,
        equalTo: '#password',
      },
    },
    messages: {
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
      },
      username: 'Username is required',
      name: 'Name is required',
      phone: 'Phone is required',
      gender: 'Please choose a gender',
      address: {
        required: 'Address is required',
        minlength: 'too short!',
      },
      birthday: 'Please choose a birthday',
      password: {
        required: 'Password is required',
        minlength: 'Min length 6',
      },
      confirmpass: {
        required: 'Confirm password is required',
        equalTo: 'Please enter the same value again',
      },
    },
  });
});
