const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (req.method === 'GET' && pathname === '/') {
    // Serve the HTML form
    const formPath = path.join(__dirname, 'webpage', 'index.html');
    fs.readFile(formPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'POST' && pathname === '/submit') {
    // Handle form submission
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      // Parse form data
      const formData = querystring.parse(data);

      // Get form field values
      const { username, name, email, phone } = formData;

      // Read the existing users from the users.json file
      const usersFilePath = path.join(__dirname, 'data', 'users.json');
      fs.readFile(usersFilePath, 'utf8', (err, usersContent) => {
        if (err) {
          res.writeHead(500);
          res.end('Internal Server Error');
        } else {
          let users = {};

          try {
            users = JSON.parse(usersContent);
          } catch (error) {
            console.error('Error parsing users.json file:', error);
          }

          // Generate a unique user key
          const userKeys = Object.keys(users.users);
          const lastUserKey = userKeys.length > 0 ? userKeys[userKeys.length - 1] : '';
          const userNumber = Number(lastUserKey.slice(4)) + 1;
          const userKey = `user${userNumber}`;

          // Create a new user object
          const newUser = {
            username,
            name,
            email,
            phone,
          };

          // Add the new user to the existing users object
          users.users[userKey] = newUser;

          // Write the updated users object to the users.json file
          fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
              res.writeHead(500);
              res.end('Internal Server Error');
            } else {
              // Generate a unique token
              const token = generateToken();

              // Create a new token entry
              const newTokenEntry = {
                userId: userKey,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              };

              // Read the existing tokens from the tokens.json file
              const tokensFilePath = path.join(__dirname, 'data', 'tokens.json');
              fs.readFile(tokensFilePath, 'utf8', (err, tokensContent) => {
                if (err) {
                  res.writeHead(500);
                  res.end('Internal Server Error');
                } else {
                  let tokens = {};

                  try {
                    tokens = JSON.parse(tokensContent);
                  } catch (error) {
                    console.error('Error parsing tokens.json file:', error);
                  }

                  // Add the new token entry to the existing tokens object
                  tokens.tokens[token] = newTokenEntry;

                  // Write the updated tokens object to the tokens.json file
                  fs.writeFile(tokensFilePath, JSON.stringify(tokens, null, 2), 'utf8', (err) => {
                    if (err) {
                      res.writeHead(500);
                      res.end('Internal Server Error');
                    } else {
                      // Redirect to the success page with the token in the URL
                      res.writeHead(302, { 'Location': `/success?token=${token}` });
                      res.end();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  } else if (req.method === 'GET' && pathname === '/success') {
    // Serve the success page with the token
    const successPagePath = path.join(__dirname, 'webpage', 'success.html');
    fs.readFile(successPagePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        // Replace the {{token}} placeholder with the token value
        const token = query.token || '';
        const modifiedContent = content.replace('{{token}}', token);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedContent);
      }
    });
  } else {
    // Handle other routes or file types
    const filePath = path.join(__dirname, 'webpage', pathname);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        const extension = path.extname(filePath);
        let contentType = 'text/plain';

        if (extension === '.css') {
          contentType = 'text/css';
        } else if (extension === '.jpg' || extension === '.jpeg') {
          contentType = 'image/jpeg';
        } else if (extension === '.png') {
          contentType = 'image/png';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }
});

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const port = 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});









