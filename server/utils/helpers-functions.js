const crypto = require('crypto');




module.exports.generateHashed6DigitCode = (id) => {

  const hash = crypto.createHash('sha256').update(id).digest('hex');
  const decimalNumber = parseInt(hash.slice(0, 6), 16);
  const sixDigitNumber = ('000000' + decimalNumber).slice(-6);
  return sixDigitNumber.toString();
}

module.exports.generateUniqueCode = async (id, AgencyModel) => {
  console.log(id)
  let code;
  do {
    code = this.generateHashed6DigitCode(id);
  } while (await AgencyModel.findOne({ where: { code } }));

  return code;
}



module.exports.generateOTP = (length = 6) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit.toString();
  }
  return result;
}
