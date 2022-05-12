const bcrypt = require("bcrypt");

async function getSalt() {
  const salt = await bcrypt.genSalt(10);
  console.log("salt", salt);
}

getSalt();