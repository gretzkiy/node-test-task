let editUserForm = document.getElementById('editUserForm');

editUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let form = event.target;
    let name = form.elements.name.value;
    let age = form.elements.age.value;
    let id = form.elements.id.value;

    if (name !== '' && age !== '') {
        let formData = {
            id,
            name,
            age,
        };
        fetch(`/api/v1/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "PUT",
            body: JSON.stringify(formData),
        })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                console.log(responseData);
                window.location.href = "/users";
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        //    show error
        alert('incorrect data');
    }
});