const init = require('./init');
const config = require('./config');
const user = require('./user');

//allows us to get the value of the inputted terminal command
const command = process.argv[2];

//no need to over explain here, this simply sets up the proper functions
//to be ran when the correct command/case is entered in the terminal
if (command === 'help') {
  config.displayHelp();
} else if (command === 'init') {
  const option = process.argv[3];

  switch (option) {
    case '--all':
      init.createFolders();
      init.createFiles();
      break;
    case '--folders':
      init.createFolders();
      break;
    case '--ow':
    case '--overwrite':
      init.overwriteFiles();
      break;
    case '--delete':
    case '--del':
      init.deleteData();
      break;
    default:
      console.log('Please input "node cli init --all" for new users.');
      break;
  }
} else if (command === 'config') {
  const option = process.argv[3];

  switch (option) {
    case '--view':
      config.viewConfig();
      break;
    case '--update':
    case '--upd':
      config.updateConfigValue();
      break;
    case '--delete':
    case '--del':
      config.deleteConfigValue();
      break;
    case '--add':
      config.addConfigValue();
      break;
    case '--reset':
    case '--res':
      config.resetConfig();
      break;

    default:
      console.log('Invalid option for "config"');
      break;
  }
} else if (command === 'user') {
    const option = process.argv[3];
    let username; // Declare the username variable here
    
    switch (option) {
      case '--upd':
      case '--update':
        username = process.argv[4];
        user.updateUserCreds(username);
        break;
        case '--add':
          username = process.argv[4];
          user.addUserCreds(username);
          break;
      case '--search':
        const query = process.argv[4]; // Retrieve the search query from process.argv[4]
        user.searchUser(query);
        break;
      case '--get-token':
        username = process.argv[4];
        if (username) {
          user.getToken(username);
        } else {
          console.log('Incomplete command. Please provide a username to get the token.');
        }
        break;
      default:
        console.log('Invalid subcommand for "user"');
        break;
    }
  }
  


  
