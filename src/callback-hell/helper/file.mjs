import fs from 'node:fs/promises'; // 파일관리시 권한설정 고려 필요!

export const checkAndMakeDestDir = async (dest) => {
  try {
    const result = await fs.mkdir(dest, { recursive: true });

    return result;
  } catch (err) {
    throw new Error(`resized 디렉토리를 추가할 수 없습니다. \n ${err}`);
  }
};

export const filterResizableFormat = async (filename = '') => {
  const filenameFormatIndex = filename.indexOf('.');
  if (filenameFormatIndex <= 0) {
    throw new Error(`잘못된 이미지 확장자를 가진 파일입니다.(${filename})`);
  }

  const fileFormat = filename.slice(filenameFormatIndex + 1).toLowerCase();
  const gmResizableFormatList = ['jpg', 'jpeg', 'png', 'tiff', 'webp'];
  const result = gmResizableFormatList.includes(fileFormat);

  if (!result) {
    throw new Error(`변경할 수 없는 이미지 확장자 입니다.(${filename})`);
  }

  return { isResizable: result, filename };
};

/**
 * 이미지 resize가 가능한 파일명만을 출력(gm --version으로 체크하여 가장 기본적인 파일만 체크)
 * @param {String} source 파일 체크를 하는 디렉토리명
 * @param {String} dest resize된 파일을 저장할 디렉토리명
 *
 * @return {Array} source 디렉토리에 존재하는 resize 가능한 파일명
 */
const getResizableFilesources = async (source, dest) => {
  // resized 폴더 생성
  try {
    await checkAndMakeDestDir(dest);
  } catch (err) {
    throw new Error(err);
  }
  try {
    const files = await fs.readdir(source);
    const checkedResizableImageFiles = await Promise.allSettled(
      files.map(filterResizableFormat)
    );
    return checkedResizableImageFiles.reduce((acc, { status, value }) => {
      if (status === 'fulfilled' && value.isResizable) {
        acc.push({ source, filename: value.filename });
      }
      return acc;
    }, []);
  } catch (err) {
    throw new Error(`이미지들을 불러올 수 없습니다. \n ${err}`);
  }
};

export default getResizableFilesources;
