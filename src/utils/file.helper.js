var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const fs = require("fs");

exports.writeFile = async (image, filepath, filename) => {
  try {
    if (!fs.existsSync(filepath)) fs.mkdirSync(filepath, { recursive: true });

    let path = `${filepath}/${filename}`;
    image = image?.data ?? image;
    fs.writeFileSync(path, image);
    return path;
  } catch (error) {
    console.error(TAG, error);
    return;
  }
};

exports.readFile = async (filepath) => {
  try {
    if (!fs.existsSync(filepath)) return 1;

    const image = fs.readFileSync(filepath);
    return image;
  } catch (error) {
    console.error(TAG, error);
    return;
  }
};
