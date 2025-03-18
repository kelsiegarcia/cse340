const form = document.querySelector('#updateForm');
form.addEventListener('change', function () {
  const updateBtn = document.querySelector('#button');
  updateBtn.removeAttribute('disabled');
});

const updatePassword = document.querySelector('#passwordForm');
updatePassword.addEventListener('change', function () {
  const updateBtn = document.querySelector('#updatePasswordBtn');
  updateBtn.removeAttribute('disabled');
});
