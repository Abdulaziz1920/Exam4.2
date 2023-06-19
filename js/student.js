const httpsRequestStudents = axios.create({
  baseURL: "https://649044a11e6aa71680caeb2e.mockapi.io/teacher/",
  timeout: 10000,
});
let endp = "https://649044a11e6aa71680caeb2e.mockapi.io/teacher/";
let LIMIT = 8;
let page = 1;
let selected = null;
let search = "";
let nameOrder = "";
let filterMarried = "";

let StudentAdd = document.querySelector(".formsStudentAdd");
let cardStudents = document.querySelector(".main-cards-student");

const query = new URLSearchParams(location.search);
const teacherId = query.get("teacher");

function getStudentCard({
  firstName,
  lastName,
  phoneNumber,
  birthday,
  isWork,
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
        <h4>Birth Date: <span>${birthday}</span></h4>
        <a href="tel:">Phone: <span>${phoneNumber}</span></a>
        <p>He has a wife? <span>${isWork ? "Married" : "Single"}</span></p>
        <div class="card-btn">
          <button formaction="#" class="card_button green" onClick="editor(${id})">Edit</button>
          <button formaction="#" class="card_button blue" onClick="deleteTeachers(${id})">Delete</button>
        </div>
      </div>
    </div>
  </div>
    `;
}

function getStudent() {
  httpsRequestStudents(`${teacherId}/student`).then((res) => {
    let resData = res.data;

    httpsRequestStudents(`teacher?firstName=${search}`).then((res) => {
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
    cardStudents.innerHTML = "";

    resData.forEach((category) => {
      cardStudents.innerHTML += getStudentCard(category);
    });
  });
  // .catch((err) => {
  //   alert(err);
  // });
}

function getPage(p) {
  page = p;
  getStudent();
}

getStudent();

StudentAdd.addEventListener("submit", function (e) {
  e.preventDefault();
  let image = StudentAdd.elements.image.value;
  let FirsName = StudentAdd.elements.FirsName.value;
  let LastName = StudentAdd.elements.LastName.value;
  let Email = StudentAdd.elements.Email.value;
  let phonenumber = StudentAdd.elements.phonenumber.value;
  let data = { image, FirsName, LastName, Email, phonenumber };
  axios.post(endp + StudentAdd, data).then((res) => {
    console.log(res);
  });
});
