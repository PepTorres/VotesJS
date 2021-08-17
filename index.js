let init = ()=>{
  storage = window.localStorage;


  let hasProjects = !!localStorage.getItem('projects');

  if(hasProjects){
    projects = JSON.parse(storage.getItem('projects'));
  }else{
    storage.setItem('projects',JSON.stringify(projects));
  }

  projects = projects.sort(function(a, b) {return b.votos - a.votos});

  printProjects();
  formVotoInit();
  createGraphic();
}

function printProjects(){
  let projectsTable = document.querySelector('#projectsTableBody');
  projectsTable.innerHTML = ''; //empty

  projects.forEach(p=>{
    let projectRow = createProjectRow(p);
    projectsTable.appendChild(projectRow);
  });

}
function createProjectRow(project){
  const d = document;

  //Text
  let txtClave  = d.createTextNode(project.clave);
  let txtNombre = d.createTextNode(project.nombre);
  let txtVotos = d.createTextNode(project.votos);

  let tr         = d.createElement('tr');
  let tdClave    = d.createElement('td');
  let tdNombre   = d.createElement('td');
  let tdGrafica  = d.createElement('td');
  let tdVotos    = d.createElement('td');

  //Botones, grafica y votos
  let graph = d.createElement('div');
  tdGrafica.style.width = '40%';
  graph.className = 'grafica';
  graph.dataset.graph = project.clave;

  let buttons = d.createElement('div');
  buttons.style.float = 'right'

  let votosDiv = d.createElement('div');
  votosDiv.className = "votosDiv";
  votosDiv.dataset.clave = project.clave;
  votosDiv.appendChild(d.createTextNode(project.votos))

  let buttonAdd = d.createElement('div');
  buttonAdd.className = "button left";
  buttonAdd.addEventListener('click',()=>click_sub(project.clave,votosDiv));
  buttonAdd.appendChild(d.createTextNode("Restar"))

  let buttonSub = d.createElement('div');
  buttonSub.className = "button right";
  buttonSub.addEventListener('click',()=>click_add(project.clave,votosDiv));
  buttonSub.appendChild(d.createTextNode("Sumar"))

  buttons.appendChild(buttonAdd);
  buttons.appendChild(votosDiv);
  buttons.appendChild(buttonSub);
  //fin botones y votos


  tdClave.appendChild(txtClave);
  tdNombre.appendChild(txtNombre);
  tdGrafica.appendChild(graph);
  tdVotos.appendChild(buttons);


  tr.appendChild(tdClave);
  tr.appendChild(tdNombre);
  tr.appendChild(tdGrafica);
  tr.appendChild(tdVotos);

  return tr;
}

function createGraphic(){
  let table = document.getElementById("projectsTableBody");
  let max = projects.sort(function(a,b){return b.votos - a.votos;})[0].votos;


  for (var i = 0; i < table.rows.length; i++) {
    let grafica = table.rows[i].querySelector('.grafica');
    let project = projects.find((p)=>p.clave===grafica.dataset.graph)
    let percent = project.votos / max * 100;
    if(max > 0){
      grafica.style.width = percent  + "%";
      grafica.style.backgroundColor = getColor(1-(percent/100));
    }else{
      grafica.style.width = "0%";
    }

    if(percent > 5){
      grafica.innerHTML = project.votos;
    }else{
      grafica.innerHTML = '';
    }

  }
}

function click_add(clave,votosDiv){
  let project = projects.find(p=>p.clave === clave);
  project.votos++;
  saveProjects()
  votosDiv.innerHTML = project.votos;
  createGraphic();
}
function click_sub(clave,votosDiv){
  let project = projects.find(p=>p.clave === clave);
  if(project.votos > 0){
    project.votos--;
    saveProjects()
    votosDiv.innerHTML = project.votos;
    createGraphic();
  }
}
function saveProjects(){
  storage.setItem('projects',JSON.stringify(projects));
}

function formVotoInit(){
  let input = document.querySelector('#inputNewVoto');
  // Execute a function when the user releases a key on the keyboard
  input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("submitNewVoto").click();
    }
  });

  //Onclick del submit
  document.querySelector("#submitNewVoto").addEventListener('click', ()=>{
    input.value = input.value.toUpperCase();
    input.value = input.value.replace(/^\s+/g, '');
    input.value = input.value.replace('\t','');

    var match = input.value.match('^[0-9]+$');

    if(match){
      input.value =input.value.padStart(3,"0");
      input.value = "PR"+input.value;
    }

    let project = projects.find(p=>p.clave == input.value);

    if(!!project){
      let votosDiv = document.querySelector(`[data-clave="${project.clave}"]`);
      project.votos++;
      saveProjects();
      votosDiv.innerHTML = project.votos;
      createGraphic();
      alert("✅ ✅ ✅ Se agregó un voto al evento " + project.clave + " ✅ ✅ ✅ \n"
            + project.nombre
            + "\nVotos totales: " + project.votos);
    }else{
      alert("❌❌❌ El evento " + input.value + " no existe ❌❌❌");
    }

    input.value='';

  })
}

function getColor(value){
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",50%,80%)"].join("");
}


window.onload = init;
