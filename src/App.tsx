import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
// import logo from './logo.svg'
import './App.css'
import InputField from './components/InputField'
import TodoList from './components/TodoList'
import {Todo} from "./model"
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const App: React.FC = () => {
  let subtitle:any;
  const [todo, setTodo] = useState<string>("")
  const [todos, setTodos] = useState<Todo[]>([])
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("Batma")
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [detailAnime, setDetailAnime] = useState<Todo[]>([
    { 
      id:0, 
      todo:"", 
      img:"", 
      desc: "",
      epi: 0,
      genre: "",
      rating: 0,
      isDone:false 
    }
  ])

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()

    if(todo) {
      // setCompletedTodos([...completedTodos, { 
      //   id:Date.now(), 
      //   todo:todo, 
      //   img:"", 
      //   desc: "",
      //   epi: 0,
      //   genre: "",
      //   rating: 0,
      //   isDone:false }])
      setSearch(todo)
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if(!destination) return;
    if(destination.droppableId === source.droppableId && destination.index === source.index) return;

    let add,
    active = todos,
    complete = completedTodos

    if(source.droppableId === 'TodosList') {
      add = active[source.index]
      active.splice(source.index, 1)
    } else {
      add = complete[source.index]
      complete.splice(source.index, 1)
    }

    if(destination.droppableId === 'TodosList') {
      active.splice(destination.index, 0, {...add, isDone: false})
    } else {
      complete.splice(destination.index, 0, {...add, isDone: false})
    }

    setCompletedTodos(complete)
    setTodos(active)
  }

  useEffect(() => {
    async function getToken() {
      var query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (id: $id, search: $search) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          description
          episodes
          genres
          rankings {
            rank
          }
        }
      }
    }
  `;

  var variables = {
    search: search,
    page: page,
    perPage: 10
  }

  var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        })
    };

    const data:any = await (await fetch(url, options)).json()
      setTodos([])
      console.log(data)
      data.data.Page.media.forEach((i:any) => {
        setTodos(todos => [...todos, { 
          id:i.id+(new Date()).getTime(), 
          todo:i.title.romaji, 
          img:i.coverImage.large,
          desc: i.description,
          epi: i.episodes,
          genre: i.genres[0],
          rating: i.rankings.rank,
          isDone:false }])
      })
    };
    getToken();
  }, [page, search])

    const handleNext = () => {
      setPage(page+1)
    };

    const handlePrev = () => {
      if(page>1){
        setPage(page-1)
      }
    };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App pb-3">
        <span className="heading">Anilist</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd}/>
        <TodoList todos={todos} setTodos={setTodos} completedTodos={completedTodos} setCompletedTodos={setCompletedTodos} handlePrev={handlePrev} handleNext={handleNext} page={page} setIsOpen={setIsOpen} setDetailAnime={setDetailAnime}/>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Detail"
        >
          <center>
            <img src={detailAnime[0].img} alt={detailAnime[0].todo} height={"150px"}/>
          </center>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{detailAnime[0].todo}</h2>
          {/* <button onClick={closeModal}>close</button> */}
          <div dangerouslySetInnerHTML={{ __html: detailAnime[0].desc?detailAnime[0].desc:"-" }} />
          <hr/>
          <table className='table'>
            <tr>
              <td>Episodes</td>
              <td>:</td>
              <td>{detailAnime[0].epi?detailAnime[0].epi:"-"}</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>:</td>
              <td>{detailAnime[0].genre?detailAnime[0].genre:"-"}</td>
            </tr>
            <tr>
              <td>Rating</td>
              <td>:</td>
              <td>{detailAnime[0].rating?detailAnime[0].rating:"-"}</td>
            </tr>
          </table>
        </Modal>
      </div>
    </DragDropContext>
  );
}

export default App
