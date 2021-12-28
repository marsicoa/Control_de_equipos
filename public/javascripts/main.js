//------>
class Dispositivo{
    constructor(codigo, descripcion){
         this.id          = 0
        ,this.codigo      = codigo
        ,this.descripcion = descripcion
        ,this.img         = `../images/${descripcion}.jpg`
    }

    guardar = () => {
         const recuperarDevices = async () => {
            try { 
                const  res  = await fetch(`http://equipos.sumed.local.com:5984/devices/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
                const  data = await res.json()
                return data
            }
            catch (err) {
                console.log(err)
            }
         }

         const guardarDevices = async () => {
            try {
                const res = await fetch(`http://equipos.sumed.local.com:5984/devices/${this.codigo}`, {method : 'PUT'
                                                                                        ,headers: {Authorization : 'Basic usr:pwd_(BASE64ENCODE)'}
                                                                                        ,body   : JSON.stringify({
                                                                                                 id         : this.id
                                                                                                ,codigo     : this.codigo
                                                                                                ,descripcion: this.descripcion
                                                                                                ,img        : this.img})})
                const success = new Success()
                success.dispositivoCreado()              
                return res
            }
            catch (err){
                console.log(err)
            }       
         }

         recuperarDevices().then((data)=>{
             if(data.rows.length === 0){
                 this.id = 1
                 
                 guardarDevices().then(res => console.log(res.statusText))

                 $('#tablaInventario').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${this.img}"></a></td>
                 <td>${this.codigo}</td>
                 <td>${this.descripcion}</td><td><i class="material-icons" onclick="eliminar(${this.id})">delete</i></td></tr>`)

                 $('#foto-dispositivo').html(`<img src='${this.img}' class='img'>`)
                }else{
                    let dispositivos = []
                    //console.log(data)
                    data.rows.forEach(element => {
                        dispositivos.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: this.img})
                    })

                    let buscar = dispositivos.find((el) => {return el.codigo === this.codigo})
                    if (buscar === undefined){
                        const success = new Success()
                        success.dispositivoCreado()

                        this.id = dispositivos.length + 1

                        dispositivos.push({id: this.id, codigo: this.codigo, descripcion: this.descripcion, img: this.img})

                        guardarDevices().then(res => console.log(res.statusText))
                        //console.log(dispositivos)

                        dispositivos.forEach((el) => {
                            $('#tablaInventario').append(`<tr id="${el.id}"><td><a onclick="ventana()"><img class="td-img" src="${el.img}"></a></td>
                                         <td>${el.codigo}</td>
                                         <td>${el.descripcion}</td>
                                         <td><i class="material-icons" onclick="eliminar(${el.id})">delete</i></td></tr>`)
                            $('#foto-dispositivo').html(`<img src='${el.img}' class='img'>`)
                        })
                        //console.log(dispositivos)    
                    }else{
                        const error = new Error()
                        error.duplicidad(this.codigo)

                        dispositivos.forEach((el) => {
                            $('#tablaInventario').append(`<tr id="${el.id}"><td><a onclick="ventana()"><img class="td-img" src="${el.img}"></a></td>
                                         <td>${el.codigo}</td>
                                         <td>${el.descripcion}</td>
                                         <td><i class="material-icons" onclick="eliminar(${el.id})">delete</i></td></tr>`)
                            $('#foto-dispositivo').html(`<img src='${el.img}' class='img'>`)
                        })
                    }
                }   
            })
        }   
}

class Entrega{
    constructor(id, codigo, descripcion, responsable, fh){
         this.id          = id
        ,this.codigo      = codigo
        ,this.descripcion = descripcion
        ,this.img         = `../images/${descripcion}.jpg`
        ,this.responsable = responsable
        ,this.fechaYHora  = fh
    }

    guardar(){
        
        let entregas = []
        
        const recuperarDeliveries = async () => {
            try { 
                const  res  = await fetch(`http://equipos.sumed.local.com:5984/deliveries/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
                const  data = await res.json()
                return data
            }
            catch (err) {
                console.log(err)
            }
        }

        const guardarDeliveries = async () => {
            try {
                //console.log(entregas.length)
                const res = await fetch(`http://equipos.sumed.local.com:5984/deliveries/${this.codigo}`, {method : 'PUT'
                                                                                        ,headers: {Authorization : 'Basic usr:pwd_(BASE64ENCODE)'}
                                                                                        ,body   : JSON.stringify({
                                                                                                 id         : ++entregas.length//this.id
                                                                                                ,codigo     : this.codigo
                                                                                                ,descripcion: this.descripcion
                                                                                                ,responsable: this.responsable
                                                                                                ,fechaYHora : this.fechaYHora
                                                                                                ,img        : this.img
                                                                                                ,contador   : entregas.length})})
                const success = new Success()
                success.dispositivoEntregado(this.responsable)    
                localStorage.setItem('entrega', JSON.stringify({equipo: this.img, descripcion: this.descripcion, responsable: this.responsable, fechaYHora: this.fechaYHora}))
                
                const emailBody = `Equipo: ${this.descripcion} <br>
                                   Codigo: ${this.codigo}      <br>
                                   Responsable: ${this.responsable} <br>
                                   Fecha y hora: ${this.fechaYHora}`
                //habilitar envio de mail
                Email.send({
                    Host : "smtp.example.com",
                    Username : "smtp_email@example.com",
                    Password : "EMAIL_PASSWORD",
                    To : 'destinatario@example.com',
                    From : "remitente@example.com",
                    Subject : `[Nuevo] - Reserva de equipos No. ${entregas.length} - ${this.responsable}`,
                    Body : emailBody
                }).then(
                  message => console.log(message)
                );
                
                $('#tablaHistorial').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${this.img}"></a></td>
                <td>${this.descripcion}</td>
                <td>${this.responsable}</td>
                <td>${this.fechaYHora}</td></tr>`)
                $('#foto-dispositivo').html(`<img src='${this.img}' class='img'>`)

                return res
            }
            catch (err){
                console.log(err)
            }
        }

        const guardarDeliveries_cont = async (data) => {
            try {
                const res = await fetch(`http://equipos.sumed.local.com:5984/deliveries/d-${this.codigo}-${data._rev}-${++entregas.length}`, {method : 'PUT'
                                                                                        ,headers: {Authorization : 'Basic usr:pwd_(BASE64ENCODE)'}
                                                                                        ,body   : JSON.stringify({
                                                                                                 id         : ++entregas.length//this.id
                                                                                                ,codigo     : this.codigo
                                                                                                ,descripcion: this.descripcion
                                                                                                ,responsable: this.responsable
                                                                                                ,fechaYHora : this.fechaYHora
                                                                                                ,img        : this.img
                                                                                                ,contador   : entregas.length})})
                const success = new Success()
                success.dispositivoEntregado(this.responsable)    
                localStorage.setItem('entrega', JSON.stringify({equipo: this.img, descripcion: this.descripcion, responsable: this.responsable, fechaYHora: this.fechaYHora}))
                
                const emailBody = `Equipo: ${this.descripcion} <br>
                                   Codigo: ${this.codigo}      <br>
                                   Responsable: ${this.responsable} <br>
                                   Fecha y hora: ${this.fechaYHora}`
                //let htmlObject = document.createElement('div')
                //habilitar envio de mail
                Email.send({
                    Host : "smtp.example.com",
                    Username : "smtp_email@example.com",
                    Password : "EMAIL_PASSWORD",
                    To : 'destinatario@example.com',
                    From : "remitente@example.com",
                    Subject : `[Nuevo] - Reserva de equipos No. ${entregas.length} - ${this.responsable}`,
                    Body : emailBody
                }).then(
                  message => console.log(message)
                );

                $('#tablaHistorial').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${this.img}"></a></td>
                <td>${this.descripcion}</td>
                <td>${this.responsable}</td>
                <td>${this.fechaYHora}</td></tr>`)
                $('#foto-dispositivo').html(`<img src='${this.img}' class='img'>`)
                
                return res
            }
            catch (err){
                console.log(err)
            }
        }

        const validar = async () => {
            let encontrado = entregas.find((el) => {return el.codigo === this.codigo})
            //console.log(encontrado)
            return encontrado
        }

        recuperarDeliveries().then((data) => {
            //console.log(data)
            data.rows.forEach((element) => {
                entregas.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: element.value.img, responsable: element.value.responsable, fechaYHora: element.value.fechaYHora, _rev: element.value._rev})
            })
            $('#tablaHistorial').empty()
            entregas.forEach((el) => {
                $('#tablaHistorial').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${el.img}"></a></td>
                             <td>${el.descripcion}</td>
                             <td>${el.responsable}</td>
                             <td>${el.fechaYHora}</td></tr>`)
                $('#foto-dispositivo').html(`<img src='${el.img}' class='img'>`)
            })

            validar().then((data) => {
                if (data === undefined){
                    guardarDeliveries().then(res => console.log(res.statusText))
                }else{
                    guardarDeliveries_cont(data).then(res => console.log(res.statusText))
                }
            })
        })        
    }
}
//<------

//------>
class Error{
    alta(cod, des){
         Swal.fire({icon : 'error',
                    title: 'Hay campos sin completar',
                    text : `Codigo     : ${cod} \n
                           Descripcion : ${des} \n`})        
    }
    duplicidad(cod){
        Swal.fire({icon : 'error',
                   title: 'Ya existe un dispositivo con este codigo',
                   text : `Codigo: ${cod}`})
    }
    noEncontrado(cod){
        Swal.fire({icon : 'error',
                   title: 'No se encontro el codigo del dispositivo que desea reservar',
                   text : `Codigo: ${cod}`})
    }
    entrega(cod, res){
        Swal.fire({icon : 'error',
                   title: 'Hay campos sin completar',
                   text : `Codigo     : ${cod} \n
                          Responsable : ${res} \n`})        
   }
   busquedaNoEncontrada(buscado){
    Swal.fire({icon : 'error',
               title: 'Algo salio mal :(',
               text : `No se encontraron reservas a nombre de ${buscado}`})
   }   
}

class Success{
    dispositivoCreado(){
        Swal.fire({icon : 'success',
                   title: 'Todo Correcto',
                   text : 'Su dispositivo fue agregado exitosamente :D'})
    }
    dispositivoEntregado(responsable){
        Swal.fire({icon : 'success',
                   title: 'Todo Correcto',
                   text : `Su dispositivo fue entregado a ${responsable}`})
    }
    dispositivoEliminado(id){
        Swal.fire({icon : 'success',
                   title: 'Todo Correcto',
                   text : `El dispositivo ${id} fue eliminado`})
    }
}


//------>
$('#in').click(() => {
    $('#icono-in').addClass("active glow")
    $('#icono-out').removeClass("active glow")
    $('#inventario').fadeIn(1000)
    $('#entregas').hide()
    $('#busqueda').hide()
})

$('#out').click(() => {
    $('#icono-out').addClass("active glow")
    $('#icono-in').removeClass("active glow")
    $('#entregas').fadeIn(1000)
    $('#inventario').hide()
    $('#busqueda').hide()
})
$('#print').click(() => {
    window.location.href = 'http://equipos.sumed.local.com/comprobante'
    $('#icono-print').addClass("active glow")
    $('#icono-reload').removeClass("active glow")
    $('#icono-in').removeClass("active glow")
    $('#icono-out').removeClass("active glow")
})
$('#reload').click(() => {
    location.reload()
    $('#icono-reload').addClass("active glow")
    $('#icono-in').removeClass("active glow")
    $('#icono-out').removeClass("active glow")
})
//<------

//------>
const initDevices = () => {
    let dispositivos = []
    const recuperarDevices = async () => {
        try { 
            const  res  = await fetch(`http://equipos.sumed.local.com:5984/devices/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
            const  data = await res.json()
            return data
        }
        catch (err) {
            console.log(err)
        }
    }
    recuperarDevices().then((data) => {
        //console.log(data)
        //console.log(data.rows[2])
        data.rows.forEach((element) => {
            dispositivos.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: `../images/${element.value.descripcion}.jpg`, _rev: element.value._rev})
        })
        //console.log(dispositivos)
        dispositivos.forEach((el) => {
            $('#tablaInventario').append(`<tr id="${el.id}"><td><a onclick="ventana()"><img class="td-img" src="${el.img}"></a></td>
                         <td>${el.codigo}</td>
                         <td>${el.descripcion}</td>
                         <td><i class="material-icons" onclick="eliminar(${el.id})">delete</i></td></tr>`)
            $('#foto-dispositivo').html(`<img src='${el.img}' class='img'>`)
        })
    })    
}
initDevices()

const initDeliveries = () => {
    let entregas = []
    const recuperarDeliveries = async () => {
        try { 
            const  res  = await fetch(`http://equipos.sumed.local.com:5984/deliveries/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
            const  data = await res.json()
            return data
        }
        catch (err) {
            console.log(err)
        }
    }
    recuperarDeliveries().then((data) => {
        //console.log(data)
        //console.log(data.rows) //a esto le faltan los responsables y fechas
        data.rows.forEach((element) => {
            element.key = entregas.length
            entregas.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: element.value.img, responsable: element.value.responsable, fechaYHora: element.value.fechaYHora, contador: entregas.length})
        })
        //console.log(entregas)
        //entregas.sort((a, b) => {return a - b})
        entregas.forEach((el) => {
            $('#tablaHistorial').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${el.img}"></a></td>
                         <td>${el.descripcion}</td>
                         <td>${el.responsable}</td>
                         <td>${el.fechaYHora}</td></tr>`)
            $('#foto-dispositivo').html(`<img src='${el.img}' class='img'>`)
        })
    })    
}
initDeliveries()
//<------

//<--------------Inventario---------------->

const capturarDatosDispositivo = () => {
    const codDis = $('#codigoDispositivo-check-in').val().toUpperCase().replace(' ','')
    const desDis = $('#descripcionDispositivo-check-in').val().toUpperCase().replace(' ','')

    if((codDis == 0 || !codDis) || (!desDis)){
        const error = new Error('error')
        error.alta(codDis, desDis)
    }else{
        const nuevoDispositivo = new Dispositivo(codDis, desDis)
        $('#tablaInventario').empty()
        nuevoDispositivo.guardar()
    }
}
$('#boton-nuevo-dispositivo').click((event) => {capturarDatosDispositivo(); event.preventDefault()})

//<--------------Inventario---------------->

//<--------------Entregas---------------->

const capturarDatosEntrega = () => {
    const codDis = $('#codigoDispositivo-check-out').val().toUpperCase().replace(' ','')
    const resDis = $('#responsableDispositivo-check-out').val().toLowerCase().replace(' ','')
    //console.log(`${!codDis} - ${!resDis}`)

    if(!codDis || !resDis){
        const error = new Error('error')
        error.entrega(codDis, resDis)       
    }else{
        let entregas = []
        const recuperarDeliveries = async () => {
        try { 
            const  res  = await fetch(`http://equipos.sumed.local.com:5984/devices/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
            const  data = await res.json()
            return data
        }
        catch (err) {
            console.log(err)
        }
        }
        recuperarDeliveries().then((data) => {
        data.rows.forEach((element) => {
            entregas.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: `../images/${element.value}.jpg`})
        })
        let encontrado = entregas.find((el) => {return el.codigo === codDis})
        if (encontrado === undefined){
            const error = new Error('error')
            error.noEncontrado(codDis)
        }else{
            let date = new Date()
            let day = date.toLocaleDateString()
            let time = date.toLocaleTimeString()
            let fechaHora = day + ' ' + time
            //console.log(fechaHora)
            const nuevaEntrega = new Entrega(encontrado.id, encontrado.codigo, encontrado.descripcion, resDis, fechaHora)
            $('#tablaHistorial').empty()
            nuevaEntrega.guardar()
        }
        })
    }
}
$('#boton-entregar-dispositivo').click((event) => {capturarDatosEntrega(); event.preventDefault()})

//<--------------Entregas---------------->

//<--------------Otras Funciones---------------->

let ventana = ((url) => {
    console.log(url)
    window.open(`http://equipos.sumed.local.com/${url}`,"","width:50% height:50%")
})

let eliminar = (x) => {

    let dispositivos = []
    const recuperarDevices = async () => {
        try { 
            const  res  = await fetch(`http://equipos.sumed.local.com:5984/devices/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
            const  data = await res.json()
            return data
        }
        catch (err) {
            console.log(err)
        }
    }
    recuperarDevices().then((data) => {
        data.rows.forEach((element) => {
            dispositivos.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: `../images/${element.value.descripcion}.jpg`, _rev: element.value._rev})
        })
    
    let buscar = dispositivos.find((el) => {return el.id == x})

    const eliminarDevices = async () => {
        try {
            const res = await fetch(`http://equipos.sumed.local.com:5984/devices/${buscar.codigo}?rev=${buscar._rev}`, {method : 'DELETE'
                                                                                    ,headers: {Authorization : 'Basic usr:pwd_(BASE64ENCODE)'}})
            const success = new Success()
            success.dispositivoEliminado(x)              
            return res
        }
        catch (err){
            console.log(err)
        }
    }
    eliminarDevices().then(res => console.log(res.statusText))
    $(`#${buscar.id}`).hide()
})}
const buscar = (buscado) => {
    $('#inventario').hide()
    $('#entregas').hide()
    $('#busqueda').fadeIn(1000)
    let entregas = []
    const recuperarDeliveries = async () => {   
        try { 
            const  res  = await fetch(`http://equipos.sumed.local.com:5984/deliveries/_design/docs/_view/records`, {method: 'GET', headers: {Authorization: 'Basic usr:pwd_(BASE64ENCODE)'}})
            const  data = await res.json()
            return data
        }
        catch (err) {
            console.log(err)
        }
    }
    recuperarDeliveries().then((data) => {
        //console.log(data)
        data.rows.forEach((element) => {
            entregas.push({id: element.key, codigo: element.id, descripcion: element.value.descripcion, img: element.value.img, responsable: element.value.responsable, fechaYHora: element.value.fechaYHora, _rev: element.value._rev})
        })
        const encontrado = entregas.filter((el) => {return el.responsable.includes(buscado)})
        //console.log(encontrado)
        if(encontrado.length == 0){
            const error = new Error('error')
            error.busquedaNoEncontrada(buscado)
            $('#busqueda').hide()
        }else{
            $('#tablaBusqueda').empty()
            encontrado.forEach((el) =>{
                $('#tablaBusqueda').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${el.img}"></a></td>
                        <td>${el.descripcion}</td>
                        <td>${el.responsable}</td>
                        <td>${el.fechaYHora}</td></tr>`)
                $('#foto-dispositivo').html(`<img src='${el.img}' class='img'>`)
            })           
        }
    })
}
$('#search').click((event) => {buscar(document.getElementById('searchterm').value.toLowerCase()); event.preventDefault()})

$('#btn-dw').click(()=>{
    $('#bdy').toggleClass('dark-white')
    $('#btn-dw').toggleClass('btn-dw')
})