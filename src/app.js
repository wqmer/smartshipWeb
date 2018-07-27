import React from 'react';
// import {render}from 'react-dom';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import IndexApp from './container/index';
import {AppContainer} from 'react-hot-loader'
import configureStore from './configureStore';
// import { BrowserRouter } from 'react-router-dom';
import './styles/styles.scss';


const store = configureStore();

ReactDOM.render( 
    <AppContainer>
        <Provider store ={store}>
            <IndexApp/>
        </Provider>
    </AppContainer>
,
document.getElementById('app')
);






