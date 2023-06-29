const fs = require('fs');
const readline = require('readline');

//this function simply adds the defaultConfig file and writes its contents to it
const addDefaultConfig = () => {
  if (fs.existsSync('config/default.json')) {
    console.log('Default configuration file already exists.');
    return;
  }

  const defaultConfig = {
    name: 'SprintCLI',
    version: '1.0.0',
    description: 'The Command Line Interface (CLI) for the sprint project.',
    main: 'cli.js',
    database: 'none'
  };

  try {
    fs.writeFileSync('config/default.json', JSON.stringify(defaultConfig, null, 2));
    console.log('Default configuration file added.');
  } catch (error) {
    console.error('Error adding default configuration file:', error);
  }
};


const defaultHelp = `
node cli <command> <option>

Usage:

cli help                                          displays all commands
cli init --all                                    creates the folder structure and config file (recommended)
cli init --folders                                creates only the folder structure
cli init --ow
cli init --overwrite                              overwrites current folders/files with default contents         
cli init --delete                                 deletes all data
cli config --view                                 displays a list of the current config settings
cli config --update                               updates a selected config value
cli config --add                                  adds a new config value
cli config --reset                                resets the config file to default settings
cli user --update <username>                      updates user credentials
cli user --add <username> <email> <phoneNumber>   adds new user credentials
cli user --search <query>                         searches for a user
cli user --get-token <username>                   retrieves the token for an associated user
`;

//Same as addDefaultConfig but for the help file
const addDefaultHelp = () => {
  if (fs.existsSync('config/help.txt')) {
    console.log('Default help file already exists.');
    return;
  }

  try {
    fs.writeFileSync('config/help.txt', defaultHelp);
    console.log('Default help file added.');
  } catch (error) {
    console.error('Error adding default help file:', error);
  }
};

//displays the help file in terminal
const displayHelp = () => {
  console.log(defaultHelp);
};

//reads then displays the current config file
const viewConfig = () => {
  console.log('Viewing configuration...');
  try {
    const config = fs.readFileSync('config/default.json', 'utf8');
    console.log('Default Configuration:');
    console.log(config);
  } catch (error) {
    console.error('Error reading configuration:', error);
  }
};

//updates a key value pair one at a time. Uses readline to take input
const updateConfigValue = () => {
  console.log('Updating configuration value:');
  try {
    const configPath = 'config/default.json';
    const config = JSON.parse(fs.readFileSync(configPath));
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the key you want to update: ', (key) => {
      if (config.hasOwnProperty(key)) {
        rl.question('Enter the new value: ', (value) => {
          config[key] = value;
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          console.log(`Configuration value for key '${key}' updated successfully.`);
          rl.close();
        });
      } else {
        console.log(`Key '${key}' does not exist in the configuration.`);
        rl.close();
      }
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
  }
};

//adds a new key value pair to the config file
const addConfigValue = () => {
  console.log('Adding new configuration value:');
  try {
    const configPath = 'config/default.json';
    const config = JSON.parse(fs.readFileSync(configPath));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the new key: ', (key) => {
      if (config.hasOwnProperty(key)) {
        console.log(`Key '${key}' already exists in the configuration.`);
        rl.close();
      } else {
        rl.question('Enter the value: ', (value) => {
          config[key] = value;
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          console.log(`New configuration value for key '${key}' added successfully.`);
          rl.close();
        });
      }
    });
  } catch (error) {
    console.error('Error adding configuration value:', error);
  }
};

//deletes a key value pair from the config file
const deleteConfigValue = () => {
  console.log('Deleting configuration value:');
  try {
    const configPath = 'config/default.json';
    const config = JSON.parse(fs.readFileSync(configPath));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the key you want to delete: ', (key) => {
      if (config.hasOwnProperty(key)) {
        delete config[key];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`Configuration value for key '${key}' deleted successfully.`);
        rl.close();
      } else {
        console.log(`Key '${key}' does not exist in the configuration.`);
        rl.close();
      }
    });
  } catch (error) {
    console.error('Error deleting configuration value:', error);
  }
};

//resets the config file individually to its default state
const resetConfig = () => {
  console.log('Resetting configuration...');
  try {
    const configPath = 'config/default.json';
    const defaultConfig = JSON.parse(fs.readFileSync(configPath));

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));

    console.log('Configuration reset successfully.');
  } catch (error) {
    console.error('Error resetting configuration:', error);
  }
};

//exports to be used in cli 
module.exports = {
  addDefaultConfig,
  addDefaultHelp,
  displayHelp,
  viewConfig,
  updateConfigValue,
  addConfigValue,
  deleteConfigValue,
  resetConfig,
};

