const PENDING_KEY = 'userDetails';
const ACCEPTED_KEY = 'accepted-form';
const REJECTED_KEY = 'rejected-form';

let allUserData = JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
const signupForm = document.getElementById('signupForm');
const dataBody = document.getElementById('dataBody');
const totalForm = document.getElementById('totalForm');

function savePending() {
  localStorage.setItem(PENDING_KEY, JSON.stringify(allUserData));
  updateTotal();
}
function updateTotal() {
  totalForm.textContent = 'Total Admission Forms ' + allUserData.length;
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const course = document.getElementById('course').value;
  if (!name || !email || !course) return alert('Please fill all fields.');
  const user = { name, email, course, status: 'Pending' };
  allUserData.push(user);
  savePending();
  signupForm.reset();
  displayData();
  alert('Form submitted successfully!');
});

function addData(key, value) {
  const list = JSON.parse(localStorage.getItem(key)) || [];
  list.push(JSON.parse(JSON.stringify(value)));
  localStorage.setItem(key, JSON.stringify(list));
}

function displayData() {
  dataBody.innerHTML = '';
  allUserData.forEach((item, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = index + 1;
    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    const tdEmail = document.createElement('td');
    tdEmail.textContent = item.email;
    const tdCourse = document.createElement('td');
    tdCourse.textContent = item.course;
    const tdStatus = document.createElement('td');
    tdStatus.textContent = item.status;
    const tdActions = document.createElement('td');

    const btnAccept = document.createElement('button');
    btnAccept.type = 'button';
    btnAccept.className = 'btn-accept';
    btnAccept.dataset.index = index;
    btnAccept.textContent = 'Accept';

    const btnReject = document.createElement('button');
    btnReject.type = 'button';
    btnReject.className = 'btn-reject';
    btnReject.dataset.index = index;
    btnReject.textContent = 'Reject';

    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.className = 'btn-delete';
    btnDelete.dataset.index = index;
    btnDelete.textContent = 'Delete';

    tdActions.append(btnAccept, btnReject, btnDelete);
    tr.append(tdIndex, tdName, tdEmail, tdCourse, tdStatus, tdActions);
    dataBody.appendChild(tr);
  });
  updateTotal();
}

dataBody.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.dataset.index) return;
  const idx = Number(target.dataset.index);

  if (target.classList.contains('btn-accept')) {
    const user = allUserData[idx];
    if (!user) return;
    user.status = 'Accepted';
    addData(ACCEPTED_KEY, user);
    allUserData.splice(idx, 1);
    savePending();
    displayData();
    alert(`${user.name} has been accepted!`);
    return;
  }

  if (target.classList.contains('btn-reject')) {
    const user = allUserData[idx];
    if (!user) return;
    user.status = 'Rejected';
    addData(REJECTED_KEY, user);
    allUserData.splice(idx, 1);
    savePending();
    displayData();
    alert(`${user.name} has been rejected!`);
    return;
  }

  if (target.classList.contains('btn-delete')) {
    if (!confirm('Delete this pending entry?')) return;
    const user = allUserData[idx];
    allUserData.splice(idx, 1);
    savePending();
    displayData();
    alert(`${user?.name || 'Entry'} deleted successfully!`);
    return;
  }
});

// initial render
displayData();
