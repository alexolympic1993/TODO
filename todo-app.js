(function () {
    //массив с объектами, тут хранятся дела
    listArray = []
    listKey = ''
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title
        return appTitle
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form')
        let input = document.createElement('input')
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = 'Введите название нового дела'
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.textContent = 'Добавить дело'
        button.disabled = true

        input.addEventListener('input', function () {
            if (input.value !== "") {
                button.disabled = false
            } else {
                button.disabled = true
            }
        })

        form.append(input)
        buttonWrapper.append(button)
        form.append(buttonWrapper)

        return {
            form,
            input,
            button
        }
    }

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul')
        list.classList.add('list-group')
        return list

    }

    //создаем дело
    function createTodoitem(obj) {
        let item = document.createElement('li')

        //создаем кнопки готово и удалить
        let buttonGroup = document.createElement('div')
        let doneButton = document.createElement('button')
        let deleteButton = document.createElement('button')

        //добавляем стили для созданного дела
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
        // имя дела - это значение инпута в форме
        item.textContent = obj.name

        buttonGroup.classList.add('btn-group', 'btn-group-sm')
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'

        if(obj.done == true){
            item.classList.add('list-group-item-success')
        }

        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success')
            for (const item of listArray) {
                if (item.id == obj.id) {
                    item.done = !item.done
                } 
                saveList(listArray, listKey)
            }
        })

        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены')) {
                item.remove()

                for (i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) {
                        listArray.splice(i, 1)
                    }
                }
                saveList(listArray, listKey)
            }
    
        })

        buttonGroup.append(doneButton)
        buttonGroup.append(deleteButton)
        item.append(buttonGroup)

        return {
            item,
            doneButton,
            deleteButton
        }
    }

    //присваиваем кажду новому делу свой уникальный id
    function getNewId(arr) {
        let maxId = 0
        for (const item of arr) {
            if (item.id > maxId) {
                maxId = item.id
            }
        }
        return maxId + 1
    }

    //сохраняем деанные в Local Storage
    function saveList(arr, listName){
        localStorage.setItem(listName, JSON.stringify(arr))
    }

    //запуск приложения
    function createTodoApp(container, title = 'Список дел', listName) {

        let todoAppTitle = createAppTitle(title)
        let todoItemForm = createTodoItemForm()
        let todoList = createTodoList()

        container.append(todoAppTitle)
        container.append(todoItemForm.form)
        container.append(todoList)

        listKey = listName

        let localData = localStorage.getItem(listKey)
        if (localData !== null && localData !== '') {
            listArray = JSON.parse(localData)
        }

        for (const itemList of listArray) {
            let todoItem = createTodoitem(itemList)
            todoList.append(todoItem.item)
        }

        //создаем события для формы, после нажатия на которое новое дело появится на экране
        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault()

            //проверяем, что поле ввода не пустое. если пустое, то ничего не делаем
            if (!todoItemForm.input.value) {
                return
            }

            let newItem = {
                name: todoItemForm.input.value,
                done: false,
                id: getNewId(listArray)
            }

            let todoItem = createTodoitem(newItem)
            listArray.push(newItem)

            todoList.append(todoItem.item)
            saveList(listArray, listKey)

            //очищаем текстовое поле в форме и делаем кнопку неактивной 
            todoItemForm.button.disabled = true
            todoItemForm.input.value = ''

        })
    }

    window.createTodoApp = createTodoApp


})()