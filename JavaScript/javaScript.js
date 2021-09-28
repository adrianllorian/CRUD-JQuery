/*        BASE DE DATOS       */

var cliente = {
  nombre: "",
  apellido: "",
  correo: "",
  fecha: ""
};


var tabla = document.getElementById("tabla");



function recibirFormulario() {

  //Nuevo con Adri
  var x = location.search;
  var params = new URLSearchParams(x.slice(1));

  cliente.nombre = params.get("nombre");

  cliente.apellido = params.get("apellido");

  cliente.correo = params.get("correo");

  cliente.fecha = params.get("fecha");



  if (params.get("nombre") != null) {
    if (cliente.nombre != "") {
      add();
    }

  }

  download();
}



function crear() {

  var baseDatos = indexedDB.open("Clientes", 1);
  baseDatos.onupgradeneeded = function () {
    var abrir_DB = baseDatos.result;
    var objectStore = abrir_DB.createObjectStore("Clientes", {
      keyPath: "id",
      autoIncrement: true
    });
    // Guarda los datos en el almacén recién creado.

    //añadiendo un cliente


  }; //fin
}



function add() {

  var db;

  // Abrimos nuestra base de datos:
  var DBOpenRequest = window.indexedDB.open("Clientes", 1);

  DBOpenRequest.onsuccess = function (event) {

    // almacenar el resultado de la apertura de la base de datos en la variable db. Esto es bastante usado más abajo:
    db = DBOpenRequest.result;

    // ejecutar la función displayData() para popular la lista de tareas con los datos "to-do" que existen actualmente en la Base de Datos Indizada (IDB):
    //displayData();



    // abrir una transacción lectura/escritura, lista para añadir los datos:
    var transaction = db.transaction(['Clientes'], "readwrite");



    // después deberías continuar y hacerle algo a esta base de datos a través del almacén de objetos:
    var objectStore = transaction.objectStore("Clientes");
    // etc.



    objectStore.add(cliente);


    //////////////////////////////////////
    //datos.request = function(e){


    //}

    //////////////////////////////
    //request.onerror = function(e){
    //  alert(request.error.name + "\n\n" + //request.error.message);
    //}
  };

}


function download() {

  // Abrimos nuestra base de datos:
  var dbOpenRequest = indexedDB.open("Clientes");

  var transaction;
  dbOpenRequest.onsuccess = function (event) {


    // almacenar el resultado de la apertura de la base de datos en la variable thisdb. Esto es bastante usado más abajo:
    var thisDB = dbOpenRequest.result;

    // abrir una transacción lectura/escritura, lista para añadir los datos:
    transaction = thisDB.transaction(["Clientes"], "readonly");

    // después deberías continuar y hacerle algo a esta base de datos a través del almacén de objetos:
    var objectStore = transaction.objectStore("Clientes");


    //request cursor on the object store
    var request = objectStore.openCursor();
    var count = 0;
    request.onsuccess = function (event) {
      //El cursor contiene los datos funciona como un 
      //fucle for each;
      var cursor = event.target.result;
      if (cursor) {

        //Saco una prueba por el log
        console.log('id = ' + cursor.key + ' is ' + cursor.value.nombre + cursor.value.apellido);



        //Creo una fila para la tabla
        var fila = "<tr id=\"" + cursor.key + "\"><td>" +
          cursor.key + "</td><td>" + cursor.value.nombre + "</td><td>" + cursor.value.apellido + "</td><td>" +
          cursor.value.correo + "</td><td>" +
          cursor.value.fecha + "</td><td>" +
          "<button class=\"btn btn-primary\" onclick=\"update(" + cursor.key + ")\">Editar</button></td><td><button class=\"btn btn-danger\" onclick=\"del(" + cursor.key + ")\">Eliminar</button></td></tr>";

        //preparo un contador
        count++;

        //creo un elemto tr y le agrego la fila
        var btn = document.createElement("TR");
        btn.innerHTML = fila;

        //Añado el tr a la tabla;  
        document.getElementById("tablita").appendChild(btn);

        //PAso al sigueite dato del cursor
        cursor['continue']();

        //saco el contador por el log
      } else console.log('Total entries = ' + count);
    };
  }
}





function del(id) {
  confirm("¿Esta usted seguro?");

  // Abrimos nuestra base de datos:
  var dbOpenRequest = indexedDB.open("Clientes");

  var transaction;
  dbOpenRequest.onsuccess = function (event) {


    // almacenar el resultado de la apertura de la base de datos en la variable thisdb. Esto es bastante usado más abajo:
    var thisDB = dbOpenRequest.result;

    // abrir una transacción lectura/escritura, lista para añadir los datos:
    transaction = thisDB.transaction(["Clientes"], "readwrite");

    // después deberías continuar y hacerle algo a esta base de datos a través del almacén de objetos:
    var objectStore = transaction.objectStore("Clientes");

    objectStore.delete(id);
    /*    
        //request cursor on the object store
        var request = objectStore.openCursor();
        var count = 0;

        request.onsuccess = function (event) {
          //El cursor contiene los datos funciona como un 
          //fucle for each;
          var cursor = event.target.result;
          if (cursor) {
            
            
            cursor['continue']();

            //saco el contador por el log
          } else console.log('Total entries = ' + count);
        };
      };
      
      */
    location.href = "listaUsuarios.html";

  }
}



function update(id) {
  alert(id)
  //Creo una variable ara crear la url que sera enviada
  var url = "";

  // Abrimos nuestra base de datos:
  var dbOpenRequest = indexedDB.open("Clientes");

  var transaction;
  dbOpenRequest.onsuccess = function (event) {


    // almacenar el resultado de la apertura de la base de datos en la variable thisdb. Esto es bastante usado más abajo:
    var thisDB = dbOpenRequest.result;

    // abrir una transacción lectura/escritura, lista para añadir los datos:
    transaction = thisDB.transaction(["Clientes"], "readwrite");

    // después deberías continuar y hacerle algo a esta base de datos a través del almacén de objetos:
    var objectStore = transaction.objectStore("Clientes");


    //request cursor on the object store
    var request = objectStore.openCursor();


    var count = 0;
    request.onsuccess = function (event) {
      //El cursor contiene los datos funciona como un 
      //fucle for each;
      var cursor = event.target.result;
      if (cursor) {

        //Saco una prueba por el log
        console.log('id = ' + cursor.key + ' is ' + cursor.value.nombre + cursor.value.apellido);

        //preparo un contador
        count++;
        if (cursor.key == parseInt(id)) {
          //Creo una url con los valores del usuario selecionado
          url = "login.html?nombre=" + cursor.value.nombre +
            "&apellido=" + cursor.value.apellido +
            "&correo=" + cursor.value.correo +
            "&fecha=" + cursor.value.fecha +
            "&id=" + cursor.key;

          location.href = url;
          document.getElementById("anadir").removeChild();
        }

        //PAso al sigueite dato del cursor
        cursor['continue']();

        //saco el contador por el log
      } else console.log('Total entries = ' + count);
    };
  }
  document.cookie = "username=editarCliente; expires=Thu, 17 Dec 2020 12:00:00 UTC; path=/";
}


function mostrarDatos() {

  var x = location.search;
  var params = new URLSearchParams(x.slice(1));

  document.getElementById("nombre").value = params.get("nombre");

  document.getElementById("apellido").value = params.get("apellido");

  document.getElementById("correo").value = params.get("correo");

  document.getElementById("fecha").value = params.get("fecha");

  document.getElementById("id").value =
    params.get("id");

  var dbOpenRequest = indexedDB.open("Clientes");

  var transaction;
  dbOpenRequest.onsuccess = function (event) {


    // almacenar el resultado de la apertura de la base de datos en la variable thisdb. Esto es bastante usado más abajo:
    var thisDB = dbOpenRequest.result;

    // abrir una transacción lectura/escritura, lista para añadir los datos:
    transaction = thisDB.transaction(["Clientes"], "readwrite");

    // después deberías continuar y hacerle algo a esta base de datos a través del almacén de objetos:
    var objectStore = transaction.objectStore("Clientes");

    objectStore.delete(parseInt(params.get("id")));
  }

}


/*     FUNCIONAMIENTO     */

function botonCrearCliente() {
  document.cookie = "username=crearCliente; expires=Thu, 17 Dec 2020 12:00:00 UTC; path=/"

  location.href = "login.html";
};



function controlBotones() {
  var cook = document.cookie;
  var array = cook.split("=");


  if (array[1] == "crearCliente") {
    document.getElementById("modificar").style.display = "none";
    document.cookie = "username=crearCliente; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  }

  if (array[1] == "editarCliente") {
    document.getElementById("anadir").style.display = "none";
    document.cookie = "username=crearCliente; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.getElementById("titulo").innerHTML = "MODIFICAR CLIENTE ";
  }
};





function agregar() {
  var control = 0;

  alert(document.getElementById("nombre").value.length);

  if (document.getElementById("nombre").value.length < 1) {

    document.getElementById("nom").innerHTML = "El nombre del cliente es obligatorio"
    control = control + 1;

    document.getElementById("nom").style.color = "red";

    document.getElementById("nombre").style.backgroundColor = "pink";


  } else {
    document.getElementById("nom").innerHTML = ""
  }




  if (document.getElementById("apellido").value.length < 1) {

    document.getElementById("ape").innerHTML = "El apellido del cliente es obligatorio"
    control = control + 1;

    document.getElementById("ape").style.color = "red";

    document.getElementById("apellido").style.backgroundColor = "pink";


  } else {
    document.getElementById("ape").innerHTML = ""
  }




  if (document.getElementById("correo").value.length < 1) {

    document.getElementById("cor").innerHTML = "El correo del cliente es obligatorio"
    control = control + 1;

    document.getElementById("cor").style.color = "red";

    document.getElementById("correo").style.backgroundColor = "pink";


  } else {
    document.getElementById("cor").innerHTML = ""
  }





  if (document.getElementById("fecha").value.length < 3) {

    document.getElementById("fec").innerHTML = "La fecha del cliente es obligatorio";

    document.getElementById("fec").style.color = "red";
    document.getElementById("fecha").style.backgroundColor = "pink";

    control = control + 1;


  } else {
    document.getElementById("fec").innerHTML = ""
  }







  if (control == 0) {
    document.getElementById("form").submit();
  }
}




function modificar() {
  document.getElementById("form").submit();

}


function calcularEdad(){
document.getElementsByTagName("tr").addEventListener("hover", function(){
  alert()
})
}