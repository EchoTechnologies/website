const HTMLWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');
const path = require('path');

function render(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.filter(n => n.includes('.')).map(item => {
    const [name, extension] = item.split('.');
    return new HTMLWebpackPlugin({
      title: 'Echo Technologies',
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}

const templates = render(path.join(__dirname, '../templates'));

module.exports = templates;
