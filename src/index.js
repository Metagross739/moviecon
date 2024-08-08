import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
   {/* <StarRating maxRating={5} messages={['Poor', 'Decent', 'Okay', 'Good', 'Excellent']} /> 
   <StarRating maxRating={5} size="28px" color="red" />  */}
  </React.StrictMode>
);

