import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default  {
  entry: path.resolve (__dirname ,"view" , "login.js"), // Arquivo principal do frontend
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
    new CleanWebpackPlugin({

    }), // Limpa a pasta dist antes de cada build

    new HtmlWebpackPlugin({
      template: "./view/index.html", // HTML base do frontend
      filename: "index.html",
    }),

  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000, // Porta do servidor Webpack DevServer
  },

  // resolve:{
  //   alias:{
  //     Inputmask: path.resolve(__dirname , "node_modules/inputmask/dist/inputmask.min.js")
  //   }
  // }
};
