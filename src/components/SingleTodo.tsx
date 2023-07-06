import React, { useState, useRef, useEffect } from 'react'
import './styles.css';
import {Todo} from "../model"
import { AiFillDelete, AiOutlineEye } from "react-icons/ai"
import { Draggable } from 'react-beautiful-dnd';

interface Props {
    index: number
    todo: Todo
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDetailAnime: React.Dispatch<React.SetStateAction<Todo[]>>
    isCollection: boolean
}

const SingleTodo: React.FC<Props> = ({ index, todo, todos, setTodos, setIsOpen, setDetailAnime, isCollection }) => {
    const [edit, setEdit] = useState<boolean>(false)
    const [editTodo, setEditTodo] = useState<string>(todo.todo)

    const handleDone = (id: number) => {
        setDetailAnime([])
        setDetailAnime(
            todos.filter((todo) =>
                todo.id === id
            )
        )
        setIsOpen(true);
    }

    const handleDelete = (id: number) => {
        setTodos(
            todos.filter((todo) =>
                todo.id !== id
            )
        )
    }

    const handleEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault()
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, todo: editTodo } : todo
            )
        )
        setEdit(false)
    }

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [edit])

    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <form 
                    className={`todos__single ${snapshot.isDragging?"drag":""}`}
                    onSubmit={(e) => handleEdit(e, todo.id)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <img src={todo.img} alt={todo.todo} height={"150px"}/>
                    {
                        edit ? (
                            <input 
                                ref={inputRef}
                                className='todos__single--text'
                                value={editTodo} 
                                onChange={(e) => setEditTodo(e.target.value)}
                            />
                        ) : (
                            todo.isDone ? (
                                <s className="todos__single--text">
                                    {todo.todo}
                                </s>
                            ) : (
                                <div className="todos__single--text">
                                    <h2>
                                        {todo.todo}
                                    </h2>
                                    <div>
                                        Genre: {todo.genre?todo.genre:"-"}
                                    </div>
                                    <div>
                                        Episodes: {todo.epi?todo.epi:"-"}
                                    </div>
                                </div>
                            )
                        )
                    }
                    <div className="">
                        {
                            isCollection ? (
                                <span className="icon" onClick={() => handleDelete(todo.id)}>
                                    <AiFillDelete />
                                </span>
                            ) : (
                                <span className="icon"></span>
                            )
                        }
                        
                        <span className="icon" onClick={() => handleDone(todo.id)}>
                            <AiOutlineEye />
                        </span>
                    </div>
                </form>
            )}
        </Draggable>
    )
}

export default SingleTodo