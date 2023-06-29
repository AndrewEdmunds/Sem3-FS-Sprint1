const fs = require('fs');
const config = require('./config');
const user = require('./user');

//This function simply creates the folder structure for the project if none exists
const createFolders = () => {
  console.log('Creating folders...');

  if (fs.existsSync('data')) {
    console.log('Data folder already exists.');
  } else {
    try {
      fs.mkdirSync('data');
      console.log('Data folder created.');
    } catch (error) {
      console.error('Error creating data folder:', error);
      return;
    }
  }

  if (fs.existsSync('config')) {
    console.log('Config folder already exists.');
  } else {
    try {
      fs.mkdirSync('config');
      console.log('Config folder created.');
    } catch (error) {
      console.error('Error creating config folder:', error);
      return;
    }
  }

  console.log('Folder creation complete.');
};

//This function takes the files with their default settings from their files and writes them
//to their respective folders
const createFiles = () => {
    console.log('Creating files...');
    config.addDefaultConfig();
    config.addDefaultHelp();
    user.addDefaultTokens();
    user.addDefaultUsers();
    console.log(`File creation complete.\n`);
    console.log('Input "node cli help" for a list of commands.')
  };

//This function will delete the existing folder structure and replace it with the default
//this was only for testing purposes but I seen no reason to remove it
const overwriteFiles = () => {
  console.log('Overwriting folders and files with default state...');

  try {
    fs.rmSync('data', { recursive: true });
    console.log('Data directory deleted.');
  } catch (error) {
    console.error('Error deleting data directory:', error);
    return;
  }

  try {
    fs.rmSync('config', { recursive: true });
    console.log('Config directory deleted.');
  } catch (error) {
    console.error('Error deleting config directory:', error);
    return;
  }

  createFolders();
  createFiles();

  console.log('Overwriting complete.');
};

//This function will simply reverse the init command
const deleteData = () => {
  console.log('Deleting data...');

  try {
    fs.rmSync('data', { recursive: true });
    console.log('Data directory deleted.');
  } catch (error) {
    console.error('Error deleting data directory:', error);
    return;
  }

  try {
    fs.rmSync('config', { recursive: true });
    console.log('Config directory deleted.');
  } catch (error) {
    console.error('Error deleting config directory:', error);
    return;
  }

  console.log('Data deletion complete.');
};

//The modules are then exported to the file for the cli to be used
module.exports = {
  createFolders,
  createFiles,
  overwriteFiles,
  deleteData
};









