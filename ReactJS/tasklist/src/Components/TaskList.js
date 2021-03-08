import React, { Component } from 'react';
import TaskItems from './TaskItems';
import '../CSS/TaskList.css';
import axios from 'axios';  

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.bindData = this.bindData.bind(this);
        this.editItem = this.editItem.bind(this);
        this.editTask = this.editTask.bind(this);
        this.markItemComplete = this.markItemComplete.bind(this);
        this.editItemKey = null;
        
        this.state = {
            isUpdate : false,
            items: [
                {
                    text: '',
                    key: null,
                    isCompleted :false
                }
            ]
        }
    }
    
    componentDidMount() {
        try {
            if (!this.state.isUpdate) {
                axios.get('http://localhost:50713/api/Tasks/AllTasks')
                    .then(response => {
                        if(response.statusText.toLocaleLowerCase() === 'ok'){
                            this.bindData(response.data);
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    })  
            }
            
        }
        catch (err) {
            console.error('componentDidMount', err.message);
        }
    }

   bindData(dataArr) {
       debugger;
        try {
            if (dataArr.length > 0) {
                var tasksArr = dataArr.map((task, i) => {
                    let newItem = {
                        text: task.Title,
                        key: task.TaskID,
                        isCompleted: task.IsCompleted
                    };
                    return newItem;
                })
                this.setState({
                    items: tasksArr
                });
            }
        }
        catch (err) {
            console.error('bindData', err.message);
        }
    }

    addItem = e => {
        try {
            if (this.txtTasks.value !== "") {
                axios.post('http://localhost:50713/api/Tasks/AddTask',
                    {
                        Title: this.txtTasks.value.trim()
                    }
                )
                .then(response => {
                    if (response.statusText.toLocaleLowerCase() === 'ok') {
                        let newItem = {
                            text: this.txtTasks.value.trim(),
                            key: response.data,
                            isCompleted: false
                        };
                    
                    this.setState((prevState) => {
                        return {
                            items: prevState.items.concat(newItem)
                        };
                    });
                    this.txtTasks.value = "";
                    }
                })
                .catch(function (error) {
                        console.log(error);
                })
            }
            e.preventDefault();
        }
        catch (err) {
            console.error('addItem', err.message);
        }
    }

    editItem(key, taskTitle) {
        try {
            this.txtEditTask.value = taskTitle;
            this.editItemKey = key;
            this.setState({
                isUpdate: true
            });
        }
        catch (err) {
            console.error('editItem', err.message);
        }
    }

    editTask = e => {
        try {
            e.preventDefault();
            if (this.txtEditTask.value !== "") {
                var key = this.editItemKey;
                var updatedList = this.state.items.map(item => { return { ...item } })
                axios.post('http://localhost:50713/api/Tasks/UpdateTask',
                    {
                        Title: this.txtEditTask.value.trim(),
                        TaskID: key,
                        IsCompleted: updatedList.find(item => item.key === key).isCompleted
                    }
                )
                .then(response => {
                    if (response.statusText.toLocaleLowerCase() === 'ok') {
                        updatedList.find(item => item.key === key).text = this.txtEditTask.value.trim();
                        this.setState({
                            items: updatedList,
                            isUpdate: false
                        });
                        this.txtEditTask.value = "";
                    }
                })
                .catch(function (error) {
                        console.log(error);
                })
            }
        }
        catch (err) {
            console.error('editTask', err.message);
        }
    }

    deleteItem = key => {
        try {
            if (window.confirm("Are you sure you want to delete this task?")) {

                axios.delete('http://localhost:50713/api/Tasks/DeleteTask?taskID='+ key)
                    .then(response => {
                        if(response.statusText.toLocaleLowerCase() === 'ok'){
                            var filteredItems = this.state.items.filter(function (item) {
                                return (item.key !== key);
                            });
                            this.setState({
                                items: filteredItems
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })               
            }
        }
        catch (err) {
            console.error('deleteItem', err.message);
        }
    }

    markItemComplete = key => {
        try {
            if (window.confirm("Are you sure you want to mark this task as complete?")) {
                var modifiedList = this.state.items.map(item => { return { ...item } });
                modifiedList.find(item => item.key === key).isCompleted = true;
                axios.post('http://localhost:50713/api/Tasks/UpdateTask',
                    {
                        Title:  modifiedList.find(item => item.key === key).text,
                        TaskID: key,
                        IsCompleted: modifiedList.find(item => item.key === key).isCompleted
                    }
                )
                .then(response => {
                    if (response.statusText.toLocaleLowerCase() === 'ok') {
                        /*var itemtoMark = this.state.items.filter(function (item) {
                            return (item.key === key);
                        });*/
                        
                        this.setState({
                            items: modifiedList
                        });
                    }
                })
                .catch(function (error) {
                        console.log(error);
                })
            }
        }
        catch (err) {
            console.error('markItemComplete', err.message);
        }
    }

    render() {
       
        return (
            <div className="todoListMain">
                <div className="header">
                    <form className={!this.state.isUpdate ? "taskForm formCenter showForm": "taskForm formCenter hideForm"} onSubmit={this.addItem}>
                        <input type="text" ref={(txtTask) => this.txtTasks = txtTask} placeholder={this.props.txtAddPlaceHolder} />
                        <button type="submit">{this.props.bntAddText}</button>
                    </form>
                    <form className={this.state.isUpdate ? "taskForm formCenter showForm": "taskForm formCenter hideForm"} onSubmit={this.editTask}>
                        <input type="text" ref={(txtEditTask) => this.txtEditTask = txtEditTask} placeholder={this.props.txtUpdatePlaceHolder} />
                        <button type="submit">{this.props.bntUpdateText}</button>
                    </form>
                    {
                        this.state.items.length > 0 && this.state.items[0].key !== null &&
                    <TaskItems entries={this.state.items} deleteData={this.deleteItem} editTask={this.editItem} markComplete={this.markItemComplete}/>
                    }
                    </div>
            </div>

        );
       
    }
}

export default TaskList;