const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Arquivo principal do frontend
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  mode: "development", // Mude para "production" quando for lançar o sistema
  module: {
    rules: [
      {
        test: /\.js$/, // Aplica o Babel para arquivos JS
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Limpa a pasta dist antes de cada build
    new HtmlWebpackPlugin({
      template: "./src/index.html", // HTML base do frontend
      filename: "index.html",
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000, // Porta do servidor Webpack DevServer
  },
};
