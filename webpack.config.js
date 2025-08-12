import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default  {
  entry: {
    login: path.resolve(__dirname, "view", "login.js"),
    main: path.resolve(__dirname, "view", "screenMain", "main.js"), // Arquivo principal do frontend
  },
  
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    // filename: "[name].bundle.js",
    // filename: "[name].bundle.js"
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    // Gera a página de login
    new HtmlWebpackPlugin({
      template: "./view/index.html",
      filename: "index.html",
      chunks: ["login"], // só inclui login.bundle.js
    }),

    // Gera a SPA principal
    new HtmlWebpackPlugin({
      template: "./view/screenMain/main.html",
      filename: "main.html",
      chunks: ["main"], // só inclui main.bundle.js
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    open: true,
  },

  // resolve:{
  //   alias:{
  //     Inputmask: path.resolve(__dirname , "node_modules/inputmask/dist/inputmask.min.js")
  //   }
  // }
};
