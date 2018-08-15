var user = process.env.mongoose_user;
var password = process.env.mongoose_pwd;

module.exports = {
  'secret':'0199089ColorNinja',
  'database': 'mongodb://' +user+ ':' +password+ '@ds121382.mlab.com:21382/fixingcolor',
  'email_to': 'fixingcolor@gmail.com',
  'email_subject': 'FixingColor WWW Inquiry'
};
