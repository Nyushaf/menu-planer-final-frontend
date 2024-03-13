import axios from 'axios';

const myURL= "http://localhost:4000";

const getAllUserWeek = (auth0_id, setUserWeek) => {
    
    axios.get(`${myURL}`, {params: { auth0_id }})
    .then(({data}) => {
        setUserWeek(data);
    })
}

const saveUserWeek = (auth0_id, weekName, days) => {
    return axios.post(`${myURL}/saveWeek`, { auth0_id, weekName, days })
    .then(response => {
        console.log('Week saved:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Error saving week:', error);
        throw error;
    });
}

const deleteWeek = (weekId) => {
    console.log('Deleting week with id:', weekId);
    return axios.post(`${myURL}/deleteWeek`, { weekId })
        .then(response => {
            console.log('Week deleted:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting week:', error);
            throw error;
        });
};

const editUserWeek = (weekId, weekName, days) => {
    return axios.post(`${myURL}/editWeek`, { weekId, weekName, days })
        .then(response => {
            console.log('Week edited:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error editing week:', error);
            throw error;
        });
};

export { getAllUserWeek, saveUserWeek, deleteWeek, editUserWeek };

