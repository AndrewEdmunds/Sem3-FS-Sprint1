const fs = require('fs');
const path = require('path');
const readline = require('readline');

//function specifically for reading from the Data folder
const readDataFile = (fileName) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', fileName), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName} data:`, error);
    return {};
  }
};

//function specifically for writing to the Data folder
const writeDataFile = (fileName, data) => {
  fs.writeFileSync(path.join(__dirname, 'data', fileName), JSON.stringify(data, null, 2));
};

//functions which adds the default token file and its default contents
const addDefaultTokens = () => {
  if (fs.existsSync('data/tokens.json')) {
    console.log('Default tokens file already exists.');
    return;
  }

  const defaultTokens = {
    tokens: {
      "1916bf5f32b2643a9df96b39ae69f00d06765da8e03d3f4f63981d1da9ceafa4": {
        userId: "user1",
        expiresAt: "2023-07-28T13:55:23.880Z"
      }
    }
  };

  try {
    writeDataFile('tokens.json', defaultTokens);
    console.log('Default tokens file created.');
  } catch (error) {
    console.error('Error creating default tokens file:', error);
  }
};

//same as addDefaultToken except for the users file
const addDefaultUsers = () => {
  if (fs.existsSync('data/users.json')) {
    console.log('Default users file already exists.');
    return;
  }

  const defaultUsers = {
    users: {
      user1: {
        username: "Admin",
        name: "Andrew Edmunds",
        email: "admin@keyin.com",
        phone: "7097861234"
      }
    }
  };

  try {
    writeDataFile('users.json', defaultUsers);
    console.log('Default users file added.');
  } catch (error) {
    console.error('Error adding default users file:', error);
  }
};

//function that gives access to the users in the users file
const getUsers = () => {
  const usersData = readDataFile('users.json');
  return usersData.users || {};
};

//same as above except for tokens
const getTokens = () => {
  const tokensData = readDataFile('tokens.json');
  return tokensData.tokens || {};
};

//generates a token with expiry date, writes it to the file, and logs it
const generateUserToken = (userId) => {
  const tokensData = readDataFile('tokens.json');

  const token = generateToken();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  tokensData[token] = {
    userId,
    expiresAt: expiryDate,
  };

  writeDataFile('tokens.json', tokensData);

  console.log('Generated token:', token);

  return token;
};

//essentially just gets the token linked to an inputted username if one exists
const getToken = (username) => {
  const users = getUsers();
  const tokens = getTokens();

  const userId = Object.keys(users).find((key) => users[key].username === username);
  if (userId) {
    const tokenKey = Object.keys(tokens).find((key) => tokens[key].userId === userId);
    if (tokenKey) {
      console.log('Token:', tokenKey);
    } else {
      console.log('Token not found for the user.');
    }
  } else {
    console.log('User not found.');
  }
};

//finds the user with the associated username in the users file, then allows the
//phone number and/or/neither email to be overwritten with a new value
const updateUserCreds = (username) => {
  console.log(`Updating user credentials for ${username}...`);

  try {
    const users = getUsers();

    const user = Object.values(users).find((u) => u.username === username);

    if (!user) {
      console.error('Error: User not found.');
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter new email (leave empty to keep existing): ', (newEmail) => {
      rl.question('Enter new phone number (leave empty to keep existing): ', (newPhone) => {
        rl.close();

        newEmail = newEmail.trim();
        newPhone = newPhone.trim();

        user.email = newEmail !== '' ? newEmail : user.email;
        user.phone = newPhone !== '' ? newPhone : user.phone;

        const usersData = readDataFile('users.json');
        usersData.users = users;

        writeDataFile('users.json', usersData);

        console.log(`User credentials updated successfully for ${username}.`);
      });
    });

  } catch (error) {
    console.error('Error updating user credentials:', error);
  }
};
const addUserCreds = (username) => {
  console.log(`Adding new credentials for ${username}...`);

  try {
    const users = getUsers();

    const user = Object.values(users).find((u) => u.username === username);

    if (!user) {
      console.error('Error: User not found.');
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter new email: ', (newEmail) => {
      rl.question('Enter new phone number: ', (newPhone) => {
        rl.close();

        newEmail = newEmail.trim();
        newPhone = newPhone.trim();

        if (newEmail !== '') {
          user.emails = user.emails || [];
          user.emails.push(newEmail);
        }

        if (newPhone !== '') {
          user.phones = user.phones || [];
          user.phones.push(newPhone);
        }

        const usersData = readDataFile('users.json');
        usersData.users = users;

        writeDataFile('users.json', usersData);

        console.log(`Credentials added successfully for ${username}.`);
      });
    });
  } catch (error) {
    console.error('Error adding user credentials:', error);
  }
};

//allows a user to be displayed from the users file based on the inputted key value
const searchUser = (query) => {
  console.log(`Searching for user: ${query}`);
  try {
    const usersData = readDataFile('users.json');
    const users = usersData.users || {};

    const matchingUsers = Object.entries(users).filter(([key, user]) =>
      Object.values(user).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(query.toLowerCase())
      )
    );

    if (matchingUsers.length === 0) {
      console.log('No users found.');
      return;
    }

    console.log(`Matching users:\n${JSON.stringify(matchingUsers, null, 2)}`);
  } catch (error) {
    console.error('Error searching for user:', error);
  }
};

//exported to cli
module.exports = {
  addDefaultTokens,
  addUserCreds,
  addDefaultUsers,
  generateUserToken,
  getToken,
  searchUser,
  updateUserCreds,
};
