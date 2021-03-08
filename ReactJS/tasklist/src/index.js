import React from 'react';
import ReactDOM from 'react-dom';
import TaskList from './Components/TaskList';
import './CSS/portal.css';

ReactDOM.render(
  <div className="centerDiv">
        <TaskList txtAddPlaceHolder="Enter your task" bntAddText="Add" 
        txtUpdatePlaceHolder="Update task" bntUpdateText="Update" />
    </div>, 
  document.getElementById('root')
);
