var path = require('path')
var node_ssh = require('node-ssh')
var ssh = new node_ssh()
const { URL } = require('url')

var program = require('commander')
program
  .version('0.1.0')
  .option('-u, --url [value]', 'http://username:password@host:22/path')
  .option('-l, --locolPath [value]', 'local folder path, default root: ../')
  .parse(process.argv)

var url = new URL(program.url)
console.log(url)

const server = {
  username: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  host: url.hostname,
  port: url.port,
  tryKeyboard: true
}

var ignoreFolders = ['node_modules', 'logs', 'tests']

ssh.connect(server).then(() => {
  const failed = []
  const successful = []
  var localPath = path.join(
    __dirname,
    '../',
    program.locolPath ? program.locolPath : ''
  )
  console.log(`localPath: ${localPath}`)
  ssh
    .putDirectory(localPath, url.pathname, {
      recursive: true,
      concurrency: 1,
      validate: itemPath => {
        const baseName = path.basename(itemPath)
        return (
          baseName.substr(0, 1) !== '.' &&
          ignoreFolders.indexOf(baseName) === -1
        )
      },
      tick: (localPath, removePath, error) => {
        if (error) {
          failed.push(localPath)
        } else {
          successful.push(localPath)
        }
      }
    })
    .then(status => {
      console.log(
        `the directory transfer was ${status ? 'successful' : 'unsuccessful'}`
      )
      console.log('failed transfers:', failed.join('\n'))
      console.log('successful transfers:', successful.length)
      process.exit(0)
    })
    .catch(error => {
      console.log('failed transfers:', error)
      process.exit(0)
    })
})
