import fs from 'fs'
const ARCHIVO = './lista.json'

if (!fs.existsSync(ARCHIVO)) {
    fs.writeFileSync(ARCHIVO, '[]')
}

function cargar() {
    return JSON.parse(fs.readFileSync(ARCHIVO))
}

function guardar(data) {
    fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let lista = cargar()
    let grupo = m.chat
    let args = text.split(' ')

    if (command === 'lista') {

        // VER
        if (text === 'ver') {
            let datos = lista.filter(l => l.grupo === grupo)
            if (datos.length === 0) {
                return m.reply('No hay sorteos registrados')
            }

            let msg = 'LISTA DE SORTEOS\n'
            msg += '--------------------\n\n'

            datos.forEach((l, i) => {
                let tipo = l.extra? 'EXTRA' : 'NORMAL'
                msg += (i+1) + '. ' + l.nombre + ' - ' + l.numero + '\n'
                msg += 'Premio: ' + l.premio + '\n'
                msg += 'Dia: ' + l.dia + '\n'
                msg += 'Fecha: ' + l.fecha + '\n'
                msg += 'Tipo: ' + tipo + '\n\n'
            })
            return m.reply(msg)
        }

        // BORRAR
        if (args[0] === 'del') {
            let num = parseInt(args[1]) - 1
            let datos = lista.filter(l => l.grupo === grupo)
            if (datos[num]) {
                lista = lista.filter(l => l.id!== datos[num].id)
                guardar(lista)
                return m.reply('Borrado el numero ' + (num+1))
            } else {
                return m.reply('No existe ese numero')
            }
        }

        // AGREGAR
        if (args.length < 3) {
            return m.reply('Uso:\n' + usedPrefix + 'lista Nombre Numero Premio\n' + usedPrefix + 'lista Nombre Numero Premio extra\n' + usedPrefix + 'lista ver\n' + usedPrefix + 'lista del 1')
        }

        let esExtra = args[args.length-1].toLowerCase() === 'extra'
        if (esExtra) args.pop()

        let nombre = args[0]
        let numero = args[1]
        let premio = args.slice(2).join(' ')

        let fecha = new Date().toLocaleString('es-PE', {timeZone: 'America/Lima'})
        let dia = new Date().toLocaleString('es-PE', {timeZone: 'America/Lima', weekday: 'long'})

        lista.push({
            id: Date.now(),
            grupo: grupo,
            dia: dia,
            nombre: nombre,
            numero: numero,
            premio: premio,
            fecha: fecha,
            extra: esExtra
        })

        guardar(lista)

        let tipo = esExtra? 'SORTEO EXTRA' : 'SORTEO NORMAL'
        m.reply(tipo + '\n\nNombre: ' + nombre + '\nNumero: ' + numero + '\nPremio: ' + premio + '\nDia: ' + dia + '\nFecha: ' + fecha)
    }
}

handler.command = ['lista']
handler.help = ['lista']
handler.tags = ['sorteos']
handler.group = true

export default handler