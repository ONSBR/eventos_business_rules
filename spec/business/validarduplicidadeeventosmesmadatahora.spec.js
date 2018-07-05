const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir eventos na mesma data hora com exceção do EOC:', () => {

        let dataJaneiro = new Date(2018, 0 , 1);
        let dataFevereiro = new Date(2018, 1 , 1);
        let dataMarco = new Date(2018, 2 , 1);

        let eventosComUmEOC = [{ idEstadoOperativo: 'EOC', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LIG', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LCS', dataVerificada: dataFevereiro },
            { idEstadoOperativo: 'LCC', dataVerificada: dataMarco}];
        eventoMudancaEstadoOperativoBusiness.verificarEventosNaMesmaDataHora(eventosComUmEOC);

        let eventosComEventosSimultaneos = [{ idEstadoOperativo: 'EOC', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LIG', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LCS', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LCC', dataVerificada: dataJaneiro }];

        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarEventosNaMesmaDataHora(eventosComEventosSimultaneos);
            }
        ).toThrowError('Não podem existir dois ou mais eventos com a mesma Data/Hora Verificada e mesmo Estágio de Operação' +
            ' (comissionamento ou operação comercial), exceto no caso de evento de Mudança de Estado Operativo com' +
            ' Estado Operativo “EOC”.');

    });

});



