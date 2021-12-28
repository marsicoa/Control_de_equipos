const datos = localStorage.getItem('entrega')
const entrega = JSON.parse(datos)

$('#tablaComprobante').append(`<tr><td><a onclick="ventana()"><img class="td-img" src="${entrega.equipo}"></a></td>
<td>${entrega.descripcion}</td>
<td>${entrega.responsable}</td>
<td>${entrega.fechaYHora}</td></tr>`)

$('#foto-dispositivo').html(`<img src='${entrega.equipo}' class='img'>`)

window.print()