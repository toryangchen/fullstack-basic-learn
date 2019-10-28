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
