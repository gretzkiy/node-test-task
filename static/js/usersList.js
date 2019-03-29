let newUserForm = document.getElementById('newUserForm');

newUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let form = event.target;
    let name = form.elements.name.value;
    let age = form.elements.age.value;
    if (name !== '' && age !== '') {
        let formData = {
            name,
            age,
        };
        fetch("/api/v1/users", {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(formData),
        })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                console.log(responseData);
                form.elements.name.value = '';
                form.elements.age.value = '';
                addNewRow(responseData);
            })
            .catch(error => {
                console.log(error);
            });
    }
});

function addNewRow({ id, name, age }) {
    console.log('adding new row');
    const table = document.getElementById('usersListTable');
    let newRow = table.insertRow(-1);
    newRow.innerHTML = `
        <td class="usersListRow-id">${id}</td>
        <td class="usersListRow-name">${name}</td>
        <td class="usersListRow-age">${age}</td>
        <td class="usersListRow-actions">
            <a href="/users/${id}">Редактировать</a>
            <button id="deleteBtn${id}" onclick="deleteButtonClicked(this, ${id});" class="deleteButton">
                Удалить
            </button>
        </td>
    `
    newRow.className = 'usersListRow-container';
}

function deleteButtonClicked(button, userId) {

    fetch(`/api/v1/users/${userId}`, {
        method: "DELETE",
    })
        .then(response => {
            console.log(response.status);
            button.parentNode.parentNode.remove();
        })
        .catch(error => {
            console.log(error);
        });
}