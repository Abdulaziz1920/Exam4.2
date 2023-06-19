let mainGetCards = document.querySelector(".main-cards");
let teacherAdd = document.querySelector(".formsTeacherAdd");
let editTeachersApi = document.querySelector("#btn");
let addTitle = document.querySelector(".addTitle");
let searchTeachers = document.querySelector("#search");
let pagionation = document.querySelector(".pagination");
let sorting = document.querySelector("#sorting");
let isMarriedFiltering = document.querySelector("#select");

let apiElements = teacherAdd.elements;
let LIMIT = 8;
let page = 1;
let selected = null;
let search = "";
let nameOrder = "";
let filterMarried = "";

const httpsRequest = axios.create({
  baseURL: "https://649044a11e6aa71680caeb2e.mockapi.io/",
  timeout: 10000,
});

function getMainCards({
  firstName,
  lastName,
  phoneNumber,
  email,
  isMarried,
  avatar,
  id,
}) {
  return `
  <div class="card">
  <div class="card__content">
    <img class="avatar" src="${avatar}" alt="" />
    <div class="card__title">
      <h1>FirstName: <span>${firstName}</span></h1>
      <h4>LastName: <span>${lastName}</span></h4>
      <h4>Email: <span>${email}</span></h4>
      <a href="tel:">Phone: <span>${phoneNumber}</span></a>
      <p>He has a wife?: <span>${isMarried ? "Married" : "Single"}</span></p>
      <div class="card-btn">
        <button formaction="#" class="card_button green" onClick="editor(${id})">Edit</button>
        <button formaction="#" class="card_button blue" onClick="deleteTeachers(${id})">Delete</button>
        <a href="student.html?teacher=${id}" class="card_button red">See students</a>
      </div>
    </div>
  </div>
</div>
  `;
}

function getTeachers() {
  httpsRequest(
    `teacher?page=${page}&limit=${LIMIT}&firstName=${search}&sortBy=firstName&order=${nameOrder}`
  ).then((res) => {
    let resData = res.data;

    httpsRequest(`teacher?firstName=${search}`).then((res) => {
      let pages;

      pages = Math.ceil(res.data.length / LIMIT);

      if (pages > 1) {
        pagionation.innerHTML = `<li class="page-item" ><button class="page-link prev"><ion-icon class="nxt"><i class="fa-solid fa-angles-left"></i></ion-icon></button></li>`;

        for (let i = 1; i <= pages; i++) {
          pagionation.innerHTML += `<li class="page-item   ${
            i == page ? "active" : ""
          }"><button onClick="getPage(${i})"  class="page-link center">${i}</button></li>`;
        }

        pagionation.innerHTML += `<li class="page-item"><button class="page-link next"><ion-icon class="nxt" ><i class="fa-solid fa-angles-right"></i></ion-icon></button></li>`;
      } else {
        pagionation.innerHTML = "";
      }
    });
    mainGetCards.innerHTML = "";

    resData.forEach((category) => {
      mainGetCards.innerHTML += getMainCards(category);
    });
  });
  // .catch((err) => {
  //   alert(err);
  // });
}

function getPage(p) {
  page = p;
  getTeachers();
}

getTeachers();

sorting.addEventListener("change", function () {
  let result = sorting.value;
  console.log(result);
  nameOrder = result === "asc" ? "asc" : result === "desc" ? "desc" : "";
  getTeachers();
});
getTeachers();

isMarriedFiltering.addEventListener("change", function () {
  let selectedValue = isMarriedFiltering.value;
  console.log(selectedValue);
  filterMarried =
    selectedValue === "Married"
      ? true
      : selectedValue === "Single"
      ? false
      : "";
  getTeachers();
});
getTeachers();

teacherAdd.addEventListener("submit", function (e) {
  e.preventDefault();
  let firstName = apiElements.FirsName.value;
  let lastName = apiElements.LastName.value;
  let email = apiElements.Email.value;
  let phoneNumber = apiElements.phonenumber.value;
  let avatar = apiElements.image.value;
  let data = { firstName, lastName, email, phoneNumber, avatar };
  if (!selected) {
    httpsRequest.post("teacher", data).then((res) => {
      getTeachers();
    });
  } else {
    httpsRequest.put(`teacher/${selected}`, data).then((res) => {
      getTeachers();
    });
  }
});

async function editor(id) {
  show();
  let editTeachers = await httpsRequest(`teacher/${id}`);
  selected = id;
  console.log(editTeachers.data);
  apiElements.image.value = editTeachers.data.avatar;
  apiElements.FirsName.value = editTeachers.data.firstName;
  apiElements.LastName.value = editTeachers.data.lastName;
  apiElements.Email.value = editTeachers.data.email;
  apiElements.phonenumber.value = editTeachers.data.phoneNumber;
  editTeachersApi.value = "Change teachers";
  getTeachers();
  selected === null;
}

addTitle.addEventListener("click", function () {
  editTeachersApi.value = "Add teachers";
  selected === null;
});

async function deleteTeachers(id) {
  let check = confirm("Do you want to remove this teacher?");
  if (check) {
    await httpsRequest.delete(`teacher/${id}`);
    getTeachers();
  }
}

searchTeachers.addEventListener("keyup", function () {
  search = this.value;
  getTeachers();
});
