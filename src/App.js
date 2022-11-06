import axios from 'axios';
import React, { useEffect, useState } from 'react';

// server https://taskapp-serv.herokuapp.com/

function V2App() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editTaskId, setEditTaskId] = useState(null);


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onLoadAll();
    return () => {
    };
  }, []);

  const onLoadAll = () => {
    setIsLoading(true);
    axios({
      url: 'https://taskapp-serv.herokuapp.com/v1/task/search',
      method: 'POST',
    })
        .then((response) => {
              setTasks(response.data);
            }
        ).catch((err) => {
          console.log(err);
        }
    ).finally(() => {
      setIsLoading(false);
    });

  };

  // create task
  const onCreate = () => {
    setIsLoading(true);
    axios({
      url: 'https://taskapp-serv.herokuapp.com/v1/task',
      method: 'POST',
      data: { title, description },
    })
        .then(() => {
              onLoadAll();
            }
        ).catch((err) => {
      console.log(err);
    })
  };


  const onDelete = (id) => {
    axios({
      url: `https://taskapp-serv.herokuapp.com/v1/task/${id}`,
      method: 'DELETE',
    })
        .then(() => {
              onLoadAll();
            }
        ).catch((err) => {
          console.log(err);
        }
    );
  };

  const onEdit = (task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const onUpdate = () => {
    setIsLoading(true);
    setEditTaskId(null);
    axios({
      url: `https://taskapp-serv.herokuapp.com/v1/task/${editTaskId}`,
      method: 'PATCH',
      data: { title, description },
    })
        .then(() => {
              onLoadAll();
            }
        ).catch((err) => {
          console.log(err);
        }
    );
  };

  // create and edit form
  const taskForm = () => <div>
    <input type="text" placeholder="Title" name="title" value={title}
           onChange={(e) => setTitle(e.target.value)} />
    <input type="text" placeholder="Description" name="description"
           value={description}
           onChange={(e) => setDescription(e.target.value)} />

    <button onClick={() => setEditTaskId(null)}>Cancel</button>

    {editTaskId
        ? <button onClick={onUpdate}>Update</button>
        : <button onClick={onCreate}>Create</button>
    }

  </div>;

  return (
      <div>
        <h1>V2</h1>

        {isLoading
            ? <div>Loading...</div>
            : <>
              <ul>
                {tasks.map((task) => (

                    <li key={task.id}>
                      {editTaskId === task.id
                          ? taskForm()
                          :
                          <>
                            ({task.id}) <strong>{task.title}</strong>{' '}<span>{task.description}</span>
                            <button onClick={() => onDelete(task.id)}>Delete</button>
                            <button onClick={() => onEdit(task)}>Edit</button>
                          </>
                      }
                    </li>
                ))}

              </ul>

              <hr />
              <h4>Create task</h4>
              {taskForm()}
            </>
        }


      </div>
  );
}

export default V2App;
