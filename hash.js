const bcrypt = require("bcrypt");

async function getSalt() {
  const salt = await bcrypt.genSalt(10);
  console.log("salt", salt);
  const hashed = await bcrypt.hash("1234", salt);
  console.log("hashed", hashed);
}

getSalt();
