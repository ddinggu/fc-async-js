import path from 'node:path';

import getResizableFilesources from './helper/file.mjs';
import resizeImage from './helper/gm.mjs';

(async function () {
  const __dirname = path.resolve('./src/callback-hell'); // ES module에서 전역변수에 존재하지 않음
  const source = path.join(__dirname, 'assets');
  const dest = path.join(__dirname, 'resized');

  try {
    const filesources = await getResizableFilesources(source, dest);
    await Promise.all(
      filesources.map((filesource) => {
        return resizeImage(filesource, dest);
      })
    );
  } catch (err) {
    console.error(err);
  }
})();
