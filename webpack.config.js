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
    
  },
  mode: "development", 
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
          
        },
      },

      {
       test: /\.html$/i,
       loader: "html-loader",
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
  test: /\.(png|jpe?g|gif|svg)$/i,
  type: "asset/resource",
  generator: {
    filename: "img/[name][ext]"
  }
}

    ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: "./view/index.html",
      filename: "index.html",
      chunks: ["login"], 
    }),

    new HtmlWebpackPlugin({
      template: "./view/screenMain/main.html",
      filename: "main.html",
      chunks: ["main"], 
    }),

    
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    open: true,
  },
  resolve: {
  extensions: ['.js', '.json', '.css', '.html']
}

};
