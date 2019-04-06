const fs = require('fs');
const cheerio = require('cheerio');

const staticDependencies = [
  {
    from: 'app/images',
    to: 'images',
  },
  {
    from: 'app/dashkit',
    to: 'dashkit',
  },
  {
    from: 'app/fonts',
    to: 'fonts',
  },
];
const IndexPageHTML = fs.readFileSync('app/index.html', {
  encoding: 'utf-8',
});
const DOMTree = cheerio.load(IndexPageHTML);

const getAllNodeModuleSources = (selectedDOMElements) => {
  const attributes = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const DOMelement of selectedDOMElements) {
    // eslint-disable-next-line new-cap
    const elements = Object.values(DOMTree(DOMelement.tag)).filter((elem) => elem.namespace);
    elements.forEach((elem) => attributes.push(elem.attribs[DOMelement.attribute]));
  }
  return attributes;
};

const tagsWithSourcesOfDependencies = [
  {
    tag: "link[rel='stylesheet']",
    attribute: 'href',
  },
  {
    tag: 'script[src]',
    attribute: 'src',
  },
];
const appNodeModuleDependencies = getAllNodeModuleSources(tagsWithSourcesOfDependencies);
const allStaticDependencies = staticDependencies.concat(
  // prettier-ignore
  appNodeModuleDependencies.filter(dep => dep.indexOf('node_modules') > -1).map((dep) => {
    const [, nodeModulePackage] = dep.split('/');
    const extensions = /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|css|js)$/;
    return {
      from: `node_modules/${nodeModulePackage}/**/*`,
      to: 'dashkit',
      test: extensions,
      cache: true,
      ignore: ['*.scss', '*.sass'],
    };
  })
);

module.exports = allStaticDependencies;
