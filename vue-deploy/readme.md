# Vue项目自动化部署脚本

当前端项目开发完成后，我们需要将项目打包部署到服务器上来通过域名或者IP来访问，一般可以使用一些SSH服务器连接软件如Putty(Win下)、Cyberduck(Mac下)等，将项目打包后的文件拖入nginx对应目录下。但是，如果需要部署的服务器非常多的话，但是这种方式显示比较麻烦。所以，如果有一种使用脚本的方式来将打包好的文件直接部署到文件夹的话，会起到事半功倍的效果；

## 1. 准备

首先，我们需要清楚项目部署需要的几个步骤：
1. 项目打包；
2. 将打包后的文件压缩成zip包；
3. 将zip包上传到服务器对应的nginx目录下；
4. 在服务端将zip包解压；

项目打包是webpack的事情，使用`vue-cli3`构建Vue工程后，执行`npm run build`，项目的跟目录下会出现`dist/`文件夹，该文件夹下的文件就是webpack打包后的文件，即需要部署到服务器中的文件。因此，项目打包这一步我们不需要做任何事情；

部署项目需要依赖几个npm的包：
>$ npm install archiver commander node-ssh zip -D

## 2. 文件压缩脚本

**zip.js**

```javascript
let fs = require('fs')
let path = require('path')
let archiver = require('archiver')
let archive = archiver('zip', {
  zlib: { level: 9 }
})
let program = require('commander')
program
  .version('0.1.0')
  .option('-n, --zipName [value]', 'zip name, default: dist.zip')
  .option('-l, --locolPath [value]', 'local folder path, default: ./')
  .parse(process.argv)

let name = program.zipName ? program.zipName : 'dist.zip'
let locolPath = program.locolPath ? program.locolPath : './'

let output = fs.createWriteStream(path.join(__dirname, `../${name}`))

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes')
  console.log(
    'archiver has been finalized and the output file descriptor has closed.'
  )
})

output.on('end', function() {
  console.log('Data has been drained')
})

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    throw err
  }
})

archive.on('error', function(err) {
  throw err
})

archive.pipe(output)
archive.directory(locolPath, false)

archive.finalize()
```

## 3. 文件部署脚本

**deploy.js**

```javascript
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
```

## 4. 执行脚本

上面两个js文件(`zip.js`和`delpoy.js`)分别是文件压缩和部署的脚本。完成后，我们需要去执行脚本，可以写在`package.json`中：

```json
{
    "name":"",
    "version":"1.0.0",
    "scripts":{
        ...
        "build":"vue-cli-service build",
        "deploy:sit":"vue-cli-service build --mode sit && node ./zip.js -l dist && node ./deploy.js -u http://username:password@host:22/path -l /dist",
    },
    "dependencies":{},
    "devDependencies":{}
}
```

执行`npm run deploy:sit`命令，即可将项目打包部署到服务器中；该命令其实执行了三个脚本：
1. `vue-cli-service build --mode sit` ，webpack打出sit环境的包；
2. `node ./zip.js -l dist`，将打出的包(dist文件夹)，压缩成zip文件，即生成dist.zip文件；
3. `node ./deploy.js -u http://username:password@host:22/path -l /dist`，这里host、username、password分别是具体的服务器的ip、ssh登录用户名和密码，path为nginx的目录；
