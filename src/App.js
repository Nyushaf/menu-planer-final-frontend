import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import deleteIcon from './delete90.png';
import { MyWeek } from './MyWeeks';
import Login from './login';
import Logout from './logout';
import { useAuth0 } from '@auth0/auth0-react';
import { deleteWeek, editUserWeek, getAllUserWeek, saveUserWeek } from './FetchWeek';



function App() {

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [weekId, setWeekId] = useState(null);
  const [weekName, setWeekName] = useState('');
  const [days, setDays] = useState([{ id: uuidv4(), dayName: '', breakfast: '', lunch: '', dinner: '', ingredients: '' }]);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const [userWeek, setUserWeek] = useState([]);
  const userId = user && user.sub ? user.sub.split('|').pop() : '';
  const [editingDayId, setEditingDayId] = useState(null);

  const addDay = () => {
    setDays([...days, { id: uuidv4(), dayName: '', breakfast: '', lunch: '', dinner: '', ingredients: '' }]);
  };

  const handleChange = (id, event) => {
    const { name, value } = event.target;
    setEditingDayId(id);
    const updatedDays = days.map((day) =>
    day.id === editingDayId ? { ...day, [name]: value } : day);
    setDays(updatedDays);
  };

  const removeDay = (id) => {
    const updatedDays = days.filter(day => day.id !== id);
    setDays(updatedDays);
  };

  const checkFields = useCallback(() => {
    if (weekName.trim() === '') return false;
    for (let day of days) {
        if (day.dayName.trim() === '') return false;
    }
    return true;
}, [weekName, days]);

  useEffect(() => {
    setIsSaveEnabled(checkFields());
  }, [weekName, days, checkFields]);

  useEffect(() => {
    console.log(userId);
    getAllUserWeek(userId, setUserWeek)
  }, [userId]);

  const handleSaveWeek = () => {
    saveUserWeek(userId, weekName, days)
      .then(() => {
        getAllUserWeek(userId, setUserWeek);
        setWeekName('');
        setDays([{ id: uuidv4(), dayName: '', breakfast: '', lunch: '', dinner: '', ingredients: '' }]);
        setShowForm(false);
        alert('Week saved');
      })
      .catch((error) => {
        console.error('Error saving week:', error);
        alert('Something went wrong. Try again, please!')
      });
      
  };

  const handleEditWeek = (weekId, weekName, days) => {
    setWeekName(weekName);
    setDays([...days]);
    setEditingDayId(null); 
    setEditing(true);
    setShowForm(true);
    setWeekId(weekId)
  };

  const handleSaveEditedWeek = () => {
    editUserWeek(weekId, weekName, days)
      .then(() => {
        getAllUserWeek(userId, setUserWeek);
        setWeekName('');
        setDays([]);
        setEditing(false);
        setShowForm(false);
        alert('Week edited and saved');
      })
      .catch((error) => {
        console.error('Error editing week:', error);
        alert('Something went wrong. Try again, please!')
      });
  };


  const handleDeleteWeek = (weekId) => {
    console.log('Deleting week with id in handle:', weekId);
    deleteWeek(weekId)
      .then(() => {
        getAllUserWeek(userId, setUserWeek);
      })
      .catch((error) => {
        console.error('Error deleting week:', error);
      });
  };
  
  if (!isAuthenticated) {
    return ( 
      <div>
        <Login />
      </div>
    );
  }

  return (
    <div className="App">
      <Logout />
      <div>
        <div className='header'>
          <h1>Create your meal plan for a week</h1>
        </div>
        <div className='main-container-for-weeks'>
          <div className='weeks'>
            <button onClick={() => setShowForm(true)}>Create new week</button>
            <div>
              <MyWeek userWeek = {userWeek} onDeleteWeek = {handleDeleteWeek} onEditWeek={handleEditWeek}/>
            </div>
          </div>
      {showForm && (
        <div className='form'>
          <div className='delete-icon-position'>
            <img className='delete-icon' onClick={() => setShowForm(false)} src={deleteIcon} alt="delete"width="30px" />
          </div>
          <div className='week-name-container'>
            <label htmlFor="weekName"><span className='important'>*</span>Week: </label>
            <input className='week-name' type="text" id='weekName' value={weekName} onChange={(e) => setWeekName(e.target.value)} placeholder='Week name' />
          </div>
          {days.map((day) => (
          <div key={day.id} className='dayOfTheWeek'>
            <div className='meals'>
            <span className='important'>*</span>
              <select className='dayName' name="dayName" value={day.dayName} onChange={(e) => handleChange(day.id, e)}>
                <option value="">Select a day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <div>
                <label className='lableForAWeek' htmlFor="breakfast">Breakfast</label><br />
                <input className='inputForAWeek' type="text" name="breakfast" value={day.breakfast} onChange={(e) => handleChange(day.id, e)} placeholder='Enter meals' />
              </div>
              <div>
                <label className='lableForAWeek' htmlFor="lunch">Lunch</label><br />
                <input className='inputForAWeek' type="text" name="lunch" value={day.lunch} onChange={(e) => handleChange(day.id, e)} placeholder='Enter meals' />
              </div>
              <div>
                <label className='lableForAWeek' htmlFor="dinner">Dinner</label><br />
                <input className='inputForAWeek' type="text" name="dinner" value={day.dinner} onChange={(e) => handleChange(day.id, e)} placeholder='Enter meals' />
              </div>
              <button onClick={() => removeDay(day.id)}>Remove Day</button>
            </div>
            <div className='ingredients'>
              <label>Ingredients</label>
              <textarea className='textarea' name="ingredients" value={day.ingredients} onChange={(e) => handleChange(day.id, e)} placeholder='Enter ingredients' />
            </div>
          </div>
        ))}
        <div className='header'>
          <button onClick={addDay}>Add Day</button>
        </div>
        <div className='btn-save-container'>
        {editing ? (
                <button onClick={handleSaveEditedWeek}>Save Edited Week</button>
              ) : (
                <button disabled={!isSaveEnabled} onClick={handleSaveWeek}>Save</button>
              )}
        </div>
      </div>
      )}
      <div className='shopping-list-container'>
        <div>
          <div className='header'>
            <h3>Shopping lists</h3>
          </div>
          {userWeek.map((week) => (
      <div key={week._id}>
        <h4>{week.weekName}</h4>
        <ul>
          {week.days.flatMap((day) => day.ingredients.split(',').map((ingredient) => ingredient.trim().toLowerCase())).filter((value, index, self) => value && self.indexOf(value) === index).map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
    ))}
          
        </div>
        
      </div>
      </div>
      
    </div>
    
    
    </div>
  )
}

export default App;
