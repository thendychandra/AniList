import React from 'react'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Todo} from "../model"
import SingleTodo from './SingleTodo'
import { Droppable } from 'react-beautiful-dnd'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"

interface Props {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
    completedTodos: Todo[]
    setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>
    handleNext: () => void
    handlePrev: () => void
    page: number
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDetailAnime: React.Dispatch<React.SetStateAction<Todo[]>>
}

const TodoList: React.FC<Props> = ({ todos, setTodos, completedTodos, setCompletedTodos, handlePrev, handleNext, page, setIsOpen, setDetailAnime }) => {
    // console.log(todos)
    return (
        <div className="container">
            <Droppable droppableId='TodosList'>
                {(provided, snapshot) => (
                    <div 
                        className={`todos ${snapshot.isDraggingOver?"dragactive":""}`} 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                    >
                        <div className="d-flex justify-content-between">
                            <span className="todos__heading">
                                List Anime
                            </span>
                            <div className="">
                                {
                                    page>1 ? (
                                        <span className="pn" onClick={() => handlePrev() }>
                                            <AiOutlineLeft />
                                        </span>
                                    ) : (
                                        <span className="pn" style={{cursor:'not-allowed'}}>
                                            <AiOutlineLeft />
                                        </span>
                                    )
                                }
                                <span className="d-inline w-10 px-2">Page : { page }</span>
                                <span className="pn" onClick={() => handleNext() }>
                                    <AiOutlineRight />
                                </span>
                            </div>
                        </div>
                        {todos.map((todo, index)=>(
                            <SingleTodo index={index} todo={todo} key={todo.id} todos={todos} setTodos={setTodos} setIsOpen={setIsOpen} setDetailAnime={setDetailAnime} isCollection={false}/>
                            
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId='TodosRemove'>
                {(provided, snapshot) => (
                    <div 
                    className={`todos remove ${snapshot.isDraggingOver?"dragcomplete":""}`}
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                    >
                        <span className="todos__heading">
                            Collection (Drag here to add collection)
                        </span>
                        {completedTodos.map((todo, index)=>(
                            <SingleTodo index={index} todo={todo} key={todo.id} todos={completedTodos} setTodos={setCompletedTodos} setIsOpen={setIsOpen} setDetailAnime={setDetailAnime}isCollection={true}/>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            
            
        </div>
        // <div className="todos">
        //     {todos.map(todo=>(
        //         <SingleTodo todo={todo} key={todo.id} todos={todos} setTodos={setTodos}/>
        //     ))}
        // </div>
    )
}

export default TodoList