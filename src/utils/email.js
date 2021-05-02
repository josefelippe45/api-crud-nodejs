const validateEmail = (reg) => {
  var regex = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
  if (!regex.test(reg)) return false;
  else return true;
};

module.exports = validateEmail;
