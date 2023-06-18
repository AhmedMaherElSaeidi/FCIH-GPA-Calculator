const values = {
  grade: ["A+", "A", "B+", "B", "C+", "C", "D+", "D"],
  value: [4, 3.75, 3.4, 3.1, 2.8, 2.5, 2.25, 2],
  hrs: range(6),
};

// METHODS GENERATORS
function genKey() {
  return Math.floor(Math.random() * 1e12 + 1);
}

function range(max, min = 2) {
  const _array = [];
  for (let index = min; index <= max; index++) _array.push(index);

  return _array;
}

// GPA SUBJECT BOX COMPONENT
function removeField(field_id) {
  const field = document.getElementById("field-contents");
  const div = document.getElementById(field_id);

  field.removeChild(div);
  compute();
}

function setGPABoxData(set_id, get_id) {
  const setter = document.getElementById(set_id);
  const getter = document.getElementById(get_id);

  if (getter.value == -1) setter.innerText = "Select Grade";
  else setter.innerText = getter.value;
}

function getGPABoxComponent(container = "field-contents") {
  const field = document.getElementById(container);
  const div = document.createElement("div");
  const key = genKey();

  div.setAttribute("id", `field-subject-${key}`);
  div.setAttribute("class", "field-subject blur-bckground-lightTheme");
  div.innerHTML = `
    <div class="field-subject-screen">
        <p class="fw-bold"><i class="fa-solid fa-inbox"></i> Course Information</p>
        <p class="mb-0"><span class="fw-bold">Grade : </span><span id="setG-${key}"></span></p>
        <p><span class="fw-bold">Hours : </span><span id="setH-${key}"></span></p>
        <hr>
    </div>
    <div class="field-subject-inputs mt-1">
        <select name="array-grades" id="getG-${key}" onchange="setGPABoxData('setG-${key}', 'getG-${key}', 'g')">
            <option value="-1" selected>Grade</option>
            ${values.grade
              .map((value) => `<option value="${value}">${value}</option>`)
              .join("")}
            </select>
        <select name="array-hrs" id="getH-${key}" onchange="setGPABoxData('setH-${key}', 'getH-${key}', 'h')">
            ${values.hrs
              .map(
                (value) =>
                  `<option value="${value}" ${
                    value == 3 ? "selected" : ""
                  }>${value} hrs</option>`
              )
              .join("")}
        </select>
        <button type="button"  onclick="removeField('field-subject-${key}')">
        <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>`;

  field.appendChild(div);
  setGPABoxData(`setG-${key}`, `getG-${key}`);
  setGPABoxData(`setH-${key}`, `getH-${key}`);
  setTheme();
}

// COMPUTING GPA
function toHundredth(number) {
  let decimal = number.toString().split(".");
  if (decimal.length === 1) decimal[1] = "00";
  for (let index = decimal[1].length; index < 2; index++) {
    decimal[1] += "0";
  }

  return decimal.join(".");
}

function checkValidity(gpa, hrs) {
  let validG =
    !(gpa.value >= 0 && gpa.value <= 4) ||
    (isNaN(parseFloat(gpa.value)) && gpa.value !== "")
      ? false
      : true;
  let validT =
    hrs.value < 0 || (isNaN(parseFloat(hrs.value)) && hrs.value !== "")
      ? false
      : true;

  document.getElementById("gpaError").hidden = validG;
  document.getElementById("timeError").hidden = validT;

  return validG && validT;
}

function setProgress(progress) {
  const radialProgress = document.querySelector(".RadialProgress");
  const value = `${progress}%`;
  radialProgress.style.setProperty("--progress", value);
  radialProgress.innerHTML = `<section class="text-center"><span>${value}</span><br/><span style="font-size:.7em;">Cumm. GPA</span></section>`;
  radialProgress.setAttribute("aria-valuenow", value);
}

function compute() {
  const currgpa = document.getElementById("curr-gpa");
  const currhrs = document.getElementById("curr-hrs");

  if (!checkValidity(currgpa, currhrs)) return;

  let pts = parseFloat(currgpa.value) * parseInt(currhrs.value) || 0;
  let hrs = parseInt(currhrs.value) || 0;

  const arrayg = document.getElementsByName("array-grades");
  const arrayh = document.getElementsByName("array-hrs");

  let newpts = 0,
    newhrs = 0;
  arrayg.forEach((grade, index) => {
    const grade_value_index = values.grade.findIndex(
      (val) => val == grade.value
    );
    if (grade_value_index == -1) return;

    let _grade = parseFloat(values.value[grade_value_index]);
    let _hrs = parseFloat(arrayh[index].value);
    newpts += _grade * _hrs;
    newhrs += _hrs;
  });
  pts += newpts;
  hrs += newhrs;

  const gpaStr = "0.00";
  const gpa = Math.round(100 * (pts / hrs)) / 100 || gpaStr;
  document.getElementById("term-gpa").innerText = toHundredth(
    Math.round(100 * (newpts / newhrs)) / 100 || gpaStr
  );
  document.getElementById("new-gpa").innerText = toHundredth(gpa);
  document.getElementById("new-hrs").innerText = hrs;
  setProgress(Math.round((+gpa / 4) * 100 * 100) / 100);
}

// THEME MANIPULATION
const setClass = (newClass, oldClass) => {
  const objects = document.getElementsByClassName(oldClass);
  for (let index = objects.length - 1; index > -1; index--) {
    objects[index].classList.add(newClass);
    objects[index].classList.remove(oldClass);
  }
};

const darkTheme = () => {
  setClass("icon-darkTheme", "icon-lightTheme");
  setClass("background-darkTheme", "background-lightTheme");
  setClass("blur-bckground-darkTheme", "blur-bckground-lightTheme");
  setClass("solid-bckground-darkTheme", "solid-bckground-lightTheme");
  radial = document.querySelector(".RadialProgress").style;
  radial.setProperty("--fill-bg", "#08bbbb");
};

const lightTheme = () => {
  setClass("icon-lightTheme", "icon-darkTheme");
  setClass("background-lightTheme", "background-darkTheme");
  setClass("blur-bckground-lightTheme", "blur-bckground-darkTheme");
  setClass("solid-bckground-lightTheme", "solid-bckground-darkTheme");
  radial = document.querySelector(".RadialProgress").style;
  radial.setProperty("--fill-bg", "#E3C7B9");
};

const getCachedTheme = (bool = null) => {
  const storage_key = "dark-theme";
  const checked = getData(storage_key);

  if (bool !== null) {
    clearData(storage_key);
    setData(storage_key, `1\t${bool || false}`);
  }

  if (!checked.length) setData(storage_key, `1\t${bool || false}`);

  const isChecked = getData(storage_key)[0].isDark;
  document.getElementById("theme-btn").checked = isChecked;

  return isChecked;
};

const setTheme = (that = null) => {
  const checked =
    that === null ? getCachedTheme() : getCachedTheme(that.checked);
  checked ? darkTheme() : lightTheme();
};

//Settings Window
function openSettingsMenu() {
  const isDark = getData("dark-theme")[0].isDark;
  const main = document.getElementById("fields-parent-main");
  const fieldScreen = document.getElementById("field-screen");

  if (main.childElementCount === 5) {
    closeSettingsMenu();
    return;
  }

  const div = document.createElement("section");
  div.setAttribute("id", "field-settings");
  div.setAttribute(
    "class",
    isDark
      ? "field-settings blur-bckground-darkTheme"
      : "field-settings blur-bckground-lightTheme"
  );

  div.innerHTML = `<section>
        <h4><i class="fa-solid fa-screwdriver-wrench"></i> Control Panel</h4>
    </section>
    <section id="field-settings-data">
    ${values.grade
      .map(
        (value, index) =>
          `<section><section>${value} :</section><input type="text" name="array-new-values[]" value="${values.value[index]}"></section>`
      )
      .join("")}
    </section>
    <section id="field-settings-btn">
        <button type="button" class="${
          isDark ? "solid-bckground-darkTheme" : "solid-bckground-lightTheme"
        }" onclick="setSettingsData()"><i class="fa-solid fa-wrench"></i> Apply</button>
        <button type="button" class="${
          isDark ? "solid-bckground-darkTheme" : "solid-bckground-lightTheme"
        }" onclick="resetSettingsData()"><i class="fa-sharp fa-solid fa-rotate-left"></i> Reset</button>
        <button type="button" class="${
          isDark ? "solid-bckground-darkTheme" : "solid-bckground-lightTheme"
        }" onclick="closeSettingsMenu()"><i class="fa-solid fa-xmark"></i> Close</button>
    </section>`;

  main.insertBefore(div, fieldScreen);
}

function setSettingsData() {
  const array_values = document.getElementsByName("array-new-values[]");
  array_values.forEach(
    (element, index) => (values.value[index] = element.value)
  );

  alert("New weights were applied successfully.");
  compute();
  closeSettingsMenu();
}

function resetSettingsData() {
  values.value = [4, 3.75, 3.4, 3.1, 2.8, 2.5, 2.25, 2];
  const div = document.getElementsByName("array-new-values[]");
  div.forEach((element, index) => (element.value = values.value[index]));

  alert("weights were reset successfully.");
  compute();
  closeSettingsMenu();
}

function closeSettingsMenu() {
  const main = document.getElementById("fields-parent-main");
  const settingsMenu = document.getElementById("field-settings");
  main.removeChild(settingsMenu);
}

// LocalStorage Methods.
function setData(storage_key, data_string) {
  const old_data = localStorage.getItem(storage_key);

  if (!old_data) {
    localStorage.setItem(storage_key, data_string);
  } else {
    let new_data = old_data + "\n" + data_string;
    localStorage.setItem(storage_key, new_data);
  }
}

function getData(storage_key) {
  const data = localStorage.getItem(storage_key);

  if (!data) {
    return [];
  } else {
    let content = data.split("\n");
    content = content.map((str) => {
      const row = str.split("\t");
      return { id: +row[0], isDark: row[1] == "false" ? false : true };
    });
    return content;
  }
}

function clearData(storage_key) {
  localStorage.setItem(storage_key, "");
}

// RENDERING METHOD
const render_fieldContents = (elements_count) => {
  for (let count = 0; count < elements_count; count++) getGPABoxComponent();

  setTheme();
  compute();
};
