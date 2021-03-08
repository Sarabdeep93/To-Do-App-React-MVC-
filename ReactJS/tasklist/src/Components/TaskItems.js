import React, {Component} from 'react';
import FlipMove from "react-flip-move";
import {RiCloseCircleLine} from 'react-icons/ri';
import {TiEdit} from 'react-icons/ti';
import {FaCheckCircle} from 'react-icons/fa';


class TaskItems extends Component{ 
    render(){
        return(
            <ul className="theList taskForm">
                 <FlipMove duration={250} easing="ease-in-out">
                    {
                    this.props.entries.map(item =>(
                        <li key={item.key}>
                            <div className="dv-task-title">
                                <span className={item.isCompleted ? "itemContent completed" : "itemContent"}>{item.text}</span>
                            </div>
                            <div className="dv-task-icons">
                                <a className="close icons" onClick={() => this.props.deleteData(item.key)}>
                                    <RiCloseCircleLine className="icon-delete" title="Click to delete the task" />
                                </a>

                                <a id="btnEdit" className="close icons" disabled={item.isCompleted ? true : false}  onClick={() => this.props.editTask(item.key, item.text)}>
                                    <TiEdit className="icon-edit" title="Click to edit the task" />
                                </a>

                                <a className="close icons" disabled={item.isCompleted ? true : false} onClick={() => this.props.markComplete(item.key)}>
                                    <FaCheckCircle disabled={item.isCompleted ? true : false} className="icon-complete" title="Click to mark task as completed" />
                                </a>
                            </div>
                        </li>
                    ))}
                 </FlipMove>
            </ul>
        );
    }
}

export default TaskItems;
