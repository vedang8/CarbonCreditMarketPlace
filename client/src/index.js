import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import { ConfigProvider } from "antd";
import Context from './components/Context';
import { Provider, useSelector } from "react-redux";
import store from './redux/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>
      <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#40513B',
            colorPrimaryHover: '#40513B',
            borderRadius: "2px",
            boxShadow: "none",
          },
        },
        token: {
          borderRadius: "2px",
          colorPrimary: "#40513B",
        },
      }}
    >
    <Context>
      <App />
    </Context>  
      
  </ConfigProvider>
  </Provider>
  
);


