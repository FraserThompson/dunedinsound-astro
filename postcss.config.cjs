const postcssGlobalData = require("@csstools/postcss-global-data");

module.exports = {
  plugins: [
    postcssGlobalData({
      files: ["./src/assets/media.css"],
    }),
    require("autoprefixer"),
    require("cssnano"),
    require("postcss-custom-media"),
    require("postcss-nesting"),
  ],
};
