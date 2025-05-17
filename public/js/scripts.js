document.addEventListener('DOMContentLoaded', function() {
    const createPresentationForm = document.getElementById('create-presentation-form');
    const presentationList = document.getElementById('presentation-list');

    if (createPresentationForm) {
        createPresentationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(createPresentationForm);
            const slidesContent = formData.get('slides');

            fetch('/presentations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: slidesContent }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Presentation created successfully!');
                    createPresentationForm.reset();
                } else {
                    alert('Error creating presentation: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    if (presentationList) {
        fetch('/presentations')
            .then(response => response.json())
            .then(data => {
                data.presentations.forEach(presentation => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="/presentations/${presentation.id}">${presentation.title}</a>`;
                    presentationList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching presentations:', error);
            });
    }
});