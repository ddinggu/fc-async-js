const fs = require('fs');
const path = require('path');
const gm = require('gm');

const source = path.join(__dirname, 'assets');
const dest = path.join(__dirname, 'resized');
const widths = [320, 640, 1024];

fs.readdir(source, (err, files) => {
  if (err) {
    console.log(`Error finding files: ${err}`);
    return;
  } else {
    fs.mkdir(dest, { recursive: true }, () => {
      files.forEach(resize);
    });
  }
});

function resize(filename) {
  console.log(filename);
  if (!filename.startsWith('.')) {
    gm(path.join(source, filename)).size(function (err, values) {
      if (err) {
        console.log(`Error identifying file size: ${err}`);
        return;
      } else {
        console.log(`${filename} : ${values}`);

        const self = this;
        widths.forEach(function (width) {
          const resizedImage = resizeImage(width, filename, values, self);
          gmWriteImageFile(resizedImage, filename, width);
        });
      }
    });
  }
}

function resizeImage(width, filename, size, self) {
  const aspect = size.width / size.height;
  const height = Math.round(width / aspect);
  console.log(`resizing ${filename} to ${height} x ${height}..`);

  return self.resize(width, height); // return not Promise, gm module States.
}

function gmWriteImageFile(gm_state, filename, width = '') {
  if (!gm_state.write) {
    console.error('gm 라이브러리의 state 값이 아닙니다!');
    return;
  }

  const writeFilePath = path.join(dest, `w${width}_${filename}`);
  gm_state.write(writeFilePath, (err) => {
    if (err) console.error(`Error writing file: ${err}`);
  }); // return void
}

// function isGMResizableFormat(filename) {
//   const gmResizableFormatList = ['jpg', 'jpeg', 'png', 'tiff', 'webp'];

//   return gmResizableFormatList.includes(filename);
// }
