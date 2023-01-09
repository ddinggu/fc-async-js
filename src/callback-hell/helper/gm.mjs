import path from 'node:path';
import gm from 'gm';

/**
 *
 * @param {Object} sources assets의 디렉토리와 filename
 * @returns {*} gm으로 read한 State 자신의 값과 사이즈
 */
export const getGMImageSize = (sources) => {
  const { source, filename } = sources;
  const filePath = path.join(source, filename);

  return new Promise((resolve, reject) => {
    gm(filePath).size(function (err, values) {
      if (err) {
        reject(`Error identifying file size: ${err}`);
      } else {
        resolve({ gm_state: this, values });
      }
    });
  });
};

/**
 *
 * @param {gm.State} self resize된 이미지의 gm_state값
 * @param {Number} width resize되는 320, 640, 1024 값 중 하나
 * @param {Sting} filename 이미지 파일명
 * @param {gm.Dimensions} size gm으로 불러온 이미지의 사이즈
 * @returns {gm.State} resize된 gm.State의 정보
 */
export const gmGetResizeImageState = async (self, width, filename, size) => {
  const aspect = size.width / size.height;
  const height = Math.round(width / aspect);
  console.log(`resizing ${filename} to ${height} x ${height}..`);

  // gm의 resize 메소드는 에러값을 출력하지 않으므로, fulfilled 상태로 출력.
  return self.resize(width, height); // return not Promise, gm module States
};

/**
 *
 * @param {gm.State} self resize된 이미지의 gm_state값
 * @param {Number} width resize되는 320, 640, 1024 값 중 하나
 * @param {Sting} filename 이미지 파일명
 * @param {String} dest resize된 사진들을 저장할 디렉토리
 * @returns {Object} resize된 후 결과 메세지를 출력
 */
export const gmWriteImageFile = (self, width, filename, dest) => {
  if (!self.write) {
    console.error('gm 라이브러리의 state 값이 아닙니다!');
    return Promise.reject(
      'self가 gm_state 값이 아니므로 파일을 저장할 수 없습니다!'
    );
  }

  const writeFilePath = path.join(dest, `w${width}_${filename}`);

  return new Promise((resolve, reject) => {
    self.write(writeFilePath, (err) => {
      if (err) {
        reject(`Error writing file: ${err}`);
      }
      resolve({
        result: true,
        msg: `resizing w${width}_${filename} complete!`,
      });
    });
  });
};

/**
 *
 * @param {String} sources assest의 디렉토리
 * @param {String} dest resize된 사진들을 저장할 디렉토리
 * @returns {Promise.allSettled} Promise의 상태값과 gmWriteImageFile 메소드의 결과값
 */
const resizeImage = async (sources, dest) => {
  const widths = [320, 640, 1024];

  try {
    return Promise.allSettled(
      widths.map(async (width) => {
        const { gm_state: self, values } = await getGMImageSize(sources);

        const resizedImageState = await gmGetResizeImageState(
          self,
          width,
          sources.filename,
          values
        );
        const writeResults = await gmWriteImageFile(
          resizedImageState,
          width,
          sources.filename,
          dest
        );

        console.log(writeResults.msg);
      })
    );
  } catch (err) {
    console.error(err);
  }
};

export default resizeImage;
