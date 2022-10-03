const grades = {
    grade: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
    value: [4, 3.75, 3.4, 3.1, 2.8, 2.5, 2.25, 2, 1]
};

//intiallizing page
for (let index = 0; index < 6; index++)
    addField();
compute();

// Data Calculation
function toHundredth(number) {
    let decimal = number.toString().split('.');
    if (decimal.length === 1) decimal[1] = "00";
    for (let index = decimal[1].length; index < 2; index++) {
        decimal[1] += "0";
    }

    return decimal.join('.');
}

function checkValidity(gpa, hrs) {
    let validG = (!(gpa.value >= 0 && gpa.value <= 4) || (isNaN(parseFloat(gpa.value)) && gpa.value !== "")) ? false : true;
    let validT = (hrs.value < 0 || (isNaN(parseFloat(hrs.value)) && hrs.value !== "")) ? false : true;

    document.getElementById('gpaError').hidden = validG;
    document.getElementById('timeError').hidden = validT;

    return validG && validT;
}

function compute() {
    const currgpa = document.getElementById('curr-gpa');
    const currhrs = document.getElementById('curr-hrs');

    if (!checkValidity(currgpa, currhrs))
        return;

    let pts = (parseFloat(currgpa.value) * parseInt(currhrs.value)) || 0;
    let hrs = parseInt(currhrs.value) || 0;

    const arrayg = document.getElementsByName("array-grades[]");
    const arrayh = document.getElementsByName("array-hrs[]");

    let newpts = 0, newhrs = 0;
    for (let i = 0; i < arrayg.length; i++) {
        if (arrayg[i].value === 'undefined')
            continue;
        let grade = grades.value[grades.grade.indexOf(arrayg[i].value)];
        newpts += parseFloat(grade) * parseFloat(arrayh[i].value);
        newhrs += parseFloat(arrayh[i].value);
    }
    pts += newpts;
    hrs += newhrs;

    const gpaStr = "0.00";
    const gpa = Math.round(100 * (pts / hrs)) / 100;
    document.getElementById('new-gpa').innerText = toHundredth(gpa || gpaStr);
    document.getElementById('new-hrs').innerText = hrs;
    document.getElementById('term-gpa').innerText = toHundredth(Math.round(100 * (newpts / newhrs)) / 100 || gpaStr);
}

// Field Manipulation
function genKey() {
    return Math.floor(Math.random() * 10000 + 1);
}

function addField() {
    const field = document.getElementById('field-contents');
    const div = document.createElement('div');
    const key = genKey();

    div.setAttribute('class', 'field-subject blur-bckground-lightTheme');
    div.innerHTML = `
    <div class="field-subject-div-1">
        <p><i class="fa-solid fa-inbox"></i> Course Data</p>
        <p>Grade : <span id="setG-${key}"></span></p>
        <p>Hours : <span id="setH-${key}"></span></p>
        <hr>
    </div>
    <div class="field-subject-div-2">
        <select name="array-grades[]" class="solid-bckground" id="getG-${key}" onchange="showData('setG-${key}', 'getG-${key}', 'g')">
            <option value="undefined" selected>Grade</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option vaue="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
        </select>
        <select name="array-hrs[]" class="solid-bckground" id="getH-${key}" onchange="showData('setH-${key}', 'getH-${key}', 'h')">
            <option value="2">2 hrs</option>
            <option value="3" selected>3 hrs</option>
            <option value="4">4 hrs</option>
            <option value="5">5 hrs</option>
            <option value="6">6 hrs</option>
            <option value="7">7 hrs</option>
        </select>
        <button type="button" class="solid-bckground" onclick="removeField(this)">
        <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>`;

    field.appendChild(div);
    showData(`setG-${key}`, `getG-${key}`, `g`);
    showData(`setH-${key}`, `getH-${key}`, `h`);
    setTheme(document.getElementById('theme-btn'));
}

function removeField(that) {
    const field = document.getElementById('field-contents');
    field.removeChild(that.parentNode.parentNode);
    compute();
}

function showData(set_id, get_id, type) {
    const setter = document.getElementById(set_id);
    const getter = document.getElementById(get_id);

    const value = (type === 'g') ? `${getter.value} [ ${grades.value[grades.grade.indexOf(getter.value)]} ]` : getter.value;
    setter.innerText = (getter.value !== 'undefined')? value : getter.value;
}


//Theme Manipulation
function setClass(newClass, oldClass) {
    const objects = document.getElementsByClassName(oldClass);
    for (let index = objects.length - 1; index > -1; index--) {
        objects[index].classList.add(newClass);
        objects[index].classList.remove(oldClass);
    }
}

function darkTheme() {
    setClass('icon-darkTheme', 'icon-lightTheme');
    setClass('background-darkTheme', 'background-lightTheme');
    setClass('blur-bckground-darkTheme', 'blur-bckground-lightTheme');
    setClass('solid-bckground-darkTheme', 'solid-bckground-lightTheme');
}

function lightTheme() {
    setClass('icon-lightTheme', 'icon-darkTheme');
    setClass('background-lightTheme', 'background-darkTheme');
    setClass('blur-bckground-lightTheme', 'blur-bckground-darkTheme');
    setClass('solid-bckground-lightTheme', 'solid-bckground-darkTheme');
}

function setTheme(that) {
    (that.checked) ? darkTheme() : lightTheme();
}

//Settings Window
function openMenu() {
    const field = document.getElementById('field-settings');

    if (field.childElementCount === 3) {
        closeMenu();
        return;
    }

    const btn = document.getElementById('field-settings-btn');
    const div = document.createElement('div');
    div.setAttribute('id', 'field-settings-data');

    div.innerHTML = grades.grade.map((value, index) => `<div><strong>${value}</strong> : <input type="text" name="array-new-values[]" value="${grades.value[index]}"></div>`).join('');
    document.getElementById('field-settings').hidden = false;

    field.insertBefore(div, btn);
}

function setData() {
    const array_values = document.getElementsByName("array-new-values[]");
    array_values.forEach((element, index) => grades.value[index] = element.value);
    closeMenu();//grades.value[index]
}

function resetData() {
    grades.value = [4, 3.7, 3.3, 3, 2.7, 2.4, 2.2, 2, 0];
    const div = document.getElementsByName("array-new-values[]");
    div.forEach((element, index) => element.value = grades.value[index]);
}

function closeMenu() {
    document.getElementById('field-settings').hidden = true;
    const field = document.getElementById('field-settings');
    const div = document.getElementById('field-settings-data');
    field.removeChild(div);
}
