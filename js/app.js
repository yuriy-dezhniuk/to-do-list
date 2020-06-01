(function() {
  const objOfTasks = JSON.parse(localStorage.getItem('tasks'))? JSON.parse(localStorage.getItem('tasks')) : {};
  const allTasksBtn = document.querySelector('.all-t-btn');
  const incplTasksBtn = document.querySelector('.inc-t-btn');
  const listGroup = document.querySelector('.list-group');
  const form = document.forms['addTask'];
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  const themeSelect = document.querySelector('#themeSelect');
  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };
  let lastSelectedTheme = 'default';
  
  

  allTasksBtn.addEventListener('click', showAllTasks);
  incplTasksBtn.addEventListener('click', showIncplTasks);
  listGroup.addEventListener('click', markTask);
  listGroup.addEventListener('click', deleteTask);
  form.addEventListener('submit', onFormSubmitHandler);
  themeSelect.addEventListener('change', onThemeSelectHandler);

// write task start
  function getTaskData(tasks) {
    const fragmCplTasks = document.createDocumentFragment();
    const fragmIncplTasks = document.createDocumentFragment();
    allTasksBtn.disabled = true;

    if(Object.keys(tasks).length === 0) {
      writeMsgNoTasks();
      incplTasksBtn.disabled = true;
      return;
    }

    incplTasksBtn.disabled = false;

    for(key in tasks) {
      if(!tasks[key].completed) {
        const li = createTaskElem(tasks[key]);
        fragmIncplTasks.insertBefore(li, fragmIncplTasks.firstElementChild);
      }
    }

    for(key in tasks) {
      if(tasks[key].completed) {
        const li = createTaskElem(tasks[key]);
        fragmCplTasks.insertBefore(li, fragmCplTasks.firstElementChild);
      }
    }

    listGroup.appendChild(fragmIncplTasks);
    listGroup.appendChild(fragmCplTasks);
  }

  function createTaskElem(task) {
    const li = document.createElement('li');
    const title = document.createElement('h4');
    const delTaskBtn = createDelBtn('Delete');
    const doneBtn = createDoneBtn(`${task.completed ? 'Mark as failed' : 'Mark as done'}`); 
    const taskBody = document.createElement('p');

    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-4',
    );
    li.setAttribute('data-task-id', `${task._id}`);
    li.style.backgroundColor = task.completed ? '#00BFFF' : '';


    title.textContent = task.title;
    taskBody.classList.add('mt-2', 'w-100');
    taskBody.textContent = task.body;
    
    li.appendChild(title);
    li.appendChild(taskBody);
    li.appendChild(delTaskBtn);
    li.appendChild(doneBtn);

    return li;
  }
// write task end

  function createDelBtn(txtCont) {
    let btn = document.createElement('button');
    btn.classList.add(
      'btn',
      'btn-danger',
      'ml-auto',
      'delete-btn',
    );
    btn.textContent = txtCont;
    return btn;
  }

  function createDoneBtn(txtCont) {
    let btn = document.createElement('button');
    btn.classList.add(
      'btn',
      'btn-primary',
      'done-btn',
    );
    btn.style.marginLeft = '15px';
    btn.textContent = txtCont;
    return btn;
  }
// delete task start
  function deleteTask(e) {
    if(!e.target.classList.contains('delete-btn')) return;
    const taskId = e.target.parentElement.getAttribute('data-task-id');
    let confirmDeleting = window.confirm(`Do you want to delete the task: ${objOfTasks[taskId].title}`); 

    if(confirmDeleting) {
      delete objOfTasks[taskId];
      writeLStorg(objOfTasks)
      listGroup.removeChild(e.target.parentElement);
  
      if(Object.keys(objOfTasks).length === 0) {
        writeMsgNoTasks();
        incplTasksBtn.disabled = true;
        allTasksBtn.disabled = true;          
      } else if(Object.keys(objOfTasks).length !== 0 && incplTasksBtn.disabled && listGroup.children.length === 0) {
        showIncplTasks(e);
      }
    }
  }
// delete task end

//Mark task as done start
  function markTask(e) {
    if(!e.target.classList.contains('done-btn')) return;
    const taskId = e.target.parentElement.getAttribute('data-task-id');

    if(!objOfTasks[taskId].completed) {
      objOfTasks[taskId].completed = true;
      writeLStorg(objOfTasks);
      e.target.parentElement.style.backgroundColor = '#00BFFF';
      e.target.textContent = 'Mark as failed';

      if(incplTasksBtn.disabled) {
        e.target.parentElement.remove();
        if(listGroup.children.length === 0) showIncplTasks(e);
      }

    } else {
      objOfTasks[taskId].completed = false;
      writeLStorg(objOfTasks);
      e.target.parentElement.style.backgroundColor = '';
      e.target.textContent = 'Mark as done';
    }

    if(allTasksBtn.disabled) {
      listGroup.innerHTML = '';
      getTaskData(objOfTasks);
    }
  }
//Mark task as done start

//add new task start
  function onFormSubmitHandler(e) {
    e.preventDefault();
    const inputTitleValue = inputTitle.value;
    const inputBodyValue = inputBody.value;

    if(!inputTitleValue || !inputBodyValue) {
      alert('Fill in the field "Task title" and "Task body"');
      return;
    }
    
    const taskObj = createTaskObj(inputTitleValue, inputBodyValue);
    const taskLi = createTaskElem(taskObj);

    if(Object.keys(objOfTasks).length === 0 || listGroup.children[0].classList.contains('msg')) { 
      listGroup.removeChild(listGroup.firstElementChild);
      incplTasksBtn.disabled = false;
      allTasksBtn.disabled = false;
    }

    objOfTasks[taskObj._id] = taskObj;

    writeLStorg(objOfTasks);

    listGroup.insertAdjacentElement('afterbegin', taskLi);
    inputTitle.value = '';
    inputBody.value = '';
  }

  function writeLStorg(tasksObj) {
    let tasks = JSON.stringify(tasksObj);
    localStorage.setItem('tasks', tasks);
  }

  function createTaskObj(title, body) {
    return {
      _id: generateTaskId(),
      completed: false,
      body,
      title,
    };
  }

  function generateTaskId() {
    return `task-${(+new Date).toString(16)}`;
  }
//add new task end

  function writeMsgNoTasks() {
    const li = document.createElement('li');
    li.textContent = 'You have no tasks';
    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-4',
    );
    listGroup.insertAdjacentElement('afterbegin', li);
  }

  function showIncplTasks(e) {
    const fragment = document.createDocumentFragment();

    listGroup.innerHTML = '';

    for(key in objOfTasks) { 
      if(!objOfTasks[key].completed) {
        fragment.insertBefore(createTaskElem(objOfTasks[key]), fragment.firstElementChild);
      }
    }

    if(fragment.children.length === 0) {
      const li = document.createElement('li'); 
      li.classList.add(
        'list-group-item',
        'd-flex',
        'align-items-center',
        'flex-wrap',
        'mt-4',
        'msg',
      );
      li.textContent = 'You have no incomplete tasks';
      fragment.appendChild(li);
    }

    listGroup.appendChild(fragment);
    e.target.disabled = true;
    allTasksBtn.disabled = false;
  }

  function showAllTasks() {
    listGroup.innerHTML = '';
    getTaskData(objOfTasks);
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(`Do you want to change theme: ${selectedTheme}?`);
    if(!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
  }

  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) =>{
      document.documentElement.style.setProperty(key, value);
    });
    
  }

  getTaskData(objOfTasks);
})();
